/**
 * Cloudflare Pages Function · 网页抓取代理（Browser-Use 真实执行）
 * 仅允许 http(s) 公网 URL，带基础 SSRF 防护。
 */

const ALLOWED_ORIGINS = new Set([
  'https://resume-due.pages.dev',
  'https://sisioow.github.io',
  'http://localhost:5173',
  'http://localhost:8788',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:8788',
])

function corsHeaders(origin) {
  const allow =
    origin && (ALLOWED_ORIGINS.has(origin) || origin.endsWith('.pages.dev') || origin.includes('localhost'))
      ? origin
      : 'https://resume-due.pages.dev'
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
}

function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...corsHeaders(origin),
    },
  })
}

function isPrivateHost(hostname) {
  const h = String(hostname || '').toLowerCase()
  if (!h || h === 'localhost' || h.endsWith('.local') || h.endsWith('.internal')) return true
  if (h === '0.0.0.0' || h === '::1' || h === '[::1]') return true
  const m = h.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/)
  if (!m) return false
  const a = Number(m[1])
  const b = Number(m[2])
  if (a === 10 || a === 127 || a === 0) return true
  if (a === 169 && b === 254) return true
  if (a === 172 && b >= 16 && b <= 31) return true
  if (a === 192 && b === 168) return true
  if (a === 100 && b >= 64 && b <= 127) return true
  return false
}

function htmlToText(html) {
  return String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|h[1-6]|li|tr|section|article)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim()
}

function pickTitle(html, fallback) {
  const m = String(html || '').match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  if (!m) return fallback
  return htmlToText(m[1]).slice(0, 180) || fallback
}

export async function onRequestOptions(context) {
  const origin = context.request.headers.get('Origin') || ''
  return new Response(null, { status: 204, headers: corsHeaders(origin) })
}

export async function onRequestPost(context) {
  const origin = context.request.headers.get('Origin') || ''

  let body
  try {
    body = await context.request.json()
  } catch {
    return json({ error: '无效 JSON' }, 400, origin)
  }

  const rawUrl = String(body?.url || '').trim()
  if (!rawUrl) return json({ error: 'url 必填' }, 400, origin)

  let parsed
  try {
    parsed = new URL(rawUrl)
  } catch {
    return json({ error: 'URL 无效' }, 400, origin)
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return json({ error: '仅支持 http/https' }, 400, origin)
  }
  if (isPrivateHost(parsed.hostname)) {
    return json({ error: '禁止访问内网地址' }, 400, origin)
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 18000)

  try {
    // 优先用 Jina Reader 拿干净正文；失败则回退直连 HTML
    let title = parsed.hostname
    let text = ''
    let source = 'direct'

    try {
      const jina = await fetch(`https://r.jina.ai/${parsed.toString()}`, {
        method: 'GET',
        headers: {
          Accept: 'text/plain',
          'User-Agent': 'ResumeDemoBrowser/1.0',
        },
        signal: controller.signal,
      })
      if (jina.ok) {
        const md = await jina.text()
        if (md && md.length > 40) {
          text = md
          source = 'jina'
          const titleLine = md.split('\n').find((l) => l.startsWith('Title:'))
          if (titleLine) title = titleLine.replace(/^Title:\s*/i, '').trim() || title
        }
      }
    } catch {
      /* fallback below */
    }

    if (!text) {
      const res = await fetch(parsed.toString(), {
        method: 'GET',
        redirect: 'follow',
        headers: {
          Accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
          'User-Agent':
            'Mozilla/5.0 (compatible; ResumeDemoBrowser/1.0; +https://resume-due.pages.dev)',
        },
        signal: controller.signal,
      })
      const html = await res.text()
      if (!res.ok) {
        return json({ error: `抓取失败 HTTP ${res.status}`, detail: html.slice(0, 200) }, 502, origin)
      }
      title = pickTitle(html, parsed.hostname)
      text = htmlToText(html)
      source = 'direct'
    }

    const max = 14000
    const truncated = text.length > max
    return json(
      {
        url: parsed.toString(),
        title,
        text: text.slice(0, max),
        truncated,
        source,
        chars: Math.min(text.length, max),
      },
      200,
      origin,
    )
  } catch (err) {
    const msg = err?.name === 'AbortError' ? '抓取超时' : err?.message || '抓取失败'
    return json({ error: msg }, 502, origin)
  } finally {
    clearTimeout(timer)
  }
}

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

function looksLikeMissingWiki(html) {
  const s = String(html || '')
  return /noarticletext|mw-warning-with-logexcerpt|page does not exist|创建不存在|没有与该名称匹配的条目/i.test(s)
}

/** Wikipedia 官方 API：比直连 HTML 更稳，也能确认词条是否存在 */
async function fetchWikipedia(parsed, signal) {
  const host = parsed.hostname.toLowerCase()
  if (!host.endsWith('wikipedia.org')) return null

  const title = decodeURIComponent(parsed.pathname.replace(/^\/wiki\//, '').replace(/\/$/, ''))
  if (!title || title.includes(':')) return null

  const api = new URL(`https://${host}/w/api.php`)
  api.searchParams.set('action', 'query')
  api.searchParams.set('prop', 'extracts|info')
  api.searchParams.set('explaintext', '1')
  api.searchParams.set('exsectionformat', 'plain')
  api.searchParams.set('redirects', '1')
  api.searchParams.set('format', 'json')
  api.searchParams.set('origin', '*')
  api.searchParams.set('titles', title.replace(/_/g, ' '))

  const res = await fetch(api.toString(), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'User-Agent': 'ResumeDemoBrowser/1.0 (https://resume-due.pages.dev; portfolio-demo)',
    },
    signal,
  })
  if (!res.ok) return { ok: false, status: res.status, reason: `Wikipedia API HTTP ${res.status}` }

  const data = await res.json()
  const pages = data?.query?.pages || {}
  const page = Object.values(pages)[0]
  if (!page || page.missing != null || page.invalid != null) {
    // 尝试搜索相近词条
    const searchApi = new URL(`https://${host}/w/api.php`)
    searchApi.searchParams.set('action', 'opensearch')
    searchApi.searchParams.set('search', title.replace(/_/g, ' '))
    searchApi.searchParams.set('limit', '5')
    searchApi.searchParams.set('namespace', '0')
    searchApi.searchParams.set('format', 'json')
    searchApi.searchParams.set('origin', '*')
    let suggestions = []
    try {
      const sres = await fetch(searchApi.toString(), {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'ResumeDemoBrowser/1.0 (https://resume-due.pages.dev; portfolio-demo)',
        },
        signal,
      })
      if (sres.ok) {
        const sdata = await sres.json()
        suggestions = Array.isArray(sdata?.[1]) ? sdata[1] : []
      }
    } catch {
      /* ignore */
    }
    return {
      ok: false,
      status: 404,
      reason: '维基词条不存在',
      suggestions,
    }
  }

  const extract = String(page.extract || '').trim()
  if (!extract) {
    return { ok: false, status: 404, reason: '维基词条无正文', suggestions: [] }
  }

  const finalTitle = page.title || title
  const finalUrl = `https://${host}/wiki/${encodeURIComponent(finalTitle.replace(/ /g, '_'))}`
  return {
    ok: true,
    url: finalUrl,
    title: finalTitle,
    text: extract,
    source: 'wikipedia-api',
  }
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
  const timer = setTimeout(() => controller.abort(), 20000)

  try {
    let title = parsed.hostname
    let text = ''
    let source = 'direct'
    let finalUrl = parsed.toString()

    // 1) Wikipedia：走官方 API（能区分「词条不存在」）
    try {
      const wiki = await fetchWikipedia(parsed, controller.signal)
      if (wiki?.ok) {
        return json(
          {
            url: wiki.url,
            title: wiki.title,
            text: wiki.text.slice(0, 14000),
            truncated: wiki.text.length > 14000,
            source: wiki.source,
            chars: Math.min(wiki.text.length, 14000),
          },
          200,
          origin,
        )
      }
      if (wiki && wiki.ok === false && wiki.status === 404) {
        const hint =
          wiki.suggestions?.length > 0
            ? `；相近词条：${wiki.suggestions.slice(0, 3).join(' / ')}`
            : '。可改用已存在词条，例如 https://en.wikipedia.org/wiki/Artificial_intelligence'
        return json(
          {
            error: `目标页面不存在（HTTP 404）${hint}`,
            status: 404,
            suggestions: wiki.suggestions || [],
          },
          404,
          origin,
        )
      }
    } catch {
      /* continue */
    }

    // 2) Jina Reader
    try {
      const jina = await fetch(`https://r.jina.ai/${parsed.toString()}`, {
        method: 'GET',
        headers: {
          Accept: 'text/plain',
          'User-Agent': 'ResumeDemoBrowser/1.0 (https://resume-due.pages.dev)',
        },
        signal: controller.signal,
      })
      if (jina.ok) {
        const md = await jina.text()
        const missing =
          /returned error 404|page does not exist|redlink=1|没有与该名称匹配的条目/i.test(md)
        if (missing) {
          return json(
            {
              error:
                '目标页面不存在（HTTP 404）。请换一个有效 URL，或改用维基已有词条如 /wiki/Artificial_intelligence',
              status: 404,
            },
            404,
            origin,
          )
        }
        if (md && md.length > 80) {
          text = md
          source = 'jina'
          const titleLine = md.split('\n').find((l) => l.startsWith('Title:'))
          if (titleLine) title = titleLine.replace(/^Title:\s*/i, '').trim() || title
        }
      }
    } catch {
      /* fallback below */
    }

    // 3) 直连 HTML
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
      if (!res.ok || looksLikeMissingWiki(html)) {
        const code = res.status || 404
        return json(
          {
            error:
              code === 404
                ? '目标页面不存在（HTTP 404）。请确认 URL 拼写，或换一个可公开访问的页面。'
                : `抓取失败 HTTP ${code}`,
            status: code,
            detail: html.slice(0, 200),
          },
          code === 404 ? 404 : 502,
          origin,
        )
      }
      title = pickTitle(html, parsed.hostname)
      text = htmlToText(html)
      source = 'direct'
      finalUrl = res.url || finalUrl
    }

    if (!text || text.length < 20) {
      return json({ error: '页面正文为空，无法抽取' }, 502, origin)
    }

    const max = 14000
    const truncated = text.length > max
    return json(
      {
        url: finalUrl,
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

/**
 * Cloudflare Pages Function · DeepSeek 代理
 * 秘钥仅存于环境变量 DEEPSEEK_API_KEY，切勿写入前端。
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

export async function onRequestOptions(context) {
  const origin = context.request.headers.get('Origin') || ''
  return new Response(null, { status: 204, headers: corsHeaders(origin) })
}

export async function onRequestPost(context) {
  const origin = context.request.headers.get('Origin') || ''
  const apiKey = context.env.DEEPSEEK_API_KEY
  const model = context.env.DEEPSEEK_MODEL || 'deepseek-v4-pro'

  if (!apiKey) {
    return json({ error: '服务未配置 DEEPSEEK_API_KEY' }, 503, origin)
  }

  let body
  try {
    body = await context.request.json()
  } catch {
    return json({ error: '无效 JSON' }, 400, origin)
  }

  const messages = Array.isArray(body?.messages) ? body.messages : null
  if (!messages?.length) {
    return json({ error: 'messages 必填' }, 400, origin)
  }
  if (messages.length > 24) {
    return json({ error: 'messages 过多' }, 400, origin)
  }

  const maxTokens = Math.min(Number(body.max_tokens) || 2048, 4096)
  const temperature = typeof body.temperature === 'number' ? body.temperature : 0.4

  const payload = {
    model,
    messages: messages.map((m) => ({
      role: m.role === 'system' || m.role === 'assistant' ? m.role : 'user',
      content: String(m.content ?? '').slice(0, 24000),
    })),
    max_tokens: maxTokens,
    temperature,
    stream: false,
    thinking: { type: 'disabled' },
  }

  try {
    const upstream = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    })

    const raw = await upstream.text()
    let data
    try {
      data = JSON.parse(raw)
    } catch {
      return json({ error: '上游返回非 JSON', detail: raw.slice(0, 300) }, 502, origin)
    }

    if (!upstream.ok) {
      return json(
        {
          error: data?.error?.message || `DeepSeek HTTP ${upstream.status}`,
          detail: data,
        },
        upstream.status,
        origin,
      )
    }

    const content = data?.choices?.[0]?.message?.content ?? ''
    return json(
      {
        content,
        model: data.model || model,
        usage: data.usage || null,
      },
      200,
      origin,
    )
  } catch (err) {
    return json({ error: err?.message || '代理请求失败' }, 502, origin)
  }
}

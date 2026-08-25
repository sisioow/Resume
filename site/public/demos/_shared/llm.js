/**
 * 演示页共用：调用 Cloudflare Pages 上的 DeepSeek 代理。
 * 秘钥绝不放在前端。
 */
;(function (global) {
  const DEFAULT_CF = 'https://resume-due.pages.dev'

  function apiBase() {
    const { protocol, hostname } = location
    if (hostname === 'localhost' || hostname === '127.0.0.1') return ''
    if (hostname.endsWith('.pages.dev')) return ''
    // GitHub Pages 等静态托管：走国内镜像上的 Function
    return DEFAULT_CF
  }

  async function chat(messages, options = {}) {
    const url = `${apiBase()}/api/chat`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        max_tokens: options.max_tokens ?? 2048,
        temperature: options.temperature ?? 0.4,
      }),
    })

    let data
    try {
      data = await res.json()
    } catch {
      throw new Error(`接口异常 HTTP ${res.status}`)
    }

    if (!res.ok) {
      throw new Error(data?.error || `请求失败 HTTP ${res.status}`)
    }
    if (!data?.content) {
      throw new Error('模型返回为空')
    }
    return data
  }

  /** 要求模型只返回 JSON，并尽量解析 */
  async function chatJson(messages, options = {}) {
    const systemExtra =
      '你必须只输出合法 JSON 对象，不要 Markdown 代码围栏，不要解释文字。'
    const merged = [...messages]
    if (merged[0]?.role === 'system') {
      merged[0] = { ...merged[0], content: `${merged[0].content}\n${systemExtra}` }
    } else {
      merged.unshift({ role: 'system', content: systemExtra })
    }

    const { content, model, usage } = await chat(merged, options)
    const text = String(content)
      .trim()
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
    const start = text.indexOf('{')
    const end = text.lastIndexOf('}')
    if (start < 0 || end <= start) {
      throw new Error('无法从模型输出解析 JSON')
    }
    try {
      return { data: JSON.parse(text.slice(start, end + 1)), model, usage, raw: content }
    } catch (e) {
      throw new Error(`JSON 解析失败：${e.message}`)
    }
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
  }

  global.DemoLLM = { chat, chatJson, apiBase, escapeHtml }
})(window)

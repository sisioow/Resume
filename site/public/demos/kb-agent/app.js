const corpora = {
  product: {
    label: '产品手册客服',
    presets: [
      'Agent 工作流失败重试次数上限是多少？如何配置？',
      'MCP 工具调用超时默认值是多少？',
      '是否支持 Human-in-the-loop 审批节点？',
    ],
    chunks: [
      {
        id: 'P-12',
        title: '工作流 · 失败重试策略',
        text: '每个 Tool 节点默认最多重试 3 次；可在节点高级设置将 max_retries 调整为 0–8。超过上限后进入失败分支或人工接管。',
        base: 0.91,
      },
      {
        id: 'P-18',
        title: '运行时 · 预算熔断',
        text: '单次会话默认 token 预算 128k，工具调用预算 24 次。触发熔断会写入 Trace，并返回可恢复错误码 AGENT_BUDGET_EXCEEDED。',
        base: 0.74,
      },
      {
        id: 'P-07',
        title: 'MCP · 超时与并发',
        text: 'MCP 工具默认超时 20s；同会话并发调用上限 4。建议对写操作工具单独降低超时并开启确认。',
        base: 0.69,
      },
      {
        id: 'P-21',
        title: '编排 · HITL 节点',
        text: '支持在关键步骤插入 Human-in-the-loop：Agent 暂停等待审批，超时未处理则按策略自动拒绝或回退。',
        base: 0.66,
      },
      {
        id: 'P-03',
        title: '部署 · 环境变量',
        text: '通过 AGENT_MAX_RETRIES 可设置全局默认重试次数，节点级配置优先生效。',
        base: 0.62,
      },
    ],
  },
  support: {
    label: '售后政策客服',
    presets: [
      '企业版 SLA 响应时效是多久？',
      '知识库文档上传格式有哪些限制？',
      '私有化部署是否包含审计日志？',
    ],
    chunks: [
      {
        id: 'S-02',
        title: 'SLA · 企业版响应',
        text: '企业版严重故障 15 分钟内响应，4 小时内给出缓解方案；一般问题 1 个工作日内响应。',
        base: 0.9,
      },
      {
        id: 'S-09',
        title: '知识库 · 上传规范',
        text: '支持 PDF / Docx / Markdown / HTML。单文件 ≤ 50MB，单知识库 ≤ 10万切片。扫描件 PDF 需开启 OCR。',
        base: 0.86,
      },
      {
        id: 'S-14',
        title: '私有化 · 合规能力',
        text: '私有化套餐默认包含操作审计日志、角色权限与数据出境开关；日志保留默认 180 天可配置。',
        base: 0.8,
      },
      {
        id: 'S-05',
        title: '退款与续费',
        text: '年付企业合同支持按条款退订；已消耗的模型调用费用不予退还。',
        base: 0.55,
      },
      {
        id: 'S-11',
        title: '培训与值班',
        text: '企业版含 2 次上线陪跑与值班手册模板，可另购 7×24 值班包。',
        base: 0.5,
      },
    ],
  },
}

const $ = (s) => document.querySelector(s)
const questionEl = $('#question')
const chunksEl = $('#chunks')
const answerEl = $('#answer')
const citesEl = $('#cites')
const traceEl = $('#trace')
const askBtn = $('#ask')
const presetsEl = $('#presets')
const threadEl = $('#thread')
const composer = $('#composer')

let kb = 'product'
let presetIndex = 0
let running = false

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function trace(msg) {
  const li = document.createElement('li')
  li.textContent = msg
  traceEl.prepend(li)
}

function addBubble(role, html) {
  const div = document.createElement('div')
  div.className = `bubble ${role}`
  div.innerHTML = `<p>${html}</p>`
  threadEl.appendChild(div)
  threadEl.scrollTop = threadEl.scrollHeight
  return div
}

function renderPresets() {
  const list = corpora[kb].presets
  presetsEl.innerHTML = list
    .map((q, i) => `<button type="button" data-i="${i}">${q}</button>`)
    .join('')
  questionEl.value = list[presetIndex] || list[0]
  $('#kb-title').textContent = corpora[kb].label
}

function rankChunks(query) {
  const q = query.toLowerCase()
  return corpora[kb].chunks
    .map((c) => {
      let boost = 0
      for (const w of q.split(/[^a-z0-9\u4e00-\u9fff]+/).filter(Boolean)) {
        if (c.title.includes(w) || c.text.includes(w)) boost += 0.04
      }
      return { ...c, score: Math.min(0.99, c.base + boost) }
    })
    .sort((a, b) => b.score - a.score)
}

function formatAnswerHtml(text, citeIds) {
  let html = DemoLLM.escapeHtml(text)
  for (const id of citeIds) {
    html = html.replaceAll(`[${id}]`, `<span class="ref">[${id}]</span>`)
  }
  return html.replace(/\n/g, '<br />')
}

async function ask(e) {
  if (e) e.preventDefault()
  if (running) return
  const q = questionEl.value.trim()
  if (!q) return

  running = true
  askBtn.disabled = true
  chunksEl.innerHTML = ''
  citesEl.innerHTML = ''
  traceEl.innerHTML = ''
  answerEl.innerHTML = ''
  $('#ans-badge').textContent = '检索中'
  $('#ans-badge').classList.remove('ok')
  $('#retrieve-state').textContent = 'Retrieve'
  $('#m-hit').textContent = '—'
  $('#m-faith').textContent = '—'
  $('#m-lat').textContent = '—'
  const t0 = Date.now()

  addBubble('user', DemoLLM.escapeHtml(q))
  const typing = addBubble('bot', '正在检索知识库并调用 deepseek-v4-pro…')

  try {
    trace(`query: ${q.slice(0, 48)}${q.length > 48 ? '…' : ''}`)
    await sleep(200)
    $('#retrieve-state').textContent = 'Hybrid Recall'
    const ranked = rankChunks(q)
    const top = ranked.slice(0, 3)

    for (let i = 0; i < ranked.length; i++) {
      await sleep(120)
      const c = ranked[i]
      const li = document.createElement('li')
      if (i < 3) li.classList.add('top')
      li.innerHTML = `
        <div class="row">
          <strong>${c.id} · ${DemoLLM.escapeHtml(c.title)}</strong>
          <span class="score">${c.score.toFixed(2)}</span>
        </div>
        <p>${DemoLLM.escapeHtml(c.text)}</p>
        ${i < 3 ? '<span class="tag">Rerank Top3</span>' : ''}
      `
      chunksEl.appendChild(li)
      trace(`hit ${c.id} score=${c.score.toFixed(2)}`)
    }

    $('#retrieve-state').textContent = 'deepseek-v4-pro'
    trace('grounded generation via DeepSeek')

    const { data, model } = await DemoLLM.chatJson(
      [
        {
          role: 'system',
          content:
            '你是企业知识库客服。只能依据给定切片回答，禁止编造切片外事实。输出 JSON：{"answer":"中文答复，关键处用[切片ID]引用","cites":["P-12"],"faith":"0.00-1.00","hit_at_3":"0.00-1.00"}。若证据不足，明确说明并给 cites=[]。',
        },
        {
          role: 'user',
          content: `知识库：${corpora[kb].label}\n问题：${q}\n切片：${JSON.stringify(top)}`,
        },
      ],
      { max_tokens: 900, temperature: 0.2 },
    )

    const cites = Array.isArray(data.cites) ? data.cites : top.map((c) => c.id)
    const answerHtml = formatAnswerHtml(data.answer || '（空答复）', cites)
    typing.innerHTML = `<p>${answerHtml}</p>`
    answerEl.innerHTML = `<p>${answerHtml}</p>`
    citesEl.innerHTML = cites
      .map((id) => {
        const chunk = corpora[kb].chunks.find((c) => c.id === id) || top.find((c) => c.id === id)
        return `<div class="cite-item"><b>[${DemoLLM.escapeHtml(id)}]</b> ${DemoLLM.escapeHtml(chunk?.title || '')} — ${DemoLLM.escapeHtml((chunk?.text || '').slice(0, 42))}…</div>`
      })
      .join('')

    $('#ans-badge').textContent = '已引用'
    $('#ans-badge').classList.add('ok')
    $('#m-hit').textContent = data.hit_at_3 != null ? String(data.hit_at_3) : '1.00'
    $('#m-faith').textContent = data.faith != null ? String(data.faith) : '—'
    $('#m-lat').textContent = `${((Date.now() - t0) / 1000).toFixed(1)}s`
    $('#retrieve-state').textContent = '完成'
    trace(`done · ${model || 'deepseek-v4-pro'}`)
  } catch (err) {
    typing.innerHTML = `<p>调用失败：${DemoLLM.escapeHtml(err.message || String(err))}</p>`
    $('#ans-badge').textContent = '失败'
    $('#retrieve-state').textContent = '错误'
    trace(`error: ${err.message || err}`)
  }

  threadEl.scrollTop = threadEl.scrollHeight
  running = false
  askBtn.disabled = false
  questionEl.value = ''
}

function clearAll() {
  if (running) return
  threadEl.innerHTML =
    '<div class="bubble bot welcome"><p>你好，我是企业知识库客服 Agent（deepseek-v4-pro）。选左侧知识库后提问，我会先检索再生成带引用答复。</p></div>'
  chunksEl.innerHTML = '<li class="empty">提问后这里显示命中切片与分数</li>'
  citesEl.innerHTML = ''
  traceEl.innerHTML = ''
  answerEl.innerHTML = ''
  $('#ans-badge').textContent = '空闲'
  $('#ans-badge').classList.remove('ok')
  $('#retrieve-state').textContent = '待机'
  $('#m-hit').textContent = '—'
  $('#m-faith').textContent = '—'
  $('#m-lat').textContent = '—'
  renderPresets()
}

$('#kb-switch').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-kb]')
  if (!btn) return
  kb = btn.dataset.kb
  presetIndex = 0
  document.querySelectorAll('#kb-switch button').forEach((b) => b.classList.toggle('is-active', b === btn))
  renderPresets()
  clearAll()
})

presetsEl.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-i]')
  if (!btn) return
  presetIndex = Number(btn.dataset.i)
  questionEl.value = corpora[kb].presets[presetIndex]
})

composer.addEventListener('submit', ask)
$('#clear').addEventListener('click', clearAll)
questionEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    ask()
  }
})
renderPresets()

const corpora = {
  product: {
    label: '产品手册',
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
    answers: {
      0: {
        html: '根据产品手册，<b>单个 Tool 节点默认最多重试 3 次</b>，可在节点高级设置把 <code>max_retries</code> 配到 0–8；也可用环境变量 <code>AGENT_MAX_RETRIES</code> 设全局默认，节点配置优先。<span class="ref">[P-12]</span><span class="ref">[P-03]</span> 超出上限后会走失败分支或转人工。<span class="ref">[P-12]</span>',
        cites: ['P-12', 'P-03'],
        hit: '1.00',
        faith: '0.93',
      },
      1: {
        html: 'MCP 工具调用的<strong>默认超时是 20 秒</strong>，同会话并发上限为 4；写操作建议单独收紧超时并开启确认。<span class="ref">[P-07]</span>',
        cites: ['P-07'],
        hit: '1.00',
        faith: '0.95',
      },
      2: {
        html: '支持。可在关键步骤插入 <b>Human-in-the-loop</b> 审批节点：Agent 会暂停等待人工确认，超时未处理可按策略自动拒绝或回退。<span class="ref">[P-21]</span>',
        cites: ['P-21'],
        hit: '1.00',
        faith: '0.94',
      },
    },
  },
  support: {
    label: '售后政策',
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
    answers: {
      0: {
        html: '企业版 SLA：<b>严重故障 15 分钟内响应</b>，4 小时内给出缓解方案；一般问题 1 个工作日内响应。<span class="ref">[S-02]</span>',
        cites: ['S-02'],
        hit: '1.00',
        faith: '0.96',
      },
      1: {
        html: '支持 <b>PDF / Docx / Markdown / HTML</b>；单文件不超过 50MB，单库不超过 10 万切片。扫描件 PDF 需开启 OCR。<span class="ref">[S-09]</span>',
        cites: ['S-09'],
        hit: '1.00',
        faith: '0.95',
      },
      2: {
        html: '是。私有化套餐默认包含<strong>操作审计日志、角色权限与数据出境开关</strong>，日志默认保留 180 天且可配置。<span class="ref">[S-14]</span>',
        cites: ['S-14'],
        hit: '1.00',
        faith: '0.94',
      },
    },
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

function renderPresets() {
  const list = corpora[kb].presets
  presetsEl.innerHTML = list
    .map((q, i) => `<button type="button" data-i="${i}">${q}</button>`)
    .join('')
  questionEl.value = list[presetIndex] || list[0]
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

async function ask() {
  if (running) return
  running = true
  askBtn.disabled = true
  const q = questionEl.value.trim()
  chunksEl.innerHTML = ''
  citesEl.innerHTML = ''
  traceEl.innerHTML = ''
  answerEl.innerHTML = '<p class="placeholder">检索与生成中…</p>'
  $('#ans-badge').textContent = '处理中'
  $('#ans-badge').classList.remove('ok')
  $('#retrieve-state').textContent = 'Embed → Retrieve'
  $('#m-hit').textContent = '—'
  $('#m-faith').textContent = '—'
  $('#m-lat').textContent = '—'
  const t0 = Date.now()

  trace(`query: ${q.slice(0, 42)}${q.length > 42 ? '…' : ''}`)
  await sleep(350)
  trace('embedding ok · dim=1024')
  await sleep(280)
  $('#retrieve-state').textContent = 'Hybrid Recall'
  const ranked = rankChunks(q)
  for (let i = 0; i < ranked.length; i++) {
    await sleep(260)
    const c = ranked[i]
    const li = document.createElement('li')
    if (i < 3) li.classList.add('top')
    li.innerHTML = `
      <div class="row">
        <strong>${c.id} · ${c.title}</strong>
        <span class="score">${c.score.toFixed(2)}</span>
      </div>
      <p>${c.text}</p>
      ${i < 3 ? '<span class="tag">Rerank Top3</span>' : ''}
    `
    chunksEl.appendChild(li)
    trace(`hit ${c.id} score=${c.score.toFixed(2)}`)
  }

  await sleep(320)
  $('#retrieve-state').textContent = 'Generate + Cite'
  trace('grounded generation')

  const matchedPreset = corpora[kb].presets.findIndex((p) => p === q)
  const ansKey = matchedPreset >= 0 ? matchedPreset : 0
  const ans = corpora[kb].answers[ansKey]

  answerEl.innerHTML = `<p>${ans.html}</p>`
  citesEl.innerHTML = ans.cites
    .map((id) => {
      const chunk = corpora[kb].chunks.find((c) => c.id === id)
      return `<div class="cite-item"><b>[${id}]</b> ${chunk ? chunk.title : ''} — ${chunk ? chunk.text.slice(0, 42) : ''}…</div>`
    })
    .join('')

  $('#ans-badge').textContent = '已引用回答'
  $('#ans-badge').classList.add('ok')
  $('#m-hit').textContent = ans.hit
  $('#m-faith').textContent = ans.faith
  $('#m-lat').textContent = `${((Date.now() - t0) / 1000).toFixed(1)}s`
  $('#retrieve-state').textContent = '完成'
  trace('done')

  running = false
  askBtn.disabled = false
}

function clearAll() {
  if (running) return
  chunksEl.innerHTML = ''
  citesEl.innerHTML = ''
  traceEl.innerHTML = ''
  answerEl.innerHTML = '<p class="placeholder">提问后，这里会给出带 [引用] 的答复，并列出依据片段。</p>'
  $('#ans-badge').textContent = '未回答'
  $('#ans-badge').classList.remove('ok')
  $('#retrieve-state').textContent = '待机'
  $('#m-hit').textContent = '—'
  $('#m-faith').textContent = '—'
  $('#m-lat').textContent = '—'
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

askBtn.addEventListener('click', ask)
$('#clear').addEventListener('click', clearAll)
renderPresets()

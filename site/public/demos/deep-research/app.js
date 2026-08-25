const TOPIC_PRESETS = {
  framework: '对比 LangGraph / CrewAI / AutoGen 在生产 Agent 中的适用边界与选型建议',
  pricing: '三家 AI Agent 平台竞品定价与功能分层拆解（入门 / 专业 / 企业）',
  mcp: 'MCP 工具生态现状：Server 形态、安全边界与 Agent 接入最佳实践',
}

const $ = (s) => document.querySelector(s)
const topicEl = $('#topic')
const sourcesEl = $('#sources')
const reportEl = $('#report')
const logEl = $('#log')
const runBtn = $('#run')

let running = false
let activePreset = 'framework'
let startedAt = 0

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function log(msg) {
  const li = document.createElement('li')
  const t = ((Date.now() - startedAt) / 1000).toFixed(1)
  li.innerHTML = `<span class="t">+${t}s</span>${msg}`
  logEl.prepend(li)
}

function setPhase(text) {
  $('#phase').textContent = String(text).toUpperCase()
}

function setStep(id, state) {
  document.querySelectorAll('#steps li').forEach((li) => {
    const sid = li.getAttribute('data-step')
    li.classList.remove('active', 'done')
    if (sid === id && state === 'active') li.classList.add('active')
    if (state === 'done' || state === 'active') {
      const order = ['plan', 'search', 'critic', 'write']
      const cur = order.indexOf(id)
      const mine = order.indexOf(sid)
      if (state === 'done' && mine <= cur) li.classList.add('done')
      if (state === 'active' && mine < cur) li.classList.add('done')
      if (state === 'active' && sid === id) li.classList.add('active')
    }
  })
}

function renderSources(list) {
  sourcesEl.innerHTML = list
    .map(
      (s, i) => `
    <li>
      <div class="s-top">
        <strong>[${i + 1}] ${DemoLLM.escapeHtml(s.title || '未命名信源')}</strong>
        <span class="score">rel ${Number(s.score || 0).toFixed(2)}</span>
      </div>
      <p>${DemoLLM.escapeHtml(s.note || '')}</p>
    </li>`,
    )
    .join('')
  $('#source-count').textContent = `${list.length} SRC`
  $('#m-sources').textContent = String(list.length)
}

function renderReport(data) {
  const sections = Array.isArray(data.sections) ? data.sections : []
  const body = sections
    .map((sec) => {
      const cites = (sec.cites || [])
        .map((c) => `<span class="cite">[${DemoLLM.escapeHtml(String(c))}]</span>`)
        .join('')
      return `<h4>${DemoLLM.escapeHtml(sec.h || '章节')}</h4><p>${DemoLLM.escapeHtml(sec.p || '')}${cites}</p>`
    })
    .join('')
  reportEl.innerHTML = `
    <h3>${DemoLLM.escapeHtml(data.title || '调研报告')}</h3>
    ${body || '<p>模型未返回章节内容。</p>'}
    <div class="risk">风险标注：${DemoLLM.escapeHtml(data.risk || '无')}</div>
  `
  const conf = data.conf != null ? String(data.conf) : '—'
  $('#out-badge').textContent = `CONF ${conf}`
  $('#out-badge').classList.add('ready')
  $('#m-conf').textContent = conf
}

async function runResearch() {
  if (running) return
  running = true
  runBtn.disabled = true
  startedAt = Date.now()
  logEl.innerHTML = ''
  sourcesEl.innerHTML = ''
  reportEl.innerHTML = '<p class="placeholder">正在调用 deepseek-v4-pro…</p>'
  $('#out-badge').textContent = 'GENERATING'
  $('#out-badge').classList.remove('ready')
  $('#m-conflicts').textContent = '0'
  $('#m-conf').textContent = '—'
  $('#m-ms').textContent = '—'
  $('#m-sources').textContent = '0'
  $('#source-count').textContent = '0 SRC'

  const topic = topicEl.value.trim() || TOPIC_PRESETS.framework

  try {
    setPhase('Planner 拆解中')
    setStep('plan', 'active')
    log('调用 deepseek-v4-pro · Planner')
    const planRes = await DemoLLM.chatJson(
      [
        {
          role: 'system',
          content:
            '你是 Deep Research 的 Planner。根据课题输出 JSON：{"plan":["子任务1","子任务2",...]}，4～6 条可执行子任务。',
        },
        { role: 'user', content: `课题：${topic}` },
      ],
      { max_tokens: 600, temperature: 0.3 },
    )
    const plan = Array.isArray(planRes.data.plan) ? planRes.data.plan : []
    for (const item of plan) {
      log(`子任务 + ${DemoLLM.escapeHtml(String(item))}`)
      await sleep(120)
    }
    setStep('plan', 'done')

    setPhase('并行检索中')
    setStep('search', 'active')
    log('调用 deepseek-v4-pro · Search Crew')
    const searchRes = await DemoLLM.chatJson(
      [
        {
          role: 'system',
          content:
            '你是调研检索智能体。围绕课题产出证据池 JSON：{"sources":[{"title":"信源名","score":0.0到1.0,"note":"一句话要点"}]}，5～7 条，score 体现相关度。可用公开知识与合理推断，title 要具体。',
        },
        {
          role: 'user',
          content: `课题：${topic}\n子任务：${JSON.stringify(plan)}`,
        },
      ],
      { max_tokens: 1200, temperature: 0.45 },
    )
    const sources = Array.isArray(searchRes.data.sources) ? searchRes.data.sources : []
    for (let i = 1; i <= sources.length; i++) {
      renderSources(sources.slice(0, i))
      log(`命中信源 [${i}] ${DemoLLM.escapeHtml(sources[i - 1].title || '')}`)
      await sleep(160)
    }
    setStep('search', 'done')

    setPhase('交叉验证中')
    setStep('critic', 'active')
    log('调用 deepseek-v4-pro · Critic')
    const criticRes = await DemoLLM.chatJson(
      [
        {
          role: 'system',
          content:
            '你是质检 Critic。输出 JSON：{"conflicts":数字,"notes":["裁决说明",...],"kept_source_indexes":[从1开始的保留编号]}',
        },
        {
          role: 'user',
          content: `课题：${topic}\n证据：${JSON.stringify(sources)}`,
        },
      ],
      { max_tokens: 700, temperature: 0.2 },
    )
    const conflicts = Number(criticRes.data.conflicts) || 0
    $('#m-conflicts').textContent = String(conflicts)
    ;(criticRes.data.notes || []).slice(0, 4).forEach((n) => log(`裁决 · ${DemoLLM.escapeHtml(String(n))}`))
    setStep('critic', 'done')

    setPhase('成稿中')
    setStep('write', 'active')
    log('调用 deepseek-v4-pro · Writer')
    const writeRes = await DemoLLM.chatJson(
      [
        {
          role: 'system',
          content:
            '你是调研报告 Writer。输出 JSON：{"title":"...","sections":[{"h":"小标题","p":"段落","cites":[1,2]}],"risk":"风险","conf":"0.00到1.00字符串"}。cites 引用证据编号。中文撰写，结论先行。',
        },
        {
          role: 'user',
          content: `课题：${topic}\n证据：${JSON.stringify(sources)}\n质检：${JSON.stringify(criticRes.data)}`,
        },
      ],
      { max_tokens: 2200, temperature: 0.4 },
    )
    renderReport(writeRes.data)
    setStep('write', 'done')
    setPhase('完成')
    log(`调研完成 · model=${writeRes.model || 'deepseek-v4-pro'}`)
  } catch (err) {
    setPhase('失败')
    log(`错误：${DemoLLM.escapeHtml(err.message || String(err))}`)
    reportEl.innerHTML = `<p class="placeholder">调用失败：${DemoLLM.escapeHtml(err.message || String(err))}</p>`
    $('#out-badge').textContent = 'ERROR'
  }

  $('#m-ms').textContent = `${((Date.now() - startedAt) / 1000).toFixed(1)}s`
  running = false
  runBtn.disabled = false
}

function reset() {
  if (running) return
  setPhase('待机')
  document.querySelectorAll('#steps li').forEach((li) => li.classList.remove('active', 'done'))
  sourcesEl.innerHTML = ''
  logEl.innerHTML = ''
  reportEl.innerHTML =
    '<p class="placeholder">执行后将调用 deepseek-v4-pro 实时生成带引用情报稿。</p>'
  $('#out-badge').textContent = 'DRAFT PENDING'
  $('#out-badge').classList.remove('ready')
  $('#source-count').textContent = '0 SRC'
  $('#m-sources').textContent = '0'
  $('#m-conflicts').textContent = '0'
  $('#m-conf').textContent = '—'
  $('#m-ms').textContent = '—'
}

$('#presets').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-id]')
  if (!btn) return
  activePreset = btn.dataset.id
  topicEl.value = TOPIC_PRESETS[activePreset] || topicEl.value
  document.querySelectorAll('#presets button').forEach((b) => b.classList.toggle('is-active', b === btn))
})

runBtn.addEventListener('click', runResearch)
$('#reset').addEventListener('click', reset)
document.querySelector('#presets button').classList.add('is-active')
topicEl.value = TOPIC_PRESETS.framework

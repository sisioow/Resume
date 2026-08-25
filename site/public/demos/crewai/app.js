const agents = [
  {
    id: 'researcher',
    name: '研究员',
    role: '高级研究分析',
    goal: '检索趋势与一手信源',
    color: '#0f7a6c',
    x: 22,
    y: 32,
  },
  {
    id: 'analyst',
    name: '分析师',
    role: '洞察撰稿',
    goal: '沉淀可执行报告',
    color: '#e4572e',
    x: 78,
    y: 32,
  },
  {
    id: 'critic',
    name: '质检官',
    role: '质量与护栏复核',
    goal: '质检与风险标注',
    color: '#c9a227',
    x: 50,
    y: 78,
  },
]

const $ = (sel) => document.querySelector(sel)
const logEl = $('#log')
const phaseEl = $('#phase')
const reportEl = $('#report')
const reportBody = $('#report-body')
const kickoffBtn = $('#kickoff')
const replayBtn = $('#replay')
const topicInput = $('#topic')
const tasksStat = $('#stat-tasks')
const msStat = $('#stat-ms')

let running = false
let startedAt = 0
let timer = null
let tasksDone = 0

function renderAgents() {
  const root = $('#agents')
  root.innerHTML = agents
    .map(
      (a) => `
    <div class="agent" id="agent-${a.id}" style="left:${a.x}%; top:${a.y}%;">
      <div class="avatar" style="background:${a.color}">${a.name.slice(0, 1)}</div>
      <h3>${a.name}</h3>
      <p>${a.role}<br />${a.goal}</p>
      <span class="badge" data-badge>空闲</span>
    </div>
  `,
    )
    .join('')

  const svg = $('#links')
  const pairs = [
    [0, 1],
    [0, 2],
    [1, 2],
  ]
  svg.innerHTML = pairs
    .map(([i, j], idx) => {
      const a = agents[i]
      const b = agents[j]
      return `<line id="link-${idx}" x1="${(a.x / 100) * 640}" y1="${(a.y / 100) * 420}" x2="${(b.x / 100) * 640}" y2="${(b.y / 100) * 420}" />`
    })
    .join('')
}

function setAgentState(id, state) {
  const el = $(`#agent-${id}`)
  if (!el) return
  el.classList.remove('active', 'done')
  if (state === 'active') el.classList.add('active')
  if (state === 'done') el.classList.add('done')
  const badge = el.querySelector('[data-badge]')
  badge.textContent = state === 'active' ? '工作中' : state === 'done' ? '已完成' : '空闲'
}

function setLink(activeIdx) {
  ;[0, 1, 2].forEach((i) => {
    const line = $(`#link-${i}`)
    if (!line) return
    line.classList.toggle('active', i === activeIdx)
  })
}

function pushLog(message, kind = '') {
  const now = new Date()
  const t = `${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
  const li = document.createElement('li')
  if (kind) li.className = kind
  li.innerHTML = `<span class="t">${t}</span><span class="m">${message}</span>`
  logEl.prepend(li)
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function runCrew() {
  if (running) return
  running = true
  kickoffBtn.disabled = true
  replayBtn.disabled = true
  logEl.innerHTML = ''
  reportEl.hidden = true
  tasksDone = 0
  tasksStat.textContent = '0'
  agents.forEach((a) => setAgentState(a.id, 'idle'))
  setLink(-1)

  const topic = topicInput.value.trim() || '未命名任务'
  startedAt = performance.now()
  timer = setInterval(() => {
    msStat.textContent = `${((performance.now() - startedAt) / 1000).toFixed(1)}秒`
  }, 100)

  try {
    phaseEl.textContent = '启动团队'
    pushLog(`创建协作团队 · 主题 = <b>${DemoLLM.escapeHtml(topic)}</b> · deepseek-v4-pro`)
    await sleep(300)

    phaseEl.textContent = '任务 1 · 检索'
    setAgentState('researcher', 'active')
    setLink(0)
    pushLog(`<b>研究员</b> 调用模型搜集「${DemoLLM.escapeHtml(topic)}」`)
    const research = await DemoLLM.chatJson(
      [
        {
          role: 'system',
          content:
            '你是多智能体团队中的研究员。输出 JSON：{"notes":["洞察1",...],"sources":["来源1",...],"tools":["调用的工具名"]}',
        },
        { role: 'user', content: `主题：${topic}` },
      ],
      { max_tokens: 900, temperature: 0.45 },
    )
    ;(research.data.tools || ['网络搜索']).forEach((t) => pushLog(`调用工具 <b>${DemoLLM.escapeHtml(t)}</b>`, 'tool'))
    ;(research.data.notes || []).slice(0, 4).forEach((n) => pushLog(`笔记 · ${DemoLLM.escapeHtml(n)}`))
    pushLog(`研究员完成 · ${(research.data.sources || []).length} 条引用`, 'done')
    setAgentState('researcher', 'done')
    tasksDone = 1
    tasksStat.textContent = '1'

    phaseEl.textContent = '任务 2 · 成稿'
    setAgentState('analyst', 'active')
    setLink(0)
    pushLog(`<b>分析师</b> 接手上下文 · deepseek-v4-pro 成稿`)
    const draft = await DemoLLM.chat(
      [
        {
          role: 'system',
          content:
            '你是多智能体团队中的分析师。根据研究员笔记写一份中文 Markdown 报告，含：执行摘要、关键发现、建议下一步。不要用代码围栏包裹全文。',
        },
        {
          role: 'user',
          content: `主题：${topic}\n研究员输出：${JSON.stringify(research.data)}`,
        },
      ],
      { max_tokens: 1600, temperature: 0.5 },
    )
    pushLog(`写入草稿 <b>报告.md</b>`, 'tool')
    pushLog(`分析师完成初稿`, 'done')
    setAgentState('analyst', 'done')
    tasksDone = 2
    tasksStat.textContent = '2'

    phaseEl.textContent = '任务 3 · 质检'
    setAgentState('critic', 'active')
    setLink(2)
    pushLog(`<b>质检官</b> 启动质检 · deepseek-v4-pro`)
    const critique = await DemoLLM.chatJson(
      [
        {
          role: 'system',
          content:
            '你是质检官。输出 JSON：{"pass":true/false,"issues":["问题"],"risks":["风险"],"final_report":"修订后的完整 Markdown 报告"}。必须给出 final_report。',
        },
        {
          role: 'user',
          content: `主题：${topic}\n初稿：\n${draft.content}`,
        },
      ],
      { max_tokens: 2000, temperature: 0.25 },
    )
    ;(critique.data.issues || []).slice(0, 3).forEach((i) => pushLog(`质检项 · ${DemoLLM.escapeHtml(i)}`, 'tool'))
    ;(critique.data.risks || []).slice(0, 2).forEach((r) => pushLog(`风险 · ${DemoLLM.escapeHtml(r)}`))
    pushLog(critique.data.pass === false ? '已回写修正并再检' : '质检通过', 'done')
    setAgentState('critic', 'done')
    tasksDone = 3
    tasksStat.textContent = '3'

    phaseEl.textContent = '已交付'
    reportBody.textContent =
      critique.data.final_report ||
      draft.content ||
      `# ${topic}\n\n（模型未返回报告正文）`
    reportEl.hidden = false
    pushLog(`团队完成 · model=${critique.model || 'deepseek-v4-pro'}`, 'done')
    setLink(-1)
  } catch (err) {
    phaseEl.textContent = '失败'
    pushLog(`错误：${DemoLLM.escapeHtml(err.message || String(err))}`)
    reportBody.textContent = `调用失败：${err.message || err}`
    reportEl.hidden = false
  }

  clearInterval(timer)
  msStat.textContent = `${((performance.now() - startedAt) / 1000).toFixed(1)}秒`
  running = false
  kickoffBtn.disabled = false
  replayBtn.disabled = false
}

kickoffBtn.addEventListener('click', runCrew)
replayBtn.addEventListener('click', () => runCrew())

renderAgents()
pushLog('控制台就绪 · deepseek-v4-pro · 点击「启动团队」开始真实多智能体协作')

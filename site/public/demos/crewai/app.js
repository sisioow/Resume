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

function buildReport(topic) {
  return `# ${topic}

## 执行摘要
- 团队以顺序流程完成：检索 → 成稿 → 质检
- 覆盖开源 Agent 框架、MCP 工具链与落地交付路径
- 产出可直接用于内部评审的结构化 Markdown

## 关键发现
1. **编排层**：Crews 解决角色协作；Flows 解决事件驱动分支
2. **工具层**：搜索 / RAG / 文件写入形成闭环
3. **质量层**：质检官 + 护栏降低幻觉与漏项

## 建议下一步
- 接入真实搜索 / 爬虫工具
- 用流程可视化导出协作图
- 将报告节点接到 CI 或知识库

---
_由 CrewAI 任务控制台生成（演示）_`
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

  phaseEl.textContent = '启动团队'
  pushLog(`创建协作团队 · 主题 = <b>${topic}</b>`)
  await sleep(500)

  phaseEl.textContent = '任务 1 · 检索'
  setAgentState('researcher', 'active')
  setLink(0)
  pushLog(`<b>研究员</b> 接收任务：搜集「${topic}」一手材料`)
  await sleep(700)
  pushLog(`调用工具 <b>网络搜索</b> · 关键词「${topic}」`, 'tool')
  await sleep(900)
  pushLog(`调用工具 <b>网页检索</b> · 抓取 6 篇高相关来源`, 'tool')
  await sleep(800)
  pushLog(`研究员完成笔记 · 12 条洞察 / 8 条引用`, 'done')
  setAgentState('researcher', 'done')
  tasksDone = 1
  tasksStat.textContent = '1'
  await sleep(400)

  phaseEl.textContent = '任务 2 · 成稿'
  setAgentState('analyst', 'active')
  setLink(0)
  pushLog(`<b>分析师</b> 接手上下文 · 开始结构化成稿`)
  await sleep(750)
  pushLog(`委派确认：沿用研究员引用图，补充落地路径章节`)
  await sleep(850)
  pushLog(`写入草稿 <b>报告.md</b> · 共 4 个章节`, 'tool')
  await sleep(700)
  pushLog(`分析师完成初稿`, 'done')
  setAgentState('analyst', 'done')
  tasksDone = 2
  tasksStat.textContent = '2'
  await sleep(350)

  phaseEl.textContent = '任务 3 · 质检'
  setAgentState('critic', 'active')
  setLink(2)
  pushLog(`<b>质检官</b> 启动质检 · 护栏最大重试 2 次`)
  await sleep(650)
  pushLog(`检查项：事实引用 / 过度承诺 / 可执行性`)
  await sleep(800)
  pushLog(`发现 1 处表述过强 → 回写分析师修正`, 'tool')
  setLink(1)
  await sleep(700)
  pushLog(`质检通过 · 风险标注 2 条`, 'done')
  setAgentState('critic', 'done')
  tasksDone = 3
  tasksStat.textContent = '3'

  phaseEl.textContent = '已交付'
  reportBody.textContent = buildReport(topic)
  reportEl.hidden = false
  pushLog(`团队完成 · 产物已落盘 <b>报告.md</b>`, 'done')
  setLink(-1)

  clearInterval(timer)
  msStat.textContent = `${((performance.now() - startedAt) / 1000).toFixed(1)}秒`
  running = false
  kickoffBtn.disabled = false
  replayBtn.disabled = false
}

document.querySelectorAll('.scenario').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.scenario').forEach((b) => b.classList.remove('active'))
    btn.classList.add('active')
    topicInput.value = btn.dataset.topic
  })
})

kickoffBtn.addEventListener('click', runCrew)
replayBtn.addEventListener('click', async () => {
  await runCrew()
})

renderAgents()
pushLog('控制台就绪 · 点击「启动团队」或「自动演示」开始录屏')

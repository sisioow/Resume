const presets = {
  framework: {
    topic: '对比 LangGraph / CrewAI / AutoGen 在生产 Agent 中的适用边界与选型建议',
    plan: ['定义生产约束：状态机、HITL、可观测', '检索三框架官方能力边界', '收集企业落地案例与反模式', '形成选型决策矩阵'],
    sources: [
      { title: 'LangGraph Docs · Durable execution', score: 0.91, note: '强调 checkpoint、人审节点与可恢复执行' },
      { title: 'CrewAI Examples · Role crews', score: 0.84, note: '角色协作原型快，长任务控制力偏弱' },
      { title: 'AutoGen / AG2 Studio', score: 0.8, note: '对话式多 Agent 可视化强，工程约束需自建' },
      { title: 'Uber / Klarna 工程分享摘录', score: 0.76, note: '生产更看重状态图与评测闭环' },
      { title: '社区踩坑合集 · 工具死循环', score: 0.72, note: '无预算熔断与 schema 校验时失败率高' },
    ],
    conflicts: 2,
    report: {
      title: '生产 Agent 框架选型简报',
      sections: [
        {
          h: '结论先行',
          p: '若核心诉求是可控长任务与人审，优先 LangGraph；若要快速角色协作原型，用 CrewAI；若强调多 Agent 对话编排可视化，可看 AutoGen/AG2。三者不是互斥，常见组合是「LangGraph 做 Runtime + Crew 做业务角色包」。',
          cites: [1, 4],
        },
        {
          h: '能力边界',
          p: 'LangGraph 在 checkpoint / HITL / 轨迹回放上更完整；CrewAI 交付速度高但需自补 Guardrails；AutoGen 适合研究对话策略，落到生产需补状态与评测层。',
          cites: [1, 2, 3],
        },
        {
          h: '风险与建议',
          p: '统一补齐：Tool Schema 校验、重试预算、Trace、离线评测集。没有 Eval 的框架选型讨论，很难在面试/评审中站得住。',
          cites: [5],
        },
      ],
      risk: '演示数据为静态证据池模拟；真实落地需替换为可复现检索与评测流水线。',
      conf: '0.86',
    },
  },
  pricing: {
    topic: '三家 AI Agent 平台竞品定价与功能分层拆解（入门 / 专业 / 企业）',
    plan: ['锁定对比维度：席位、调用量、知识库、工作流', '抓取公开定价页关键字段', '交叉验证功能门控差异', '输出采购决策建议'],
    sources: [
      { title: '竞品 A 定价页快照', score: 0.88, note: '入门免费额度 + 按席位升级' },
      { title: '竞品 B 企业报价白皮书', score: 0.81, note: '强调私有化与审计日志加价' },
      { title: '竞品 C 功能对照表', score: 0.79, note: '工作流节点在专业版才开放' },
      { title: '客户访谈纪要（匿名）', score: 0.7, note: '真实成本常被「超额调用」放大' },
    ],
    conflicts: 1,
    report: {
      title: 'Agent 平台定价情报简报',
      sections: [
        {
          h: '分层判断',
          p: '入门版适合验证；专业版才具备可编排工作流；企业版溢价主要买在合规、私有化与 SLA，而非模型本身。',
          cites: [1, 2, 3],
        },
        {
          h: '隐性成本',
          p: '公开标价往往低估检索调用与长上下文。采购应要求「任务成功率 / 千次对话成本」双指标，而不是只看席位费。',
          cites: [4],
        },
      ],
      risk: '公开页可能随时变更；上线前需复核抓取时间戳。',
      conf: '0.81',
    },
  },
  mcp: {
    topic: 'MCP 工具生态现状：Server 形态、安全边界与 Agent 接入最佳实践',
    plan: ['梳理 MCP Client/Server 职责', '收集主流 Server 能力清单', '分析权限与沙箱风险', '给出接入清单与护栏'],
    sources: [
      { title: 'MCP Spec 摘要', score: 0.93, note: '工具发现、调用与资源读取标准接口' },
      { title: '官方 Example Servers', score: 0.86, note: '文件系统 / 浏览器 / DB 类能力样例' },
      { title: '安全讨论：Prompt Injection via Tool', score: 0.83, note: '工具返回污染上下文是高频风险' },
      { title: '企业接入案例：Tool Gateway', score: 0.77, note: '统一鉴权、审计、配额比单点 Server 更重要' },
    ],
    conflicts: 1,
    report: {
      title: 'MCP 生态接入简报',
      sections: [
        {
          h: '怎么用才像生产',
          p: '不要让 Agent 直连一堆 Server。先做 Tool Gateway：鉴权、schema、超时、审计；再按最小权限暴露工具。',
          cites: [1, 4],
        },
        {
          h: '护栏要点',
          p: '对工具输出做清洗与长度截断；敏感写操作强制 HITL；每次调用落 Trace，方便回放失败轨迹。',
          cites: [3],
        },
      ],
      risk: '协议演进快，需锁定版本并做兼容测试。',
      conf: '0.88',
    },
  },
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
  $('#phase').textContent = text
}

function setStep(id, state) {
  document.querySelectorAll('.steps li').forEach((li) => {
    const sid = li.getAttribute('data-step')
    li.classList.remove('active', 'done')
    if (sid === id && state === 'active') li.classList.add('active')
    if (state === 'done') {
      const order = ['plan', 'search', 'critic', 'write']
      if (order.indexOf(sid) <= order.indexOf(id)) li.classList.add('done')
    }
    if (state === 'active' && sid !== id) {
      const order = ['plan', 'search', 'critic', 'write']
      if (order.indexOf(sid) < order.indexOf(id)) li.classList.add('done')
    }
  })
}

function renderSources(list, count = 0) {
  sourcesEl.innerHTML = list
    .slice(0, count)
    .map(
      (s, i) => `
    <li>
      <div class="s-top">
        <strong>[${i + 1}] ${s.title}</strong>
        <span class="score">rel ${s.score.toFixed(2)}</span>
      </div>
      <p>${s.note}</p>
    </li>`,
    )
    .join('')
  $('#source-count').textContent = `${Math.min(count, list.length)} 条`
  $('#m-sources').textContent = String(Math.min(count, list.length))
}

function renderReport(data) {
  const body = data.sections
    .map((sec) => {
      const cites = sec.cites.map((c) => `<span class="cite">[${c}]</span>`).join('')
      return `<h4>${sec.h}</h4><p>${sec.p}${cites}</p>`
    })
    .join('')
  reportEl.innerHTML = `
    <h3>${data.title}</h3>
    ${body}
    <div class="risk">风险标注：${data.risk}</div>
  `
  $('#out-badge').textContent = `置信 ${data.conf}`
  $('#out-badge').classList.add('ready')
  $('#m-conf').textContent = data.conf
}

async function runResearch() {
  if (running) return
  running = true
  runBtn.disabled = true
  startedAt = Date.now()
  logEl.innerHTML = ''
  sourcesEl.innerHTML = ''
  reportEl.innerHTML = '<p class="placeholder">管线执行中…</p>'
  $('#out-badge').textContent = '生成中'
  $('#out-badge').classList.remove('ready')
  $('#m-conflicts').textContent = '0'
  $('#m-conf').textContent = '—'
  $('#m-ms').textContent = '—'

  const pack = presets[activePreset]
  topicEl.value = pack.topic

  setPhase('Planner 拆解中')
  setStep('plan', 'active')
  log('Planner 启动：识别约束与子问题')
  await sleep(500)
  for (const item of pack.plan) {
    log(`子任务 + ${item}`)
    await sleep(320)
  }
  setStep('plan', 'done')

  setPhase('并行检索中')
  setStep('search', 'active')
  log('Search Crew 分发 3 路检索 worker')
  for (let i = 1; i <= pack.sources.length; i++) {
    await sleep(380)
    renderSources(pack.sources, i)
    log(`命中信源 [${i}] ${pack.sources[i - 1].title}`)
  }
  setStep('search', 'done')

  setPhase('交叉验证中')
  setStep('critic', 'active')
  log('Critic 检测陈述冲突与过时信息')
  await sleep(700)
  $('#m-conflicts').textContent = String(pack.conflicts)
  log(`裁决冲突 ${pack.conflicts} 处，保留高相关证据`)
  await sleep(450)
  setStep('critic', 'done')

  setPhase('成稿中')
  setStep('write', 'active')
  log('Writer 生成带引用报告')
  await sleep(650)
  renderReport(pack.report)
  setStep('write', 'done')
  setPhase('完成')
  log('调研闭环完成')

  $('#m-ms').textContent = `${((Date.now() - startedAt) / 1000).toFixed(1)}s`
  running = false
  runBtn.disabled = false
}

function reset() {
  if (running) return
  setPhase('待机')
  document.querySelectorAll('.steps li').forEach((li) => li.classList.remove('active', 'done'))
  sourcesEl.innerHTML = ''
  logEl.innerHTML = ''
  reportEl.innerHTML =
    '<p class="placeholder">启动后，这里会实时写出带引用编号的研究报告，并标注置信度与风险点。</p>'
  $('#out-badge').textContent = '未生成'
  $('#out-badge').classList.remove('ready')
  $('#source-count').textContent = '0 条'
  $('#m-sources').textContent = '0'
  $('#m-conflicts').textContent = '0'
  $('#m-conf').textContent = '—'
  $('#m-ms').textContent = '—'
}

$('#presets').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-id]')
  if (!btn) return
  activePreset = btn.dataset.id
  topicEl.value = presets[activePreset].topic
  document.querySelectorAll('#presets button').forEach((b) => b.classList.toggle('is-active', b === btn))
})

runBtn.addEventListener('click', runResearch)
$('#reset').addEventListener('click', reset)
document.querySelector('#presets button').classList.add('is-active')

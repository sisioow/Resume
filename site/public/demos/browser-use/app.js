const $ = (s) => document.querySelector(s)
const taskEl = $('#task')
const runBtn = $('#run')
const stopBtn = $('#stop')
const thoughtEl = $('#thought')
const actionsEl = $('#actions')
const pageEl = $('#page')
const urlEl = $('#url')
const cursorEl = $('#cursor')
const hudEl = $('#hud')
const hudBody = $('#hud-body')
const stepChip = $('#step-chip')
const extractEl = $('#extract')
const extractBody = $('#extract-body')
const modelEl = $('#model')

let abort = false
let running = false
let totalSteps = 8

function sleep(ms) {
  return new Promise((r) => {
    const t = setTimeout(r, ms)
    const check = setInterval(() => {
      if (abort) {
        clearTimeout(t)
        clearInterval(check)
        r()
      }
    }, 40)
    setTimeout(() => clearInterval(check), ms + 50)
  })
}

function setStep(n) {
  stepChip.textContent = `步骤 ${n}/${totalSteps}`
}

function think(text) {
  thoughtEl.textContent = text
}

function logAction(text, kind = '') {
  const li = document.createElement('li')
  if (kind) li.className = kind
  li.textContent = text
  actionsEl.prepend(li)
  hudBody.textContent = text
}

function moveCursor(x, y) {
  cursorEl.hidden = false
  cursorEl.style.left = `${x}px`
  cursorEl.style.top = `${y}px`
}

function showHud(show) {
  hudEl.hidden = !show
}

function renderPricing() {
  pageEl.innerHTML = `
    <div class="page-inner">
      <h2>星云云 · 定价</h2>
      <p class="sub">选择与你的智能体规模匹配的套餐</p>
      <div class="pricing">
        <article class="plan" id="plan-starter">
          <h3>入门版</h3>
          <div class="price">¥199</div>
          <ul><li>1 万积分</li><li>1 个工作区</li><li>邮件支持</li></ul>
          <button type="button">开通入门版</button>
        </article>
        <article class="plan hot" id="plan-pro">
          <h3>专业版</h3>
          <div class="price">¥699</div>
          <ul><li>10 万积分</li><li>MCP 工具</li><li>优先队列</li></ul>
          <button type="button">开通专业版</button>
        </article>
        <article class="plan" id="plan-scale">
          <h3>企业版</h3>
          <div class="price">¥1999</div>
          <ul><li>不限席位</li><li>单点登录 + 审计</li><li>专属客户成功</li></ul>
          <button type="button">联系销售</button>
        </article>
      </div>
    </div>
  `
}

function renderForm() {
  pageEl.innerHTML = `
    <div class="page-inner form-demo">
      <h2>职位申请 · Agent 开发工程师</h2>
      <p class="sub">招聘 · 远程 · 全职</p>
      <label>姓名<input id="f-name" placeholder="请输入姓名" /></label>
      <label>邮箱<input id="f-email" placeholder="邮箱地址" /></label>
      <label>作品集<input id="f-site" placeholder="https://…" /></label>
      <div class="file" id="f-resume">上传简历.pdf</div>
      <button type="button" class="submit" id="f-submit">提交申请</button>
    </div>
  `
}

function renderSearch() {
  pageEl.innerHTML = `
    <div class="page-inner search-demo">
      <h2>仓库搜索</h2>
      <div class="bar">
        <input id="q" value="" placeholder="搜索仓库" />
      </div>
      <div class="result" id="r1"><strong>browser-use/browser-use</strong><span>让网站对 AI 智能体可操作 · ★ 7 万+</span></div>
      <div class="result" id="r2"><strong>browser-use/web-ui</strong><span>可选界面封装与演示</span></div>
    </div>
  `
}

function detectScenario(task) {
  if (/表单|申请|填写/.test(task)) return 'form'
  if (/Release|检索|搜索|GitHub|版本/.test(task)) return 'search'
  return 'pricing'
}

async function planWithModel(task, scenario) {
  think('正在用 deepseek-v4-pro 规划浏览器动作…')
  logAction('调用 deepseek-v4-pro · 任务规划')
  const { data, model } = await DemoLLM.chatJson(
    [
      {
        role: 'system',
        content:
          '你是 Browser-Use 规划器。输出 JSON：{"thoughts":["步骤思考1",...],"actions":["动作描述1",...],"extract_hint":"最终抽取摘要"}。thoughts/actions 各 4～7 条，中文，贴合给定 scenario。',
      },
      {
        role: 'user',
        content: `任务：${task}\nscenario：${scenario}（pricing=比价页，form=申请表，search=版本检索）`,
      },
    ],
    { max_tokens: 800, temperature: 0.4 },
  )
  if (modelEl) modelEl.textContent = model || 'deepseek-v4-pro'
  return data
}

async function runPricingFlow(plan) {
  urlEl.textContent = 'https://星云云.示例/定价'
  renderPricing()
  showHud(true)
  const thoughts = plan.thoughts || []
  const actions = plan.actions || []

  setStep(1)
  think(thoughts[0] || '打开定价页')
  logAction(actions[0] || '导航 → /定价')
  moveCursor(120, 140)
  await sleep(600)
  if (abort) return

  setStep(2)
  think(thoughts[1] || '识别三档套餐')
  logAction(actions[1] || '提取页面 · 套餐卡片')
  moveCursor(280, 260)
  await sleep(550)

  setStep(3)
  $('#plan-starter')?.classList.add('spotlight')
  think(thoughts[2] || '阅读入门版')
  logAction(actions[2] || '高亮 · 入门版', 'click')
  moveCursor(180, 300)
  await sleep(600)
  $('#plan-starter')?.classList.remove('spotlight')

  setStep(4)
  $('#plan-pro')?.classList.add('spotlight')
  think(thoughts[3] || '阅读专业版')
  logAction(actions[3] || '点击 · 专业版', 'click')
  moveCursor(360, 290)
  await sleep(650)
  $('#plan-pro')?.classList.remove('spotlight')

  setStep(5)
  $('#plan-scale')?.classList.add('spotlight')
  think(thoughts[4] || '阅读企业版')
  logAction(actions[4] || '阅读 · 企业版', 'click')
  moveCursor(520, 300)
  await sleep(600)
  $('#plan-scale')?.classList.remove('spotlight')

  setStep(6)
  think(thoughts[5] || '汇总结构化字段')
  logAction(actions[5] || '结构化输出', 'extract')
  await sleep(450)

  setStep(7)
  extractBody.innerHTML = `
    <tr><td>入门版</td><td>¥199</td><td>1 万积分 · 1 个工作区</td></tr>
    <tr><td>专业版</td><td>¥699</td><td>MCP 工具 · 优先队列</td></tr>
    <tr><td>企业版</td><td>¥1999</td><td>单点登录 · 专属客户成功</td></tr>
  `
  extractEl.hidden = false
  think(plan.extract_hint || thoughts[6] || '抽取完成')
  logAction('完成 · 已抽取对比表', 'extract')
  setStep(8)
}

async function runFormFlow(plan) {
  extractEl.hidden = true
  urlEl.textContent = 'https://招聘.示例/申请/agent-工程师'
  renderForm()
  showHud(true)
  const thoughts = plan.thoughts || []
  const actions = plan.actions || []

  setStep(1)
  think(thoughts[0] || '进入申请页')
  logAction(actions[0] || '导航 → /申请')
  moveCursor(140, 160)
  await sleep(500)

  const fields = [
    ['f-name', '施宏威', 2, actions[1] || '输入 · 姓名'],
    ['f-email', '15587742070@163.com', 3, actions[2] || '输入 · 邮箱'],
    ['f-site', 'https://resume-due.pages.dev/', 4, actions[3] || '输入 · 作品集'],
  ]
  for (let i = 0; i < fields.length; i++) {
    const [id, value, step, label] = fields[i]
    if (abort) return
    setStep(step)
    const input = $(`#${id}`)
    moveCursor(input.offsetLeft + 80, input.offsetTop + 120)
    think(thoughts[i + 1] || label)
    logAction(label, 'type')
    await sleep(280)
    input.value = ''
    for (const ch of value) {
      if (abort) return
      input.value += ch
      await sleep(22)
    }
    input.classList.add('filled')
    await sleep(180)
  }

  setStep(5)
  const file = $('#f-resume')
  moveCursor(file.offsetLeft + 100, file.offsetTop + 130)
  think(thoughts[5] || '上传简历')
  logAction(actions[4] || '上传文件 · 简历.pdf', 'click')
  await sleep(400)
  file.textContent = '✓ 简历.pdf（248 KB）'
  file.classList.add('done')

  setStep(6)
  const submit = $('#f-submit')
  moveCursor(submit.offsetLeft + 80, submit.offsetTop + 140)
  think(thoughts[6] || '提交申请')
  logAction(actions[5] || '点击 · 提交申请', 'click')
  await sleep(400)
  submit.classList.add('pulse')
  await sleep(400)

  setStep(8)
  think(plan.extract_hint || '申请已提交')
  logAction('完成 · 申请已提交', 'extract')
  pageEl.innerHTML = `<div class="splash"><strong>申请已提交</strong><p>感谢投递，我们将尽快审阅你的作品集。</p></div>`
}

async function runSearchFlow(plan) {
  extractEl.hidden = true
  urlEl.textContent = 'https://github.com/search'
  renderSearch()
  showHud(true)
  const thoughts = plan.thoughts || []
  const actions = plan.actions || []

  setStep(1)
  think(thoughts[0] || '打开仓库搜索')
  logAction(actions[0] || '导航 → 仓库搜索')
  moveCursor(160, 150)
  await sleep(450)

  setStep(2)
  const q = $('#q')
  const query = 'browser-use 版本'
  think(thoughts[1] || `输入：${query}`)
  moveCursor(220, 170)
  logAction(actions[1] || '输入 · 搜索关键词', 'type')
  for (const ch of query) {
    if (abort) return
    q.value += ch
    await sleep(28)
  }
  await sleep(300)

  setStep(4)
  urlEl.textContent = 'https://github.com/browser-use/browser-use/releases'
  $('#r1')?.classList.add('spotlight')
  think(thoughts[2] || '进入版本发布页')
  logAction(actions[2] || '点击 · browser-use/browser-use', 'click')
  moveCursor(240, 250)
  await sleep(600)

  setStep(6)
  pageEl.innerHTML = `
    <div class="page-inner">
      <h2>版本发布</h2>
      <p class="sub">browser-use/browser-use</p>
      <div class="result spotlight" style="background:#fff;border:1px solid rgba(18,22,28,.1);border-radius:.65rem;padding:.85rem;">
        <strong>v0.13.7</strong>
        <span style="display:block;margin-top:.35rem;color:#5a6573;font-size:.85rem;">命令行 3.0 · 演示面板 · MCP 服务增强</span>
      </div>
    </div>
  `
  think(thoughts[3] || '提取版本信息')
  logAction(actions[3] || '抽取 · 版本号与亮点', 'extract')
  await sleep(550)

  setStep(8)
  think(plan.extract_hint || thoughts[4] || '情报检索完成')
  logAction('完成 · 已记录版本说明', 'extract')
}

async function start() {
  if (running) return
  running = true
  abort = false
  runBtn.disabled = true
  stopBtn.disabled = false
  actionsEl.innerHTML = ''
  extractEl.hidden = true
  cursorEl.hidden = true
  showHud(false)
  setStep(0)
  if (modelEl) modelEl.textContent = 'deepseek-v4-pro'

  const task = taskEl.value.trim()
  const scenario = detectScenario(task)

  try {
    const plan = await planWithModel(task, scenario)
    if (abort) return finish()
    totalSteps = 8
    if (scenario === 'form') await runFormFlow(plan)
    else if (scenario === 'search') await runSearchFlow(plan)
    else await runPricingFlow(plan)
  } catch (err) {
    think(`规划失败：${err.message || err}`)
    logAction(`错误：${err.message || err}`)
  }

  finish()
}

function finish() {
  running = false
  runBtn.disabled = false
  stopBtn.disabled = true
  if (abort) {
    think('已停止。可修改任务后重新启动。')
    logAction('已由用户中止')
  }
}

runBtn.addEventListener('click', start)
stopBtn.addEventListener('click', () => {
  abort = true
})

document.querySelectorAll('#presets button').forEach((btn) => {
  btn.addEventListener('click', () => {
    taskEl.value = btn.dataset.task
  })
})

if (modelEl) modelEl.textContent = 'deepseek-v4-pro'
think('等待任务…将调用 deepseek-v4-pro 规划浏览器动作')

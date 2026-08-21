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

let abort = false
let running = false
const totalSteps = 8

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

async function runPricingFlow() {
  urlEl.textContent = 'https://星云云.示例/定价'
  renderPricing()
  showHud(true)
  setStep(1)
  think('打开目标站点，定位定价区块与三档套餐卡片。')
  logAction('导航 → /定价')
  moveCursor(120, 140)
  await sleep(700)
  if (abort) return

  setStep(2)
  think('识别页面：入门版 / 专业版 / 企业版。优先读取价格与功能列表。')
  logAction('提取页面 · 3 张套餐卡片')
  moveCursor(280, 260)
  await sleep(650)

  setStep(3)
  $('#plan-starter')?.classList.add('spotlight')
  think('聚焦入门版：¥199 / 月，适合轻量试用。')
  logAction('高亮 · 入门版卡片', 'click')
  moveCursor(180, 300)
  await sleep(700)
  $('#plan-starter')?.classList.remove('spotlight')

  setStep(4)
  $('#plan-pro')?.classList.add('spotlight')
  think('专业版含 MCP 工具与优先队列，性价比最高。')
  logAction('点击 · 专业版卡片', 'click')
  moveCursor(360, 290)
  await sleep(750)
  $('#plan-pro')?.classList.remove('spotlight')

  setStep(5)
  $('#plan-scale')?.classList.add('spotlight')
  think('企业版面向团队：单点登录 + 审计，需销售对接。')
  logAction('滚动并阅读 · 企业版', 'click')
  moveCursor(520, 300)
  await sleep(700)
  $('#plan-scale')?.classList.remove('spotlight')

  setStep(6)
  think('汇总结构化字段：套餐 / 月费 / 亮点。')
  logAction('结构化输出 · 价格对比', 'extract')
  await sleep(600)

  setStep(7)
  extractBody.innerHTML = `
    <tr><td>入门版</td><td>¥199</td><td>1 万积分 · 1 个工作区</td></tr>
    <tr><td>专业版</td><td>¥699</td><td>MCP 工具 · 优先队列</td></tr>
    <tr><td>企业版</td><td>¥1999</td><td>单点登录 · 专属客户成功</td></tr>
  `
  extractEl.hidden = false
  think('抽取完成。三档对比表已就绪，可导出给产品评审。')
  logAction('完成 · 已抽取 3 行', 'extract')
  setStep(8)
}

async function runFormFlow() {
  extractEl.hidden = true
  urlEl.textContent = 'https://招聘.示例/申请/agent-工程师'
  renderForm()
  showHud(true)
  setStep(1)
  think('进入申请页，读取必填字段与上传控件。')
  logAction('导航 → /申请')
  moveCursor(140, 160)
  await sleep(600)

  const fields = [
    ['f-name', '施宏威', 2, '输入 · 姓名'],
    ['f-email', '15587742070@163.com', 3, '输入 · 邮箱'],
    ['f-site', 'https://resume-shihongwei.pages.dev/', 4, '输入 · 作品集'],
  ]
  for (const [id, value, step, label] of fields) {
    if (abort) return
    setStep(step)
    const input = $(`#${id}`)
    moveCursor(input.offsetLeft + 80, input.offsetTop + 120)
    const fieldName = { 'f-name': '姓名', 'f-email': '邮箱', 'f-site': '作品集' }[id]
    think(`填写${fieldName}…`)
    logAction(label, 'type')
    await sleep(400)
    input.value = ''
    for (const ch of value) {
      if (abort) return
      input.value += ch
      await sleep(28)
    }
    input.classList.add('filled')
    await sleep(250)
  }

  setStep(5)
  const file = $('#f-resume')
  moveCursor(file.offsetLeft + 100, file.offsetTop + 130)
  think('上传简历文件 简历.pdf')
  logAction('上传文件 · 简历.pdf', 'click')
  await sleep(500)
  file.textContent = '✓ 简历.pdf（248 KB）'
  file.classList.add('done')

  setStep(6)
  const submit = $('#f-submit')
  moveCursor(submit.offsetLeft + 80, submit.offsetTop + 140)
  think('校验通过，提交申请。')
  logAction('点击 · 提交申请', 'click')
  await sleep(450)
  submit.classList.add('pulse')
  await sleep(500)

  setStep(8)
  think('申请已提交。表单填写与文件上传动作演示完成。')
  logAction('完成 · 申请已提交', 'extract')
  pageEl.innerHTML = `<div class="splash"><strong>申请已提交</strong><p>感谢投递，我们将尽快审阅你的作品集。</p></div>`
}

async function runSearchFlow() {
  extractEl.hidden = true
  urlEl.textContent = 'https://github.com/search'
  renderSearch()
  showHud(true)
  setStep(1)
  think('打开仓库搜索，准备查询 Browser-Use 最新版本。')
  logAction('导航 → 仓库搜索')
  moveCursor(160, 150)
  await sleep(500)

  setStep(2)
  const q = $('#q')
  const query = 'browser-use 版本'
  think(`输入检索词：${query}`)
  moveCursor(220, 170)
  logAction('输入 · 搜索关键词', 'type')
  for (const ch of query) {
    if (abort) return
    q.value += ch
    await sleep(35)
  }
  await sleep(400)

  setStep(4)
  urlEl.textContent = 'https://github.com/browser-use/browser-use/releases'
  $('#r1')?.classList.add('spotlight')
  think('定位主仓库，进入版本发布页查看最新版本。')
  logAction('点击 · browser-use/browser-use', 'click')
  moveCursor(240, 250)
  await sleep(700)

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
  think('提取版本 v0.13.7 与亮点：命令行 3.0、演示面板、MCP。')
  logAction('抽取 · 版本号与亮点', 'extract')
  await sleep(700)

  setStep(8)
  think('情报检索完成，可写入知识库或周报。')
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

  const task = taskEl.value.trim()
  think(`规划任务：${task}`)
  logAction('启动智能体（最多 8 步）')
  await sleep(500)
  if (abort) return finish()

  const scenario = detectScenario(task)
  if (scenario === 'form') await runFormFlow()
  else if (scenario === 'search') await runSearchFlow()
  else await runPricingFlow()

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

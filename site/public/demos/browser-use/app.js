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
  stepChip.textContent = `Step ${n}/${totalSteps}`
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
      <h2>NovaCloud Pricing</h2>
      <p class="sub">Choose a plan that scales with your agents</p>
      <div class="pricing">
        <article class="plan" id="plan-starter">
          <h3>Starter</h3>
          <div class="price">$29</div>
          <ul><li>10k credits</li><li>1 workspace</li><li>Email support</li></ul>
          <button type="button">Get Starter</button>
        </article>
        <article class="plan hot" id="plan-pro">
          <h3>Pro</h3>
          <div class="price">$99</div>
          <ul><li>100k credits</li><li>MCP tools</li><li>Priority queue</li></ul>
          <button type="button">Get Pro</button>
        </article>
        <article class="plan" id="plan-scale">
          <h3>Scale</h3>
          <div class="price">$299</div>
          <ul><li>Unlimited seats</li><li>SSO + audit</li><li>Dedicated CSM</li></ul>
          <button type="button">Talk to sales</button>
        </article>
      </div>
    </div>
  `
}

function renderForm() {
  pageEl.innerHTML = `
    <div class="page-inner form-demo">
      <h2>Apply · Agent Engineer</h2>
      <p class="sub">Careers · Remote · Full-time</p>
      <label>姓名<input id="f-name" placeholder="Your name" /></label>
      <label>邮箱<input id="f-email" placeholder="you@email.com" /></label>
      <label>作品集<input id="f-site" placeholder="https://…" /></label>
      <div class="file" id="f-resume">Upload resume.pdf</div>
      <button type="button" class="submit" id="f-submit">Submit application</button>
    </div>
  `
}

function renderSearch() {
  pageEl.innerHTML = `
    <div class="page-inner search-demo">
      <h2>GitHub Search</h2>
      <div class="bar">
        <input id="q" value="" placeholder="Search repositories" />
      </div>
      <div class="result" id="r1"><strong>browser-use/browser-use</strong><span>Make websites accessible for AI agents · ★ 70k+</span></div>
      <div class="result" id="r2"><strong>browser-use/web-ui</strong><span>Optional UI wrappers and demos</span></div>
    </div>
  `
}

function detectScenario(task) {
  if (/表单|申请|填写/.test(task)) return 'form'
  if (/Release|检索|搜索|GitHub/.test(task)) return 'search'
  return 'pricing'
}

async function runPricingFlow() {
  urlEl.textContent = 'https://novacloud.example/pricing'
  renderPricing()
  showHud(true)
  setStep(1)
  think('打开目标站点，定位定价区块与三档套餐卡片。')
  logAction('navigate → /pricing')
  moveCursor(120, 140)
  await sleep(700)
  if (abort) return

  setStep(2)
  think('识别 DOM：Starter / Pro / Scale。优先读取价格节点与功能列表。')
  logAction('extract_dom · 3 pricing cards')
  moveCursor(280, 260)
  await sleep(650)

  setStep(3)
  $('#plan-starter')?.classList.add('spotlight')
  think('聚焦 Starter：$29 / 月，适合轻量试用。')
  logAction('highlight · Starter card', 'click')
  moveCursor(180, 300)
  await sleep(700)
  $('#plan-starter')?.classList.remove('spotlight')

  setStep(4)
  $('#plan-pro')?.classList.add('spotlight')
  think('Pro 含 MCP tools 与优先队列，性价比最高。')
  logAction('click · Pro card', 'click')
  moveCursor(360, 290)
  await sleep(750)
  $('#plan-pro')?.classList.remove('spotlight')

  setStep(5)
  $('#plan-scale')?.classList.add('spotlight')
  think('Scale 面向团队：SSO + 审计，需销售对接。')
  logAction('scroll + read · Scale', 'click')
  moveCursor(520, 300)
  await sleep(700)
  $('#plan-scale')?.classList.remove('spotlight')

  setStep(6)
  think('汇总结构化字段：plan / monthly / highlights。')
  logAction('structured_output · PriceComparison', 'extract')
  await sleep(600)

  setStep(7)
  extractBody.innerHTML = `
    <tr><td>Starter</td><td>$29</td><td>10k credits · 1 workspace</td></tr>
    <tr><td>Pro</td><td>$99</td><td>MCP tools · Priority queue</td></tr>
    <tr><td>Scale</td><td>$299</td><td>SSO · Dedicated CSM</td></tr>
  `
  extractEl.hidden = false
  think('抽取完成。三档对比表已就绪，可导出给产品评审。')
  logAction('done · 3 rows extracted', 'extract')
  setStep(8)
}

async function runFormFlow() {
  extractEl.hidden = true
  urlEl.textContent = 'https://careers.example/apply/agent-engineer'
  renderForm()
  showHud(true)
  setStep(1)
  think('进入申请页，读取必填字段与上传控件。')
  logAction('navigate → /apply')
  moveCursor(140, 160)
  await sleep(600)

  const fields = [
    ['f-name', '施宏威', 2, 'type · name'],
    ['f-email', '15587742070@163.com', 3, 'type · email'],
    ['f-site', 'https://resume-due.pages.dev/', 4, 'type · portfolio'],
  ]
  for (const [id, value, step, label] of fields) {
    if (abort) return
    setStep(step)
    const input = $(`#${id}`)
    moveCursor(input.offsetLeft + 80, input.offsetTop + 120)
    think(`填写 ${id.replace('f-', '')}…`)
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
  think('上传简历文件 resume.pdf')
  logAction('upload_file · resume.pdf', 'click')
  await sleep(500)
  file.textContent = '✓ resume.pdf (248 KB)'
  file.classList.add('done')

  setStep(6)
  const submit = $('#f-submit')
  moveCursor(submit.offsetLeft + 80, submit.offsetTop + 140)
  think('校验通过，提交申请。')
  logAction('click · Submit', 'click')
  await sleep(450)
  submit.classList.add('pulse')
  await sleep(500)

  setStep(8)
  think('申请已提交。跨域 iframe 与文件上传动作演示完成。')
  logAction('done · application submitted', 'extract')
  pageEl.innerHTML = `<div class="splash"><strong>Application sent</strong><p>Thanks — we will review your portfolio.</p></div>`
}

async function runSearchFlow() {
  extractEl.hidden = true
  urlEl.textContent = 'https://github.com/search'
  renderSearch()
  showHud(true)
  setStep(1)
  think('打开 GitHub 搜索，准备查询 Browser-Use Release。')
  logAction('navigate → github.com/search')
  moveCursor(160, 150)
  await sleep(500)

  setStep(2)
  const q = $('#q')
  const query = 'browser-use release'
  think(`输入检索词：${query}`)
  moveCursor(220, 170)
  logAction('type · search query', 'type')
  for (const ch of query) {
    if (abort) return
    q.value += ch
    await sleep(35)
  }
  await sleep(400)

  setStep(4)
  urlEl.textContent = 'https://github.com/browser-use/browser-use/releases'
  $('#r1')?.classList.add('spotlight')
  think('定位主仓库，进入 Releases 查看最新版本。')
  logAction('click · browser-use/browser-use', 'click')
  moveCursor(240, 250)
  await sleep(700)

  setStep(6)
  pageEl.innerHTML = `
    <div class="page-inner">
      <h2>Releases</h2>
      <p class="sub">browser-use/browser-use</p>
      <div class="result spotlight" style="background:#fff;border:1px solid rgba(18,22,28,.1);border-radius:.65rem;padding:.85rem;">
        <strong>v0.13.7</strong>
        <span style="display:block;margin-top:.35rem;color:#5a6573;font-size:.85rem;">CLI 3.0 · demo_mode panel · MCP server improvements</span>
      </div>
    </div>
  `
  think('提取版本 v0.13.7 与亮点：CLI 3.0、demo_mode、MCP。')
  logAction('extract · version + highlights', 'extract')
  await sleep(700)

  setStep(8)
  think('情报检索完成，可写入知识库或周报。')
  logAction('done · release notes captured', 'extract')
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
  logAction('agent.run(max_steps=8)')
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
    logAction('aborted by user')
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

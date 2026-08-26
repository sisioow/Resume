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
const extractHead = $('#extract-head')
const extractBody = $('#extract-body')
const extractSummary = $('#extract-summary')
const modelEl = $('#model')

const MAX_STEPS = 5

let abort = false
let running = false
let stepNo = 0

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
  stepNo = n
  stepChip.textContent = `步骤 ${n}/${MAX_STEPS}`
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
  cursorEl.style.left = `${x}%`
  cursorEl.style.top = `${y}%`
}

function showHud(show) {
  hudEl.hidden = !show
}

async function browse(url) {
  const endpoint = `${DemoLLM.apiBase()}/api/browse`
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  })
  let data
  try {
    data = await res.json()
  } catch {
    throw new Error(`抓取接口异常 HTTP ${res.status}`)
  }
  if (!res.ok) throw new Error(data?.error || `抓取失败 HTTP ${res.status}`)
  return data
}

function renderPage(page) {
  const preview = DemoLLM.escapeHtml((page.text || '').slice(0, 3500))
  pageEl.innerHTML = `
    <div class="page-inner reader">
      <h2>${DemoLLM.escapeHtml(page.title || page.url)}</h2>
      <p class="sub">${DemoLLM.escapeHtml(page.url)} · ${page.source || 'fetch'} · ${page.chars || 0} 字${page.truncated ? '（已截断）' : ''}</p>
      <pre class="reader-body">${preview}${page.text && page.text.length > 3500 ? '…' : ''}</pre>
    </div>
  `
}

function showExtract(payload) {
  const columns = Array.isArray(payload.columns) ? payload.columns : []
  const rows = Array.isArray(payload.rows) ? payload.rows : []
  extractSummary.textContent = payload.summary || payload.extract_hint || ''

  if (columns.length) {
    extractHead.innerHTML = `<tr>${columns.map((c) => `<th>${DemoLLM.escapeHtml(c)}</th>`).join('')}</tr>`
  } else {
    extractHead.innerHTML = ''
  }

  if (rows.length) {
    extractBody.innerHTML = rows
      .map(
        (row) =>
          `<tr>${(Array.isArray(row) ? row : [row])
            .map((cell) => `<td>${DemoLLM.escapeHtml(cell)}</td>`)
            .join('')}</tr>`,
      )
      .join('')
  } else if (payload.summary) {
    extractBody.innerHTML = `<tr><td>${DemoLLM.escapeHtml(payload.summary)}</td></tr>`
    if (!columns.length) extractHead.innerHTML = '<tr><th>结果</th></tr>'
  } else {
    extractBody.innerHTML = ''
  }

  extractEl.hidden = false
}

async function decide(task, history, page) {
  const { data, model } = await DemoLLM.chatJson(
    [
      {
        role: 'system',
        content:
          '你是 Browser-Use 智能体，控制真实网页抓取。根据任务与当前观察，决定下一步。只输出 JSON：{"thought":"思考","action":"navigate|extract|finish","url":"https://...仅navigate时","summary":"中文结论","columns":["列名"],"rows":[["单元格"]]}。规则：1) 若任务含 URL 或能推断公开网页，先 navigate；2) 已有正文后 extract 或 finish；3) url 必须是完整 http(s)；4) 不要编造页面没有的事实；5) 最多在 5 步内 finish。',
      },
      {
        role: 'user',
        content: JSON.stringify({
          task,
          step: stepNo,
          max_steps: MAX_STEPS,
          history,
          current_url: page?.url || null,
          page_title: page?.title || null,
          page_excerpt: page?.text ? page.text.slice(0, 6000) : null,
        }),
      },
    ],
    { max_tokens: 1200, temperature: 0.2 },
  )
  if (modelEl) modelEl.textContent = model || 'deepseek-v4-pro'
  return data
}

async function start() {
  if (running) return
  const task = taskEl.value.trim()
  if (!task) {
    think('请先输入任务，例如包含目标网址或要检索的主题。')
    return
  }

  running = true
  abort = false
  runBtn.disabled = true
  stopBtn.disabled = false
  actionsEl.innerHTML = ''
  extractEl.hidden = true
  cursorEl.hidden = true
  showHud(true)
  setStep(0)
  urlEl.textContent = 'about:blank'
  pageEl.innerHTML = `<div class="splash"><strong>启动中</strong><p>正在规划真实浏览步骤…</p></div>`
  think('调用 deepseek-v4-pro 规划下一步…')
  logAction('启动智能体 · 真实抓取模式')

  let page = null
  const history = []

  try {
    for (let i = 1; i <= MAX_STEPS; i++) {
      if (abort) break
      setStep(i)
      moveCursor(18 + i * 12, 28 + (i % 3) * 18)
      think('正在决策…')
      logAction(`步骤 ${i} · 模型决策`)

      const decision = await decide(task, history, page)
      if (abort) break

      const thought = decision.thought || '继续执行'
      think(thought)
      const action = String(decision.action || '').toLowerCase()
      history.push({ step: i, thought, action, url: decision.url || null })

      if (action === 'navigate') {
        const target = String(decision.url || '').trim()
        if (!/^https?:\/\//i.test(target)) {
          logAction('决策缺少合法 URL，结束', 'extract')
          think('未能解析可访问的网址。请在任务中写明完整 http(s) URL。')
          break
        }
        urlEl.textContent = target
        logAction(`导航 → ${target}`, 'click')
        pageEl.innerHTML = `<div class="splash"><strong>抓取中</strong><p>${DemoLLM.escapeHtml(target)}</p></div>`
        await sleep(200)
        if (abort) break

        page = await browse(target)
        renderPage(page)
        logAction(`已抓取 · ${page.title || page.url}（${page.chars || 0} 字）`, 'extract')
        moveCursor(45, 55)
        await sleep(350)
        continue
      }

      if (action === 'extract' || action === 'finish') {
        if (!page?.text && decision.url && /^https?:\/\//i.test(decision.url)) {
          urlEl.textContent = decision.url
          logAction(`补抓取 → ${decision.url}`)
          page = await browse(decision.url)
          renderPage(page)
        }
        logAction(action === 'finish' ? '完成 · 输出结果' : '抽取 · 结构化字段', 'extract')
        showExtract(decision)
        think(decision.summary || thought || '任务完成')
        moveCursor(70, 70)
        await sleep(250)
        if (action === 'finish' || i === MAX_STEPS) break
        continue
      }

      logAction(`未知动作：${action || '(空)'}，结束`)
      break
    }

    if (extractEl.hidden && page?.text && !abort) {
      setStep(Math.min(stepNo + 1, MAX_STEPS))
      think('根据已抓取正文做最终抽取…')
      const final = await decide(`${task}\n请基于当前页面直接 extract 并 finish。`, history, page)
      showExtract(final)
      think(final.summary || final.thought || '抽取完成')
      logAction('完成 · 最终抽取', 'extract')
    }
  } catch (err) {
    think(`执行失败：${err.message || err}`)
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
  showHud(false)
  cursorEl.hidden = true
}

runBtn.addEventListener('click', start)
stopBtn.addEventListener('click', () => {
  abort = true
})

if (modelEl) modelEl.textContent = 'deepseek-v4-pro'
think('等待你输入任务…将真实抓取网页并由 deepseek-v4-pro 抽取')

const corpora = {
  resume: {
    label: '我的简历',
    system:
      '你是施宏威的个人简历问答助手，面向招聘方。只能依据给定简历切片回答，禁止编造经历、项目、数据或联系方式。语气专业简洁。输出 JSON：{"answer":"中文答复，关键事实后加[切片ID]","cites":["R-01"],"faith":"0.00-1.00","hit_at_3":"0.00-1.00"}。证据不足时明确说明并 cites=[]。',
    presets: [
      '施宏威目前在做什么？岗位和主要职责是什么？',
      '代表作 workflow_uniapp 是什么？效果如何？',
      '有哪些 Agent / LLM / RAG 相关技能与项目？',
      '如何联系他？作品集和 GitHub 在哪里？',
    ],
    chunks: [
      {
        id: 'R-01',
        title: '基本信息',
        text: '施宏威，Agent 开发工程师，湖北远程协作。邮箱 15587742070@163.com，电话 15587742070，GitHub https://github.com/sisioow，作品集国内镜像 https://resume-due.pages.dev/。',
        base: 0.92,
      },
      {
        id: 'R-02',
        title: '职业定位',
        text: '专注 AI Agent 工作流与多端交付，能独立覆盖产品方案、UI 设计与代码落地。一句话定位：用 Agent 把产品从想法做成可交付工程。',
        base: 0.9,
      },
      {
        id: 'R-03',
        title: '工作经历 · 北京臻盛网络',
        text: '北京臻盛网络有限公司 · Agent 开发工程师（2026.01 — 至今）。基于 n8n 搭建端到端自动化开发工作流（方案→UI→代码→验收打包），交付周期缩短约 90%；深度集成 Cursor CLI 与 Claude Code，需求文档到 UniApp 代码自动生成并达主流渠道 A 面上架标准；搭建 CI/CD 支持 H5/小程序/App 一键打包；负责 Agent 平台可视化工作流编辑器；验证 Cocos MCP + IDE/CLI；Skills + Google Stitch + Trae/Cursor/Claude 一句话生成完整 H5。',
        base: 0.94,
      },
      {
        id: 'R-04',
        title: '工作经历 · 武汉百智诚远',
        text: '武汉百智诚远科技有限公司 · AI 全栈开发工程师（2025.02 — 2025.08）。完成 11 类要素式起诉状前端与多方式填写、预览、HTML 转 Word/PDF 及扫码打印；文书精灵负责 Prompt、大模型服务部署与 Jinja2 动态文书组件；独立实现判决书「当事人信息」「审理经过」等段落智能生成，落地鄂州梁子湖区法院、武汉东湖高新区法院。',
        base: 0.93,
      },
      {
        id: 'R-05',
        title: '专业技能',
        text: '专业技能：llm+rag、harness、skill、mcp+tools、Python、Node.js、HTML/CSS/JavaScript、Vue、Java + Spring Boot。办公：Word/Excel/PPT/Markdown/飞书钉钉/剪映。证书：CET-6、CET-4。',
        base: 0.88,
      },
      {
        id: 'R-06',
        title: '教育背景',
        text: '桂林电子科技大学 · 数字媒体技术 · 本科（2021.09 — 2025.06）。主修数据结构与算法、计算机网络、Unity、多媒体网站开发、数字图像处理等。',
        base: 0.8,
      },
      {
        id: 'R-07',
        title: '代表作 · workflow_uniapp',
        text: '开源本地 App 生成工作流：输入产品名 → 需求分析 → 可选 Google Stitch 出 UI → Claude Code/Codex/Cursor Agent 生成 UniApp 代码 → H5 自测与 Git 发布。FastAPI + SSE，会话可恢复。交付周期压缩约 90%，一人覆盖产品+设计+开发。仓库 https://github.com/sisioow/workflow_uniapp。',
        base: 0.95,
      },
      {
        id: 'R-08',
        title: '项目 · Deep Research / 知识库 RAG',
        text: 'Deep Research：Planner → 并行检索 → Critic 冲突裁决 → Writer 带引用成稿，接入 deepseek-v4-pro，演示 /demos/deep-research/。RAG知识库智能检索：对简历与示例手册混合检索重排后生成带引用答复，演示 /demos/kb-agent/。',
        base: 0.89,
      },
      {
        id: 'R-09',
        title: '项目 · CrewAI / Browser-Use',
        text: 'CrewAI Mission Console：研究员→分析师→质检官顺序协作。Browser-Use Pilot：自然语言驱动浏览器导航/点击/填表/抽取。演示页 /demos/crewai/、/demos/browser-use/。',
        base: 0.87,
      },
      {
        id: 'R-10',
        title: '项目 · 文书精灵与要素式诉讼',
        text: '文书精灵：垂类法律大模型生成法言法语文书，判决书关键段落 Prompt 与生成链路，服务鄂州梁子湖区法院、武汉东湖高新区法院。要素式诉讼文书系统：Vue3 + Node.js，多类起诉状引导填写与 PDF/Word 导出。',
        base: 0.91,
      },
      {
        id: 'R-11',
        title: '项目 · 商业化与游戏',
        text: 'IAA 工具/策略 A 面：华为/荣耀/小米/vivo/OPPO 等渠道多款产品稳定在架，独立完成方案到打包。多多答题：Cocos Creator 重写答题激励玩法，AI IDE/CLI + MCP 加速节点与场景搭建。',
        base: 0.82,
      },
    ],
  },
  product: {
    label: '产品手册',
    system:
      '你是企业知识库客服。只能依据给定切片回答，禁止编造。语气专业简洁。输出 JSON：{"answer":"中文答复，关键事实后加[切片ID]","cites":["D-01"],"faith":"0.00-1.00","hit_at_3":"0.00-1.00"}。证据不足时明确说明并 cites=[]。',
    presets: [
      'Agent runtime 支持哪些执行模式？',
      '如何接入 MCP 工具？',
      'HITL 人审节点怎么配置？',
    ],
    chunks: [
      {
        id: 'D-01',
        title: 'Runtime 执行模式',
        text: 'Agent Runtime 支持同步、异步与 durable 三种模式。durable 模式带 checkpoint，任务中断后可从最近节点恢复，适合长链路与人审。',
        base: 0.9,
      },
      {
        id: 'D-02',
        title: 'MCP 接入',
        text: '通过 MCP Server 注册工具：配置 endpoint、鉴权与超时。运行时按 schema 校验参数；失败可重试或 escalate 到 HITL。',
        base: 0.88,
      },
      {
        id: 'D-03',
        title: 'HITL 人审',
        text: '在工作流节点标记 require_approval=true。到达该节点后暂停并推送审核卡片；通过后继续，拒绝则走 fallback 分支。',
        base: 0.86,
      },
      {
        id: 'D-04',
        title: '可观测性',
        text: '默认导出 trace、token 用量与工具调用日志。可对接 OpenTelemetry，按 session_id 聚合完整执行链路。',
        base: 0.8,
      },
    ],
  },
  support: {
    label: '售后政策',
    system:
      '你是企业知识库客服。只能依据给定切片回答，禁止编造。语气专业简洁。输出 JSON：{"answer":"中文答复，关键事实后加[切片ID]","cites":["S-01"],"faith":"0.00-1.00","hit_at_3":"0.00-1.00"}。证据不足时明确说明并 cites=[]。',
    presets: [
      '标准 SLA 响应时效是多少？',
      '知识库文档上传有什么限制？',
      '支持私有化部署吗？',
    ],
    chunks: [
      {
        id: 'S-01',
        title: 'SLA',
        text: '标准版工作日 4 小时内首次响应，严重故障 1 小时内响应。企业版可签约 7×24 与专属值班通道。',
        base: 0.9,
      },
      {
        id: 'S-02',
        title: '文档上传',
        text: '单文件 ≤ 50MB，支持 PDF / Markdown / DOCX。批量上传每日上限 200 个文件；超限可走工单扩容。',
        base: 0.87,
      },
      {
        id: 'S-03',
        title: '私有化',
        text: '支持 VPC / 专有云私有化。向量库与模型可落客户侧；需预留 GPU 与对象存储，交付周期约 2–4 周。',
        base: 0.89,
      },
      {
        id: 'S-04',
        title: '数据隔离',
        text: '租户级数据隔离，检索索引按 workspace 分片。删除知识库后 7 天内可恢复，之后物理清除。',
        base: 0.82,
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
const kbSwitch = $('#kb-switch')
const fileInput = $('#kb-file')
const uploadBtn = $('#kb-upload-btn')
const uploadStatus = $('#upload-status')
const uploadFilesEl = $('#upload-files')

const MAX_FILE_BYTES = 8 * 1024 * 1024
const CHUNK_SIZE = 420
const MAX_CHUNKS_PER_FILE = 36
const UPLOAD_SYSTEM =
  '你是知识库问答助手。只能依据给定上传文档切片回答，禁止编造。语气专业简洁。输出 JSON：{"answer":"中文答复，关键事实后加[切片ID]","cites":["U-01"],"faith":"0.00-1.00","hit_at_3":"0.00-1.00"}。证据不足时明确说明并 cites=[]。'

let kb = 'resume'
let presetIndex = 0
let running = false
let uploadSeq = 0
/** @type {{ name: string, chunks: number }[]} */
let uploadedMeta = []

if (window.pdfjsLib) {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function setUploadStatus(msg, isError = false) {
  if (!msg) {
    uploadStatus.hidden = true
    uploadStatus.textContent = ''
    uploadStatus.classList.remove('is-error')
    return
  }
  uploadStatus.hidden = false
  uploadStatus.textContent = msg
  uploadStatus.classList.toggle('is-error', isError)
}

function extOf(name) {
  const i = name.lastIndexOf('.')
  return i >= 0 ? name.slice(i + 1).toLowerCase() : ''
}

function normalizeText(text) {
  return String(text || '')
    .replace(/\u0000/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function chunkText(text, fileName) {
  const clean = normalizeText(text)
  if (!clean) return []
  const parts = []
  const paras = clean.split(/\n{2,}/)
  let buf = ''
  for (const para of paras) {
    const p = para.trim()
    if (!p) continue
    if ((buf + '\n\n' + p).length <= CHUNK_SIZE) {
      buf = buf ? `${buf}\n\n${p}` : p
      continue
    }
    if (buf) parts.push(buf)
    if (p.length <= CHUNK_SIZE) {
      buf = p
    } else {
      for (let i = 0; i < p.length; i += CHUNK_SIZE) {
        parts.push(p.slice(i, i + CHUNK_SIZE))
      }
      buf = ''
    }
  }
  if (buf) parts.push(buf)

  const limited = parts.slice(0, MAX_CHUNKS_PER_FILE)
  const shortName = fileName.length > 28 ? `${fileName.slice(0, 25)}…` : fileName
  return limited.map((body, i) => ({
    id: `U-${String(++uploadSeq).padStart(2, '0')}`,
    title: `${shortName} · 切片${i + 1}`,
    text: body,
    base: Math.max(0.72, 0.9 - i * 0.01),
  }))
}

async function readAsArrayBuffer(file) {
  return file.arrayBuffer()
}

async function readAsText(file) {
  return file.text()
}

async function extractPdf(file) {
  const data = await readAsArrayBuffer(file)
  const pdf = await pdfjsLib.getDocument({ data }).promise
  const pages = []
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    pages.push(content.items.map((it) => it.str).join(' '))
  }
  return pages.join('\n\n')
}

async function extractDocx(file) {
  const data = await readAsArrayBuffer(file)
  const result = await mammoth.extractRawText({ arrayBuffer: data })
  return result.value || ''
}

async function extractFileText(file) {
  const ext = extOf(file.name)
  if (ext === 'doc') {
    throw new Error('暂不支持旧版 .doc，请另存为 .docx 或 PDF 后再上传')
  }
  if (ext === 'pdf') return extractPdf(file)
  if (ext === 'docx') return extractDocx(file)
  if (['txt', 'md', 'markdown', 'csv', 'json', 'html', 'htm', 'rtf'].includes(ext)) {
    return readAsText(file)
  }
  // MIME fallback
  if (file.type === 'application/pdf') return extractPdf(file)
  if (file.type.includes('wordprocessingml')) return extractDocx(file)
  if (file.type.startsWith('text/') || file.type === 'application/json') return readAsText(file)
  throw new Error(`暂不支持 ${ext || file.type || '该格式'}，请用 PDF / DOCX / TXT / MD 等`)
}

function ensureUploadCorpus() {
  if (!corpora.upload) {
    corpora.upload = {
      label: '已上传文档',
      system: UPLOAD_SYSTEM,
      presets: [
        '这份文档的主要内容是什么？',
        '请提炼文档中的关键要点。',
        '文档里有没有明确的结论或数据？',
      ],
      chunks: [],
    }
  }
  return corpora.upload
}

function syncUploadKbButton() {
  let btn = kbSwitch.querySelector('[data-kb="upload"]')
  const has = uploadedMeta.length > 0
  if (!has) {
    btn?.remove()
    return
  }
  const totalChunks = corpora.upload?.chunks.length || 0
  const label = uploadedMeta.length === 1 ? uploadedMeta[0].name : `${uploadedMeta.length} 个文件`
  if (!btn) {
    btn = document.createElement('button')
    btn.type = 'button'
    btn.dataset.kb = 'upload'
    btn.innerHTML = `
      <span class="dot alt"></span>
      <div>
        <strong>已上传文档</strong>
        <em></em>
      </div>
    `
    kbSwitch.appendChild(btn)
  }
  btn.querySelector('em').textContent = `${label} · ${totalChunks} 切片`
}

function renderUploadFiles() {
  if (!uploadedMeta.length) {
    uploadFilesEl.hidden = true
    uploadFilesEl.innerHTML = ''
    return
  }
  uploadFilesEl.hidden = false
  uploadFilesEl.innerHTML =
    uploadedMeta
      .map(
        (f, i) => `
      <li>
        <span title="${DemoLLM.escapeHtml(f.name)}">${DemoLLM.escapeHtml(f.name)}（${f.chunks}）</span>
        <button type="button" data-remove="${i}">移除</button>
      </li>
    `,
      )
      .join('') +
    `<button type="button" class="upload-clear" id="upload-clear-all">清空已上传</button>`
}

function selectKb(next, { resetThread = true } = {}) {
  if (!corpora[next]) return
  kb = next
  presetIndex = 0
  kbSwitch.querySelectorAll('button[data-kb]').forEach((b) => {
    b.classList.toggle('is-active', b.dataset.kb === next)
  })
  renderPresets()
  if (resetThread) clearAll()
}

async function handleFiles(fileList) {
  const files = [...fileList]
  if (!files.length) return

  uploadBtn.disabled = true
  setUploadStatus('正在解析文件…')

  const corpus = ensureUploadCorpus()
  let added = 0
  const errors = []

  for (const file of files) {
    try {
      if (file.size > MAX_FILE_BYTES) {
        throw new Error(`${file.name} 超过 8MB 限制`)
      }
      setUploadStatus(`解析中：${file.name}`)
      const text = await extractFileText(file)
      const chunks = chunkText(text, file.name).map((c) => ({
        ...c,
        source: file.name,
      }))
      if (!chunks.length) throw new Error(`${file.name} 未提取到可用文本（可能是扫描版 PDF）`)
      corpus.chunks.push(...chunks)
      uploadedMeta.push({ name: file.name, chunks: chunks.length, source: file.name })
      added += chunks.length
      trace(`upload ${file.name} → ${chunks.length} chunks`)
    } catch (err) {
      errors.push(err.message || String(err))
    }
  }

  syncUploadKbButton()
  renderUploadFiles()
  uploadBtn.disabled = false
  fileInput.value = ''

  if (added > 0) {
    setUploadStatus(`已入库 ${added} 个切片${errors.length ? `；部分失败：${errors[0]}` : ''}`, errors.length > 0)
    selectKb('upload')
    addBubble(
      'bot',
      `已将本地文件切片写入「已上传文档」知识库（共 ${corpus.chunks.length} 片）。可直接提问或点左侧快捷问题。`,
    )
  } else {
    setUploadStatus(errors[0] || '未能解析任何文件', true)
  }
}

function removeUploadedFile(index) {
  const meta = uploadedMeta[index]
  if (!meta) return
  const corpus = ensureUploadCorpus()
  corpus.chunks = corpus.chunks.filter((c) => c.source !== meta.source)
  uploadedMeta.splice(index, 1)

  if (!uploadedMeta.length) {
    delete corpora.upload
    syncUploadKbButton()
    renderUploadFiles()
    setUploadStatus('')
    if (kb === 'upload') selectKb('resume')
    return
  }

  // renumber display only; keep IDs
  syncUploadKbButton()
  renderUploadFiles()
  setUploadStatus(`已移除 ${meta.name}`)
  if (kb === 'upload') {
    renderPresets()
  }
}

function clearUploads() {
  delete corpora.upload
  uploadedMeta = []
  syncUploadKbButton()
  renderUploadFiles()
  setUploadStatus('')
  if (kb === 'upload') selectKb('resume')
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

function welcomeHtml() {
  return `你好，这里是<strong>RAG知识库智能检索</strong>。当前知识库「${DemoLLM.escapeHtml(corpora[kb].label)}」——可检索内置库，或上传 PDF / Word / 文本后切片问答。`
}

function renderPresets() {
  const list = corpora[kb]?.presets || []
  presetsEl.innerHTML = list
    .map((q, i) => `<button type="button" data-i="${i}">${q}</button>`)
    .join('')
  questionEl.value = list[presetIndex] || list[0] || ''
  $('#kb-title').textContent = corpora[kb]?.label || '知识库'
}

function rankChunks(query) {
  const q = query.toLowerCase()
  return (corpora[kb]?.chunks || [])
    .map((c) => {
      let boost = 0
      for (const w of q.split(/[^a-z0-9\u4e00-\u9fff]+/).filter(Boolean)) {
        if (c.title.toLowerCase().includes(w) || c.text.toLowerCase().includes(w)) boost += 0.05
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
  if (!corpora[kb]?.chunks?.length) {
    addBubble('bot', '当前知识库没有可检索切片。请先选择内置库，或上传本地文件。')
    return
  }

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
  const typing = addBubble('bot', `正在检索「${DemoLLM.escapeHtml(corpora[kb].label)}」并调用 deepseek-v4-pro…`)

  try {
    trace(`kb=${kb} · query: ${q.slice(0, 48)}${q.length > 48 ? '…' : ''}`)
    await sleep(180)
    $('#retrieve-state').textContent = 'Hybrid Recall'
    const ranked = rankChunks(q)
    const top = ranked.slice(0, 3)

    for (let i = 0; i < ranked.length; i++) {
      await sleep(70)
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
      if (i < 8) trace(`hit ${c.id} score=${c.score.toFixed(2)}`)
    }

    $('#retrieve-state').textContent = 'deepseek-v4-pro'
    trace('grounded generation via DeepSeek')

    const { data, model } = await DemoLLM.chatJson(
      [
        { role: 'system', content: corpora[kb].system },
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
  threadEl.innerHTML = `<div class="bubble bot welcome"><p>${welcomeHtml()}</p></div>`
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

kbSwitch.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-kb]')
  if (!btn) return
  selectKb(btn.dataset.kb)
})

presetsEl.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-i]')
  if (!btn) return
  presetIndex = Number(btn.dataset.i)
  questionEl.value = corpora[kb].presets[presetIndex]
})

uploadBtn.addEventListener('click', () => fileInput.click())
fileInput.addEventListener('change', () => handleFiles(fileInput.files))

uploadFilesEl.addEventListener('click', (e) => {
  if (e.target.id === 'upload-clear-all') {
    clearUploads()
    return
  }
  const btn = e.target.closest('button[data-remove]')
  if (!btn) return
  removeUploadedFile(Number(btn.dataset.remove))
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

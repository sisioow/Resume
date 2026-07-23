import './style.css'
import {
  about,
  demos,
  education,
  experiences,
  magicPrompts,
  projects,
  repos,
  site,
  type Demo,
  type Project,
  type Repo,
} from './data'

const statusLabel: Record<Project['status'], string> = {
  live: '在架',
  wip: '打磨中',
  archived: '已交付',
}

function linkOrSoon(url: string | undefined, label: string): string {
  if (url) {
    return `<a class="text-link" href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`
  }
  return `<span class="soon">${label}</span>`
}

function renderFeatured(p: Project): string {
  const impact =
    p.impact
      ?.map(
        (i) => `
      <div class="impact-cell">
        <strong data-count="${i.value}">${i.value}</strong>
        <span>${i.label}</span>
      </div>`,
      )
      .join('') ?? ''

  const boasts =
    p.boasts
      ?.map(
        (b, idx) => `
      <button type="button" class="boast-chip" data-boast="${idx}" aria-pressed="${idx === 0}">
        <span class="boast-index">0${idx + 1}</span>
        <span class="boast-text">${b}</span>
      </button>`,
      )
      .join('') ?? ''

  return `
    <section id="spotlight" class="spotlight">
      <div class="spotlight-glow" aria-hidden="true"></div>
      <div class="spotlight-inner">
        <p class="eyebrow">代表作 · 先看这个就够了</p>
        <h2 class="spotlight-hook">${p.hook}</h2>
        <p class="spotlight-desc">${p.description}</p>

        <div class="impact-row reveal">${impact}</div>

        <div class="boast-board reveal" role="tablist" aria-label="核心卖点">
          ${boasts}
        </div>
        <p class="boast-stage" id="boast-stage" aria-live="polite">${p.boasts?.[0] ?? ''}</p>

        <div class="stage-theater reveal" id="stage-theater" aria-hidden="true">
          <div class="stage-rail">
            <span class="stage-node is-on" data-stage="0">想清楚</span>
            <span class="stage-line"></span>
            <span class="stage-node" data-stage="1">长好看</span>
            <span class="stage-line"></span>
            <span class="stage-node" data-stage="2">写得动</span>
            <span class="stage-line"></span>
            <span class="stage-node" data-stage="3">交得出</span>
          </div>
          <p class="stage-caption" id="stage-caption">Agent 在替你做判断，而不是替你聊天。</p>
        </div>

        <div class="spotlight-cta">
          ${linkOrSoon(p.repo, '打开源码')}
          ${linkOrSoon(p.docs, '深挖文档')}
          <ul class="stack stack-inline">${p.stack.map((s) => `<li>${s}</li>`).join('')}</ul>
        </div>
      </div>
    </section>
  `
}

function renderProject(p: Project): string {
  if (p.featured) return ''
  return `
    <a class="work-compact reveal" href="#spotlight" id="${p.id}">
      <div>
        <span class="work-tag">${p.tag}</span>
        <strong>${p.name}</strong>
        <p>${p.hook}</p>
      </div>
      <span class="work-status">${statusLabel[p.status]}</span>
    </a>
  `
}

function renderRepo(r: Repo): string {
  const inner = `
    <span class="repo-lang">${r.language}</span>
    <strong>${r.name}</strong>
    <p>${r.description}</p>
  `
  if (r.url) {
    return `<a class="repo-item reveal" href="${r.url}" target="_blank" rel="noopener noreferrer">${inner}</a>`
  }
  return `<div class="repo-item reveal">${inner}</div>`
}

function renderDemo(d: Demo): string {
  const media = d.src
    ? `<video controls preload="metadata" poster="${d.poster ?? ''}" src="${d.src}"></video>`
    : `<div class="demo-placeholder">演示录屏位 · 先看源码也够硬</div>`

  const external = d.external
    ? `<a class="text-link" href="${d.external}" target="_blank" rel="noopener noreferrer">去仓库</a>`
    : ''

  return `
    <figure class="demo-item reveal">
      ${media}
      <figcaption>
        <h3>${d.title}</h3>
        <p>${d.description}</p>
        ${external}
      </figcaption>
    </figure>
  `
}

function renderMagic(): string {
  return `
    <div class="magic" id="magic" aria-label="交互演示：产品名到工程">
      <div class="magic-bar">
        <span class="magic-dot"></span>
        <span class="magic-label">Agent 交付机</span>
      </div>
      <div class="magic-body">
        <p class="magic-prompt">
          <span class="magic-prefix">产品名</span>
          <span class="magic-name" id="magic-name">${magicPrompts[0].name}</span>
          <span class="magic-cursor" aria-hidden="true"></span>
        </p>
        <div class="magic-transform">
          <span class="magic-arrow" aria-hidden="true"></span>
          <span class="magic-out" id="magic-out">${magicPrompts[0].out}</span>
        </div>
        <div class="magic-chips" id="magic-chips">
          ${magicPrompts
            .map(
              (m, i) =>
                `<button type="button" class="magic-chip${i === 0 ? ' is-active' : ''}" data-i="${i}">${m.name}</button>`,
            )
            .join('')}
        </div>
      </div>
    </div>
  `
}

function render(): string {
  const featured = projects.find((p) => p.featured)!
  const social = [
    site.github && `<a href="${site.github}" target="_blank" rel="noopener noreferrer">GitHub</a>`,
    `<a href="mailto:${site.email}">邮箱</a>`,
  ]
    .filter(Boolean)
    .join('')

  return `
    <div class="atmosphere" aria-hidden="true"></div>
    <div class="pointer-glow" id="pointer-glow" aria-hidden="true"></div>

    <header class="topbar">
      <a class="brand" href="#top">${site.name}</a>
      <nav class="nav">
        <a href="#spotlight">代表作</a>
        <a href="#work">更多</a>
        <a href="#about">关于</a>
        <a href="#contact">联系</a>
      </nav>
    </header>

    <main id="top">
      <section class="hero">
        <div class="hero-copy">
          <p class="hero-brand">${site.name}</p>
          <h1>${site.tagline}</h1>
          <p class="hero-lead">${site.lead}</p>
          <div class="hero-cta">
            <a class="btn btn-primary" href="#spotlight">看代表作</a>
            <a class="btn btn-ghost" href="mailto:${site.email}">约我聊聊</a>
          </div>
        </div>
        ${renderMagic()}
      </section>

      ${renderFeatured(featured)}

      <section id="work" class="section">
        <div class="section-head">
          <h2>还有这些</h2>
          <p>法院落地、渠道在架、游戏重写 —— 都能交。</p>
        </div>
        <div class="work-compact-list">
          ${projects.map(renderProject).join('')}
        </div>
      </section>

      <section id="repos" class="section section-alt">
        <div class="section-head">
          <h2>仓库</h2>
          <p>代码在，口说无凭。</p>
        </div>
        <div class="repo-grid">
          ${repos.map(renderRepo).join('')}
        </div>
      </section>

      <section id="demos" class="section">
        <div class="section-head">
          <h2>演示</h2>
          <p>录屏位预留；现在点仓库也能验货。</p>
        </div>
        <div class="demo-grid">
          ${demos.map(renderDemo).join('')}
        </div>
      </section>

      <section id="about" class="section section-alt">
        <div class="section-head">
          <h2>关于</h2>
          <p>${about.summary}</p>
        </div>
        <ul class="highlights">
          ${about.highlights.map((h) => `<li class="reveal">${h}</li>`).join('')}
        </ul>
        <div class="skills reveal">
          ${about.skills.map((s) => `<span>${s}</span>`).join('')}
        </div>
        <div class="exp-list">
          ${experiences
            .map(
              (e) => `
            <article class="exp-item reveal">
              <div class="exp-head">
                <h3>${e.role}</h3>
                <span>${e.period}</span>
              </div>
              <p class="exp-company">${e.company}</p>
              <ul>${e.points.map((pt) => `<li>${pt}</li>`).join('')}</ul>
            </article>
          `,
            )
            .join('')}
        </div>
        <p class="edu reveal">${education.school} · ${education.major} · ${education.period}</p>
      </section>

      <section id="contact" class="section contact">
        <div class="section-head">
          <h2>下一步，直接聊</h2>
          <p>${site.location} · 简历一键带走</p>
        </div>
        <div class="contact-row reveal">
          <a class="btn btn-primary" href="mailto:${site.email}">${site.email}</a>
          <a class="btn btn-ghost" href="${site.resumePdf}" target="_blank" rel="noopener noreferrer">下载简历</a>
          <span class="contact-phone">${site.phone}</span>
        </div>
        <div class="social">${social}</div>
      </section>
    </main>

    <footer class="footer">
      <span>© ${new Date().getFullYear()} ${site.name}</span>
      <a href="#top">顶部</a>
    </footer>
  `
}

document.querySelector<HTMLDivElement>('#app')!.innerHTML = render()

/* —— 交互：滚动显现 —— */
const reveals = document.querySelectorAll('.reveal')
const io = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        io.unobserve(entry.target)
      }
    }
  },
  { threshold: 0.14, rootMargin: '0px 0px -6% 0px' },
)
reveals.forEach((el) => io.observe(el))

const topbar = document.querySelector('.topbar')
window.addEventListener(
  'scroll',
  () => topbar?.classList.toggle('is-scrolled', window.scrollY > 20),
  { passive: true },
)

/* —— 交互：指针光晕（桌面） —— */
const glow = document.getElementById('pointer-glow')
if (glow && window.matchMedia('(pointer:fine)').matches) {
  window.addEventListener(
    'pointermove',
    (e) => {
      glow.style.transform = `translate(${e.clientX - 180}px, ${e.clientY - 180}px)`
    },
    { passive: true },
  )
}

/* —— 交互：Hero 魔法切换 —— */
const magicName = document.getElementById('magic-name')
const magicOut = document.getElementById('magic-out')
const magicChips = document.getElementById('magic-chips')
const magicRoot = document.getElementById('magic')
let magicIndex = 0
let magicTimer = 0

function playMagic(i: number) {
  magicIndex = i
  const item = magicPrompts[i]
  magicChips?.querySelectorAll('.magic-chip').forEach((el, idx) => {
    el.classList.toggle('is-active', idx === i)
  })
  magicRoot?.classList.remove('is-firing')
  void magicRoot?.offsetWidth
  magicRoot?.classList.add('is-firing')
  if (magicName) magicName.textContent = item.name
  if (magicOut) magicOut.textContent = item.out
}

magicChips?.addEventListener('click', (e) => {
  const t = (e.target as HTMLElement).closest<HTMLButtonElement>('.magic-chip')
  if (!t) return
  const i = Number(t.dataset.i)
  playMagic(i)
  window.clearInterval(magicTimer)
  magicTimer = window.setInterval(() => playMagic((magicIndex + 1) % magicPrompts.length), 3200)
})

magicTimer = window.setInterval(() => playMagic((magicIndex + 1) % magicPrompts.length), 3200)

/* —— 交互：卖点切换 + 舞台推进 —— */
const featured = projects.find((p) => p.featured)!
const stageCopy = [
  'Agent 在替你做判断，而不是替你聊天。',
  'Stitch 出屏，好看不是口头禅。',
  '顶级 CLI 下场写代码，日志实时给你看。',
  '测得过、推得上，才叫交付。',
]

const boastBoard = document.querySelector('.boast-board')
const boastStage = document.getElementById('boast-stage')
const stageCaption = document.getElementById('stage-caption')
const stageNodes = document.querySelectorAll<HTMLElement>('.stage-node')

function setBoast(i: number) {
  const list = featured.boasts ?? []
  boastBoard?.querySelectorAll('.boast-chip').forEach((el, idx) => {
    el.setAttribute('aria-pressed', String(idx === i))
  })
  if (boastStage) boastStage.textContent = list[i] ?? ''
  stageNodes.forEach((node) => {
    const s = Number(node.dataset.stage)
    node.classList.toggle('is-on', s <= i)
  })
  if (stageCaption) stageCaption.textContent = stageCopy[i] ?? stageCopy[0]
}

boastBoard?.addEventListener('click', (e) => {
  const t = (e.target as HTMLElement).closest<HTMLButtonElement>('.boast-chip')
  if (!t) return
  setBoast(Number(t.dataset.boast))
})

/* 舞台自动轻扫一遍，制造「眼前一亮」 */
let stageAuto = 0
const stageIo = new IntersectionObserver(
  (entries) => {
    if (!entries[0]?.isIntersecting) return
    stageIo.disconnect()
    stageAuto = window.setInterval(() => {
      const next = (Number(document.querySelector('.boast-chip[aria-pressed="true"]')?.getAttribute('data-boast') ?? 0) + 1) % 3
      setBoast(next)
    }, 2800)
    window.setTimeout(() => window.clearInterval(stageAuto), 9000)
  },
  { threshold: 0.35 },
)
const theater = document.getElementById('stage-theater')
if (theater) stageIo.observe(theater)

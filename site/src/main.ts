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
  wip: '进行中',
  archived: '已交付',
}

function linkOrSoon(url: string | undefined, label: string): string {
  if (url) {
    return `<a class="text-link" href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`
  }
  return `<span class="soon">${label}</span>`
}

function renderFocus(list: Project['focus']): string {
  if (!list?.length) return ''
  return `
    <div class="focus-list reveal">
      ${list
        .map(
          (f) => `
        <article class="focus-item">
          <h4>${f.title}</h4>
          <p>${f.body}</p>
        </article>
      `,
        )
        .join('')}
    </div>
  `
}

function renderFeatured(p: Project): string {
  const impact =
    p.impact
      ?.map(
        (i) => `
      <div class="impact-cell">
        <strong>${i.value}</strong>
        <span>${i.label}</span>
      </div>`,
      )
      .join('') ?? ''

  const video = p.video
    ? `
      <div class="spotlight-video reveal">
        <video
          controls
          preload="metadata"
          playsinline
          poster="./demos/workflow-uniapp-poster.jpg"
          src="${p.video}"
        ></video>
        <p class="spotlight-video-cap">演示录屏 · 可全屏观看</p>
      </div>`
    : ''

  return `
    <section id="spotlight" class="spotlight">
      <div class="spotlight-glow" aria-hidden="true"></div>
      <div class="spotlight-inner">
        <p class="eyebrow">${p.tag}</p>
        <h2 class="spotlight-title">${p.name}</h2>
        <p class="spotlight-hook">${p.hook}</p>
        <p class="spotlight-desc">${p.description}</p>

        ${video}

        <div class="impact-row reveal">${impact}</div>

        <h3 class="focus-heading reveal">重点能力</h3>
        ${renderFocus(p.focus)}

        <div class="spotlight-cta reveal">
          ${linkOrSoon(p.repo, '查看源码')}
          ${linkOrSoon(p.docs, '工作流文档')}
          ${p.video ? `<a class="text-link" href="#demos">演示区</a>` : ''}
          <ul class="stack stack-inline">${p.stack.map((s) => `<li>${s}</li>`).join('')}</ul>
        </div>
      </div>
    </section>
  `
}

function renderProject(p: Project): string {
  if (p.featured) return ''
  const focus =
    p.focus
      ?.map((f) => `<li><strong>${f.title}</strong> ${f.body}</li>`)
      .join('') ?? ''

  return `
    <article class="work-item reveal" id="${p.id}">
      <div class="work-meta">
        <span class="work-tag">${p.tag}</span>
        <span class="work-status">${statusLabel[p.status]}</span>
      </div>
      <h3>${p.name}</h3>
      <p class="work-hook">${p.hook}</p>
      <p class="work-desc">${p.description}</p>
      ${focus ? `<ul class="work-focus">${focus}</ul>` : ''}
      <ul class="stack">${p.stack.map((s) => `<li>${s}</li>`).join('')}</ul>
    </article>
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
    : `<div class="demo-placeholder">演示录屏位 · 可先阅读仓库文档</div>`

  const external = d.external
    ? `<a class="text-link" href="${d.external}" target="_blank" rel="noopener noreferrer">打开仓库</a>`
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
        <span class="magic-label">Agent 交付演示</span>
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
    `<button type="button" class="social-copy" data-copy="${site.email}">邮箱</button>`,
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
        <a href="#work">作品</a>
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
            <a class="btn btn-ghost" href="#contact">联系我</a>
          </div>
        </div>
        ${renderMagic()}
      </section>

      ${renderFeatured(featured)}

      <section id="work" class="section">
        <div class="section-head">
          <h2>其他作品</h2>
          <p>法律 AI 落地、多端商业化产品与游戏工程，补充完整履历画像。</p>
        </div>
        <div class="work-list">
          ${projects.map(renderProject).join('')}
        </div>
      </section>

      <section id="repos" class="section section-alt">
        <div class="section-head">
          <h2>仓库源码</h2>
          <p>公开仓库入口，方便直接验货。</p>
        </div>
        <div class="repo-grid">
          ${repos.map(renderRepo).join('')}
        </div>
      </section>

      <section id="demos" class="section">
        <div class="section-head">
          <h2>演示录屏</h2>
          <p>代表作端到端实录，可在线播放。</p>
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
          <h2>联系</h2>
          <p>${site.location}</p>
        </div>
        <div class="contact-row reveal">
          <button
            type="button"
            class="btn btn-primary copy-email"
            data-copy="${site.email}"
            aria-label="点击复制邮箱"
            title="点击复制"
          >
            ${site.email}
            <span class="copy-hint">点击复制</span>
          </button>
          <a class="btn btn-ghost" href="${site.resumePdf}" target="_blank" rel="noopener noreferrer">下载简历</a>
          <span class="contact-phone">${site.phone}</span>
        </div>
        <div class="social">${social}</div>
      </section>
    </main>

    <div class="toast" id="toast" role="status" aria-live="polite" hidden></div>

    <footer class="footer">
      <span>© ${new Date().getFullYear()} ${site.name}</span>
      <span class="footer-links">
        <a href="https://sisioow.github.io/Resume/">GitHub Pages</a>
        ${site.mirror ? `<a href="${site.mirror}">国内镜像</a>` : ''}
        <a href="#top">回到顶部</a>
      </span>
    </footer>
  `
}

document.querySelector<HTMLDivElement>('#app')!.innerHTML = render()

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
  { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
)
reveals.forEach((el) => io.observe(el))

const topbar = document.querySelector('.topbar')
window.addEventListener(
  'scroll',
  () => topbar?.classList.toggle('is-scrolled', window.scrollY > 20),
  { passive: true },
)

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
  playMagic(Number(t.dataset.i))
  window.clearInterval(magicTimer)
  magicTimer = window.setInterval(() => playMagic((magicIndex + 1) % magicPrompts.length), 3200)
})

magicTimer = window.setInterval(() => playMagic((magicIndex + 1) % magicPrompts.length), 3200)

/* —— 点击复制邮箱 + toast —— */
const toastEl = document.getElementById('toast')
let toastTimer = 0

function showToast(message: string) {
  if (!toastEl) return
  toastEl.hidden = false
  toastEl.textContent = message
  toastEl.classList.add('is-show')
  window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => {
    toastEl.classList.remove('is-show')
    window.setTimeout(() => {
      toastEl.hidden = true
    }, 220)
  }, 2000)
}

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    /* fallback below */
  }
  const ta = document.createElement('textarea')
  ta.value = text
  ta.setAttribute('readonly', '')
  ta.style.position = 'fixed'
  ta.style.left = '-9999px'
  document.body.appendChild(ta)
  ta.select()
  const ok = document.execCommand('copy')
  document.body.removeChild(ta)
  return ok
}

document.addEventListener('click', async (e) => {
  const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-copy]')
  if (!btn) return
  const text = btn.dataset.copy?.trim()
  if (!text) return
  const ok = await copyText(text)
  showToast(ok ? '邮箱已复制' : '复制失败，请手动选择')
})

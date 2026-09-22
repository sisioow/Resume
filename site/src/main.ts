import './style.css'
import {
  demos,
  experiences,
  pageTabs,
  projects,
  repos,
  site,
  skillGroups,
  type Demo,
  type Project,
  type Repo,
  type SkillGroup,
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

/** Cloudflare Pages 对 mp4 不支持 Range，拖进度条会复原；改走 GitHub Pages 资源 */
function demoMediaUrl(path: string | undefined): string {
  if (!path) return ''
  if (/^https?:\/\//.test(path)) return path
  const file = path.replace(/^\.\//, '').replace(/^demos\//, '')
  return `https://sisioow.github.io/Resume/demos/${file}`
}


function renderSkillGroup(group: SkillGroup): string {
  return `
    <article class="skill-group reveal">
      <h3>${group.title}</h3>
      <div class="skills">
        ${group.items.map((s) => `<span>${s}</span>`).join('')}
      </div>
    </article>
  `
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
          preload="auto"
          playsinline
          poster="${demoMediaUrl('./demos/workflow-uniapp-poster.jpg')}"
          src="${demoMediaUrl(p.video)}"
        ></video>
        <p class="spotlight-video-cap">演示录屏</p>
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

  const links = [
    linkOrSoon(p.repo, '源码'),
    p.video ? `<a class="text-link" href="#demos">观看录屏</a>` : '',
  ]
    .filter((x) => x && !x.includes('class="soon"'))
    .join('')

  const onlineBtn = p.demo
    ? `<a class="work-online-btn" href="${p.demo}" target="_blank" rel="noopener noreferrer">在线使用</a>`
    : ''

  return `
    <article class="work-item reveal" id="${p.id}">
      <div class="work-meta">
        <span class="work-tag">${p.tag}</span>
        <span class="work-status">${statusLabel[p.status]}</span>
      </div>
      <div class="work-title-row">
        <h3>${p.name}</h3>
        ${onlineBtn}
      </div>
      <p class="work-hook">${p.hook}</p>
      <p class="work-desc">${p.description}</p>
      ${focus ? `<ul class="work-focus">${focus}</ul>` : ''}
      ${links ? `<div class="work-links">${links}</div>` : ''}
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
    ? `<video controls preload="auto" playsinline poster="${demoMediaUrl(d.poster)}" src="${demoMediaUrl(d.src)}"></video>`
    : d.external && !d.external.startsWith('http')
      ? `<a class="demo-launch" href="${d.external}"><strong>可交互演示</strong><span>点击进入网页点测</span></a>`
      : `<div class="demo-placeholder">暂无录屏</div>`

  const external = d.external
    ? `<a class="text-link" href="${d.external}" ${d.external.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''}>${d.external.startsWith('http') ? '打开仓库' : '打开演示页'}</a>`
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

/** Hero 右侧：页面导航 tab，点击跳转对应区块，滚动时高亮当前区块 */
function renderPageNav(): string {
  const total = String(pageTabs.length).padStart(2, '0')
  return `
    <nav class="pagenav" id="pagenav" aria-label="页面导航">
      <div class="pagenav-bar">
        <span class="pagenav-dot"></span>
        <span class="pagenav-label">页面导航</span>
        <span class="pagenav-count" id="pagenav-count">01 / ${total}</span>
      </div>
      <ol class="pagenav-list">
        ${pageTabs
          .map(
            (t, i) => `
          <li>
            <a
              class="pagenav-item${i === 0 ? ' is-active' : ''}"
              href="#${t.id}"
              data-target="${t.id}"
              ${i === 0 ? 'aria-current="true"' : ''}
            >
              <span class="pagenav-idx">${String(i + 1).padStart(2, '0')}</span>
              <span class="pagenav-text">
                <strong>${t.label}</strong>
                <em>${t.hint}</em>
              </span>
              <span class="pagenav-rail" aria-hidden="true"></span>
            </a>
          </li>
        `,
          )
          .join('')}
      </ol>
    </nav>
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
        <a href="#experience">工作经历</a>
        <a href="#skills">技能</a>
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
        ${renderPageNav()}
      </section>

      ${renderFeatured(featured)}

      <section id="work" class="section">
        <div class="section-head">
          <h2>其他作品</h2>
        </div>
        <div class="work-list">
          ${projects.map(renderProject).join('')}
        </div>
      </section>

      <section id="repos" class="section section-alt">
        <div class="section-head">
          <h2>仓库源码</h2>
        </div>
        <div class="repo-grid">
          ${repos.map(renderRepo).join('')}
        </div>
      </section>

      <section id="demos" class="section">
        <div class="section-head">
          <h2>演示录屏</h2>
        </div>
        <div class="demo-grid">
          ${demos.map(renderDemo).join('')}
        </div>
      </section>

      <section id="experience" class="section section-alt">
        <div class="section-head">
          <h2>工作经历</h2>
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
      </section>

      <section id="skills" class="section">
        <div class="section-head">
          <h2>技能</h2>
        </div>
        <div class="skill-groups">
          ${skillGroups.map(renderSkillGroup).join('')}
        </div>
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
            title="点击复制邮箱"
          >
            ${site.email}
            <span class="copy-hint">复制邮箱</span>
          </button>
          <button
            type="button"
            class="btn btn-ghost copy-phone"
            data-copy="${site.phone}"
            aria-label="点击复制电话"
            title="点击复制电话"
          >
            ${site.phone}
            <span class="copy-hint copy-hint-dark">复制电话</span>
          </button>
          <a class="btn btn-ghost" href="${site.resumePdf}" target="_blank" rel="noopener noreferrer">下载简历</a>
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

/* —— Hero 右侧页面导航：点击跳转 + 滚动高亮当前区块 —— */
const pagenavItems = Array.from(
  document.querySelectorAll<HTMLAnchorElement>('.pagenav-item'),
)
const pagenavCount = document.getElementById('pagenav-count')
const navSections = pageTabs
  .map((t) => ({ id: t.id, el: document.getElementById(t.id) }))
  .filter((s): s is { id: string; el: HTMLElement } => s.el !== null)

const pad2 = (n: number) => String(n).padStart(2, '0')

/** 点击 tab 触发的平滑滚动期间，保持用户点选的高亮，滚动停下后再交还自动高亮 */
let navClickLock = false
let navScrollEndTimer = 0

function setActiveNav(id: string) {
  const index = pageTabs.findIndex((t) => t.id === id)
  pagenavItems.forEach((el) => {
    const active = el.dataset.target === id
    el.classList.toggle('is-active', active)
    if (active) el.setAttribute('aria-current', 'true')
    else el.removeAttribute('aria-current')
  })
  if (pagenavCount && index >= 0) {
    pagenavCount.textContent = `${pad2(index + 1)} / ${pad2(pageTabs.length)}`
  }
}

function syncActiveNav() {
  if (!navSections.length) return
  // 页面已到底：末个区块可能永远越不过判定线，直接高亮最后一项
  const doc = document.documentElement
  if (window.innerHeight + window.scrollY >= doc.scrollHeight - 2) {
    setActiveNav(navSections[navSections.length - 1].id)
    return
  }
  // 以视口上方约 1/3 处为判定线，取最后一个越过该线的区块
  const line = window.scrollY + window.innerHeight * 0.34
  let current = navSections[0].id
  for (const s of navSections) {
    if (s.el.getBoundingClientRect().top + window.scrollY <= line) current = s.id
  }
  setActiveNav(current)
}

let navTicking = false
window.addEventListener(
  'scroll',
  () => {
    if (navClickLock) {
      // 滚动仍在进行：不断延后「交还自动高亮」的时刻
      window.clearTimeout(navScrollEndTimer)
      navScrollEndTimer = window.setTimeout(() => {
        navClickLock = false
      }, 160)
      return
    }
    if (navTicking) return
    navTicking = true
    window.requestAnimationFrame(() => {
      syncActiveNav()
      navTicking = false
    })
  },
  { passive: true },
)
window.addEventListener('resize', syncActiveNav, { passive: true })

pagenavItems.forEach((el) => {
  el.addEventListener('click', () => {
    const id = el.dataset.target
    if (!id) return
    navClickLock = true
    window.clearTimeout(navScrollEndTimer)
    setActiveNav(id)
  })
})

syncActiveNav()

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
  const isPhone = /^\d{11}$/.test(text) || text === site.phone
  showToast(ok ? (isPhone ? '电话已复制' : '邮箱已复制') : '复制失败，请手动选择')
})

import './style.css'
import {
  about,
  demos,
  education,
  experiences,
  projects,
  repos,
  site,
  type Demo,
  type Project,
  type Repo,
} from './data'

const statusLabel: Record<Project['status'], string> = {
  live: '在架 / 可用',
  wip: '进行中',
  archived: '已归档',
}

function linkOrSoon(url: string | undefined, label: string): string {
  if (url) {
    return `<a class="text-link" href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`
  }
  return `<span class="soon">${label} · 待补充</span>`
}

function renderProject(p: Project): string {
  return `
    <article class="work-item reveal" id="${p.id}">
      <div class="work-meta">
        <span class="work-tag">${p.tag}</span>
        <span class="work-status status-${p.status}">${statusLabel[p.status]}</span>
      </div>
      <h3>${p.name}</h3>
      <p>${p.description}</p>
      <ul class="stack">${p.stack.map((s) => `<li>${s}</li>`).join('')}</ul>
      <div class="work-links">
        ${linkOrSoon(p.repo, '源码')}
        ${linkOrSoon(p.demo, '在线演示')}
        ${linkOrSoon(p.video, '演示录屏')}
      </div>
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
  return `<div class="repo-item reveal is-placeholder">${inner}<span class="soon">地址待填</span></div>`
}

function renderDemo(d: Demo): string {
  const media = d.src
    ? `<video controls preload="metadata" poster="${d.poster ?? ''}" src="${d.src}"></video>`
    : `<div class="demo-placeholder">录屏文件放在 <code>public/demos/</code>，或在 data.ts 填外链</div>`

  const external = d.external
    ? `<a class="text-link" href="${d.external}" target="_blank" rel="noopener noreferrer">查看外链演示</a>`
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

function render(): string {
  const social = [
    site.github && `<a href="${site.github}" target="_blank" rel="noopener noreferrer">GitHub</a>`,
    site.gitee && `<a href="${site.gitee}" target="_blank" rel="noopener noreferrer">Gitee</a>`,
    `<a href="mailto:${site.email}">邮箱</a>`,
  ]
    .filter(Boolean)
    .join('')

  return `
    <div class="atmosphere" aria-hidden="true"></div>

    <header class="topbar">
      <a class="brand" href="#top">${site.name}</a>
      <nav class="nav">
        <a href="#work">作品</a>
        <a href="#repos">仓库</a>
        <a href="#demos">演示</a>
        <a href="#about">关于</a>
        <a href="#contact">联系</a>
      </nav>
    </header>

    <main id="top">
      <section class="hero">
        <p class="hero-brand">${site.name}</p>
        <h1>${site.title}</h1>
        <p class="hero-lead">${site.tagline}</p>
        <div class="hero-cta">
          <a class="btn btn-primary" href="#work">查看作品集</a>
          <a class="btn btn-ghost" href="#demos">演示录屏</a>
        </div>
        <div class="hero-visual" aria-hidden="true">
          <div class="orbit"></div>
          <div class="orbit orbit-2"></div>
          <div class="signal"></div>
        </div>
      </section>

      <section id="work" class="section">
        <div class="section-head">
          <h2>作品集</h2>
          <p>项目、源码与演示入口。条目可在 <code>src/data.ts</code> 继续补充。</p>
        </div>
        <div class="work-list">
          ${projects.map(renderProject).join('')}
        </div>
      </section>

      <section id="repos" class="section section-alt">
        <div class="section-head">
          <h2>仓库源码</h2>
          <p>公开仓库与本站源码地址。</p>
        </div>
        <div class="repo-grid">
          ${repos.map(renderRepo).join('')}
        </div>
      </section>

      <section id="demos" class="section">
        <div class="section-head">
          <h2>演示录屏</h2>
          <p>支持本地 mp4 或 B 站等外链。</p>
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
              <ul>${e.points.map((p) => `<li>${p}</li>`).join('')}</ul>
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
          <a class="btn btn-primary" href="mailto:${site.email}">${site.email}</a>
          <a class="btn btn-ghost" href="${site.resumePdf}" target="_blank" rel="noopener noreferrer">下载简历 PDF</a>
          <span class="contact-phone">${site.phone}</span>
        </div>
        <div class="social">${social}</div>
      </section>
    </main>

    <footer class="footer">
      <span>© ${new Date().getFullYear()} ${site.name}</span>
      <a href="#top">回到顶部</a>
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
  { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
)
reveals.forEach((el) => io.observe(el))

const topbar = document.querySelector('.topbar')
window.addEventListener(
  'scroll',
  () => {
    topbar?.classList.toggle('is-scrolled', window.scrollY > 24)
  },
  { passive: true },
)

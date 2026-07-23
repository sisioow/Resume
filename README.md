# 施宏威 · 个人作品集站点

静态个人站：作品集、仓库源码、演示录屏。内容集中在 `site/src/data.ts`，后续你只需改这一处。

## 本地预览

```bash
cd site
npm install
npm run dev
```

## 公网上线（推荐：零成本）

我无法代你实名注册付费域名（需你的身份与支付）。当前最优方案：

| 方案 | 费用 | 公网地址 | 说明 |
|------|------|----------|------|
| **GitHub Pages**（推荐） | ¥0 | `https://你的用户名.github.io/Resume/` 或 `https://你的用户名.github.io/` | 已配好 Actions 自动部署 |
| Cloudflare Pages | ¥0 | `*.pages.dev` | 连 GitHub 后一键部署 |
| Vercel | ¥0 | `*.vercel.app` | 连 GitHub 后一键部署 |
| 自定义域名（可选） | 约 ¥30–60/年 | 如 `shihongwei.dev` | Cloudflare Registrar / 阿里云等，DNS 指到 Pages |

### 一键上线 GitHub Pages（约 5 分钟）

1. 在 GitHub 新建仓库（建议名 `Resume` 或 `你的用户名.github.io`）
2. 本机执行：

```bash
cd /Users/shihongwei/Resume
git init
git add .
git commit -m "feat: scaffold personal portfolio site"
git branch -M main
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git push -u origin main
```

3. 仓库 **Settings → Pages → Build and deployment → Source** 选 **GitHub Actions**
4. 推送后等待 Actions 完成，打开 Pages 给出的网址

若仓库名为 `username.github.io`，站点根地址即为 `https://username.github.io/`。

### 绑定自定义域名（以后需要时）

1. 域名商购买域名（Cloudflare 通常接近成本价）
2. DNS 添加 `CNAME` → `你的用户名.github.io`
3. 在仓库 `site/public/CNAME` 写入你的域名（一行，无协议）
4. Pages 设置里填同一域名并开启 HTTPS

## 后续你怎么填内容

编辑 [`site/src/data.ts`](site/src/data.ts)：

- `projects`：作品名、描述、`repo` / `demo` / `video` 链接
- `repos`：公开仓库地址
- `demos`：本地文件放 `site/public/demos/*.mp4`，或填 B 站等 `external`
- `site.github` / `site.gitee`：主页链接

简历 PDF 可复制到 `site/public/resume.pdf`，页头已预留路径。

## 目录

```
Resume/
├── .github/workflows/deploy-pages.yml  # 自动部署
├── site/                               # 站点源码
│   ├── public/demos/                   # 演示录屏
│   └── src/data.ts                     # 内容配置
└── 施宏威4.16_agent.pdf
```

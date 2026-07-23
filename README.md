# 施宏威 · 个人作品集站点

静态个人站：作品集、仓库源码、演示录屏。内容集中在 `site/src/data.ts`。

## 公网地址

| 渠道 | 地址 | 说明 |
|------|------|------|
| GitHub Pages | https://sisioow.github.io/Resume/ | 海外 |
| **Gitee Pages（国内）** | 配置后见下方 | **国内免翻墙推荐** |
| 阿里云 OSS | 仅备份 | 默认域名会强制下载，不作入口 |

国内镜像步骤：[docs/国内镜像说明.md](docs/国内镜像说明.md)

## 本地预览

```bash
cd site
npm install
npm run dev
```

## Gitee Pages 国内镜像

1. Gitee 新建公开仓库 `Resume`
2. 创建私人令牌（projects 权限）
3. GitHub Secrets 添加 `GITEE_TOKEN` / `GITEE_OWNER` / `GITEE_REPO`
4. 跑 Actions：**Deploy China mirror to Gitee Pages**
5. Gitee → 服务 → Gitee Pages → 分支 `gh-pages` → 启动/更新

详情见 [docs/国内镜像说明.md](docs/国内镜像说明.md)。

## GitHub Pages

已启用：https://sisioow.github.io/Resume/

## 后续改内容

编辑 [`site/src/data.ts`](site/src/data.ts)。

## 目录

```
Resume/
├── .github/workflows/
│   ├── deploy-pages.yml   # GitHub Pages
│   ├── deploy-gitee.yml   # Gitee Pages 国内镜像
│   └── deploy-oss.yml     # 阿里云 OSS 备份（可选）
├── docs/国内镜像说明.md
└── site/
```

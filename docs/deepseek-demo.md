# DeepSeek 演示接入说明

演示页通过 Cloudflare Pages Function `/api/chat` 调用 **deepseek-v4-pro**。

## 安全

- **禁止**把 API Key 写进前端 JS / HTML / 仓库
- 秘钥只放在 Cloudflare 环境变量 `DEEPSEEK_API_KEY`
- 本地开发用 `site/.dev.vars`（已 gitignore）

## 配置公网秘钥

```bash
cd site
npx wrangler pages secret put DEEPSEEK_API_KEY --project-name=resume-due
# 粘贴 sk-... 后回车
```

可选变量（也可在 Pages 控制台 Environment variables）：

- `DEEPSEEK_MODEL=deepseek-v4-pro`

## 本地带 Function 预览

```bash
cd site
npm run build
npx wrangler pages dev dist --compatibility-date=2026-01-01
```

打开终端提示的本地地址，再进 `/demos/...`。

## 覆盖范围

| Demo | 模型用法 |
|------|----------|
| Deep Research | Planner / Search / Critic / Writer 四段真实调用 |
| KB Agent | 检索切片后 grounded 生成 |
| CrewAI | 研究员 / 分析师 / 质检官三段真实调用 |
| Browser-Use | 用户自助任务 → `/api/browse` 真实抓取 → 模型多步抽取 |

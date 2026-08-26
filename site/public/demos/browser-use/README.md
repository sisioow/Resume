# Browser-Use Pilot Console

用户自助输入任务；经 Cloudflare `/api/browse` 真实抓取公开网页，再用 deepseek-v4-pro 多步决策并结构化抽取。

## 打开方式

作品集站点：`/demos/browser-use/`

本地带 Function：

```bash
cd site
npm run build
npx wrangler pages dev dist --compatibility-date=2026-01-01
```

## 使用建议

1. 在任务框写明目标（最好含完整 `https://` URL）
2. 点「启动智能体」
3. 右侧会显示真实抓取正文与结构化输出

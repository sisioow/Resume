# 施宏威 · 个人作品集站点

静态个人站：作品集、仓库源码、演示录屏。内容集中在 `site/src/data.ts`。

## 公网地址

| 渠道 | 地址 | 说明 |
|------|------|------|
| GitHub Pages | https://sisioow.github.io/Resume/ | 海外稳定 |
| **国内可预览镜像** | 见 [docs/国内镜像说明.md](docs/国内镜像说明.md) | **推荐 Cloudflare Pages（免备案）** |
| 阿里云 OSS | 仅作文件备份 | 默认域名会**强制下载** HTML，不能当网站入口 |

> 原因：阿里云对 OSS 默认域名访问 HTML 会加 `Content-Disposition: attachment`，浏览器只会下载。要在线打开必须绑定**备案自定义域名**，或改用 Cloudflare Pages / Gitee Pages。


## 本地预览

```bash
cd site
npm install
npm run dev
```

## 阿里云 OSS 国内镜像（推荐）

推送 `main` 后，GitHub Actions 会自动把 `site/dist` 同步到 OSS。个人站流量很小，通常按量几毛到几块/月，新用户常有免费额度。

### 1. 控制台创建 Bucket（约 3 分钟）

1. 打开 [OSS 控制台](https://oss.console.aliyun.com/) → 开通 OSS（如未开通）
2. **创建 Bucket**，建议：
   - 名称：`sisioow-resume`（全局唯一，被占用就换一个）
   - 地域：选离你近的，如 **华东1（杭州）** → endpoint 为 `oss-cn-hangzhou.aliyuncs.com`
   - 读写权限：**公共读**（静态站必须）
   - 其余默认即可
3. 进入 Bucket → **数据管理 / 静态页面**（或「基础设置 → 静态页面」）→ **设置**
   - 默认首页：`index.html`
   - 默认 404 页：`index.html`
4. 记下静态网站访问域名，形如：  
   `http://sisioow-resume.oss-website-cn-hangzhou.aliyuncs.com`

### 2. 创建 RAM 密钥（不要用主账号长期 Key）

1. [RAM 访问控制](https://ram.console.aliyun.com/users) → 创建用户 → 勾选 **OpenAPI 调用访问**
2. 为用户授权策略：`AliyunOSSFullAccess`（或仅该 Bucket 的自定义最小权限）
3. 创建 AccessKey，保存 **AccessKey ID** 与 **AccessKey Secret**

### 3. 写入 GitHub Secrets

打开 https://github.com/sisioow/Resume/settings/secrets/actions 新增：

| Name | 值示例 |
|------|--------|
| `ALIYUN_ACCESS_KEY_ID` | 你的 AccessKey ID |
| `ALIYUN_ACCESS_KEY_SECRET` | 你的 AccessKey Secret |
| `ALIYUN_OSS_BUCKET` | `sisioow-resume` |
| `ALIYUN_OSS_ENDPOINT` | `oss-cn-hangzhou.aliyuncs.com`（按地域改） |

### 4. 触发部署

- 推送任意 commit 到 `main`，或  
- Actions → **Deploy China mirror to Aliyun OSS** → **Run workflow**

成功后国内用静态网站域名访问即可。

### 本地手动同步（可选）

```bash
export ALIYUN_ACCESS_KEY_ID=xxx
export ALIYUN_ACCESS_KEY_SECRET=xxx
export ALIYUN_OSS_BUCKET=sisioow-resume
export ALIYUN_OSS_ENDPOINT=oss-cn-hangzhou.aliyuncs.com
chmod +x scripts/deploy-oss.sh
./scripts/deploy-oss.sh
```

配置好镜像地址后，把 URL 填进 `site/src/data.ts` 的 `site.mirror`，页脚会显示「国内镜像」。

## GitHub Pages

已启用：https://sisioow.github.io/Resume/  
推送 `main` 后由 `.github/workflows/deploy-pages.yml` 自动更新。

## 后续改内容

编辑 [`site/src/data.ts`](site/src/data.ts)：作品、仓库、演示等。

## 目录

```
Resume/
├── .github/workflows/
│   ├── deploy-pages.yml   # GitHub Pages
│   └── deploy-oss.yml     # 阿里云 OSS 国内镜像
├── scripts/deploy-oss.sh  # 本地同步 OSS
├── site/
└── 施宏威4.16_agent.pdf
```

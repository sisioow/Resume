#!/usr/bin/env bash
# 本地一键同步到阿里云 OSS（国内镜像）
# 用法：
#   export ALIYUN_ACCESS_KEY_ID=...
#   export ALIYUN_ACCESS_KEY_SECRET=...
#   export ALIYUN_OSS_BUCKET=sisioow-resume
#   export ALIYUN_OSS_ENDPOINT=oss-cn-hangzhou.aliyuncs.com   # 可选
#   ./scripts/deploy-oss.sh

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/site"

: "${ALIYUN_ACCESS_KEY_ID:?请设置 ALIYUN_ACCESS_KEY_ID}"
: "${ALIYUN_ACCESS_KEY_SECRET:?请设置 ALIYUN_ACCESS_KEY_SECRET}"
: "${ALIYUN_OSS_BUCKET:?请设置 ALIYUN_OSS_BUCKET}"
ENDPOINT="${ALIYUN_OSS_ENDPOINT:-oss-cn-hangzhou.aliyuncs.com}"

npm run build

OSSUTIL="$(command -v ossutil || true)"
if [[ -z "$OSSUTIL" ]]; then
  echo "未找到 ossutil，正在下载临时二进制…"
  curl -fsSL -o /tmp/ossutil https://gosspublic.alicdn.com/ossutil/1.7.18/ossutilmac64 \
    || curl -fsSL -o /tmp/ossutil https://gosspublic.alicdn.com/ossutil/1.7.18/ossutil64
  chmod +x /tmp/ossutil
  OSSUTIL=/tmp/ossutil
fi

"$OSSUTIL" -e "$ENDPOINT" -i "$ALIYUN_ACCESS_KEY_ID" -k "$ALIYUN_ACCESS_KEY_SECRET" \
  cp -rf dist/ "oss://${ALIYUN_OSS_BUCKET}/" --update

REGION_WEB="${ENDPOINT/oss-/oss-website-}"
echo ""
echo "同步完成。"
echo "静态网站地址（需在控制台开启静态网站托管）:"
echo "  http://${ALIYUN_OSS_BUCKET}.${REGION_WEB}/"
echo "直链首页:"
echo "  https://${ALIYUN_OSS_BUCKET}.${ENDPOINT}/index.html"

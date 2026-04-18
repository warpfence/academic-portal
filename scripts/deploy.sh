#!/usr/bin/env bash
# 프로덕션 배포 스크립트
# 사용법: ./scripts/deploy.sh
# 서버에서는 홈 디렉토리의 symlink로도 실행 가능: ~/deploy.sh

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_NAME="academic-portal"

cd "$PROJECT_DIR"

echo "==> [1/4] Git pull"
git pull --ff-only

echo "==> [2/4] 의존성 설치 (변경 사항이 있을 때만 적용됨)"
npm ci --no-audit --no-fund

echo "==> [3/4] 프로덕션 빌드"
NODE_OPTIONS="--max-old-space-size=768" npm run build

echo "==> [4/4] PM2 재시작"
if pm2 describe "$APP_NAME" > /dev/null 2>&1; then
  pm2 restart "$APP_NAME" --update-env
else
  pm2 start npm --name "$APP_NAME" -- start
fi
pm2 save

echo ""
echo "==> 헬스 체크"
sleep 2
if curl -sf -o /dev/null -w "localhost:3000 → HTTP %{http_code}\n" http://localhost:3000/; then
  echo "배포 성공"
else
  echo "경고: 로컬 헬스 체크 실패. pm2 logs $APP_NAME 으로 확인하세요"
  exit 1
fi

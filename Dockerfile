# 1. Node.js 버전 20.17.0 기반의 이미지 사용 (alpine은 경량화된 버전)
FROM node:20.17.0-alpine AS builder

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 패키지 매니저 캐시 설정 및 패키지 설치
COPY package.json yarn.lock ./
RUN yarn install

# 4. 소스 코드 복사
COPY . .

# 5. 빌드 실행하기 전 .next 폴더 삭제 (캐시 문제 방지)
RUN rm -rf .next

# 6. 빌드 실행 (Next.js 빌드)
RUN yarn build

# 7. 실행용으로 경량화된 Node.js 이미지를 사용 (Production 모드로 실행)
FROM node:20.17.0-alpine AS runner

# 8. 작업 디렉토리 설정
WORKDIR /app

# 9. production용 node_modules 복사 및 소스 코드 복사
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# 10. 환경 변수 설정 (Optional)
ENV NODE_ENV=production
ENV PORT=3000

# 11. 포트 노출
EXPOSE 3000

# 12. Next.js 애플리케이션 실행
CMD ["yarn", "start"]

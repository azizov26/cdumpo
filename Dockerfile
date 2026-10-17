# Продакшен-образ сайта ЦДУМ ПО: сборка Next.js + Payload, запуск под обычным пользователем (не root).
# Сборка:  docker build -t cdumpo .   Запуск целиком — docker-compose.prod.yml (см. README → «Запуск на сервере»).
FROM node:22-bookworm-slim AS base
ENV NEXT_TELEMETRY_DISABLED=1 PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
# Версия pnpm — из поля packageManager в package.json.
RUN corepack enable
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Для сборки нужен лишь непустой секрет-пустышка; настоящие секреты в образ не попадают, их задаёт окружение при запуске.
# Базы при сборке нет: страницы, которым нужны данные, соберутся с пустым состоянием и обновятся при первом обращении.
RUN PAYLOAD_SECRET=build-only-placeholder-not-a-real-secret-0000 pnpm build

FROM base AS runner
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0
# Зависимости оставляем целиком: next.config.ts и миграции Payload (`pnpm migrate`) запускаются из TypeScript.
COPY --from=build --chown=node:node /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml /app/next.config.ts /app/tsconfig.json ./
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/.next ./.next
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/src ./src
COPY --from=build --chown=node:node /app/data/legacy/redirects.json ./data/legacy/redirects.json
# Загруженные в админке файлы (пока не переехали в S3) — в томе, чтобы переживать пересоздание контейнера.
RUN mkdir -p /app/media && chown node:node /app/media
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
# Без pnpm: на сервере он не нужен (и не должен скачиваться при запуске).
CMD ["node_modules/.bin/next", "start"]

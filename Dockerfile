FROM node:20-alpine
ENV PORT 8002

RUN apk add --no-cache g++ make py3-pip libc6-compat
WORKDIR /frontend

# Глобальная установка pm2
RUN npm install --global pm2

# Копируем package.json и устанавливаем зависимости
COPY package*.json .
RUN npm ci

# Копируем остальные файлы
COPY . .

# Сборка приложения
RUN NEXT_PUBLIC_PROTOCOL=https \
    NEXT_PUBLIC_FRONT_END_ENV=prod \
    npm run build  --debug

RUN npx next telemetry disable

EXPOSE $PORT

# Запуск приложения через PM2
CMD [ "pm2-runtime", "start", "npm", "--", "start" ]

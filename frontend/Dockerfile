# Этап 1: Сборка React-приложения
FROM node:20-alpine AS build

WORKDIR /app

# Копируем файлы с зависимостями
COPY package*.json ./
# Устанавливаем ВСЕ зависимости (включая dev)
RUN npm install

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Этап 2: Запуск приложения через Nginx
FROM nginx:stable-alpine

# Копируем собранные файлы из предыдущего этапа
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем конфигурацию Nginx (файл должен существовать)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
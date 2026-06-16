# Todo Web — список задач (Full Stack)

Учебное full-stack приложение «Список задач» по техническому заданию.

## 1. Стек

| Слой       | Технологии                                                   |
| ---------- | ------------------------------------------------------------ |
| Backend    | TypeScript, Node.js 20, Fastify, Prisma ORM, Zod, Vitest     |
| Frontend   | TypeScript, React 19, Vite 8, axios                          |
| База данных| PostgreSQL 16 (через Prisma; SQL-схема ниже)                 |
| Инфра      | Docker, docker-compose, Nginx (для отдачи фронта)            |

## 2. Что реализовано

- CRUD задач (создание, чтение, редактирование, удаление).
- Поле `is_completed` — статус «выполнено / не выполнено».
- Поля `created_at` / `updated_at` ведутся автоматически.
- **Корзина** (`is_deleted`): задача сначала уходит в корзину,
  из корзины её можно восстановить или удалить навсегда.
- Фильтр по статусу (все / в работе / выполненные).
- Поиск по названию и описанию (case-insensitive).
- Сортировка по `createdAt`, `updatedAt`, `title` в обе стороны.
- Валидация входных данных через Zod как на backend, так и на формах.
- Регистрация / вход (демонстрационный, без сервера): данные пользователей
  хранятся в `localStorage`, имя пользователя из приветствия и из сайдбара
  всегда совпадает с тем именем, под которым он зарегистрировался.

## 3. Структура репозитория

```
todo-web/
├── backend/                 Fastify + Prisma + Zod
│   ├── src/
│   │   ├── config/env.ts
│   │   ├── db/prisma.ts
│   │   ├── domain/          Сущности и доменные ошибки
│   │   ├── repository/      TaskRepository (поверх Prisma)
│   │   ├── services/        TaskService (бизнес-логика)
│   │   ├── routes/tasks.ts  HTTP-роуты
│   │   ├── schemas/task.ts  Zod-схемы для DTO/Query
│   │   ├── app.ts           Сборка Fastify-приложения
│   │   └── main.ts          Точка входа
│   ├── prisma/schema.prisma
│   ├── prisma/migrations/   SQL-миграции (init)
│   └── tests/               Vitest
├── frontend/                React + TypeScript + Vite
│   └── src/
│       ├── domain/          Чистые типы и константы
│       ├── infrastructure/  axios-клиент, репозиторий API, userStore
│       ├── components/      LoginPage, Layout, Sidebar, TaskListView и пр.
│       └── App.tsx
├── docker-compose.yml
└── README.md
```

## 4. Запуск через Docker (рекомендуемый)

```bash
docker compose up --build
```

После старта:

- Frontend: <http://localhost>
- Backend: <http://localhost:8000>
- Healthcheck: <http://localhost:8000/health>

При первом запуске backend применяет Prisma-миграцию и создаёт таблицу `tasks`.

## 5. Запуск без Docker

### 5.1 База данных

Поднимите PostgreSQL любым удобным способом.

```
postgresql://todo_user:todo123@localhost:5432/tododb?schema=public
```

### 5.2 Backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate deploy        # миграции
npm run dev                     
# или
npm run build && npm start
```

Тесты:

```bash
cd backend
npm test
```

### 5.3 Frontend

```bash
cd frontend
npm install
npm run dev                      # http://localhost:5173
```

## 6. API

| Метод  | Путь                       | Назначение                                          |
| ------ | -------------------------- | --------------------------------------------------- |
| GET    | `/tasks/`                  | Список задач (фильтры / поиск / сортировка)         |
| POST   | `/tasks/`                  | Создать задачу                                      |
| GET    | `/tasks/{id}`              | Одна задача                                         |
| PUT    | `/tasks/{id}`              | Обновить задачу (любые поля, в т.ч. `isDeleted`)    |
| PATCH  | `/tasks/{id}/complete`     | Переключить статус выполнения                       |
| POST   | `/tasks/{id}/restore`      | Восстановить из корзины                             |
| DELETE | `/tasks/{id}`              | В корзину (или `?permanent=true` — навсегда)        |
| GET    | `/health`                  | Liveness probe                                      |

### Параметры `GET /tasks/`

| Параметр        | Тип            | По умолчанию | Описание                                          |
| --------------- | -------------- | ------------ | ------------------------------------------------- |
| `skip`          | int            | 0            | Сколько записей пропустить                        |
| `limit`         | int (1..500)   | 100          | Размер страницы                                   |
| `isCompleted`   | true / false   | —            | Фильтр по статусу                                 |
| `isDeleted`     | true / false   | false        | Корзина                                           |
| `search`        | string         | —            | Поиск по `title` и `description`                  |
| `orderBy`       | createdAt / updatedAt / title | createdAt | Поле сортировки               |
| `orderDir`      | asc / desc     | desc         | Направление сортировки                            |

### Примеры

```bash
# создать задачу
curl -X POST http://localhost:8000/tasks/ \
  -H 'Content-Type: application/json' \
  -d '{"title":"Купить хлеб","description":"Заехать в магазин"}'

# список активных, отсортированных по дате обновления
curl 'http://localhost:8000/tasks/?isCompleted=false&orderBy=updatedAt&orderDir=desc'

# поиск
curl 'http://localhost:8000/tasks/?search=хлеб'

# переместить в корзину
curl -X DELETE http://localhost:8000/tasks/1

# вернуть из корзины
curl -X POST http://localhost:8000/tasks/1/restore

# удалить навсегда
curl -X DELETE 'http://localhost:8000/tasks/1?permanent=true'
```

## 7. Структура таблицы `tasks`

```sql
CREATE TABLE tasks (
    id           SERIAL PRIMARY KEY,
    title        VARCHAR(200)   NOT NULL,
    description  VARCHAR(2000)  NOT NULL DEFAULT '',
    is_completed BOOLEAN        NOT NULL DEFAULT false,
    is_deleted   BOOLEAN        NOT NULL DEFAULT false,
    created_at   TIMESTAMP(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP(3)   NOT NULL
);

CREATE INDEX tasks_is_deleted_created_at_idx   ON tasks(is_deleted, created_at);
CREATE INDEX tasks_is_completed_created_at_idx ON tasks(is_completed, created_at);
CREATE INDEX tasks_title_idx                   ON tasks(title);
```

Индексы покрывают самые частые запросы списка: «все активные, отсортированные
по дате», «корзина», «выполненные», а также сортировку по названию.

## 8. Архитектурные решения

- **Разбито на слои.** 
- **Soft delete вместо hard delete.** Корзина из ТЗ потребовала отдельного
  флага `is_deleted`. Хард-удаление осталось только для `?permanent=true`.
- **Zod-схемы — единый источник истины.** Параметры путей, query-string и
  тело запроса валидируются Zod-схемами, типы DTO выводятся из них через
  `z.infer`, чтобы не дублировать описания.
- **TypeScript strict-mode** включён и на backend, и на frontend.
- **Авторизация — заглушка.** Пользователи и их пароль лежат в `localStorage`. Это сделано только для демо UI; для реальной
  системы нужен серверный auth.


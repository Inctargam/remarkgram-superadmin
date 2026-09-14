# Changelog

Все значимые изменения проекта суперадминки Inctagram (SuperAdmin) документируются в этом файле.

## 2026-09-11

#### Миграция клиентского слоя с TanStack Query на Apollo Client

- Добавлены зависимости `@apollo/client@4.2.12`, `@apollo/client-integration-nextjs@0.14.5`, `rxjs@7.8.2`, `@graphql-typed-document-node/core@3.2.0`; TanStack Query удалён.
- Внедрён codegen (`@graphql-codegen/cli` + `client-preset`, `codegen.ts`, скрипты `codegen`/`codegen:watch`); сгенерированные типы — в `src/shared/api/graphql/__generated__/` (исключены из ESLint/Prettier).
- `QueryProvider` заменён на `ApolloProvider` (`ApolloNextAppProvider` + `HttpLink` на `/api/graphql`) в `app/layout.tsx`; запросы выполняются клиентски (`ssr: false`).
- Все query-хуки (`useUsersQuery`, `useUserQuery`, `useFollowersQuery`, `useFollowingQuery`, `usePaymentsByUserQuery`, `usePostsByUserQuery`) переведены на `useQuery` из `@apollo/client/react`; `keepPreviousData` заменён на `data ?? previousData`, `enabled` — на `skipToken`.
- `useDeleteUserMutation` переведён на `useMutation` с `refetchQueries: ['GetUsers']` (обновление активного списка после удаления).
- Авторизация (`useSignInForm`) переведена на `useMutation(LoginAdminDocument)`.
- Удалены `src/shared/api/graphql/client.ts` (ручной `graphqlRequest`), фабрики `queryKeys.ts` и `src/providers/QueryProvider.tsx`.
- Добавлен тест синхронизации кэша после удаления пользователя; всего 22 теста.

#### Verification

- `pnpm lint` — 0 ошибок; `pnpm exec tsc --noEmit` — чисто; `pnpm test` — 22 теста; `pnpm build` — успешно.
- Дымовой тест dev-сервера: `GET /sign-in` — 200, `POST /api/graphql` — 200.

## 2026-09-02

#### UC-6. Просмотр детальной информации о пользователе

- Добавлены резолверы мок-бэкенда `getUser` (с аватаром `pravatar.cc` и ошибкой «User not found»), `getPaymentsByUser` (12 записей: Stripe/PayPal/CreditCard, `$10`/`$50`, 1 day/7 day), `getFollowers`/`getFollowing` (по 15 записей с сортировкой `userName`/`createdAt` и пагинацией), `getPostsByUser` (12 изображений picsum для сетки).
- Клиент GraphQL расширен типами и типизированными функциями `getUser`, `getPaymentsByUser`, `getFollowers`, `getFollowing`, `getPostsByUser`.
- Новые сущности: `entities/payment` (`usePaymentsByUserQuery`), `entities/follow` (`useFollowListQuery`), `entities/user` — `useUserQuery` и ключ `usersQueryKeys.detail`.
- Страница `/users/{userId}` (фича `user-details`): «← Back to Users List», карточка пользователя (аватар, имя, username, UserID, Profile link, Profile Creation Date) и вкладки ui-kit `Tabs` — Uploaded files (сетка 4 колонки), Payments, Followers, Following — с таблицами (ui-kit `Table`) и пагинацией (8/16/32/64).
- Меню ⋯ в таблице пользователей приведено к дизайну: пункты «Delete User», «Ban in the system», «More Information» с иконками; «More Information» ведёт на профиль пользователя.

#### UC-3. Удаление пользователя

- Резолвер `removeUser` удаляет запись из мок-сида (повторный вызов для неизвестного id возвращает `false`); добавлен `resetMockUsers` для тестов/dev-перезагрузок.
- Клиент: типизированная `removeUser(userId)`.
- `useDeleteUserMutation` инвалидирует кэш `['users']` после успешного удаления.
- `DeleteUserDialog` на ui-kit `ConfirmDialog`: вопрос «Are you sure you want to delete __username__?», кнопки Yes/No, закрытие только по успеху, ошибка сети показывается внутри диалога.

#### UC-2. Просмотр списка пользователей

- Резолвер `getUsers`: 80 мок-пользователей (8 точных из макета + `user-9…80`), сортировка `userName`/`createdAt` с направлением, поиск по `userName`, фильтр `ALL/BLOCKED/UNBLOCKED`, пагинация 8×10 → `UsersPaginationModel`.
- Клиент: типизированный `getUsers` (типы `User`, `UserBan`, `UsersPaginationModel`).
- Tanstack Query: `QueryProvider` (паттерн remark-gram, `environmentManager`) обёрнут в `app/layout.tsx`; сущность `entities/user` (`useUsersQuery`, `keepPreviousData`).
- Фича `users-list`: `useUsersList` (номер страницы в URL, debounce поиска 300 мс, сброс на 1-ю страницу при изменении фильтра/сортировки), `UsersToolbar` (ui-kit `Input type="search"` + `Select` «Not selected/Blocked/Not Blocked»), `UsersTable` на ui-kit `Table` (сортировочные шевроны ↑↓ на «Profile link» и «Date added», индикатор блокировки, меню ⋯), ui-kit `Pagination` (8/16/32/64); состояния: `Alert` при ошибке, `Skeleton`, `Empty`.
- Исправлен баг: смена страницы пагинации сбрасывалась эффектом (сброс теперь срабатывает только на изменение фильтров/поиска/сортировки); `page.tsx` обёрнут в `<Suspense>` под `useSearchParams`.

#### Verification

- `pnpm vitest run` — 21 тест (loginAdmin, getUsers, removeUser, детальные резолверы).
- `pnpm lint` — 0 ошибок; `pnpm exec tsc --noEmit` — чисто.
- Ручная проверка сценариев: вход, список (сортировка/фильтр/поиск/пагинация), удаление с подтверждением, профиль пользователя с вкладками.
- Коммиты: `6e21f7b`, `4dff411`, `b53b9b4`, `44271c3`, `4e7784f`, `4016bf3`, `a0f3fea`, `365b258`, `a964765`, `f259e24`, `24cdc10`, `fef5609`, `570ebc8`.

## 2026-09-01

#### UC-1. Авторизация в системе админа

- Моковый GraphQL-бэкенд на graphql-yoga в Next-роуте `/api/graphql`: полная SDL-схема из контракта (`src/shared/api/graphql/schema.graphql`) и резолвер `loginAdmin` с захардкоженными кредами `admin@gmail.com`/`admin`.
- Легковесный GraphQL-клиент `graphqlRequest` (fetch POST `/api/graphql`, обработка ошибок) и `loginAdmin`; типизация на уровне клиента.
- Фича `sign-in`: `useSignInForm` вызывает `loginAdmin`, состояние `isSubmitting`, ошибка «Invalid email or password» у поля Email при `logged: false`; успех — `setAuthenticated('admin-access-token')` и переход на `/users`.
- Валидация формы приведена к паролю «admin»: проверка длины (min 6) удалена, email-валидация осталась.
- Сессия — in-memory zustand `sessionStore`/`useSessionStatus`; `AppShell` скрывает сайдбар по статусу.
- Тесты резолвера `loginAdmin` (4 кейса) через `yoga.handleRequest` (обход pnpm-двойника `graphql` в vitest).
- Исправлена типизация роут-хендлера: `handleRequest` обёрнут в сигнатуру Next `(request: NextRequest, ctx)`.

#### Verification

- `pnpm vitest run` — тесты резолверов; `pnpm lint` — чисто; `pnpm exec tsc --noEmit` — чисто.
- Коммиты: `cae2f2d`, `17c43df`, `42384c5`, `46c7778`, `5a15627`, `dccc050`.

## 2026-08-31

#### UI-каркас суперадминки

- Добавлены зависимости: `@remark-gram/ui-kit`, `@tanstack/react-query`, `react-hook-form`, `zustand`.
- Хедер по макету (логотип «InctagramSuperAdmin», переключатель языка на ui-kit `Select`), сайдбар (`Sidebar`, `NavLink`) с пунктами Users list / Statistics / Payments list / Posts list (компоненты в `widgets/navigation`, именование как в remark-gram).
- `AppShell`: layout с хедером, сайдбаром и `<main>`; токены макета (`--layout-header-height: 60px`, `--layout-sidebar-width: 220px`) в `app/styles/tokens.css`.
- Страницы-заглушки разделов; корневая `pages/README.md` перекрывает `src/pages` (Pages Router-заглушка как в remark-gram).
- Роуты в корневом `app/`; редирект `/` → `/sign-in`; страница входа (Email/Password, ui-kit `Input`, `Button` «Sign In»).
- Коммиты: `9df3008`, `bb1b0ff`, `19cd9ab`, `5dfd7d7`, `26b5bb8`, `3ae6af2`, `2b7311a`.

## 2026-08-27

#### Инициализация

- `Initial commit from Create Next App` (Next.js, TypeScript).
- Настройка инструментов: ESLint + Prettier, Stylelint, Vitest, пути `@/*` → `src/*`.
- Коммиты: `28407fc`, `7fec200`.

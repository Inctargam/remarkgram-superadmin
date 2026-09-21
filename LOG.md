## 2026-09-21 — Posts list: entity + feature layers (roadmap stages 4–5)
**Goal:** реализовать `src/entities/post/` и `src/features/posts-list/` по `personal/ROADMAP.md` (этапы 4 и 5), используя уже готовые codegen-документы и mock-резолверы `getPosts`/`postAdded`.
**Decisions:**
- `usePostsQuery`/`usePostAddedSubscription` — тонкие обёртки над `useQuery`/`useSubscription`, без cache-typePolicy (в проекте её нигде нет) — аккумуляция страниц и мердж поста из подписки сделаны в `usePostsList` на локальном state.
- Сброс списка при новых данных запроса — паттерн "adjust state during render" (сравнение `data !== postsSource`), не `useEffect`+`setState` — иначе падает `react-hooks/set-state-in-effect`.
- `useInfiniteScroll` — IntersectionObserver, sentinel через `useState` (не `ref`), чтобы обсёрвер переустанавливался при появлении/исчезновении сентинела; актуальные флаги/колбэк кладутся в ref эффектом без deps (не в теле рендера) — иначе `react-hooks/refs`.
- UI: `Card`+`ImageOutlineIcon`+`BlockIcon` из ui-kit, `formatShortDate` переиспользован из `shared/lib/date`.
**Remaining (на момент первого коммита):** этап 6 (диалог блокировки, нужны резолверы `banUser`/`unbanUser` — их пока нет в `server.ts`), этап 7 (подключить `PostsPage` в `app/(main)/posts/page.tsx`), этап 8 (тесты). Не трогал по скоупу задачи.

## 2026-09-21 — Posts list: alt-сценарий блокировки + подключение страницы (этапы 6–7)
**Goal:** доделать `personal/ROADMAP.md` этапы 6 и 7 — entry point блокировки владельца поста на карточке и реальный роут `/posts`.
**Decisions:**
- В `server.ts` добавлены резолверы `banUser`/`unbanUser` (переиспользуют `MOCK_USERS`, паттерн как у `removeUser`) — без них мутация не на чем было бы исполнять.
- `BanUserDocument` + `useBanPostOwnerMutation` — в `features/posts-list/api/` (не в `entities/user`), по аналогии с тем, как `RemoveUserDocument` лежит в `features/users-list`, а не в `entities/user`.
- `BlockUserDialog` — `ConfirmDialog` + `RadioGroup` внутри `message` (вариант "быстрее" из ROADMAP), причины по `personal/UC-ban-user.md`: Bad behavior / Advertising placement / Another reason (последняя открывает `TextArea` для своего текста). Полный UC блокировки — не мой, только entry point.
- На карточке: если владелец уже забанен — статичная `BlockIcon`-индикация (как в `UsersTable`); если нет — кликабельная кнопка с той же иконкой открывает диалог. Один клик, без dropdown — как и просил ROADMAP.
- Старый `app/(main)/posts/page.module.css` (заглушка) удалён — контент и стили теперь только в `PostsPage` из фичи.
**Verified:** `tsc --noEmit`, `eslint`, `vitest run server.test.ts` (21/21) зелёные. `getPosts`/`postAdded` руками проверены curl'ом на dev-сервере (localhost, без кастомного hosts-имени — `dev.admin.remark-gram.com` не резолвится на этой машине, `EADDRNOTAVAIL`).
**Blocker:** визуально проверить в браузере через Claude-in-Chrome не вышло — расширение зависает на "page still loading" на любой странице (репродуцируется даже на `example.com`), похоже на проблему самого расширения в этой сессии, не связано с кодом.
**Remaining:** этап 8 (тесты на `banUser`/`unbanUser`, `usePostsList`, `BlockUserDialog`).

## 2026-09-21 — Posts list: тесты (этап 8)
**Goal:** закрыть последний этап `personal/ROADMAP.md` — тесты на `getPosts`/`postAdded`/`banUser`/`unbanUser` и unit на `usePostsList`/`BlockUserDialog`.
**Decisions:**
- В проекте не было ни jsdom, ни `@testing-library/react` (только vitest + Apollo `MockLink` на node-окружении). Спросил пользователя — выбрал добавить обе зависимости, чтобы полноценно рендерить хук/диалог, а не ограничиваться cache-level тестами. Добавлены `jsdom` и `@testing-library/react` в devDependencies; `vitest.config.ts` не трогал — окружение переключается точечно через `// @vitest-environment jsdom` в шапке новых test-файлов, старые остаются на `node`.
- `server.test.ts`: `getPosts` (пагинация по курсору, поиск по `userName` владельца, сортировка, дефолты), `banUser`/`unbanUser` (бан отражается на `userBan` постов автора, ошибка на неизвестном `userId`).
- `postAdded`-подписка тестируется через `yoga.handleRequest` с `Accept: text/event-stream` и ручным чтением `ReadableStream` — прямой `subscribe()` из пакета `graphql` падает с "Cannot use GraphQLSchema from another module or realm" (в node_modules есть второй экземпляр `graphql`, который тянет `@graphql-tools/executor`). Добавлен `triggerMockPostAdded` — тестовый хук поверх `publishMockPost`, чтобы не ждать 15-секундный dev-интервал.
- `usePostsList.test.tsx`: `renderHook` + `MockedProvider` со сплитом `MockLink`/`MockSubscriptionLink` по `operationType` (как в реальном `ApolloProvider.tsx`) — проверяет накопление страниц через `fetchMore` и мердж/дедуп поста из подписки.
- `BlockUserDialog.test.tsx`: `render` + `fireEvent` (без `@testing-library/jest-dom` — хватило нативных `.disabled` проверок) — подтверждение с причиной вызывает `banUser` с нужными переменными и закрывает диалог; кнопка "Yes" заблокирована для "Another reason" без текста.
- `useBanPostOwnerMutation.test.ts` — по паттерну `useDeleteUserMutation.test.ts`: `refetchQueries: ['GetPosts']` после `banUser` действительно перезапрашивает фид.
**Verified:** `tsc --noEmit`, `eslint` (только 2 старых warning — `<img>` в `PostsGrid`/`UploadsPanel` и неиспользуемый `totalCount` в `getUsers`, оба не мои), `vitest run` — 5 файлов / 38 тестов зелёных.
**Remaining:** ничего по ROADMAP — все 8 этапов закрыты. Не мой объём: полный UC блокировки (`personal/UC-ban-user.md`).

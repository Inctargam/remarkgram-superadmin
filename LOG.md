## 2026-09-21 — Posts list: entity + feature layers (roadmap stages 4–5)
**Goal:** реализовать `src/entities/post/` и `src/features/posts-list/` по `personal/ROADMAP.md` (этапы 4 и 5), используя уже готовые codegen-документы и mock-резолверы `getPosts`/`postAdded`.
**Decisions:**
- `usePostsQuery`/`usePostAddedSubscription` — тонкие обёртки над `useQuery`/`useSubscription`, без cache-typePolicy (в проекте её нигде нет) — аккумуляция страниц и мердж поста из подписки сделаны в `usePostsList` на локальном state.
- Сброс списка при новых данных запроса — паттерн "adjust state during render" (сравнение `data !== postsSource`), не `useEffect`+`setState` — иначе падает `react-hooks/set-state-in-effect`.
- `useInfiniteScroll` — IntersectionObserver, sentinel через `useState` (не `ref`), чтобы обсёрвер переустанавливался при появлении/исчезновении сентинела; актуальные флаги/колбэк кладутся в ref эффектом без deps (не в теле рендера) — иначе `react-hooks/refs`.
- UI: `Card`+`ImageOutlineIcon`+`BlockIcon` из ui-kit, `formatShortDate` переиспользован из `shared/lib/date`.
**Remaining:** этап 6 (диалог блокировки, нужны резолверы `banUser`/`unbanUser` — их пока нет в `server.ts`), этап 7 (подключить `PostsPage` в `app/(main)/posts/page.tsx`), этап 8 (тесты). Не трогал по скоупу задачи.

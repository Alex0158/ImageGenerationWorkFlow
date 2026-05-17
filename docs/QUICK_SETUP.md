# Quick Setup Guide / 快速 SetUp 指引

This guide explains how to set up this Astro static landing page from a fresh Git clone and open it locally in a browser.

本文件說明如何從 0 開始 Git clone，完成本機 SetUp，並在瀏覽器打開這個 Astro static landing page。

---

# 繁體中文版本

## 1. 這個項目是什麼

這是一個 Astro 靜態單頁網站，項目名稱是 `designer-atelier-landing`。

用途：

- 展示 independent graphic designer / visual design atelier。
- 用 editorial / atelier 風格建立信任。
- 引導訪客提交 project brief。

主要技術：

- Astro
- TypeScript
- pnpm
- Sharp image pipeline

## 2. 前置要求

先確認本機有以下工具：

- Git
- Node.js 22.x 建議
- pnpm 10.x 建議

檢查版本：

```bash
git --version
node -v
pnpm -v
```

如果沒有 `pnpm`，可以用 Corepack 啟用：

```bash
corepack enable
corepack prepare pnpm@10.28.2 --activate
pnpm -v
```

## 3. 環境變數與 API 配置

本項目本機快速體驗不需要 `.env`、API key、database、後端服務或第三方 SaaS secret。

目前核查到的 runtime 行為：

- 沒有 `.env.example` 或已提交的 `.env` 文件。
- 程式碼沒有使用 `import.meta.env` 或 `process.env`。
- Contact form 使用 `mailto:` 打開本機 email app，不會提交到後端 API。
- WhatsApp / Instagram / email 連結來自 `src/data/site.ts` 的靜態資料。
- 外部網路依賴只有 Google Fonts 之類的瀏覽器資源；它們不是 API 配置。

如果你只是要本機打開網站體驗，不需要配置任何 secret。

如果要改成真實對外使用的聯絡資料，才需要修改：

```text
src/data/site.ts
```

例如 email、WhatsApp URL、Instagram URL。這是靜態內容配置，不是 `.env` setup。

## 4. 從 0 開始 Clone

建議放在 `/Users/alex/AdsManagement` 下：

```bash
cd /Users/alex/AdsManagement
git clone https://github.com/Alex0158/ImageGenerationWorkFlow.git
cd ImageGenerationWorkFlow
```

如果 GitHub 要求登入或 token，使用你自己的 GitHub 認證流程。不要把 token、password 或 secret 寫入 repo 文件。

## 5. 安裝依賴

```bash
pnpm install
```

預期結果：

- 本機產生 `node_modules/`。
- `pnpm-lock.yaml` 已經在 repo 裡，不需要手動建立。
- 正常情況下不應該修改 source files。

## 6. 啟動前先驗證作品圖片資料

```bash
pnpm validate:works
```

預期輸出：

```text
Validated 20 work entries and optimized asset sets.
```

這一步會確認：

- `src/data/works.ts` 的作品資料存在。
- `public/assets/works/` 內有對應的 AVIF / WebP optimized images。
- 每個作品 entry 的 slug、原圖、尺寸、alt text 和輸出圖片基本一致。

## 7. 起本機 Dev Server

```bash
pnpm dev -- --host 127.0.0.1
```

然後在瀏覽器打開：

```text
http://localhost:4321/
```

如果打不開，再試：

```text
http://127.0.0.1:4321/
```

Astro 預設常用 port 是 `4321`。如果 terminal 顯示另一個 port，以 terminal 實際輸出的 URL 為準。

## 8. 體驗時應該檢查什麼

建議先看這些核心位置：

- 首屏是否有強烈 atelier / editorial 質感。
- Hero 區是否有清楚 offer、作品預覽和 `Send a Brief` CTA。
- `Send a Brief` 是否能捲動到 contact section。
- Showcase carousel 的 previous / next 是否可用。
- Work gallery 的 poster / menu artwork 是否沒有嚴重裁切。
- Contact form 是否會檢查 required fields。
- WhatsApp、copy brief、direct email fallback 是否可見。
- 手機寬度下是否沒有水平滾動、文字重疊、CTA 被壓住。

## 9. 停止 Dev Server

在執行 `pnpm dev` 的 terminal 按：

```text
Ctrl-C
```

確認 port 已停止：

```bash
lsof -iTCP:4321 -sTCP:LISTEN
```

預期結果：

- 沒有輸出，代表 `4321` 沒有 listener。
- 如果仍有輸出，代表還有 process 佔用該 port。

## 10. 修改前後的最低檢查

修改前先看 git 狀態：

```bash
git status --short --branch
```

如果只改 copy、component 或 CSS，完成後至少跑：

```bash
pnpm build
```

如果新增或更換 `public/assets/original/` 內的原圖，按這個順序：

```bash
pnpm optimize:images
pnpm validate:works
pnpm build
```

## 11. 常見問題

### `pnpm: command not found`

執行：

```bash
corepack enable
corepack prepare pnpm@10.28.2 --activate
```

### 網站打不開

先確認 dev server terminal 沒有報錯，然後依次試：

```text
http://localhost:4321/
http://127.0.0.1:4321/
```

如果 Astro terminal 顯示不同 port，使用 terminal 顯示的 URL。

### `4321` port 被佔用

查佔用 process：

```bash
lsof -iTCP:4321 -sTCP:LISTEN
```

停止該 process，或使用 Astro terminal 顯示的 alternate port。

### `pnpm validate:works` 失敗

如果提示 missing optimized assets，先重新生成圖片：

```bash
pnpm optimize:images
pnpm validate:works
```

只有在作品圖片或 `src/data/works.ts` 有變更時才需要重新生成圖片。

### 需要 `.env` 嗎？

本機快速體驗不需要。當前 repo 沒有程式碼讀取 `.env`，也沒有後端 API 或 database connection。

### Contact form 會真的送到 API 嗎？

不會。它會用 `mailto:` 嘗試打開本機 email app，並提供 WhatsApp / copy brief fallback。

## 12. 常用命令

```bash
pnpm dev              # 啟動 Astro dev server
pnpm build            # Astro check + production build
pnpm preview          # 預覽 build 後的網站
pnpm validate:works   # 驗證作品資料與 optimized image assets
pnpm optimize:images  # 從 original images 重新產生 AVIF / WebP
```

---

# English Version

## 1. What This Project Is

This is an Astro static single-page landing site named `designer-atelier-landing`.

Purpose:

- Present an independent graphic designer / visual design atelier.
- Build trust through an editorial / atelier visual language.
- Guide visitors toward sending a project brief.

Main stack:

- Astro
- TypeScript
- pnpm
- Sharp image pipeline

## 2. Prerequisites

Confirm these tools are available:

- Git
- Node.js 22.x recommended
- pnpm 10.x recommended

Check versions:

```bash
git --version
node -v
pnpm -v
```

If `pnpm` is missing, enable it through Corepack:

```bash
corepack enable
corepack prepare pnpm@10.28.2 --activate
pnpm -v
```

## 3. Environment Variables And API Configuration

Local preview for this project does not require `.env`, API keys, a database, a backend service, or third-party SaaS secrets.

Current runtime evidence:

- There is no committed `.env.example` or `.env` file.
- The source code does not use `import.meta.env` or `process.env`.
- The contact form uses `mailto:` to open the local email app; it does not submit to a backend API.
- WhatsApp / Instagram / email links come from static data in `src/data/site.ts`.
- External network usage is limited to browser assets such as Google Fonts; these are not API configuration.

If you only want to open and experience the site locally, no secret configuration is required.

If you want to replace the public contact information for real use, edit:

```text
src/data/site.ts
```

For example, update email, WhatsApp URL, or Instagram URL. This is static content configuration, not `.env` setup.

## 4. Clone From Zero

Recommended local parent folder:

```bash
cd /Users/alex/AdsManagement
git clone https://github.com/Alex0158/ImageGenerationWorkFlow.git
cd ImageGenerationWorkFlow
```

If GitHub asks for authentication, use your normal GitHub account or token flow. Do not write tokens, passwords, or secrets into project files.

## 5. Install Dependencies

```bash
pnpm install
```

Expected result:

- `node_modules/` is created locally.
- `pnpm-lock.yaml` already exists in the repository.
- Source files should normally remain unchanged.

## 6. Validate Work Image Data Before Starting

```bash
pnpm validate:works
```

Expected output:

```text
Validated 20 work entries and optimized asset sets.
```

This confirms:

- Work entries exist in `src/data/works.ts`.
- Matching AVIF / WebP optimized images exist under `public/assets/works/`.
- Each work entry has consistent slug, source image, dimensions, alt text, and output assets.

## 7. Start Local Dev Server

```bash
pnpm dev -- --host 127.0.0.1
```

Then open:

```text
http://localhost:4321/
```

If that does not load, try:

```text
http://127.0.0.1:4321/
```

Astro commonly uses port `4321`. If the terminal prints a different port, use the URL shown by Astro.

## 8. What To Check In The Browser

Start with these core checks:

- First viewport has a strong atelier / editorial impression.
- Hero section has a clear offer, work preview, and `Send a Brief` CTA.
- `Send a Brief` scrolls to the contact section.
- Showcase carousel previous / next controls work.
- Work gallery poster / menu artwork is not badly cropped.
- Contact form validates required fields.
- WhatsApp, copy brief, and direct email fallbacks are visible.
- Mobile width has no horizontal overflow, overlapping text, or buried CTA.

## 9. Stop Dev Server

In the terminal running `pnpm dev`, press:

```text
Ctrl-C
```

Confirm the port is stopped:

```bash
lsof -iTCP:4321 -sTCP:LISTEN
```

Expected result:

- No output means there is no listener on `4321`.
- If output remains, another process is still using that port.

## 10. Minimum Checks Before And After Editing

Before editing, check git status:

```bash
git status --short --branch
```

After copy, component, or CSS changes, run at least:

```bash
pnpm build
```

After adding or replacing original images under `public/assets/original/`, run:

```bash
pnpm optimize:images
pnpm validate:works
pnpm build
```

## 11. Troubleshooting

### `pnpm: command not found`

Run:

```bash
corepack enable
corepack prepare pnpm@10.28.2 --activate
```

### Site Does Not Open

First confirm the dev server terminal has no error. Then try:

```text
http://localhost:4321/
http://127.0.0.1:4321/
```

If Astro prints a different port, use the URL shown in the terminal.

### Port `4321` Is Already In Use

Find the process:

```bash
lsof -iTCP:4321 -sTCP:LISTEN
```

Stop that process, or use the alternate port printed by Astro.

### `pnpm validate:works` Fails

If it reports missing optimized assets, regenerate them:

```bash
pnpm optimize:images
pnpm validate:works
```

Only regenerate images when work images or `src/data/works.ts` changed.

### Do I need `.env`?

No for local quick setup. The current repo has no code reading `.env`, no backend API, and no database connection.

### Does the contact form submit to an API?

No. It uses `mailto:` to open the local email app, with WhatsApp and copy-brief fallbacks.

## 12. Project Commands

```bash
pnpm dev              # Start Astro dev server
pnpm build            # Astro check + production build
pnpm preview          # Preview the built site
pnpm validate:works   # Validate work data and optimized image assets
pnpm optimize:images  # Regenerate AVIF / WebP from original images
```

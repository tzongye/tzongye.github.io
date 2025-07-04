# 開發指南

本文檔包含網站開發與維護的詳細指南。

## 檔案結構

```
.
├── css/
│   ├── main.css         # 全站共用樣式
│   └── project.css      # 專案頁特定樣式
├── images/              # 存放所有專案圖片
├── js/
│   ├── main.js          # 全站共用 JS
│   └── project.js       # 專案頁特定 JS
├── index.html           # 首頁
├── my104.html           # 104 專案頁
├── franklin.html        # 富蘭克林專案頁
├── smarthome.html       # 智慧家庭專案頁
├── morningstar.html     # Morningstar 專案頁
├── README.md            # 專案介紹
└── DEVELOPMENT.md       # 開發指南（本檔案）
```

## 如何新增一個專案頁

依照以下步驟，可以快速新增一頁你的專案介紹。建議直接複製現有的專案頁（如 `morningstar.html`）來修改，以確保結構一致。

### 步驟 1: 建立新的 HTML 檔案

1. 在根目錄下，複製一份 `morningstar.html` 並重新命名，例如 `new-project.html`。

### 步驟 2: 修改頁面基本資訊

打開你剛建立的 `new-project.html`：

1. **修改 `<title>`**：
   ```html
   <title>你的專案名稱 - Isaac Tsai</title>
   ```

2. **修改主選單 `header` 的當前頁面狀態**：
   找到 `<nav>`，將新專案的 `<a>` 連結加上 `active` class，並移除其他連結的 `active`。
   ```html
   <nav class="hidden ...">
     ...
     <a href="morningstar.html" class="block ...">Morningstar 專案</a>
     <a href="new-project.html" class="block ... active">新專案</a>
   </nav>
   ```

### 步驟 3: 更新目錄 (TOC)

目錄分為桌機版 (`.toc`) 和手機版 (`.mobile-toc`)，兩者都需要修改。

1. **定義內容區塊 `id`**：
   在 `<main>` 標籤內，為每一個內容區段 `<section>` 設定一個獨一無二的 `id`。
   ```html
   <main class="project-main container">
     <section id="overview">
       <h2 class="section-title">專案概述</h2>
       ...
     </section>
     <section id="design-process">
       <h2 class="section-title">設計流程</h2>
       ...
     </section>
   </main>
   ```

2. **更新目錄連結**：
   將 `.toc` 和 `.mobile-toc` 裡的 `<a>` 連結 `href` 指向你設定的 `id`，並更新顯示文字。
   ```html
   <!-- Desktop TOC -->
   <nav class="toc">
     <a class="toc-link" href="#overview">專案概述</a>
     <a class="toc-link" href="#design-process">設計流程</a>
     ...
   </nav>

   <!-- Mobile TOC -->
   <div class="mobile-toc">
     ...
     <div id="mobileTocContent" class="mobile-toc-content">
       <a class="toc-link" href="#overview">專案概述</a>
       <a class="toc-link" href="#design-process">設計流程</a>
       ...
     </div>
   </div>
   ```

### 步驟 4: 放置圖片與內容

1. **新增圖片**：將專案圖片全部放到 `images/` 資料夾。
2. **更新內容**：修改 `<main>` 區塊內的 `<h1>`, `<p>`, `<img>` 等標籤，換成你的專案內容。
3. **啟用圖片放大**：確保所有需要點擊放大的圖片都包在 `<div class="image-container">` 裡，JS 會自動抓取並啟用 Lightbox 功能。
   ```html
   <div class="image-container">
     <img src="images/your-new-project-image.png" alt="圖片描述">
   </div>
   ```

### 步驟 5: 更新全站導覽

為了讓用戶能從其他頁面進到新專案，你需要更新**每一個 HTML 檔案**。

1. 打開 `index.html`, `my104.html`, `franklin.html`, `smarthome.html`, `morningstar.html`。
2. 在 `<header>` 的 `<nav>` 中，新增連到 `new-project.html` 的連結。
   ```html
   <nav class="hidden ...">
     ...
     <a href="morningstar.html" class="block ...">Morningstar 專案</a>
     <a href="new-project.html" class="block ...">新專案</a>
   </nav>
   ```

### 步驟 6: 在首頁新增專案卡片

最後，在首頁 (`index.html`) 的作品集區塊加上新專案的入口。

1. 打開 `index.html`。
2. 找到 `id="projects"` 的區塊。
3. 複製一個 `<div class="glass-card">` 區塊，並修改內容：
   - `href`: 新專案的 HTML 檔案路徑。
   - `<h3>`: 新專案標題。
   - `<p>`: 新專案簡介。
   - `<i>` (icon): 可選，可以到 [Font Awesome](https://fontawesome.com/search) 找一個適合的 icon。

   ```html
   <!-- 新專案卡片 -->
   <div class="glass-card ...">
     <a href="new-project.html" class="block">
       <div class="image-container placeholder-image h-56">
         <i class="fas fa-rocket"></i> <!-- 換成你的 icon -->
       </div>
       <div class="p-6">
         <h3 class="text-xl ...">新專案的標題</h3>
         <p class="text-gray-600">新專案的簡短介紹...</p>
       </div>
     </a>
   </div>
   ```

完成以上步驟後，你的新專案就成功上線了！

## 樣式系統

### CSS 架構

- `main.css`: 全站共用樣式，包含：
  - CSS 變數定義
  - 基礎元素樣式
  - 導覽列與頁腳
  - 按鈕與互動元素
  - 響應式設計

- `project.css`: 專案頁特定樣式，包含：
  - 專案頁佈局
  - TOC 樣式
  - 圖片容器與 Lightbox

### 顏色系統

使用 CSS 變數統一管理顏色：

```css
:root {
  --color-primary: #3b82f6;
  --color-text-dark: #1f2937;
  --color-text-medium: #4b5563;
  --color-text-light: #6b7280;
  --color-bg-gray-50: #f9fafb;
}
```

## JavaScript 功能

### 全站功能 (main.js)

- 返回頂部按鈕
- 手機版選單切換
- 平滑滾動
- TOC 滾動追蹤
- Umami 事件追蹤

### 專案頁功能 (project.js)

- 圖片 Lightbox
- 鍵盤導覽支援

## 部署

網站使用 GitHub Pages 自動部署：

1. 推送到 `main` 分支
2. GitHub Actions 自動建置
3. 部署到 `https://tzongye.github.io`

## 開發工具建議

- 使用 Claude + Git 進行開發
- Live Server 擴充功能用於本地開發
- 瀏覽器開發者工具進行除錯
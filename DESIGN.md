# 設計規範指南

## 🎨 卡片樣式規範

### 標準卡片樣式
所有專案卡片必須使用一致的視覺樣式：

```html
<!-- 標準卡片樣式 -->
<div class="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
  <!-- 卡片內容 -->
</div>

<!-- 表格樣式 -->
<table class="min-w-full bg-white rounded-lg border border-slate-200 shadow-sm">
  <!-- 表格內容 -->
</table>
```

### 設計原則
- **背景色**: 統一使用 `bg-white`
- **邊框**: `border border-slate-200` (淡灰色細邊框)
- **陰影**: `shadow-sm` (微妙陰影，增加層次感)
- **圓角**: `rounded-lg` (適度圓角)
- **內距**: `p-6` 或 `p-8` (依內容調整)

### 避免的樣式
- ❌ 只有邊框 `border border-slate-200`
- ❌ 只有陰影 `shadow-md`
- ❌ 混合不同陰影大小

## 📏 字體規範

### 字體大小標準
**全站統一 18px 基準字體**，確保所有文字具備良好可讀性：

| 用途 | 類型 | Tailwind Class | 像素值 |
|------|------|----------------|--------|
| 正文內容 | 基準字體 | `text-base` | **18px** |
| 說明文字 | 基準字體 | `text-base` | **18px** |
| 表格標題 | 小標題 | `text-sm` | 14px |
| 按鈕文字 | 小標題 | `text-sm` | 14px |

### 技術實現
通過 `tailwind.config.js` 覆蓋預設字體大小：
```javascript
fontSize: {
  'base': ['18px', '1.75rem'], // 覆蓋預設 16px
}
```

### 禁止使用
- ❌ `text-xs` (12px) 作為正文或說明文字
- ❌ 過小的字體影響可讀性
- ❌ 寫死的 CSS 字體大小（使用 Tailwind 配置）

## 🎯 視覺元素規範

### 步驟數字樣式
統一的步驟數字設計：

```html
<div class="flex-shrink-0 w-11 h-11 bg-slate-200 text-slate-800 rounded-full flex items-center justify-center font-semibold mr-4">1</div>
```

**規範：**
- **背景色**: `bg-slate-200` (統一灰色)
- **文字色**: `text-slate-800` (深灰色數字)
- **避免**: 多種顏色的步驟數字

### 按鈕規範
- **最小高度**: 32px (`h-8`)
- **重要操作**: 足夠的視覺權重
- **hover 狀態**: 必須提供視覺回饋

## 📐 空間設計規範

### Section 間距層次
根據內容重要性設定不同間距：

```html
<!-- 重要/展示性內容 -->
<section class="py-20">  <!-- 80px 上下間距 -->

<!-- 一般內容區塊 -->  
<section class="py-16">  <!-- 64px 上下間距 -->

<!-- Hero 區塊 -->
<section class="pt-32 pb-20 md:pt-40 md:pb-24">  <!-- 響應式間距 -->
```

### 內容與卡片間距
保持一致的間距節奏：

```html
<!-- 卡片/欄位間距 -->
<div class="grid md:grid-cols-2 gap-10">  <!-- 40px 間距 -->

<!-- 卡片內部 padding -->
<div class="bg-white p-8 rounded-lg">  <!-- 32px 內距 -->

<!-- 主要內容區塊間 -->
<div class="mb-16">  <!-- 64px 底部間距 -->
```

### 響應式圖片對齊
解決雙裝置對比時的對齊問題：

```html
<div class="lg:col-span-2 flex flex-col">
  <div class="mb-4">
    <!-- 文字內容，可彈性伸縮 -->
  </div>
  <div class="flex-1 flex items-start">
    <img class="w-full">  <!-- 圖片始終頂部對齊 -->
  </div>
</div>
```

## 🌈 色彩系統

### 主要色彩 (Tailwind 3.x)
使用溫暖的 slate 色系：

- **深色文字**: `text-slate-800`
- **中色文字**: `text-slate-700`
- **淡色文字**: `text-slate-600`
- **邊框色**: `border-slate-200`
- **背景色**: `bg-slate-50`

### 強調色彩
用於特殊場景的強調色：

- **主要操作**: `text-blue-600`, `hover:text-blue-600`
- **成功狀態**: `bg-emerald-500`
- **警示狀態**: `bg-amber-500`
- **資訊提示**: `bg-blue-500`

### 背景色使用限制
- **建議**: 保持全白背景 `bg-white`
- **必要時**: 僅使用微妙灰階 `bg-slate-50`
- **避免**: 過度使用背景色造成視覺干擾

## 📋 專案頁面開發指南

### 🎨 視覺設計原則

#### 1. 簡潔優先
- **移除冗餘描述**：讓作品自己說話，避免過多文字描述
- **標題精簡**：使用簡潔有力的標題，如「設計改進案例」而非「設計改進案例 - XXX 功能」
- **專業風格**：避免使用 emoji，保持專業作品集的風格

#### 2. 內容展示
- **對比展示**：使用前後對比來展示設計改進效果
- **操作提示**：提供簡潔的操作說明，如「拖曳滑桿查看改版前後差異」
- **去除技術細節**：移除尺寸規格等技術資訊，如「(1440x1024)」

### 🎯 UI 組件規範

#### 1. 列表樣式統一
```html
<!-- ✅ 正確：統一使用這個樣式 -->
<ul class="list-disc pl-6 text-gray-700">
  <li>項目內容</li>
  <li>項目內容</li>
</ul>

<!-- ❌ 錯誤：避免手動添加符號 -->
<ul class="space-y-2 text-gray-700">
  <li>• 項目內容</li>
  <li>• 項目內容</li>
</ul>

<!-- ❌ 錯誤：避免使用 emoji -->
<ul class="space-y-2 text-gray-700">
  <li>✅ 項目內容</li>
  <li>🎯 項目內容</li>
</ul>
```

#### 2. 圖片對比容器

##### 容器設定
- **容器比例**：使用 `aspect-ratio` 保持原始圖片比例
- **響應式高度**：桌面版和手機版使用 `max-height: 85vh`
- **手機版寬度**：外部容器也需限制為 400px

```css
/* 手機版對比的外部容器也限制寬度 */
.website-compare-container:has(.before-after-slider.mobile) {
    max-width: 400px;
}
```

##### 圖片對照邏輯
- **圖片順序**：
  - `before-image` class → 左側顯示
  - `after-image` class → 右側顯示
- **標籤對應**：
  - `before-label` → 左側標籤
  - `after-label` → 右側標籤

##### 常見對照錯誤
```html
<!-- ❌ 錯誤：圖片與標籤不匹配 -->
<img src="new.png" class="before-image">  <!-- 新版圖片在左側 -->
<img src="old.png" class="after-image">   <!-- 舊版圖片在右側 -->
<span class="before-label">改版前</span>  <!-- 但標籤說左側是改版前 -->
<span class="after-label">改版後</span>   <!-- 右側是改版後 -->

<!-- ✅ 正確：確保圖片內容與標籤匹配 -->
<img src="old.png" class="before-image">  <!-- 舊版圖片在左側 -->
<img src="new.png" class="after-image">   <!-- 新版圖片在右側 -->
<span class="before-label">改版前</span>  <!-- 左側標籤：改版前 ✓ -->
<span class="after-label">改版後</span>   <!-- 右側標籤：改版後 ✓ -->
```

##### 檢查清單
在設定對比圖片時，務必確認：
1. [ ] 左側圖片內容與左側標籤匹配
2. [ ] 右側圖片內容與右側標籤匹配  
3. [ ] 圖片文件名與實際內容一致（避免 `new.png` 實際是舊版）
4. [ ] 容器寬度適合圖片比例
5. [ ] 拖曳功能正常運作

#### 3. 拖曳功能優化
- **性能優化**：使用 `requestAnimationFrame` 優化拖曳性能
- **視覺對齊**：確保拖曳 icon 垂直居中（可能需要 `padding-bottom: 2px`）

### 🛠️ 技術實作注意事項

#### 1. JavaScript 功能
- **滾動功能**：如非必要，關閉圖片滾動功能，避免用戶體驗混亂
- **事件處理**：使用防抖和 RAF 優化性能
- **邊界檢測**：實作適當的邊界檢測邏輯

#### 2. CSS 樣式
- **色彩一致性**：使用統一的藍灰色調色彩系統
- **強調色**：避免使用暖色調，保持 `--color-primary: #4A5568`
- **容器寬度**：手機版對比容器限制在 400px

#### 3. 響應式設計
```css
/* 桌面版對比容器 */
.before-after-slider.desktop {
    aspect-ratio: 1440 / 1024;
    max-height: 85vh;
}

/* 手機版對比容器 */
.before-after-slider.mobile {
    aspect-ratio: 430 / 932;
    max-height: 85vh;
    max-width: 400px;
}
```

### 📝 內容結構建議

#### 1. 頁面架構
```
1. 專案概述
2. 挑戰與目標
3. 設計過程/系統
4. 對比展示（如有）
5. 設計成果
6. 專案影響
7. 學習與成長
```

#### 2. 文案原則
- **具體數據**：提供具體的成果數據
- **用戶導向**：從用戶體驗角度描述改進
- **業務價值**：強調對業務的實際影響

### ⚠️ 常見錯誤

#### 1. 樣式不一致
- 同一頁面使用多種列表樣式
- 顏色使用不統一
- emoji 與專業風格不符

#### 2. 功能問題
- 拖曳延遲或卡頓
- 圖片比例不正確
- 響應式體驗不佳

#### 3. 內容冗餘
- 過多技術細節
- 重複的功能描述
- 不必要的操作說明

### 🔧 開發流程

1. **設計審查**：確認設計稿符合規範
2. **內容精簡**：移除冗餘文字和技術細節
3. **樣式統一**：檢查列表、顏色、字體一致性
4. **功能測試**：測試互動功能的性能和體驗
5. **響應式檢查**：確保各設備下顯示正常
6. **最終審查**：整體風格與其他頁面保持一致

## 📱 RWD 響應式設計檢查清單

### 1️⃣ 可視容器
- [ ] **橫向捲軸檢查**：各寬度是否出現橫向 scrollbar，檢查凸出元素
- [ ] **Media Query 設定**：避免 1px 誤差（min-width, max-width 同值）造成跳動
- [ ] **Fixed 元件檢查**：
  - 最小寬度/高度是否被隱藏導致無法操作
  - 是否佔據過多螢幕空間遮蔽內容
- [ ] **Viewport 單位**：避免使用 `vh/dvh` 造成手機捲動跳動，改用 `lvh/svh`
- [ ] **手機橫置**：
  - 高度較低時內容是否可正常操作
  - 考慮 safe-area 是否需要滿版顯示

### 2️⃣ 文字
- [ ] **標題斷行**：測試 `text-wrap: balance` 或 `text-wrap: pretty`
- [ ] **斷行禁則**：關鍵字/公司名設定 `white-space: nowrap` 或 `display: inline-block`
- [ ] **過長文字**：URL 等長文字設定 `word-break: break-all`
- [ ] **條件斷行**：使用 media query 控制 `br { display: none; }`
- [ ] **行長度檢查**：
  - 內文超過 35 字考慮放大字體
  - 不足則縮小字體
  - 使用 `ch` 單位設定文字容器寬度

### 3️⃣ 圖片、影片
- [ ] **圖片響應式**：設定 `width: 100%` 或 `max-width: 100%`
- [ ] **高度重設**：img 有指定 height 需設 CSS `height: auto`
- [ ] **圖片裁切**：考慮使用 `object-fit: cover`
- [ ] **內嵌影片**：YouTube 等設定 `aspect-ratio` 或使用 JS 套件處理

### 4️⃣ 互動
- [ ] **觸控目標**：主要連結/按鈕大小超過 44px
- [ ] **Hover 替代**：手機端提供 hover 效果的替代方案
- [ ] **效能優化**：
  - 特效偵測桌面瀏覽器才執行
  - 或使用靜態圖片替代
- [ ] **無障礙動畫**：偵測 `prefers-reduced-motion` 尊重用戶設定

### 🛠️ RWD 測試工具與方法

#### 測試斷點
```css
/* 建議測試寬度 */
320px   /* 小手機 */
375px   /* iPhone */
768px   /* 平板 */
1024px  /* 桌面 */
1200px  /* 大桌面 */
```

#### 實用 CSS
```css
/* 文字容器寬度控制 */
.content { max-width: 65ch; }

/* 安全的 viewport 單位 */
.full-height { min-height: 100lvh; }

/* 響應式斷行控制 */
@media (max-width: 768px) {
  .desktop-br { display: none; }
}

/* 觸控友善按鈕 */
.touch-target { min-height: 44px; min-width: 44px; }
```

## ✅ 設計檢查清單

### 新專案或更新時的確認事項：

#### 基礎樣式
- [ ] 卡片樣式統一使用 `border border-slate-200 shadow-sm`
- [ ] 字體大小符合 18px 基準標準
- [ ] 步驟數字使用統一的灰色設計

#### 空間設計
- [ ] Section 間距有層次感（py-16 vs py-20）
- [ ] 卡片間距適中（gap-10）
- [ ] 內容 padding 舒適（p-8）

#### 響應式設計 (詳見 RWD 檢查清單)
- [ ] 無橫向捲軸，無 1px media query 誤差
- [ ] Fixed 元件不遮蔽內容，手機橫置可操作
- [ ] 文字斷行適當，觸控目標 ≥44px
- [ ] 圖片響應式，hover 有手機替代方案

#### 視覺效果
- [ ] 移除過度的視覺效果
- [ ] 色彩使用符合規範
- [ ] 互動狀態設計完整

#### 專案頁面特定
- [ ] 對比圖片與標籤正確匹配
- [ ] 拖曳功能流暢無延遲
- [ ] 列表樣式統一，無 emoji
- [ ] 內容精簡，無冗餘描述

## 🚀 進階設計原則

### 設計系統思維
- **原子化設計**: 可重用的組件庫
- **一致性優先**: 統一勝過創新
- **可維護性**: 易於更新和擴展

### 用戶體驗原則
- **可讀性**: 字體大小與對比度
- **可操作性**: 按鈕大小與間距
- **可理解性**: 清晰的視覺層次

### 效能考量
- **圖片優化**: 適當的尺寸與格式
- **CSS 效率**: 避免過度的動畫效果
- **載入體驗**: 漸進式增強

---

**記住：一致性比創意更重要。建立規範後要嚴格遵循，確保整體專案的專業度。**
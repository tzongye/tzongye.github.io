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
確保所有文字具備良好可讀性：

| 用途 | 類型 | Tailwind Class | 像素值 |
|------|------|----------------|--------|
| 正文內容 | 最小字體 | `text-base` | 16px |
| 說明文字 | 最小字體 | `text-base` | 16px |
| 表格標題 | 小標題 | `text-sm` | 14px |
| 按鈕文字 | 小標題 | `text-sm` | 14px |

### 禁止使用
- ❌ `text-xs` (12px) 作為正文或說明文字
- ❌ 過小的字體影響可讀性

## 🎯 視覺元素規範

### 步驟數字樣式
統一的步驟數字設計：

```html
<div class="flex-shrink-0 w-10 h-10 bg-slate-200 text-slate-800 rounded-full flex items-center justify-center font-semibold mr-4">1</div>
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

## ✅ 設計檢查清單

### 新專案或更新時的確認事項：

#### 基礎樣式
- [ ] 卡片樣式統一使用 `border border-slate-200 shadow-sm`
- [ ] 字體大小符合最小 16px 標準
- [ ] 步驟數字使用統一的灰色設計

#### 空間設計
- [ ] Section 間距有層次感（py-16 vs py-20）
- [ ] 卡片間距適中（gap-10）
- [ ] 內容 padding 舒適（p-8）

#### 響應式設計
- [ ] 響應式圖片正確對齊
- [ ] 手機版佈局優化
- [ ] 斷點設置合理

#### 視覺效果
- [ ] 移除過度的視覺效果
- [ ] 色彩使用符合規範
- [ ] 互動狀態設計完整

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
# Design Document

## Overview

本設計方案將 ztron 資料夾中的 8 張專案圖片有機整合到現有的 smarthome.html 頁面中，透過視覺展示增強用戶對 Smart Home App 重構專案的理解。設計重點在於保持現有頁面結構的完整性，同時透過圖片展示提升內容的說服力和專業度。

## Architecture

### 頁面結構分析
現有 smarthome.html 包含以下主要 sections：
1. Hero Section - 專案標題和簡介
2. Overview Section - 專案概述與基本資訊
3. Problems Section - 設計挑戰與解決方案表格
4. Core Section - 核心設計決策
5. Wizard Section - Wizard of Oz 測試驗證
6. Reflection Section - 專案反思與學習

### 圖片整合策略
根據內容邏輯和視覺平衡，將圖片分配到適當的 sections：

**新增 Section：設計成果展示**
- 位置：在 Problems Section 之後，Core Section 之前
- 目的：提供視覺化的設計改進證據

**增強現有 Sections**
- Core Section：添加設計流程和設備界面圖片
- Wizard Section：添加測試場景和最終成果圖片

## Components and Interfaces

### 1. 設計改進對比組件
**位置**：新增的「設計成果展示」section
**圖片**：`4-in-1-original.png` vs `4-in-1-new.png`

```html
<section id="design-showcase" class="py-16 bg-white">
    <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold mb-10">設計成果展示</h2>
        
        <div class="mb-12">
            <h3 class="text-2xl font-semibold mb-6 text-slate-800">界面改進對比</h3>
            <div class="grid md:grid-cols-2 gap-8">
                <div class="image-container">
                    <img src="images/ztron/4-in-1-original.png" alt="重構前的 Smart Home App 界面">
                    <p class="text-center text-sm text-slate-600 mt-2">重構前：複雜色彩、專業術語、缺乏狀態反饋</p>
                </div>
                <div class="image-container">
                    <img src="images/ztron/4-in-1-new.png" alt="重構後的 Smart Home App 界面">
                    <p class="text-center text-sm text-slate-600 mt-2">重構後：簡潔設計、清晰引導、完整狀態系統</p>
                </div>
            </div>
        </div>
    </div>
</section>
```

### 2. 設計流程展示組件
**位置**：Core Section 開頭
**圖片**：`design process.png`

```html
<div class="mb-10">
    <div class="image-container">
        <img src="images/ztron/design process.png" alt="Smart Home App 設計流程圖">
        <p class="text-center text-sm text-slate-600 mt-2">完整的設計流程：從問題發現到解決方案驗證</p>
    </div>
</div>
```

### 3. 設備控制界面組件
**位置**：Core Section 中的「狀態反饋系統重建」部分
**圖片**：`Device.png`, `Device 4.png`

```html
<div class="grid md:grid-cols-2 gap-6 mt-6">
    <div class="image-container">
        <img src="images/ztron/Device.png" alt="智能設備控制界面">
        <p class="text-center text-sm text-slate-600 mt-2">設備控制界面：清晰的狀態顯示</p>
    </div>
    <div class="image-container">
        <img src="images/ztron/Device 4.png" alt="設備狀態反饋系統">
        <p class="text-center text-sm text-slate-600 mt-2">完整的狀態反饋：從操作到確認</p>
    </div>
</div>
```

### 4. 測試場景展示組件
**位置**：Wizard Section 中的「測試設計」部分
**圖片**：`Show 2.png`, `Artboard.png`

```html
<div class="mb-8">
    <div class="image-container">
        <img src="images/ztron/Show 2.png" alt="Wizard of Oz 測試場景展示">
        <p class="text-center text-sm text-slate-600 mt-2">測試場景：在 showroom 中驗證新設計的可用性</p>
    </div>
</div>
```

### 5. 最終成果展示組件
**位置**：新增的「設計成果展示」section 底部
**圖片**：`iPhone_MockUps@1x.png`

```html
<div class="mb-12">
    <h3 class="text-2xl font-semibold mb-6 text-slate-800">最終設計成果</h3>
    <div class="image-container">
        <img src="images/ztron/iPhone_MockUps@1x.png" alt="Smart Home App 手機版界面展示">
        <p class="text-center text-sm text-slate-600 mt-2">重構後的手機版界面：直觀的智能家居控制體驗</p>
    </div>
</div>
```

## Data Models

### 圖片資料結構
```javascript
const imageAssets = {
    comparison: {
        before: "images/ztron/4-in-1-original.png",
        after: "images/ztron/4-in-1-new.png"
    },
    process: "images/ztron/design process.png",
    devices: [
        "images/ztron/Device.png",
        "images/ztron/Device 4.png"
    ],
    testing: [
        "images/ztron/Show 2.png",
        "images/ztron/Artboard.png"
    ],
    final: "images/ztron/iPhone_MockUps@1x.png"
};
```

### 響應式設計考量
- **桌面版**：使用 `md:grid-cols-2` 進行並排顯示
- **手機版**：自動堆疊為單欄顯示
- **圖片容器**：統一使用 `image-container` class 啟用 Lightbox

## Error Handling

### 圖片載入失敗處理
- 使用適當的 `alt` 屬性提供替代文字
- 確保圖片路徑正確性
- 考慮圖片檔案大小對載入速度的影響

### 響應式顯示問題
- 使用 `max-width: 100%` 確保圖片不會溢出容器
- 設定適當的 `aspect-ratio` 保持圖片比例
- 測試不同螢幕尺寸下的顯示效果

## Testing Strategy

### 視覺測試
1. **圖片顯示測試**：確認所有圖片正確載入和顯示
2. **響應式測試**：測試不同設備尺寸下的佈局
3. **Lightbox 功能測試**：確認點擊圖片能正確放大顯示

### 內容一致性測試
1. **文案匹配測試**：確認圖片說明文案與圖片內容匹配
2. **設計規範測試**：確認符合現有的視覺設計標準
3. **用戶體驗測試**：確認圖片增強而非干擾閱讀體驗

### 效能測試
1. **載入速度測試**：確認圖片不會顯著影響頁面載入速度
2. **圖片優化測試**：檢查圖片檔案大小是否合理
3. **快取機制測試**：確認圖片能被正確快取

## Implementation Notes

### Tailwind 2.2.19 相容性
- 避免使用 Tailwind 3.x 的新語法（如透明度 `/` 語法）
- 使用 `text-slate-*` 等色彩類別時確認版本支援
- 保持與現有頁面的樣式一致性

### 現有樣式整合
- 使用現有的 `image-container` class 啟用 Lightbox
- 遵循現有的 section 間距規範（`py-16`）
- 保持與現有卡片樣式的一致性

### SEO 優化
- 為所有圖片提供描述性的 `alt` 屬性
- 使用語義化的 HTML 結構
- 確保圖片不會影響頁面的可訪問性
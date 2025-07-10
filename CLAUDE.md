# Claude 開發指南

## 🚨 重要：JavaScript 問題排查流程

當用戶報告按鈕不工作、功能失效等問題時，**必須**按照以下順序執行：

### 1. 立即要求檢查控制台
```
請打開瀏覽器開發者工具 → Console 標籤，告訴我是否有任何錯誤信息
```

### 2. JavaScript 修改前檢查清單
- [ ] 完整讀取要修改的 JS 文件
- [ ] 檢查函數定義順序（避免 "before initialization" 錯誤）
- [ ] 檢查變量聲明位置
- [ ] 驗證語法正確性
- [ ] 確認 DOM 元素存在性檢查

### 3. 修改後驗證步驟
- [ ] 確保沒有語法錯誤
- [ ] 確保事件監聽器正確綁定
- [ ] 檢查 CSS 樣式不會阻擋點擊事件
- [ ] 驗證 z-index 層級關係

## 📋 專案架構重點

### 主要文件結構
```
├── index.html (首頁)
├── franklin.html (富蘭克林專案)
├── morningstar.html (晨星專案)
├── my104.html (104專案)
├── smarthome.html (智能家居專案)
├── js/
│   ├── main.js (主要功能，所有頁面共用)
│   ├── include.js (載入 navbar/footer)
│   └── project.js
├── css/
│   ├── main.css (主要樣式)
│   └── project.css
└── debug_mobile_toc.js (調試腳本)
```

### 關鍵功能依賴
- **手機版目錄**：依賴 `mobileMenuBtn` 和 `mobileTocContent` 元素
- **返回頂部按鈕**：依賴 `scrollToTop` 元素和 `.visible` CSS 類
- **燈箱功能**：`addLightboxToImages` 必須在使用前定義

## ⚠️ 常見錯誤模式

1. **ReferenceError: Cannot access 'X' before initialization**
   - 檢查函數/變量定義順序
   - 確保在 `DOMContentLoaded` 後執行

2. **按鈕點擊無反應**
   - 先檢查控制台錯誤
   - 檢查事件監聽器是否正確綁定
   - 檢查 CSS `pointer-events` 設置

3. **手機版目錄不顯示**
   - 檢查媒體查詢 `@media (max-width: 1200px)`
   - 驗證元素 ID 是否正確

## 🔧 調試工具

### 現有調試腳本
- `debug_mobile_toc.js` - 手機版目錄功能調試
- 載入於所有專案頁面，提供詳細控制台輸出

### 快速測試命令
```bash
# 語法檢查
node -c js/main.js

# 搜尋特定元素
grep -r "mobileMenuBtn" *.html
```

## 📱 手機版特別注意事項

- TOC 在桌面版隱藏，手機版顯示（1200px 斷點）
- 返回頂部按鈕滾動 300px 後顯示
- 確保 z-index 層級：手機版目錄 (40) < 返回頂部 (100)

## ✅ 標準工作流程

1. **接到問題報告** → 要求檢查控制台
2. **分析錯誤信息** → 定位問題根源
3. **修改前檢查** → 遵循檢查清單
4. **修改代碼** → 逐步小幅修改
5. **測試驗證** → 確認功能正常

---

**記住：控制台是最好的朋友！任何 UI 問題都先檢查 JavaScript 錯誤。**
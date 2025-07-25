# Isaac Portfolio Website

Isaac 的個人作品集網站，展示 UI/UX 設計專案與產品設計經驗。

## 🌟 專案概述

這是一個響應式的作品集網站，展示了多個金融科技與產品設計專案：

- **富蘭克林母子基金平台** - 複雜金融產品的數位化設計
- **Morningstar 金融客戶重建** - 大規模 UI/UX 重建專案  
- **104會員中心重設計** - 使用者體驗優化專案
- **智能家居 App 重構** - 產品架構重新設計

## 🛠 技術棧

### 前端技術
- **HTML5** - 語義化標記
- **CSS3** - 現代樣式設計
- **Tailwind CSS 3.x** - 實用優先的 CSS 框架
- **JavaScript (ES6+)** - 互動功能實現

### 設計工具
- **Figma** - UI/UX 設計與原型製作
- **Adobe Creative Suite** - 視覺設計支援

### 開發工具
- **Git** - 版本控制
- **GitHub Pages** - 網站部署
- **VS Code** - 代碼編輯器

## 📁 專案結構

```
├── index.html              # 首頁
├── franklin.html           # 富蘭克林專案頁面
├── morningstar.html        # 晨星專案頁面  
├── my104.html              # 104專案頁面
├── smarthome.html          # 智能家居專案頁面
├── css/
│   ├── main.css           # 主要樣式文件
│   ├── tailwind.css       # Tailwind 編譯後的樣式
│   └── input.css          # Tailwind 源文件
├── js/
│   ├── main.js            # 主要 JavaScript 功能
│   ├── include.js         # 頁面模組載入
│   └── project.js         # 專案特定功能
├── images/                # 圖片資源
├── navbar.html            # 導航欄組件
├── footer.html            # 頁腳組件
├── tailwind.config.js     # Tailwind 配置文件
├── package.json           # 依賴項目管理
├── CLAUDE.md              # AI 助手開發指南
├── DESIGN.md              # 設計規範指南
└── README.md              # 專案說明文件
```

## 🚀 本地開發

### 環境要求
- Node.js 16+ 
- npm 或 yarn

### 安裝與運行

1. **克隆專案**
   ```bash
   git clone https://github.com/tzongye/tzongye.github.io.git
   cd tzongye.github.io
   ```

2. **安裝依賴**
   ```bash
   npm install
   ```

3. **開發模式** (監聽 CSS 變更)
   ```bash
   npm run build-css
   ```

4. **建構生產版本**
   ```bash
   npm run build
   ```

5. **本地預覽**
   使用 Live Server 或類似工具開啟 `index.html`

## 🎨 設計規範

本專案遵循嚴格的設計規範，詳見 [DESIGN.md](./DESIGN.md)：

- **統一卡片樣式**: `border border-slate-200 shadow-sm`
- **最小字體**: 16px (`text-base`)
- **間距層次**: py-16 (一般) / py-20 (重要)
- **色彩系統**: Slate 色系為主

## 🔧 開發指南

開發相關的技術指南請參考：
- [CLAUDE.md](./CLAUDE.md) - AI 助手開發指南
- [DEVELOPMENT.md](./DEVELOPMENT.md) - 詳細開發指南

## 📱 專案特色

### 響應式設計
- 支援桌機、平板、手機三種裝置
- 彈性的圖片對齊系統
- 優化的手機版導航

### 互動功能
- 🖼️ 拖拽式前後對比展示
- 🔍 圖片燈箱預覽功能
- 🧭 平滑的頁面滾動
- 📋 目錄快速跳轉

### 效能優化
- CSS 預載入與延遲載入
- 圖片懶載入
- Tailwind CSS 精簡建構
- 📊 整合 Umami 與 Microsoft Clarity 分析

## 🌐 線上預覽

[作品集網站](https://tzongye.github.io)

## 🌐 部署

本專案使用 GitHub Pages 自動部署：

1. 推送到 `main` 分支
2. GitHub Actions 自動建構
3. 部署到 `https://tzongye.github.io`

### 手動部署
```bash
# 建構生產版本
npm run build

# 提交變更
git add .
git commit -m "Update portfolio"
git push origin main
```

## 📊 專案統計

- **頁面數量**: 5 個主要頁面
- **專案展示**: 4 個完整案例
- **圖片資源**: 50+ 張設計稿
- **代碼行數**: 2000+ 行

## 🤝 貢獻指南

歡迎提出建議或回報問題：

1. Fork 這個專案
2. 建立功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交變更 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 開啟 Pull Request

## 📄 授權

此專案採用 MIT 授權 - 詳見 [LICENSE](LICENSE) 文件

## 📞 聯絡方式

- **Portfolio**: [https://tzongye.github.io](https://tzongye.github.io)
- **LinkedIn**: [連結待補]
- **Email**: [信箱待補]

---

**打造這個作品集的目標是展示設計思維與技術實現的結合，希望能與志同道合的夥伴交流學習。**
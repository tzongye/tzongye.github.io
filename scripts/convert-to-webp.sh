#!/bin/bash

# WebP 轉換腳本
# 需要先安裝 webp 工具: brew install webp

echo "🔄 開始轉換圖片為 WebP 格式..."

# 檢查是否安裝了 cwebp
if ! command -v cwebp &> /dev/null; then
    echo "❌ cwebp 未安裝。請先執行: brew install webp"
    exit 1
fi

# 轉換專案封面圖片
echo "📸 轉換專案封面圖片..."

# Morningstar 專案
cwebp -q 80 images/cover-morningstar-800w.jpg -o images/cover-morningstar-800w.webp
cwebp -q 80 images/cover-morningstar-1600w.jpg -o images/cover-morningstar-1600w.webp

# Franklin 專案
cwebp -q 80 images/cover-franklin-800w.jpg -o images/cover-franklin-800w.webp
cwebp -q 80 images/cover-franklin-1600w.jpg -o images/cover-franklin-1600w.webp

# 104 專案
cwebp -q 80 images/104-homepage-preview-800w.jpg -o images/104-homepage-preview-800w.webp
cwebp -q 80 images/104-homepage-preview-1600w.jpg -o images/104-homepage-preview-1600w.webp

# Smart Home 專案
cwebp -q 80 images/Cover-800w.jpg -o images/Cover-800w.webp
cwebp -q 80 images/Cover-1600w.jpg -o images/Cover-1600w.webp

echo "✅ WebP 轉換完成！"

# 顯示檔案大小比較
echo ""
echo "📊 檔案大小比較:"
echo "JPEG vs WebP (800w):"
ls -lh images/cover-morningstar-800w.jpg images/cover-morningstar-800w.webp 2>/dev/null | awk '{print $9 ": " $5}'
ls -lh images/cover-franklin-800w.jpg images/cover-franklin-800w.webp 2>/dev/null | awk '{print $9 ": " $5}'

echo ""
echo "🎉 現在可以更新 HTML 使用 <picture> 元素來支援 WebP 格式！"
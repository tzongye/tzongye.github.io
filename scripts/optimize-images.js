#!/usr/bin/env node

/**
 * 圖片優化腳本 - 使用 macOS 內建的 sips 工具
 * 將 JPEG/PNG 圖片轉換為不同尺寸版本，並準備 WebP 轉換指令
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 使用 sips 調整圖片尺寸
function resizeImage(inputPath, outputPath, width) {
    try {
        const command = `sips -Z ${width} "${inputPath}" --out "${outputPath}"`;
        execSync(command, { stdio: 'ignore' });
        console.log(`📐 已調整尺寸: ${path.basename(outputPath)} (寬度: ${width}px)`);
        return true;
    } catch (error) {
        console.error(`❌ 調整尺寸失敗: ${inputPath}`, error.message);
        return false;
    }
}

// 生成響應式圖片尺寸
function generateResponsiveImages(inputPath, baseName, sizes = [800, 1600]) {
    const ext = path.extname(inputPath);
    const nameWithoutExt = baseName.replace(ext, '');
    
    console.log(`\n處理: ${baseName}`);
    
    sizes.forEach(width => {
        // 生成不同尺寸的 JPEG 版本
        const jpegOutput = `images/${nameWithoutExt}-${width}w.jpg`;
        resizeImage(inputPath, jpegOutput, width);
    });
    
    // 輸出 WebP 轉換指令（需要手動執行或安裝 webp 工具）
    console.log(`\n💡 WebP 轉換指令 (需要安裝 webp 工具):`);
    sizes.forEach(width => {
        const jpegFile = `${nameWithoutExt}-${width}w.jpg`;
        const webpFile = `${nameWithoutExt}-${width}w.webp`;
        console.log(`   cwebp -q 80 images/${jpegFile} -o images/${webpFile}`);
    });
}

// 主要處理函數
function processProjectImages() {
    console.log('🖼️  開始處理專案封面圖片...\n');
    
    const projectImages = [
        'cover-morningstar.jpg',
        'cover-franklin.jpg',
        '104-homepage-preview.jpg',
        'ztron/Cover.png'
    ];
    
    projectImages.forEach(imagePath => {
        const fullPath = `images/${imagePath}`;
        
        if (!fs.existsSync(fullPath)) {
            console.log(`⚠️  圖片不存在: ${fullPath}`);
            return;
        }
        
        const baseName = path.basename(imagePath);
        
        // 生成響應式版本
        generateResponsiveImages(fullPath, baseName);
    });
    
    console.log('\n🎉 圖片尺寸調整完成！');
    console.log('\n📋 建議安裝 WebP 工具來生成 WebP 格式：');
    console.log('   macOS: brew install webp');
    console.log('   然後執行上面顯示的 cwebp 指令');
    
    console.log('\n📋 建議的 HTML 結構：');
    console.log(`
<picture class="project-image">
  <source srcset="images/cover-morningstar-800w.webp 800w, images/cover-morningstar-1600w.webp 1600w" 
          type="image/webp">
  <source srcset="images/cover-morningstar-800w.jpg 800w, images/cover-morningstar-1600w.jpg 1600w" 
          type="image/jpeg">
  <img src="images/cover-morningstar-800w.jpg" 
       alt="專案描述" 
       width="800" 
       height="450"
       class="object-cover h-full w-full">
</picture>
    `);
}

// 執行腳本
if (require.main === module) {
    processProjectImages();
}

module.exports = { resizeImage, generateResponsiveImages };
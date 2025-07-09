// 測試JavaScript語法
const fs = require('fs');
const path = require('path');

try {
    const jsContent = fs.readFileSync(path.join(__dirname, 'js/main.js'), 'utf8');
    console.log('JavaScript語法檢查開始...');
    
    // 簡單的語法檢查
    new Function(jsContent);
    console.log('✅ JavaScript語法正確');
    
    // 檢查關鍵函數
    const keyFunctions = [
        'mobileMenuBtn',
        'mobileTocContent',
        'scrollToTop',
        'addEventListener'
    ];
    
    keyFunctions.forEach(func => {
        if (jsContent.includes(func)) {
            console.log(`✅ 找到關鍵詞: ${func}`);
        } else {
            console.log(`❌ 找不到關鍵詞: ${func}`);
        }
    });
    
} catch (error) {
    console.error('❌ JavaScript語法錯誤:', error.message);
    console.error('錯誤位置:', error.lineNumber || '未知');
}
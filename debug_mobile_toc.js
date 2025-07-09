// 手機版目錄調試腳本
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== 手機版目錄調試 ===');
    
    // 檢查元素是否存在
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileTocContent = document.getElementById('mobileTocContent');
    const mobileTocDiv = document.querySelector('.mobile-toc');
    
    console.log('mobileMenuBtn:', mobileMenuBtn);
    console.log('mobileTocContent:', mobileTocContent);
    console.log('mobileTocDiv:', mobileTocDiv);
    
    // 檢查CSS樣式
    if (mobileTocDiv) {
        const computedStyle = window.getComputedStyle(mobileTocDiv);
        console.log('mobile-toc display:', computedStyle.display);
        console.log('mobile-toc visibility:', computedStyle.visibility);
    }
    
    // 檢查媒體查詢
    const mediaQuery = window.matchMedia('(max-width: 1200px)');
    console.log('Media query matches:', mediaQuery.matches);
    
    // 手動添加點擊事件監聽器
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function(e) {
            console.log('手機版目錄按鈕被點擊');
            e.preventDefault();
            e.stopPropagation();
            
            if (mobileTocContent) {
                const isActive = mobileTocContent.classList.contains('active');
                console.log('目錄內容當前狀態:', isActive ? 'active' : 'inactive');
                
                if (isActive) {
                    mobileTocContent.classList.remove('active');
                    console.log('關閉目錄');
                } else {
                    mobileTocContent.classList.add('active');
                    console.log('開啟目錄');
                }
            }
        });
        
        console.log('手機版目錄按鈕事件監聽器已添加');
    } else {
        console.log('❌ 找不到手機版目錄按鈕');
    }
});
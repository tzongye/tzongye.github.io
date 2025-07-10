// 手機版目錄調試腳本
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== 手機版目錄調試 ===');
    
    setTimeout(function() {
        console.log('=== 延遲檢查元素 ===');
        
        // 檢查元素是否存在
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileTocContent = document.getElementById('mobileTocContent');
        const mobileTocDiv = document.querySelector('.mobile-toc');
        const scrollToTopBtn = document.getElementById('scrollToTop');
        
        console.log('mobileMenuBtn:', mobileMenuBtn);
        console.log('mobileTocContent:', mobileTocContent);
        console.log('mobileTocDiv:', mobileTocDiv);
        console.log('scrollToTopBtn:', scrollToTopBtn);
        
        // 檢查CSS樣式
        if (mobileTocDiv) {
            const computedStyle = window.getComputedStyle(mobileTocDiv);
            console.log('mobile-toc display:', computedStyle.display);
            console.log('mobile-toc visibility:', computedStyle.visibility);
            console.log('mobile-toc z-index:', computedStyle.zIndex);
        }
        
        // 檢查媒體查詢
        const mediaQuery = window.matchMedia('(max-width: 1200px)');
        console.log('Media query (max-width: 1200px) matches:', mediaQuery.matches);
        
        const mediaQuery768 = window.matchMedia('(max-width: 768px)');
        console.log('Media query (max-width: 768px) matches:', mediaQuery768.matches);
        
        // 手動添加點擊事件監聽器 - 強制覆蓋
        if (mobileMenuBtn) {
            // 移除所有現有事件
            const newBtn = mobileMenuBtn.cloneNode(true);
            mobileMenuBtn.parentNode.replaceChild(newBtn, mobileMenuBtn);
            
            // 重新獲取元素
            const freshBtn = document.getElementById('mobileMenuBtn');
            
            freshBtn.addEventListener('click', function(e) {
                console.log('🎯 手機版目錄按鈕被點擊 (調試腳本)');
                e.preventDefault();
                e.stopPropagation();
                
                if (mobileTocContent) {
                    const isActive = mobileTocContent.classList.contains('active');
                    console.log('目錄內容當前狀態:', isActive ? 'active' : 'inactive');
                    
                    if (isActive) {
                        mobileTocContent.classList.remove('active');
                        console.log('✅ 關閉目錄');
                    } else {
                        mobileTocContent.classList.add('active');
                        console.log('✅ 開啟目錄');
                    }
                }
                
                return false;
            });
            
            console.log('✅ 手機版目錄按鈕事件監聽器已添加 (調試腳本版本)');
        } else {
            console.log('❌ 找不到手機版目錄按鈕');
        }
        
        // 測試返回頂部按鈕
        if (scrollToTopBtn) {
            // 強制顯示按鈕用於測試
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.pointerEvents = 'auto';
            
            const newScrollBtn = scrollToTopBtn.cloneNode(true);
            scrollToTopBtn.parentNode.replaceChild(newScrollBtn, scrollToTopBtn);
            
            const freshScrollBtn = document.getElementById('scrollToTop');
            freshScrollBtn.addEventListener('click', function(e) {
                console.log('🎯 返回頂部按鈕被點擊 (調試腳本)');
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return false;
            });
            
            console.log('✅ 返回頂部按鈕事件監聽器已添加 (調試腳本版本)');
        }
        
    }, 500);
});
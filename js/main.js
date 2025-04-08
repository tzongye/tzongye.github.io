// 主要JavaScript功能
document.addEventListener('DOMContentLoaded', function() {
    // 滾動到頂部按鈕功能
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (scrollToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });
        
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // 手機版選單功能
    const menuToggle = document.querySelector('.md\\:hidden');
    const mobileNav = document.querySelector('nav');
    
    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', function() {
            mobileNav.classList.toggle('hidden');
            mobileNav.classList.toggle('flex');
        });
    }
    
    // 目錄跟蹤滾動位置
    const sections = document.querySelectorAll('section[id]');
    const tocLinks = document.querySelectorAll('.toc-link');
    
    function updateActiveTocLink() {
        let currentSectionId = '';
        const scrollPosition = window.scrollY;
        
        // 找出當前滾動位置對應的區段
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        // 更新目錄活動連結
        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }
    
    // 如果頁面有目錄，則啟用目錄相關功能
    if (tocLinks.length > 0) {
        // 監聽滾動事件
        window.addEventListener('scroll', updateActiveTocLink);
        
        // 移動端目錄功能
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileTocContent = document.getElementById('mobileTocContent');
        
        if (mobileMenuBtn && mobileTocContent) {
            mobileMenuBtn.addEventListener('click', function(e) {
                e.stopPropagation(); // 防止事件冒泡
                mobileTocContent.classList.toggle('active');
            });
            
            // 點擊目錄項後關閉下拉選單
            const mobileLinks = mobileTocContent.querySelectorAll('a');
            mobileLinks.forEach(link => {
                link.addEventListener('click', function() {
                    mobileTocContent.classList.remove('active');
                });
            });
            
            // 點擊外部時關閉目錄
            document.addEventListener('click', function(event) {
                if (!event.target.closest('.mobile-toc')) {
                    mobileTocContent.classList.remove('active');
                }
            });
        }
        
        // 為目錄連結添加平滑滾動效果
        tocLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerOffset = 80; // 導航欄的高度
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // 初始化
        updateActiveTocLink();
    }
});

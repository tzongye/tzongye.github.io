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

    // 燈箱功能實現
    // 獲取所有使用這些 class 的圖片容器，包括已有的和未來可能加入的
    const addLightboxToImages = () => {
        // 對設計流程部分的圖片添加燈箱效果
        document.querySelectorAll('.image-container:not(.lightbox-enabled)').forEach(container => {
            const img = container.querySelector('img');
            if (img) {
                container.classList.add('lightbox-trigger', 'lightbox-enabled');
                container.addEventListener('click', function() {
                    openLightbox(img.src, img.alt);
                });
            }
        });
        
        // 對主要功能架構部分的卡片圖片添加燈箱效果
        document.querySelectorAll('.glass-card .h-56:not(.lightbox-enabled)').forEach(container => {
            const img = container.querySelector('img');
            if (img) {
                container.classList.add('lightbox-trigger', 'lightbox-enabled');
                container.addEventListener('click', function() {
                    openLightbox(img.src, img.alt);
                });
            }
        });
    };
    
    // 初始調用添加燈箱功能
    addLightboxToImages();
    
    // 獲取燈箱元素
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    
    // 打開燈箱
    function openLightbox(src, alt) {
        lightboxImg.src = src;
        lightboxImg.alt = alt || '圖片預覽';
        lightbox.classList.add('fade-in');
        document.body.classList.add('no-scroll');
        
        // 綁定ESC鍵關閉
        document.addEventListener('keydown', handleEscKey);
    }
    
    // 關閉燈箱
    function closeLightbox() {
        lightbox.classList.remove('fade-in');
        lightbox.classList.add('fade-out');
        
        setTimeout(() => {
            lightbox.classList.remove('fade-out');
            lightbox.style.display = 'none';
            document.body.classList.remove('no-scroll');
        }, 300);
        
        // 解除ESC鍵綁定
        document.removeEventListener('keydown', handleEscKey);
    }
    
    // ESC鍵處理器
    function handleEscKey(e) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    }
    
    // 點擊關閉按鈕
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    // 點擊背景也可關閉
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
    
    // 如果頁面有動態加載的內容，可以考慮使用 MutationObserver
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                addLightboxToImages();
            }
        });
    });
    
    // 監聽頁面中可能會動態加載內容的容器
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});

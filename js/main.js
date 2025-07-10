// 主要JavaScript功能
document.addEventListener('DOMContentLoaded', function() {
    // === Umami 進階事件追蹤 ===
    const projectPages = {
        'index.html': 'homepage',
        'franklin.html': 'franklin',
        'morningstar.html': 'morningstar',
        'my104.html': 'my104',
        'smarthome.html': 'smarthome'
    };
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const currentProject = projectPages[currentPage];

    // 頁面瀏覽追蹤
    if (window.umami && currentProject) {
        window.umami.track('page-view', {
            project: currentProject,
            page: currentPage
        });
    }

    // 專案卡片點擊追蹤（首頁）
    if (currentProject === 'homepage') {
        const projectCards = document.querySelectorAll('a[href$=".html"]');
        projectCards.forEach(card => {
            card.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                const projectName = href.replace('.html', '');
                if (window.umami) {
                    window.umami.track('project-click', {
                        project: projectName,
                        from: 'homepage'
                    });
                }
            });
        });
    }

    // 目錄(TOC)點擊追蹤
    const tocLinksUmami = document.querySelectorAll('.toc-link');
    tocLinksUmami.forEach(link => {
        link.addEventListener('click', function(e) {
            const section = this.getAttribute('href').replace('#', '');
            if (window.umami) {
                window.umami.track('toc-navigation', {
                    project: currentProject,
                    section: section
                });
            }
        });
    });

    // 燈箱圖片點擊追蹤
    if (typeof addLightboxToImages === 'function') {
        const originalOpenLightbox = window.openLightbox;
        window.openLightbox = function(src, alt) {
            if (window.umami) {
                window.umami.track('image-view', {
                    project: currentProject,
                    image: alt || 'unnamed-image'
                });
            }
            if (originalOpenLightbox) {
                originalOpenLightbox(src, alt);
            }
        };
    }

    // 外部連結點擊追蹤
    const externalLinks = document.querySelectorAll('a[href^="http"], a[href^="mailto:"]');
    externalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            let linkType = 'external';
            if (href.includes('linkedin.com')) linkType = 'linkedin';
            else if (href.startsWith('mailto:')) linkType = 'email';
            if (window.umami) {
                window.umami.track('external-link', {
                    project: currentProject,
                    type: linkType,
                    url: href
                });
            }
        });
    });

    // 滾動深度追蹤
    let maxScrollDepth = 0;
    const trackScrollDepth = () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = Math.round((scrollTop / docHeight) * 100);
        if (scrollPercent > maxScrollDepth) {
            if (scrollPercent >= 25 && maxScrollDepth < 25) {
                window.umami?.track('scroll-depth', { project: currentProject, depth: '25%' });
            } else if (scrollPercent >= 50 && maxScrollDepth < 50) {
                window.umami?.track('scroll-depth', { project: currentProject, depth: '50%' });
            } else if (scrollPercent >= 75 && maxScrollDepth < 75) {
                window.umami?.track('scroll-depth', { project: currentProject, depth: '75%' });
            } else if (scrollPercent >= 90 && maxScrollDepth < 90) {
                window.umami?.track('scroll-depth', { project: currentProject, depth: '90%' });
            }
            maxScrollDepth = scrollPercent;
        }
    };
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(trackScrollDepth, 100);
    });

    // 滾動到頂部按鈕功能
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (scrollToTopBtn) {
        console.log('Debug: Scroll to top button found');
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });
        
        scrollToTopBtn.addEventListener('click', function() {
            console.log('Debug: Scroll to top button clicked');
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    } else {
        console.log('Debug: Scroll to top button not found');
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
    
    // 移動端目錄功能 - 簡化版本
    function initializeMobileTOC() {
        console.log('Debug: Starting mobile TOC initialization');
        
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileTocContent = document.getElementById('mobileTocContent');
        
        console.log('Debug: mobileMenuBtn found:', !!mobileMenuBtn);
        console.log('Debug: mobileTocContent found:', !!mobileTocContent);
        
        if (!mobileMenuBtn || !mobileTocContent) {
            console.log('Debug: Mobile TOC elements not found');
            return;
        }
        
        console.log('Debug: Initializing mobile TOC');
        
        // 主要點擊事件
        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('手機版目錄按鈕被點擊');
            
            const isActive = mobileTocContent.classList.contains('active');
            
            if (isActive) {
                mobileTocContent.classList.remove('active');
                console.log('關閉手機版目錄');
            } else {
                mobileTocContent.classList.add('active');
                console.log('開啟手機版目錄');
            }
        });
        
        // 點擊目錄項後關閉下拉選單
        const mobileLinks = mobileTocContent.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileTocContent.classList.remove('active');
                console.log('點擊目錄連結，關閉手機版目錄');
            });
        });
        
        // 點擊外部時關閉目錄
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.mobile-toc')) {
                if (mobileTocContent.classList.contains('active')) {
                    mobileTocContent.classList.remove('active');
                    console.log('點擊外部，關閉手機版目錄');
                }
            }
        });
        
        console.log('Debug: Mobile TOC initialized successfully');
    }
    
    // 初始化手機版目錄（所有頁面都執行）
    initializeMobileTOC();
        
        // 滾動淡入動畫 - 移除複雜的動畫邏輯
        // 暫時移除所有動畫功能，確保內容正常顯示
    
    // 如果頁面有目錄，則啟用目錄相關功能
    if (tocLinks.length > 0) {
        // 監聽滾動事件
        window.addEventListener('scroll', updateActiveTocLink);
        
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
    
    // 獲取燈箱元素
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    
    // 只有在燈箱元素存在時才啟用燈箱功能
    if (lightbox && lightboxImg) {
        // 初始調用添加燈箱功能
        addLightboxToImages();
        
        // 打開燈箱
        function openLightbox(src, alt) {
            lightboxImg.src = src;
            lightboxImg.alt = alt || '圖片預覽';
            lightbox.style.display = 'flex';
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
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
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
    }
});

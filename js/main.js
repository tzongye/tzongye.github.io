// 主要JavaScript功能
document.addEventListener('DOMContentLoaded', function() {
    // === 深色模式初始化 ===
    initializeTheme();
    
    // 創建主題切換按鈕
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('aria-label', '切換深色模式');
    themeToggle.setAttribute('title', '切換深色模式');
    
    // 創建圖標
    const themeIcon = document.createElement('i');
    updateThemeIcon(themeIcon);
    themeToggle.appendChild(themeIcon);
    
    // 創建無障礙公告區域
    const announcement = document.createElement('div');
    announcement.id = 'theme-announcement';
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    document.body.appendChild(announcement);
    
    // 添加事件監聽器
    themeToggle.addEventListener('click', () => {
        toggleTheme();
        updateThemeIcon(themeIcon);
    });
    
    // 鍵盤支援
    themeToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleTheme();
            updateThemeIcon(themeIcon);
        }
    });
    
    // 添加到頁面
    document.body.appendChild(themeToggle);
    
    // 輔助函數
    function initializeTheme() {
        console.log('[Isaac Portfolio] Initializing theme system');
        
        // 從 localStorage 或系統偏好獲取主題
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        
        // 設定初始主題
        document.documentElement.setAttribute('data-theme', currentTheme);
        
        // 監聽系統主題變化
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            }
        });
        
        console.log('[Isaac Portfolio] Theme initialized:', currentTheme);
    }
    
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        console.log('[Isaac Portfolio] Theme switched to:', newTheme);
        
        // 通知屏幕閱讀器
        const announcement = newTheme === 'dark' ? '已切換到深色模式' : '已切換到淺色模式';
        const ariaLive = document.getElementById('theme-announcement');
        if (ariaLive) {
            ariaLive.textContent = announcement;
        }
    }
    
    function updateThemeIcon(iconElement) {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        iconElement.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
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

    // 燈箱圖片點擊追蹤 - 移動到燈箱功能實現後面

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

    // 滾動到頂部按鈕功能 - 簡化版本
    setTimeout(function() {
        const scrollToTopBtn = document.getElementById('scrollToTop');
        
        if (scrollToTopBtn) {
            console.log('[Isaac Portfolio] Scroll to top button found');
            
            // 滾動顯示/隱藏邏輯
            window.addEventListener('scroll', function() {
                if (window.pageYOffset > 300) {
                    scrollToTopBtn.classList.add('visible');
                } else {
                    scrollToTopBtn.classList.remove('visible');
                }
            });
            
            // 點擊事件
            scrollToTopBtn.onclick = function() {
                console.log('[Isaac Portfolio] Scroll to top button clicked');
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return false;
            };
            
            console.log('[Isaac Portfolio] Scroll to top button initialized');
        } else {
            console.log('[Isaac Portfolio] Scroll to top button not found');
        }
    }, 100);
    
    
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
    
    // 移動端目錄功能 - 直接綁定版本
    setTimeout(function() {
        console.log('[Isaac Portfolio] Mobile TOC initialization started');
        
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileTocContent = document.getElementById('mobileTocContent');
        
        console.log('[Isaac Portfolio] Mobile menu button found:', !!mobileMenuBtn);
        console.log('[Isaac Portfolio] Mobile TOC content found:', !!mobileTocContent);
        
        if (mobileMenuBtn && mobileTocContent) {
            console.log('[Isaac Portfolio] Binding mobile TOC events');
            
            // 移除可能存在的舊事件
            mobileMenuBtn.onclick = null;
            
            // 直接使用 onclick
            mobileMenuBtn.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('[Isaac Portfolio] Mobile TOC button clicked');
                
                const isActive = mobileTocContent.classList.contains('active');
                
                if (isActive) {
                    mobileTocContent.classList.remove('active');
                    console.log('[Isaac Portfolio] Mobile TOC closed');
                } else {
                    mobileTocContent.classList.add('active');
                    console.log('[Isaac Portfolio] Mobile TOC opened');
                }
                
                return false;
            };
            
            // 點擊目錄項後關閉下拉選單
            const mobileLinks = mobileTocContent.querySelectorAll('a');
            mobileLinks.forEach(link => {
                link.addEventListener('click', function() {
                    mobileTocContent.classList.remove('active');
                    console.log('[Isaac Portfolio] Mobile TOC closed after link click');
                });
            });
            
            console.log('[Isaac Portfolio] Mobile TOC events bound successfully');
        } else {
            console.log('[Isaac Portfolio] Mobile TOC elements not found');
        }
    }, 100);
        
    
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
            // Umami 追蹤
            if (window.umami && currentProject) {
                window.umami.track('image-view', {
                    project: currentProject,
                    image: alt || 'unnamed-image'
                });
            }
            
            lightboxImg.src = src;
            lightboxImg.alt = alt || '圖片預覽';
            lightbox.style.display = 'flex';
            lightbox.classList.add('fade-in');
            document.body.classList.add('no-scroll');
            
            // 綁定ESC鍵關閉
            document.addEventListener('keydown', handleEscKey);
        }
        
        // 將 openLightbox 函數暴露到全局作用域
        window.openLightbox = openLightbox;
        
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

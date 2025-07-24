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
    
    // =================================
    // 圖片對比滑桿功能
    // =================================
    class WebsiteCompare {
        constructor(container) {
            this.container = container;
            this.slider = container.querySelector('.before-after-slider');
            this.handle = container.querySelector('.slider-handle');
            this.beforeImage = container.querySelector('.before-image');
            this.afterImage = container.querySelector('.after-image');
            this.isDragging = false;
            this.isImageDragging = false;
            this.imageStartX = 0;
            this.imageStartY = 0;
            this.imageCurrentX = 0;
            this.imageCurrentY = 0;
            
            if (this.slider && this.handle && this.afterImage) {
                this.init();
            }
        }
        
        init() {
            // 滑桿拖曳事件
            this.handle.addEventListener('mousedown', this.startDrag.bind(this));
            document.addEventListener('mousemove', this.drag.bind(this));
            document.addEventListener('mouseup', this.stopDrag.bind(this));
            
            // 滑桿觸控事件
            this.handle.addEventListener('touchstart', this.startDrag.bind(this), { passive: false });
            document.addEventListener('touchmove', this.drag.bind(this), { passive: false });
            document.addEventListener('touchend', this.stopDrag.bind(this));
            
            // 圖片滾動事件
            this.setupImageScrolling();
            
            // 點擊跳轉（避免與圖片拖曳衝突）
            this.slider.addEventListener('click', this.jumpTo.bind(this));
            
            // Umami 追蹤
            this.trackInteraction();
        }
        
        setupImageScrolling() {
            // 暫時關閉滾動功能
            // this.slider.addEventListener('wheel', this.scrollImage.bind(this), { passive: false });
            
            // 初始化滾動位置和範圍
            this.scrollY = 0;
            this.maxScrollY = 0;
        }
        
        initScrollLimits() {
            const img = new Image();
            img.src = this.beforeImage.src;
            
            if (img.complete || img.naturalWidth > 0) {
                this.calculateScrollLimits(img);
            } else {
                img.onload = () => {
                    this.calculateScrollLimits(img);
                };
            }
        }
        
        scrollImage(e) {
            console.log('[Isaac Portfolio] Scroll triggered, maxScrollY:', this.maxScrollY);
            
            // 如果沒有滾動空間，直接允許頁面滾動
            if (this.maxScrollY <= 0) {
                console.log('[Isaac Portfolio] No scroll space, allowing page scroll');
                return;
            }
            
            // 滾動靈敏度
            const scrollSpeed = 30;
            
            // 計算滾動方向和距離
            const deltaY = e.deltaY;
            const newScrollY = this.scrollY + (deltaY > 0 ? scrollSpeed : -scrollSpeed);
            
            // 調試用
            console.log('[Isaac Portfolio] Current scrollY:', this.scrollY, 'Max:', this.maxScrollY, 'Delta:', deltaY);
            
            // 檢查是否已到達邊界
            const isAtTop = this.scrollY <= 0 && deltaY < 0;
            const isAtBottom = this.scrollY >= this.maxScrollY && deltaY > 0;
            
            console.log('[Isaac Portfolio] At top:', isAtTop, 'At bottom:', isAtBottom);
            
            // 如果已到達邊界，允許頁面滾動
            if (isAtTop || isAtBottom) {
                console.log('[Isaac Portfolio] Allowing page scroll');
                return; // 不阻止預設行為，讓瀏覽器自然滾動
            }
            
            // 防止頁面滾動
            e.preventDefault();
            
            // 更新滾動位置
            this.scrollY = Math.max(0, Math.min(this.maxScrollY, newScrollY));
            
            // 應用滾動變換
            const transform = `translateY(-${this.scrollY}px)`;
            this.beforeImage.style.transform = transform;
            this.afterImage.style.transform = transform;
            
            // Umami 追蹤
            if (window.umami && currentProject && this.maxScrollY > 0) {
                window.umami.track('image-scroll', {
                    project: currentProject,
                    action: 'scroll-view',
                    scrollPosition: Math.round((this.scrollY / this.maxScrollY) * 100)
                });
            }
        }
        
        calculateScrollLimits(img) {
            const sliderRect = this.slider.getBoundingClientRect();
            const imgAspectRatio = img.naturalWidth / img.naturalHeight;
            const containerAspectRatio = sliderRect.width / sliderRect.height;
            
            console.log('[Isaac Portfolio] Image:', img.naturalWidth, 'x', img.naturalHeight, 'ratio:', imgAspectRatio);
            console.log('[Isaac Portfolio] Container:', sliderRect.width, 'x', sliderRect.height, 'ratio:', containerAspectRatio);
            
            let maxScrollY = 0;
            
            // 計算圖片實際顯示尺寸 (使用 object-fit: cover)
            let actualImageHeight, actualImageWidth;
            
            if (imgAspectRatio > containerAspectRatio) {
                // 圖片較寬，以容器高度為準，寬度會超出
                actualImageHeight = sliderRect.height;
                actualImageWidth = sliderRect.height * imgAspectRatio;
                console.log('[Isaac Portfolio] Image is wider, using container height');
            } else {
                // 圖片較高，以容器寬度為準，高度會超出
                actualImageWidth = sliderRect.width;
                actualImageHeight = sliderRect.width / imgAspectRatio;
                console.log('[Isaac Portfolio] Image is taller, calculated height:', actualImageHeight);
            }
            
            // 如果圖片高度超出容器，可以滾動
            this.maxScrollY = Math.max(0, actualImageHeight - sliderRect.height);
            console.log('[Isaac Portfolio] Max scroll Y:', this.maxScrollY);
        }
        
        
        startDrag(e) {
            this.isDragging = true;
            e.preventDefault();
            
            // 追蹤開始拖曳
            if (window.umami && currentProject) {
                window.umami.track('compare-slider-start', {
                    project: currentProject,
                    action: 'drag-start'
                });
            }
        }
        
        drag(e) {
            if (!this.isDragging) return;
            
            e.preventDefault();
            
            // 使用 requestAnimationFrame 優化性能
            if (this.dragRAF) return; // 避免重複調用
            
            this.dragRAF = requestAnimationFrame(() => {
                const rect = this.slider.getBoundingClientRect();
                const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
                const percent = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
                
                this.updateSlider(percent);
                this.dragRAF = null;
            });
        }
        
        stopDrag() {
            if (this.isDragging) {
                // 清理 requestAnimationFrame
                if (this.dragRAF) {
                    cancelAnimationFrame(this.dragRAF);
                    this.dragRAF = null;
                }
                // 追蹤結束拖曳
                if (window.umami && currentProject) {
                    window.umami.track('compare-slider-end', {
                        project: currentProject,
                        action: 'drag-end'
                    });
                }
            }
            this.isDragging = false;
        }
        
        jumpTo(e) {
            if (this.isDragging || this.isImageDragging || e.target === this.handle || this.handle.contains(e.target)) return;
            
            const rect = this.slider.getBoundingClientRect();
            const percent = ((e.clientX - rect.left) / rect.width) * 100;
            this.updateSlider(percent);
            
            // 追蹤點擊跳轉
            if (window.umami && currentProject) {
                window.umami.track('compare-slider-jump', {
                    project: currentProject,
                    action: 'click-jump',
                    position: percent.toFixed(0)
                });
            }
        }
        
        updateSlider(percent) {
            this.handle.style.left = `${percent}%`;
            this.afterImage.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
        }
        
        trackInteraction() {
            // 追蹤滑桿載入
            if (window.umami && currentProject) {
                window.umami.track('compare-slider-load', {
                    project: currentProject,
                    component: 'before-after-slider'
                });
            }
        }
    }
    
    // 初始化所有對比組件
    const compareContainers = document.querySelectorAll('.website-compare-container');
    compareContainers.forEach(container => {
        new WebsiteCompare(container);
    });
});

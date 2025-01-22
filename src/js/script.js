class ConfiguruSite {
    MAX_MEDIA_992 = window.matchMedia('(max-width: 992px)');
    MAX_MEDIA_1200 = window.matchMedia('(max-width: 1200px)');

    constructor() {
        this.init();
    }

    init() {
        this.initLozad();
        this.initBurgerMenu();
        this.initParallax();
        this.initSliders();
        this.initTabs();
        this.initHeader();
        this.initAnchors();
        this.initIndustries();
    }

    initIndustries() {
        const industries = document.querySelectorAll('.industries__industry');
        const industriesVideo = document.querySelector('.industries__video');
        const industriesVideos = [
            {
                industry: 'real-estate',
                src: '/files/videos/industries/real-estate.mp4'
            },
            {
                industry: 'furniture',
                src: '/files/videos/industries/furniture.mp4'
            },
            {
                industry: 'transportation',
                src: '/files/videos/industries/transportation.mp4'
            },
            {
                industry: 'retail',
                src: '/files/videos/industries/retail.mp4'
            },
        ]

        if (!industries || !industriesVideo || this.MAX_MEDIA_1200.matches) return;

        let changeIndustryTimer;

        industries.forEach(industry => {
            const industryType = industry.dataset.industry;
            const industryVideo = industriesVideos.find(video => video.industry === industryType);

            if (!industryVideo) return;

            industry.addEventListener('mouseenter', handleIndustryMouseEnter);
            industry.addEventListener('mouseleave', handleIndustryMouseLeave);

            function handleIndustryMouseEnter() {
                if (industriesVideo.src.includes(industryVideo.src)) return;

                clearTimeout(changeIndustryTimer);

                changeIndustryTimer = setTimeout(() => {
                    hideIndustriesBackground();

                    if (industriesVideo.src) {
                        industriesVideo.classList.remove('is-visible');

                        setTimeout(() => {
                            industriesVideo.src = industryVideo.src;
                            industriesVideo.classList.add('is-visible');
                        }, 500)
                    } else {
                        industriesVideo.classList.add('is-visible');
                        industriesVideo.src = industryVideo.src;
                    }
                }, 500)
            }

            function handleIndustryMouseLeave() {
                clearTimeout(changeIndustryTimer);
            }
        });

        function hideIndustriesBackground() {
            const industriesBackground = document.querySelector('.industries__background');

            if (!industriesBackground) return;

            industriesBackground.classList.add('is-hidden');
        }
    }

    initHeader() {
        const siteHeader = document.querySelector('.site-header');

        animateHeader();
        observeSwitchLogos();

        function observeSwitchLogos() {
            const headerLogo = siteHeader.querySelector('.site-header__logo');

            if (!headerLogo) return;

            function checkHeaderPosition() {
                const sectionsWithSwitch = document.querySelectorAll('.industries');

                if (!sectionsWithSwitch) return;

                sectionsWithSwitch.forEach(section => {
                    const sectionHeight = section.scrollHeight;
                    const sectionTop = section.getBoundingClientRect().top;

                    if (sectionTop <= 0 && Math.abs(sectionTop) < sectionHeight) {
                        headerLogo.classList.add('is-show-white');
                    } else {
                        headerLogo.classList.remove('is-show-white');
                    }
                })

            }

            window.addEventListener('scroll', checkHeaderPosition);


        }

        function animateHeader() {
            let lastScrollTop = 0;


            const handleWindowScroll = () => {
                const scrollTop = document.documentElement.scrollTop;

                if (scrollTop > lastScrollTop && scrollTop > 100) {
                    siteHeader.classList.add('is-scrolling-down');
                } else {
                    siteHeader.classList.remove('is-scrolling-down');
                }

                lastScrollTop = scrollTop;
            }

            window.addEventListener('scroll', handleWindowScroll);
        }
    }

    initAnchors() {
        const anchors = document.querySelectorAll('[data-anchor]');

        if (!anchors) return;

        initScrollOnLoad();

        anchors.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();

                const href = this.getAttribute('href');
                const scrollTarget = document.querySelector(href);

                if (!scrollTarget) return;

                const topOffset = 0;
                const elementPosition = scrollTarget.getBoundingClientRect().top;
                const offsetPosition = elementPosition - topOffset;

                window.scrollBy({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            });
        });

        function initScrollOnLoad() {
            const hashIndex = [...window.location.href].findIndex(item => item === '#');

            if (hashIndex === -1) return;

            const scrollTargetId = window.location.href.slice(hashIndex);

            if (scrollTargetId === '#') return;

            const scrollTarget = document.querySelector(scrollTargetId);
            const topOffset = headerHeight;
            const elementPosition = scrollTarget.getBoundingClientRect().top;
            const offsetPosition = elementPosition - topOffset;

            window.scrollBy({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }

    }


    initBurgerMenu() {
        const self = this;
        const burger = document.querySelector('.burger');
        const burgerMenu = document.querySelector('.menu');

        initSubmenus();
        handleMenuAnchorsClick();

        burger.addEventListener('click', handleBurgerClick);

        function handleMenuAnchorsClick() {
            const menuAnchors = burgerMenu.querySelectorAll('[data-anchor]');

            if (!menuAnchors) return;

            menuAnchors.forEach(anchor => {
                anchor.addEventListener('click', closeBurgerMenu);
            })
        }

        function initSubmenus() {
            const menuButtons = burgerMenu.querySelectorAll('.menu__item-button');

            if (!menuButtons) return;

            menuButtons.forEach(button => {
                const buttonMenu = button.nextElementSibling;
                const buttonMenuBack = buttonMenu.querySelector('.menu__submenu-back');

                button.addEventListener('click', handleButtonClick);
                buttonMenuBack.addEventListener('click', handleBackClick);

                function handleBackClick() {
                    buttonMenu.classList.remove('is-open');
                }

                function handleButtonClick() {
                    if (!self.MAX_MEDIA_992.matches) return;

                    buttonMenu.classList.add('is-open');

                }
            });
        }

        function closeBurgerMenu() {
            burger.classList.remove('is-active');
            burgerMenu.classList.remove('is-open');
            document.body.classList.remove('is-lock');
        }

        function handleBurgerClick() {
            burger.classList.toggle('is-active');
            burgerMenu.classList.toggle('is-open');
            document.body.classList.toggle('is-lock');
        }
    }

    initParallax() {
        const circles = document.querySelectorAll('.section__circle');

        if (!circles) return;

        circles.forEach(circle => {
            let step = 50;
            const isReverse = circle.hasAttribute('data-reverse');

            if (isReverse) {
                step = -step;
            }

            window.addEventListener('mousemove', function (e) {
                let x = e.clientX / window.innerWidth;
                let y = e.clientY / window.innerHeight;

                circle.style.transform = `translate(${x * step}px, ${y * step}px)`;
            });

        })
    }

    initLozad() {
        const lozadElements = document.querySelectorAll('[data-lozad]');

        if (!lozadElements) return;

        lozadElements.forEach(element => {
            const lozadObserver = lozad(element);

            lozadObserver.observe()
        });
    }

    initSliders() {
        const sliders = document.querySelectorAll('[data-slider]');

        if (!sliders) return;

        const DEFAULT_OPTIONS = {
            slidesPerView: 'auto',
            speed: 1000,
            grabCursor: true,
            spaceBetween: 24,
        }

        sliders.forEach(slider => {
            const sliderType = slider.dataset.slider;
            const options = getOptionsByType(slider, sliderType);

            const sliderSwiper = new Swiper(slider, options);
        })

        function getOptionsByType(slider, type) {
            let options = { ...DEFAULT_OPTIONS };

            switch (type) {
                case "team": {
                    const teamPrev = slider.closest('.team__body').querySelector('.team__arrow--prev');
                    const teamNext = slider.closest('.team__body').querySelector('.team__arrow--next');
                    options = {
                        ...options,
                        slidesPerView: 2,
                        spaceBetween: 16,
                        grid: {
                            rows: 2,
                            fill: 'colmn'
                        },
                        navigation: {
                            prevEl: teamPrev,
                            nextEl: teamNext,
                        },
                        breakpoints: {
                            767: {
                                slidesPerView: 'auto',
                                spaceBetween: 24,
                                grid: {
                                    rows: 1,
                                    fill: 'row'
                                }
                            }
                        }
                    }
                    break;
                }
                case "companies": {
                    options = {
                        ...options,
                        spaceBetween: 64,
                        effect: 'fade',
                        fadeEffect: {
                            crossFade: true
                        },
                        pagination: {
                            el: '.companies__slider-pagination',
                            clickable: true
                        },
                        navigation: {
                            prevEl: '.companies__slider-arrow--prev',
                            nextEl: '.companies__slider-arrow--next',
                        },
                    }
                    break;
                }
            }

            return options;
        }
    }

    initTabs() {
        const tabsContainers = document.querySelectorAll('[data-tabs]');

        if (!tabsContainers) return;

        tabsContainers.forEach(container => {
            const tabs = container.querySelectorAll('[data-tab]');
            const tabsContents = container.querySelectorAll('[data-tabcontent]');

            tabs.forEach(tab => {
                tab.addEventListener('click', handleTabClick);
            })

            function handleTabClick(e) {
                const { target } = e;
                const tabValue = target.dataset.tab;
                const tabContent = [...tabsContents].find(content => content.dataset.tabcontent === tabValue);

                if (!tabContent) return;

                setActiveTab(target, tabContent);
            }

            function setActiveTab(tab, tabcontent) {
                const activeTab = [...tabs].find(tab => tab.classList.contains('is-active'));
                const activeTabcontent = [...tabsContents].find(tabsContents => tabsContents.classList.contains('is-active'));

                activeTab.classList.remove('is-active');
                activeTabcontent.classList.remove('is-active');
                tab.classList.add('is-active');
                tabcontent.classList.add('is-active');
            }
        })
    }
}

window.addEventListener('DOMContentLoaded', new ConfiguruSite());
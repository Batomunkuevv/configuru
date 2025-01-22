"use strict";


//?==============<Add zero>============== 

function addZero(number) {
    return number > 9 ? number : `0${number}`;
}

//?==============</Add zero>=============

//?==============<Init Header Panel>==============

function initHeaderPanel() {
    const burger = document.querySelector('.burger');
    const headerPanel = document.querySelector('.site-header__panel');

    if (!burger || !headerPanel) return;

    const headerLogo = document.querySelector('.site-header__logo');
    const headerBody = document.querySelector('.site-header__body');
    const headerLanguages = document.querySelector('.site-header__languages');

    initMenuItems();

    burger.addEventListener('click', (e) => {
        closeHeaderPanel();
    })

    function initMenuItems() {
        const menu = headerPanel.querySelector('.menu');

        if (!menu) return;

        menu.addEventListener('click', (e) => {
            const { target } = e;

            if (target.classList.contains('menu__link')) {
                closeHeaderPanel();
            }
        });
    }

    function closeHeaderPanel() {
        headerBody.classList.toggle('is-active');
        headerPanel.classList.toggle('is-active');
        headerLanguages.classList.toggle('is-visible');
        burger.classList.toggle('is-active');
        headerLogo.classList.toggle('is-active');
        document.body.classList.toggle('lock');
    };
}

//?==============</Init Header Panel>=============

//?==============<Init Parallax>==============

function initParallax() {
    const decorations = document.querySelectorAll('[data-parallax]');

    if (!decorations) return;

    decorations.forEach(decoration => {
        let step = 50;

        if (window.matchMedia('(max-width: 768px)').matches) step = 25;

        if (decoration.dataset.parallax === 'reverse') {
            step = -step;
        }

        window.addEventListener('mousemove', function (e) {
            let x = e.clientX / window.innerWidth;
            let y = e.clientY / window.innerHeight;

            decoration.style.transform = `translate(${x * step}px, ${y * step}px)`;
        });

    })
}

//?==============</Init Parallax>=============

//?==============<Init Full page>============== 

function initFullPage() {
    let page = document.querySelector('.page');

    if (!page) return;

    initFooterScrollLinks();

    const fullPage = new fullpage(page, {
        autoScrolling: true,
        scrollHorizontally: true,
        scrollingSpeed: 500,
        sectionSelector: 'section',
        slideSelector: '[data-scroll="horisontal"]',
        controlArrows: false,
        keyboardScrolling: false,
        easingcss3: 'cubic-bezier(0.49, 0.01, 0.27, 1)',
        licenseKey: 'OPEN-SOURCE-GPLV3-LICENSE',
        responsiveWidth: 1200,
        waterEffect: true,
        scrollOverflow: false,

        afterLoad: function (origin, destination, direction, trigger) {
            const destinationIndex = destination.index + 1;

            setSectionNumber(destinationIndex);
            changeFooterScrollLinks(destination);
            setWhiteBurger(destination);
            setWhiteFooterNav(destination);
            if (window.matchMedia('(min-width: 992px)').matches) initGears(destination);
        },

        onLeave: function (section, destinationSection, direction, trigger) {
            const destinationSectionIndex = destinationSection.index;
            const sectionIndex = section.index;

            stopVideo(section);
            playVideo(destinationSection);

            if (window.matchMedia('(min-width: 1200px)').matches) {
                if (destinationSectionIndex === 0) {
                    fullPage.setAllowScrolling(true, 'down');
                    page.removeEventListener('wheel', horisontalRightScroll);
                }

                if (destinationSectionIndex === 1) {
                    fullPage.setAllowScrolling(false, 'down');

                    if (sectionIndex === 0) {
                        setTimeout((e) => {
                            page.addEventListener('wheel', horisontalRightScroll);
                        }, 500);
                    } else {
                        fullPage.setAllowScrolling(true, 'down')
                        page.removeEventListener('wheel', horisontalLeftScroll);
                        setTimeout((e) => {
                            page.addEventListener('wheel', horisontalLeftScroll);
                        }, 500);
                    }
                }

                if (destinationSectionIndex === 2) {
                    fullPage.setAllowScrolling(true, 'up');
                }
            }

        },

        onSlideLeave: function (section, origin, destination, direction, trigger) {

            if (window.matchMedia('(min-width: 1200px)').matches) {
                const isFirst = destination.isFirst;
                const isLast = destination.isLast;

                fullPage.setAllowScrolling(false, 'down');
                fullPage.setAllowScrolling(false, 'up');

                if (isFirst) {
                    page.addEventListener('wheel', horisontalRightScroll)
                    page.removeEventListener('wheel', horisontalLeftScroll);
                    fullPage.setAllowScrolling(true, 'up')
                    return;
                };

                if (isLast) {
                    page.addEventListener('wheel', horisontalLeftScroll);
                    page.removeEventListener('wheel', horisontalRightScroll);
                    fullPage.setAllowScrolling(true, 'down')
                    return;
                }

                if (!isFirst && !isLast) {
                    page.addEventListener('wheel', horisontalLeftScroll);
                    page.addEventListener('wheel', horisontalRightScroll);
                    return;
                }
            }


        },

    });

    function stopVideo(section) {
        const sectionElement = section.item;
        const sectionVideoFrame = sectionElement.querySelector('.ipad__frame--video');

        if (!sectionVideoFrame) return;

        const sectionVideo = sectionVideoFrame.querySelector('video');

        sectionVideoFrame.classList.add('is-paused');
        sectionVideo.pause();
    }

    function playVideo(section) {
        const sectionElement = section.item;
        const sectionVideoFrame = sectionElement.querySelector('.ipad__frame--video');

        if (!sectionVideoFrame) return;

        const sectionVideo = sectionVideoFrame.querySelector('video');

        sectionVideoFrame.classList.remove('is-paused');
        sectionVideo.play();
    }

    function initGears(destination) {
        const gears = document.querySelectorAll('.advantages__gear');
        const isAdvantages = destination.item.classList.contains('advantages');

        if (isAdvantages) {
            gears.forEach(gear => {

                gear.addEventListener('transitionstart', (e) => {
                    gear.classList.add('is-rotate');
                })

                gear.addEventListener('transitionend', (e) => {
                    gear.classList.remove('is-rotate');
                })

                gear.classList.add('is-fall');
            })
            return;
        }

        gears.forEach(gear => gear.classList.remove('is-fall'))
    }

    function setWhiteFooterNav(destination) {
        const footerNavigation = document.querySelector('.footer__navigation');
        const isAtmosphere = destination.item.classList.contains('atmosphere');

        if (isAtmosphere) {
            footerNavigation.classList.add('is-white');
            return;
        }

        footerNavigation.classList.remove('is-white');
    }

    function setWhiteBurger(destination) {
        const burger = document.querySelector('.burger');
        const isAnimated = destination.item.classList.contains('animated');

        if (isAnimated) {
            burger.classList.add('is-white');
            return;
        }

        burger.classList.remove('is-white');
    }

    function horisontalLeftScroll(e) {
        const directionWheel = e.deltaY;

        if (directionWheel < 0) {
            fullPage.moveSlideLeft();
        }
    }

    function setSectionNumber(number) {
        const numberBlock = document.querySelector('.footer__number-block');

        numberBlock.textContent = addZero(number);
    }

    function changeFooterScrollLinks(destination) {
        const scrollUp = document.querySelector('[data-scroll="up"]');
        const scrollDown = document.querySelector('[data-scroll="down"]');

        if (!scrollUp || !scrollDown) return;

        const isLast = destination.isLast;

        if (!isLast) {
            scrollUp.classList.add('is-hidden');
            scrollDown.classList.remove('is-hidden');
            return;
        }

        scrollDown.classList.add('is-hidden');
        scrollUp.classList.remove('is-hidden');
    }

    function initFooterScrollLinks() {
        const scrollUp = document.querySelector('[data-scroll="up"]');
        const scrollDown = document.querySelector('[data-scroll="down"]');

        if (scrollDown) {
            scrollDown.addEventListener('click', (e) => {
                const activeSection = fullPage.getActiveSection();
                const isRender = activeSection.item.classList.contains('render');

                if (!isRender) {
                    fullPage.moveSectionDown();
                }
            })
        }

        if (scrollUp) {
            scrollUp.addEventListener('click', (e) => {
                fullPage.moveTo(1);

                scrollUp.classList.add('is-hidden');
                scrollDown.classList.remove('is-hidden');
            });
        }
    }

    function horisontalRightScroll(e) {
        const directionWheel = e.deltaY;

        if (directionWheel > 0) {
            fullPage.moveSlideRight();
        }
    }
}

//?==============</Init full page>=============

//?==============<Init reviews slider>============== 

function initReviewsSlider() {
    let reviewsSlider = document.querySelector('.reviews__slider');

    if (!reviewsSlider) return;

    reviewsSlider = new Swiper(reviewsSlider, {
        loop: true,
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 30,
        speed: 500,

        navigation: {
            prevEl: '.arrow--prev',
            nextEl: '.arrow--next',
        }
    })
}

//?==============</Init reviews slider>=============

//?==============<Init phone mask>============== 

function initPhoneMask() {
    [].forEach.call(document.querySelectorAll('[name="phone"]'), function (input) {
        var keyCode;

        function mask(event) {
            event.keyCode && (keyCode = event.keyCode);

            var pos = this.selectionStart;

            if (pos < 3) event.preventDefault();

            var matrix = "+7 (___) ___-__-__",
                i = 0,
                def = matrix.replace(/\D/g, ""),
                val = this.value.replace(/\D/g, ""),
                new_value = matrix.replace(/[_\d]/g, function (a) {
                    return i < val.length ? val.charAt(i++) || def.charAt(i) : a
                });
            i = new_value.indexOf("_");
            if (i != -1) {
                i < 5 && (i = 3);
                new_value = new_value.slice(0, i)
            }
            var reg = matrix.substr(0, this.value.length).replace(/_+/g,
                function (a) {
                    return "\\d{1," + a.length + "}"
                }).replace(/[+()]/g, "\\$&");
            reg = new RegExp("^" + reg + "$");
            if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
            if (event.type == "blur" && this.value.length < 5) this.value = ""
        }

        input.addEventListener("input", mask, false);
        input.addEventListener("focus", mask, false);
        input.addEventListener("blur", mask, false);
        input.addEventListener("keydown", mask, false)

    });
}

//?==============</Init phone mask>=============

//?==============<Init hero video>============== 

function initVideos() {
    const framesVideos = document.querySelectorAll('.ipad__frame--video');

    if (!framesVideos) return;

    framesVideos.forEach(frame => {
        const frameVideo = frame.querySelector('video');
        const frameBtn = frame.querySelector('.ipad__btn');

        initFrameBtn();
        initFrameVideo();

        function initFrameBtn() {
            frameBtn.addEventListener('click', (e) => {
                frame.classList.remove('is-paused');
                frameVideo.play();
            })
        }

        function initFrameVideo() {
            frameVideo.addEventListener('click', (e) => {
                frame.classList.add('is-paused');
                frameVideo.pause();
            });
        }
    })

}

//?==============</Init hero video>=============

//?==============<Init scroll change header>============== 

function initScrollChangeHeader() {
    const headerBody = document.querySelector('.site-header__body');

    if (!headerBody || !window.matchMedia('(max-width: 768px)').matches) return;

    window.addEventListener('scroll', (e) => {
        const scrollTop = document.documentElement.scrollTop;

        if (scrollTop > 0) {
            headerBody.classList.add('is-scroll');
        } else {
            headerBody.classList.remove('is-scroll');
        }
    })
}

//?==============</Init scroll change header>=============

//?==============<Clear hash>==============

function clearHashOnContentLink() {
    const links = document.querySelectorAll('.table-content__link a');

    if (!links) return;

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            location.hash = '';
        })
    })
}

//?==============</Clear hash>=============


window.addEventListener('DOMContentLoaded', (e) => {
    // Header Panel
    initHeaderPanel();
    // Parallax
    if (window.matchMedia('(min-width: 1200px)').matches) initParallax();
    // Full page scroll
    initFullPage();
    // Reviews Slider
    initReviewsSlider();
    // Phone Mask
    initPhoneMask();
    // Init Videos
    initVideos();
    // Init scroll change header
    initScrollChangeHeader();
    // Clear hash
    clearHashOnContentLink();
});
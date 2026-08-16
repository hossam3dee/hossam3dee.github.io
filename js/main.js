// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Loader & Safety Fallback
const revealPage = () => {
    const loader = document.querySelector('.loader');
    if (loader) loader.style.display = 'none';
    document.body.style.opacity = '1';
};

window.addEventListener('load', () => {
    const tl = gsap.timeline();

    tl.to('.loader', {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => {
            const loader = document.querySelector('.loader');
            if (loader) loader.style.display = 'none';
        }
    })
        .to('body', {
            opacity: 1,
            duration: 0.8
        }, "-=0.4")
        .from('.nav-pill', {
            y: -50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        }, "-=0.5")
        .from('.hero-logo', {
            scale: 0.8,
            opacity: 0,
            duration: 1.2,
            ease: 'power3.out'
        }, "-=0.7")
        .from('.hero-title', {
            y: 100,
            opacity: 0,
            duration: 1.5,
            ease: 'power4.out'
        }, "-=0.9")
        .from('.hero-subtitle', {
            y: 20,
            opacity: 0,
            duration: 1,
            ease: 'power2.out'
        }, "-=1.2");
});

// Fallback safety timeout if window load event is delayed
setTimeout(revealPage, 2000);

// --- 2026 Interactive Glass Mouse & Touch Spotlight ---
const updateSpotlight = (x, y) => {
    document.documentElement.style.setProperty('--mouse-x', `${x}px`);
    document.documentElement.style.setProperty('--mouse-y', `${y}px`);
};

window.addEventListener('mousemove', (e) => updateSpotlight(e.clientX, e.clientY));
window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
        updateSpotlight(e.touches[0].clientX, e.touches[0].clientY);
    }
}, { passive: true });

// --- One-Click Email Copy Tooltip & Toast ---
function initEmailCopy() {
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    const toast = document.getElementById('copy-toast');
    let toastTimeout;

    emailLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const email = 'hossam3dee@gmail.com';

            navigator.clipboard.writeText(email).then(() => {
                if (toast) {
                    toast.classList.remove('opacity-0', 'pointer-events-none');
                    toast.classList.add('opacity-100');
                    clearTimeout(toastTimeout);
                    toastTimeout = setTimeout(() => {
                        toast.classList.remove('opacity-100');
                        toast.classList.add('opacity-0', 'pointer-events-none');
                    }, 2500);
                }
            }).catch(() => {
                window.location.href = `mailto:${email}`;
            });
        });
    });
}
document.addEventListener('DOMContentLoaded', initEmailCopy);
window.addEventListener('load', initEmailCopy);

// --- Dynamic Projects & Smart Grid (Clean Borderless Images Edition) ---
const projectsGrid = document.getElementById('projects-grid');
const lightbox = document.getElementById('lightbox');
const lightboxMediaContainer = document.getElementById('lightbox-media-container');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxDescription = document.getElementById('lightbox-description');
const lightboxCloseBtn = document.getElementById('lightbox-close');
const prevMediaBtn = document.getElementById('prev-media');
const nextMediaBtn = document.getElementById('next-media');

let currentLightboxMediaList = [];
let currentMediaIndex = 0;
let currentProjectTitle = '';
let currentProjectDescription = '';
let allProjectsData = [];

// Load and Render Projects (Supports direct local file:// and web server)
if (window.PORTFOLIO_PROJECTS && Array.isArray(window.PORTFOLIO_PROJECTS)) {
    allProjectsData = window.PORTFOLIO_PROJECTS;
    renderProjects(allProjectsData);
    initProjectAnimations();
    initCategoryFilters();
} else {
    fetch('assets/data/posts.json')
        .then(response => response.json())
        .then(projects => {
            allProjectsData = projects;
            renderProjects(projects);
            initProjectAnimations();
            initCategoryFilters();
        })
        .catch(error => console.error('Error loading projects:', error));
}

// Category Filter Tabs Logic
function initCategoryFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            filterProjects(filter);
        });
    });
}

function filterProjects(category) {
    if (!allProjectsData || allProjectsData.length === 0) return;

    let filtered = [];
    if (category === 'all') {
        filtered = allProjectsData;
    } else {
        filtered = allProjectsData.filter(p => p.category === category || (p.classes && p.classes.includes(category)));
    }

    // Smooth GSAP fade out & re-render
    gsap.to('#projects-grid', {
        opacity: 0,
        y: 20,
        duration: 0.25,
        onComplete: () => {
            renderProjects(filtered);
            initProjectAnimations();
            gsap.to('#projects-grid', {
                opacity: 1,
                y: 0,
                duration: 0.35,
                ease: 'power2.out'
            });
        }
    });
}

function renderProjects(projects) {
    projectsGrid.innerHTML = '';
    
    projects.forEach(project => {
        // Create Project Block Container
        const block = document.createElement('div');
        block.className = 'project-block glass-panel p-6 md:p-12 mb-20 relative overflow-hidden text-center flex flex-col items-center';
        block.setAttribute('data-id', project.id);
        
        // Client / Company Top Centerpiece
        let clientTopHtml = '';
        if (project.client) {
            const hasRating = typeof project.client.rating === 'number' && project.client.rating > 0;
            const starsHtml = hasRating ? `
                <div class="flex gap-0.5 my-1">
                    ${'<i class="fa-solid fa-star text-amber-400 text-xs md:text-sm"></i>'.repeat(project.client.rating)}
                </div>
            ` : '';
            const websiteLink = project.client.website ? `<a href="${project.client.website}" target="_blank" rel="noopener noreferrer" class="text-xs text-blue-400 hover:text-white transition-colors inline-flex items-center gap-1 font-mono mt-1 opacity-80 hover:opacity-100"><span>Visit Website</span> <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i></a>` : '';
            const logoImg = project.client.logo ? `<div class="max-w-[16rem] md:max-w-[20rem] h-12 md:h-14 mx-auto mb-4 flex items-center justify-center"><img src="${project.client.logo}" alt="${project.client.name}" class="max-h-full max-w-full w-auto h-auto object-contain ${project.client.logoClass || ''}"></div>` : '';

            clientTopHtml = `
                <div class="w-full max-w-3xl mx-auto mb-6 flex flex-col items-center">
                    ${logoImg}
                    <div class="flex flex-col items-center gap-1">
                        ${starsHtml}
                        ${websiteLink}
                    </div>
                    ${project.client.feedback ? `
                    <div class="mt-4 px-6 md:px-8 py-3.5 bg-white/[0.02] max-w-2xl mx-auto w-full relative backdrop-blur-sm">
                        <i class="fa-solid fa-quote-left text-base text-white/20 mb-1 block"></i>
                        <p class="text-sm md:text-base font-light text-gray-200 leading-relaxed italic font-display">
                            &ldquo;${project.client.feedback}&rdquo;
                        </p>
                    </div>` : ''}
                </div>
            `;
        }

        // Header Section
        const headerDiv = document.createElement('div');
        headerDiv.className = 'mb-8 w-full flex flex-col items-center';
        headerDiv.innerHTML = `
            <div class="flex flex-col items-center gap-2 mb-5">
                <h3 class="text-3xl md:text-5xl font-black tracking-tight hero-text-gradient">${project.title}</h3>
            </div>
            ${clientTopHtml}
            ${project.description ? `<div class="text-gray-400 text-sm md:text-base leading-relaxed font-light max-w-2xl mx-auto space-y-2 mt-2">${project.description}</div>` : ''}
        `;
        block.appendChild(headerDiv);
        
        const mediaList = project.media || [];

        // Separate media types
        const videoItems = mediaList.filter(m => m.type === 'video' || m.type === 'youtube');
        const interactive360Items = mediaList.filter(m => m.type === 'interactive-360' || m.type === 'iframe');
        const beforeAfterItems = mediaList.filter(m => m.type === 'before-after');
        const imageItems = mediaList.filter(m => m.type === 'image');
        const custom2DBuilderItems = mediaList.filter(m => m.type === 'interactive-2d-builder');

        // Render Videos Section
        if (videoItems.length > 0) {
            const videoSection = document.createElement('div');
            videoSection.className = 'mb-8 w-full space-y-6 flex flex-col items-center';

            videoItems.forEach((mediaItem) => {
                if (mediaItem.type === 'video') {
                    videoSection.appendChild(createCustomVideoPlayer(mediaItem));
                } else if (mediaItem.type === 'youtube') {
                    const videoWrapper = document.createElement('div');
                    videoWrapper.className = 'w-full max-w-5xl mx-auto overflow-hidden shadow-2xl aspect-video bg-black border border-white/10';
                    videoWrapper.innerHTML = `
                        <iframe src="https://www.youtube.com/embed/${mediaItem.src}"
                            class="w-full h-full border-0 block"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen></iframe>
                    `;
                    videoSection.appendChild(videoWrapper);
                }
            });

            block.appendChild(videoSection);
        }

        // Render Before/After Interactive Split Sliders
        if (beforeAfterItems.length > 0) {
            const baSection = document.createElement('div');
            baSection.className = 'mb-8 w-full max-w-5xl mx-auto';

            beforeAfterItems.forEach(baItem => {
                const sliderCard = createBeforeAfterSlider(baItem);
                baSection.appendChild(sliderCard);
            });

            block.appendChild(baSection);
        }

        // Render Images with Symmetrical, Center-Aligned Grid
        if (imageItems.length > 0) {
            const imageSection = document.createElement('div');
            imageSection.className = 'w-full max-w-5xl mx-auto space-y-6 flex flex-col items-center mb-8';

            if (imageItems.length === 1) {
                const mediaItem = imageItems[0];
                const originalIndex = project.media.findIndex(m => m.src === mediaItem.src);
                const card = createImageCard(mediaItem, project.title, () => openLightbox(project.media, originalIndex, project.title, project.description), 'w-full max-w-4xl mx-auto');
                imageSection.appendChild(card);
            } else if (imageItems.length % 2 === 1) {
                // Odd count (e.g. 5, 3): Hero top card + balanced 2-column grid
                const heroCard = createImageCard(imageItems[0], project.title, () => openLightbox(project.media, project.media.findIndex(m => m.src === imageItems[0].src), project.title, project.description), 'w-full');
                imageSection.appendChild(heroCard);

                const subGrid = document.createElement('div');
                subGrid.className = 'grid grid-cols-1 md:grid-cols-2 gap-6 w-full';
                imageItems.slice(1).forEach(mediaItem => {
                    const originalIndex = project.media.findIndex(m => m.src === mediaItem.src);
                    subGrid.appendChild(createImageCard(mediaItem, project.title, () => openLightbox(project.media, originalIndex, project.title, project.description)));
                });
                imageSection.appendChild(subGrid);
            } else {
                // Even count (2, 4, 6...): Symmetrical 2-column grid
                const grid = document.createElement('div');
                grid.className = 'grid grid-cols-1 md:grid-cols-2 gap-6 w-full';
                imageItems.forEach(mediaItem => {
                    const originalIndex = project.media.findIndex(m => m.src === mediaItem.src);
                    grid.appendChild(createImageCard(mediaItem, project.title, () => openLightbox(project.media, originalIndex, project.title, project.description)));
                });
                imageSection.appendChild(grid);
            }

            block.appendChild(imageSection);
        }

        // Render 2D Interactive Builder Component (if any)
        if (custom2DBuilderItems.length > 0) {
            const builder2DSection = document.createElement('div');
            builder2DSection.className = 'w-full max-w-5xl mx-auto space-y-6 flex flex-col items-center mb-8';

            custom2DBuilderItems.forEach(builderItem => {
                builder2DSection.appendChild(create2DBoatBuilder(builderItem));
            });

            block.appendChild(builder2DSection);
        }

        // Render 360 Interactive / Iframe Section (On-Demand Click to Load)
        if (interactive360Items.length > 0) {
            const interactiveSection = document.createElement('div');
            interactiveSection.className = 'w-full max-w-5xl mx-auto space-y-6 flex flex-col items-center mt-4';

            interactive360Items.forEach(item => {
                const wrapper = document.createElement('div');
                const is3DApp = item.src && (item.src.includes('kingfisher-3d-builder') || item.src.includes('5star-ar'));
                const isBMW = item.src && item.src.includes('BMW');
                const sizeClasses = is3DApp 
                    ? 'w-full aspect-[16/9] min-h-[480px] md:min-h-[620px]' 
                    : 'w-full aspect-video min-h-[220px] md:min-h-[460px]';
                const bgClass = isBMW ? 'bg-white border-white/20' : 'bg-black border-white/10';
                wrapper.className = `${sizeClasses} rounded-2xl overflow-hidden shadow-2xl relative ${bgClass} flex items-center justify-center`;
                
                const titleText = is3DApp 
                    ? (item.src.includes('kingfisher') ? 'Real-Time 3D Boat Builder' : 'Interactive 3D & AR Experience')
                    : 'Interactive 360°';
                const subtitleText = is3DApp
                    ? 'Interactive WebGL 3D &bull; Real-time materials & lighting'
                    : 'High-Resolution 360° View &bull; Drag to rotate';
                const iconClass = is3DApp ? 'fa-solid fa-cube' : 'fa-solid fa-arrows-rotate';

                // Initial Launch Splash Screen (Prevents page load lag!)
                wrapper.innerHTML = `
                    <div class="launch-3d-overlay absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-black/80 via-black/90 to-black backdrop-blur-md transition-opacity duration-500 rounded-2xl">
                        <div class="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-5 text-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                            <i class="${iconClass} text-2xl"></i>
                        </div>
                        <h4 class="text-xl md:text-2xl font-black text-white mb-2">${titleText}</h4>
                        <p class="text-xs md:text-sm text-gray-400 max-w-md mb-6">${item.caption || subtitleText}</p>
                        <button type="button" class="btn-launch-3d group inline-flex items-center gap-3 px-8 py-3.5 bg-white hover:bg-gray-100 text-black font-bold text-xs md:text-sm uppercase tracking-wider rounded-full shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:shadow-[0_0_35px_rgba(255,255,255,0.4)] transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer">
                            <i class="fa-solid fa-play text-xs text-blue-600 group-hover:scale-110 transition-transform"></i>
                            <span>Launch 360° View</span>
                        </button>
                    </div>
                `;

                const launchBtn = wrapper.querySelector('.btn-launch-3d');
                const launchOverlay = wrapper.querySelector('.launch-3d-overlay');

                launchBtn.addEventListener('click', () => {
                    launchBtn.disabled = true;
                    launchBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Loading 360°...';
                    
                    const iframe = document.createElement('iframe');
                    iframe.src = item.src;
                    iframe.className = `w-full h-full border-0 block rounded-2xl ${isBMW ? 'bg-white' : 'bg-black'}`;
                    iframe.setAttribute('allow', 'fullscreen; xr-spatial-tracking; camera');
                    iframe.setAttribute('loading', 'eager');
                    
                    iframe.onload = () => {
                        gsap.to(launchOverlay, {
                            opacity: 0,
                            duration: 0.5,
                            onComplete: () => {
                                launchOverlay.style.display = 'none';
                            }
                        });
                    };

                    wrapper.appendChild(iframe);

                    // Add top floating helper badge once loaded
                    if (!is3DApp) {
                        const topBadge = document.createElement('div');
                        topBadge.className = 'absolute top-4 left-4 z-10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider bg-black/80 backdrop-blur-md text-white border border-white/10 rounded-full flex items-center gap-2 pointer-events-none shadow-xl';
                        topBadge.innerHTML = '<i class="fa-solid fa-arrows-rotate text-blue-400"></i><span>Interactive 360° &bull; Drag to Rotate</span>';
                        wrapper.appendChild(topBadge);
                    }
                });

                interactiveSection.appendChild(wrapper);
            });

            block.appendChild(interactiveSection);
        }

        // Render Sub-Sections (if any)
        if (project.subsections && project.subsections.length > 0) {
            project.subsections.forEach(sub => {
                const subContainer = document.createElement('div');
                subContainer.className = 'w-full max-w-5xl mx-auto pt-10 mt-10 border-t border-white/10 flex flex-col items-center';

                subContainer.innerHTML = `
                    <div class="mb-6 w-full flex flex-col items-center text-center">
                        <div class="flex items-center gap-2 mb-2">
                            <span class="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                            <h4 class="text-xl md:text-3xl font-bold tracking-tight text-white">${sub.title}</h4>
                        </div>
                        ${sub.description ? `<div class="text-gray-400 text-sm md:text-base leading-relaxed font-light max-w-2xl mx-auto space-y-2">${sub.description}</div>` : ''}
                    </div>
                `;

                // Render Sub-section media
                if (sub.media && sub.media.length > 0) {
                    const subMediaSection = document.createElement('div');
                    subMediaSection.className = 'w-full space-y-6 flex flex-col items-center';

                    // Video items inside sub-section
                    const subVideoItems = sub.media.filter(m => m.type === 'video');
                    subVideoItems.forEach(videoItem => {
                        subMediaSection.appendChild(createCustomVideoPlayer(videoItem));
                    });

                    // Image items inside sub-section
                    const subImageItems = sub.media.filter(m => m.type === 'image');
                    if (subImageItems.length > 0) {
                        if (subImageItems.length === 1) {
                            subMediaSection.appendChild(createImageCard(subImageItems[0], sub.title, () => openLightbox(sub.media, 0, sub.title, sub.description), 'w-full max-w-4xl mx-auto'));
                        } else if (subImageItems.length % 2 === 1) {
                            const heroCard = createImageCard(subImageItems[0], sub.title, () => openLightbox(sub.media, 0, sub.title, sub.description), 'w-full');
                            subMediaSection.appendChild(heroCard);

                            const subGrid = document.createElement('div');
                            subGrid.className = 'grid grid-cols-1 md:grid-cols-2 gap-6 w-full';
                            subImageItems.slice(1).forEach((mediaItem, idx) => {
                                subGrid.appendChild(createImageCard(mediaItem, sub.title, () => openLightbox(sub.media, idx + 1, sub.title, sub.description)));
                            });
                            subMediaSection.appendChild(subGrid);
                        } else {
                            const subGrid = document.createElement('div');
                            subGrid.className = 'grid grid-cols-1 md:grid-cols-2 gap-6 w-full';
                            subImageItems.forEach((mediaItem, idx) => {
                                subGrid.appendChild(createImageCard(mediaItem, sub.title, () => openLightbox(sub.media, idx, sub.title, sub.description)));
                            });
                            subMediaSection.appendChild(subGrid);
                        }
                    }

                    subContainer.appendChild(subMediaSection);
                }

                // Render Big "Buy Now" Button below the pictures
                if (sub.links && sub.links.length > 0) {
                    const ctaContainer = document.createElement('div');
                    ctaContainer.className = 'w-full flex justify-center items-center mt-8 mb-2';
                    ctaContainer.innerHTML = sub.links.map(link => `
                        <a href="${link.url}" target="_blank" rel="noopener noreferrer" 
                           class="group inline-flex items-center justify-center gap-3.5 px-10 py-4 bg-white hover:bg-gray-100 text-black font-bold text-sm md:text-base uppercase tracking-wider rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_10px_35px_rgba(255,255,255,0.2)] hover:shadow-[0_15px_45px_rgba(255,255,255,0.35)]">
                            <i class="fa-solid fa-cart-shopping text-base md:text-lg"></i>
                            <span>Buy Now</span>
                            <i class="fa-solid fa-arrow-up-right-from-square text-xs opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"></i>
                        </a>
                    `).join('');
                    subContainer.appendChild(ctaContainer);
                }

                block.appendChild(subContainer);
            });
        }

        projectsGrid.appendChild(block);
    });
}

function createCustomVideoPlayer(mediaItem) {
    const playerWrapper = document.createElement('div');
    const isExplicitVertical = mediaItem.isVertical || (mediaItem.src && mediaItem.src.toLowerCase().includes('ar vid'));
    
    playerWrapper.className = `custom-video-player ${isExplicitVertical ? 'is-vertical' : 'is-landscape'} is-paused w-full`;
    
    const posterOverlayHtml = mediaItem.poster 
        ? `<img src="${mediaItem.poster}" alt="Video Preview" class="video-poster-overlay">` 
        : '';

    playerWrapper.innerHTML = `
        <video src="${mediaItem.src}" playsinline preload="metadata" class="w-full h-full object-contain"></video>
        ${posterOverlayHtml}
        
        <!-- Big Center Play/Pause Indicator Button -->
        <button type="button" class="video-center-play" aria-label="Play Video">
            <i class="fa-solid fa-play ml-1"></i>
        </button>

        <!-- Floating Apple Glass Control Bar -->
        <div class="video-controls-overlay">
            <!-- Scrub Progress Bar -->
            <div class="video-progress-container">
                <div class="video-progress-buffered"></div>
                <div class="video-progress-filled">
                    <div class="video-progress-thumb"></div>
                </div>
            </div>

            <!-- Bottom Action Row -->
            <div class="video-controls-row">
                <div class="flex items-center gap-3">
                    <button type="button" class="video-ctrl-btn btn-play-toggle" title="Play/Pause">
                        <i class="fa-solid fa-play"></i>
                    </button>
                    <div class="video-volume-group">
                        <button type="button" class="video-ctrl-btn btn-mute-toggle" title="Mute/Unmute">
                            <i class="fa-solid fa-volume-high"></i>
                        </button>
                        <input type="range" class="video-volume-slider" min="0" max="1" step="0.05" value="1" title="Volume">
                    </div>
                    <span class="video-time-display">0:00 / 0:00</span>
                </div>

                <div class="flex items-center gap-2">
                    <button type="button" class="video-ctrl-btn btn-fullscreen" title="Fullscreen">
                        <i class="fa-solid fa-expand"></i>
                    </button>
                </div>
            </div>
        </div>
    `;

    const video = playerWrapper.querySelector('video');
    const posterImg = playerWrapper.querySelector('.video-poster-overlay');
    const centerPlayBtn = playerWrapper.querySelector('.video-center-play');
    const playToggleBtn = playerWrapper.querySelector('.btn-play-toggle');
    const muteToggleBtn = playerWrapper.querySelector('.btn-mute-toggle');
    const volumeSlider = playerWrapper.querySelector('.video-volume-slider');
    const timeDisplay = playerWrapper.querySelector('.video-time-display');
    const progressContainer = playerWrapper.querySelector('.video-progress-container');
    const progressFilled = playerWrapper.querySelector('.video-progress-filled');
    const progressBuffered = playerWrapper.querySelector('.video-progress-buffered');
    const fullscreenBtn = playerWrapper.querySelector('.btn-fullscreen');

    // Auto-detect vertical aspect ratio from metadata if not explicitly set
    video.addEventListener('loadedmetadata', () => {
        if (video.videoHeight > video.videoWidth) {
            playerWrapper.classList.remove('is-landscape');
            playerWrapper.classList.add('is-vertical');
        }
        updateTime();
    });

    const formatTime = (seconds) => {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const updateTime = () => {
        const cur = formatTime(video.currentTime);
        const dur = formatTime(video.duration);
        timeDisplay.textContent = `${cur} / ${dur}`;
        if (video.duration) {
            const percent = (video.currentTime / video.duration) * 100;
            progressFilled.style.width = `${percent}%`;
        }
    };

    const togglePlay = () => {
        if (video.paused || video.ended) {
            video.play();
        } else {
            video.pause();
        }
    };

    video.addEventListener('play', () => {
        if (posterImg) posterImg.style.opacity = '0';
        playerWrapper.classList.remove('is-paused');
        centerPlayBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        playToggleBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    });

    video.addEventListener('pause', () => {
        playerWrapper.classList.add('is-paused');
        playerWrapper.classList.remove('hide-controls');
        centerPlayBtn.innerHTML = '<i class="fa-solid fa-play ml-1"></i>';
        playToggleBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    });

    video.addEventListener('ended', () => {
        if (posterImg) posterImg.style.opacity = '1';
        playerWrapper.classList.add('is-paused');
        playerWrapper.classList.remove('hide-controls');
        centerPlayBtn.innerHTML = '<i class="fa-solid fa-play ml-1"></i>';
        playToggleBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    });

    video.addEventListener('timeupdate', updateTime);

    video.addEventListener('progress', () => {
        if (video.buffered.length > 0 && video.duration) {
            const bufferedEnd = video.buffered.end(video.buffered.length - 1);
            const percent = (bufferedEnd / video.duration) * 100;
            progressBuffered.style.width = `${percent}%`;
        }
    });

    // Center Play & Bottom Play Button
    centerPlayBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlay();
    });
    playToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlay();
    });

    // Clicking anywhere on video toggles play
    video.addEventListener('click', togglePlay);

    // Double clicking toggles fullscreen
    video.addEventListener('dblclick', () => {
        if (!document.fullscreenElement) {
            if (playerWrapper.requestFullscreen) playerWrapper.requestFullscreen();
        } else {
            if (document.exitFullscreen) document.exitFullscreen();
        }
    });

    // Volume & Mute
    let lastVolume = 1;
    muteToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (video.muted || video.volume === 0) {
            video.muted = false;
            video.volume = lastVolume || 1;
            volumeSlider.value = video.volume;
            muteToggleBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        } else {
            lastVolume = video.volume;
            video.muted = true;
            volumeSlider.value = 0;
            muteToggleBtn.innerHTML = '<i class="fa-solid fa-volume-xmark text-red-400"></i>';
        }
    });

    volumeSlider.addEventListener('input', (e) => {
        e.stopPropagation();
        const val = parseFloat(e.target.value);
        video.volume = val;
        video.muted = val === 0;
        if (val === 0) {
            muteToggleBtn.innerHTML = '<i class="fa-solid fa-volume-xmark text-red-400"></i>';
        } else if (val < 0.5) {
            muteToggleBtn.innerHTML = '<i class="fa-solid fa-volume-low"></i>';
        } else {
            muteToggleBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        }
    });

    // Scrubbing on progress bar
    let isScrubbing = false;
    const seek = (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        let pos = (clientX - rect.left) / rect.width;
        pos = Math.max(0, Math.min(1, pos));
        if (video.duration) {
            video.currentTime = pos * video.duration;
            progressFilled.style.width = `${pos * 100}%`;
        }
    };

    progressContainer.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        isScrubbing = true;
        seek(e);
    });
    window.addEventListener('mousemove', (e) => {
        if (isScrubbing) seek(e);
    });
    window.addEventListener('mouseup', () => {
        if (isScrubbing) isScrubbing = false;
    });

    progressContainer.addEventListener('touchstart', (e) => {
        isScrubbing = true;
        seek(e);
    }, { passive: true });
    window.addEventListener('touchmove', (e) => {
        if (isScrubbing) seek(e);
    }, { passive: true });
    window.addEventListener('touchend', () => {
        if (isScrubbing) isScrubbing = false;
    });

    // Fullscreen
    fullscreenBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!document.fullscreenElement) {
            if (playerWrapper.requestFullscreen) {
                playerWrapper.requestFullscreen();
            } else if (playerWrapper.webkitRequestFullscreen) {
                playerWrapper.webkitRequestFullscreen();
            }
            fullscreenBtn.innerHTML = '<i class="fa-solid fa-compress"></i>';
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            fullscreenBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
        }
    });

    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            fullscreenBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
        }
    });

    // Auto-hide controls during playback
    let hideTimeout;
    const resetHideTimeout = () => {
        playerWrapper.classList.remove('hide-controls');
        clearTimeout(hideTimeout);
        if (!video.paused) {
            hideTimeout = setTimeout(() => {
                playerWrapper.classList.add('hide-controls');
            }, 2500);
        }
    };

    playerWrapper.addEventListener('mousemove', resetHideTimeout);
    playerWrapper.addEventListener('touchstart', resetHideTimeout, { passive: true });
    playerWrapper.addEventListener('mouseleave', () => {
        if (!video.paused) {
            playerWrapper.classList.add('hide-controls');
        }
    });

    return playerWrapper;
}

function createImageCard(mediaItem, title, onClickHandler, extraClasses = '') {
    const imageCard = document.createElement('div');
    imageCard.className = `relative group overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-center items-center bg-black/40 border border-white/10 ${extraClasses}`;
    
    imageCard.innerHTML = `
        <div class="w-full flex items-center justify-center overflow-hidden rounded-2xl aspect-[16/10] bg-black/50">
            <img src="${mediaItem.src}" alt="${title}"
                loading="lazy"
                class="w-full h-full object-cover rounded-2xl group-hover:scale-[1.025] transition-transform duration-500 block mx-auto">
        </div>
        <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none rounded-2xl">
            <span class="px-5 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-full shadow-2xl">
                <i class="fa-solid fa-expand mr-1.5"></i> View Fullscreen
            </span>
        </div>
    `;

    imageCard.addEventListener('click', onClickHandler);
    return imageCard;
}

function create2DBoatBuilder(item) {
    const container = document.createElement('div');
    container.className = 'w-full max-w-5xl mx-auto glass-panel p-6 md:p-8 relative overflow-hidden shadow-2xl flex flex-col items-center bg-black/50 border border-white/10';

    // Available 3 Colors for Side & Waterline
    const colors = [
        { id: 'Candy_Red', name: 'Candy Red', hex: '#b81424' },
        { id: 'Cobalt_Blue', name: 'Cobalt Blue', hex: '#1652a2' },
        { id: 'Electro_Lime', name: 'Electro Lime', hex: '#6da824' }
    ];

    let currentAngle = 'Front'; // 'Front' | 'Back'
    let selectedSideColor = 'Candy_Red';
    let selectedWaterlineColor = 'Candy_Red';
    let isWaterlineEnabled = true;
    let isDecalEnabled = true;

    const basePath = 'assets/img/gallery/kingfisher boats/2175 Ex Shallow 2.3L Complete/Paint Options';

    container.innerHTML = `
        <div class="w-full flex flex-col items-center mb-6 text-center">
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white text-xs font-bold uppercase tracking-wider mb-2">
                <i class="fa-solid fa-palette text-blue-400"></i>
                <span>Interactive 2D Boat Configurator</span>
            </div>
            <h4 class="text-xl md:text-2xl font-black text-white">KingFisher 2175 Extreme Shallow (2.3L)</h4>
            <p class="text-xs md:text-sm text-gray-400 mt-1">Live Multi-Layer Paint & Finish Customizer</p>
        </div>

        <!-- Interactive Canvas / Stacked Image Layers -->
        <div class="w-full aspect-[16/9] max-h-[460px] relative overflow-hidden flex items-center justify-center bg-black/60 shadow-inner mb-6">
            <!-- 1. Base Layer -->
            <img id="kf-layer-base" src="${basePath}/Front/2175XS_Front_BaseLayer.png" alt="Base Layer" class="absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-300">
            <!-- 2. Side Paint Layer -->
            <img id="kf-layer-paint" src="${basePath}/Front/2175XS_Front_Side_Candy_Red.png" alt="Paint Layer" class="absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-300">
            <!-- 3. Waterline Stripe Layer -->
            <img id="kf-layer-waterline" src="${basePath}/Front/2175XS_Front_Waterline_Stripe_Candy_Red.png" alt="Waterline Stripe" class="absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-300">
            <!-- 4. Decals Layer -->
            <img id="kf-layer-decal" src="${basePath}/Front/2175XS_Front_Decal.png" alt="Decal" class="absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-300">
            <!-- 5. Logos Layer -->
            <img id="kf-layer-logos" src="${basePath}/Front/2175XS_Front_Logos_White.png" alt="Logos" class="absolute inset-0 w-full h-full object-contain pointer-events-none">
        </div>

        <!-- Controls Toolbar -->
        <div class="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-5 border-t border-white/10">
            <!-- 1. Angle Controls -->
            <div class="flex flex-col items-center gap-2">
                <span class="text-xs font-semibold uppercase tracking-wider text-gray-400">View Angle</span>
                <div class="inline-flex p-1 bg-white/5 border border-white/10 gap-1">
                    <button type="button" class="kf-btn-angle px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all bg-white text-black shadow" data-angle="Front">Front</button>
                    <button type="button" class="kf-btn-angle px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all text-gray-300 hover:text-white" data-angle="Back">Back</button>
                </div>
            </div>

            <!-- 2. Armorcoat Side Color -->
            <div class="flex flex-col items-center gap-2">
                <span class="text-xs font-semibold uppercase tracking-wider text-gray-400">Side Color</span>
                <div class="flex items-center gap-3">
                    ${colors.map((c, i) => `
                        <button type="button" class="kf-btn-side-color relative w-8 h-8 rounded-full transition-transform hover:scale-110 flex items-center justify-center ${i === 0 ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110' : 'opacity-80 hover:opacity-100'}" data-color="${c.id}" title="${c.name}" style="background-color: ${c.hex};">
                            ${i === 0 ? '<i class="fa-solid fa-check text-[10px] text-white"></i>' : ''}
                        </button>
                    `).join('')}
                </div>
            </div>

            <!-- 3. Waterline Stripe Color -->
            <div class="flex flex-col items-center gap-2">
                <div class="flex items-center gap-2">
                    <span class="text-xs font-semibold uppercase tracking-wider text-gray-400">Waterline Stripe</span>
                    <button type="button" id="kf-waterline-toggle" class="text-[10px] font-bold uppercase px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/40 hover:bg-blue-500/30 transition-all">ON</button>
                </div>
                <div class="flex items-center gap-3">
                    ${colors.map((c, i) => `
                        <button type="button" class="kf-btn-waterline-color relative w-8 h-8 rounded-full transition-transform hover:scale-110 flex items-center justify-center ${i === 0 ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110' : 'opacity-80 hover:opacity-100'}" data-color="${c.id}" title="${c.name}" style="background-color: ${c.hex};">
                            ${i === 0 ? '<i class="fa-solid fa-check text-[10px] text-white"></i>' : ''}
                        </button>
                    `).join('')}
                </div>
            </div>

            <!-- 4. Graphic Decals Toggle -->
            <div class="flex flex-col items-center gap-2">
                <span class="text-xs font-semibold uppercase tracking-wider text-gray-400">Graphics</span>
                <button type="button" class="kf-btn-decal px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/40 hover:bg-blue-500/30 transition-all flex items-center gap-1.5">
                    <i class="fa-solid fa-shapes text-[11px]"></i> Decals: ON
                </button>
            </div>
        </div>
    `;

    // Elements
    const layerBase = container.querySelector('#kf-layer-base');
    const layerPaint = container.querySelector('#kf-layer-paint');
    const layerWaterline = container.querySelector('#kf-layer-waterline');
    const layerDecal = container.querySelector('#kf-layer-decal');
    const layerLogos = container.querySelector('#kf-layer-logos');

    const updateLayers = () => {
        layerBase.src = `${basePath}/${currentAngle}/2175XS_${currentAngle}_BaseLayer.png`;
        layerPaint.src = `${basePath}/${currentAngle}/2175XS_${currentAngle}_Side_${selectedSideColor}.png`;
        layerWaterline.src = `${basePath}/${currentAngle}/2175XS_${currentAngle}_Waterline_Stripe_${selectedWaterlineColor}.png`;
        layerWaterline.style.display = isWaterlineEnabled ? 'block' : 'none';
        layerDecal.src = `${basePath}/${currentAngle}/2175XS_${currentAngle}_Decal.png`;
        layerDecal.style.display = isDecalEnabled ? 'block' : 'none';
        layerLogos.src = `${basePath}/${currentAngle}/2175XS_${currentAngle}_Logos_White.png`;
    };

    // Angle Click
    const angleBtns = container.querySelectorAll('.kf-btn-angle');
    angleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentAngle = btn.getAttribute('data-angle');
            angleBtns.forEach(b => {
                b.className = 'kf-btn-angle px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all text-gray-300 hover:text-white';
            });
            btn.className = 'kf-btn-angle px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all bg-white text-black shadow';
            updateLayers();
        });
    });

    // Side Color Click
    const sideColorBtns = container.querySelectorAll('.kf-btn-side-color');
    sideColorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            selectedSideColor = btn.getAttribute('data-color');
            sideColorBtns.forEach(b => {
                b.className = 'kf-btn-side-color relative w-8 h-8 rounded-full transition-transform hover:scale-110 flex items-center justify-center opacity-80 hover:opacity-100';
                b.innerHTML = '';
            });
            btn.className = 'kf-btn-side-color relative w-8 h-8 rounded-full transition-transform hover:scale-110 flex items-center justify-center ring-2 ring-white ring-offset-2 ring-offset-black scale-110';
            btn.innerHTML = '<i class="fa-solid fa-check text-[10px] text-white"></i>';
            updateLayers();
        });
    });

    // Waterline Color Click
    const waterlineColorBtns = container.querySelectorAll('.kf-btn-waterline-color');
    const waterlineToggleBtn = container.querySelector('#kf-waterline-toggle');

    waterlineColorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            selectedWaterlineColor = btn.getAttribute('data-color');
            isWaterlineEnabled = true;
            waterlineToggleBtn.textContent = 'ON';
            waterlineToggleBtn.className = 'text-[10px] font-bold uppercase px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/40 hover:bg-blue-500/30 transition-all';
            
            waterlineColorBtns.forEach(b => {
                b.className = 'kf-btn-waterline-color relative w-8 h-8 rounded-full transition-transform hover:scale-110 flex items-center justify-center opacity-80 hover:opacity-100';
                b.innerHTML = '';
            });
            btn.className = 'kf-btn-waterline-color relative w-8 h-8 rounded-full transition-transform hover:scale-110 flex items-center justify-center ring-2 ring-white ring-offset-2 ring-offset-black scale-110';
            btn.innerHTML = '<i class="fa-solid fa-check text-[10px] text-white"></i>';
            updateLayers();
        });
    });

    // Waterline ON/OFF Toggle
    waterlineToggleBtn.addEventListener('click', () => {
        isWaterlineEnabled = !isWaterlineEnabled;
        if (isWaterlineEnabled) {
            waterlineToggleBtn.textContent = 'ON';
            waterlineToggleBtn.className = 'text-[10px] font-bold uppercase px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/40 hover:bg-blue-500/30 transition-all';
        } else {
            waterlineToggleBtn.textContent = 'OFF';
            waterlineToggleBtn.className = 'text-[10px] font-bold uppercase px-2 py-0.5 bg-white/5 text-gray-500 border border-white/10 hover:text-white transition-all';
        }
        updateLayers();
    });

    // Decal Toggle
    const decalBtn = container.querySelector('.kf-btn-decal');
    decalBtn.addEventListener('click', () => {
        isDecalEnabled = !isDecalEnabled;
        if (isDecalEnabled) {
            decalBtn.className = 'kf-btn-decal px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/40 hover:bg-blue-500/30 transition-all flex items-center gap-1.5';
            decalBtn.innerHTML = '<i class="fa-solid fa-shapes text-[11px]"></i> Decals: ON';
        } else {
            decalBtn.className = 'kf-btn-decal px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-white/5 text-gray-500 border border-white/10 hover:text-white transition-all flex items-center gap-1.5';
            decalBtn.innerHTML = '<i class="fa-solid fa-shapes text-[11px]"></i> Decals: OFF';
        }
        updateLayers();
    });

    return container;
}

// Create Touch-Enabled Before/After Split Slider Component (Clean Borderless)
function createBeforeAfterSlider(item) {
    const container = document.createElement('div');
    container.className = 'ba-slider-container overflow-hidden shadow-2xl relative mb-6';
    
    container.innerHTML = `
        <div class="w-full aspect-[16/10] max-h-[600px] relative overflow-hidden flex justify-center items-center">
            <!-- After (Final Render) -->
            <img src="${item.after}" class="w-full h-full object-contain block mx-auto">
            <span class="absolute top-4 right-4 z-10 px-3 py-1 text-xs font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md text-white border border-white/10">Render</span>
            
            <!-- Before (Wireframe) clipped overlay -->
            <div class="ba-image-before" style="clip-path: polygon(0 0, 50% 0, 50% 100%, 0 100%);">
                <img src="${item.before}" class="w-full h-full object-contain block mx-auto">
                <span class="absolute top-4 left-4 z-10 px-3 py-1 text-xs font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md text-white border border-white/10">Wireframe</span>
            </div>

            <!-- Handle -->
            <div class="ba-handle" style="left: 50%;">
                <div class="ba-handle-button">
                    <i class="fa-solid fa-arrows-left-right"></i>
                </div>
            </div>
        </div>
        ${item.caption ? `<div class="p-3 text-center text-xs text-gray-400 font-light border-t border-white/10">${item.caption}</div>` : ''}
    `;

    // Interactive Dragging (Mouse & Touch)
    const handle = container.querySelector('.ba-handle');
    const beforeImg = container.querySelector('.ba-image-before');
    let isDragging = false;

    const setSliderPosition = (x) => {
        const rect = container.getBoundingClientRect();
        let posX = x - rect.left;
        if (posX < 0) posX = 0;
        if (posX > rect.width) posX = rect.width;
        const percentage = (posX / rect.width) * 100;

        handle.style.left = `${percentage}%`;
        beforeImg.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
    };

    const onStart = (e) => {
        isDragging = true;
        const pageX = e.touches ? e.touches[0].pageX : e.pageX;
        setSliderPosition(pageX);
    };

    const onMove = (e) => {
        if (!isDragging) return;
        const pageX = e.touches ? e.touches[0].pageX : e.pageX;
        setSliderPosition(pageX);
    };

    const onEnd = () => { isDragging = false; };

    container.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);

    container.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);

    return container;
}

function initProjectAnimations() {
    gsap.utils.toArray('.project-block').forEach((block) => {
        gsap.from(block, {
            scrollTrigger: {
                trigger: block,
                start: 'top 90%',
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });
}

// Lightbox Logic
function openLightbox(mediaList, startIndex, title, description) {
    currentLightboxMediaList = mediaList.filter(m => m.type === 'image');
    if (currentLightboxMediaList.length === 0) return;
    
    currentProjectTitle = title || '';
    currentProjectDescription = description || '';

    const clickedMedia = mediaList[startIndex];
    currentMediaIndex = currentLightboxMediaList.findIndex(m => m.src === clickedMedia.src);
    if (currentMediaIndex === -1) currentMediaIndex = 0;
    
    updateLightboxMedia();
    
    lightbox.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
        lightbox.classList.remove('opacity-0');
    });
}

function updateLightboxMedia() {
    if (!currentLightboxMediaList[currentMediaIndex]) return;
    const media = currentLightboxMediaList[currentMediaIndex];
    
    lightboxMediaContainer.innerHTML = `
        <img src="${media.src}" class="max-w-full max-h-[82vh] object-contain shadow-2xl">
    `;
    
    lightboxTitle.textContent = currentProjectTitle;
    
    const counterBadge = `<div class="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-widest bg-white/10 text-gray-300 border border-white/10 mb-4">Image ${currentMediaIndex + 1} of ${currentLightboxMediaList.length}</div>`;
    const captionBlock = media.caption ? `<div class="p-3 bg-white/5 border border-white/10 text-white font-medium text-sm mb-4"><i class="fa-solid fa-circle-info text-gray-300 mr-2"></i>${media.caption}</div>` : '';
    const descBlock = currentProjectDescription ? `<div class="text-gray-300 leading-relaxed text-sm font-light space-y-3">${currentProjectDescription}</div>` : '';
    
    lightboxDescription.innerHTML = `${counterBadge}${captionBlock}${descBlock}`;
    
    if (currentLightboxMediaList.length > 1) {
        prevMediaBtn.classList.remove('hidden');
        nextMediaBtn.classList.remove('hidden');
    } else {
        prevMediaBtn.classList.add('hidden');
        nextMediaBtn.classList.add('hidden');
    }
}

function closeLightbox() {
    lightbox.classList.add('opacity-0');
    setTimeout(() => {
        lightbox.classList.add('hidden');
        lightboxMediaContainer.innerHTML = '';
        document.body.style.overflow = '';
    }, 400);
}

if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
if (prevMediaBtn) prevMediaBtn.addEventListener('click', () => {
    currentMediaIndex = (currentMediaIndex - 1 + currentLightboxMediaList.length) % currentLightboxMediaList.length;
    updateLightboxMedia();
});
if (nextMediaBtn) nextMediaBtn.addEventListener('click', () => {
    currentMediaIndex = (currentMediaIndex + 1) % currentLightboxMediaList.length;
    updateLightboxMedia();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && !lightbox.classList.contains('hidden')) {
        closeLightbox();
    }
    if (lightbox && !lightbox.classList.contains('hidden')) {
        if (e.key === 'ArrowLeft') prevMediaBtn.click();
        if (e.key === 'ArrowRight') nextMediaBtn.click();
    }
});

// Dynamic Year
document.getElementById('year').textContent = new Date().getFullYear();
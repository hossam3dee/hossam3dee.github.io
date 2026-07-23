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
        .from('.hero-title', {
            y: 100,
            opacity: 0,
            duration: 1.5,
            ease: 'power4.out'
        }, "-=0.8")
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
        duration: 0.3,
        onComplete: () => {
            renderProjects(filtered);
            gsap.to('#projects-grid', {
                opacity: 1,
                y: 0,
                duration: 0.4,
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
        block.className = 'project-block glass-panel p-6 md:p-10 mb-16 relative overflow-hidden';
        block.setAttribute('data-id', project.id);
        
        // Header Section
        const headerDiv = document.createElement('div');
        headerDiv.className = 'mb-8 border-b border-white/10 pb-6';
        headerDiv.innerHTML = `
            <div class="flex flex-wrap items-center justify-between gap-4 mb-2">
                <h3 class="text-3xl md:text-5xl font-black tracking-tight hero-text-gradient">${project.title}</h3>
                ${project.shortDescription ? `<span class="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider bg-white/10 text-gray-200 border border-white/10 backdrop-blur-md">${project.shortDescription}</span>` : ''}
            </div>
            ${project.description ? `<div class="text-gray-300 text-sm md:text-base leading-relaxed font-light mt-4 max-w-4xl space-y-2">${project.description}</div>` : ''}
        `;
        block.appendChild(headerDiv);
        
        if (!project.media || project.media.length === 0) {
            projectsGrid.appendChild(block);
            return;
        }

        // Separate media types
        const videoItems = project.media.filter(m => m.type === 'video' || m.type === 'youtube');
        const beforeAfterItems = project.media.filter(m => m.type === 'before-after');
        const imageItems = project.media.filter(m => m.type === 'image');

        // Render Videos Section
        if (videoItems.length > 0) {
            const videoSection = document.createElement('div');
            videoSection.className = 'mb-8 space-y-6 flex flex-col items-center';

            videoItems.forEach((mediaItem) => {
                const videoWrapper = document.createElement('div');
                const isVertical = mediaItem.isVertical || (mediaItem.src && (
                    mediaItem.src.toLowerCase().includes('ar vid') ||
                    mediaItem.src.toLowerCase().includes('bugatti')
                ));
                
                if (isVertical) {
                    videoWrapper.className = 'w-full max-w-md mx-auto overflow-hidden shadow-2xl';
                } else {
                    videoWrapper.className = 'w-full max-w-4xl mx-auto overflow-hidden shadow-2xl';
                }

                if (mediaItem.type === 'video') {
                    const posterAttr = mediaItem.poster ? `poster="${mediaItem.poster}"` : '';
                    videoWrapper.innerHTML = `
                        <div class="relative w-full overflow-hidden flex justify-center items-center">
                            <video src="${mediaItem.src}" ${posterAttr} controls playsinline preload="metadata"
                                class="w-full max-h-[80vh] object-contain block mx-auto"></video>
                        </div>
                    `;
                } else if (mediaItem.type === 'youtube') {
                    videoWrapper.innerHTML = `
                        <div class="relative w-full aspect-video overflow-hidden">
                            <iframe src="https://www.youtube.com/embed/${mediaItem.src}"
                                class="absolute inset-0 w-full h-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen></iframe>
                        </div>
                    `;
                }
                videoSection.appendChild(videoWrapper);
            });

            block.appendChild(videoSection);
        }

        // Render Before/After Interactive Split Sliders
        if (beforeAfterItems.length > 0) {
            const baSection = document.createElement('div');
            baSection.className = 'mb-8 w-full max-w-4xl mx-auto';

            beforeAfterItems.forEach(baItem => {
                const sliderCard = createBeforeAfterSlider(baItem);
                baSection.appendChild(sliderCard);
            });

            block.appendChild(baSection);
        }

        // Render Images with Smart Clean Borderless Grid
        if (imageItems.length > 0) {
            const imageSection = document.createElement('div');
            imageSection.className = 'w-full space-y-6';

            if (imageItems.length === 1) {
                const mediaItem = imageItems[0];
                const originalIndex = project.media.findIndex(m => m.src === mediaItem.src);
                const card = createImageCard(mediaItem, project.title, () => openLightbox(project.media, originalIndex, project.title, project.description), 'w-full max-w-4xl mx-auto');
                imageSection.appendChild(card);
            } else if (imageItems.length === 2) {
                const grid = document.createElement('div');
                grid.className = 'grid grid-cols-1 md:grid-cols-2 gap-6 items-start';
                imageItems.forEach(mediaItem => {
                    const originalIndex = project.media.findIndex(m => m.src === mediaItem.src);
                    grid.appendChild(createImageCard(mediaItem, project.title, () => openLightbox(project.media, originalIndex, project.title, project.description)));
                });
                imageSection.appendChild(grid);
            } else if (imageItems.length === 3) {
                const heroCard = createImageCard(imageItems[0], project.title, () => openLightbox(project.media, project.media.findIndex(m => m.src === imageItems[0].src), project.title, project.description), 'w-full mb-6');
                imageSection.appendChild(heroCard);

                const subGrid = document.createElement('div');
                subGrid.className = 'grid grid-cols-1 md:grid-cols-2 gap-6 items-start';
                [imageItems[1], imageItems[2]].forEach(mediaItem => {
                    const originalIndex = project.media.findIndex(m => m.src === mediaItem.src);
                    subGrid.appendChild(createImageCard(mediaItem, project.title, () => openLightbox(project.media, originalIndex, project.title, project.description)));
                });
                imageSection.appendChild(subGrid);
            } else {
                // 4+ Images: Hero Cover Card + Gapless CSS Masonry Columns
                const heroCard = createImageCard(imageItems[0], project.title, () => openLightbox(project.media, project.media.findIndex(m => m.src === imageItems[0].src), project.title, project.description), 'w-full mb-6');
                imageSection.appendChild(heroCard);

                const masonryContainer = document.createElement('div');
                masonryContainer.className = 'columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6';

                imageItems.slice(1).forEach(mediaItem => {
                    const originalIndex = project.media.findIndex(m => m.src === mediaItem.src);
                    const card = createImageCard(mediaItem, project.title, () => openLightbox(project.media, originalIndex, project.title, project.description), 'break-inside-avoid mb-6');
                    masonryContainer.appendChild(card);
                });
                imageSection.appendChild(masonryContainer);
            }

            block.appendChild(imageSection);
        }

        projectsGrid.appendChild(block);
    });
}

function createImageCard(mediaItem, title, onClickHandler, extraClasses = '') {
    const imageCard = document.createElement('div');
    imageCard.className = `relative group overflow-hidden shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-center items-center ${extraClasses}`;
    
    imageCard.innerHTML = `
        <div class="w-full flex items-center justify-center overflow-hidden">
            <img src="${mediaItem.src}" alt="${title}"
                loading="lazy"
                class="w-full h-auto max-h-[650px] object-contain block mx-auto group-hover:scale-[1.015] transition-transform duration-500">
        </div>
        <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
            <span class="px-4 py-2 bg-white text-black text-xs font-bold uppercase tracking-wider shadow-2xl">
                <i class="fa-solid fa-expand mr-1.5"></i> View Fullscreen
            </span>
        </div>
    `;

    imageCard.addEventListener('click', onClickHandler);
    return imageCard;
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
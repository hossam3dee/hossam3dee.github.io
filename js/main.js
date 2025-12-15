// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Loader
window.addEventListener('load', () => {
    const tl = gsap.timeline();

    tl.to('.loader', {
        opacity: 0,
        duration: 1,
        ease: 'power2.inOut',
        onComplete: () => {
            document.querySelector('.loader').style.display = 'none';
        }
    })
        .to('body', {
            opacity: 1,
            duration: 1
        }, "-=0.5")
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

// About Section Animations
gsap.from('#about .glass-panel', {
    scrollTrigger: {
        trigger: '#about',
        start: 'top 85%',
    },
    y: 50,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out'
});

// Stabilized Toolkit Animation
const toolkitIcons = gsap.utils.toArray('#about .flex-wrap .group');
if (toolkitIcons.length > 0) {
    gsap.fromTo(toolkitIcons, 
        { y: 30, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.05,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '#about .flex-wrap',
                start: 'top 95%',
                once: true 
            }
        }
    );
}

// Footer Reveal
gsap.from('footer .glass-panel', {
    scrollTrigger: {
        trigger: 'footer',
        start: 'top 85%',
    },
    y: 40,
    opacity: 0,
    duration: 1,
    ease: 'power2.out'
});

// --- Dynamic Projects Logic ---

const projectsGrid = document.getElementById('projects-grid');
const projectView = document.getElementById('project-view');
const pvMediaContainer = document.getElementById('pv-media-container');
const pvTitle = document.getElementById('pv-title');
const pvHeaderTitle = document.getElementById('pv-header-title');
const pvDescription = document.getElementById('pv-description');
const pvCloseBtn = document.getElementById('pv-close');

// Fetch Data and Render
fetch('assets/data/posts.json')
    .then(response => response.json())
    .then(projects => {
        renderProjects(projects);
        initProjectAnimations();
    })
    .catch(error => console.error('Error loading projects:', error));

function renderProjects(projects) {
    projectsGrid.innerHTML = '';
    
    projects.forEach(project => {
        // Create Card Element
        const card = document.createElement('div');
        // Apply classes from JSON (which include layout classes like col-span-2)
        // If classes are missing in JSON for some reason, provide defaults
        card.className = project.classes || "group relative aspect-[4/3] overflow-hidden glass-panel cursor-pointer project-card";
        card.setAttribute('data-id', project.id);
        
        // Determine Thumbnail Content (Image or Video)
        let mediaContent = '';
        if (project.thumbnailVideo) {
            mediaContent = `
                <video src="${project.thumbnailVideo}" muted loop playsinline
                class="w-full h-full object-cover project-img opacity-80 group-hover:opacity-100"
                poster="${project.thumbnailPoster || ''}"></video>
            `;
        } else {
            // Use project.thumbnail. If it's a youtube thumb, it's just a URL string.
            mediaContent = `
                <img src="${project.thumbnail}" alt="${project.title}"
                class="w-full h-full object-cover project-img">
            `;
        }
        
        // Inner HTML Construction
        card.innerHTML = `
            ${mediaContent}
            <div class="absolute inset-0 project-card-overlay flex flex-col justify-end p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 class="text-3xl font-bold mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">${project.title}</h3>
                <p class="text-gray-300 text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">${project.shortDescription}</p>
            </div>
        `;
        
        // Add Video Badge if needed
        const hasVideo = project.media && project.media.some(m => m.type === 'video' || m.type === 'youtube');
        if (hasVideo) {
            const badge = document.createElement('div');
            badge.className = 'absolute bottom-4 right-4 z-20 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-lg';
            badge.innerHTML = '<i class="fa-solid fa-play text-xs text-white"></i>';
            card.appendChild(badge);
        }
        
        // Click Event
        card.addEventListener('click', () => openProjectView(project));
        
        // Hover Video Playback (for video thumbnails)
        if (project.thumbnailVideo) {
            const video = card.querySelector('video');
            card.addEventListener('mouseenter', () => video.play().catch(() => {}));
            card.addEventListener('mouseleave', () => video.pause());
        }

        projectsGrid.appendChild(card);
    });
}

function initProjectAnimations() {
    gsap.utils.toArray('.project-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 95%',
            },
            y: 60,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });
}

function openProjectView(project) {
    // Populate Details
    pvTitle.textContent = project.title;
    pvHeaderTitle.textContent = project.title;
    pvDescription.innerHTML = project.description;

    // Render Media Stack
    renderProjectStack(project);

    // Show View
    projectView.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Animate in
    requestAnimationFrame(() => {
        projectView.classList.remove('opacity-0');
    });
}

function renderProjectStack(project) {
    pvMediaContainer.innerHTML = '';

    if (!project.media) return;

    project.media.forEach((mediaItem, index) => {
        const itemContainer = document.createElement('div');
        itemContainer.className = 'flex flex-col gap-6';

        const mediaWrapper = document.createElement('div');
        mediaWrapper.className = 'w-full rounded-2xl overflow-hidden glass-panel border-0 bg-black/20 relative shadow-2xl';
        
        let element;
        if (mediaItem.type === 'image') {
            element = document.createElement('img');
            element.src = mediaItem.src;
            element.className = 'w-full max-h-[80vh] object-contain block mx-auto';
            element.loading = "lazy";
        } else if (mediaItem.type === 'video') {
            element = document.createElement('video');
            element.src = mediaItem.src;
            element.poster = mediaItem.poster || '';
            element.controls = true;
            element.autoplay = false;
            element.muted = false;
            element.playsInline = true;
            element.className = 'w-full max-h-[80vh] object-contain block mx-auto';
        } else if (mediaItem.type === 'youtube') {
            const aspectWrapper = document.createElement('div');
            aspectWrapper.className = 'relative w-full aspect-video';
            element = document.createElement('iframe');
            element.src = `https://www.youtube.com/embed/${mediaItem.src}`;
            element.className = 'absolute inset-0 w-full h-full';
            element.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
            element.allowFullscreen = true;
            aspectWrapper.appendChild(element);
            element = aspectWrapper;
        }

        mediaWrapper.appendChild(element);
        itemContainer.appendChild(mediaWrapper);

        if (mediaItem.caption) {
            const desc = document.createElement('div');
            desc.className = 'text-gray-400 text-sm md:text-base font-light max-w-3xl mx-auto text-center px-4';
            desc.innerHTML = mediaItem.caption;
            itemContainer.appendChild(desc);
        }

        pvMediaContainer.appendChild(itemContainer);
    });
}

function closeProjectView() {
    projectView.classList.add('opacity-0');
    setTimeout(() => {
        projectView.classList.add('hidden');
        pvMediaContainer.innerHTML = ''; 
        document.body.style.overflow = '';
        
        // Pause any playing videos
        document.querySelectorAll('video').forEach(v => v.pause());
    }, 500);
}

pvCloseBtn.addEventListener('click', closeProjectView);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !projectView.classList.contains('hidden')) {
        closeProjectView();
    }
});

// Dynamic Year
document.getElementById('year').textContent = new Date().getFullYear();
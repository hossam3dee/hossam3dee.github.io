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
// Using fromTo ensures explicit start and end states, preventing visibility issues on mobile resize
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
                once: true // Ensure it runs once and never resets
            }
        }
    );
}

// Work Items Stagger
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

// Lightbox Functionality
const lightbox = document.getElementById('lightbox');
const lightboxMediaContainer = document.getElementById('lightbox-media-container');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxDescription = document.getElementById('lightbox-description');
const closeBtn = document.getElementById('lightbox-close');
const prevBtn = document.getElementById('prev-media');
const nextBtn = document.getElementById('next-media');

// Project Data
const projectsData = {
    "objects-of-desire": {
        title: "Objects of Desire",
        description: `
            <p>This project captures the essence of modern icons, speed, scent, and style. Each piece is a <strong>super-realistic</strong> digital sculpture, meticulously crafted to blur the line between the physical and the virtual.</p>
        `,
        media: [
            { type: 'image', src: 'assets/img/gallery/untitled1.webp' },
            { type: 'image', src: 'assets/img/gallery/cars/IMG_20251026_140734_511.webp' },
            { type: 'image', src: 'assets/img/gallery/photo3b.webp' },
            { type: 'image', src: 'assets/img/gallery/cars/amg-g63.webp' }
        ]
    },
    "be-amazed": {
        title: "Be Amazed",
        description: `
            <p><strong>3D Animator & Motion Graphics Artist @ Be Amazed</strong></p>
            <p>As a <strong>key contributor</strong> to the production pipeline for <strong>Be Amazed</strong>, one of YouTube's premier channels for fascinating scientific content, I was tasked with elevating their <strong>visual storytelling</strong> through high-quality animation and motion design. My role was to transform complex concepts into clear and captivating visuals.</p>
        `,
        media: [
            { type: 'video', src: 'assets/vid/be-amazed.mp4', poster: 'assets/img/gallery/be-amazed-poster.webp' }
        ]
    },
    "hot-sauce": {
        title: "Hot Sauce",
        description: `
            <p>Conceptual <strong>bottle design</strong> for a gourmet <strong class="text-red-500">hot sauce</strong> brand.</p>
            <p>This project involved the <strong>conceptualization</strong> and 3D modeling of a unique bottle and <strong>packaging</strong> for a new hot sauce brand. The primary goal was to create a distinctive and ergonomic form that would stand out on a <strong>competitive shelf</strong>.</p>
        `,
        media: [
            { type: 'image', src: 'assets/img/gallery/sauce/Render v2_7.webp' },
            { type: 'image', src: 'assets/img/gallery/sauce/Render v2_3.webp' },
            { type: 'image', src: 'assets/img/gallery/sauce/Render v2_5.webp' },
            { type: 'image', src: 'assets/img/gallery/sauce/Render v2_6.webp' }
        ]
    },
    "automotive-precision": {
        title: "Automotive Precision",
        description: `
            <p>Precision 3D art: high-detail <strong>Luxury Automotive</strong>.</p>
            <p>A deep dive into <strong>hyper-realistic automotive</strong> modeling, focusing on luxury vehicles. The project involved meticulous attention to detail, from accurate body <strong>panel topology</strong> and intricate interior components to functional lighting and engine bay elements.</p>
        `,
        media: [
            { type: 'video', src: 'assets/img/gallery/footage/bugatti.mp4', poster: 'assets/img/gallery/cars/Still 2025-05-28 071820_1.1.1.webp' },
            { type: 'image', src: 'assets/img/gallery/cars/Timeline 1_01_00_00_00_1.1.1.webp' },
            { type: 'image', src: 'assets/img/gallery/cars/untitled4.webp' },
            { type: 'image', src: 'assets/img/gallery/cars/IMG_20251026_140734_556.webp' }
        ]
    },
    "automotive-interior": {
        title: "Automotive Interior",
        description: `
            <p><strong>Automotive interior</strong> modeling.</p>
            <p>This project was a deep dive into the meticulous modeling of a classic luxury <strong>car interior</strong>. The goal was to replicate every component with absolute precision, from the dashboard stitching and instrument cluster to the seat contours and console buttons.</p>
        `,
        media: [
            { type: 'image', src: 'assets/img/gallery/cars/AM-option1-rearView-rgb.webp' },
            { type: 'image', src: 'assets/img/gallery/cars/AM-option1-frontView-rgb.webp' },
            { type: 'image', src: 'assets/img/gallery/cars/AM-option2-rearView-rgb.webp' },
            { type: 'image', src: 'assets/img/gallery/cars/AM-option2-frontView-rgb.webp' }
        ]
    },
    "celestial-mechanics": {
        title: "Celestial Mechanics",
        description: `
            <p><strong>Python-Powered</strong> celestial mechanics: a high-accuracy <strong>Eclipse</strong> Simulator in <strong>Blender</strong>.</p>
            <p>This project is a custom-built <strong>simulation engine</strong> that accurately <strong>predicts and visualizes astronomical eclipses directly within Blender</strong>. <strong>By leveraging Python scripting</strong>, the tool processes precise orbital data to calculate the exact positions of the <strong>Earth</strong>, <strong>Moon</strong>, and <strong>Sun</strong> over time. This allows for the generation of scientifically <strong>accurate eclipse events</strong>, from the <strong>path of totality</strong> to the subtle effects of light and shadow.</p>
        `,
        media: [
            { type: 'video', src: 'assets/img/gallery/footage/solar-eclipse-632-ad.mp4', poster: 'assets/img/gallery/space/poster.webp' },
            { type: 'image', src: 'assets/img/gallery/space/Moon-5.webp' },
            { type: 'image', src: 'assets/img/gallery/space/Moon-3.webp' },
            { type: 'image', src: 'assets/img/gallery/space/Render1.webp' }
        ]
    },
    "mini-redefined": {
        title: "Mini. Redefined",
        description: `
            <p>Mini. <strong>Redefined</strong>.</p>
            <p>A 3D <strong>product showcase</strong> exploring the compact power and minimalist form of the Apple Mac mini. This series of renders captures the essence of Apple's design philosophy through <strong>photorealistic materials</strong> and <strong>lighting</strong>.</p>
        `,
        media: [
            { type: 'image', src: 'assets/img/gallery/fab/mac-Render_1.webp' },
            { type: 'image', src: 'assets/img/gallery/fab/mac-Render_2.webp' },
            { type: 'image', src: 'assets/img/gallery/fab/mac-Render_3.webp' },
            { type: 'image', src: 'assets/img/gallery/fab/mac-Render_4.webp' },
            { type: 'image', src: 'assets/img/gallery/fab/mac-Render_5.webp' }
        ]
    },
    "the-catalyst": {
        title: "The Catalyst",
        description: `
            <p><strong>The Catalyst</strong>.</p>
            <p>A <strong>photorealistic showcase</strong> of the tool that bridges the gap between digital and traditional art. This project highlights the minimalist design and tactile precision of the <strong>Apple Pencil</strong>, capturing the essence of <strong>creativity</strong>.</p>
        `,
        media: [
            { type: 'image', src: 'assets/img/gallery/fab/apple-pencil-pro-5.webp' },
            { type: 'image', src: 'assets/img/gallery/fab/apple-pencil-pro-4.webp' },
            { type: 'image', src: 'assets/img/gallery/fab/apple-pencil-pro-2.webp' },
            { type: 'image', src: 'assets/img/gallery/fab/apple-pencil-pro-1.webp' }
        ]
    },
    "piphone": {
        title: "PiPhone",
        description: `
            <p>Meet <strong>Pi</strong>Phone.</p>
            <p>A personal project to design, model, and render a conceptual smartphone. This 3D showcase emulates the visual language of a <strong>high-end product launch</strong>, focusing on super-realistic materials, studio lighting, and a <strong>flawless finish</strong>.</p>
        `,
        media: [
            { type: 'image', src: 'assets/img/gallery/fab/render_7.webp' },
            { type: 'image', src: 'assets/img/gallery/fab/render_3 (2).webp' },
            { type: 'image', src: 'assets/img/gallery/fab/render_2 (2).webp' },
            { type: 'image', src: 'assets/img/gallery/fab/render_5 (2).webp' },
            { type: 'image', src: 'assets/img/gallery/fab/render_6.webp' }
        ]
    },
    "wonders-of-water": {
        title: "The Wonders of Water",
        description: `
            <p><strong>The Wonders of Water</strong>: Archimedes' Principle and Beyond.</p>
            <p>This video explores the fascinating properties of <strong>water</strong>, beginning with <strong>Archimedes' principle</strong>. The <strong>scientific visualizations</strong> were brought to life using a combination of <strong>Blender</strong> for <strong>3D modeling</strong>, <strong>Manim</strong> powered by <strong>Python</strong> for the <strong>mathematical animations</strong>, and <strong>Adobe After Effects</strong> for <strong>2D graphics</strong> and <strong>visual effects</strong>.</p>
        `,
        media: [
            { type: 'youtube', src: '9HYbAJO1nII' }
        ]
    },
    "short-example": {
        title: "Short Example",
        description: `
            <p><strong>Short</strong> Example.</p>
            <p>This <strong>short showcases</strong> the key scientific animations from my full-length explainer video, presented without narration to <strong>highlight the visual storytelling</strong>.</p>
        `,
        media: [
            { type: 'youtube', src: '48zP7exWEHg' }
        ]
    },
    "hard-surface-robot": {
        title: "Hard-Surface Robot",
        description: `
            <p>Focus on <strong>Hard-Surface</strong> modeling.</p>
            <p>This project is a comprehensive showcase of intricate <strong>hard-surface modeling</strong> techniques. The robot was built from the ground up in <strong>Blender</strong>, with a focus on creating <strong>clean topology</strong> and <strong>high-fidelity detail</strong>. Every component — from the hydraulic pistons and articulated joints to the complex wiring and armor plating — was meticulously crafted.</p>
        `,
        media: [
            { type: 'image', src: 'assets/img/gallery/robot/robo2.webp' },
            { type: 'image', src: 'assets/img/gallery/robot/robo3.webp' },
            { type: 'image', src: 'assets/img/gallery/robot/robo.webp' }
        ]
    },
    "marine-ar": {
        title: "Marine & AR",
        description: `
            <p>Adventure on the water & land: <strong>photorealistic</strong> CGI for the <strong>Marine Industry</strong>.</p>
            <p>This project was focused on creating compelling, lifestyle-oriented <strong>marketing visuals</strong> for the <strong>recreational boating</strong> market. I was responsible for creating a <strong>complete scene</strong> featuring boats from KingFisher and Campion, rigged with Yamaha and Mercury motors, and paired with Off Grid Trailers.</p>
            <p><strong>AR Product Visualization:</strong> Designed and developed an Augmented Reality application for Off Grid Trailers.</p>
            <div class="flex gap-4 mt-4">
                <a href="https://hossam3dee.github.io/5star-ar/" target="_blank" class="text-blue-400 hover:text-white underline">Try AR</a>
                <a href="https://hossam3dee.github.io/kingfisher-builder/" target="_blank" class="text-blue-400 hover:text-white underline">Try Configurator</a>
            </div>
        `,
        media: [
            { type: 'video', src: 'assets/img/gallery/footage/AR VID v2.0.mp4', poster: 'assets/img/gallery/canada/vid-poster.webp' },
            { type: 'image', src: 'assets/img/gallery/canada/IMG_20251026_152235_717.webp' },
            { type: 'image', src: 'assets/img/gallery/canada/pando.webp' },
            { type: 'image', src: 'assets/img/gallery/canada/IMG_20251026_152417_265.webp' },
            { type: 'image', src: 'assets/img/gallery/canada/Mercury Verado.webp' },
            { type: 'image', src: 'assets/img/gallery/canada/15 Kicker - Wireframe.webp' },
            { type: 'image', src: 'assets/img/gallery/canada/15 Kicker.webp' },
            { type: 'image', src: 'assets/img/gallery/canada/IMG_20251026_152417_393.webp' },
            { type: 'image', src: 'assets/img/gallery/canada/IMG_20251026_151903_604.webp' },
            { type: 'image', src: 'assets/img/gallery/canada/IMG_20251026_152417_359.webp' },
            { type: 'image', src: 'assets/img/gallery/canada/Pando 2.0.webp' },
            { type: 'image', src: 'assets/img/gallery/canada/3d-builder.webp' }
        ]
    },
    "xometry-assemblies": {
        title: "Xometry Assemblies",
        description: `
            <p>Precision engineering: <strong>assemblies</strong> for <strong>Xometry</strong>.</p>
            <p>A project for <strong>Xometry</strong> focused on the <strong>design and development</strong> of <strong>specialized mechanical parts</strong> and <strong>functional assemblies</strong>.</p>
        `,
        media: [
            { type: 'image', src: 'assets/img/gallery/xometry/no-outline_0015.webp' },
            { type: 'image', src: 'assets/img/gallery/xometry/no-outline_0003.webp' },
            { type: 'image', src: 'assets/img/gallery/xometry/no-outline_0016.webp' },
            { type: 'image', src: 'assets/img/gallery/xometry/no-outline_0007.webp' },
            { type: 'image', src: 'assets/img/gallery/xometry/no-outline_0023.webp' }
        ]
    },
    "xometry-finishes": {
        title: "Xometry Finishes",
        description: `
            <p>Advanced <strong>surface finishing</strong>.</p>
            <p>This project for Xometry involved the meticulous creation of a <strong>comprehensive digital material library</strong>, showcasing a wide range of <strong>high-fidelity finishes</strong>. The primary goal was to achieve true-to-life, <strong>photorealistic surface qualities</strong>.</p>
        `,
        media: [
            { type: 'image', src: 'assets/img/gallery/xometry/Zinc Plating_v2.webp' },
            { type: 'image', src: 'assets/img/gallery/xometry/Green 383 Camo_v1.webp' },
            { type: 'image', src: 'assets/img/gallery/xometry/Camo Tan_v1.webp' },
            { type: 'image', src: 'assets/img/gallery/xometry/IMG_20251026_152133_084.webp' }
        ]
    },
    "random-stuff": {
        title: "Random Stuff",
        description: `
            <p><strong>Random Stuff!</strong></p>
            <p>Various 3D experiments & renders.</p>
        `,
        media: [
            { type: 'image', src: 'assets/img/gallery/watch.webp' },
            { type: 'image', src: 'assets/img/gallery/lady.webp' },
            { type: 'image', src: 'assets/img/gallery/bmwm8.webp' },
            { type: 'image', src: 'assets/img/gallery/port.webp' },
            { type: 'image', src: 'assets/img/gallery/speaker.webp' },
            { type: 'image', src: 'assets/img/gallery/oreo.webp' },
            { type: 'image', src: 'assets/img/gallery/creditcard.webp' },
            { type: 'image', src: 'assets/img/gallery/perfume.webp' },
            { type: 'image', src: 'assets/img/gallery/bracelet.webp' }
        ]
    }
};

let currentProject = null;
let currentMediaIndex = 0;

// Open Lightbox
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
        const projectId = card.getAttribute('data-id');
        const project = projectsData[projectId];

        if (project) {
            currentProject = project;
            currentMediaIndex = 0;

            // Populate Details
            lightboxTitle.textContent = project.title;
            lightboxDescription.innerHTML = project.description;

            // Render Media
            renderMedia();

            // Show lightbox
            lightbox.classList.remove('hidden');
            requestAnimationFrame(() => {
                lightbox.classList.remove('opacity-0');
            });
            document.body.style.overflow = 'hidden';
        }
    });
});

function renderMedia() {
    if (!currentProject) return;

    const mediaItem = currentProject.media[currentMediaIndex];
    lightboxMediaContainer.innerHTML = '';

    let element;

    if (mediaItem.type === 'image') {
        element = document.createElement('img');
        element.src = mediaItem.src;
        element.className = 'max-w-full max-h-full object-contain shadow-2xl rounded-lg';
    } else if (mediaItem.type === 'video') {
        element = document.createElement('video');
        element.src = mediaItem.src;
        element.poster = mediaItem.poster || '';
        element.controls = true;
        element.autoplay = true;
        element.muted = false;
        element.className = 'max-w-full max-h-full object-contain shadow-2xl rounded-lg';
    } else if (mediaItem.type === 'youtube') {
        element = document.createElement('iframe');
        element.src = `https://www.youtube.com/embed/${mediaItem.src}?autoplay=1`;
        element.className = 'w-full aspect-video rounded-lg shadow-2xl';
        element.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        element.allowFullscreen = true;
    }

    lightboxMediaContainer.appendChild(element);

    // Handle Navigation Buttons
    if (currentProject.media.length > 1) {
        prevBtn.classList.remove('hidden');
        nextBtn.classList.remove('hidden');
    } else {
        prevBtn.classList.add('hidden');
        nextBtn.classList.add('hidden');
    }
}

// Navigation
prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentProject) {
        currentMediaIndex = (currentMediaIndex - 1 + currentProject.media.length) % currentProject.media.length;
        renderMedia();
    }
});

nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentProject) {
        currentMediaIndex = (currentMediaIndex + 1) % currentProject.media.length;
        renderMedia();
    }
});

// Close Lightbox
function closeLightbox() {
    lightbox.classList.add('opacity-0');
    setTimeout(() => {
        lightbox.classList.add('hidden');
        lightboxMediaContainer.innerHTML = ''; // Cleanup
        document.body.style.overflow = '';
    }, 500);
}

closeBtn.addEventListener('click', closeLightbox);

// Close on background click
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
        closeLightbox();
    }
});

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('hidden')) return;

    if (e.key === 'ArrowLeft') {
        currentMediaIndex = (currentMediaIndex - 1 + currentProject.media.length) % currentProject.media.length;
        renderMedia();
    } else if (e.key === 'ArrowRight') {
        currentMediaIndex = (currentMediaIndex + 1) % currentProject.media.length;
        renderMedia();
    }
});

/**
 * Interactive Dot Grid System
 * Highly optimized, responsive canvas-based dot grid with mouse and touch physics.
 * Supports Retina/HiDPI, spring physics, dynamic glow, and ambient idle motion.
 */
class DotGrid {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.dots = [];
        this.spacing = 32; // Distance between dots (in CSS px)
        this.baseRadius = 1.3;
        this.maxRadius = 3.2;
        this.mouseRadius = 140; // Influence radius around pointer
        this.friction = 0.88;
        this.spring = 0.08;

        this.pointer = {
            x: -9999,
            y: -9999,
            targetX: -9999,
            targetY: -9999,
            isActive: false,
            radius: this.mouseRadius
        };

        this.time = 0;
        this.dpr = Math.min(window.devicePixelRatio || 1, 2);

        this.init();
    }

    init() {
        this.resize();
        this.bindEvents();
        this.animate();
    }

    resize() {
        const parent = this.canvas.parentElement || document.body;
        this.width = parent.clientWidth;
        this.height = parent.clientHeight;

        this.canvas.width = this.width * this.dpr;
        this.canvas.height = this.height * this.dpr;
        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;

        this.ctx.scale(this.dpr, this.dpr);

        this.createDots();
    }

    createDots() {
        this.dots = [];
        const cols = Math.ceil(this.width / this.spacing) + 1;
        const rows = Math.ceil(this.height / this.spacing) + 1;

        const offsetX = (this.width - (cols - 1) * this.spacing) / 2;
        const offsetY = (this.height - (rows - 1) * this.spacing) / 2;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const ox = offsetX + c * this.spacing;
                const oy = offsetY + r * this.spacing;
                this.dots.push({
                    origX: ox,
                    origY: oy,
                    x: ox,
                    y: oy,
                    vx: 0,
                    vy: 0,
                    radius: this.baseRadius,
                    alpha: 0.16,
                    phase: (r + c) * 0.15 // for ambient wave
                });
            }
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => this.resize(), 150);
        });

        // Mouse interactions
        const updatePointer = (clientX, clientY) => {
            const rect = this.canvas.getBoundingClientRect();
            this.pointer.x = clientX - rect.left;
            this.pointer.y = clientY - rect.top;
            this.pointer.isActive = true;
        };

        window.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            if (e.clientY <= rect.bottom + 50) {
                updatePointer(e.clientX, e.clientY);
            }
        });

        window.addEventListener('mouseleave', () => {
            this.pointer.isActive = false;
            this.pointer.x = -9999;
            this.pointer.y = -9999;
        });

        // Touch interactions (Passive window listeners - zero scroll blocking)
        const handleTouch = (e) => {
            if (e.touches && e.touches.length > 0) {
                const touch = e.touches[0];
                const rect = this.canvas.getBoundingClientRect();
                if (touch.clientY <= rect.bottom + 50) {
                    updatePointer(touch.clientX, touch.clientY);
                }
            }
        };

        window.addEventListener('touchstart', handleTouch, { passive: true });
        window.addEventListener('touchmove', handleTouch, { passive: true });
        window.addEventListener('touchend', () => {
            this.pointer.isActive = false;
            this.pointer.x = -9999;
            this.pointer.y = -9999;
        }, { passive: true });
    }

    animate() {
        this.time += 0.03;
        this.ctx.clearRect(0, 0, this.width, this.height);

        const px = this.pointer.x;
        const py = this.pointer.y;
        const pRadius = this.pointer.radius;
        const pRadiusSq = pRadius * pRadius;

        for (let i = 0; i < this.dots.length; i++) {
            const dot = this.dots[i];

            // Ambient gentle breathing animation (subtle motion on mobile/idle)
            const ambientWave = Math.sin(this.time + dot.phase) * 1.5;
            const targetX = dot.origX;
            const targetY = dot.origY + ambientWave;

            // Pointer interaction physics
            const dx = px - dot.x;
            const dy = py - dot.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < pRadiusSq && this.pointer.isActive) {
                const dist = Math.sqrt(distSq);
                const force = (1 - dist / pRadius) * 22;
                const angle = Math.atan2(dy, dx);

                // Push away elastically
                dot.vx -= Math.cos(angle) * force;
                dot.vy -= Math.sin(angle) * force;

                // Scale dot size & glow near pointer
                const proximity = 1 - dist / pRadius;
                dot.radius = this.baseRadius + (this.maxRadius - this.baseRadius) * proximity;
                dot.alpha = 0.2 + 0.65 * proximity;
            } else {
                dot.radius += (this.baseRadius - dot.radius) * 0.1;
                dot.alpha += (0.16 - dot.alpha) * 0.08;
            }

            // Spring return physics
            const homeDx = targetX - dot.x;
            const homeDy = targetY - dot.y;

            dot.vx += homeDx * this.spring;
            dot.vy += homeDy * this.spring;

            dot.vx *= this.friction;
            dot.vy *= this.friction;

            dot.x += dot.vx;
            dot.y += dot.vy;

            // Draw dot
            this.ctx.beginPath();
            this.ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${dot.alpha})`;
            this.ctx.fill();
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    new DotGrid('hero-dot-grid');
});

// Global variables
let visitorCount = 0;
let countdownTimer = null;
let currentImageIndex = 0;
let galleryImages = [];

// DOM elements
const elements = {
    logoIntro: null,
    mainSite: null,
    landingPage: null,
    gallerySection: null,
    accessBtn: null,
    galleryPopup: null,
    closePopup: null,
    joinServerBtn: null,
    enterGalleryBtn: null,
    countdownDisplay: null,
    initialView: null,
    countdownView: null,
    enterGalleryView: null,
    visitorCountElement: null,
    themeToggleBtn: null,
    backToHomeBtn: null,
    galleryGrid: null,
    imageModal: null,
    modalImage: null,
    closeModal: null,
    prevImageBtn: null,
    nextImageBtn: null
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    initializeVisitorCounter();
    initializeTheme();
    initializeEventListeners();
    initializeGallery();
    initializeTypewriter();
    startLogoIntro();
});

// Initialize DOM elements
function initializeElements() {
    elements.logoIntro = document.getElementById('logo-intro');
    elements.mainSite = document.getElementById('main-site');
    elements.landingPage = document.getElementById('landing-page');
    elements.gallerySection = document.getElementById('gallery-section');
    elements.accessBtn = document.getElementById('access-gallery-btn');
    elements.galleryPopup = document.getElementById('gallery-popup');
    elements.closePopup = document.getElementById('close-popup');
    elements.joinServerBtn = document.getElementById('join-server-btn');
    elements.enterGalleryBtn = document.getElementById('enter-gallery-btn');
    elements.countdownDisplay = document.getElementById('countdown-display');
    elements.initialView = document.getElementById('initial-view');
    elements.countdownView = document.getElementById('countdown-view');
    elements.enterGalleryView = document.getElementById('enter-gallery-view');
    elements.visitorCountElement = document.getElementById('visitor-count');
    elements.typewriterText = document.getElementById('typewriter-text');
    elements.timeDisplay = document.getElementById('current-time-display');
    elements.backToHomeBtn = document.getElementById('back-to-home');
    elements.galleryGrid = document.getElementById('gallery-grid');
    elements.imageModal = document.getElementById('image-modal');
    elements.modalImage = document.getElementById('modal-image');
    elements.closeModal = document.getElementById('close-modal');
    elements.prevImageBtn = document.getElementById('prev-image');
    elements.nextImageBtn = document.getElementById('next-image');
}

// Initialize visitor counter
function initializeVisitorCounter() {
    loadVisitorCount();
    incrementVisitorCount();
    updateVisitorDisplay();
}

// Load visitor count from JSON
function loadVisitorCount() {
    try {
        const stored = localStorage.getItem('sigmatic_visitor_data');
        if (stored) {
            const data = JSON.parse(stored);
            visitorCount = data.count || 0;
        }
    } catch (error) {
        console.log('No previous visitor data found');
        visitorCount = 0;
    }
}

// Increment visitor count
function incrementVisitorCount() {
    visitorCount++;
    saveVisitorCount();
}

// Save visitor count to JSON
function saveVisitorCount() {
    const visitorData = {
        count: visitorCount,
        lastVisit: new Date().toISOString(),
        timestamp: Date.now()
    };
    
    try {
        localStorage.setItem('sigmatic_visitor_data', JSON.stringify(visitorData));
    } catch (error) {
        console.error('Failed to save visitor data:', error);
    }
}

// Update visitor count display with animation
function updateVisitorDisplay() {
    if (elements.visitorCountElement) {
        animateCounterUpdate(elements.visitorCountElement, visitorCount);
    }
}

// Animate counter update
function animateCounterUpdate(element, targetValue) {
    const startValue = parseInt(element.textContent) || 0;
    const duration = 1000;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutCubic(progress));
        element.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Easing function
function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

// Initialize theme
function initializeTheme() {
    // Set dark theme by default and keep it locked
    document.documentElement.setAttribute('data-theme', 'dark');
}

function initializeTimeDisplay() {
    updateTime();
    // Update time every second
    setInterval(updateTime, 1000);
}

function updateTime() {
    const now = new Date();
    const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };
    const dateOptions = {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    };
    
    const timeText = now.toLocaleTimeString('en-US', timeOptions);
    const dateText = now.toLocaleDateString('en-US', dateOptions);
    
    if (elements.timeDisplay) {
        const timeElement = elements.timeDisplay.querySelector('.time-text');
        const dateElement = elements.timeDisplay.querySelector('.date-text');
        
        if (timeElement) timeElement.textContent = timeText;
        if (dateElement) dateElement.textContent = dateText;
    }
}

// Initialize event listeners
function initializeEventListeners() {
    // Access gallery button
    elements.accessBtn?.addEventListener('click', showGalleryPopup);
    
    // Popup controls
    elements.closePopup?.addEventListener('click', hideGalleryPopup);
    elements.joinServerBtn?.addEventListener('click', function() {
        startCountdown();
        openServerInvite();
    });
    elements.enterGalleryBtn?.addEventListener('click', grantGalleryAccess);
    
    // Initialize time display
    initializeTimeDisplay();
    
    // Navigation
    elements.backToHomeBtn?.addEventListener('click', showLandingPage);
    
    // Modal controls
    elements.closeModal?.addEventListener('click', closeImageModal);
    elements.prevImageBtn?.addEventListener('click', showPreviousImage);
    elements.nextImageBtn?.addEventListener('click', showNextImage);
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Click outside to close modal
    elements.imageModal?.addEventListener('click', function(e) {
        if (e.target === elements.imageModal || e.target.classList.contains('modal-backdrop')) {
            closeImageModal();
        }
    });
    
    // Click outside to close popup
    elements.galleryPopup?.addEventListener('click', function(e) {
        if (e.target === elements.galleryPopup) {
            hideGalleryPopup();
        }
    });
}

// Initialize gallery
function initializeGallery() {
    galleryImages = [
        { src: 'pics/Pic1.jpg', alt: 'SIGMATIC Gallery Image 1' },
        { src: 'pics/Pic2.jpg', alt: 'SIGMATIC Gallery Image 2' },
        { src: 'pics/Pic3.jpg', alt: 'SIGMATIC Gallery Image 3' },
        { src: 'pics/Pic4.jpg', alt: 'SIGMATIC Gallery Image 4' },
        { src: 'pics/Pic5.jpg', alt: 'SIGMATIC Gallery Image 5' }
    ];
    
    renderGallery();
}

// Render gallery items
function renderGallery() {
    if (!elements.galleryGrid) return;
    
    elements.galleryGrid.innerHTML = '';
    
    galleryImages.forEach((image, index) => {
        const galleryItem = createGalleryItem(image, index);
        elements.galleryGrid.appendChild(galleryItem);
    });
}

// Create gallery item element
function createGalleryItem(image, index) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.style.animationDelay = `${index * 0.1}s`;
    
    const img = document.createElement('img');
    img.src = image.src;
    img.alt = image.alt;
    img.loading = 'lazy';
    
    const overlay = document.createElement('div');
    overlay.className = 'gallery-overlay';
    overlay.innerHTML = '<span class="view-icon">👁️</span>';
    
    item.appendChild(img);
    item.appendChild(overlay);
    
    item.addEventListener('click', () => openImageModal(index));
    
    return item;
}

// Start logo intro animation
function startLogoIntro() {
    // Prepare main site for ultra-smooth transition with optimized performance
    if (elements.mainSite) {
        elements.mainSite.style.opacity = '0';
        elements.mainSite.style.transform = 'translateZ(0) scale(0.85)';
        elements.mainSite.style.animation = 'none';
        elements.mainSite.style.willChange = 'transform, opacity, filter';
        // Pre-warm the GPU for smoother transitions
        elements.mainSite.style.backfaceVisibility = 'hidden';
        elements.mainSite.style.perspective = '1000px';
    }
    
    // Optimized transition timing with performance monitoring
    const transitionStart = performance.now();
    
    setTimeout(() => {
        if (elements.mainSite) {
            elements.mainSite.classList.remove('hidden');
            
            // Triple-buffered animation start for maximum smoothness
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        elements.mainSite.style.animation = 'ultraSiteAppear 1.2s cubic-bezier(0.165, 0.84, 0.44, 1) forwards';
                    });
                });
            });
        }
        
        if (elements.logoIntro) {
            // Synchronized fade-out with optimized easing
            elements.logoIntro.style.transition = 'opacity 0.5s cubic-bezier(0.165, 0.84, 0.44, 1), transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1), filter 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)';
            elements.logoIntro.style.opacity = '0';
            elements.logoIntro.style.transform = 'translateZ(0) scale(1.05)';
            elements.logoIntro.style.filter = 'blur(3px)';
            
            // Cleanup with performance optimization
            setTimeout(() => {
                elements.logoIntro.classList.add('hidden');
                // Batch DOM cleanup for better performance
                requestAnimationFrame(() => {
                    if (elements.mainSite) {
                        elements.mainSite.style.willChange = 'auto';
                        elements.mainSite.style.backfaceVisibility = '';
                        elements.mainSite.style.perspective = '';
                    }
                });
            }, 500);
        }
    }, 4950); // Slightly earlier start for seamless transition
}

// Show gallery popup
function showGalleryPopup() {
    elements.galleryPopup?.classList.remove('hidden');
    
    // Reset popup state - show initial view, hide others
    if (elements.initialView) {
        elements.initialView.classList.remove('hidden');
        elements.initialView.style.opacity = '1';
    }
    
    if (elements.countdownView) {
        elements.countdownView.classList.add('hidden');
    }
    
    if (elements.enterGalleryView) {
        elements.enterGalleryView.classList.add('hidden');
    }
    
    // Clear any existing countdown
    clearInterval(countdownTimer);
    
    // Add ripple effect
    const ripple = elements.accessBtn?.querySelector('.btn-ripple');
    if (ripple) {
        ripple.style.animation = 'none';
        setTimeout(() => {
            ripple.style.animation = '';
        }, 10);
    }
}

// Hide gallery popup
function hideGalleryPopup() {
    elements.galleryPopup?.classList.add('hidden');
    clearInterval(countdownTimer);
}

// Start countdown timer
function startCountdown() {
    // Hide initial view and show countdown view
    if (elements.initialView) {
        elements.initialView.style.opacity = '0';
        elements.initialView.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            elements.initialView.classList.add('hidden');
        }, 300);
    }
    
    setTimeout(() => {
        if (elements.countdownView) {
            elements.countdownView.classList.remove('hidden');
            elements.countdownView.style.opacity = '1';
            elements.countdownView.style.transform = 'translateY(0)';
        }
    }, 300);
    
    let timeLeft = 10;
    if (elements.countdownDisplay) {
        elements.countdownDisplay.textContent = timeLeft;
    }
    
    countdownTimer = setInterval(() => {
        timeLeft--;
        if (elements.countdownDisplay) {
            elements.countdownDisplay.textContent = timeLeft;
        }
        
        // Add pulse animation
        const timer = elements.countdownDisplay?.parentElement;
        if (timer) {
            timer.style.transform = 'scale(1.1)';
            setTimeout(() => {
                timer.style.transform = 'scale(1)';
            }, 100);
        }
        
        if (timeLeft <= 0) {
            clearInterval(countdownTimer);
            showEnterGalleryButton();
        }
    }, 1000);
}

// Show Enter Gallery button after countdown
function showEnterGalleryButton() {
    // Hide countdown view and show enter gallery view
    if (elements.countdownView) {
        elements.countdownView.style.opacity = '0';
        elements.countdownView.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            elements.countdownView.classList.add('hidden');
        }, 300);
    }
    
    // Show Enter Gallery button with smooth transition
    setTimeout(() => {
        if (elements.enterGalleryView) {
            elements.enterGalleryView.classList.remove('hidden');
            elements.enterGalleryView.style.opacity = '1';
            elements.enterGalleryView.style.transform = 'translateY(0)';
        }
    }, 400);
}

// Grant gallery access with zoom animation
function grantGalleryAccess() {
    const popupContent = document.querySelector('.popup-content');
    
    // Add zoom-out animation class
    if (popupContent) {
        popupContent.classList.add('zoom-out');
    }
    
    // Hide popup and show gallery after animation
    setTimeout(() => {
        hideGalleryPopup();
        showGallery();
        
        // Show success notification
        showNotification('Gallery access granted! 🎉');
        
        // Remove animation class for next time
        if (popupContent) {
            popupContent.classList.remove('zoom-out');
        }
    }, 300);
}

// Open server invite
function openServerInvite() {
    // Placeholder server invite URL
    const serverUrl = 'https://discord.gg/placeholder';
    window.open(serverUrl, '_blank');
    
    // Add glow effect
    const glow = elements.joinServerBtn?.querySelector('.btn-glow');
    if (glow) {
        glow.style.left = '100%';
        setTimeout(() => {
            glow.style.left = '-100%';
        }, 600);
    }
}

// Theme is locked to dark mode - no toggle functionality needed

// Show gallery
function showGallery() {
    elements.landingPage?.classList.add('hidden');
    elements.gallerySection?.classList.remove('hidden');
    
    // Animate gallery items
    const items = elements.galleryGrid?.querySelectorAll('.gallery-item');
    items?.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Show landing page
function showLandingPage() {
    elements.gallerySection?.classList.add('hidden');
    elements.landingPage?.classList.remove('hidden');
}

// Open image modal
function openImageModal(index) {
    currentImageIndex = index;
    const image = galleryImages[index];
    
    elements.modalImage.src = image.src;
    elements.modalImage.alt = image.alt;
    elements.imageModal?.classList.remove('hidden');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

// Close image modal
function closeImageModal() {
    elements.imageModal?.classList.add('hidden');
    document.body.style.overflow = '';
}

// Show previous image
function showPreviousImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    updateModalImage();
}

// Show next image
function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    updateModalImage();
}

// Update modal image
function updateModalImage() {
    const image = galleryImages[currentImageIndex];
    
    // Add fade transition
    elements.modalImage.style.opacity = '0';
    
    setTimeout(() => {
        elements.modalImage.src = image.src;
        elements.modalImage.alt = image.alt;
        elements.modalImage.style.opacity = '1';
    }, 150);
}

// Handle keyboard navigation
function handleKeyboardNavigation(e) {
    if (!elements.imageModal?.classList.contains('hidden')) {
        switch(e.key) {
            case 'Escape':
                closeImageModal();
                break;
            case 'ArrowLeft':
                showPreviousImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
        }
    }
    
    if (!elements.galleryPopup?.classList.contains('hidden')) {
        if (e.key === 'Escape') {
            hideGalleryPopup();
        }
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: var(--gradient-primary);
        color: white;
        padding: 1rem 2rem;
        border-radius: 25px;
        box-shadow: 0 10px 30px var(--shadow-medium);
        z-index: 4000;
        animation: slideInRight 0.5s ease-out;
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease-in forwards';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Add notification animations to CSS dynamically
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(notificationStyles);

// Performance optimization: Lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Smooth scrolling for better UX
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Add touch support for mobile devices
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    if (!elements.imageModal?.classList.contains('hidden')) {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                showPreviousImage();
            } else {
                showNextImage();
            }
        }
    }
}

// Error handling for image loading
function handleImageError(img) {
    img.style.display = 'none';
    const placeholder = document.createElement('div');
    placeholder.className = 'image-placeholder';
    placeholder.textContent = 'Image not available';
    placeholder.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        background: var(--bg-secondary);
        color: var(--text-secondary);
        font-size: 0.9rem;
    `;
    img.parentNode.appendChild(placeholder);
}

// Add error handling to all images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', () => handleImageError(img));
    });
});

// Export functions for potential external use
// Typewriter Effect Variables
let typewriterSentences = [
    "Welcome to my exclusive gallery showcase.",
    "Discover a curated collection of premium content.",
    "Experience modern, interactive design.",
    "Join our community of creative enthusiasts.",
    "Explore stunning visuals and artistic expressions."
];
let currentSentenceIndex = 0;
let currentCharIndex = 0;
let isTyping = true;
let typewriterTimeout;

// Initialize Typewriter Effect
function initializeTypewriter() {
    if (elements.typewriterText) {
        // Start typewriter effect after a delay
        setTimeout(() => {
            startTypewriterEffect();
        }, 2500);
    }
}

// Start Typewriter Effect
function startTypewriterEffect() {
    if (!elements.typewriterText) return;
    
    const currentSentence = typewriterSentences[currentSentenceIndex];
    
    if (isTyping) {
        // Typing phase
        if (currentCharIndex < currentSentence.length) {
            elements.typewriterText.textContent = currentSentence.substring(0, currentCharIndex + 1);
            currentCharIndex++;
            typewriterTimeout = setTimeout(startTypewriterEffect, 80 + Math.random() * 40);
        } else {
            // Pause before erasing
            typewriterTimeout = setTimeout(() => {
                isTyping = false;
                startTypewriterEffect();
            }, 2000);
        }
    } else {
        // Erasing phase
        if (currentCharIndex > 0) {
            elements.typewriterText.textContent = currentSentence.substring(0, currentCharIndex - 1);
            currentCharIndex--;
            typewriterTimeout = setTimeout(startTypewriterEffect, 50 + Math.random() * 30);
        } else {
            // Move to next sentence
            currentSentenceIndex = (currentSentenceIndex + 1) % typewriterSentences.length;
            isTyping = true;
            typewriterTimeout = setTimeout(startTypewriterEffect, 500);
        }
    }
}

window.SigmaticGallery = {
    showGallery,
    showLandingPage,
    updateVisitorDisplay
};
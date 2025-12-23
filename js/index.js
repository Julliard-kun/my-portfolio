
// Coverflow functionality
const items = document.querySelectorAll('.coverflow-item');
const dotsContainer = document.getElementById('dots');
const currentTitle = document.getElementById('current-title');
const currentDescription = document.getElementById('current-description');
const container = document.querySelector('.coverflow-container');
const menuToggle = document.getElementById('menuToggle');
const mainMenu = document.getElementById('mainMenu');
let currentIndex = 3;
let isAnimating = false;

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mainMenu.classList.toggle('active');
});

// Close mobile menu when clicking on menu items (except external links)
document.querySelectorAll('.menu-item:not(.external)').forEach(item => {
    item.addEventListener('click', (e) => {
        menuToggle.classList.remove('active');
        mainMenu.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !mainMenu.contains(e.target)) {
        menuToggle.classList.remove('active');
        mainMenu.classList.remove('active');
    }
});

// Image data with titles and descriptions
const imageData = [
    {
        title: "Mountain Landscape",
        description: "Majestic peaks covered in snow during golden hour"
    },
    {
        title: "Forest Path",
        description: "A winding trail through ancient woodland"
    },
    {
        title: "Lake Reflection",
        description: "Serene waters mirroring the surrounding landscape"
    },
    {
        title: "Ocean Sunset",
        description: "Golden hour over endless ocean waves"
    },
    {
        title: "Desert Dunes",
        description: "Rolling sand dunes under vast blue skies"
    },
    {
        title: "Starry Night",
        description: "Countless stars illuminating the dark sky"
    },
    {
        title: "Waterfall",
        description: "Cascading water through lush green forest"
    }
];

// Create dots
items.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.className = 'dot';
    dot.onclick = () => goToIndex(index);
    dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.dot');
let autoplayInterval = null;
let isPlaying = true;
const playIcon = document.querySelector('.play-icon');
const pauseIcon = document.querySelector('.pause-icon');

function updateCoverflow() {
    if (isAnimating) return;
    isAnimating = true;

    items.forEach((item, index) => {
        let offset = index - currentIndex;

        if (offset > items.length / 2) {
            offset = offset - items.length;
        }
        else if (offset < -items.length / 2) {
            offset = offset + items.length;
        }

        const absOffset = Math.abs(offset);
        const sign = Math.sign(offset);

        let translateX = offset * 220;
        let translateZ = -absOffset * 200;
        let rotateY = -sign * Math.min(absOffset * 60, 60);
        let opacity = 1 - (absOffset * 0.2);
        let scale = 1 - (absOffset * 0.1);

        if (absOffset > 3) {
            opacity = 0;

            translateX = sign * 800;
        }

        item.style.transform = `
                    translateX(${translateX}px) 
                    translateZ(${translateZ}px) 
                    rotateY(${rotateY}deg)
                    scale(${scale})
                `;
        item.style.opacity = opacity;
        item.style.zIndex = 100 - absOffset;

        item.classList.toggle('active', index === currentIndex);
    });

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });

    const currentData = imageData[currentIndex];
}

function navigate(direction) {
    if (isAnimating) return;

    currentIndex = currentIndex + direction;

    if (currentIndex < 0) {
        currentIndex = items.length - 1;
    } else if (currentIndex >= items.length) {
        currentIndex = 0;
    }

    updateCoverflow();
}

function goToIndex(index) {
    if (isAnimating || index === currentIndex) return;
    currentIndex = index;
    updateCoverflow();
}

// Click on items to select
items.forEach((item, index) => {
    item.addEventListener('click', () => goToIndex(index));
});

// Touch/swipe support
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;
let isSwiping = false;

function handleSwipe() {
    const swipeThreshold = 30;
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold) {
        handleUserInteraction();

        if (diffX > 0) {
            navigate(1);
        } else {
            navigate(-1);
        }
    }
}

// Initialize images and reflections
items.forEach((item, index) => {
    const img = item.querySelector('img');
    const reflection = item.querySelector('.reflection');

    img.onload = function () {

        this.parentElement.classList.remove('image-loading');
        reflection.style.setProperty('--bg-image', `url(${this.src})`);
        reflection.style.backgroundImage = `url(${this.src})`;
        reflection.style.backgroundSize = 'cover';
        reflection.style.backgroundPosition = 'center';
    };

    img.onerror = function () {
        this.parentElement.classList.add('image-loading');
    };
});

function toggleAutoplay() {
    if (isPlaying) {
        stopAutoplay();
    } else {
        startAutoplay();
    }
}

function handleUserInteraction() {
    stopAutoplay();
}

// Add event listeners to stop autoplay on manual navigation
items.forEach((item) => {
    item.addEventListener('click', handleUserInteraction);
});

dots.forEach((dot) => {
    dot.addEventListener('click', handleUserInteraction);
});

// Smooth scrolling and active menu item
const sections = document.querySelectorAll('.section');
const menuItems = document.querySelectorAll('.menu-item');
const header = document.getElementById('header');
const scrollToTopBtn = document.getElementById('scrollToTop');

// Update active menu item on scroll
function updateActiveMenuItem() {
    const scrollPosition = window.scrollY + 100;

    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            menuItems.forEach(item => {
                if (!item.classList.contains('external')) {
                    item.classList.remove('active');
                }
            });
            if (menuItems[index] && !menuItems[index].classList.contains('external')) {
                menuItems[index].classList.add('active');
            }
        }
    });

    // Header background on scroll
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Show/hide scroll to top button
    if (window.scrollY > 500) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
}

window.addEventListener('scroll', updateActiveMenuItem);

// Smooth scroll to section
menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
        const targetId = item.getAttribute('href');

        // Check if it's an internal link (starts with #)
        if (targetId && targetId.startsWith('#')) {
            e.preventDefault();
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
        // External links will open normally in new tab
    });
});

// Logo click to scroll to top
document.querySelector('.logo-container').addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Scroll to top button
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Form submission
function handleSubmit(event) {
    event.preventDefault();
    alert('Thank you for your message! We\'ll get back to you soon.');
    event.target.reset();
}

// Typewriter effect for name - Secure version
function typeWriter(text, element, speed = 100) {
    let i = 0;
    // Clear content securely
    element.textContent = '';

    function type() {
        if (i < text.length) {
            // Use textContent instead of innerHTML to prevent XSS
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // Hide cursor after typing is complete
            setTimeout(() => {
                const cursor = document.querySelector('.cursor-blink');
                if (cursor) cursor.style.opacity = '0';
            }, 2000);
        }
    }
    type();
}

// Rotating roles animation
function startRoleRotation() {
    const roles = ['Computer Programmer', 'IT Technician'];
    const roleElement = document.getElementById('rotating-roles');
    let currentRoleIndex = 0;

    function rotateRole() {
        roleElement.style.opacity = '0';
        roleElement.style.transform = 'translateY(20px)';

        setTimeout(() => {
            currentRoleIndex = (currentRoleIndex + 1) % roles.length;
            roleElement.textContent = roles[currentRoleIndex];
            roleElement.style.opacity = '1';
            roleElement.style.transform = 'translateY(0)';
        }, 300);
    }

    // Start the rotation after initial delay
    setTimeout(() => {
        setInterval(rotateRole, 3000);
    }, 4000);
}

// Initialize interactive header
function initializeInteractiveHeader() {
    const nameElement = document.getElementById('typewriter-name');
    const roleElement = document.getElementById('rotating-roles');

    if (nameElement) {
        // Start typewriter effect after a short delay
        setTimeout(() => {
            typeWriter('Julliard Macatuggal', nameElement, 80);
        }, 1000);
    }

    if (roleElement) {
        // Add transition styles
        roleElement.style.transition = 'all 0.3s ease';
        startRoleRotation();
    }
}

// Stats section
function updateStats() {
    const statName1Content = ['PMA Inventory System', "Sol'n: Serious Educational Game"];
    const statName2Content = ['Civil Service Professional Eligibility', 'PHP for Beginners: PHP Crash Course', 'Jira Agile Fundamentals: Build Strong Agile Basics','Make a WordPress Website with Elementor', 
                                'Information Security Crash Course: Quick Steps to Safety'];
    const statName3Content = ['Software Development and Design Thinking', 'Sailing Smooth in Cyberspace: Strengthening Cybersecurity in the Age of ICT'];
    const stats = document.querySelectorAll('.stat-item');

    // Track current index for each stat to cycle through content
    let currentIndex1 = 1;
    let currentIndex2 = 1;
    let currentIndex3 = 1;

    function updateStatName(statName, content, currentIndex) {
        statName.style.opacity = '0';
        statName.style.transform = 'translateY(20px)';
        statName.style.transition = 'all 0.6s ease';

        setTimeout(() => {
            statName.style.opacity = '1';
            statName.style.transform = 'translateY(0)';
            statName.textContent = content[currentIndex];
        }, 300);

        return (currentIndex + 1) % content.length;
    }

    // Start rotation for each stat with different intervals for variety
    setInterval(() => {
        currentIndex1 = updateStatName(stats[0].querySelector('.stat-name'), statName1Content, currentIndex1);
    }, 8000);

    setInterval(() => {
        currentIndex2 = updateStatName(stats[1].querySelector('.stat-name'), statName2Content, currentIndex2);
    }, 8000);

    setInterval(() => {
        currentIndex3 = updateStatName(stats[2].querySelector('.stat-name'), statName3Content, currentIndex3);
    }, 8000);
}


// Intersection Observer for triggering animations when section comes into view
function setupScrollAnimations() {
    const aboutHeader = document.querySelector('.about-header');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                // Trigger typewriter effect when section is visible
                if (entry.target === aboutHeader) {
                    initializeInteractiveHeader();
                    observer.unobserve(entry.target); // Run only once
                }
            }
        });
    }, {
        threshold: 0.3
    });

    if (aboutHeader) {
        observer.observe(aboutHeader);
    }
}

// Initialize
updateCoverflow();
setupScrollAnimations();
updateStats();
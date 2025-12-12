// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Fetch VS Code Marketplace stats
async function fetchMarketplaceStats() {
    const extensionId = 'aker.codebeats';
    const installCountEl = document.getElementById('install-count');
    const reviewRatingEl = document.getElementById('review-rating');
    
    try {
        // Use VS Code Marketplace API with CORS proxy fallback
        const apiUrl = 'https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery';
        const corsProxy = 'https://api.allorigins.win/raw?url=';
        
        const requestBody = {
            filters: [{
                criteria: [{ filterType: 7, value: extensionId }]
            }],
            flags: 914
        };
        
        let response;
        try {
            // Try direct API call first
            response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json;api-version=3.0-preview.1'
                },
                body: JSON.stringify(requestBody)
            });
        } catch (e) {
            // If CORS fails, try with proxy
            response = await fetch(corsProxy + encodeURIComponent(apiUrl), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json;api-version=3.0-preview.1'
                },
                body: JSON.stringify(requestBody)
            });
        }
        
        if (response && response.ok) {
            const data = await response.json();
            if (data.results && data.results[0] && data.results[0].extensions && data.results[0].extensions[0]) {
                const extension = data.results[0].extensions[0];
                
                // Format install count
                const installCount = extension.statistics?.find(s => s.statisticName === 'install')?.value || 0;
                if (installCount > 0) {
                    installCountEl.textContent = formatNumber(installCount);
                } else {
                    installCountEl.textContent = '0';
                }
                
                // Format rating
                const rating = extension.statistics?.find(s => s.statisticName === 'averagerating')?.value || 0;
                const ratingCount = extension.statistics?.find(s => s.statisticName === 'ratingcount')?.value || 0;
                if (rating > 0) {
                    reviewRatingEl.innerHTML = `<svg class="golden-star" width="20" height="20" viewBox="0 0 24 24" fill="#FFD700" style="display: inline-block; margin-right: 6px; vertical-align: middle; filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.8));"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> ${rating.toFixed(1)}<span style="font-size: 12px; color: var(--text-tertiary); margin-left: 4px;">(${formatNumber(ratingCount)})</span>`;
                } else {
                    reviewRatingEl.textContent = 'No ratings yet';
                }
                return;
            }
        }
    } catch (error) {
        console.log('Could not fetch marketplace stats:', error);
    }
    
    // Fallback: Show link to marketplace
    installCountEl.innerHTML = '<a href="https://marketplace.visualstudio.com/items?itemName=aker.codebeats" target="_blank" style="color: inherit; text-decoration: none;">View Stats</a>';
    reviewRatingEl.innerHTML = '<a href="https://marketplace.visualstudio.com/items?itemName=aker.codebeats" target="_blank" style="color: inherit; text-decoration: none;">View Reviews</a>';
}

// Format large numbers
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Observe feature cards, install methods, and setup steps
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.feature-card, .install-method, .setup-step');
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.3s ease ${index * 0.05}s, transform 0.3s ease ${index * 0.05}s`;
        observer.observe(el);
    });
    
    // Fetch marketplace stats
    fetchMarketplaceStats();
});

// Navbar background on scroll
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Add hover effect to buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Parallax effect for hero section (subtle)
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero && scrolled < hero.offsetHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add active state to navigation links based on scroll position
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // ESC to scroll to top
    if (e.key === 'Escape') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// Lazy load images for better performance
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .nav-links a.active {
        color: var(--spotify-green);
    }
    
    .nav-links a.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);


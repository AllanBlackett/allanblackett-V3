// EXISTING NAVIGATION CODE - NO CHANGES TO EXISTING CODE
// add classes for mobile navigation toggling
var CSbody = document.querySelector("body");
const CSnavbarMenu = document.querySelector("#cs-navigation");
const CShamburgerMenu = document.querySelector("#cs-navigation .cs-toggle");

CShamburgerMenu.addEventListener('click', function() {
    CShamburgerMenu.classList.toggle("cs-active");
    CSnavbarMenu.classList.toggle("cs-active");
    CSbody.classList.toggle("cs-open");
    // run the function to check the aria-expanded value
    ariaExpanded();
});

// checks the value of aria expanded on the cs-ul and changes it accordingly whether it is expanded or not 
function ariaExpanded() {
    const csUL = document.querySelector('#cs-expanded');
    const csExpanded = csUL.getAttribute('aria-expanded');

    if (csExpanded === 'false') {
        csUL.setAttribute('aria-expanded', 'true');
    } else {
        csUL.setAttribute('aria-expanded', 'false');
    }
}

// This script adds a class to the body after scrolling 100px
// and we used these body.scroll styles to create some on scroll 
// animations with the navbar

document.addEventListener('scroll', (e) => { 
    const scroll = document.documentElement.scrollTop;
    if(scroll >= 100){
document.querySelector('body').classList.add('scroll')
    } else {
    document.querySelector('body').classList.remove('scroll')
    }
});

// mobile nav toggle code
const dropDowns = Array.from(document.querySelectorAll('#cs-navigation .cs-dropdown'));
    for (const item of dropDowns) {
        const onClick = () => {
        item.classList.toggle('cs-active')
    }
    item.addEventListener('click', onClick)
    }

// Scroll to Top Button with Smooth Animation
const scrollToTopButton = document.getElementById('scrollToTop');

// Listen for the scroll event
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopButton.classList.add('visible');
    } else {
        scrollToTopButton.classList.remove('visible');
    }
});

// Smooth scroll to the top when clicked
scrollToTopButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// VALIDATION CHANGE: Contact Form Real-time Feedback Validation for Allan Blackett
document.querySelector("#cs-form-983").addEventListener("submit", function (event) {
    const requiredFields = document.querySelectorAll("#cs-form-983 [required]");
    let isValid = true;

    requiredFields.forEach((field) => {
        if (!field.value.trim()) {
            field.style.border = "2px solid red"; // Highlight empty fields
            field.classList.add("error");
            isValid = false;
        } else {
            field.style.border = ""; // Reset border if valid
            field.classList.remove("error");
        }
    });

    if (!isValid) {
        alert("Please fill out all required fields.");
        event.preventDefault(); // Prevent form submission
    }
});

// VALIDATION CHANGE: Phone number formatting for Allan Blackett
document.getElementById("phone-983").addEventListener("input", function (e) {
    // Automatically format input while typing
    let input = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
    let formatted = "";

    if (input.startsWith("1")) {
        formatted = "+" + input[0]; // Add '+' for international format
        input = input.slice(1);
    }

    if (input.length > 0) {
        formatted += "(" + input.substring(0, 3);
    }
    if (input.length >= 4) {
        formatted += ") " + input.substring(3, 6);
    }
    if (input.length >= 7) {
        formatted += "-" + input.substring(6, 10);
    }

    e.target.value = formatted;
});

// VALIDATION CHANGE: Phone number validation for Allan Blackett
document.getElementById("phone-983").addEventListener("blur", function (e) {
    const phoneRegex = /^(\+1\s?)?(\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}$/;
    const phoneInput = e.target.value;

    if (phoneInput.trim() && !phoneRegex.test(phoneInput)) {
        alert(
            "Please enter a valid phone number format (e.g., +1 (206) 987-6543, 555-555-5555)."
        );
        e.target.style.border = "2px solid red"; // Highlight invalid field
        e.target.classList.add("error");
    } else {
        e.target.style.border = ""; // Reset border if valid
        e.target.classList.remove("error");
    }
});

// VALIDATION CHANGE: Reset field styling when user starts typing (removes red border)
document.querySelectorAll("#cs-form-983 .cs-input, #cs-form-983 .cs-textarea").forEach(field => {
    field.addEventListener("input", function() {
        if (this.value.trim()) {
            this.style.border = "";
            this.classList.remove("error");
        }
    });
});

// SCROLL-SPY ADDITION: Desktop-only scroll-spy navigation functionality
// Only runs on desktop screens (64rem and above)
if (window.matchMedia('(min-width: 64rem)').matches) {
    
    /* ============ SCROLL-SPY (ACTIVE LINK) ============ */
    const NAV_ID        = 'cs-navigation';
    const LINK_SELECTOR = `#${NAV_ID} a.cs-li-link[href^="#"]`;
    const ACTIVE_LINK   = 'is-active';
    const THRESHOLD     = 0.35;
    const BOTTOM_MARGIN = '45%';

    // Function to get current header height
    const headerHeight = () => {
        const nav = document.getElementById('cs-navigation');
        return nav ? nav.offsetHeight : 0;
    };

    // Get all navigation links and create mapping
    const links = Array.from(document.querySelectorAll(LINK_SELECTOR));
    const linkMap = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
    
    // Get all sections that have corresponding navigation links
    const sections = Array.from(document.querySelectorAll('section[id]')).filter(s => linkMap.has(s.id));

    // Function to set active link
    const setActiveLink = (id) => {
        links.forEach((a) => {
            const isActive = a.getAttribute('href').slice(1) === id;
            a.classList.toggle(ACTIVE_LINK, isActive);
            if (isActive) {
                a.setAttribute('aria-current', 'page');
            } else {
                a.removeAttribute('aria-current');
            }
        });
    };

    let observer;
    
    // Build intersection observer
    const buildObserver = () => {
        if (observer) observer.disconnect();
        
        observer = new IntersectionObserver((entries) => {
            let bestEntry = null;
            
            // Find the entry with the highest intersection ratio
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                if (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio) {
                    bestEntry = entry;
                }
            }
            
            // Set active link based on best intersecting section
            if (bestEntry) {
                setActiveLink(bestEntry.target.id);
            }
        }, {
            root: null,
            threshold: [THRESHOLD],
            rootMargin: `-${headerHeight()}px 0px -${BOTTOM_MARGIN} 0px`
        });

        // Observe all sections
        sections.forEach(section => observer.observe(section));
    };

    // Initialize observer
    buildObserver();

    // Rebuild observer on window resize (header height might change)
    window.addEventListener('resize', () => {
        clearTimeout(buildObserver._timeout);
        buildObserver._timeout = setTimeout(buildObserver, 120);
    });

    // Set initial active state (handles mid-page loads and refreshes)
    if (sections.length > 0) {
        const currentHeaderHeight = headerHeight();
        const nearest = sections
            .map(section => ({
                id: section.id,
                distance: Math.abs(section.getBoundingClientRect().top - currentHeaderHeight)
            }))
            .sort((a, b) => a.distance - b.distance)[0];
        
        if (nearest) {
            setActiveLink(nearest.id);
        }
    }
}
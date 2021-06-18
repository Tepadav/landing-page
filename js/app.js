/**
 * 
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 * 
 * Dependencies: None
 * 
 * JS Version: ES2015/ES6
 * 
 * JS Standard: ESlint
 * 
*/

/**
 * Define Global Variables
 * 
 */
const navMenu = document.getElementById('navbar__list');
const sections = document.querySelectorAll('section');
const scrollTopBtn = document.getElementById('button__up');

/**
 * End Global Variables
 * Start Helper Functions
 * 
*/
// function that creates an element...
const createElement = (type, destination, classNames = null, text = null, additionOptions = () => {}) => {
    let elemNode = document.createElement(type);
    if (classNames) elemNode.classList.add(classNames);
    if (text) elemNode.appendChild(document.createTextNode(text));
    additionOptions(elemNode);
    destination.appendChild(elemNode);
}

// function that return a scrollTo configurations...
const findPosition = (elem) => {
    return {
        top: elem.offsetTop,
        left: 0,
        behavior: 'smooth'
    }
}

/**
 * End Helper Functions
 * Begin Main Functions
 * 
*/

// Build menu Function
const buildMenu = () => {
    let sectionsNames = Array.from(sections).map(section => section.dataset.nav); // Assigning sections names  
    for ( index in Array.from(sectionsNames)) {
        createElement('li', navMenu, null, null, (elemNode) => {
            createElement('a', elemNode, 'menu__link', sectionsNames[index], (elemNode) => {
                let linkRef = sectionsNames[index].split(' ').join('').toLowerCase();
                elemNode.setAttribute('href', '#' + linkRef);
            });
        });
    }
}



// Add class 'active' to section when near top of viewport
const sectionActivate = (section) => {
    let sectionHeight = Math.round(section.offsetHeight);
    let sectionTopPosition = Math.round(section.getBoundingClientRect().top);
    if (sectionTopPosition > -150 && sectionTopPosition < sectionHeight - 150) {
        if (section.getAttribute('class') !== 'active') {
            section.classList.add('active');
        }
    } else {
        if (section.getAttribute('class') === 'active') {
            section.removeAttribute('class')
        }
    }
} 

// buttons style when section activatio
const navLinkStyle = (section) => {
    setTimeout(() => {
        let sectionId = section.getAttribute('id');
        let sectionLink = Array.from(document.querySelectorAll('a')).filter((link)=> {
            return link.getAttribute('href') === `#${sectionId}`
        });
        if (section.getAttribute('class') === 'active') {
            sectionLink[0].style.backgroundColor = 'black';
            sectionLink[0].style.color = 'white';
        } else {
            sectionLink[0].style.backgroundColor = 'white';
            sectionLink[0].style.color = 'black';
        }
    }, sections.length * 150);
}

// Scroll to anchor ID using scrollTO event
const scrollEvtFunc = (evt) => {
    if (evt.target.nodeName.toLowerCase() === 'a') {
        evt.preventDefault();
        const sectionNavId = evt.target.getAttribute('href');
        const sectionToGo = document.getElementById(/section\d+/.exec(sectionNavId));
        window.scrollTo(findPosition(sectionToGo));
    }
} 

// add styles to scrollTop
const scrollTopBtnFunc = new class {
    constructor() {}

    mouseenterStyle(evt) {
        if (window.scrollY > 0) {
            evt.target.style.backgroundColor = 'black';
            evt.target.style.color = 'white';
            evt.target.style.opacity = 0.9;
        }
    }

    mouseleaveStyle(evt) {
        if (window.scrollY > 0) {
            evt.target.style.backgroundColor = 'white';
            evt.target.style.color = 'black';
            evt.target.style.opacity = 0.5;
        } else {
            evt.target.style.opacity = 0;
        }
    }

    scrollTopBtnHide() {
        if (window.scrollY > 0) {
            scrollTopBtn.style.cursor = 'pointer'
            scrollTopBtn.style.opacity = 0.5;
        } else {
            scrollTopBtn.style.opacity = 0;
            scrollTopBtn.style.cursor = 'auto'
        }
    }
}

/**
* End Main Functions
* Begin Events
* 
*/

window.onload = () => {
    
    // Build menu
    buildMenu();

    // Scroll to section on link click
    navMenu.addEventListener('click', scrollEvtFunc);
    
    // Set sections as active
    let scrollTime = null;
    window.addEventListener('scroll', () => {
        // Hide scrollToTop button
        setTimeout(() => {
            scrollTopBtnFunc.scrollTopBtnHide();
        }, 500);

        // Activate sections while scrolling
        for (section of Array.from(sections)) {
            sectionActivate(section);
            navLinkStyle(section);
        }

        // Hide nav menu while not scrolling
        if (scrollTime !== null) {
            clearTimeout(scrollTime);
            document.querySelector('.page__header').style.top = '0'
        }
        scrollTime = setTimeout(() => {
            if (window.scrollY > 0) {
                document.querySelector('.page__header').style.top = '-200px'
            }
        }, 2000);
    });
    
    // Scroll top on button click
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo(findPosition(document.body));
    });
    
    // Scroll top button styles when mouse enter or leave
    scrollTopBtn.addEventListener('mouseenter', (evt) => {
        scrollTopBtnFunc.mouseenterStyle(evt);
    });
    scrollTopBtn.addEventListener('mouseleave', (evt) => {
        scrollTopBtnFunc.mouseleaveStyle(evt);
    });
}
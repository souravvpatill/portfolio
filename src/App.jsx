import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
    Download, Github, ExternalLink, Menu, X, Mail, 
    Code, Server, Palette, BoxSelect 
} from 'lucide-react';

// --- DATA ---
const NAV_LINKS = [
  { name: 'ABOUT', id: 'about' },
  { name: 'PROJECTS', id: 'projects' },
  { name: 'CONTACT', id: 'contact' },
];

const ROTATING_PHRASES = [
    "SOURAV", 
    "DESIGNER", 
    "DEVELOPER"
];

// Data for the services cards (from reference image)
const SERVICES = [
    { title: 'Frontend Developer', icon: Code, description: 'Crafting pixel-perfect, highly responsive user interfaces.' },
    { title: 'Backend Developer', icon: Server, description: 'Designing robust APIs and scalable database architectures.' },
    { title: 'UI/UX Design', icon: Palette, description: 'Focusing on user-centered design principles and prototyping.' },
    { title: 'Software Prototyping', icon: BoxSelect, description: 'Rapid development of concepts and minimum viable products.' },
];

// This is the definitive list of skills used in the Skills section.
const USER_DEFINED_SKILLS = [
  // ADDED: progress value and color class for progress bar
  { name: 'JavaScript', symbol: 'JS', shadow: 'shadow-yellow-400/50', barColor: 'bg-yellow-400', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', progress: 90 },
  { name: 'React', symbol: 'R', shadow: 'shadow-cyan-400/50', barColor: 'bg-cyan-400', url: 'https://react.dev/', progress: 85 },
  { name: 'Python', symbol: 'Py', shadow: 'shadow-green-500/50', barColor: 'bg-green-500', url: 'https://www.python.org/doc/', progress: 75 },
  { name: 'Django', symbol: 'D', shadow: 'shadow-teal-400/50', barColor: 'bg-teal-400', url: 'https://docs.djangoproject.com/', progress: 70 },
  { name: 'Git', symbol: 'Git', shadow: 'shadow-orange-400/50', barColor: 'bg-orange-400', url: 'https://git-scm.com/doc', progress: 95 },
  { name: 'Java', symbol: 'J', shadow: 'shadow-blue-600/50', barColor: 'bg-blue-600', url: 'https://www.java.com/en/', progress: 60 },
  { name: 'Node.js', symbol: 'Node', shadow: 'shadow-lime-400/50', barColor: 'bg-lime-400', url: 'https://nodejs.org/en/docs', progress: 80 },
];

const PROJECTS = [
  {
    title: 'JustDIV',
    description: 'Just Divide is an addictive math puzzle game where strategy meets arithmetic. Drag, drop, and divide tiles to keep the grid clear and beat your high score!',
    demoUrl: 'https://justdiv.vercel.app/#__rq_marker=https://justdiv.vercel.app/',
    sourceUrl: 'https://github.com/souravvpatill/justDivide',
  },
  {
    title: 'Appointment Scheduler',
    description: 'A dynamic, component-based user interface that enables patients to select dates, view real-time availability, and submit booking forms.',
    demoUrl: 'https://drjdpaedia.com/',
    sourceUrl: 'https://github.com/souravvpatill/JDweb',
  },
  {
    title: 'Movie Metro',
    description: 'An interactive movie database browser that uses the TMDB API to display trends, ratings, and detailed film information.',
    demoUrl: '#',
    sourceUrl: '#',
  },
  {
    title: 'Nyeusi Fest Site',
    description: 'A responsive event website for a music and tech festival, designed with pure HTML/CSS and mobile-first principles.',
    demoUrl: '#',
    sourceUrl: '#',
  },
];


// Helper function for smooth scrolling
const scrollToSection = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

// --- REUSABLE ANIMATION COMPONENT (AnimateOnScroll) ---
const AnimateOnScroll = ({ children, className = '', delay = 0, effect = 'fade-in-up' }) => {
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    ref.current.classList.add('is-visible');
                    // Stop observing once visible
                    observer.unobserve(ref.current);
                }
            },
            {
                rootMargin: '0px',
                threshold: 0.1, // Trigger when 10% of the item is visible
            }
        );

        if (ref.current) {
            // Add initial hidden state class
            ref.current.classList.add('hidden-element'); 
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [effect]);

    return (
        <div 
            ref={ref} 
            className={`${className} ${effect}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

// --- NEW COMPONENT: CUSTOM CURSOR ---
const CustomCursor = () => {
    const [isHovering, setIsHovering] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    
    const cursorRef = useRef(null); // Ref for the Outer Ring (Red)
    const dotRef = useRef(null);    // Ref for the Inner Dot (Black/White)

    // State for Interpolation (Fluid Movement)
    const target = useRef({ x: 0, y: 0 }); // The true cursor position
    const current = useRef({ x: 0, y: 0 }); // The ring's smoothed position
    const easing = 0.1; // Control the lag (lower = more lag, for fluid effect)

    // Animation loop using requestAnimationFrame
    const animate = useCallback(() => {
        if (cursorRef.current) {
            // Linear Interpolation: current = current + (target - current) * easing
            current.current.x += (target.current.x - current.current.x) * easing;
            current.current.y += (target.current.y - current.current.y) * easing;

            // Apply smoothed position to the Outer Ring (50x50px, so offset is 25px)
            cursorRef.current.style.transform = `translate3d(${current.current.x - 25}px, ${current.current.y - 25}px, 0)`;
        }

        // Move the Inner Dot instantly with the true target position 
        if (dotRef.current) {
            // Dot size is 10px, so offset is 5px
            dotRef.current.style.transform = `translate3d(${target.current.x - 5}px, ${target.current.y - 5}px, 0)`;
        }

        requestAnimationFrame(animate);
    }, [easing]);


    // Mouse Move Handler: Sets the target position
    const onMouseMove = useCallback((e) => {
        target.current.x = e.clientX;
        target.current.y = e.clientY;
    }, []);
    
    // Click Handler: Triggers the ripple effect
    const onMouseDown = useCallback(() => {
        setIsClicked(true);
        // Timeout to remove the click class, allowing the CSS transition to fade the ripple
        setTimeout(() => setIsClicked(false), 300); 
    }, []);

    useEffect(() => {
        // Start the animation loop
        animate(); 

        // 1. Position Listener
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('click', onMouseDown); // Also treat click as down for touch compatibility

        // 2. Interactive Element Hover Listener
        const interactiveElements = document.querySelectorAll('a, button, [data-cursor-interactive]');
        
        const handleMouseEnter = () => setIsHovering(true);
        const handleMouseLeave = () => setIsHovering(false);

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', handleMouseEnter);
            el.addEventListener('mouseleave', handleMouseLeave);
        });

        // Cleanup
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('click', onMouseDown);
            interactiveElements.forEach(el => {
                el.removeEventListener('mouseenter', handleMouseEnter);
                el.removeEventListener('mouseleave', handleMouseLeave);
            });
        };
    }, [onMouseMove, onMouseDown, animate]);

    // This component is wrapped in a hidden div that only shows the cursor elements
    return (
        <>
            {/* Outer Ring (Halo) - 50x50px, fluid movement */}
            <div 
                ref={cursorRef} 
                className={`custom-cursor-outer ${isHovering ? 'is-hovering' : ''} ${isClicked ? 'is-clicked' : ''}`}
                // High z-index to ensure it is always on top
                style={{ zIndex: 9999 }}
            />
            {/* Inner Dot (Core) - 10x10px, Instant movement */}
            <div 
                ref={dotRef} 
                className={`custom-cursor-inner ${isHovering ? 'is-hovering' : ''}`}
                // High z-index to ensure it is always on top
                style={{ zIndex: 9999 }}
            />
        </>
    );
};


// --- COMPONENTS ---

// 1. Navigation and Header
const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isHoveringLogo, setIsHoveringLogo] = useState(false);

    // Dynamic Tailwind class for Header background and text color
    const headerClasses = `fixed top-0 left-0 w-full z-50 transition-colors duration-300 ease-in-out ${
        isHoveringLogo 
        ? 'bg-gray-900 shadow-xl border-gray-800' 
        : 'bg-white shadow-md border-b border-gray-100'
    }`;
    
    // Dynamic Tailwind class for Logo text color
    const logoTextClasses = `text-2xl font-extrabold cursor-pointer flex items-center font-oswald tracking-wider uppercase transition-colors duration-300 ease-in-out ${
        isHoveringLogo 
        ? 'text-white' 
        : 'text-gray-900'
    }`;
    
    // Dynamic Tailwind class for Hamburger/X icon color
    const iconClasses = isHoveringLogo ? 'text-white' : 'text-gray-900';


    return (
        <header className={headerClasses}>
            <div className="container mx-auto px-6 py-4 flex justify-between items-center max-w-7xl">
                {/* Logo/Name Container - Used for entire hover trigger */}
                <div 
                    className={logoTextClasses}
                    onMouseEnter={() => setIsHoveringLogo(true)}
                    onMouseLeave={() => setIsHoveringLogo(false)}
                    data-cursor-interactive // Added for custom cursor interaction
                >
                    {/* Placeholder for the logo/icon */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mr-2 transition duration-300 ${iconClasses}`}>
                        <path d="M12 2L2 12L12 22L22 12L12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
                    </svg>
                    {/* Text element */}
                    <span className="logo-text-no-effect">
                        sourav
                    </span>
                </div>
                {/* Desktop Navigation Links */}
                <nav className="hidden md:flex space-x-4 font-oswald font-medium">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.id}
                            href={`#${link.id}`}
                            onClick={(e) => {
                                e.preventDefault();
                                scrollToSection(link.id);
                            }}
                            data-cursor-interactive // Added for custom cursor interaction
                            // Inverted Button Style for all Nav Links
                            className="text-white bg-gray-900 border border-gray-900 px-3 py-1 rounded-md text-xs font-bold transition duration-300 hover:bg-white hover:text-gray-900 hover:shadow-md tracking-widest uppercase"
                        >
                            {link.name}
                            
                        </a>
                    ))}
                </nav>
                <div className="md:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`p-2 ${iconClasses}`} data-cursor-interactive>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>
            {/* Mobile Menu */}
            {isMenuOpen && (
                // Mobile menu background and border changes based on logo hover state
                <div className={`md:hidden shadow-xl py-4 transition-colors duration-300 ease-in-out ${
                    isHoveringLogo 
                    ? 'bg-gray-800 border-t border-gray-700' 
                    : 'bg-white border-t border-gray-100'
                }`}>
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.id}
                            href={`#${link.id}`}
                            onClick={(e) => {
                                e.preventDefault();
                                scrollToSection(link.id);
                                setIsMenuOpen(false);
                            }}
                            data-cursor-interactive // Added for custom cursor interaction
                            // Mobile links text color and hover background adjusts for dark mode
                            className={`block px-6 py-2 font-oswald font-medium tracking-widest ${
                                isHoveringLogo 
                                ? 'text-white hover:bg-gray-700' 
                                : 'text-gray-900 hover:bg-gray-100'
                            }`}
                        >
                            {link.name}
                        </a>
                    ))}
                </div>
            )}
        </header>
    );
};

// Rotating animation component 
const RotatingText = ({ phrases }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [speed, setSpeed] = useState(70);

    const typingSpeed = 70;
    const deletingSpeed = 40;
    const pauseTime = 1500;

    useEffect(() => {
        const currentPhrase = phrases[phraseIndex % phrases.length];
        let timer;

        const handleType = () => {
            setDisplayedText(prev => currentPhrase.substring(0, prev.length + 1));
            setSpeed(typingSpeed);
        };

        const handleDelete = () => {
            setDisplayedText(prev => currentPhrase.substring(0, prev.length - 1));
            setSpeed(deletingSpeed);
        };

        if (isDeleting) {
            if (displayedText.length > 0) {
                timer = setTimeout(handleDelete, speed);
            } else {
                setIsDeleting(false);
                setPhraseIndex(prev => prev + 1);
                setSpeed(typingSpeed);
            }
        } else {
            if (displayedText.length < currentPhrase.length) {
                timer = setTimeout(handleType, speed);
            } else {
                // Done typing the current phrase, pause, then start deleting
                timer = setTimeout(() => {
                    setIsDeleting(true);
                }, pauseTime);
            }
        }

        return () => clearTimeout(timer);
    }, [displayedText, isDeleting, phraseIndex, phrases, speed]);

    return (
        <span className="inline-block relative">
            {displayedText}
            {/* Blinking cursor */}
            <span className="animate-blink inline-block w-1 h-full bg-gray-900 absolute top-0 right-[-0.5rem] mt-2"></span>
        </span>
    );
};

// 2. Hero Section 
const HeroSection = () => {
    const [imageLoaded, setImageLoaded] = useState(false);
    
    useEffect(() => {
        const timer = setTimeout(() => setImageLoaded(true), 500); 
        return () => clearTimeout(timer);
    }, []);

    return (
        <section id="hero" className="min-h-screen pt-20 flex items-center bg-white relative overflow-hidden">
            {/* Custom Animation and Font Styles & CUSTOM CURSOR STYLES */}
            <style>{`
                /* Load Fonts: Oswald (Bold/Title) and Sacramento (Cursive/Logo Hover) */
                @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@200..700&family=Sacramento&display=swap');
                .font-oswald { font-family: 'Oswald', sans-serif; }
                
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
                .animate-blink { animation: blink 0.7s infinite step-end; }

                /* Keyframe animation for sliding background */
                @keyframes slide {
                    from { background-position-x: 0%; }
                    to { background-position-x: 100%; }
                }
                
                .fade-in-image {
                    transition: opacity 1.5s ease-out;
                    opacity: 0;
                }
                .fade-in-image.loaded {
                    opacity: 1;
                }
                
                /* Cursor thickness fix */
                .animate-blink {
                    width: 0.15rem !important; 
                }

                /* --- SCROLL REVEAL ANIMATIONS --- */

                /* Initial Hidden State */
                .hidden-element {
                    opacity: 0;
                }

                /* Transition Properties */
                .fade-in-up, .fade-in-left {
                    transition: opacity 1.0s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1.0s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }

                /* Fade In Up (Translate Y) */
                .fade-in-up {
                    transform: translateY(30px);
                }
                .fade-in-up.is-visible {
                    opacity: 1;
                    transform: translateY(0);
                }

                /* Fade In Left (Translate X) */
                .fade-in-left {
                    transform: translateX(-30px);
                }
                .fade-in-left.is-visible {
                    opacity: 1;
                    transform: translateX(0);
                }
                /* --- END SCROLL REVEAL ANIMATIONS --- */

                /* --- LOGO HOVER ANIMATION (Removed Cursive) --- */
                .logo-text-no-effect {
                    font-family: 'Oswald', sans-serif;
                    text-transform: uppercase;
                    letter-spacing: 0.05em; 
                    font-size: 1.5rem; 
                    transform: translateY(0);
                    display: inline-block;
                }
                
                /* --- CUSTOM CURSOR STYLES (Black, White, Red) --- */
                /* 1. Hide default cursor */
                body, button, a, [data-cursor-interactive] {
                    cursor: none !important;
                }

                /* 2. Outer Ring (Halo) - Default: Red Border, Fluid Follow (50x50px) */
                .custom-cursor-outer {
                    position: fixed;
                    pointer-events: none;
                    top: 0;
                    left: 0;
                    width: 50px;
                    height: 50px; 
                    border-radius: 50%;
                    border: 2px solid #FF0000; /* Default: Red Border */
                    background-color: transparent;
                    /* Transition for scaling/color change (Movement is JS-controlled) */
                    transition: 
                        width 0.3s ease-out, 
                        height 0.3s ease-out, 
                        background-color 0.3s ease-out, 
                        border-color 0.1s ease-out,
                        box-shadow 0.3s ease-out;
                    will-change: transform; /* Performance optimization */
                }

                /* 3. Inner Dot (Core) - Default: Black Fill, Direct Follow (Now 10x10px) */
                .custom-cursor-inner {
                    position: fixed;
                    pointer-events: none;
                    top: 0;
                    left: 0;
                    width: 10px; /* INCREASED SIZE */
                    height: 10px; /* INCREASED SIZE */
                    border-radius: 50%;
                    background-color: #000000; /* Default: Black Core */
                    /* Transition for quick opacity change */
                    transition: opacity 0.3s ease-out, transform 0.01s linear;
                    will-change: transform; /* Performance optimization */
                }

                /* 4. Interactive State (on hover) - Shrink outer ring to dot size (10px) */
                .custom-cursor-outer.is-hovering {
                    width: 10px; /* Match inner dot size */
                    height: 10px;
                    background-color: #FF0000; /* Solid Red Fill */
                    border-color: #FF0000; /* Red Border */
                }

                .custom-cursor-inner.is-hovering {
                    opacity: 0; /* Hide the inner dot */
                }

                /* 5. Clicked State (Ripple Effect) - NOW GRAY RIPPLE */
                .custom-cursor-outer.is-clicked {
                    /* Ripple visual effect: Gray border + expanding gray shadow */
                    border-color: #AAAAAA !important; /* Changed from #ffffff to Gray */
                    /* Increased spread and opacity for a more visible ripple */
                    box-shadow: 0 0 0 10px rgba(170, 170, 170, 0.7), /* Inner ripple - Changed from 255 to 170 */
                                0 0 0 30px rgba(170, 170, 170, 0.3); /* Outer ripple - Changed from 255 to 170 */
                }

            `}</style>
            
            {/* Full-Width Background Layer (The scrolling map) */}
            <div 
                className="absolute inset-0 w-full h-full pointer-events-none z-0 bg-left-top bg-repeat-x"
                style={{
                    backgroundImage: 'url("https://tse2.mm.bing.net/th/id/OIP.3o0Ed8f_fSeb9gL1rJjbHQHaEy?pid=Api&P=0&h=180")', // Light gray map texture
                    opacity: 0.15, 
                    // Make the background image twice as wide as the container to zoom it and allow scrolling
                    backgroundSize: '200% 100%', 
                    // Apply the slide animation
                    animation: 'slide 60s linear infinite', 
                }}
            ></div>

            {/* Centered Content Wrapper (Text and Image) */}
            <div className="container mx-auto px-6 max-w-7xl h-full flex flex-col md:flex-row relative z-10">
            
                {/* 1. Left Section: Text Content */}
                <div className="w-full md:w-3/5 lg:w-3/5 py-12 md:py-32 relative flex items-center text-gray-900">

                    <div className="space-y-6 relative z-20 max-w-lg pt-10">
                        <AnimateOnScroll delay={0} effect="fade-in-left">
                            {/* Increased text size */}
                            <p className="text-4xl font-oswald font-extrabold text-gray-700 tracking-widest">HI, I'M</p>
                        </AnimateOnScroll>
                    
                        <AnimateOnScroll delay={200} effect="fade-in-left">
                            <h1 className="text-7xl lg:text-8xl font-oswald font-extrabold text-gray-900 leading-none tracking-tighter uppercase min-h-24">
                                {/* Rotating Animation for Name and Titles */}
                                <RotatingText phrases={ROTATING_PHRASES} />
                            </h1>
                        </AnimateOnScroll>
                    
                        <AnimateOnScroll delay={400} effect="fade-in-left">
                            <p className="text-lg text-gray-700 max-w-sm pt-4">
                                I build modern, responsive websites and digital interfaces.
                                Passionate about clean design, smooth interactions, and bringing ideas to life on the web.
                            </p>
                        </AnimateOnScroll>
                    </div>

                </div>
            
                {/* 2. Right Section: Image & Diagonal Cutout */}
                <div className="w-full md:w-2/5 lg:w-2/5 relative flex items-center justify-end">
                    
                    {/* NEW CLIP PATH: Changed from polygon(35% 0%, ...) to polygon(50% 0%, ...) and (0% 100%) to (15% 100%) */}
                    <div 
                        className="absolute inset-0 bg-gray-900 overflow-hidden"
                        style={{ clipPath: 'polygon(5% 0%, 15% 3%, 30% 0%, 45% 4%, 60% 0%, 75% 5%, 95% 0%, 100% 20%, 97% 35%, 100% 55%, 98% 70%, 100% 90%, 80% 100%, 65% 97%, 50% 100%, 35% 96%, 20% 100%, 8% 97%, 0% 100%, 0% 75%, 3% 60%, 0% 45%, 4% 30%, 0% 15%)'
 }}
                    >
                        {/* Image Placeholder - Full-screen background style with fade-in animation */}
                        <img 
                            src="https://image2url.com/images/1765027461616-9a54c204-a23e-43fc-90af-996896aca4b3.jpg" 
                            alt="Sourav Professional Portrait" 
                            // The image now fills the clipped area
                            className={`w-full h-full object-cover grayscale opacity-80 fade-in-image ${imageLoaded ? 'loaded' : ''}`}
                            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/800x1200/444444/FFFFFF?text=Portrait+Placeholder"; }}
                        />
                    </div>
                    
                    {/* The small floating navigation circle from the image */}
                    <div className="absolute bottom-16 left-1/4 transform -translate-x-1/2 w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-white z-10 hidden md:flex"
                        data-cursor-interactive // Added for custom cursor interaction
                    >
                        <svg className="w-2 h-2 fill-current" viewBox="0 0 6 6"><circle cx="3" cy="3" r="3" /></svg>
                    </div>

                </div>
            </div>
        </section>
    );
};

// New Services Section based on the reference image
const ServicesSection = () => (
    <div className="mt-12 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SERVICES.map((service, index) => {
                const IconComponent = service.icon;
                return (
                    <AnimateOnScroll key={index} delay={index * 150} effect="fade-in-up">
                        {/* Service cards already have a great hover effect (dark to light/inverse) */}
                        <div 
                            className="group bg-gray-900 text-white p-6 md:p-8 rounded-xl shadow-2xl h-full flex flex-col justify-between 
                                       transition-all duration-300 border border-gray-800 hover:bg-white hover:border-gray-900 
                                       hover:text-gray-900 hover:scale-[1.02]"
                        >
                            {/* Icon updates color to black on hover */}
                            <IconComponent 
                                size={40} 
                                className="mb-4 text-gray-300 transition-colors duration-300 group-hover:text-gray-900" 
                            />
                            <h4 className="text-xl font-oswald font-bold uppercase tracking-wider mb-2">{service.title}</h4>
                            {/* Description text updates color to dark gray on hover */}
                            <p className="text-gray-400 text-sm transition-colors duration-300 group-hover:text-gray-700">
                                {service.description}
                            </p>
                        </div>
                    </AnimateOnScroll>
                );
            })}
        </div>
    </div>
);


// 3. Interactive Skills Cloud Component (Redesigned for Faceted/Hexagonal look)
const SkillsSectionBackground = () => {
  return (
    <AnimateOnScroll delay={0}>
      {/* Define Keyframes, Hexagonal Shape, and Rugged Texture */}
      <style>{`
        /* Floating animation (Made more Dynamic!) */
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-15px) rotate(8deg); } /* Increased range and rotation */
          50% { transform: translateY(-30px) rotate(-8deg); } /* Increased range and rotation */
          75% { transform: translateY(-15px) rotate(8deg); } /* Increased range and rotation */
        }
        
        /* Defines the hexagonal shape and applies the rugged texture styling */
        .skill-hexagon {
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
          animation: float 8s ease-in-out infinite; /* Reduced duration from 10s to 8s for faster motion */
          
          /* Rugged Texture Styling */
          /* Note: Background color is now controlled by Tailwind classes: bg-gray-800 */
          border: 1px solid rgba(255, 255, 255, 0.3); /* Defined, lighter border */
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.05); /* Subtle inner glow */
          filter: saturate(1.2) contrast(1.1); /* Boost contrast/saturation for a rugged, defined look */

          transform-origin: 50% 50%; 
          transition: all 0.5s ease-in-out;
        }
        /* Specific hover effects for the hexagon */
        .skill-hexagon:hover {
            filter: saturate(1.5) contrast(1.2);
            /* Remove border on hover for a cleaner block color look */
            border-color: transparent;
        }
      `}</style>

      {/* Background Image Container (City Skyline) */}
      <div 
        className="relative w-full py-20 bg-gray-900 border-t border-gray-800"
        style={{
          backgroundImage: 'url("https://i.pinimg.com/originals/db/52/81/db5281bf9f27e5f1a8c7dbd4fd6ef315.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          // Increased brightness to make the background visible
          filter: 'grayscale(100%) brightness(0.7)',
        }}
      >
        {/* Dark overlay - Reduced opacity */}
        <div className="absolute inset-0 bg-gray-900 opacity-50"></div> 

        <div className="container mx-auto px-6 max-w-7xl relative z-10 text-white">
          <p className="text-sm font-oswald font-semibold tracking-widest uppercase text-gray-500 mb-2">MY SKILLS</p>
          <h2 className="text-5xl font-oswald font-extrabold mb-12 uppercase">Technologies.</h2>

          {/* Hexagonal Skills Grid - Adjusted for better responsiveness and density */}
          <div className="flex justify-center items-center py-10">
            <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-10 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
              {USER_DEFINED_SKILLS.map((lang, index) => (
                // Wrapper to manage the hover group and position the name below
                <div key={lang.name} className="relative group flex flex-col items-center">
                    
                    {/* Anchor Tag wraps the Hexagon to make it clickable */}
                    <a 
                        href={lang.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        title={`Visit ${lang.name} documentation`}
                        data-cursor-interactive // Added for custom cursor interaction
                        // Transform scale must be here or on the hexagon itself
                        className="block transition duration-500 transform group-hover:scale-110" 
                    >
                        <div 
                        // Fluid sizing: slightly smaller on mobile, growing on larger screens
                        className={`skill-hexagon w-14 h-16 sm:w-16 sm:h-20 lg:w-20 lg:h-24 flex items-center justify-center 
                                    font-oswald font-bold text-sm sm:text-base relative cursor-pointer 
                                    
                                    /* Default Dark State */
                                    bg-gray-800 text-white border-gray-700 
                                    
                                    /* Forced White/Black Hover State */
                                    group-hover:bg-white group-hover:text-gray-900`}
                        style={{ animationDelay: `${index * 0.4}s` }}
                        >
                        {/* Symbol text is slightly larger and bolder */}
                        <span className="relative z-10 text-center leading-tight drop-shadow-lg p-1 text-base sm:text-xl">{lang.symbol}</span>
                        {/* Accent Glow on Hover */}
                        <div className={`absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 ${lang.shadow} blur-xl group-hover:opacity-60`}></div>
                        </div>
                    </a>

                    {/* NEW: Progress Bar Element (Line) - Appears on hover */}
                    <div className="absolute top-[calc(100%+0.1rem)] w-full max-w-[80%] h-0.5 bg-gray-700 rounded-full overflow-hidden 
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div 
                            className={`h-full rounded-full transition-all duration-700 ease-out ${lang.barColor}`} 
                            style={{ width: `${lang.progress}%` }} 
                        ></div>
                    </div>

                    {/* UPDATED: Full Name and Progress Display (Text) - Appears on hover */}
                    <div className="absolute top-[calc(100%+0.6rem)] text-xs sm:text-sm font-oswald font-semibold uppercase tracking-wider 
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none text-center max-w-full"
                    >
                        {lang.name} <span className="text-gray-400 font-light ml-1">({lang.progress}%)</span>
                    </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AnimateOnScroll>
  );
};

// 4. About and Experience Section
const AboutSection = () => (
  <section id="about" className="py-20 bg-white border-t border-gray-100 text-gray-900">
    <div className="container mx-auto px-6 max-w-7xl">
        {/* Title and Intro Text */}
        <AnimateOnScroll delay={0} effect="fade-in-up">
            <p className="text-sm font-oswald font-semibold tracking-widest uppercase text-gray-500 mb-2">INTRODUCTION</p>
        </AnimateOnScroll>
        <AnimateOnScroll delay={100} effect="fade-in-up">
            <h2 className="text-5xl font-oswald font-extrabold mb-12 uppercase">Overview.</h2>
        </AnimateOnScroll>
        <AnimateOnScroll delay={200} effect="fade-in-up">
            <p className="text-lg text-gray-700 max-w-3xl mb-12">
            I work across several domains, including full-stack web development, AI-powered applications, and user-centric digital tools. My projects often blend clean interfaces with strong backend systems, integrating features like automation, recognition models, real-time data handling, and secure user workflows. I enjoy building solutions that are practical, efficient, and meaningful in real-world use.
            </p>
        </AnimateOnScroll>
        
        {/* Services Cards */}
        <ServicesSection />

      {/* Skills Component */}
      <SkillsSectionBackground />

      {/* Resume Download Button */}
      <AnimateOnScroll delay={0} effect="fade-in-up">
        <div className="text-center mt-12">
            <a 
            href="https://pdflink.to/ff3cb534/" 
            download 
            data-cursor-interactive // Added for custom cursor interaction
            // Dark to Light Inversion
            className="inline-flex items-center px-10 py-4 bg-gray-900 text-white font-oswald font-bold rounded-lg border-2 border-gray-900 shadow-xl transition duration-300 hover:bg-white hover:text-gray-900 hover:border-gray-900 transform hover:scale-[1.02] uppercase tracking-widest"
            >
            <Download size={20} className="mr-3" /> Download Resume
            </a>
        </div>
      </AnimateOnScroll>
    </div>
  </section>
);


// 5. Projects Section
const ProjectsSection = () => (
  <section id="projects" className="py-20 bg-gray-50 border-t border-gray-200 text-gray-900">
    <div className="container mx-auto px-6 max-w-7xl">
        <AnimateOnScroll delay={0} effect="fade-in-up">
            <p className="text-sm font-oswald font-semibold tracking-widest uppercase text-gray-500 mb-2">My Work</p>
        </AnimateOnScroll>
        <AnimateOnScroll delay={100} effect="fade-in-up">
            <h2 className="text-5xl font-oswald font-extrabold mb-12 uppercase">Projects.</h2>
        </AnimateOnScroll>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {PROJECTS.map((project, index) => (
          <AnimateOnScroll 
            key={index} 
            delay={index * 150 + 200} // Staggered delay for project cards
            effect="fade-in-up"
          >
            <article 
              className="bg-white p-8 rounded-xl border border-gray-200 shadow-lg group transition duration-500 hover:shadow-gray-400/30"
            >
              <h3 className="text-3xl font-oswald font-bold mb-3">{project.title}</h3>
              <p className="text-gray-700 mb-6">{project.description}</p>
              <div className="flex space-x-4">
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-interactive // Added for custom cursor interaction
                  // Live Demo button performs Dark to Light Inversion
                  className="inline-flex items-center px-4 py-2 bg-gray-900 text-white font-oswald font-semibold rounded-lg border-2 border-gray-900 transition duration-300 hover:bg-white hover:text-gray-900 hover:border-gray-900 transform hover:scale-[1.02] uppercase text-sm tracking-widest"
                >
                  <ExternalLink size={20} className="mr-2" /> Live Demo
                </a>
                <a
                  href={project.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-interactive // Added for custom cursor interaction
                  // Source Code button (light to dark inversion)
                  className="inline-flex items-center px-4 py-2 border-2 border-gray-500 text-gray-900 font-oswald font-semibold rounded-lg transition duration-300 hover:bg-gray-900 hover:text-white hover:border-gray-900 transform hover:scale-[1.02] uppercase text-sm tracking-widest"
                >
                  <Github size={20} className="mr-2" /> Source Code
                </a>
              </div>
            </article>
          </AnimateOnScroll>
        ))}
      </div>
    </div>
  </section>
);

// 6. Contact Section
const ContactSection = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Sending message...');
    
    setTimeout(() => {
      setStatus('Message Sent Successfully!');
      setName('');
      setEmail('');
      setMessage('');
    }, 1500);
  };

  return (
    <section id="contact" className="py-20 bg-white border-t border-gray-200 text-gray-900">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <AnimateOnScroll delay={0} effect="fade-in-up">
            <p className="text-sm font-oswald font-semibold tracking-widest uppercase text-gray-500 mb-2">Let's Connect</p>
        </AnimateOnScroll>
        <AnimateOnScroll delay={100} effect="fade-in-up">
            <h2 className="text-5xl font-oswald font-extrabold mb-12 uppercase">Contact.</h2>
        </AnimateOnScroll>
        <AnimateOnScroll delay={200} effect="fade-in-up">
            <p className="text-lg text-gray-700 mb-12">
            I am currently available for new opportunities. Feel free to send me a message!
            </p>
        </AnimateOnScroll>

        <AnimateOnScroll delay={300} effect="fade-in-up">
            <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 p-8 rounded-xl shadow-lg border border-gray-200">
            <div>
                <input
                type="text"
                placeholder="YOUR NAME"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-4 rounded-lg bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition duration-300 placeholder-gray-500 font-oswald tracking-wider uppercase"
                />
            </div>
            <div>
                <input
                type="email"
                placeholder="YOUR EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-4 rounded-lg bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition duration-300 placeholder-gray-500 font-oswald tracking-wider uppercase"
                />
            </div>
            <div>
                <textarea
                placeholder="YOUR MESSAGE"
                rows="6"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="w-full p-4 rounded-lg bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition duration-300 placeholder-gray-500 resize-none font-oswald tracking-wider uppercase"
                ></textarea>
            </div>
            <button
                type="submit"
                data-cursor-interactive // Added for custom cursor interaction
                // Contact button (dark to slightly lighter dark)
                className="w-full md:w-auto inline-flex items-center justify-center px-10 py-4 bg-gray-900 text-white font-oswald font-bold rounded-lg hover:bg-gray-700 transition duration-300 transform hover:scale-[1.02] uppercase tracking-widest"
            >
                Send Message <Mail size={20} className="ml-2" />
            </button>
            {status && <p className={`mt-4 ${status.includes('Successfully') ? 'text-gray-900' : 'text-red-500'} font-oswald`}>{status}</p>}
            </form>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

// 7. Footer
const Footer = () => (
  <footer className="bg-gray-900 border-t border-gray-800 py-6">
    <div className="container mx-auto px-6 text-center text-gray-500">
      <p className="font-oswald tracking-wider">&copy; {new Date().getFullYear()} Sourav. All rights reserved.</p>
      <p className="text-sm mt-2">Built with React and Tailwind CSS</p>
    </div>
  </footer>
);


// --- MAIN APP COMPONENT ---
export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // We force the document background to white for this specific design
    document.documentElement.classList.remove('dark');
  }, []);


  return (
    <div className="min-h-screen font-sans bg-white text-gray-900"> 
        {/* Load the Oswald (existing) and Sacramento (new cursive) fonts here (Re-added) */}
        <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@200..700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Sacramento&display=swap" rel="stylesheet" />
        
        {/* CUSTOM CURSOR - Must be rendered above everything else */}
        <CustomCursor />
        
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
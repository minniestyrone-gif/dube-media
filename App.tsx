import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Users, 
  MapPin, 
  Star, 
  ArrowRight, 
  Check, 
  Instagram, 
  Facebook, 
  Linkedin,
  Menu,
  X,
  Play,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

// --- Types ---

interface ServiceDetail {
  title: string;
  description: string;
  longDescription: string;
  services: string[];
  icon: React.ReactNode;
  image: string;
}

// --- Helper Functions ---

const scrollToId = (id: string) => {
  const element = document.getElementById(id.replace('#', ''));
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  } else if (id === 'home' || id === '#home') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

// --- Components ---

/**
 * A camera icon that "flashes" like a real camera when scrolled into view.
 */
const CameraFlashIcon: React.FC<{ size?: number; className?: string; iconClassName?: string }> = ({ size = 20, className = "", iconClassName = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.8, once: false });
  const [flashTrigger, setFlashTrigger] = useState(0);

  // Trigger flash whenever it comes back into view
  useEffect(() => {
    if (isInView) {
      setFlashTrigger(prev => prev + 1);
    }
  }, [isInView]);

  return (
    <div ref={ref} className={`relative inline-flex items-center justify-center ${className}`}>
      <Camera size={size} className={iconClassName} />
      
      {/* Shutter/Flash Animation Layer */}
      <AnimatePresence mode="wait">
        <motion.div
          key={flashTrigger}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isInView ? { 
            opacity: [0, 1, 0], 
            scale: [0.8, 2.2],
            filter: ["brightness(1) blur(0px)", "brightness(3) blur(4px)", "brightness(1) blur(0px)"]
          } : {}}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute inset-0 bg-white rounded-full pointer-events-none z-10 mix-blend-screen"
        />
      </AnimatePresence>
      
      {/* Lens Flare Streak */}
      <AnimatePresence>
        {isInView && (
          <motion.div
            key={`flare-${flashTrigger}`}
            initial={{ opacity: 0, width: 0 }}
            animate={{ 
              opacity: [0, 0.7, 0],
              width: ["0%", "300%", "0%"],
              rotate: [45, 45, 45]
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute h-[1px] bg-blue-100/50 blur-[1px] pointer-events-none z-20"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const Navbar: React.FC<{ isDark: boolean; toggleTheme: () => void }> = ({ isDark, toggleTheme }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Testimonials', href: '#testimonials' },
  ];

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    scrollToId(href);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? (isDark ? 'bg-[#050505]/90' : 'bg-white/90') + ' backdrop-blur-md py-4 shadow-xl' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
        <button 
          onClick={(e) => handleLinkClick(e, 'home')}
          className={`text-xl sm:text-2xl font-serif font-bold tracking-tighter flex items-center gap-2 hover:opacity-80 transition-opacity outline-none ${isDark ? 'text-white' : 'text-black'}`}
        >
          <div className={`w-7 h-7 sm:w-8 h-8 ${isDark ? 'bg-white' : 'bg-black'} rounded-full flex items-center justify-center overflow-hidden`}>
            <CameraFlashIcon size={16} iconClassName={isDark ? 'text-black' : 'text-white'} />
          </div>
          Photography <span className="text-[#D4AF37]">to Remember</span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              onClick={(e) => handleLinkClick(e, link.href)}
              className={`text-xs font-medium transition-colors uppercase tracking-widest cursor-pointer ${isDark ? 'hover:text-white/70 text-white' : 'hover:text-black/70 text-black'}`}
            >
              {link.name}
            </a>
          ))}
          
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${isDark ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-black/5 text-black hover:bg-black/10'}`}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
           <button 
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all ${isDark ? 'text-white' : 'text-black'}`}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className={`p-2 ${isDark ? 'text-white' : 'text-black'}`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`absolute top-full left-0 right-0 p-6 border-b flex flex-col gap-4 md:hidden shadow-2xl ${isDark ? 'bg-[#050505] border-white/10 text-white' : 'bg-white border-black/10 text-black'}`}
          >
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={(e) => handleLinkClick(e, link.href)}
                className={`text-lg font-medium border-b pb-2 uppercase tracking-widest ${isDark ? 'border-white/5' : 'border-black/5'}`}
              >
                {link.name}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const FloatingWidget: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className = "", delay = 0 }) => {
  return (
    <motion.div 
      initial={{ y: 0 }}
      animate={{ y: [-10, 10, -10] }}
      transition={{ 
        duration: 5, 
        repeat: Infinity, 
        ease: "easeInOut",
        delay 
      }}
      className={`glass-dark rounded-2xl p-4 shadow-2xl backdrop-blur-xl border border-white/10 ${className}`}
    >
      {children}
    </motion.div>
  );
};

const Hero: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  return (
    <section id="home" className={`relative min-h-[90vh] sm:min-h-screen flex items-center pt-24 pb-12 overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#050505]' : 'bg-gray-50'}`}>
      {/* Background Decor */}
      <div className={`absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 ${isDark ? 'bg-white/5' : 'bg-black/5'} rounded-full blur-[80px] sm:blur-[120px]`} />
      <div className={`absolute bottom-1/4 right-1/4 w-80 h-80 sm:w-[500px] sm:h-[500px] ${isDark ? 'bg-white/5' : 'bg-black/5'} rounded-full blur-[100px] sm:blur-[150px]`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="z-10 text-center lg:text-left"
        >
          <h1 className={`text-4xl sm:text-6xl md:text-8xl font-serif font-bold mb-6 sm:mb-8 leading-[1.1] sm:leading-[0.9] ${isDark ? 'text-white' : 'text-black'}`}>
            Capture <br />
            <span className={`${isDark ? 'text-white/40' : 'text-black/30'} italic`}>the essence</span> <br />
            of a Moment.
          </h1>
          <p className={`text-base sm:text-lg ${isDark ? 'text-white/60' : 'text-black/60'} max-w-lg mx-auto lg:mx-0 mb-8 sm:mb-10 font-light leading-relaxed`}>
            Photography to Remember specializes in capturing the precious milestones of your life—from timeless weddings and maternity glow to the warmth of family and group celebrations. We don't just take photos; we preserve your legacy.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6">
            <button 
              onClick={() => scrollToId('about')}
              className={`w-full sm:w-auto px-8 py-4 rounded-full font-bold text-base sm:text-lg hover:scale-105 transition-all flex items-center justify-center gap-2 group ${isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90'}`}
            >
              About Us <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            {/* Our Services Button with Rotating Light Beam */}
            <div className="relative group p-[2px] rounded-full overflow-hidden w-full sm:w-auto">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_120deg,#facc15_180deg,transparent_240deg,transparent_360deg)] opacity-60 group-hover:opacity-100 group-hover:duration-1000 blur-[2px]"
              />
              <button 
                onClick={() => scrollToId('services')}
                className={`relative z-10 w-full px-8 py-4 rounded-full font-bold text-base sm:text-lg transition-all flex items-center justify-center ${isDark ? 'bg-[#050505] text-white hover:bg-white/5' : 'bg-white text-black hover:bg-black/5'}`}
              >
                Our Services
              </button>
            </div>
          </div>
        </motion.div>

        <div className="relative h-[400px] sm:h-[600px] hidden lg:block">
          {/* Main Hero Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className={`w-full h-full rounded-[40px] overflow-hidden border shadow-2xl ${isDark ? 'border-white/10' : 'border-black/10'}`}
          >
            <img 
              src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1200" 
              className={`w-full h-full object-cover brightness-75 hover:grayscale-0 transition-all duration-1000 ${isDark ? 'grayscale' : ''}`}
              alt="Street Photography"
            />
          </motion.div>

          {/* Floating Widgets */}
          <FloatingWidget className={`absolute top-20 -left-12 max-w-[200px] ${isDark ? 'glass-dark border-white/10' : 'bg-white/80 border-black/10 backdrop-blur-md'}`} delay={0}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${isDark ? 'bg-white/10' : 'bg-black/10'} rounded-full flex items-center justify-center overflow-hidden`}>
                <CameraFlashIcon size={20} iconClassName={isDark ? 'text-white' : 'text-black'} />
              </div>
              <div>
                <div className={`text-xs ${isDark ? 'text-white/50' : 'text-black/50'}`}>Clients</div>
                <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-black'}`}>100+ Happy</div>
              </div>
            </div>
          </FloatingWidget>

          <FloatingWidget className={`absolute bottom-16 -right-8 max-w-[240px] ${isDark ? 'glass-dark border-white/10' : 'bg-white/80 border-black/10 backdrop-blur-md'}`} delay={1.5}>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className={`text-xs ${isDark ? 'text-white/50' : 'text-black/50'} uppercase tracking-widest`}>Recent Shoot</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
              <div className="flex items-center gap-3">
                <img src="https://picsum.photos/id/64/100/100" className="w-10 h-10 rounded-lg object-cover" />
                <div>
                  <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-black'}`}>Clifton 4th</div>
                  <div className={`text-[10px] ${isDark ? 'text-white/40' : 'text-black/40'}`}>24 Photos Edited</div>
                </div>
              </div>
            </div>
          </FloatingWidget>
        </div>
      </div>
    </section>
  );
};

const AboutSection: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  // Wedding rings image for the Story section
  const fixedStoryImage = "https://www.fhinds.co.uk/Admin/Images/Editor/Blog/2020/WeddingBlogUpdates/WeddingRings.jpg";

  return (
    <section id="about" className={`min-h-screen flex items-center py-16 sm:py-24 transition-colors duration-500 relative overflow-hidden ${isDark ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative group order-2 md:order-1">
            <div className={`absolute -inset-2 sm:-inset-4 rounded-[32px] sm:rounded-[40px] blur-xl sm:blur-2xl transition-colors ${isDark ? 'bg-white/5 group-hover:bg-white/10' : 'bg-black/5 group-hover:bg-black/10'}`} />
            
            <div className={`absolute -top-6 -left-6 sm:-top-10 sm:-left-10 p-4 sm:p-8 rounded-2xl sm:rounded-3xl z-20 ${isDark ? 'glass border border-white/10' : 'bg-gray-100/80 border border-black/10 backdrop-blur-md'}`}>
              <div className={`text-3xl sm:text-5xl font-serif font-bold mb-1 sm:mb-2 ${isDark ? 'text-white/90' : 'text-black/90'}`}>Est.</div>
              <div className={`text-[10px] sm:text-sm uppercase tracking-widest ${isDark ? 'text-white/60' : 'text-black/60'}`}>Established <br className="hidden sm:block" />2024</div>
            </div>

            <div className={`relative overflow-hidden rounded-[24px] sm:rounded-[32px] border shadow-2xl aspect-[4/5] ${isDark ? 'border-white/10 bg-neutral-900' : 'border-black/10 bg-gray-200'}`}>
              <img 
                src={fixedStoryImage} 
                className={`w-full h-full object-cover brightness-90 group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100 ${isDark ? 'grayscale' : ''}`}
                alt="Photography to Remember story"
              />
              <div className={`absolute inset-0 pointer-events-none ${isDark ? 'bg-gradient-to-t from-black/60 to-transparent' : 'bg-gradient-to-t from-gray-900/20 to-transparent'}`} />
            </div>
          </div>
          
          <div className="relative order-1 md:order-2">
            <h2 className={`text-[10px] font-bold uppercase tracking-[0.3em] mb-3 sm:mb-4 ${isDark ? 'text-white/40' : 'text-black/40'}`}>The Story</h2>
            <h3 className={`text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-6 sm:mb-8 leading-tight ${isDark ? 'text-white' : 'text-black'}`}>Preserving Life's Most Beautiful Chapters.</h3>
            <p className={`text-base sm:text-lg leading-relaxed mb-4 sm:mb-6 font-light ${isDark ? 'text-white/60' : 'text-black/60'}`}>
              Photography to Remember is more than just a lens; it's a witness to your most precious milestones. From the whispered "I do" of a wedding day to the glowing anticipation of a new life, we specialize in capturing the raw emotion and timeless beauty of your family's journey.
            </p>
            <p className={`text-base sm:text-lg leading-relaxed mb-6 sm:mb-10 font-light ${isDark ? 'text-white/60' : 'text-black/60'}`}>
              Whether it's a tender maternity session, a joyful family reunion, or a celebratory group portrait, we believe that every connection deserves to be immortalized. We create visual heirlooms that allow you to relive your most cherished stories for generations to come.
            </p>
            
            <div className="flex sm:justify-start">
              <FloatingWidget className={`p-3 sm:p-4 w-full sm:w-auto ${isDark ? 'border-white/20' : 'bg-black/5 border-black/10'}`} delay={0.8}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center overflow-hidden ${isDark ? 'bg-white/10' : 'bg-black/10'}`}>
                    <Star className={`w-4 h-4 sm:w-5 sm:h-5 ${isDark ? 'text-white fill-white' : 'text-black fill-black'}`} />
                  </div>
                  <div className={`text-sm sm:text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>100+ Happy Clients</div>
                </div>
              </FloatingWidget>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ServicesSection: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const [selectedService, setSelectedService] = useState<ServiceDetail | null>(null);

  const services: ServiceDetail[] = [
    {
      title: "Wedding Stories",
      description: "Capturing the magic and raw emotion of your most significant 'I do'.",
      longDescription: "From intimate elopements to grand celebrations, we provide comprehensive, cinematic documentation of your wedding day. We focus on the unscripted moments, the tears of joy, and the electric energy of your love story.",
      services: [
        "Full Day Coverage",
        "Engagement Sessions",
        "Intimate Elopements",
        "Premium Photobooks",
        "Cinematic Highlight Reels"
      ],
      icon: <Camera className="w-6 h-6" />,
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Family & Maternity",
      description: "Celebrating the miracle of new life and the warmth of family bonds.",
      longDescription: "We specialize in reveling the authentic connection within your family. Whether it's the glowing anticipation of maternity or the joyful chaos of a growing family, we create visual heirlooms that your children will cherish.",
      services: [
        "Maternity Milestones",
        "Newborn & Infant Sessions",
        "Timeless Family Portraits",
        "Generational Group Shoots",
        "Home Lifestyle Sessions"
      ],
      icon: <Users className="w-6 h-6" />,
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Group Celebrations",
      description: "Vibrant snapshots of joy shared with your favorite people.",
      longDescription: "Life is meant to be celebrated together. We capture the pulse of reunions, anniversaries, and milestones with a focus on group dynamics and the shared laughter that defines your inner circle.",
      services: [
        "Birthday Group Portraits",
        "Anniversary Documentaries",
        "Family Reunion Highlights",
        "Bridal & Baby Showers",
        "Graduation Celebrations"
      ],
      icon: <Users className="w-6 h-6" />,
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <section id="services" className={`min-h-screen flex items-center py-16 sm:py-24 transition-colors duration-500 ${isDark ? 'bg-[#050505]' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className={`text-[10px] font-bold uppercase tracking-[0.3em] mb-3 sm:mb-4 ${isDark ? 'text-white/40' : 'text-black/40'}`}>Expertise</h2>
          <h3 className={`text-3xl sm:text-5xl font-serif font-bold ${isDark ? 'text-white' : 'text-black'}`}>Focused on Quality.</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service) => (
            <motion.div 
              key={service.title}
              whileHover={{ y: -10 }}
              className={`group relative overflow-hidden rounded-[24px] sm:rounded-[32px] border cursor-pointer ${isDark ? 'border-white/10' : 'border-black/10'}`}
              onClick={() => setSelectedService(service)}
            >
              <img 
                src={service.image} 
                className={`w-full aspect-[4/5] sm:aspect-[3/4] object-cover brightness-[0.4] group-hover:grayscale-0 group-hover:brightness-50 transition-all duration-700 ${isDark ? 'grayscale' : ''}`} 
                alt={service.title}
              />
              <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 border border-white/20">
                  {service.icon}
                </div>
                <h4 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-white">{service.title}</h4>
                <p className="text-white/60 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 opacity-0 group-hover:opacity-100 transition-all duration-500 hidden sm:block">
                  {service.description}
                </p>
                <div 
                  className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest group-hover:text-white text-white/70 transition-colors"
                >
                  Learn More <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Service Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`border rounded-[32px] sm:rounded-[40px] max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative ${isDark ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-black/10'}`}
            >
              <button 
                onClick={() => setSelectedService(null)}
                className={`absolute top-6 right-6 sm:top-8 sm:right-8 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'}`}
              >
                <X className={`w-4 h-4 sm:w-5 sm:h-5 ${isDark ? 'text-white' : 'text-black'}`} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="h-48 sm:h-64 md:h-full relative">
                  <img 
                    src={selectedService.image} 
                    className="w-full h-full object-cover grayscale brightness-50"
                    alt={selectedService.title}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-r via-transparent to-transparent hidden md:block ${isDark ? 'from-[#0a0a0a]' : 'from-white'}`} />
                </div>
                
                <div className="p-6 sm:p-8 md:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
                      {selectedService.icon}
                    </div>
                    <h3 className={`text-2xl sm:text-3xl font-serif font-bold ${isDark ? 'text-white' : 'text-black'}`}>{selectedService.title}</h3>
                  </div>
                  
                  <p className={`text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 font-light ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                    {selectedService.longDescription}
                  </p>

                  <h4 className={`text-[10px] font-bold uppercase tracking-[0.3em] mb-3 sm:mb-4 ${isDark ? 'text-white/40' : 'text-black/40'}`}>Core Services</h4>
                  <ul className="space-y-3 sm:space-y-4 mb-8">
                    {selectedService.services.map((item, i) => (
                      <motion.li 
                        key={i} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`flex items-center gap-3 text-xs sm:text-sm font-medium ${isDark ? 'text-white' : 'text-black'}`}
                      >
                        <div className={`w-1 h-1 rounded-full ${isDark ? 'bg-white' : 'bg-black'}`} />
                        {item}
                      </motion.li>
                    ))}
                  </ul>

                  <button 
                    onClick={() => setSelectedService(null)}
                    className={`w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 rounded-full font-bold text-[10px] sm:text-xs uppercase tracking-widest hover:scale-105 transition-transform ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}
                  >
                    Close & Explore
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const PricingSection: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const packages = [
    {
      name: "Essential",
      price: "499",
      features: ["2 Hour Session", "15 Edited Photos", "1 Location", "Digital Delivery", "Personal License"],
      recommended: false
    },
    {
      name: "Professional",
      price: "999",
      features: ["4 Hour Session", "40 Edited Photos", "2 Locations", "Prints Included", "Commercial License", "24hr Turnaround"],
      recommended: true
    },
    {
      name: "Elite",
      price: "2499",
      features: ["Full Day Coverage", "Unlimited Photos", "Multiple Locations", "Premium Photobook", "Copyright Transfer", "BTS Video"],
      recommended: false
    }
  ];

  return (
    <section id="pricing" className={`min-h-screen flex items-center py-16 transition-colors duration-500 rounded-[40px] sm:rounded-[60px] relative overflow-hidden mx-2 sm:mx-0 ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>
      <div className={`absolute -bottom-24 -left-24 w-64 h-64 sm:w-96 sm:h-96 rounded-full blur-[80px] sm:blur-[100px] ${isDark ? 'bg-gray-50' : 'bg-white/5'}`} />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative w-full">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className={`text-[10px] font-bold uppercase tracking-[0.3em] mb-3 ${isDark ? 'text-black/40' : 'text-white/40'}`}>Investment</h2>
          <h3 className={`text-3xl sm:text-4xl md:text-5xl font-serif font-bold ${isDark ? 'text-black' : 'text-white'}`}>Premium Packages</h3>
          <p className={`mt-4 max-w-lg mx-auto font-light text-sm sm:text-base ${isDark ? 'text-black/50' : 'text-white/50'}`}>All packages can be tailored to your specific needs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {packages.map((pkg) => (
            <div 
              key={pkg.name}
              className={`relative p-8 sm:p-10 rounded-[32px] sm:rounded-[44px] border transition-all duration-500 flex flex-col ${
                pkg.recommended 
                ? (isDark ? 'bg-black text-white border-black md:scale-105 shadow-2xl z-10' : 'bg-white text-black border-white md:scale-105 shadow-2xl z-10')
                : (isDark ? 'bg-white text-black border-black/10 hover:border-black/20' : 'bg-black/40 text-white border-white/10 hover:border-white/20')
              }`}
            >
              {pkg.recommended && (
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 border px-4 py-1.5 sm:px-6 sm:py-2 rounded-full text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.2em] ${isDark ? 'bg-black border-white/20 text-white' : 'bg-white border-black/20 text-black'}`}>
                  Most Popular
                </div>
              )}
              <h4 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2 uppercase tracking-tight">{pkg.name}</h4>
              <div className="flex items-baseline gap-1 mb-6 sm:mb-8">
                <span className="text-3xl sm:text-5xl font-serif font-bold tracking-tighter">${pkg.price}</span>
                <span className={`text-[10px] sm:text-sm ${pkg.recommended ? (isDark ? 'text-white/40' : 'text-black/40') : (isDark ? 'text-black/40' : 'text-white/40')}`}>/ starting</span>
              </div>
              <ul className="space-y-3 sm:space-y-4 flex-grow mb-4">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-xs sm:text-base font-medium leading-relaxed">
                    <Check className={`w-3.5 h-3.5 sm:w-4 sm:h-4 mt-1 flex-shrink-0 ${pkg.recommended ? (isDark ? 'text-white' : 'text-black') : (isDark ? 'text-black' : 'text-white')}`} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialsSection: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const reviews = [
    {
      name: "Sarah Jenkins",
      role: "Vogue Director",
      text: "Photography to Remember captured our brand essence perfectly. Their attention to detail is unmatched and they bring a unique visual flair.",
      avatar: "https://picsum.photos/id/101/100/100",
      rating: 5
    },
    {
      name: "Marcus Thorne",
      role: "Artist",
      text: "The street session was phenomenal. They have a way of seeing the city that is gritty and beautiful. A truly inspiring experience.",
      avatar: "https://picsum.photos/id/102/100/100",
      rating: 5
    },
    {
      name: "Lena Rodriguez",
      role: "Wedding Planner",
      text: "I've worked with many, but Photography to Remember is on another level. They tell stories that last and capture moments others miss completely.",
      avatar: "https://picsum.photos/id/103/100/100",
      rating: 4
    },
    {
      name: "David Chen",
      role: "Tech Entrepreneur",
      text: "My personal branding shoot was efficient and professional. The results exceeded my expectations and boosted my online presence.",
      avatar: "https://picsum.photos/id/104/100/100",
      rating: 5
    }
  ];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9
    })
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => (prevIndex + newDirection + reviews.length) % reviews.length);
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <section id="testimonials" className={`min-h-screen flex items-center py-16 sm:py-24 transition-colors duration-500 overflow-hidden ${isDark ? 'bg-[#050505]' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 sm:gap-16 items-start">
          <div className="lg:col-span-1 text-center lg:text-left sticky top-32">
            <h2 className={`text-[10px] font-bold uppercase tracking-[0.3em] mb-3 sm:mb-4 ${isDark ? 'text-white/40' : 'text-black/40'}`}>Voice of Clients</h2>
            <h3 className={`text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-6 italic leading-tight ${isDark ? 'text-white' : 'text-black'}`}>"They have an eye for the extraordinary in the mundane."</h3>
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-8">
               <div className="flex -space-x-2 sm:-space-x-3">
                  {[1,2,3,4].map(i => (
                    <img key={i} src={`https://picsum.photos/id/${i+10}/50/50`} className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 ${isDark ? 'border-black' : 'border-white'}`} />
                  ))}
               </div>
               <div className="text-[10px] sm:text-sm text-left">
                  <div className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>Loved by 2k+</div>
                  <div className={`${isDark ? 'text-white/40' : 'text-black/40'}`}>professionals worldwide</div>
               </div>
            </div>
            
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <button 
                onClick={() => paginate(-1)}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all group ${isDark ? 'border-white/10 hover:bg-white hover:text-black' : 'border-black/10 hover:bg-black hover:text-white text-black'}`}
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={20} className="group-active:scale-90 transition-transform" />
              </button>
              <button 
                onClick={() => paginate(1)}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all group ${isDark ? 'border-white/10 hover:bg-white hover:text-black' : 'border-black/10 hover:bg-black hover:text-white text-black'}`}
                aria-label="Next testimonial"
              >
                <ChevronRight size={20} className="group-active:scale-90 transition-transform" />
              </button>
              <div className={`ml-4 text-[10px] font-bold tracking-widest ${isDark ? 'text-white/20' : 'text-black/20'}`}>
                {currentIndex + 1} / {reviews.length}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 relative min-h-[350px] sm:min-h-[400px] flex items-center justify-center">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);

                  if (swipe < -swipeConfidenceThreshold) {
                    paginate(1);
                  } else if (swipe > swipeConfidenceThreshold) {
                    paginate(-1);
                  }
                }}
                className={`absolute w-full max-w-[500px] cursor-grab active:cursor-grabbing p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] shadow-2xl border select-none ${isDark ? 'glass border-white/10' : 'bg-white border-black/10'}`}
              >
                <div className="flex gap-1 mb-6">
                   {[1,2,3,4,5].map(i => (
                     <Star 
                        key={i} 
                        size={16}
                        className={`${i <= reviews[currentIndex].rating ? (isDark ? 'fill-white text-white' : 'fill-black text-black') : (isDark ? 'text-white/20' : 'text-black/20')}`} 
                      />
                    ))}
                </div>
                
                <p className={`text-lg sm:text-xl md:text-2xl mb-8 sm:mb-10 font-light italic leading-relaxed ${isDark ? 'text-white/90' : 'text-black/90'}`}>
                  "{reviews[currentIndex].text}"
                </p>
                
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img 
                      src={reviews[currentIndex].avatar} 
                      className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border shadow-lg ${isDark ? 'border-white/10' : 'border-black/5'}`} 
                      alt={reviews[currentIndex].name} 
                    />
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center shadow-md ${isDark ? 'bg-white' : 'bg-black'}`}>
                      <Star size={10} className={isDark ? 'fill-black text-black' : 'fill-white text-white'} />
                    </div>
                  </div>
                  <div className="text-left">
                    <div className={`font-bold text-sm sm:text-base tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>{reviews[currentIndex].name}</div>
                    <div className={`text-[10px] sm:text-xs uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-black/40'}`}>{reviews[currentIndex].role}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Background decorative cards for depth */}
            <div className={`absolute inset-0 -z-10 flex items-center justify-center opacity-10 blur-[1px]`}>
              <div className={`w-[85%] h-[80%] rounded-[40px] transform translate-y-4 scale-95 ${isDark ? 'glass-dark' : 'bg-gray-200'}`} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  return (
    <footer id="contact" className={`min-h-[50vh] flex items-center py-12 sm:py-20 border-t transition-colors duration-500 ${isDark ? 'bg-[#050505] border-white/10' : 'bg-gray-50 border-black/10'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 mb-12 sm:mb-16">
          <div className="md:col-span-2 text-center md:text-left">
            <div className={`text-xl sm:text-2xl font-serif font-bold tracking-tighter mb-4 sm:mb-6 flex items-center justify-center md:justify-start gap-2 ${isDark ? 'text-white' : 'text-black'}`}>
              <div className={`w-7 h-7 sm:w-8 h-8 rounded-full flex items-center justify-center overflow-hidden ${isDark ? 'bg-white' : 'bg-black'}`}>
                <CameraFlashIcon size={16} iconClassName={isDark ? 'text-black' : 'text-white'} />
              </div>
              Photography <span className="text-[#D4AF37]">to Remember</span>
            </div>
            <p className={`max-w-sm mx-auto md:mx-0 mb-6 sm:mb-8 text-sm leading-relaxed ${isDark ? 'text-white/40' : 'text-black/40'}`}>
              Based in Cape Town. Specialized in capturing portraits, events, and authentic street photography.
            </p>
            <div className="flex justify-center md:justify-start gap-4">
              <a href="#" className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-black/5 hover:bg-black/10 text-black'}`}>
                <Instagram size={18} />
              </a>
              <a href="#" className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-black/5 hover:bg-black/10 text-black'}`}>
                <Facebook size={18} />
              </a>
              <a href="#" className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-black/5 hover:bg-black/10 text-black'}`}>
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          <div className="text-center md:text-left">
            <h5 className={`font-bold text-xs uppercase tracking-widest mb-4 sm:mb-6 ${isDark ? 'text-white' : 'text-black'}`}>Contact</h5>
            <ul className={`space-y-3 sm:space-y-4 text-xs sm:text-sm ${isDark ? 'text-white/40' : 'text-black/40'}`}>
              <li>hello@meedscreative.com</li>
              <li>084 619 9927</li>
              <li>Cape Town, South Africa</li>
            </ul>
          </div>
        </div>

        <div className={`pt-6 sm:pt-8 border-t flex flex-col md:row justify-between items-center gap-4 text-[8px] sm:text-[10px] uppercase tracking-[0.2em] font-bold text-center ${isDark ? 'border-white/5 text-white/20' : 'border-black/5 text-black/20'}`}>
          <div>© 2024 Photography to Remember. All Rights Reserved.</div>
          <div className="flex gap-6 sm:gap-8">
            <a href="#" className={isDark ? 'hover:text-white' : 'hover:text-black'}>Privacy Policy</a>
            <a href="#" className={isDark ? 'hover:text-white' : 'hover:text-black'}>Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---

export default function App() {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className={`min-h-screen selection:bg-[#D4AF37] selection:text-white transition-colors duration-500 ${isDark ? 'bg-[#050505] text-white' : 'bg-white text-black'} overflow-x-hidden`}>
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />
      <main>
        <Hero isDark={isDark} />
        <AboutSection isDark={isDark} />
        <ServicesSection isDark={isDark} />
        <PricingSection isDark={isDark} />
        <TestimonialsSection isDark={isDark} />
      </main>
      <Footer isDark={isDark} />

      {/* Persistent Book Now Widget */}
      <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-[60]">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-2xl flex items-center gap-3 font-bold uppercase text-[8px] sm:text-[10px] tracking-widest overflow-hidden border ${isDark ? 'bg-white text-black border-black/5' : 'bg-black text-white border-white/5'}`}
          onClick={() => scrollToId('contact')}
        >
          <div className={`w-6 h-6 sm:w-8 sm:h-8 ${isDark ? 'bg-black' : 'bg-white'} rounded-lg flex items-center justify-center overflow-hidden`}>
            <CameraFlashIcon size={14} iconClassName={isDark ? 'text-white' : 'text-black'} />
          </div>
          Book a Shoot
        </motion.button>
      </div>
    </div>
  );
}
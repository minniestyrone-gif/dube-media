
import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Users, 
  MapPin, 
  Star, 
  ArrowRight, 
  Check, 
  Instagram, 
  Twitter, 
  Linkedin,
  Menu,
  X,
  Play,
  ArrowUpRight
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

const Navbar: React.FC = () => {
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#050505]/80 backdrop-blur-md py-4 shadow-xl' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <button 
          onClick={(e) => handleLinkClick(e, 'home')}
          className="text-2xl font-serif font-bold tracking-tighter flex items-center gap-2 hover:opacity-80 transition-opacity outline-none"
        >
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center overflow-hidden">
            <CameraFlashIcon size={18} iconClassName="text-black" />
          </div>
          DUBE MEDIA
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              onClick={(e) => handleLinkClick(e, link.href)}
              className="text-sm font-medium hover:text-white/70 transition-colors uppercase tracking-widest cursor-pointer"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-[#050505] p-6 border-b border-white/10 flex flex-col gap-4 md:hidden"
          >
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-lg font-medium border-b border-white/5 pb-2"
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

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-[150px]" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h1 className="text-6xl md:text-8xl font-serif font-bold mb-8 leading-[0.9]">
            Capture <br />
            <span className="text-white/40 italic">the essence</span> <br />
            of a Moment.
          </h1>
          <p className="text-lg text-white/60 max-w-lg mb-10 font-light leading-relaxed">
            Dube Media specializes in high-end portrait, dynamic event, and authentic street photography. We don't just take photos; we preserve memories.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <button 
              onClick={() => scrollToId('about')}
              className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:scale-105 hover:bg-white/90 transition-all flex items-center justify-center gap-2 group"
            >
              About Us <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            {/* Our Services Button with Yellow Light Beam */}
            <div className="relative group p-[2px] rounded-full overflow-hidden">
              {/* Rotating Yellow Light Beam */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_120deg,#facc15_180deg,transparent_240deg,transparent_360deg)] opacity-60 group-hover:opacity-100 group-hover:duration-1000 blur-[2px]"
              />
              <button 
                onClick={() => scrollToId('services')}
                className="relative z-10 bg-[#050505] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/5 transition-all flex items-center justify-center min-w-[180px]"
              >
                Our Services
              </button>
            </div>
          </div>
        </motion.div>

        <div className="relative h-[600px] hidden lg:block">
          {/* Main Hero Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="w-full h-full rounded-[40px] overflow-hidden border border-white/10 shadow-2xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1200" 
              className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 transition-all duration-1000"
              alt="Street Photography"
            />
          </motion.div>

          {/* Floating Widgets */}
          <FloatingWidget className="absolute top-20 -left-12 max-w-[200px]" delay={0}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center overflow-hidden">
                <CameraFlashIcon size={20} iconClassName="text-white" />
              </div>
              <div>
                <div className="text-xs text-white/50">Clients</div>
                <div className="text-lg font-bold">100+ Happy</div>
              </div>
            </div>
          </FloatingWidget>

          <FloatingWidget className="absolute bottom-16 -right-8 max-w-[240px]" delay={1.5}>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/50 uppercase tracking-widest">Recent Shoot</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
              <div className="flex items-center gap-3">
                <img src="https://picsum.photos/id/64/100/100" className="w-10 h-10 rounded-lg object-cover" />
                <div>
                  <div className="text-sm font-bold">clifton 4th</div>
                  <div className="text-[10px] text-white/40">24 Photos Edited</div>
                </div>
              </div>
            </div>
          </FloatingWidget>

          <FloatingWidget className="absolute top-1/2 -right-16 translate-y-[-50%] p-3" delay={2.5}>
             <div className="bg-white text-black p-4 rounded-xl flex flex-col items-center overflow-hidden">
                <div className="mb-1">
                  <CameraFlashIcon size={24} iconClassName="fill-black text-black" />
                </div>
                <span className="text-xl font-bold">4.3</span>
                <span className="text-[10px] uppercase font-bold text-black/50 tracking-tighter">Avg Rating</span>
             </div>
          </FloatingWidget>
        </div>
      </div>
    </section>
  );
};

const AboutSection: React.FC = () => {
  const fixedStoryImage = "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&q=80&w=1200";

  return (
    <section id="about" className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative group">
            <div className="absolute -inset-4 bg-white/5 rounded-[40px] blur-2xl group-hover:bg-white/10 transition-colors" />
            
            <div className="absolute -top-10 -left-10 glass p-8 rounded-3xl hidden sm:block z-20">
              <div className="text-5xl font-serif font-bold mb-2 text-white/90">Est.</div>
              <div className="text-sm text-white/60 uppercase tracking-widest">Established <br />2025</div>
            </div>

            <div className="relative overflow-hidden rounded-[32px] border border-white/10 shadow-2xl aspect-[4/5] bg-neutral-900">
              <img 
                src={fixedStoryImage} 
                className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                alt="Representative Portrait"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
            </div>
          </div>
          
          <div className="relative">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/40 mb-4">The Story</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold mb-8 leading-tight">Crafting Visual Legacies Since 2025.</h3>
            <p className="text-white/60 text-lg leading-relaxed mb-6 font-light">
              Founded by Monga Dube, Dube Media was born out of a passion for the raw, unscripted beauty of the urban landscape. What started as a solo street photography project in the heart of Cape Town evolved into a premier media house.
            </p>
            <p className="text-white/60 text-lg leading-relaxed mb-10 font-light">
              We believe that every portrait has a story, every event has a heartbeat, and every street corner has a secret. Our mission is to capture these moments with technical precision and artistic flair.
            </p>
          </div>
        </div>

        {/* Happy Clients widget */}
        <div className="flex justify-end mt-12 md:mt-0 lg:absolute lg:bottom-0 lg:right-6">
          <FloatingWidget className="max-w-[200px] z-20 p-4 border-white/20" delay={0.8}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center overflow-hidden">
                <Star className="w-5 h-5 text-white fill-white" />
              </div>
              <div className="text-base font-bold tracking-tight">100+ Happy Clients</div>
            </div>
          </FloatingWidget>
        </div>
      </div>
    </section>
  );
};

const ServicesSection: React.FC = () => {
  const [selectedService, setSelectedService] = useState<ServiceDetail | null>(null);

  const services: ServiceDetail[] = [
    {
      title: "Premium Portraits",
      description: "Personal branding, editorial headshots, and creative studio sessions.",
      longDescription: "Our portrait photography is focused on revealing the authentic essence of the individual. We blend editorial techniques with high-end lighting to create images that don't just show what you look like, but who you are. Ideal for professional branding, modeling portfolios, and personal legacies.",
      services: [
        "Executive & Corporate Headshots",
        "Personal Branding Collections",
        "Editorial Fashion Portraits",
        "Creative Studio Sessions",
        "High-End Modeling Portfolios"
      ],
      icon: <Users className="w-6 h-6" />,
      image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=600"
    },
    {
      title: "Event Coverage",
      description: "High-energy coverage for corporate events, galas, and private celebrations.",
      longDescription: "We provide comprehensive, cinematic documentation of your most significant milestones. Our team operates with precision and discretion, capturing both the grand moments and the intimate candid details that define the atmosphere of your event.",
      services: [
        "Corporate Galas & Awards",
        "High-End Product Launches",
        "Private VIP Celebrations",
        "Professional Conferences",
        "Live Performances & Backstage"
      ],
      icon: <Play className="w-6 h-6" />,
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=600"
    },
    {
      title: "Street & Urban",
      description: "Authentic urban storytelling, commercial lifestyle, and brand activations.",
      longDescription: "Rooted in our heritage of street photography, we offer a raw and authentic look at life in the city. We translate the energy of the urban landscape into powerful visual narratives for brands and editorial projects that demand an edgy, real-world aesthetic.",
      services: [
        "Commercial Lifestyle Campaigns",
        "Brand Activations & Street Marketing",
        "Urban Landscape Documentaries",
        "Architectural & Urban Highlights",
        "Street Fashion Lookbooks"
      ],
      icon: <MapPin className="w-6 h-6" />,
      image: "https://images.unsplash.com/photo-1547447134-cd3f5c716030?auto=format&fit=crop&q=80&w=600"
    }
  ];

  return (
    <section id="services" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/40 mb-4">Expertise</h2>
          <h3 className="text-5xl font-serif font-bold">Focused on Quality.</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <motion.div 
              key={service.title}
              whileHover={{ y: -10 }}
              className="group relative overflow-hidden rounded-[32px] border border-white/10 cursor-pointer"
              onClick={() => setSelectedService(service)}
            >
              <img 
                src={service.image} 
                className="w-full aspect-[3/4] object-cover grayscale brightness-[0.3] group-hover:grayscale-0 group-hover:brightness-50 transition-all duration-700" 
                alt={service.title}
              />
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                  {service.icon}
                </div>
                <h4 className="text-2xl font-bold mb-3">{service.title}</h4>
                <p className="text-white/60 text-sm leading-relaxed mb-6 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  {service.description}
                </p>
                <div 
                  className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest group-hover:text-white transition-colors"
                >
                  Learn More <ArrowRight className="w-4 h-4" />
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
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-[40px] max-w-4xl w-full overflow-hidden shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedService(null)}
                className="absolute top-8 right-8 z-10 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="h-64 md:h-full relative">
                  <img 
                    src={selectedService.image} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                    alt={selectedService.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-transparent hidden md:block" />
                </div>
                
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                      {selectedService.icon}
                    </div>
                    <h3 className="text-3xl font-serif font-bold">{selectedService.title}</h3>
                  </div>
                  
                  <p className="text-white/60 text-lg leading-relaxed mb-8 font-light">
                    {selectedService.longDescription}
                  </p>

                  <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-white/40 mb-4">Core Services</h4>
                  <ul className="space-y-4">
                    {selectedService.services.map((item, i) => (
                      <motion.li 
                        key={i} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-3 text-sm font-medium"
                      >
                        <div className="w-1 h-1 bg-white rounded-full" />
                        {item}
                      </motion.li>
                    ))}
                  </ul>

                  <button 
                    onClick={() => setSelectedService(null)}
                    className="mt-12 bg-white text-black px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:scale-105 transition-transform"
                  >
                    Close & Explore More
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

const PricingSection: React.FC = () => {
  const packages = [
    {
      name: "Essential",
      price: "499",
      features: ["2 Hour Session", "15 Edited Photos", "1 Location", "Digital Delivery", "Personal Usage License"],
      recommended: false
    },
    {
      name: "Professional",
      price: "999",
      features: ["4 Hour Session", "40 Edited Photos", "2 Locations", "Digital Delivery + Prints", "Commercial Usage License", "24hr Turnaround"],
      recommended: true
    },
    {
      name: "Elite",
      price: "2499",
      features: ["Full Day Coverage", "Unlimited Photos", "Multiple Locations", "Premium Photobook", "Full Copyright Transfer", "Behind the Scenes Video"],
      recommended: false
    }
  ];

  return (
    <section id="pricing" className="py-14 bg-white text-black rounded-[60px] relative overflow-hidden">
      {/* Subtle Background Accent */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gray-50 rounded-full blur-[100px]" />
      
      <div className="max-w-5xl mx-auto px-6 relative">
        <div className="text-center mb-12">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-black/40 mb-3">Investment</h2>
          <h3 className="text-4xl md:text-5xl font-serif font-bold">Premium Packages</h3>
          <p className="mt-4 text-black/50 max-w-lg mx-auto font-light text-base">Select a collection that fits your vision. All packages can be tailored to specific needs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div 
              key={pkg.name}
              className={`relative px-7 py-10 rounded-[44px] border transition-all duration-500 flex flex-col ${
                pkg.recommended 
                ? 'bg-black text-white border-black scale-105 shadow-2xl z-10' 
                : 'bg-white text-black border-black/10 hover:border-black/20'
              }`}
            >
              {pkg.recommended && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black border border-white/20 px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                  Most Popular
                </div>
              )}
              <h4 className="text-xl md:text-2xl font-bold mb-1.5 uppercase tracking-tight">{pkg.name}</h4>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl md:text-5xl font-serif font-bold tracking-tighter">${pkg.price}</span>
                <span className={`text-sm ${pkg.recommended ? 'text-white/40' : 'text-black/40'}`}>/ starting</span>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-4 text-sm md:text-base font-medium leading-relaxed">
                    <Check className={`w-4 h-4 mt-1 flex-shrink-0 ${pkg.recommended ? 'text-white' : 'text-black'}`} />
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

const TestimonialsSection: React.FC = () => {
  const reviews = [
    {
      name: "Sarah Jenkins",
      role: "Marketing Director @ Vogue",
      text: "Dube Media captured our brand essence perfectly. Their attention to detail and ability to work in high-pressure environments is unmatched.",
      avatar: "https://picsum.photos/id/101/100/100",
      rating: 5
    },
    {
      name: "Marcus Thorne",
      role: "Independent Artist",
      text: "The street session we did was phenomenal. They have a way of seeing the city that is both gritty and incredibly beautiful. Highly recommend.",
      avatar: "https://picsum.photos/id/102/100/100",
      rating: 5
    },
    {
      name: "Lena Rodriguez",
      role: "Wedding Planner",
      text: "I've worked with many photographers, but Dube Media is on another level. They don't just take pictures; they tell stories that last a lifetime.",
      avatar: "https://picsum.photos/id/103/100/100",
      rating: 4
    }
  ];

  return (
    <section id="testimonials" className="py-24 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
          <div className="lg:col-span-1">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/40 mb-4">Voice of Clients</h2>
            <h3 className="text-4xl font-serif font-bold mb-6 italic leading-tight">"They have an eye for the extraordinary in the mundane."</h3>
            <div className="flex items-center gap-4">
               <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <img key={i} src={`https://picsum.photos/id/${i+10}/50/50`} className="w-10 h-10 rounded-full border-2 border-black" />
                  ))}
               </div>
               <div className="text-sm">
                  <div className="font-bold">Loved by 2k+</div>
                  <div className="text-white/40">worldwide professionals</div>
               </div>
            </div>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((rev, idx) => (
              <motion.div 
                key={rev.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="glass p-8 rounded-3xl"
              >
                <div className="flex gap-1 mb-6">
                   {[1,2,3,4,5].map(i => (
                     <Star 
                        key={i} 
                        className={`w-4 h-4 ${i <= rev.rating ? 'fill-white text-white' : 'text-white/20'}`} 
                      />
                    ))}
                </div>
                <p className="text-lg mb-8 font-light italic text-white/80">"{rev.text}"</p>
                <div className="flex items-center gap-4">
                  <img src={rev.avatar} className="w-12 h-12 rounded-full object-cover" alt={rev.name} />
                  <div>
                    <div className="font-bold text-sm">{rev.name}</div>
                    <div className="text-xs text-white/40">{rev.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="py-20 border-t border-white/10 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="text-2xl font-serif font-bold tracking-tighter mb-6">DUBE MEDIA</div>
            <p className="text-white/40 max-sm mb-8 leading-relaxed">
              Based in Cape Town. Specialized in capturing the essence of moments across portraits, events, and street photography.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h5 className="font-bold text-sm uppercase tracking-widest mb-6">Contact</h5>
            <ul className="space-y-4 text-white/40 text-sm">
              <li>hello@dubemedia.com</li>
              <li>+1 (555) 123-4567</li>
              <li>Cape Town, South Africa</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:row justify-between items-center gap-4 text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">
          <div>© 2024 Dube Media. All Rights Reserved.</div>
          <div className="flex gap-8">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---

export default function App() {
  return (
    <div className="min-h-screen selection:bg-white selection:text-black">
      <Navbar />
      <Hero />
      <AboutSection />
      <ServicesSection />
      <PricingSection />
      <TestimonialsSection />
      
      <Footer />

      {/* Persistent Book Now Widget */}
      <div className="fixed bottom-8 right-8 z-[60]">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white text-black p-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold uppercase text-[10px] tracking-widest overflow-hidden"
          onClick={() => scrollToId('contact')}
        >
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center overflow-hidden">
            <CameraFlashIcon size={16} iconClassName="text-white" />
          </div>
          Book a Shoot
        </motion.button>
      </div>
    </div>
  );
}

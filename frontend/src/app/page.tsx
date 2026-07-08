'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, Mail, Phone, Clock, Activity, ShieldCheck, Heart } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function Homepage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Scroll sensitive Navbar (hide on scroll down, show on scroll up)
  const [navVisible, setNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        // Scrolling down - hide navbar
        setNavVisible(false);
      } else {
        // Scrolling up - show navbar
        setNavVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Scroll Reveal Animations using IntersectionObserver
  const [revealedSections, setRevealedSections] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setRevealedSections((prev) => ({ ...prev, [entry.target.id]: true }));
        }
      });
    }, { threshold: 0.15 });

    const targets = document.querySelectorAll('.scroll-reveal');
    targets.forEach((target) => observer.observe(target));

    return () => targets.forEach((target) => observer.unobserve(target));
  }, []);

  return (
    <div className="min-h-screen bg-bg-brand text-text-primary font-sans selection:bg-[#EF9F27]/30 overflow-x-hidden flex flex-col justify-between">

      {/* Navigation Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 border-b border-border-brand bg-bg-brand/90 backdrop-blur-md transition-transform duration-300 ${
        navVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 h-16 flex justify-between items-center">
          <Link href="/" className="text-sm font-extrabold tracking-wider uppercase text-text-primary hover:text-[#EF9F27] transition-colors">
            VFF IMS
          </Link>
          <nav className="flex items-center gap-6 text-xs font-semibold text-text-secondary">
            <Link href="/" className="hover:text-text-primary transition-colors duration-150">Home</Link>
            {isAuthenticated ? (
              <Link href="/dashboard" className="text-[#EF9F27] hover:text-[#EF9F27]/80 flex items-center gap-1">
                Dashboard <ArrowRight size={14} />
              </Link>
            ) : (
              <>
                <Link href="/login" className="hover:text-text-primary transition-colors duration-150">Login</Link>
                <Link href="/register" className="hover:text-text-primary transition-colors duration-150">Register</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow pt-16">

        {/* Hero Section */}
        <section id="hero" className={`max-w-[1280px] mx-auto px-6 md:px-12 py-16 space-y-12 transition-all duration-1000 ${
          revealedSections['hero'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        } scroll-reveal`}>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Copy column */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-text-primary font-heading">
                Empower welfare <br />
                with unified systems.
              </h1>

              <p className="text-sm md:text-base text-text-secondary leading-relaxed max-w-lg">
                Centralized internal management application integrating Human Resources, Finance, Programs, and System Administration.
              </p>

              <div className="flex gap-4 pt-4">
                {isAuthenticated ? (
                  <Link href="/dashboard">
                    <Button className="bg-[#EF9F27] hover:bg-[#EF9F27]/80 text-[#0B0D12] font-semibold text-xs tracking-wider py-3.5 px-7 rounded-lg shadow-md hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-200 border-none">
                      Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/register">
                      <Button className="bg-[#EF9F27] hover:bg-[#EF9F27]/90 text-white font-bold text-xs py-3 px-6 rounded-lg shadow-[0_0_15px_rgba(239,159,39,0.3)] transition-all border-none">
                        Access System
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button variant="outline" className="bg-transparent text-text-primary border-border-brand hover:bg-bg-subtle font-bold text-xs py-3 px-6 rounded-lg">
                        System Login
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Image column */}
            <div className="relative w-full h-[280px] md:h-[380px] rounded-2xl overflow-hidden border border-border-brand shadow-2xl bg-surface group">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1600&q=80')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B0D12]/20 to-[#0B0D12]/90" />
              <div className="absolute top-6 right-6 text-[10px] font-bold text-[#F9FAFB] font-mono bg-[#0B0D12]/60 backdrop-blur-md py-1.5 px-3 rounded-full border border-white/10">
                01 / 03
              </div>
              <div className="absolute bottom-6 left-6 right-6 space-y-1">
                <p className="text-[10px] tracking-wider text-[#F9FAFB] font-bold uppercase">
                  VFF Central Clinic Care
                </p>
                <p className="text-[9px] tracking-wider text-[#9CA3AF] font-medium uppercase">
                  Vets For Future — Public Division
                </p>
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-border-brand pt-12">
            {[
              { label: 'Core System Modules', val: '4' },
              { label: 'Forensic Audit Trails', val: '100%' },
              { label: 'Manual Overrides', val: '0' },
              { label: 'Financial Ledger', val: 'Real-Time' }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col gap-1 pr-4 border-r border-border-brand/40 last:border-none">
                <span className="text-2xl md:text-3xl font-extrabold text-text-primary tracking-tight font-heading">{stat.val}</span>
                <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* About Section */}
        <section id="about" className={`bg-bg-subtle border-y border-border-brand py-20 transition-all duration-1000 ${
          revealedSections['about'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        } scroll-reveal`}>
          <div className="max-w-[1280px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="h-[280px] md:h-[340px] rounded-xl overflow-hidden border border-border-brand relative order-2 lg:order-1">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=1200&q=80')" }}
              />
              <div className="absolute inset-0 bg-[#0B0D12]/30" />
            </div>

            <div className="space-y-6 order-1 lg:order-2">
              <span className="text-[10px] font-bold tracking-wider text-text-secondary uppercase flex items-center gap-1.5">
                <Heart size={12} className="text-red-500" /> About Vets For Future
              </span>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight text-text-primary font-heading">
                Sri Lanka&apos;s first humane population control organization.
              </h2>
              <p className="text-text-secondary text-xs md:text-sm leading-relaxed">
                Founded in 2000, Vets For Future (VFF) co-founded the National Rabies Eradication and Humane Animal Population Control Program in 2008. Over 25 years, the organization has run sterilization campaigns nationwide and trained hundreds of veterinary professionals.
              </p>
              <p className="text-text-secondary text-xs md:text-sm leading-relaxed">
                This Integrated Management System (IMS) is VFF&apos;s internal platform for coordinating that work — enforcing financial discipline, maintaining inventory accountability, and managing staff schedules across every program.
              </p>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section id="impact" className={`max-w-[1280px] mx-auto px-6 md:px-12 py-20 space-y-12 transition-all duration-1000 ${
          revealedSections['impact'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        } scroll-reveal`}>
          <div className="space-y-4">
            <span className="text-[10px] font-bold tracking-wider text-text-secondary uppercase">
              ● Accomplishments
            </span>
            <h2 className="text-3xl font-bold tracking-tight font-heading">Our Operational Footprint</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: '1M+ Sterilized', desc: 'Over one million dogs and cats reached through nationwide sterilization campaigns since the program\'s founding.', icon: Heart, color: 'text-red-500', bg: 'bg-red-500/10' },
              { title: '1.3M+ Vaccinated', desc: 'Approximately 1.3 million animals vaccinated against rabies, cutting annual rabies deaths dramatically.', icon: ShieldCheck, color: 'text-green-500', bg: 'bg-green-500/10' },
              { title: '130+ Vets Trained', desc: 'Trained veterinary surgeons, assistants, and vaccinators now working in programs across Sri Lanka and abroad.', icon: Activity, color: 'text-amber-500', bg: 'bg-amber-500/10' }
            ].map((card, i) => (
              <div key={i} className="bg-surface border border-border-brand rounded-xl p-8 space-y-4 hover:border-[#EF9F27]/40 transition-colors">
                <div className={cn("p-3 border rounded-lg w-12 h-12 flex items-center justify-center border-border-brand/40", card.bg, card.color)}>
                  <card.icon size={20} />
                </div>
                <h3 className="text-lg font-bold text-text-primary">{card.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className={`bg-bg-subtle border-t border-border-brand py-20 transition-all duration-1000 ${
          revealedSections['contact'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        } scroll-reveal`}>
          <div className="max-w-[1280px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <span className="text-[10px] font-bold tracking-wider text-text-secondary uppercase">
                ● Reach Our Teams
              </span>
              <h2 className="text-3xl font-bold tracking-tight font-heading">Kalubovila Operations Office</h2>
              <p className="text-text-secondary text-xs md:text-sm leading-relaxed">
                Our central operations coordinates staff scheduling, payroll computations, and medical supply audits. Contact us for administrative inquiries.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3 text-xs text-text-secondary">
                  <MapPin size={18} className="text-[#EF9F27]" />
                  <span>No. 02, Edward Place, Sri Sunandarama Mw, Kalubovila, Sri Lanka</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-text-secondary">
                  <Mail size={18} className="text-[#EF9F27]" />
                  <span>vetsforfuturesl@gmail.com</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-text-secondary">
                  <Phone size={18} className="text-[#EF9F27]" />
                  <span>+94 77 722 6301</span>
                </div>
              </div>
            </div>

            <div className="h-[280px] md:h-[320px] rounded-xl overflow-hidden border border-border-brand relative">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=1200&q=80')" }}
              />
              <div className="absolute inset-0 bg-[#0B0D12]/35" />
              <div className="absolute bottom-6 left-6 text-[10px] font-mono text-[#F9FAFB] bg-[#0B0D12]/80 py-1.5 px-3 rounded border border-white/5 flex items-center gap-1.5">
                <Clock size={14} /> Emergency Coordinates Active
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-border-brand bg-bg-brand pt-16 pb-8 text-xs text-text-secondary">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12">
          <div className="space-y-4">
            <span className="text-base font-bold text-text-primary">VFF IMS</span>
            <p className="leading-relaxed">
              Digitizing animal welfare operations through integrated administrative systems, secure RBAC validation, and immutable auditing ledgers.
            </p>
          </div>
          <div className="space-y-4">
            <span className="font-bold uppercase tracking-wider text-text-primary">System Portals</span>
            <ul className="space-y-2">
              <li><Link href="/login" className="hover:text-text-primary">User Portal Login</Link></li>
              <li><Link href="/register" className="hover:text-text-primary">Staff Registry Signup</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <span className="font-bold uppercase tracking-wider text-text-primary">IMS Modules</span>
            <ul className="space-y-2">
              <li>HR & Attendance</li>
              <li>Finance & Payroll</li>
              <li>Program Operations</li>
              <li>Audit Trail Logs</li>
            </ul>
          </div>
          <div className="space-y-4">
            <span className="font-bold uppercase tracking-wider text-text-primary">Reach Us</span>
            <ul className="space-y-2">
              <li className="flex items-center gap-2"><MapPin size={14} /> Kalubovila, Sri Lanka</li>
              <li className="flex items-center gap-2"><Mail size={14} /> vetsforfuturesl@gmail.com</li>
            </ul>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-6 md:px-12 border-t border-border-brand/60 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-text-secondary">
          <span>© {new Date().getFullYear()} Vets For Future. All Rights Reserved.</span>
          <span>Internal Use Only · English Language Edition (SL)</span>
        </div>
      </footer>

    </div>
  );
}
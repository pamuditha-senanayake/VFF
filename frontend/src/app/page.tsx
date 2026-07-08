'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, Mail, Phone, Clock, Activity, ShieldCheck, Heart } from 'lucide-react';
import Link from 'next/link';

export default function Homepage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <div className="min-h-screen bg-[#0d1117] text-white font-sans selection:bg-[#3b82f6]/30 overflow-x-hidden flex flex-col justify-between">

      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-[#1e293b] bg-[#0d1117]/80 backdrop-blur-md">
        <div className="max-w-[1280px] mx-auto px-[24px] md:px-[48px] lg:px-[80px] h-[64px] flex justify-between items-center">
          <Link href="/" className="text-[15px] font-extrabold tracking-[0.05em] uppercase text-white">
            VFF
          </Link>
          <nav className="flex items-center gap-[24px] text-[14px] font-medium text-[#94a3b8]">
            <Link href="/" className="hover:text-white transition-colors duration-150">Home</Link>
            {isAuthenticated ? (
              <Link href="/dashboard" className="text-white hover:underline flex items-center gap-1">
                Dashboard <ArrowRight size={14} />
              </Link>
            ) : (
              <>
                <Link href="/login" className="hover:text-white transition-colors duration-150">Login</Link>
                <Link href="/register" className="hover:text-white transition-colors duration-150">Register</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow">

        {/* Hero Section — two-column: copy left, image right, stats spanning below */}
        <section className="max-w-[1280px] mx-auto px-[24px] md:px-[48px] lg:px-[80px] pt-[64px] pb-[48px] space-y-[48px]">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Copy column */}
            <div className="space-y-[24px]">
              <h1 className="text-[40px] md:text-[56px] font-bold leading-[1.08] tracking-[-0.03em] text-white">
                Empower welfare <br />
                with unified systems.
              </h1>

              <p className="text-[16px] md:text-[18px] text-[#cbd5e1] leading-[1.6]">
                Centralized internal web application integrating Human Resources, Finance, Operations, and System Administration.
              </p>

              <div className="flex gap-4 pt-[8px]">
                {isAuthenticated ? (
                  <Link href="/dashboard">
                    <Button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold text-[15px] py-[14px] px-[28px] rounded-lg shadow-lg shadow-[#3b82f6]/10">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/register">
                      <Button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold text-[15px] py-[14px] px-[28px] rounded-lg shadow-lg shadow-[#3b82f6]/10">
                        Access System
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button variant="outline" className="bg-transparent text-white border-[#2d3748] hover:bg-white/5 font-semibold text-[15px] py-[13px] px-[27px] rounded-lg">
                        Documentation
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Image column */}
            <div className="relative w-full h-[280px] md:h-[400px] rounded-2xl overflow-hidden border border-[#2d3748] shadow-2xl bg-slate-900 group">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1600&q=80')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0d1117]/10 to-[#0d1117]/85" />

              <div className="absolute top-6 right-6 text-[12px] font-semibold text-[#cbd5e1] font-mono bg-[#0d1117]/60 backdrop-blur-md py-1.5 px-3 rounded-full border border-white/10">
                01 / 03
              </div>

              <div className="absolute bottom-6 left-6 right-6 space-y-1">
                <p className="text-[11px] tracking-[0.15em] text-[#cbd5e1] font-bold uppercase">
                  VFF VETERINARY CLINIC CARE CENTER
                </p>
                <p className="text-[9px] tracking-[0.08em] text-[#6b7280] font-medium uppercase">
                  VETS FOR FUTURE — PUBLIC HEALTH DIVISION
                </p>
              </div>
            </div>
          </div>

          {/* Stats strip — full width beneath both columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-[#1e293b] pt-[32px]">
            <div className="flex flex-col gap-1 pr-[16px] md:border-r border-[#1e293b]/60">
              <span className="text-[28px] md:text-[36px] font-extrabold text-white tracking-tight leading-none">4</span>
              <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">CORE SYSTEM MODULES</span>
            </div>
            <div className="flex flex-col gap-1 pr-[16px] md:border-r border-[#1e293b]/60">
              <span className="text-[28px] md:text-[36px] font-extrabold text-white tracking-tight leading-none">100%</span>
              <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">FORENSIC AUDIT TRAILS</span>
            </div>
            <div className="flex flex-col gap-1 pr-[16px] md:border-r border-[#1e293b]/60">
              <span className="text-[28px] md:text-[36px] font-extrabold text-white tracking-tight leading-none">0</span>
              <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">PAYROLL MANUAL OVERRIDES</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[28px] md:text-[36px] font-extrabold text-white tracking-tight leading-none">REAL-TIME</span>
              <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">FINANCIAL LEDGER</span>
            </div>
          </div>
        </section>

        {/* About Section — flipped: image left, text right (alternates from hero) */}
        <section className="bg-[#0f1520] border-y border-[#1e293b] py-[80px]">
          <div className="max-w-[1280px] mx-auto px-[24px] md:px-[48px] lg:px-[80px] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            <div className="h-[280px] md:h-[360px] rounded-xl overflow-hidden border border-[#2d3748] relative order-2 lg:order-1">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=1200&q=80')" }}
              />
              <div className="absolute inset-0 bg-[#0d1117]/20" />
            </div>

            <div className="space-y-6 order-1 lg:order-2">
              <span className="text-[11px] font-bold tracking-[0.12em] text-[#94a3b8] uppercase flex items-center gap-1.5">
                <Heart size={12} className="text-red-500" /> About Vets For Future
              </span>
              <h2 className="text-[32px] md:text-[44px] font-bold leading-tight tracking-tight text-white">
                Sri Lanka&apos;s first humane population control organization.
              </h2>
              <p className="text-[#cbd5e1] text-[15px] leading-relaxed">
                Founded in 2000 by Dr. Chamith Nanayakkara and Dr. Udaya Wijayawardana, Vets For Future (VFF) co-founded the National Rabies Eradication and Humane Animal Population Control Program with Sri Lanka&apos;s Ministry of Health in 2008. Over 25 years, the organization has run sterilization and vaccination campaigns nationwide and trained hundreds of veterinary professionals.
              </p>
              <p className="text-[#94a3b8] text-[14px] leading-relaxed">
                This Integrated Management System (IMS) is VFF&apos;s internal platform for coordinating that work — enforcing financial discipline, maintaining inventory accountability, and managing staff schedules across every program.
              </p>
              <Link
                href="https://vetsforfuturesl.com/about-2/"
                target="_blank"
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#3b82f6] hover:text-[#60a5fa] transition-colors"
              >
                Read our full story on vetsforfuturesl.com <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* Impact Section — accomplishments as cards, commitments as a horizontal list (visually distinct from a second grid) */}
        <section className="max-w-[1280px] mx-auto px-[24px] md:px-[48px] lg:px-[80px] py-[80px] space-y-[56px]">

          <div className="space-y-[40px]">
            <div className="space-y-2">
              <span className="text-[11px] font-bold tracking-[0.12em] text-[#94a3b8] uppercase">
                ● What We Have Accomplished
              </span>
              <h2 className="text-[32px] font-bold tracking-tight">Our Operational Footprint</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#161b26] border border-[#1e293b] rounded-xl p-[32px] space-y-4">
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-[#3b82f6] rounded-lg w-12 h-12 flex items-center justify-center">
                  <Heart size={20} />
                </div>
                <h3 className="text-[18px] font-bold text-white">1M+ Sterilized</h3>
                <p className="text-[14px] text-[#cbd5e1] leading-relaxed">
                  Over one million dogs and cats reached through nationwide sterilization campaigns since the program&apos;s founding.
                </p>
              </div>

              <div className="bg-[#161b26] border border-[#1e293b] rounded-xl p-[32px] space-y-4">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-[#22c55e] rounded-lg w-12 h-12 flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="text-[18px] font-bold text-white">1.3M+ Vaccinated</h3>
                <p className="text-[14px] text-[#cbd5e1] leading-relaxed">
                  Approximately 1.3 million animals vaccinated against rabies, helping cut Sri Lanka&apos;s annual human rabies deaths from 60+ to 20–30.
                </p>
              </div>

              <div className="bg-[#161b26] border border-[#1e293b] rounded-xl p-[32px] space-y-4">
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-[#f59e0b] rounded-lg w-12 h-12 flex items-center justify-center">
                  <Activity size={20} />
                </div>
                <h3 className="text-[18px] font-bold text-white">130+ Vets Trained</h3>
                <p className="text-[14px] text-[#cbd5e1] leading-relaxed">
                  Trained veterinary surgeons, assistants, and vaccinators — many now working in programs across Sri Lanka and abroad.
                </p>
              </div>
            </div>
          </div>

          {/* Commitments — horizontal numbered list instead of a second card grid */}
          <div className="space-y-[32px] border-t border-[#1e293b] pt-[48px]">
            <span className="text-[11px] font-bold tracking-[0.12em] text-[#94a3b8] uppercase">
              ● System Commitments
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-12">
              <div className="flex gap-4">
                <span className="text-[13px] font-bold text-[#3b82f6] pt-[2px]">01</span>
                <div className="space-y-1">
                  <h3 className="text-[16px] font-bold text-white">Transparency</h3>
                  <p className="text-[14px] text-[#94a3b8] leading-relaxed">
                    Real-time General Ledger tracking transaction flows without manual override interference.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="text-[13px] font-bold text-[#22c55e] pt-[2px]">02</span>
                <div className="space-y-1">
                  <h3 className="text-[16px] font-bold text-white">Meritocracy</h3>
                  <p className="text-[14px] text-[#94a3b8] leading-relaxed">
                    Operational authority mapped strictly to automated audit evaluations and credentials.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="text-[13px] font-bold text-[#f59e0b] pt-[2px]">03</span>
                <div className="space-y-1">
                  <h3 className="text-[16px] font-bold text-white">Accessibility</h3>
                  <p className="text-[14px] text-[#94a3b8] leading-relaxed">
                    Universal access across platforms ensuring seamless data transmission for remote operators.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section — text left, image right (alternates back from About) */}
        <section className="bg-[#0f1520] border-t border-[#1e293b] py-[80px]">
          <div className="max-w-[1280px] mx-auto px-[24px] md:px-[48px] lg:px-[80px] grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <span className="text-[11px] font-bold tracking-[0.12em] text-[#94a3b8] uppercase">
                ● Reach Our Teams
              </span>
              <h2 className="text-[32px] font-bold tracking-tight">Kalubovila Operations Office</h2>
              <p className="text-[#cbd5e1] text-[15px] leading-relaxed">
                Our central operations coordinates staff scheduling, payroll computations, and medical supply audits. Contact us for administrative inquiries.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3 text-[14px] text-[#cbd5e1]">
                  <MapPin size={18} className="text-[#3b82f6]" />
                  <span>No. 02, Edward Place, Sri Sunandarama Mw, Kalubovila, Sri Lanka</span>
                </div>
                <div className="flex items-center gap-3 text-[14px] text-[#cbd5e1]">
                  <Mail size={18} className="text-[#3b82f6]" />
                  <span>vetsforfuturesl@gmail.com</span>
                </div>
                <div className="flex items-center gap-3 text-[14px] text-[#cbd5e1]">
                  <Phone size={18} className="text-[#3b82f6]" />
                  <span>+94 77 722 6301</span>
                </div>
              </div>
            </div>

            <div className="h-[280px] md:h-[320px] rounded-xl overflow-hidden border border-[#2d3748] relative">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=1200&q=80')" }}
              />
              <div className="absolute inset-0 bg-[#0d1117]/35" />
              <div className="absolute bottom-6 left-6 text-[12px] font-mono text-[#cbd5e1] bg-[#0d1117]/80 py-1.5 px-3 rounded border border-white/5 flex items-center gap-1.5">
                <Clock size={14} /> Emergency Coordinates Active
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-[#1e293b] bg-[#0d1117] pt-[64px] pb-[32px] text-[14px]">
        <div className="max-w-[1280px] mx-auto px-[24px] md:px-[48px] lg:px-[80px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-[48px]">

          <div className="space-y-[16px]">
            <span className="text-[18px] font-bold text-white">VFF IMS</span>
            <p className="text-[#8b9ab0] text-[13px] leading-relaxed">
              Digitizing animal welfare operations through integrated administrative systems, secure RBAC validation, and immutable auditing ledgers.
            </p>
            <Link
              href="https://vetsforfuturesl.com/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#3b82f6] hover:text-[#60a5fa]"
            >
              vetsforfuturesl.com <ArrowRight size={12} />
            </Link>
          </div>

          <div className="space-y-[16px]">
            <span className="text-[12px] font-bold uppercase tracking-wider text-white">System Portals</span>
            <ul className="space-y-[10px] text-[#8b9ab0] text-[13px]">
              <li><Link href="/login" className="hover:text-white">User Portal Login</Link></li>
              <li><Link href="/login/admin" className="hover:text-white">Admin Portal Access</Link></li>
              <li><Link href="/register" className="hover:text-white">Staff Registry signup</Link></li>
            </ul>
          </div>

          <div className="space-y-[16px]">
            <span className="text-[12px] font-bold uppercase tracking-wider text-white">IMS Modules</span>
            <ul className="space-y-[10px] text-[#8b9ab0] text-[13px]">
              <li><span className="hover:text-white cursor-help">Human Resources & Attendance</span></li>
              <li><span className="hover:text-white cursor-help">Financial Management & Payroll</span></li>
              <li><span className="hover:text-white cursor-help">Program Operations & Stock</span></li>
              <li><span className="hover:text-white cursor-help">Forensic Audit Trail Logs</span></li>
            </ul>
          </div>

          <div className="space-y-[16px]">
            <span className="text-[12px] font-bold uppercase tracking-wider text-white">Reach Us</span>
            <ul className="space-y-[10px] text-[#8b9ab0] text-[13px]">
              <li className="flex items-center gap-2"><MapPin size={14} /> Kalubovila, Sri Lanka</li>
              <li className="flex items-center gap-2"><Mail size={14} /> vetsforfuturesl@gmail.com</li>
              <li className="flex items-center gap-2"><Phone size={14} /> +94 77 722 6301</li>
            </ul>
          </div>

        </div>

        <div className="max-w-[1280px] mx-auto px-[24px] md:px-[48px] lg:px-[80px] border-t border-[#1e293b]/60 pt-[24px] flex flex-col md:flex-row justify-between items-center gap-4 text-[#4b5563] text-[12px]">
          <span>© {new Date().getFullYear()} Vets For Future. All Rights Reserved.</span>
          <span>Internal Use Only · English Language Edition (SL)</span>
        </div>
      </footer>

    </div>
  );
}
import React, { useEffect, useMemo, useState } from 'react'
import Spline from '@splinetool/react-spline'
import { motion } from 'framer-motion'
import { Mail, Phone, Github, Linkedin, ExternalLink, Package as PackageIcon, PenTool, Smartphone, Globe, Rocket, ShieldCheck, ArrowRight, Send, CheckCircle2 } from 'lucide-react'

const useBackend = () => {
  return useMemo(() => import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000', [])
}

const Section = ({ id, title, caption, children }) => (
  <section id={id} className="scroll-mt-24 py-20 sm:py-24">
    <div className="mx-auto max-w-7xl px-5">
      <div className="mb-10 sm:mb-14">
        <p className="text-xs uppercase tracking-[0.2em] text-blue-600/80 mb-2">{caption}</p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
          {title}
        </h2>
      </div>
      {children}
    </div>
  </section>
)

function App() {
  const backend = useBackend()
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({ name: '', phone: '', email: '', remarks: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Simple validation
    if (!form.name || !form.email || !form.remarks) {
      setError('Please fill in your name, email and a short message.')
      return
    }
    const emailOk = /[^@\s]+@[^@\s]+\.[^@\s]+/.test(form.email)
    if (!emailOk) {
      setError('Please enter a valid email address.')
      return
    }

    try {
      setSubmitting(true)
      const res = await fetch(`${backend}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed to send. Please try again later.')
      setSubmitted(true)
      setForm({ name: '', phone: '', email: '', remarks: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const navItems = [
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#portfolio', label: 'Portfolio' },
    { href: '#packages', label: 'Packages & Articles' },
    { href: '#contact', label: 'Contact' },
  ]

  const skills = [
    { name: 'Flutter', icon: <Smartphone className="h-4 w-4" /> },
    { name: 'Dart', icon: <PenTool className="h-4 w-4" /> },
    { name: 'Firebase', icon: <Rocket className="h-4 w-4" /> },
    { name: 'REST APIs', icon: <Globe className="h-4 w-4" /> },
    { name: 'Web & Mobile', icon: <Globe className="h-4 w-4" /> },
    { name: 'Animations', icon: <Rocket className="h-4 w-4" /> },
    { name: 'SEO', icon: <ShieldCheck className="h-4 w-4" /> },
    { name: 'UI/UX', icon: <PenTool className="h-4 w-4" /> },
  ]

  // Smooth scroll behavior
  useEffect(() => {
    const handler = (e) => {
      const target = e.target.closest('a[href^="#"]')
      if (!target) return
      const id = target.getAttribute('href').slice(1)
      const el = document.getElementById(id)
      if (el) {
        e.preventDefault()
        window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' })
      }
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  const portfolioFallback = [
    {
      title: 'FinTrack – Personal Finance Manager',
      description: 'Cross‑platform budget and expense tracker with real‑time sync.',
      store: 'playstore',
      url: 'https://play.google.com',
      image: 'https://images.unsplash.com/photo-1553729784-e91953dec042?q=80&w=1200&auto=format&fit=crop',
      tags: ['Flutter', 'Firebase']
    },
    {
      title: 'FitPulse – Fitness Companion',
      description: 'Workouts, analytics and Apple/Google Health integration.',
      store: 'appstore',
      url: 'https://apple.com/app-store/',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop',
      tags: ['Flutter', 'HealthKit']
    },
    {
      title: 'ShopSwift – E‑commerce',
      description: 'High‑performance storefront with payments and push notifications.',
      store: 'playstore',
      url: 'https://play.google.com',
      image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1200&auto=format&fit=crop',
      tags: ['Flutter', 'Stripe']
    },
  ]

  const [projects, setProjects] = useState(portfolioFallback)
  const [packages, setPackages] = useState([
    {
      name: 'awesome_flutter_widgets',
      description: 'A set of polished, customizable Flutter UI widgets.',
      url: 'https://pub.dev'
    }
  ])
  const [articles, setArticles] = useState([
    {
      title: 'Optimizing Flutter Apps for 60fps Animations',
      url: 'https://medium.com/',
      published_at: '2024-01-10'
    },
    {
      title: 'Effective State Management in Flutter: A Practical Guide',
      url: 'https://medium.com/',
      published_at: '2023-11-02'
    }
  ])

  useEffect(() => {
    // Load showcase content from backend if available
    const load = async () => {
      try {
        const [pRes, pkgRes, artRes] = await Promise.all([
          fetch(`${backend}/projects`).catch(() => null),
          fetch(`${backend}/packages`).catch(() => null),
          fetch(`${backend}/articles`).catch(() => null),
        ])
        if (pRes && pRes.ok) {
          const data = await pRes.json()
          if (Array.isArray(data) && data.length) setProjects(data)
        }
        if (pkgRes && pkgRes.ok) {
          const data = await pkgRes.json()
          if (Array.isArray(data) && data.length) setPackages(data)
        }
        if (artRes && artRes.ok) {
          const data = await artRes.json()
          if (Array.isArray(data) && data.length) setArticles(data)
        }
      } catch {}
    }
    load()
  }, [backend])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-slate-800">
      {/* Top nav */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-slate-200/60">
        <div className="mx-auto max-w-7xl px-5 h-16 flex items-center justify-between">
          <a href="#home" className="font-extrabold text-xl tracking-tight">Flutter Dev</a>
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((n) => (
              <a key={n.href} href={n.href} className="text-sm hover:text-blue-600 transition-colors">
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-blue-600 text-white text-sm font-semibold px-4 py-2 shadow hover:bg-blue-700 transition-colors">
              Let’s talk <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="home" className="relative min-h-[82vh] lg:min-h-[86vh] overflow-hidden">
        <div className="absolute inset-0">
          <Spline scene="https://prod.spline.design/VJLoxp84lCdVfdZu/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        </div>
        <div className="relative z-10">
          <div className="mx-auto max-w-7xl px-5 pt-24 sm:pt-28 lg:pt-36 pb-24">
            <div className="grid lg:grid-cols-2 items-center gap-10">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="max-w-xl"
              >
                <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs shadow border border-slate-200/70">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                  Available for freelance & full‑time
                </div>
                <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
                  Flutter Mobile & Web Developer
                </h1>
                <p className="mt-4 text-base sm:text-lg text-slate-600">
                  3+ years crafting high‑quality apps. 20+ published on the App Store and Play Store. Package author and technical writer.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <a href="#portfolio" className="inline-flex items-center gap-2 rounded-full bg-blue-600 text-white font-semibold px-5 py-2.5 shadow hover:bg-blue-700 transition-colors">
                    View Work <ExternalLink className="h-4 w-4" />
                  </a>
                  <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-white text-slate-900 font-semibold px-5 py-2.5 shadow border border-slate-200/80 hover:bg-slate-50">
                    Contact Me <Send className="h-4 w-4" />
                  </a>
                </div>
                <div className="mt-6 flex items-center gap-4 text-slate-500">
                  <div className="inline-flex items-center gap-2 text-sm"><Smartphone className="h-4 w-4" /> 20+ Apps Published</div>
                  <div className="inline-flex items-center gap-2 text-sm"><PackageIcon className="h-4 w-4" /> Flutter Package Author</div>
                </div>
              </motion.div>
              <div className="pointer-events-none" />
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-white/80" />
      </section>

      {/* About */}
      <Section id="about" title="About Me" caption="Introduction">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-slate-600 text-lg leading-relaxed">
            I’m a Flutter developer specializing in building fast, elegant mobile and web apps. Over the past 3+ years, I’ve shipped 20+ apps to the App Store and Play Store, authored an open‑source Flutter package, and written technical articles on Medium.
          </motion.p>
          <motion.ul initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.05 }} className="space-y-3 text-slate-700">
            {[
              'End‑to‑end product delivery: design, development, deployment',
              'Clean architecture, strong state management, and testing',
              'Performance‑focused with fluid animations and 60fps targets',
              'Pragmatic problem‑solver and clear communicator',
            ].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
                <span>{t}</span>
              </li>
            ))}
          </motion.ul>
        </div>
      </Section>

      {/* Skills */}
      <Section id="skills" title="Skills & Tooling" caption="Expertise">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {skills.map((s) => (
            <motion.div key={s.name} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35 }} className="group rounded-xl border border-slate-200 bg-white/80 backdrop-blur p-4 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-2 text-slate-700">
                <span className="text-blue-600">{s.icon}</span>
                <span className="font-semibold">{s.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Portfolio */}
      <Section id="portfolio" title="Featured Work" caption="Portfolio">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <motion.a
              key={i}
              href={p.url || '#'}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="group rounded-2xl overflow-hidden border border-slate-200 bg-white shadow hover:shadow-lg transition-all"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img src={p.image || 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop'} alt={p.title} className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-blue-600/80 mb-2">
                  {p.store && <span className="uppercase tracking-wide">{p.store}</span>}
                  <span className="opacity-60">•</span>
                  <span className="uppercase tracking-wide">Flutter</span>
                </div>
                <h3 className="font-semibold text-lg leading-snug">{p.title}</h3>
                {p.description && <p className="mt-1 text-sm text-slate-600">{p.description}</p>}
                {Array.isArray(p.tags) && p.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span key={t} className="text-xs rounded-full bg-slate-100 px-2 py-1">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </motion.a>
          ))}
        </div>
      </Section>

      {/* Packages & Articles */}
      <Section id="packages" title="Packages & Articles" caption="Community">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-xl mb-4 flex items-center gap-2"><PackageIcon className="h-5 w-5 text-blue-600" /> Flutter Packages</h3>
            <div className="space-y-4">
              {packages.map((pkg, i) => (
                <a key={i} href={pkg.url || '#'} target="_blank" rel="noreferrer" className="block rounded-xl border border-slate-200 bg-white/80 p-4 hover:shadow-md transition-shadow">
                  <div className="font-semibold flex items-center gap-2">{pkg.name}<ExternalLink className="h-4 w-4 text-slate-400" /></div>
                  {pkg.description && <p className="text-sm text-slate-600 mt-1">{pkg.description}</p>}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-xl mb-4 flex items-center gap-2"><PenTool className="h-5 w-5 text-blue-600" /> Medium Articles</h3>
            <div className="space-y-4">
              {articles.map((a, i) => (
                <a key={i} href={a.url} target="_blank" rel="noreferrer" className="block rounded-xl border border-slate-200 bg-white/80 p-4 hover:shadow-md transition-shadow">
                  <div className="font-semibold flex items-center gap-2">{a.title}<ExternalLink className="h-4 w-4 text-slate-400" /></div>
                  {a.published_at && <p className="text-xs text-slate-500 mt-1">{a.published_at}</p>}
                </a>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Contact */}
      <Section id="contact" title="Let’s build something great" caption="Contact">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="text-slate-600 mb-6">Have a project in mind or want to collaborate? Drop a message — I typically reply within 24 hours.</p>
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <a href="mailto:hello@example.com" className="inline-flex items-center gap-2 hover:text-blue-600"><Mail className="h-4 w-4" /> hello@example.com</a>
              <a href="tel:+1234567890" className="inline-flex items-center gap-2 hover:text-blue-600"><Phone className="h-4 w-4" /> +1 234 567 890</a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-blue-600"><Github className="h-4 w-4" /> GitHub</a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-blue-600"><Linkedin className="h-4 w-4" /> LinkedIn</a>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Your name" className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Phone Number</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Optional" className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="you@example.com" className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-slate-700">Remarks</label>
                <textarea value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} required placeholder="Tell me about your project..." rows={4} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            {submitted && !error && (
              <p className="mt-3 text-sm text-emerald-600 inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Thanks! Your message has been sent.</p>
            )}
            <button type="submit" disabled={submitting} className="mt-5 inline-flex items-center gap-2 rounded-full bg-blue-600 text-white font-semibold px-5 py-2.5 shadow hover:bg-blue-700 disabled:opacity-60">
              {submitting ? 'Sending…' : 'Send Message'} <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </Section>

      <footer className="py-10 border-t border-slate-200/70 bg-white/60">
        <div className="mx-auto max-w-7xl px-5 text-sm text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Flutter Developer. All rights reserved.</p>
          <p>Designed with care • Fast, responsive, SEO‑friendly</p>
        </div>
      </footer>
    </div>
  )
}

export default App

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Menu,
  Star,
  X,
  Shield,
  CalendarCheck2,
  Stethoscope,
  HeartPulse,
  FileText,
  Clock,
} from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Doctors', href: '#doctors' },
  { label: 'Blog', href: '#blog' },
];

const AVATARS = [
  'https://cdn.sceneai.art/Only%20man%20image/0ccd6017-25fc-493b-abdf-321915dde101.jpg',
  'https://cdn.sceneai.art/Only%20man%20image/7e1339ef-7a01-4979-93c8-21d97af291ee.webp',
  'https://cdn.sceneai.art/Image%20for%20any%20section/2d8032d8-c1cd-4827-84db-0aeba1109c1b.jpg',
  'https://cdn.sceneai.art/Image%20for%20any%20section/470b31f2-d1b5-4730-96a2-aca680204172.jpg',
];

const HERO_BG =
  'https://cdn.sceneai.art/Hero%20Section%20Video/802fa01f-44ef-4ab4-ac73-62015fe06eef.png';

const HEADING_LINES = ['Healthcare for Good', 'Today. Tomorrow. Always.'];
const SUBTEXT_LINES = [
  'Take charge of your well-being and explore the many',
  'advantages of modern healthcare through our trusted platform.',
];

const SERVICES = [
  {
    icon: CalendarCheck2,
    title: 'Smart scheduling',
    body: 'Book, confirm, and manage visits in real time across patients, doctors, and front desk.',
  },
  {
    icon: FileText,
    title: 'Unified records',
    body: 'Vitals, diagnoses, notes, and attachments live in one secure clinical timeline.',
  },
  {
    icon: Shield,
    title: 'Enterprise security',
    body: 'Role-based access, audit trails, and encrypted sessions designed for care teams.',
  },
  {
    icon: HeartPulse,
    title: 'Continuous care',
    body: 'Follow-ups, lab workflows, and prescriptions stay connected from intake to outcome.',
  },
];

const DOCTORS = [
  {
    name: 'Dr. Sarah Chen',
    role: 'Cardiology',
    img: AVATARS[0],
    bio: 'Preventive heart care and long-term risk management.',
  },
  {
    name: 'Dr. James Okonkwo',
    role: 'Internal Medicine',
    img: AVATARS[1],
    bio: 'Whole-person primary care with evidence-based plans.',
  },
  {
    name: 'Dr. Maya Patel',
    role: 'Family Medicine',
    img: AVATARS[2],
    bio: 'Family-focused consultations and wellness programs.',
  },
  {
    name: 'Dr. Ethan Brooks',
    role: 'Diagnostics',
    img: AVATARS[3],
    bio: 'Lab-informed diagnosis and rapid test coordination.',
  },
];

const BLOG_POSTS = [
  {
    tag: 'Wellness',
    title: 'Five habits that protect long-term heart health',
    excerpt: 'Small daily choices compound. Here’s what clinicians recommend most often.',
    date: 'Jun 12, 2026',
  },
  {
    tag: 'Platform',
    title: 'How digital records reduce appointment friction',
    excerpt: 'From intake to discharge, a continuous record keeps every handoff clear.',
    date: 'May 28, 2026',
  },
  {
    tag: 'Care team',
    title: 'Building trust between patients and clinicians online',
    excerpt: 'Secure messaging, transparent notes, and shared plans change the experience.',
    date: 'May 4, 2026',
  },
];

function WordReveal({ lines, className, wordClassName, delay = 0, step = 70, onDone }) {
  const words = useMemo(
    () =>
      lines.map((line) =>
        line.split(' ').map((word, i, arr) => (i < arr.length - 1 ? `${word} ` : word))
      ),
    [lines]
  );

  const totalWords = words.reduce((sum, line) => sum + line.length, 0);
  const [visibleCount, setVisibleCount] = useState(0);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    let wordIndex = 0;
    const timers = [];

    const start = window.setTimeout(() => {
      const tick = () => {
        wordIndex += 1;
        setVisibleCount(wordIndex);
        if (wordIndex < totalWords) {
          timers.push(window.setTimeout(tick, step));
        } else if (onDoneRef.current) {
          onDoneRef.current();
        }
      };
      tick();
    }, delay);

    return () => {
      window.clearTimeout(start);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [delay, step, totalWords]);

  let flatIndex = 0;

  return (
    <div className={className}>
      {words.map((lineWords, lineIdx) => (
        <span key={lineIdx} className="block">
          {lineWords.map((word) => {
            const index = flatIndex;
            flatIndex += 1;
            const isVisible = index < visibleCount;
            return (
              <span
                key={`${lineIdx}-${index}`}
                className={`${wordClassName} inline-block transition-all duration-500 ease-out ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
                }`}
              >
                {word}
              </span>
            );
          })}
        </span>
      ))}
    </div>
  );
}

const Home = () => {
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [headingDone, setHeadingDone] = useState(false);
  const handleHeadingDone = useCallback(() => setHeadingDone(true), []);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="bg-white text-slate-900">
      {/* ── Hero ── */}
      <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0" aria-hidden="true">
          <img src={HERO_BG} alt="" className="h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
        </div>

        <header
          className={`absolute inset-x-0 top-0 z-50 transition-all duration-700 ${
            mounted ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'
          }`}
        >
          <nav
            className="mx-auto flex max-w-[1340px] items-center justify-between px-5 py-5 sm:px-8 lg:px-10"
            aria-label="Global"
          >
            <a href="#home" className="text-[18px] font-medium tracking-tight text-white">
              Clinova
            </a>

            <div className="hidden items-center gap-8 md:flex">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[14px] font-normal text-white/90 transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="hidden text-[14px] font-normal text-white/85 transition-colors hover:text-white md:inline"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="group hidden items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[13px] font-medium text-slate-900 shadow-sm transition-all hover:bg-white/90 md:inline-flex"
              >
                Book An Appointment
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-white/25 p-2 text-white md:hidden"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                onClick={() => setMenuOpen((v) => !v)}
              >
                {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </nav>

          {menuOpen && (
            <div className="border-t border-white/10 bg-black/70 px-5 py-4 backdrop-blur-md md:hidden">
              <div className="mx-auto flex max-w-[1340px] flex-col gap-3">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-[14px] font-normal text-white/90"
                  >
                    {link.label}
                  </a>
                ))}
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-[14px] font-normal text-white/90"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[13px] font-medium text-slate-900"
                >
                  Book An Appointment
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          )}
        </header>

        <section
          id="home"
          className="relative z-10 flex min-h-screen scroll-mt-0 flex-col justify-end"
        >
          <div className="mx-auto w-full max-w-[1340px] px-5 pb-10 pt-28 sm:px-8 sm:pb-12 lg:px-10 lg:pb-14">
            <div
              className={`max-w-xl transition-all duration-700 ${
                mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
            >
              <div
                className={`mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 backdrop-blur-sm transition-all delay-100 duration-700 ${
                  mounted ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
                }`}
              >
                <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-slate-900">
                  Trusted
                </span>
                <span className="pr-1 text-[14px] font-normal text-white/95">
                  20,000+ Patients Worldwide
                </span>
              </div>

              <WordReveal
                lines={HEADING_LINES}
                delay={280}
                step={75}
                className="text-[42px] font-medium leading-[1.15] tracking-tight text-white"
                wordClassName="mr-[0.28em] last:mr-0"
                onDone={handleHeadingDone}
              />

              <div className="mt-4 max-w-md">
                {headingDone ? (
                  <WordReveal
                    lines={SUBTEXT_LINES}
                    delay={80}
                    step={45}
                    className="text-[15px] font-normal leading-relaxed text-white/85"
                    wordClassName="mr-[0.28em] last:mr-0"
                  />
                ) : (
                  <p
                    className="text-[15px] font-normal leading-relaxed text-transparent"
                    aria-hidden="true"
                  >
                    Take charge of your well-being and explore the many
                    <br />
                    advantages of modern healthcare through our trusted platform.
                  </p>
                )}
              </div>

              <div
                className={`mt-7 flex flex-wrap items-center gap-3 transition-all delay-500 duration-700 ${
                  mounted ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
                }`}
              >
                <Link
                  to="/register"
                  className="group inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[13px] font-medium text-slate-900 shadow-sm transition-all hover:bg-white/90"
                >
                  Book An Appointment
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <a
                  href="#about"
                  className="group inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-transparent px-4 py-2 text-[13px] font-medium text-white transition-all hover:bg-white/10"
                >
                  About Us
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>
            </div>

            <div
              className={`mt-10 flex items-center gap-3 transition-all delay-300 duration-700 ${
                mounted ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
              }`}
            >
              <div className="flex -space-x-2.5">
                {AVATARS.map((src, i) => (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    className="h-9 w-9 rounded-full border-2 border-white/90 object-cover shadow-md"
                    style={{ zIndex: AVATARS.length - i }}
                  />
                ))}
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-0.5" aria-label="5-star rating">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                      strokeWidth={0}
                    />
                  ))}
                </div>
                <p className="text-[13px] font-normal text-white/90">Baser on 20K+ Reviews</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── About ── */}
      <section id="about" className="scroll-mt-8 border-t border-slate-100 bg-white py-20 sm:py-24">
        <div className="mx-auto grid max-w-[1340px] grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:px-10">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-slate-400">
              About Clinova
            </p>
            <h2 className="mt-3 text-[28px] font-medium tracking-tight text-slate-900 sm:text-[32px]">
              Care that feels calm,
              <br />
              secure, and modern.
            </h2>
            <p className="mt-4 max-w-lg text-[15px] font-normal leading-relaxed text-slate-500">
              Clinova brings appointments, medical records, labs, and team workflows into one
              premium workspace — so clinicians spend less time on software and more time with
              patients.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { value: '20K+', label: 'Patients' },
                { value: '99.9%', label: 'Uptime' },
                { value: '24/7', label: 'Access' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-slate-200/70 bg-slate-50/50 p-4">
                  <p className="text-[22px] font-medium tracking-tight text-slate-900">
                    {stat.value}
                  </p>
                  <p className="mt-0.5 text-[12px] font-normal text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-slate-950 p-8 text-white shadow-premium-lg sm:p-10">
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                background:
                  'radial-gradient(circle at 80% 20%, rgba(59,130,246,0.35), transparent 50%)',
              }}
            />
            <Stethoscope className="relative h-8 w-8 text-white/80" strokeWidth={1.5} />
            <h3 className="relative mt-6 text-[20px] font-medium tracking-tight">
              Built for every care role
            </h3>
            <p className="relative mt-3 text-[14px] font-normal leading-relaxed text-white/65">
              Patients, doctors, reception, lab technicians, and admins each get a focused
              experience — with shared data and clear permissions underneath.
            </p>
            <ul className="relative mt-6 space-y-3 text-[13.5px] font-normal text-white/80">
              {[
                'HIPAA-aligned audit logging',
                'Real-time appointment sync',
                'Secure file attachments',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="scroll-mt-8 border-t border-slate-100 bg-background py-20 sm:py-24">
        <div className="mx-auto max-w-[1340px] px-5 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-slate-400">
              Services
            </p>
            <h2 className="mt-3 text-[28px] font-medium tracking-tight text-slate-900 sm:text-[32px]">
              Everything a modern care team needs
            </h2>
            <p className="mt-3 text-[15px] font-normal text-slate-500">
              One platform covering the full clinical journey — from booking to follow-up.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="card group p-6 transition-all hover:shadow-premium-lg"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-600 transition-colors group-hover:border-slate-200 group-hover:bg-white">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <h3 className="text-[15px] font-medium text-slate-900">{title}</h3>
                <p className="mt-2 text-[13.5px] font-normal leading-relaxed text-slate-500">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Doctors ── */}
      <section id="doctors" className="scroll-mt-8 border-t border-slate-100 bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-[1340px] px-5 sm:px-8 lg:px-10">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-slate-400">
                Doctors
              </p>
              <h2 className="mt-3 text-[28px] font-medium tracking-tight text-slate-900 sm:text-[32px]">
                Meet our specialists
              </h2>
              <p className="mt-2 max-w-md text-[15px] font-normal text-slate-500">
                Experienced clinicians focused on clear communication and outcomes.
              </p>
            </div>
            <Link to="/register" className="btn btn-primary">
              Book a visit
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {DOCTORS.map((doc) => (
              <article
                key={doc.name}
                className="card overflow-hidden transition-all hover:shadow-premium-lg"
              >
                <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src={doc.img}
                    alt={doc.name}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                    {doc.role}
                  </p>
                  <h3 className="mt-1 text-[15px] font-medium text-slate-900">{doc.name}</h3>
                  <p className="mt-2 text-[13px] font-normal leading-relaxed text-slate-500">
                    {doc.bio}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Blog ── */}
      <section id="blog" className="scroll-mt-8 border-t border-slate-100 bg-background py-20 sm:py-24">
        <div className="mx-auto max-w-[1340px] px-5 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-slate-400">
              Blog
            </p>
            <h2 className="mt-3 text-[28px] font-medium tracking-tight text-slate-900 sm:text-[32px]">
              Insights for better care
            </h2>
            <p className="mt-3 text-[15px] font-normal text-slate-500">
              Practical guidance on health, clinical workflows, and digital care.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            {BLOG_POSTS.map((post) => (
              <article
                key={post.title}
                className="card flex flex-col p-6 transition-all hover:shadow-premium-lg"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="badge badge-neutral">{post.tag}</span>
                  <span className="inline-flex items-center gap-1 text-[12px] font-normal text-slate-400">
                    <Clock className="h-3 w-3" />
                    {post.date}
                  </span>
                </div>
                <h3 className="mt-4 text-[16px] font-medium leading-snug text-slate-900">
                  {post.title}
                </h3>
                <p className="mt-2 flex-1 text-[13.5px] font-normal leading-relaxed text-slate-500">
                  {post.excerpt}
                </p>
                <a
                  href="#blog"
                  className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-900 transition-colors hover:text-slate-600"
                >
                  Read more
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="border-t border-slate-100 bg-slate-950 py-16 text-white sm:py-20">
        <div className="mx-auto flex max-w-[1340px] flex-col items-start justify-between gap-8 px-5 sm:flex-row sm:items-center sm:px-8 lg:px-10">
          <div>
            <h2 className="text-[24px] font-medium tracking-tight sm:text-[28px]">
              Ready to experience Clinova?
            </h2>
            <p className="mt-2 max-w-md text-[14px] font-normal text-white/60">
              Create your account in minutes and join a calmer way to manage healthcare.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/register"
              className="group inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-[13px] font-medium text-slate-900 transition-all hover:bg-white/90"
            >
              Get started
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/30 px-5 py-2.5 text-[13px] font-medium text-white transition-all hover:bg-white/10"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 bg-slate-950 py-8 text-white">
        <div className="mx-auto flex max-w-[1340px] flex-col items-center justify-between gap-4 px-5 sm:flex-row sm:px-8 lg:px-10">
          <span className="text-[15px] font-medium tracking-tight">Clinova</span>
          <div className="flex flex-wrap items-center justify-center gap-5 text-[13px] font-normal text-white/50">
            {NAV_LINKS.filter((l) => l.href !== '#home').map((link) => (
              <a key={link.label} href={link.href} className="transition-colors hover:text-white">
                {link.label}
              </a>
            ))}
          </div>
          <p className="text-[12.5px] font-normal text-white/40">
            © {new Date().getFullYear()} Clinova. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

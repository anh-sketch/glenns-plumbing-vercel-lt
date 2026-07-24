import { useEffect } from "react";
import { Link } from "react-router-dom";
import { BookForm } from "@/components/forms/BookForm";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileCallButton } from "@/components/layout/MobileCallButton";
import { Faq } from "@/components/marketing/Faq";
import { Process } from "@/components/marketing/Process";
import { TrustBand } from "@/components/marketing/TrustBand";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { BIZ } from "@/lib/biz";
import { FORM_SELECT, HOME_SERVICES } from "@/lib/data";
import { track, trackCtaClick } from "@/lib/track";

// Analytics slug for this borough spoke page (hub: /24-hour-plumber-nyc).
const SLUG = "emergency-plumber-brooklyn";

const PAGE_URL = "https://glennph.com/emergency-plumber-brooklyn";

const META_DESCRIPTION =
  `Emergency plumber in Brooklyn — a licensed NYC Master Plumber (Lic# ${BIZ.licenseNo}) answers 24/7 ` +
  `for burst pipes, sewer backups & no-heat calls in Park Slope, Williamsburg, Bed-Stuy & across Brooklyn. ` +
  `Upfront flat-rate pricing, 12-month workmanship guarantee. Call ${BIZ.phone}.`;

const EMERGENCIES = [
  { icon: "droplets",       title: "Burst & leaking pipes",         desc: "A split supply line in a brownstone soaks two floors fast. We shut the water down and repair it on the spot." },
  { icon: "waves",          title: "Sewer & drain backups",         desc: "Brooklyn's older clay and cast-iron mains clog and back up into basements. We snake and camera the line the same visit." },
  { icon: "flame",          title: "No hot water",                  desc: "A dead water heater in a multifamily can't wait for Monday. We diagnose, repair, or replace — fast." },
  { icon: "snowflake",      title: "No heat / boiler down",         desc: "Radiators cold in January? Boiler and heating failures in Brooklyn homes are handled around the clock." },
  { icon: "shower-head",    title: "Overflowing toilet or fixture", desc: "When plunging won't stop it, the problem is deeper in the line. We stop the overflow and clear the cause." },
  { icon: "alert-triangle", title: "Flooding & sump-pump failure",  desc: "Basement apartments flood in hours when a sump pump dies mid-storm. We pump down, replace, and test before we leave." },
];

// Coverage is copy only — neighborhood pages don't exist, so nothing links.
const NEIGHBORHOODS = [
  "Park Slope", "Williamsburg", "Brooklyn Heights", "Bed-Stuy", "Greenpoint",
  "Bushwick", "Crown Heights", "Fort Greene", "Flatbush", "Bay Ridge",
  "Sunset Park", "Dumbo",
];

const FAQ_ITEMS = [
  {
    q: "Do you handle emergency plumbing calls anywhere in Brooklyn?",
    a: "Yes — from Greenpoint down to Bay Ridge, including Park Slope, Williamsburg, Bed-Stuy, Bushwick, Crown Heights, Flatbush, and Sunset Park. If you're in Brooklyn and water, gas, or heat is the problem, we take the call 24/7.",
  },
  {
    q: "How fast can you get to me in Brooklyn?",
    a: `For true emergencies a truck rolls as soon as you call ${BIZ.phone} — nights, weekends, and holidays included. For everything else we give you a same-day arrival window on the phone, not a vague promise.`,
  },
  {
    q: "Do you work on brownstones and older Brooklyn buildings?",
    a: "Every week. Pre-war rowhouses, brownstones with original cast-iron stacks, converted multifamilies, and basement apartments are our bread and butter — all repairs done to NYC code by a licensed master plumber.",
  },
  {
    q: "How much does an emergency plumber cost in Brooklyn?",
    a: "You approve an upfront flat-rate price before any work begins — no overtime hourly meter, no surprise add-ons. Most repairs start from $350, drain clearing from $375, and the price we quote is the price you pay.",
  },
  {
    q: "Are you licensed and insured for work in Brooklyn?",
    a: `Yes. Every job runs under ${BIZ.owner}, NYC Licensed Master Plumber Lic# ${BIZ.licenseNo} — bonded and insured citywide. All work, including emergency calls, is backed by our 12-month workmanship guarantee in writing.`,
  },
];

// References the site-wide Plumber node from index.html instead of redefining it.
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: "Emergency Plumber Brooklyn — 24/7 Same-Day Service",
      description: META_DESCRIPTION,
      inLanguage: "en-US",
      about: { "@id": "https://glennph.com/#business" },
    },
    {
      "@type": ["Service", "EmergencyService"],
      "@id": `${PAGE_URL}#service`,
      name: "Emergency Plumbing in Brooklyn",
      serviceType: "Emergency plumber",
      provider: { "@id": "https://glennph.com/#business" },
      areaServed: { "@type": "City", name: "Brooklyn" },
      availableChannel: {
        "@type": "ServiceChannel",
        servicePhone: {
          "@type": "ContactPoint",
          telephone: "+16469632616",
          contactType: "emergency",
          areaServed: "Brooklyn",
          availableLanguage: "en",
          hoursAvailable: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            opens: "00:00",
            closes: "23:59",
          },
        },
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${PAGE_URL}#faq`,
      mainEntity: FAQ_ITEMS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function EmergencyPlumberBrooklyn() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Emergency Plumber Brooklyn — 24/7 Same-Day Service | Glenn's Plumbing";
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", META_DESCRIPTION);
    track("service_page_view", { service_slug: SLUG, name: "brooklyn_landing" });
  }, []);

  return (
    <>
      <RevealObserver />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c") }}
      />
      <Header variant="service" />
      <main>
        {/* Hero — call CTA primary, mirroring the /24-hour-plumber-nyc hub */}
        <section id="top" className="relative overflow-hidden bg-navy-deep">
          <div
            className="absolute inset-0 hero-photo"
            style={{ backgroundImage: "url('/images/hero-pipe-leak-repair.jpg')" }}
          ></div>
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(100deg, rgba(15,28,46,.94) 0%, rgba(15,28,46,.86) 42%, rgba(21,41,63,.55) 100%)",
            }}
          ></div>
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(0deg, rgba(15,28,46,.85) 0%, transparent 38%)" }}
          ></div>

          <div className="relative mx-auto max-w-7xl px-5 sm:px-8 pt-16 sm:pt-20 lg:pt-24 pb-16 lg:pb-24">
            <div className="max-w-2xl">
              <Reveal>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 backdrop-blur px-3.5 py-1.5">
                  <span className="pulse-dot text-emerald-400 inline-flex">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                  </span>
                  <span className="text-[13px] font-bold text-white/90">
                    Brooklyn emergency line open now — answered 24/7
                  </span>
                </div>
              </Reveal>

              <Reveal delay={80}>
                <h1 className="mt-6 font-display font-extrabold text-white leading-[1.05] text-[38px] sm:text-[50px] lg:text-[58px]">
                  Emergency Plumber in Brooklyn.
                  <br className="hidden sm:block" />
                  <span className="text-amber-soft">Same-day service</span> — day or night.
                </h1>
              </Reveal>

              <Reveal delay={160}>
                <p className="mt-5 text-[18px] lg:text-[19px] text-white/75 leading-relaxed max-w-xl">
                  Burst pipe in a Park Slope brownstone, sewer backup in Bed-Stuy, no heat in
                  Williamsburg — we answer, dispatch, and fix it with upfront flat-rate pricing,
                  borough-wide.
                </p>
              </Reveal>

              <Reveal delay={240}>
                <div className="mt-8 flex flex-col sm:flex-row gap-3.5">
                  <a
                    href={BIZ.phoneHref}
                    data-track-name="bk_hero_call"
                    data-service-slug={SLUG}
                    className="btn sheen inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-blue text-white font-bold text-[17px] shadow-lift hover:bg-blue-deep"
                  >
                    <Icon name="phone-call" className="w-5 h-5" />
                    Call {BIZ.phone}
                  </a>
                  <a
                    href="#book"
                    onClick={() => trackCtaClick("bk_hero_quote", { service_slug: SLUG })}
                    className="btn inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-white text-navy font-bold text-[17px] shadow-soft hover:bg-white/90"
                  >
                    Get a Free Quote
                    <Icon name="arrow-right" className="w-5 h-5 text-blue" />
                  </a>
                </div>
              </Reveal>

              <Reveal delay={320}>
                <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-[14px] font-semibold text-white/80">
                  <span className="inline-flex items-center gap-2">
                    <Icon name="shield-check" className="w-[18px] h-[18px] text-amber-soft" /> NYC
                    Lic# {BIZ.licenseNo}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-white/30"></span>
                  <span className="inline-flex items-center gap-2">
                    <Icon name="badge-check" className="w-[18px] h-[18px] text-amber-soft" /> Bonded
                    &amp; insured
                  </span>
                  <span className="w-1 h-1 rounded-full bg-white/30"></span>
                  <span className="inline-flex items-center gap-2">
                    <Icon name="home" className="w-[18px] h-[18px] text-amber-soft" /> {BIZ.homes}{" "}
                    NYC homes
                  </span>
                  <span className="w-1 h-1 rounded-full bg-white/30"></span>
                  <span className="inline-flex items-center gap-2">
                    <Icon name="star" className="w-[18px] h-[18px] text-amber-soft fill-current" />{" "}
                    {BIZ.rating}★
                  </span>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Brooklyn emergencies */}
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16 lg:py-24">
            <Reveal className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-blue font-bold text-[13px] tracking-[0.16em] uppercase">
                <span className="w-6 h-px bg-blue"></span> Don't wait until morning
              </div>
              <h2 className="mt-4 font-display font-extrabold text-navy text-[30px] sm:text-[40px] leading-[1.08]">
                Brooklyn plumbing emergencies we handle
              </h2>
              <p className="mt-4 text-[17px] text-muted leading-relaxed">
                Older housing stock means older pipes. If it's one of these, call now — every hour
                of waiting makes the damage (and the repair) bigger.
              </p>
            </Reveal>
            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {EMERGENCIES.map((p, i) => (
                <Reveal key={p.title} delay={(i % 3) * 70}>
                  <div className="lift h-full bg-white rounded-2xl border border-line p-6 shadow-soft hover:shadow-lift">
                    <div className="w-12 h-12 rounded-xl bg-blue/10 flex items-center justify-center">
                      <Icon name={p.icon} className="w-6 h-6 text-blue" />
                    </div>
                    <h3 className="mt-4 font-display font-bold text-navy text-[17px] leading-snug">
                      {p.title}
                    </h3>
                    <p className="mt-1.5 text-[14px] text-muted leading-relaxed">{p.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={120}>
              <p className="mt-8 text-[14.5px] text-muted">
                Not sure it's an emergency?{" "}
                <a
                  href={BIZ.phoneHref}
                  data-track-name="bk_body_call"
                  data-service-slug={SLUG}
                  className="font-bold text-blue"
                >
                  Call {BIZ.phone}
                </a>{" "}
                — we'll tell you honestly over the phone, free.
              </p>
            </Reveal>
          </div>
        </section>

        <Process />

        {/* Services — links to the six live service pages */}
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16 lg:py-24">
            <Reveal className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-blue font-bold text-[13px] tracking-[0.16em] uppercase">
                <span className="w-6 h-px bg-blue"></span> Handled around the clock
              </div>
              <h2 className="mt-4 font-display font-extrabold text-navy text-[30px] sm:text-[40px] leading-[1.08]">
                Emergency plumbing services across Brooklyn
              </h2>
              <p className="mt-4 text-[17px] text-muted leading-relaxed">
                Every service below runs on the same promise: a licensed master plumber, an upfront
                flat-rate price you approve first, and a 12-month workmanship guarantee.
              </p>
            </Reveal>
            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {HOME_SERVICES.map((s, i) => (
                <Reveal key={s.slug} delay={(i % 3) * 80}>
                  <Link
                    to={`/services/${s.slug}`}
                    onClick={() => trackCtaClick("bk_service_card", { service_slug: SLUG, target: s.slug })}
                    className="lift group relative flex flex-col h-full bg-white rounded-2xl border border-line p-7 shadow-soft hover:shadow-lift hover:border-transparent"
                  >
                    <span className="absolute inset-x-0 top-0 h-1 rounded-t-2xl scale-x-0 group-hover:scale-x-100 transition-transform origin-left bg-blue"></span>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-blue/10">
                      <Icon name={s.icon} className="w-7 h-7 text-blue" />
                    </div>
                    <h3 className="mt-5 font-display font-bold text-navy text-[20px]">{s.title}</h3>
                    <p className="mt-2 text-[15px] text-muted leading-relaxed flex-1">{s.benefit}</p>
                    <div className="mt-5 pt-5 border-t border-line flex items-center justify-between">
                      <span className="leading-tight">
                        <span className="block text-[11px] font-bold uppercase tracking-wide text-muted">
                          {s.bigTicket ? "Free estimate" : "Pricing"}
                        </span>
                        <span className="block font-display font-extrabold text-navy text-[18px]">
                          {s.price}
                        </span>
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[14px] font-bold text-navy/70 group-hover:text-blue transition-colors">
                        Learn more
                        <Icon
                          name="arrow-right"
                          className="w-4 h-4 transition-transform group-hover:translate-x-1"
                        />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Neighborhood coverage — text only, no neighborhood pages exist */}
        <section className="bg-white border-t border-line">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16 lg:py-24">
            <Reveal className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-blue font-bold text-[13px] tracking-[0.16em] uppercase">
                <span className="w-6 h-px bg-blue"></span> Where we work
              </div>
              <h2 className="mt-4 font-display font-extrabold text-navy text-[30px] sm:text-[40px] leading-[1.08]">
                Covering Brooklyn, neighborhood by neighborhood
              </h2>
              <p className="mt-4 text-[17px] text-muted leading-relaxed">
                From brownstone blocks to new waterfront towers, our trucks run through Brooklyn
                every day:
              </p>
            </Reveal>
            <Reveal delay={80}>
              <div className="mt-8 flex flex-wrap gap-2.5">
                {NEIGHBORHOODS.map((n) => (
                  <span
                    key={n}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-[14px] font-semibold text-navy shadow-soft"
                  >
                    <Icon name="map-pin" className="w-4 h-4 text-blue" />
                    {n}
                  </span>
                ))}
              </div>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-8 text-[14.5px] text-muted">
                Don't see your neighborhood?{" "}
                <a
                  href={BIZ.phoneHref}
                  data-track-name="bk_body_call"
                  data-service-slug={SLUG}
                  className="font-bold text-blue"
                >
                  Call {BIZ.phone}
                </a>{" "}
                — if you're in Brooklyn, you're covered. We also serve the rest of the city; see
                our{" "}
                <Link
                  to="/24-hour-plumber-nyc"
                  onClick={() => trackCtaClick("bk_hub_link", { service_slug: SLUG, target: "24-hour-plumber-nyc" })}
                  className="font-bold text-blue"
                >
                  24-hour plumber NYC
                </Link>{" "}
                page.
              </p>
            </Reveal>
          </div>
        </section>

        <Faq heading="Emergency plumber Brooklyn — your questions, answered" items={FAQ_ITEMS} />

        <BookForm
          variant="service"
          heading="Book your Brooklyn emergency plumber"
          presetService={FORM_SELECT.emergency}
          source={`service:${SLUG}`}
        />

        <TrustBand />
      </main>
      <Footer variant="service" />
      <MobileCallButton />
    </>
  );
}

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BIZ } from "@/lib/biz";

const EFFECTIVE_DATE = "July 14, 2026";
const SMS_PROGRAM = "Glenn's Plumbing Alerts";

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display font-extrabold text-navy text-[22px] sm:text-[26px] mt-11 mb-3 scroll-mt-32">
      {children}
    </h2>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-[15.5px] leading-relaxed text-muted mt-3">{children}</p>;
}

export default function Terms() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header variant="service" />

      {/* Title band */}
      <div className="bg-navy-deep">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 py-14 sm:py-16">
          <div className="inline-flex items-center gap-2 text-amber-soft font-bold text-[12.5px] tracking-[0.16em] uppercase">
            <span className="w-6 h-px bg-amber-soft"></span> Legal
          </div>
          <h1 className="mt-4 font-display font-extrabold text-white text-[34px] sm:text-[44px] leading-[1.05]">
            Terms &amp; Conditions
          </h1>
          <p className="mt-4 text-[15.5px] text-white/65 leading-relaxed">
            Last updated: {EFFECTIVE_DATE}
          </p>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 py-12 sm:py-16">
          <P>
            These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern your use of the {BIZ.name} website
            and services provided by {BIZ.legalName} (&ldquo;{BIZ.name},&rdquo; &ldquo;we,&rdquo;
            &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By using our website or submitting a request, you
            agree to these Terms. If you do not agree, please do not use our website.
          </P>

          <H2>Our Services</H2>
          <P>
            {BIZ.name} is a licensed plumbing company serving {BIZ.areas.join(", ")}. Our website lets
            you browse our services and pricing and request a free quote or booking. We do not process
            online payments or complete bookings through the website; all quotes are confirmed directly
            with you by phone, text, or email before any work begins.
          </P>

          {/* Messaging Program — Twilio A2P required block */}
          <H2>SMS / Text Messaging Terms</H2>
          <div className="mt-4 rounded-2xl border border-line bg-mist/60 p-5 sm:p-6">
            <P>
              <strong className="text-navy">Program name:</strong> {SMS_PROGRAM}.
            </P>
            <P>
              <strong className="text-navy">Program description:</strong> When you provide your mobile
              number and check the consent box on our quote or booking form, you agree to receive text
              messages from {BIZ.name} related to your request. Messages may include quote confirmations,
              appointment scheduling and reminders, service status and technician updates, and replies to
              questions you send us. Providing your consent to receive text messages is not a condition of
              purchasing any goods or services.
            </P>
            <P>
              <strong className="text-navy">Message frequency:</strong> Message frequency varies and
              depends on your interactions with us.
            </P>
            <P>
              <strong className="text-navy">Cost:</strong> Message and data rates may apply. Such charges
              are billed by and payable to your mobile service provider. {BIZ.name} does not charge for
              the messages themselves.
            </P>
            <P>
              <strong className="text-navy">To opt out:</strong> Reply{" "}
              <strong className="text-navy">STOP</strong> to any text message at any time to cancel. After
              you send <strong className="text-navy">STOP</strong>, we will send one final message to
              confirm you have been unsubscribed, and you will no longer receive text messages from us
              unless you opt in again.
            </P>
            <P>
              <strong className="text-navy">For help:</strong> Reply{" "}
              <strong className="text-navy">HELP</strong> for assistance, or contact us at{" "}
              <a href={BIZ.phoneHref} className="text-blue font-semibold hover:text-blue-deep">
                {BIZ.phone}
              </a>{" "}
              or{" "}
              <a
                href={"mailto:" + BIZ.email}
                className="text-blue font-semibold hover:text-blue-deep break-all"
              >
                {BIZ.email}
              </a>
              .
            </P>
            <P>
              Carriers are not liable for delayed or undelivered messages. Supported carriers may change,
              and message delivery is subject to your carrier&rsquo;s coverage and availability.
            </P>
            <P>
              For details on how we handle the information collected through this program, see our{" "}
              <Link
                to="/privacy"
                className="text-blue font-semibold hover:text-blue-deep underline underline-offset-2"
              >
                Privacy Policy
              </Link>
              . We do not share text messaging opt-in data or consent with any third parties, and mobile
              information is never shared with third parties or affiliates for marketing or promotional
              purposes.
            </P>
          </div>

          <H2>Quotes &amp; Pricing</H2>
          <P>
            Prices and package details shown on our website are estimates for planning purposes and may
            vary based on the actual scope of work, parts, site conditions, and applicable codes. A final
            flat-rate price is provided and approved by you before any work begins. Nothing on this
            website constitutes a binding offer or guarantee of a specific price.
          </P>

          <H2>Your Responsibilities</H2>
          <P>
            You agree to provide accurate information when contacting us and to use our website only for
            lawful purposes. You may not attempt to disrupt the website, submit false or automated
            requests, or use the site in any way that could harm {BIZ.name} or others.
          </P>

          <H2>Intellectual Property</H2>
          <P>
            All content on this website, including text, graphics, logos, and images, is the property of
            {" "}
            {BIZ.legalName} or its licensors and is protected by applicable intellectual property laws.
            You may not reproduce or use our content without our written permission.
          </P>

          <H2>Disclaimers &amp; Limitation of Liability</H2>
          <P>
            Our website is provided &ldquo;as is&rdquo; without warranties of any kind, whether express
            or implied. To the fullest extent permitted by law, {BIZ.name} is not liable for any indirect,
            incidental, or consequential damages arising from your use of the website. Our plumbing
            services are covered by the separate terms and any warranties provided at the time of service.
          </P>

          <H2>Governing Law</H2>
          <P>
            These Terms are governed by the laws of the State of New York, without regard to its conflict
            of law principles. Any disputes will be handled in the state or federal courts located in New
            York.
          </P>

          <H2>Changes to These Terms</H2>
          <P>
            We may update these Terms from time to time. When we do, we will revise the &ldquo;Last
            updated&rdquo; date above. Your continued use of our website after any change means you accept
            the updated Terms.
          </P>

          <H2>Contact Us</H2>
          <P>Questions about these Terms? Contact us at:</P>
          <div className="mt-4 rounded-2xl border border-line bg-mist/60 p-5 text-[15px] text-navy">
            <div className="font-display font-bold">{BIZ.legalName}</div>
            <div className="mt-1 text-muted">{BIZ.address}</div>
            <div className="mt-1">
              <a href={BIZ.phoneHref} className="text-blue font-semibold hover:text-blue-deep">
                {BIZ.phone}
              </a>
            </div>
            <div className="mt-0.5">
              <a
                href={"mailto:" + BIZ.email}
                className="text-blue font-semibold hover:text-blue-deep break-all"
              >
                {BIZ.email}
              </a>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-line">
            <Link
              to="/"
              className="btn inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-line font-bold text-navy hover:border-blue/40"
            >
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </main>

      <Footer variant="service" />
    </div>
  );
}

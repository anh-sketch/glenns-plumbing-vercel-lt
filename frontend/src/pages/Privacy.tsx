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

export default function Privacy() {
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
            Privacy Policy
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
            {BIZ.legalName} (&ldquo;{BIZ.name},&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
            &ldquo;our&rdquo;) respects your privacy. This Privacy Policy explains what information we
            collect through {BIZ.name} and our website, how we use it, how we share it, and the
            choices you have. By using our website or submitting a request through our forms, you
            agree to the practices described below.
          </P>

          <H2>Information We Collect</H2>
          <P>
            We collect the information you provide directly when you request a quote, book a service,
            or otherwise contact us. This may include your name, phone number, email address, service
            address, the type of service you need, and any details you include in your message.
          </P>
          <P>
            When you visit our website, we may also automatically collect limited technical
            information such as your device type, browser, and general usage data through standard web
            technologies. We use this information to keep the site secure and working properly.
          </P>

          <H2>How We Use Your Information</H2>
          <P>
            We use the information we collect to respond to your requests, prepare and confirm quotes,
            schedule and provide plumbing services, contact you by phone, text message, or email about
            your request or appointment, provide customer support, and improve our website and
            services. We may also use your information as needed to comply with our legal obligations.
          </P>

          <H2>SMS / Text Messaging</H2>
          <P>
            When you provide your mobile number and check the consent box on our quote or booking form,
            you agree to receive text messages from {BIZ.name} related to your request under our{" "}
            {SMS_PROGRAM} messaging program. These messages may include quote confirmations, appointment
            scheduling and reminders, service status updates, and replies to questions you send us.
          </P>
          <P>
            Message frequency varies based on your interactions with us. Message and data rates may
            apply. You can opt out at any time by replying <strong className="text-navy">STOP</strong>,
            and you can reply <strong className="text-navy">HELP</strong> for assistance or contact us
            at {BIZ.phone}. For full messaging terms, please see our{" "}
            <Link to="/terms" className="text-blue font-semibold hover:text-blue-deep underline underline-offset-2">
              Terms &amp; Conditions
            </Link>
            .
          </P>
          <P>
            <strong className="text-navy">
              No mobile information will be shared with third parties or affiliates for marketing or
              promotional purposes.
            </strong>{" "}
            Text messaging originator opt-in data and consent are never shared with any third parties.
            Information may be shared with the service providers that help us operate our messaging
            program (for example, our messaging platform), solely so we can deliver the messages you
            requested.
          </P>

          <H2>How We Share Your Information</H2>
          <P>
            We do not sell or rent your personal information, and we do not share it with third parties
            for their own marketing purposes. We only share information in the limited circumstances
            described here: with trusted service providers who perform services on our behalf — such as
            messaging, email delivery, and hosting — who are permitted to use the information only to
            provide those services to us; and when required to comply with the law, respond to legal
            process, or protect our rights, safety, and property.
          </P>

          <H2>Data Retention</H2>
          <P>
            We keep your information for as long as needed to respond to your request, provide our
            services, and meet our legal, accounting, or reporting requirements. When information is no
            longer needed, we take reasonable steps to delete or de-identify it.
          </P>

          <H2>Data Security</H2>
          <P>
            We use reasonable administrative, technical, and physical safeguards designed to protect
            your information. However, no method of transmission or storage is completely secure, and we
            cannot guarantee absolute security.
          </P>

          <H2>Your Choices</H2>
          <P>
            You can opt out of text messages at any time by replying{" "}
            <strong className="text-navy">STOP</strong>. You can ask us to update or delete your
            information, or stop contacting you, by emailing{" "}
            <a
              href={"mailto:" + BIZ.email}
              className="text-blue font-semibold hover:text-blue-deep underline underline-offset-2"
            >
              {BIZ.email}
            </a>{" "}
            or calling {BIZ.phone}. We will respond to reasonable requests as required by applicable law.
          </P>

          <H2>Children&rsquo;s Privacy</H2>
          <P>
            Our website and services are intended for adults. We do not knowingly collect personal
            information from children under 13. If you believe a child has provided us with personal
            information, please contact us and we will delete it.
          </P>

          <H2>Changes to This Policy</H2>
          <P>
            We may update this Privacy Policy from time to time. When we do, we will revise the
            &ldquo;Last updated&rdquo; date above. Your continued use of our website after any change
            means you accept the updated policy.
          </P>

          <H2>Contact Us</H2>
          <P>
            If you have questions about this Privacy Policy or our data practices, contact us at:
          </P>
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

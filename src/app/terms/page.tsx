"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <main className="min-h-screen" style={{ background: "var(--theme-bg)" }}>
      <header
        className="sticky top-0 z-50 backdrop-blur-xl"
        style={{
          background: "color-mix(in srgb, var(--theme-bg) 80%, transparent)",
          borderBottom: "1px solid var(--theme-border)",
        }}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <Link
            href="/"
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            style={{ color: "var(--theme-text-secondary)" }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Home</span>
          </Link>
        </div>
      </header>

      <div className="px-5 py-8 max-w-2xl mx-auto">
        <h1
          className="text-2xl font-black tracking-tight mb-6"
          style={{ color: "var(--theme-text)" }}
        >
          Terms, Privacy & Disclaimer
        </h1>

        <div className="space-y-8" style={{ color: "var(--theme-text-secondary)" }}>
          <section>
            <h2
              className="text-[15px] font-bold mb-2"
              style={{ color: "var(--theme-text)" }}
            >
              About This Project
            </h2>
            <p className="text-[13px] leading-relaxed">
              Kerala Election Pulse is a non-commercial, open civic data project that presents
              publicly available election data in an accessible format. It is not affiliated with
              any political party, government body, or candidate.
            </p>
          </section>

          <section>
            <h2
              className="text-[15px] font-bold mb-2"
              style={{ color: "var(--theme-text)" }}
            >
              Data Sources & Accuracy
            </h2>
            <p className="text-[13px] leading-relaxed mb-3">
              All candidate data — including criminal cases, assets, education, and
              profession — is sourced from self-declared affidavits filed by candidates with the
              Election Commission of India. This data is compiled and published by:
            </p>
            <ul className="text-[13px] leading-relaxed space-y-1 pl-4 list-disc" style={{ color: "var(--theme-text-muted)" }}>
              <li><strong style={{ color: "var(--theme-text-secondary)" }}>Election Commission of India (ECI)</strong> — constituency and polling data</li>
              <li><strong style={{ color: "var(--theme-text-secondary)" }}>Association for Democratic Reforms (ADR) / MyNeta.info</strong> — candidate affidavits</li>
              <li><strong style={{ color: "var(--theme-text-secondary)" }}>CEO Kerala</strong> — state-level notifications</li>
            </ul>
            <p className="text-[13px] leading-relaxed mt-3">
              We do not independently verify, editorialize, or interpret any data. If a
              candidate&apos;s affidavit contains errors, those errors will be reflected here.
              For the most current information, refer to the original affidavits on the ECI website.
            </p>
          </section>

          <section>
            <h2
              className="text-[15px] font-bold mb-2"
              style={{ color: "var(--theme-text)" }}
            >
              Photos
            </h2>
            <p className="text-[13px] leading-relaxed">
              Candidate photos are sourced from MyNeta.info&apos;s public candidate profiles. Not all candidates
              have photos available — approximately 71% of candidates have real photos, the rest
              show generated initial avatars. Photos are used for identification purposes only.
            </p>
          </section>

          <section>
            <h2
              className="text-[15px] font-bold mb-2"
              style={{ color: "var(--theme-text)" }}
            >
              Privacy
            </h2>
            <p className="text-[13px] leading-relaxed">
              This website does not collect any personal data. No cookies are set, no
              analytics are tracked, no accounts exist. The only data stored is your theme
              preference (light/dark) in your browser&apos;s localStorage, which never leaves your device.
            </p>
          </section>

          <section>
            <h2
              className="text-[15px] font-bold mb-2"
              style={{ color: "var(--theme-text)" }}
            >
              Disclaimer
            </h2>
            <p className="text-[13px] leading-relaxed">
              This project is provided &quot;as is&quot; without warranties of any kind. We make no guarantees
              about the accuracy, completeness, or timeliness of the data presented. The information
              should not be used as the sole basis for any decision. Always verify important data
              directly from official Election Commission sources.
            </p>
          </section>

          <section>
            <h2
              className="text-[15px] font-bold mb-2"
              style={{ color: "var(--theme-text)" }}
            >
              Contact
            </h2>
            <p className="text-[13px] leading-relaxed">
              For corrections, feedback, or inquiries about this project, please raise an issue on the
              project&apos;s GitHub repository.
            </p>
          </section>
        </div>

        <p
          className="text-[11px] mt-10 text-center"
          style={{ color: "var(--theme-text-muted)" }}
        >
          Last updated: April 2026
        </p>
      </div>
    </main>
  );
}

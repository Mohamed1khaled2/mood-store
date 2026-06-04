import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "404 - Page not found",
  description: "The page you are looking for does not exist.",
};

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <main className="flex min-h-screen items-center justify-center bg-[#fffaf3] px-4 py-16 text-[#201711]">
          <section className="max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#8c5a3c]">
              404
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Page not found
            </h1>
            <p className="mt-5 text-base leading-8 text-[#5b4434]">
              The page you are looking for does not exist or may have been moved.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/en"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-[#201711] px-5 text-xs font-bold uppercase tracking-wider text-[#fffaf3]"
              >
                Home
              </Link>
              <Link
                href="/en/contact"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-[#201711]/15 px-5 text-xs font-bold uppercase tracking-wider text-[#201711]"
              >
                Contact us
              </Link>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}

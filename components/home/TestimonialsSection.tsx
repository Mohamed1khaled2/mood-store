import type { Testimonial } from "@/data/store";
import type { Dictionary, Locale } from "@/app/i18n";

type TestimonialsSectionProps = {
  testimonials: Testimonial[];
  locale: Locale;
  dict: Dictionary;
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i < rating ? "text-[#d99a52]" : "text-[#e8d8c8]"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection({
  testimonials,
  locale,
  dict,
}: TestimonialsSectionProps) {
  return (
    <section className="bg-[#faf5ee] px-4 py-10 sm:px-6 md:px-10 md:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8c5a3c]">
            {dict.testimonials.eyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">
            {dict.testimonials.title}
          </h2>
          <p className="mt-2 text-base text-[#5b4434]">
            {dict.testimonials.subtitle}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="rounded-2xl border border-[#e8d8c8] bg-white p-6 transition-shadow duration-300 hover:shadow-lg"
            >
              <StarRating rating={testimonial.rating} />

              <blockquote className="mt-4 text-sm leading-7 text-[#3a2a20]">
                &ldquo;{testimonial.review[locale]}&rdquo;
              </blockquote>

              <div className="mt-5 flex items-center gap-3">
                {/* Avatar placeholder */}
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f4d7b1] text-sm font-bold text-[#8c5a3c]">
                  {testimonial.name[locale].charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#201711]">
                    {testimonial.name[locale]}
                  </p>
                  <p className="text-xs text-[#8c5a3c]">
                    {dict.testimonials.verifiedBuyer} · {testimonial.product}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


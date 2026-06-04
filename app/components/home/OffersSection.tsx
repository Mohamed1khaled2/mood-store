import type { StorePerk } from "../../data/store";
import type { Dictionary, Locale } from "../../i18n";

type OffersSectionProps = {
  perks: StorePerk[];
  locale: Locale;
  dict: Dictionary;
};

export default function OffersSection({ perks, locale, dict }: OffersSectionProps) {
  return (
    <section
      id="offers"
      className="bg-[#201711] px-4 py-10 text-[#fffaf3] sm:px-6 md:px-10 md:py-16"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f4d7b1]">
            {dict.offers.eyebrow}
          </p>
          <h2 className="mt-3 max-w-lg text-3xl font-semibold sm:text-4xl">
            {dict.offers.title}
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {perks.map((perk) => (
            <div
              key={perk.title.en}
              className="rounded-md border border-white/10 bg-white/8 p-4"
            >
              <p className="mb-2 text-2xl">{perk.icon}</p>
              <p className="text-xl font-semibold">
                {perk.title[locale]}
              </p>
              <p className="mt-2 text-sm leading-6 text-[#f4d7b1]">
                {perk.description[locale]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


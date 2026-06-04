import BorderGlow from "../BorderGlow";
import type { Dictionary } from "../../i18n";

type HeroSectionProps = {
  dict: Dictionary;
};

export default function HeroSection({ dict }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(150deg,#fffaf3_0%,#f4d7b1_58%,#c7835d_100%)] px-4 pb-10 pt-24 sm:px-6 md:px-10 md:pb-16 md:pt-36">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-12">
        <div className="max-w-xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#8c5a3c] sm:text-sm">
            {dict.hero.eyebrow}
          </p>
          <h1 className="max-w-[11ch] text-4xl font-semibold leading-[1.04] text-[#201711] sm:text-5xl md:text-6xl lg:text-7xl">
            {dict.hero.title}
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-[#5b4434] sm:text-lg sm:leading-8">
            {dict.hero.copy}
          </p>
          <div className="mt-7 grid gap-3 sm:flex sm:flex-wrap">
            <a
              href="#shop"
              className="inline-flex h-12 items-center justify-center rounded-md bg-[#201711] px-5 text-sm font-semibold text-[#fffaf3] transition hover:bg-[#3a2a20]"
            >
              {dict.hero.primaryCta}
            </a>
            <a
              href="#offers"
              className="inline-flex h-12 items-center justify-center rounded-md border border-[#201711]/25 bg-white/20 px-5 text-sm font-semibold text-[#201711] transition hover:bg-white/40"
            >
              {dict.hero.secondaryCta}
            </a>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[360px] lg:max-w-[440px]">
          <BorderGlow
            className="overflow-hidden"
            backgroundColor="#201711"
            borderRadius={24}
            glowRadius={28}
            glowColor="28 85 78"
            animated
            colors={["#f4d7b1", "#b85c38", "#fffaf3"]}
            fillOpacity={0.35}
          >
            <div className="relative min-h-[330px] px-5 pb-6 pt-8 sm:min-h-[390px] sm:px-8">
              <div className="mx-auto h-20 w-14 rounded-b-2xl rounded-t-md bg-[#f4d7b1] sm:h-24 sm:w-16" />
              <div className="mx-auto mt-8 flex h-36 w-32 items-center justify-center rounded-2xl border border-[#f4d7b1]/45 bg-[#fffaf3] text-center text-sm font-bold uppercase tracking-[0.18em] text-[#8c5a3c] sm:h-44 sm:w-40">
                Mood
              </div>
              <div className="mt-8 grid grid-cols-2 gap-3 text-[#fffaf3]">
                <div className="rounded-md bg-white/10 p-3">
                  <p className="text-2xl font-semibold">3</p>
                  <p className="mt-1 text-xs text-[#f4d7b1]">
                    {dict.hero.dailyMoods}
                  </p>
                </div>
                <div className="rounded-md bg-white/10 p-3">
                  <p className="text-2xl font-semibold">24h</p>
                  <p className="mt-1 text-xs text-[#f4d7b1]">
                    {dict.hero.dispatch}
                  </p>
                </div>
              </div>
            </div>
          </BorderGlow>
        </div>
      </div>
    </section>
  );
}

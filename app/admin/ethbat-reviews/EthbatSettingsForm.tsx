"use client";

import { useMemo, useState } from "react";
import {
  buildEthbatEmbedCode,
  type EthbatDisplaySettings,
  type EthbatKind,
  type EthbatLanguage,
  type EthbatMode,
  type EthbatPlacement,
  type EthbatPluginSettings,
  type EthbatTheme,
} from "@/plugins/ethbat-reviews";
import { updateEthbatSettings } from "./actions";

type Props = { initialSettings: EthbatPluginSettings };

const inputClass =
  "mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#8c5a3c] focus:ring-2 focus:ring-[#f4d7b1]";

function DisplayFields({
  value,
  onChange,
  prefix,
  disabled = false,
}: {
  value: EthbatDisplaySettings;
  onChange: (value: EthbatDisplaySettings) => void;
  prefix: string;
  disabled?: boolean;
}) {
  const update = <K extends keyof EthbatDisplaySettings>(
    key: K,
    nextValue: EthbatDisplaySettings[K],
  ) => onChange({ ...value, [key]: nextValue });

  return (
    <fieldset
      disabled={disabled}
      className="grid grid-cols-1 gap-4 disabled:opacity-50 sm:grid-cols-2 lg:grid-cols-5"
    >
      <label className="text-sm font-medium text-gray-700">
        وضع العرض
        <select
          aria-label={`${prefix} وضع العرض`}
          className={inputClass}
          value={value.mode}
          onChange={(event) => update("mode", event.target.value as EthbatMode)}
        >
          <option value="grid">شبكة</option>
          <option value="carousel">شريط متحرك</option>
          <option value="badge">شارة</option>
        </select>
      </label>
      <label className="text-sm font-medium text-gray-700">
        العدد
        <input
          aria-label={`${prefix} العدد`}
          className={inputClass}
          type="number"
          min={1}
          max={50}
          required
          value={value.limit}
          onChange={(event) => update("limit", Number(event.target.value))}
        />
      </label>
      <label className="text-sm font-medium text-gray-700">
        اللغة
        <select
          aria-label={`${prefix} اللغة`}
          className={inputClass}
          value={value.lang}
          onChange={(event) =>
            update("lang", event.target.value as EthbatLanguage)
          }
        >
          <option value="ar">العربية</option>
          <option value="en">English</option>
        </select>
      </label>
      <label className="text-sm font-medium text-gray-700">
        المظهر
        <select
          aria-label={`${prefix} المظهر`}
          className={inputClass}
          value={value.theme}
          onChange={(event) =>
            update("theme", event.target.value as EthbatTheme)
          }
        >
          <option value="light">فاتح</option>
          <option value="dark">داكن</option>
        </select>
      </label>
      <label className="text-sm font-medium text-gray-700">
        نوع التقييم
        <select
          aria-label={`${prefix} نوع التقييم`}
          className={inputClass}
          value={value.kind}
          onChange={(event) =>
            update("kind", event.target.value as EthbatKind)
          }
        >
          <option value="">الكل</option>
          <option value="text">نصي</option>
          <option value="image">صورة</option>
          <option value="video">فيديو</option>
        </select>
      </label>
    </fieldset>
  );
}

export default function EthbatSettingsForm({ initialSettings }: Props) {
  const [settings, setSettings] =
    useState<EthbatPluginSettings>(initialSettings);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const embedCode = useMemo(
    () => buildEthbatEmbedCode(settings.storeSlug, settings.defaults),
    [settings.defaults, settings.storeSlug],
  );

  const updatePlacement = (
    placement: EthbatPlacement,
    patch: Partial<EthbatPluginSettings["placements"][EthbatPlacement]>,
  ) => {
    setSettings((current) => ({
      ...current,
      placements: {
        ...current.placements,
        [placement]: { ...current.placements[placement], ...patch },
      },
    }));
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setMessage("");
    setError("");
    try {
      const result = await updateEthbatSettings(settings);
      if (result.ok) setMessage(result.message);
      else setError(result.fieldErrors?.storeSlug || result.message);
    } catch (submissionError) {
      console.error(submissionError);
      setError("تعذر حفظ الإعدادات. راجع سجل الخادم وحاول مرة أخرى.");
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6 pb-12">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-[#201711]">الإعداد العام</h3>
            <p className="mt-1 text-sm text-gray-500">
              تعطيل الإضافة يوقف كل مواضع العرض دون حذف الإعدادات.
            </p>
          </div>
          <label className="flex items-center gap-2 text-sm font-bold">
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={(event) =>
                setSettings({ ...settings, enabled: event.target.checked })
              }
              className="h-5 w-5 accent-[#8c5a3c]"
            />
            تفعيل الإضافة
          </label>
        </div>
        <label className="mt-6 block max-w-xl text-sm font-medium text-gray-700">
          Store slug
          <input
            className={inputClass}
            dir="ltr"
            required
            maxLength={100}
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            value={settings.storeSlug}
            onChange={(event) =>
              setSettings({ ...settings, storeSlug: event.target.value })
            }
          />
          <span className="mt-1 block text-xs text-gray-500">
            القيمة الافتراضية: store-c53b0dc45e
          </span>
        </label>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-5 text-lg font-bold text-[#201711]">
          إعدادات العرض الافتراضية
        </h3>
        <DisplayFields
          prefix="الافتراضي"
          value={settings.defaults}
          onChange={(defaults) => setSettings({ ...settings, defaults })}
        />
      </section>

      {(
        [
          ["home", "الصفحة الرئيسية"],
          ["product", "صفحة المنتج"],
        ] as const
      ).map(([placement, label]) => {
        const value = settings.placements[placement];
        return (
          <section
            key={placement}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <h3 className="text-lg font-bold text-[#201711]">{label}</h3>
              <div className="flex flex-wrap gap-5">
                <label className="flex items-center gap-2 text-sm font-bold">
                  <input
                    type="checkbox"
                    checked={value.enabled}
                    onChange={(event) =>
                      updatePlacement(placement, {
                        enabled: event.target.checked,
                      })
                    }
                    className="h-5 w-5 accent-[#8c5a3c]"
                  />
                  عرض الودجت
                </label>
                <label className="flex items-center gap-2 text-sm font-bold">
                  <input
                    type="checkbox"
                    checked={value.useDefaults}
                    onChange={(event) =>
                      updatePlacement(placement, {
                        useDefaults: event.target.checked,
                      })
                    }
                    className="h-5 w-5 accent-[#8c5a3c]"
                  />
                  استخدام الإعدادات الافتراضية
                </label>
              </div>
            </div>
            <DisplayFields
              prefix={label}
              disabled={value.useDefaults}
              value={value.display}
              onChange={(display) => updatePlacement(placement, { display })}
            />
          </section>
        );
      })}

      <section className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
        <h3 className="font-bold text-blue-950">كود التضمين الناتج</h3>
        <p className="mt-1 text-sm text-blue-800">
          للمرجعية فقط؛ المتجر يستخدم مكوّن الإضافة الآمن ولا يحتاج نسخ الكود.
        </p>
        <code
          className="mt-4 block overflow-x-auto rounded-xl bg-[#111827] p-4 text-left text-xs leading-6 text-green-300"
          dir="ltr"
        >
          {embedCode}
        </code>
      </section>

      <div aria-live="polite">
        {message ? (
          <p className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-bold text-green-800">
            {message}
          </p>
        ) : null}
        {error ? (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800"
          >
            {error}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-[#201711] px-7 py-3 font-bold text-white transition hover:bg-[#3a2a20] disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "جارٍ الحفظ…" : "حفظ إعدادات إثبات"}
      </button>
    </form>
  );
}

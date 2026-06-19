import type { Metadata } from "next";
import { getEthbatSettings } from "@/plugins/ethbat-reviews";
import EthbatSettingsForm from "./EthbatSettingsForm";

export const metadata: Metadata = {
  title: "تقييمات إثبات",
};

export default async function EthbatReviewsAdminPage() {
  const settings = await getEthbatSettings();

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <p className="mb-2 text-sm font-bold text-[#8c5a3c]">Plugin</p>
        <h2 className="text-3xl font-bold text-[#201711]">تقييمات إثبات</h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-gray-600">
          اضبط ودجت تقييمات العملاء، ثم فعّله في الصفحة الرئيسية أو صفحات
          المنتجات. لا يحتاج التكامل إلى مفتاح سري.
        </p>
      </div>
      <EthbatSettingsForm initialSettings={settings} />
    </div>
  );
}

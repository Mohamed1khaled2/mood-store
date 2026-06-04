import { getSettings } from "@/data/db";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">إعدادات المتجر العامة</h2>
        <p className="text-gray-500 mt-1">قم بتغيير اسم المتجر، الوصف، روابط التواصل، ومعلومات الدعم.</p>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  );
}

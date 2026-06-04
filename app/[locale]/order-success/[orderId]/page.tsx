import { notFound } from "next/navigation";
import Link from "next/link";
import { getDb, getSettings } from "@/data/db";
import { dictionary, Locale } from "@/app/i18n";

type OrderSuccessPageProps = {
  params: Promise<{
    locale: Locale;
    orderId: string;
  }>;
};

export default async function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  const { locale, orderId } = await params;
  const dict = dictionary[locale] || dictionary.en;
  const isRtl = locale === "ar";

  const db = await getDb();
  const settings = await getSettings();
  const order = (db.orders || []).find((o) => o.id === orderId);

  if (!order) {
    notFound();
  }

  // Generate WhatsApp tracking link
  const formattedWhatsapp = settings.whatsapp.replace(/[^0-9+]/g, "");
  const whatsappMsg = isRtl
    ? `مرحباً، أود الاستفسار عن طلبي رقم ${order.id}. الاسم: ${order.customerName}.`
    : `Hello, I'd like to ask about my order ${order.id}. Name: ${order.customerName}.`;
  
  const whatsappUrl = `https://wa.me/${formattedWhatsapp}?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <main className="min-h-screen bg-[#fffaf3] pt-16 pb-24" style={{ fontFamily: isRtl ? "var(--font-cairo), sans-serif" : "var(--font-geist-sans), sans-serif" }}>
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        {/* Success Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#8c5a3c]/10 text-[#8c5a3c]">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-wide text-[#201711] leading-tight">
            {dict.orderSuccess.title}
          </h1>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            {dict.orderSuccess.subtitle}
          </p>
        </div>

        {/* Order Details Receipt */}
        <div className="bg-white border border-[#201711]/5 rounded-2xl p-8 shadow-sm space-y-6">
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-[#201711]/50 border-b border-[#201711]/5 pb-3">
            <span>{dict.orderSuccess.orderId}</span>
            <span className="text-[#8c5a3c] font-black">{order.id}</span>
          </div>

          {/* Items */}
          <div className="space-y-3.5 border-b border-[#201711]/5 pb-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#201711]/80">
              {dict.orderSuccess.items}
            </h3>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs text-[#201711]">
                  <span className="font-semibold">
                    {item.name[locale]} <span className="text-gray-400 font-bold mx-1">x{item.quantity}</span>
                  </span>
                  <span className="font-medium">{item.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Total Breakdown */}
          <div className="space-y-2 border-b border-[#201711]/5 pb-4 text-xs text-[#201711]">
            <div className="flex justify-between font-semibold">
              <span className="text-gray-500 uppercase tracking-wider">{dict.checkout.subtotal}</span>
              <span>
                {isRtl ? "ج.م " : "EGP "}
                {order.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between font-semibold">
              <span className="text-gray-500 uppercase tracking-wider">{dict.orderSuccess.shipping}</span>
              <span>
                {order.shippingFee === 0 ? (
                  <span className="text-[#8c5a3c] font-bold">{locale === 'ar' ? 'شحن مجاني' : 'Free Shipping'}</span>
                ) : (
                  `${isRtl ? 'ج.م ' : 'EGP '}${order.shippingFee}`
                )}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold pt-1.5">
              <span className="uppercase tracking-wider">{dict.orderSuccess.total}</span>
              <span>
                {isRtl ? "ج.م " : "EGP "}
                {order.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-2 text-xs text-[#201711]">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#201711]/80">
              {dict.orderSuccess.address}
            </h3>
            <p className="font-semibold text-gray-600 leading-relaxed">
              {order.customerGovernorate}, Egypt <br />
              {order.customerAddress}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 space-y-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] text-xs font-bold uppercase tracking-widest text-white hover:opacity-90 active:scale-[0.99] transition shadow-sm cursor-pointer"
          >
            {/* WhatsApp Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436.002 9.858-4.417 9.86-9.858.002-2.637-1.026-5.115-2.897-6.988C16.564 1.884 14.09 .856 11.45.856c-5.44 0-9.862 4.418-9.865 9.859-.001 1.745.485 3.447 1.41 4.966l-1.02 3.722 3.818-1.002c1.472.802 3.09 1.223 4.874 1.223z"/>
            </svg>
            {dict.orderSuccess.trackViaWhatsapp}
          </a>

          <Link
            href={`/${locale}`}
            className="flex h-12 w-full items-center justify-center rounded-xl border border-[#201711] text-xs font-bold uppercase tracking-widest text-[#201711] hover:bg-[#201711]/5 transition active:scale-[0.99]"
          >
            {dict.orderSuccess.backToHome}
          </Link>
        </div>
      </div>
    </main>
  );
}

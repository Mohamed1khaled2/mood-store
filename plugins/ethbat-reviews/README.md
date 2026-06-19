# إضافة تقييمات إثبات

إضافة إنتاجية لمتجر Mood Store المخصص المبني على Next.js 16.2.6. تستخدم
السكربت الرسمي مباشرة من إثبات ولا تنسخه أو تعدله، ولا تستخدم `iframe` أو أي
مفاتيح سرية.

## المتطلبات

- Node.js 20 أو أحدث.
- Next.js 16.2.6 أو إصدار متوافق أحدث بعد اختباره.
- السماح للنطاق `https://ethbat.vercel.app` في `script-src` و`connect-src`.

## التثبيت

الحزمة الجاهزة تحتوي مجلد الإضافة ونقاط الربط اللازمة للمشروع. بعد فكها في
جذر المشروع:

```powershell
cmd /c npm install
cmd /c npm run build
```

المشروع الحالي مدمج معه الـPlugin بالفعل. صفحة الإدارة:

```text
/admin/ethbat-reviews
```

## الإعداد

1. افتح صفحة “تقييمات إثبات” من لوحة التحكم.
2. أدخل Store slug. القيمة الافتراضية هي `store-c53b0dc45e`.
3. اختر الوضع والعدد واللغة والمظهر ونوع التقييم.
4. فعّل موضع الصفحة الرئيسية أو صفحة المنتج.
5. يمكن لكل موضع استخدام القيم الافتراضية أو إعدادات مستقلة.

القيم المقبولة:

- `mode`: `carousel` أو `grid` أو `badge`
- `limit`: من 1 إلى 50
- `lang`: `ar` أو `en`
- `theme`: `light` أو `dark`
- `kind`: فارغ أو `text` أو `image` أو `video`

## طرق الإدراج

- موضع الصفحة الرئيسية: `placement="home"`.
- موضع صفحة المنتج: `placement="product"`.
- Block يدوي:

```tsx
import { EthbatWidgetBlock } from "@/plugins/ethbat-reviews";

<EthbatWidgetBlock
  storeSlug="store-c53b0dc45e"
  display={{
    mode: "grid",
    limit: 6,
    lang: "ar",
    theme: "light",
    kind: "",
  }}
/>;
```

لا تضع أكثر من Block واحد في الصفحة نفسها، لأن السكربت الرسمي يعتمد على
`document.currentScript` وينشئ مثيلًا واحدًا. الـloader يمنع التكرار ويعيد
التحميل عند الانتقال إلى صفحة تحتاج إعدادًا مختلفًا.

## حالات الواجهة والأخطاء

يعرض الـPlugin حالة تحميل، وحالة عدم وجود تقييمات، وحالة خطأ قابلة للوصول.
أخطاء تحميل السكربت أو API تُسجل في `console.error` ولا تُخفى أثناء التطوير.
الودجت الرسمي يعزل تنسيقه داخل Shadow DOM.

## CSP

التكامل المرفق يضيف سياسة CSP مناسبة في `proxy.ts`. الحد الأدنى المطلوب:

```text
script-src 'self' https://ethbat.vercel.app
connect-src 'self' https://ethbat.vercel.app
```

يحتاج الودجت إلى inline styles داخل Shadow DOM، لذلك يجب أن تسمح سياسة
`style-src` بذلك أو تستخدم سياسة nonce متوافقة مع السكربت الخارجي.

## الاختبار والبناء

```powershell
cmd /c npm run lint
cmd /c npm test
cmd /c npm run build
```

تغطي الاختبارات sanitization والتحقق، توليد خصائص وكود التضمين، ومنع تكرار
تحميل السكربت.

## تجربة التكامل الحقيقي

1. شغّل `cmd /c npm run dev`.
2. افتح `/admin/ethbat-reviews` واحفظ الإعدادات.
3. افتح `/ar` أو `/en`.
4. من DevTools > Network تأكد أن `ethbat-widget.js` يظهر مرة واحدة فقط.
5. تحقق من طلب `/api/widget/store-c53b0dc45e`.

في 19 يونيو 2026 كان API العام يعيد `reviews: []`، لذلك تظهر حالة “لا توجد
تقييمات” إلى أن تُنشر تقييمات في متجر إثبات.

## الإزالة والتنظيف

التنظيف الآمن الافتراضي لا يحذف أي بيانات:

```powershell
cmd /c npm run plugin:cleanup
```

لحذف مفتاح الإعدادات الذي يملكه الـPlugin فقط:

```powershell
cmd /c npm run plugin:purge
```

لا تلمس أداة الإزالة المنتجات أو الطلبات أو إعدادات المتجر الأخرى.

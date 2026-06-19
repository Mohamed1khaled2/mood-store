# Installation map

هذه الحزمة تستهدف نسخة Mood Store الموجودة في المشروع. فك ملف ZIP في جذر
المشروع مع الحفاظ على المسارات، ثم شغّل:

```powershell
cmd /c npm install
cmd /c npm test
cmd /c npm run build
```

الملفات داخل `plugins/ethbat-reviews/` مملوكة للإضافة. نقاط الربط مع المضيف:

- `app/admin/ethbat-reviews/`
- `app/admin/AdminSidebar.tsx`
- `app/[locale]/page.tsx`
- `app/[locale]/products/[slug]/page.tsx`
- `data/db.ts`
- `app/globals.css`
- `proxy.ts`

في منصة مخصصة أخرى، انسخ نواة الإضافة وصفحة الإدارة ثم اربط
`EthbatPlacementBlock` في المواضع المناسبة بدل استبدال ملفات المضيف كاملة.

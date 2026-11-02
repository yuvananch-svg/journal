# Journal Product Roadmap

วันที่: 29 ตุลาคม 2026 · สถานะ: ข้อเสนอสำหรับตัดสินใจ ยังไม่ใช่ implementation spec ที่อนุมัติแล้ว

## เป้าหมายและสมมติฐาน

สร้าง Journal SaaS ของตนเอง มีหน้า Welcome ที่เล่าเรื่องผ่าน scroll, เดโม่สาธารณะ และพื้นที่สมาชิก โดยใช้หลักการที่ตรวจจาก LiquidJournal ไม่คัดลอกชื่อ ภาพ วิดีโอ หรือคำโฆษณา สมมติรุ่นแรกเริ่มด้วย manual + CSV; การเลือกตลาดแรกและ requirement ของ auto-sync ยังต้องให้เจ้าของผลิตภัณฑ์ตัดสินใจ ข้อสมมตินี้ไม่ใช่การตัดสินใจแทนผู้ใช้

เดโม่ปัจจุบัน dashboard/ เป็นต้นแบบภาพและพฤติกรรม ไม่ใช่ระบบ production ไม่จำเป็นต้องย้ายโค้ด DOM manipulation ทั้งชุดเข้า React; ย้าย design tokens, กติกาคำนวณ และ fixture ที่ทดสอบแล้ว

## หลักฐานกับข้อเสนอ

ต้นฉบับ: Next.js/React, Motion APIs, CSS + WebGL shader, Recharts, Zustand/local cache/outbox, NextAuth และ same-origin APIs. TanStack Query พบใน Community; Supabase Storage/Realtime มีหลักฐาน แต่ฐานข้อมูลหลัก/ORM/queue ยังไม่ยืนยัน

ข้อเสนอของเรา: Next.js App Router + TypeScript, Tailwind/CSS tokens, Motion, Recharts, TanStack Query สำหรับ server state, Zustand เฉพาะ client preferences/drafts ที่จำเป็น, Supabase Auth/Postgres/Storage และ Vercel สำหรับเว็บ. Supabase เป็นการเลือกใหม่ ไม่อ้างว่าต้นฉบับใช้เป็นฐานข้อมูลหลัก. ใช้ Auth หลักเพียงระบบเดียวในรุ่นแรก. เลือก dependency versions ตอน scaffold จากรุ่น stable ที่เข้ากันและเก็บ lockfile ไม่ตรึงตาม version ที่พบในเว็บคนอื่น

ยังไม่เพิ่ม GSAP, Three.js, Redis, microservices, LiveKit หรือระบบ offline outbox; เพิ่มเมื่อมี requirement และผลวัดรองรับ

## โครงสร้างเป้าหมาย

- app/(marketing)/page.tsx: Welcome สาธารณะ; route group ไม่เปลี่ยน URL
- app/(demo)/demo/page.tsx: Dashboard จำลอง อ่าน fixture ไม่มีข้อมูลสมาชิก
- app/(auth)/login/page.tsx และ signup/page.tsx: เข้าระบบ
- app/(workspace)/dashboard/page.tsx และ journal/page.tsx: สมาชิก
- features/landing/: hero, scroll showcase, CTA
- features/dashboard/: metric cards, curve, calendar, goals
- features/journal/: trade form/list/detail
- domain/trading/: types, calculations, trade grouping, time boundaries
- server/: application services, authorized repositories, integrations
- fixtures/: explicit synthetic examples; แยกจาก production seed
- supabase/migrations/: schema และนโยบายสิทธิ์ที่ตรวจย้อนหลังได้
- tests/: domain, authorization และ critical browser flows

เริ่ม repository/app เดียว แยก marketing/application layouts เพื่อไม่ให้ shader, วิดีโอ และ scroll listeners ของ Welcome ตามเข้า Dashboard

## ระยะ 1 — Foundation + Welcome + Demo

- [ ] ตกลงชื่อชั่วคราว, ผู้ใช้กลุ่มแรก, ขอบเขต auto-sync และลำดับเนื้อหา Welcome
- [ ] ตั้ง Next.js/TypeScript, design tokens, layouts และ build/lint/typecheck
- [ ] ย้าย Dashboard เป็น React components ใช้ fixture ชุดเดียวกัน และคง metric/curve tests
- [ ] ทำ Welcome 5 ฉาก: Welcome Trader → ปัญหาการบันทึก → pinned Dashboard reveal → บันทึกหนึ่งเทรดและเห็นผล → ลองเดโม่/สมัคร
- [ ] ใช้ CSS sticky + Motion scroll progress; ข้อความสาธารณะอ่านได้โดยไม่มี animation. Login/CTA เข้าถึงได้ทันที
- [ ] ใช้ภาพนิ่งหรือสื่อที่เรามีสิทธิ์ก่อน; shader เป็นงานเสริมหลัง prototype ผ่าน
- [ ] ตรวจ desktop/mobile/keyboard/reduced motion และ production build

ตรวจรับ: / และ /demo เข้าถึงได้โดยไม่ล็อกอิน, เดโม่ไม่อ่านข้อมูลสมาชิก, sticky ไม่ติดค้างบนมือถือ, scroll/resize กลับหน้าไม่สร้าง listeners ซ้ำ, Welcome effects ถูก cleanup หลังออกจากหน้า. ปุ่มสมัครไปเส้นทางที่ทำจริง; ถ้า auth ยังไม่พร้อมต้องระบุสถานะตรง ๆ

## ระยะ 2 — Auth + ownership + trading domain

- [ ] กำหนด user/profile, account, execution, trade, journal entry, strategy และ goals
- [ ] กำหนด net P&L/commission/currency/timezone/breakeven และ closed/open trade rules ก่อนคำนวณ
- [ ] แยก execution/fill จาก trade ตั้งแต่ schema เพื่อรองรับ partial fills/scale-in/out; เริ่ม manual trade ได้โดยไม่ต้องสร้าง execution ปลอม
- [ ] เงินใช้ decimal หรือ minor units ตาม precision ของแต่ละสกุล; quantity/price ใช้ decimal ไม่ใช้ float สะสมยอด
- [ ] บันทึกเวลา UTC พร้อมเขตเวลา report และ provider time/source; ไม่บวกหลายสกุลเงินเข้าด้วยกันหากยังไม่มี FX policy
- [ ] ทำ Supabase Auth และ authorization ทุก operation พร้อม RLS ใน exposed tables และ private file policies

ตรวจรับ: บัญชี A อ่าน/แก้ trade หรือไฟล์ของ B ไม่ได้ทั้งผ่าน UI และ request โดยตรง. Reload/session expiry/logout ถูกต้อง. Credential ของ broker ไม่ส่งให้ client

## ระยะ 3 — Journal + Dashboard จากข้อมูลจริง

- [ ] เพิ่ม/แก้ไข/ลบ trade พร้อม note และรูป private
- [ ] บันทึกข้อมูลผ่าน application service แล้ว invalidate query keys ที่เกี่ยวข้อง
- [ ] Dashboard ใช้ domain calculations เดียวกับ Journal และรายงานยอด net/gross ชัดเจน
- [ ] แสดง loading/empty/error/save status พร้อมกู้ draft กรณี request ล้มเหลว
- [ ] เพิ่ม tests สำหรับ breakeven, fee, partial trade, timezone boundary, scope และ isolation ของ query cache ตาม user

ตรวจรับ: เพิ่มหนึ่ง trade → ยอดทุก widget ที่ใช้ scope เดียวกันตรงกัน → reload แล้วข้อมูลยังอยู่ → login อีกคนไม่เห็น cache คนแรก. ไม่แจ้งบันทึกสำเร็จก่อน server ยืนยัน

## ระยะ 4 — CSV import และ pilot users

- [ ] เลือกไฟล์จริงที่เจ้าของมีสิทธิ์ใช้จาก provider แรกและลบข้อมูลระบุตัวตนก่อนทำ fixture
- [ ] ทำ mapping preview, row errors, timezone/currency confirmation และ batch import
- [ ] เก็บ import source/external ID พร้อม idempotency และ rollback เฉพาะ batch ที่นำเข้า
- [ ] ตรวจผลรวมกับ statement และ duplicate import
- [ ] เปิด staging ให้ผู้ทดสอบกลุ่มเล็ก พร้อม error monitoring และ backup/restore verification

ตรวจรับ: นำเข้าไฟล์เดิมซ้ำไม่เพิ่มเทรด, bad rows ไม่ถูกกลืนเงียบ, ยอด reconcile ได้และเห็นสาเหตุเมื่อไม่ตรง

## ระยะ 5 — Auto-sync หนึ่ง provider

ทำ connector spike ได้ตั้งแต่ก่อนระยะ 2 เพื่อยืนยัน feasibility หาก auto-sync เป็นจุดขายหลัก; ไม่รอสร้าง UI ทั้งหมดแล้วค่อยค้นพบว่า provider ไม่อนุญาต SaaS

- [ ] ยืนยัน commercial permission, auth scope, history window, rate limits, fills/corrections และ cost ของ provider ที่เลือก
- [ ] ทำ connection service, encrypted secret storage, durable job + retry/checkpoint และ deduplication
- [ ] connector → raw records → normalized executions → trade grouping → domain calculations
- [ ] รองรับ disconnect, expired credential, late fee/correction, partial history และแสดง last successful sync

ตรวจรับ: job retry/timeout/reconnect ไม่ซ้ำข้อมูล, backfill เทียบ statement ได้, provider ล่มไม่ทำให้เว็บล่ม. ทำ provider ที่สองหลังตัวแรกผ่าน reconciliation. TopstepX/ProjectX commercial use ยังเป็นประเด็นต้องยืนยันเป็นลายลักษณ์อักษร ไม่สรุปว่า key ของลูกค้าเท่ากับสิทธิ์ทำ SaaS

## ระยะ 6 — Billing / AI / Community

แยกเป็น specs หลังมีผู้ใช้ Journal จริง: billing/entitlement/webhooks; AI ที่อ้างอิงข้อมูลที่ผู้ใช้มีสิทธิ์เห็นพร้อม cost limit; Community พร้อม moderation/block/report/privacy ก่อน realtime chat. ไม่เปิดระบบจ่ายเงินจนมี terms, support และพฤติกรรมยกเลิกที่ชัดเจน

## กติกาป้องกันปัญหาจาก vibe coding

- หนึ่ง feature ต่อรอบ พร้อม behavior และ acceptance criteria ก่อนลงโค้ด
- TanStack Query เป็นเจ้าของ server cache; Zustand ไม่สำเนา trades ชุดเดียวกันอีกชุด
- คำนวณนอก component ใน domain functions; animation progress ไม่ใช้ React setState ทุกเฟรม
- Persist ใน database; localStorage สำหรับ preferences/drafts ไม่ใช่หลักฐานบันทึกสำเร็จ
- Lazy load media/charts; หยุด video/shader ที่มองไม่เห็น; ไม่ prefetch ข้อมูลส่วนตัวข้าม user
- ทดสอบ metrics และ access control จริง; ไม่ตั้งเป้า FPS/LCP โดยไม่ระบุอุปกรณ์และวิธีวัด
- Branch เล็ก, production build ก่อน merge, staging ก่อน production และตรวจ migration/backup

## การตัดสินใจที่ยังเปิดอยู่

1. Futures/prop firm หรือ MT4/MT5 เป็นกลุ่มแรก?
2. auto-sync ต้องเปิดพร้อม launch หรือ manual+CSV ยอมรับได้?
3. ชื่อแบรนด์, ภาษาหลัก, งบรายเดือน และบัญชีผู้ให้บริการของเจ้าของ?

แต่ละระยะต้องแตกเป็น implementation plan ของตนเองหลังขอบเขตอนุมัติ; เอกสารนี้ไม่สั่งติดตั้ง/ซื้อ/deploy service โดยอัตโนมัติ

## แหล่งอ้างอิง

- หลักฐานต้นฉบับ: docs/analysis.md และ docs/evidence.md
- https://nextjs.org/docs/app/getting-started/server-and-client-components
- https://motion.dev/docs/react-scroll-animations
- https://tanstack.com/query/latest/docs/framework/react/overview
- https://supabase.com/docs/guides/database/postgres/row-level-security

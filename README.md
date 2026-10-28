# LiquidJournal Engineering Study

รายการวิเคราะห์ LiquidJournal สำหรับศึกษาแนวทางสร้าง trading journal ของตนเอง ตรวจวันที่ 29 ตุลาคม 2026

[อ่านรายงานตามลำดับฟีเจอร์](docs/analysis.md) · [หลักฐานเชิงเทคนิค](docs/evidence.md) · [รายการ asset และ SHA-256](docs/asset-manifest.json)

เอกสารนี้แยกข้อสังเกตจากหน้าเว็บ, implementation ใน JavaScript ที่เว็บส่งถึง browser และข้อเสนอสำหรับระบบของเรา ไม่ได้เข้าถึง source server และยังยืนยันไม่ได้ว่าเว็บสร้างด้วย AI ใช้ฉบับตัดข้อมูลบัญชีส่วนตัว ไม่มี credentials, cookies, tokens, screenshots หรือ bundle ต้นฉบับใน repo

## รายการทั้งหมดที่วิเคราะห์

### 1. Dashboard — ตรวจเชิงลึกแล้ว

- [x] Total P&L: ชุดข้อมูล, real/paper, account/strategy/time scope, allocation, payout เทียบ trading P&L, การเปลี่ยน 7 วัน
- [x] Share profile: Month/Year/All, PNG export ใน browser, sparkline, share/download fallback, privacy และ scope
- [x] Performance cards: win/loss/breakeven band, win rate, profit factor, Avg Win RR, Avg Win/Loss, เกณฑ์เปรียบเทียบประวัติ
- [x] Cumulative P&L: daily aggregation, running sum, Recharts, animation, rounding, scope label
- [x] This Week: Monday boundary, totals, W/L, prior week, weekday bars, weekend/future-date edge cases
- [x] Liquid Score v2: data sources, window/fallback, normalization ทั้ง 5 แกน, equal average, missing axes
- [x] Legacy Liquid Score: ความต่างจาก v2 และ Discipline ที่เกี่ยวกับ AI ในรุ่นเก่า
- [x] Goals: daily/weekly/monthly, settings persistence, progress/overflow, date boundaries, scope
- [x] Calendar: daily/week/month aggregation, money/R/%, account-size denominator, R fallback, minimum bar size, day detail
- [x] Forex Factory: same-origin API, daily browser cache, refresh, filters, timezone, Forecast/Previous และข้อจำกัด realtime

### 2. Landing / Motion / Login — ตรวจแล้ว

- [x] Intro timing, scroll lock และการเร่ง intro เมื่อมี input
- [x] WebGL shader: FBM/noise, domain warping, luminance, radial reveal, grain
- [x] Motion headline, CTA visibility, reduced motion, visibility/GPU safeguards
- [x] Sticky showcase, poster/video loading, IntersectionObserver, hover tilt
- [x] NextAuth login, credentials/Google, internal callback, redirect และ login transition

### 3. Core application — ตรวจภาพรวม รอเจาะทีละฟีเจอร์

- [x] Journal: trade records, R, grade, emotions และ shared state
- [x] Analytics: setup/session/psychology และข้อจำกัดตัวอย่างขนาดเล็ก
- [x] AI: streaming, context inputs, cached narrative และ freshness/provenance
- [x] Prop firm: target, drawdown, daily loss, consistency, payout และ rule versioning
- [x] Study/Strategy: notes/folders/boards และการเชื่อมกับ trade/video/community
- [ ] Journal editor/import/dedup/correction audit แบบ end-to-end
- [ ] Analytics และ AI ทีละ workflow
- [ ] Prop firm stage/payout/multi-account mutation tests
- [ ] Study editor/media/revision/collaboration แบบ end-to-end

### 4. Community — ตรวจเชิงลึกแล้ว

- [x] Home: For you/Following/Friends, stories, composer และ reactions
- [x] Explore: topics, ticker, hashtags และ multi-topic publishing
- [x] Typed sharing: trade/strategy/note/board/theme/certificate/review
- [x] การนำเนื้อหากลับไป Study/Journal และประเด็น snapshot/source version
- [x] TanStack Query, cursor pagination, optimistic updates, rollback, cache/prefetch
- [x] Supabase Realtime: typing/invalidation implementation
- [x] Direct message: request/inbox, optimistic send, mute/block ใน client
- [x] Crews: identity, membership, open/request/invite, owner controls, paid/frozen state
- [x] Crew chat: HTTP polling, typing/presence และ scaling tradeoffs
- [x] LiveKit room lifecycle จาก client code; ยังไม่ได้เข้าห้องจริง
- [x] Report/Mute/Block/held-post implementation และ moderation unknowns
- [x] Trust: paid badge vs reviewed payout vs manually logged trade provenance

### 5. Architecture — ประเมินจากหลักฐานฝั่ง client

- [x] Next.js App Router / React / Turbopack / Vercel
- [x] Zustand, local storage, IndexedDB, persistent mutation outbox
- [x] Retry, batch, cross-tab lock, sync stamp และ merge reconciliation
- [x] Same-origin BFF/API boundaries
- [x] Stripe Elements และ billing lifecycle references
- [x] Broker/candle integrations ที่พบใน bundle
- [x] Supabase Storage/Realtime และ LiveKit evidence
- [x] CSP/security headers และ telemetry references
- [x] Public bundle scope และข้อเสนอแยก marketing/auth/app

## ยังยืนยันไม่ได้

Server database/ORM/schema/RLS, service topology, queue/cron/cache implementation, AI vendor/model, server authorization, realtime SLA, broker credential handling, webhook verification, ranking algorithm, moderation effectiveness, private-channel isolation และการ revoke เนื้อหาหลัง copy

ยังไม่ได้ทดสอบ concurrency, offline replay, load/performance บนอุปกรณ์จริง หรือแก้ข้อมูล production จึงไม่รับรอง correctness/security จากการพบ client code อย่างเดียว

## แหล่งข้อมูลหลัก

- [LiquidJournal](https://www.liquidjournal.app/)
- [Forex Factory Calendar](https://www.forexfactory.com/calendar)
- [Weekly economic calendar JSON](https://nfs.faireconomy.media/ff_calendar_thisweek.json)

ชื่อเทคโนโลยีและสูตรอ้างอิง deployment ที่ตรวจ อาจเปลี่ยนในรุ่นถัดไป Public asset URLs และ hashes ใช้ระบุเวอร์ชัน ไม่ได้รวมสำเนา source bundle ของผู้ให้บริการ

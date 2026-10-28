# LiquidJournal — Engineering evidence ledger

29 ตุลาคม 2026 · Supporting implementation observations; static capability is not observed execution.


---

# Liquid Journal: public shipped-code architecture evidence

Inspected 2026-10-29 Asia/Bangkok. Boundary: anonymous landing HTML and all 45 script URLs referenced by its `<script src>` tags; no auth, no API calls, no source maps or private resources. HTML the locally captured evidence; response headers the locally captured evidence; scripts the locally captured evidence; URL + byte count + SHA256 manifest the locally captured evidence. Total downloaded JS 4,595,016 bytes uncompressed. Bundled presence proves code shipped to landing, not executed during this visit.

## Observations

**B1 — Next.js App Router 16.3.4 + React + Turbopack.** `07tlgh5g9do43.js` literally contains `window.next={version:"16.3.4",appDir:!0}`. All assets use `/_next/static/immutable/chunks/`; chunk registration uses `globalThis.TURBOPACK`. React hooks/components and streamed RSC payload in HTML. HTML classes indicate Tailwind utilities; CSS extraction needed for exact version.

**B2 — Vercel host and dynamic landing response.** Headers: `server: Vercel`, `x-powered-by: Next.js`, `vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch`, `cache-control: private, no-cache, no-store, max-age=0, must-revalidate`, `x-vercel-cache: MISS`, `x-vercel-id: sin1::fra1::...`. This response is not CDN-cached. No reliable latency claim from these headers alone; Vercel region string is a hint, not full infrastructure map.

**B3 — NextAuth session stack.** `4546wqi1_5c1c.js` includes NextAuth APIs `SessionProvider`, `useSession`, `getSession`, `getCsrfToken`, `getProviders`, `signIn`, `signOut` and its next-auth error logger. Product Providers component in `1tlfn1h613prn.js` wraps app with `SessionProvider,{refetchInterval:300}`. Same bundle calls `/api/auth/session`. Exact server session strategy (JWT/database), password hashing, OAuth providers, session lifetime remain unknown from this scope.

**B4 — Same-origin application APIs / backend-for-frontend.** `3rieh_fll0fnx.js` implements GET/POST/PATCH/DELETE against `/api/data/${entity}`. GET uses `cache:"no-store"`; PATCH `{id,patch}`; deletes query an ID. Entity names observed: trades, journals, weekly, playbooks, profile, prop_firm, settings, ai_convos, ai_review, ai_patterns; `/api/study/doc` also exists as client reference. This supports Next.js-based BFF or proxy architecture. It does not prove database schema, server route implementation or tenancy enforcement.

**B5 — Optimistic persistent client and explicit sync/recovery layer.** Zustand `create`, `persist`, `createJSONStorage` code in `3rieh_fll0fnx.js`. Persistent mutation outbox key `tv-outbox` for entities `["trades","journals","weekly","playbooks"]`; coalesces save/patch/delete by entity:id; overlays queued mutations onto fetched data. Retry verdict: network/408/425/429/5xx retry; 401/412 pause; 413 split for batches; other statuses drop. Outbox flush uses `navigator.locks.request("tv-outbox-flush",{ifAvailable:true})`; trade saves batched in groups of 200. Tracks `pending`, `failing`, `offline`, `tooLarge`, `memoryOnly`, `loadFailed`. Local-storage quota warning explicitly says trade saved to memory but could not persist. Strong evidence of deliberate resilience; actual reliability and multi-device consistency not tested.

**B6 — Server stamps and merge reconciliation.** Mutation responses read `X-Sync-Stamp` and `X-Sync-Prev`; app sync logic fetches `/api/data/stamp` and refreshes only moved entities; parallel entity loads use Promise.all. `settings` and `prop_firm` writes send `{data,merge:true,base:...}`; prop firm writes serialize and wait for trade-save idleness, up to 10 s in client. This is a custom consistency protocol. It is not evidence of CRDT, event sourcing, SQL transactions, or conflict-free server guarantees. Focused later audit should test concurrent edits, retries, delete resurrection, identity switching and stale bases.

**B7 — Stripe subscription integration.** `1tlfn1h613prn.js` includes @stripe/react-stripe-js/Stripe Elements code; `08ejs0cfik885.js` includes Stripe.js loader. `0lc68kh4gvxva.js` POSTs `/api/stripe/checkout` body `{plan,billing,ui:"elements",discountCode}` and caches in-flight checkout promise for 10 minutes. References to `/api/stripe/portal`, `/api/stripe/change-plan`, `/api/stripe/downgrade`, `/api/stripe/activate`, `/api/stripe/credits`, `/api/gift/checkout`. Activate polling handles processing. Webhook signature verification, billing authorization and idempotency unobserved.

**B8 — AI server boundary and streaming.** `39if02ke0dpt3.js`: POST `/api/ai-coach` with messages/trades/journals/profile/accounts/speed/weeklies/strategies/traderName; response consumed via `body.getReader()` + TextDecoder, updating an AI message incrementally; AbortController handles cancellation. `/api/ai-cowork`, `/api/ai-credits`, `/api/prop-ai`, `/api/ai-consent`, `/api/transcribe`, `/api/cowork-log` referenced. AI provider/model, prompts, retention, queue design unobserved. Privacy implication: client sends rich journal/trading context to same-origin endpoint; subsequent external processor not established.

**B9 — Broker sync integrations behind server endpoints.** Bundle references connect/disconnect/status/pending/refresh/sync for Rithmic and TopstepX, and replica integration. `/api/brokers/rithmic/...`, `/api/brokers/topstepx/...`, `/api/brokers/replica/...`. Frontend bundled Rithmic gateway names. Do not claim active sync was seen; credential storage/encryption, job scheduling, import deduplication and rate limits unknown.

**B10 — Supabase allowed for storage and realtime.** Actual HTML response CSP includes `https://xffvlseuwzupkyoasaef.supabase.co/storage/v1/object/` in media/connect and `wss://xffvlseuwzupkyoasaef.supabase.co/realtime/v1/` in connect. No Supabase SDK/URL found in these 45 JS chunks. Upload flows in `018tb-v6o9sfq.js` and `3-bbhnfrhao1-.js` first POST metadata to `/api/themes` or `/api/share-bg`, PUT blob to response-provided URL (`content-type`, `x-upsert:true`), then PATCH uploaded confirmation. `1sqdod2hk78qw.js` POSTs image dataUrls to `/api/media/upload`. Strong inference Supabase object storage; Supabase Postgres use is plausible, not proven. CSP also permits LiveKit cloud and Liveblocks; allowlist alone cannot prove either is in use.

**B11 — Charts, native bridges, indexed storage, telemetry.** Recharts code/classes shipped in `2i2_moe12axoe.js`. `/api/candles` references accept symbol/asset/date/type/entryTs/exitTs/interval (1m,1s). IndexedDB used for app backgrounds/share-background media and a per-user store in `08ejs0cfik885.js`. Native app bridge detects native, hideSplash/openInSafari/haptic; web push and native push-token endpoints. These establish client capability references, not release status. Sentry SDK literal version 10.73.0 in `07tlgh5g9do43.js`; custom `/api/client-error` in small chunks includes build identifier. SDK inclusion does not confirm Sentry events are currently sent.

**B12 — Baseline defensive headers.** CSP script nonce and strict-dynamic; frame-ancestors none; object-src none; base-uri/form-action self; HSTS; X-Content-Type-Options nosniff; X-Frame-Options DENY; referrer policy strict-origin-when-cross-origin; geolocation/USB disabled via permissions policy. Useful baseline, not a security audit. Does not establish authorization, RLS, secret handling, injection safety or data protection.

## Architecture interpretation

Observed client shape: Next.js App Router server HTML + React client modules → Zustand/persistent local cache/outbox → same-origin JSON route layer → domain services (journal, broker sync, candles, AI, subscription, community). Object upload paths are brokered by same-origin metadata endpoints with direct storage uploads. Plausible modular monolith/BFF on Vercel, but function count/microservices/process boundaries remain unknown. No evidence sufficient to assert Prisma, Redis, background queues, SQL engine, cloud AI provider, dedicated compute service, or full Supabase database architecture.

## Evaluation and tradeoffs

Good: fast optimistic UI and durable retries are much more substantive engineering than landing visuals; server-mediated billing/AI/broker work keeps privileged operations off client; domain-specific route naming gives clear service boundaries; native-aware and recovery-aware flow is deliberate.

Risks to investigate: custom sync complexity, failed nonretryable writes being dropped, local storage quotas and sensitive local copies, AI request context growth, server reconciliation under simultaneous edits. Most conspicuous delivery concern: anonymous landing HTML references ~4.6 MB of raw JS across 45 chunks, including authenticated product, settings/admin UI references, broker integration and checkout components. This increases parse/hydration scope and suggests global providers import too much. This is not secret exposure by itself and does not show admin access vulnerability; validate actual transferred compressed bytes and execution before claiming performance harm. Route-based lazy imports and narrower providers are a concrete improvement hypothesis.

## Source URLs

Base: https://www.liquidjournal.app/
Script URLs: https://www.liquidjournal.app/_next/static/immutable/chunks/FILE_NAME above; exact manifest retained. All file names, excerpts and claims tied to downloaded bytes; these are local evidence labels B1-B12, not REA tool Evidence IDs. REA MCP unavailable in this session; work was direct static inspection.

## Dashboard-delivered public code addendum

Parent observed authenticated dashboard DOM and provided 14 additional script URLs; fetched these public static assets only, with no cookies and no API requests. Names: 3f_o3372hnn1u.js, 3g53kuvt7n6dl.js, 3ivs_5n81h94u.js, 3xwwkke9zo8p1.js, 0qi59qxmg8vkz.js, 0trrnrnqkp8ut.js, 1u5mrna3jmzyy.js, 1w2renl8t1ciu.js, 429r5cw41-mug.js, 1_r2c9ecqch2d.js, 15z0o_e8g2egb.js, 2dw4jyqvzk993.js, 2ud3npa5i5w5r.js, 2ceh1ifu9wb7o.js.

B13 — Extra AI routes and local analytical preprocessing: `/api/ai-review` returns JSON result cached locally with a fingerprint and counts; `/api/ai-patterns` POSTs trades and speed, uses AbortSignal.timeout(200000), saves returned cards through dbSaveAiPatterns; `/api/compare-ai` sends side aggregates (mistake frequencies, playbook/symbol groups, holding duration, long/short P&L, plan adherence); `/api/journal-review` builds summary textual context client-side. This suggests a mix of browser deterministic metrics and server AI narratives, rather than all analytics being LLM calls. Source `3g53kuvt7n6dl.js` and `1u5mrna3jmzyy.js`. Provider/model still unknown.

B14 — Economic calendar cache: `3ivs_5n81h94u.js` GET `/api/economic-calendar` with browser localStorage day-scoped cache; filters currency and impact client-side. Data vendor/source and server cache unknown.

B15 — Stronger LiveKit-compatible integration evidence: `429r5cw41-mug.js` asynchronously loads module 746505, creates `new e.Room({adaptiveStream:{pixelDensity:"screen",pauseVideoInBackground:true},dynacast:true,webAudioMix:true,...})`, uses RoomEvent/AudioPresets, connects with `{url,token}` received from `/api/cm/live/${id}/join`, manages microphone/screen sharing, and sends periodic beats. Combined with explicit *.livekit.cloud CSP, this strongly supports a LiveKit-based community live room architecture, rather than CSP-only speculation. No live room joined, no mic enabled, no token requested in this investigation. B10 Liveblocks remains allowlist-only.

B16 — Supabase storage gets another corroboration: community media allowlist in `429r5cw41-mug.js` and `15z0o_e8g2egb.js` contains the same Supabase origin; still not proof of SQL schema/RLS/ORM.


---

# Community static evidence ledger (29 Oct 2026, Asia/Bangkok)

Boundary: previously captured public chunks plus 17 public script URLs observed by parent in authenticated Community DOM. Fetched public files without cookies. No APIs invoked, messages/posts sent, joins, follows, likes or permission changes. Labels C1–C12 are local report labels, not REA Evidence IDs. Bundled implementation is not proof of runtime execution or server enforcement.

## C1 — Separate social data/client boundary

`15z0o_e8g2egb.js` wraps Community with QueryClientProvider using `cmQueryClient`. `13nkc-cmx49jp.js` defines Community query keys and patchPost/patchUser/dropPost updates across feed/thread/profile caches. `2j8b5tuv_nfk6.js` uses useQuery/useInfiniteQuery/useMutation. UI view/modal/look/composer state comes from `useCmUi` (Zustand pattern). This is a more appropriate server-query cache than pushing every social object through the journal's persistent mutation outbox. Do not claim separate backend service solely from this boundary.

## C2 — Feed, filtering and pagination

`2j8b5tuv_nfk6.js` useCmFeed calls `/api/cm/feed`, `initialPageParam:null`, `getNextPageParam:e=>e.next`. `13nkc-cmx49jp.js` feedSearch supports tab/topic/tag/hashtag/q/user/crew/mine/kinds/replies/cursor; ticker normalized uppercase, hashtag lowercase, crew uppercase. `429r5cw41-mug.js` FeedList uses IntersectionObserver rootMargin `900px 0px` to load next page ahead. Parent confirms For you / Following / Friends UI. `15z0o_e8g2egb.js` explicitly defines friends as mutual following. Ranking algorithm, scoring, moderation ordering and index design are server-unknown; the label For you alone does not prove ML recommendations.

## C3 — Feed continuity and perceived speed

Home/following/friends first-page placeholder is read from sessionStorage only when stored identity matches current identity and age <600000 ms (`2j8b5tuv_nfk6.js`). Feed-seen markers produce New posts and a seen-line rather than forcibly moving the scroll position. After feed loads, shell warms other views after 600ms; prefetches profile/chat on hover/focus/touch with 60s per-key throttle (`15z0o_e8g2egb.js`). Following/friends/notif prefetch delay 400ms, staleTime 30s (`2j8b5tuv_nfk6.js`). Benefits fast navigation, but warm-all behavior can consume mobile bandwidth. Actual request/parse costs not measured.

## C4 — Optimistic reactions and identity relationships

`2j8b5tuv_nfk6.js` useCmReact POST `/api/cm/posts/ID/react` body `{what,on}`, patches counts and you flags optimistically, reverts on error, reconciles counts with response. Follow POST `/api/cm/follow` body `{pid,on}`; optimistic requested state for private users and friend flag for reciprocal public following. Read-only browser inspection did not exercise mutations. Private-profile authorization must be server-enforced, unverified.

## C5 — Hybrid update transport, not one universal websocket

`2j8b5tuv_nfk6.js` useCmStampSync listens to shared feed/dm/notif stamps and invalidates inbox/chat/notif/unread queries. Changed feed stamp causes a top-page comparison and shows New posts if appropriate. Stamp acquisition producer not fully traced here, so no exact universal refresh interval claim.

**Supabase Realtime now directly confirmed as shipped implementation**: `429r5cw41-mug.js` dynamic createClient with Supabase origin, auth persistSession/autoRefreshToken/detectSessionInUrl false, eventsPerSecond 5; channel(name,{broadcast:{self:false}}), event `t`, peer handle filtering. Typing broadcasts throttle at 2000ms; typing expires after 5000ms; sent:true invalidates chat/inbox. Shell follows up to first 30 inbox threads when cm-typing feature flag enabled. The client contains a public anon credential; not reproduced and not treated as a secret leak. Actual connection and private-channel authorization untested. This upgrades prior report's CSP-only observation for Supabase Realtime; SQL database use still unknown.

## C6 — DM request and privacy boundaries

`2j8b5tuv_nfk6.js`: `/api/cm/dm?box=inbox|requests`; `/api/cm/dm/THREAD?cursor=...`; POST message `{to,text,kind,ref,media?,gif?}`. useCmSend inserts temporary messages and replaces/reverts with server outcome; read/accept/decline actions reconcile unread count and status. `3_2-x3qltx8r0.js` requests private:true for photo upload and exposes mute state; `011athhcbz3yu.js` and `445odbax5i1yy.js` expose Mute and Block with user-facing explanations. None of this proves end-to-end encryption, signed media isolation or retention guarantees.

## C7 — Crews: membership, permissions and monetization

`0_p8-e5r4mt03.js` and `2m87lyespp4n1.js`: `/api/cm/crews`, `/api/cm/crews/me`, `/api/cm/crews/TAG`; mutations join/cancel/leave/create/edit/delete/keep. Membership modes open/ask/invite; owner actions include accepting/declining requests and removing a member. Member-only chat is client-gated; posts may remain readable outside membership (parent UI observation). Frozen crew copy: no new members until owner is back on Apex, existing members stay. This couples paid host privileges with community access and avoids immediately destroying member access. Server ACL and invite entropy/rotation unverified.

Top crews label says last 14 days and UI shows active members. `rankOf` simply trusts server rank or array index; no client ranking formula. Parent confirms one crew at a time; creation copy says one crew change today. Client UI statements are not evidence backend enforces quotas.

## C8 — Crew chat transport and scale tradeoff

`0_p8-e5r4mt03.js` useCrewChat initial GET `/api/cm/crews/TAG/chat`; then every 4000ms while document visible GET `?after=lastCreatedAt`; older `?before=firstCreatedAt`, merges/dedupes IDs. Response includes here/typing fields. Typing POST `/chat/typing` throttle 2000ms. This is HTTP polling and differs from DM typing's Supabase broadcast. Rough architectural implication: N visible chat clients create about N/4 poll requests per second before typing/send traffic (not measured actual throughput). Timestamp-only cursor ties, deletion sync, ordering under concurrent inserts and long-history pagination need tests; presence of this client code does not prove bugs.

## C9 — Typed sharing and return path into the product

`0aeuerprvky5p.js` builds share choices from trades/strategies/study notes/boards/themes/certificates/reviews. Trade preview includes symbol/direction/pnl/rr/strategy; attachments carry type and sourceId. Optional trade extras include pictures/confluences/timing/review, composed through withExtras. `2j8b5tuv_nfk6.js` POST `/api/cm/posts/ID/use` marks used and increments uses after copying into own journal; GET `/api/cm/posts/ID/note` reads shared note. Board API offers `/api/cm/posts/ID/board?since=...`; internal board save uses `{baseRev,update}`. This proves typed/domain-aware sharing rather than only images/text.

**Snapshot vs live link remains unresolved**: preview and sourceId do not prove server stores immutable snapshot, nor whether editing/deleting original revokes copies. Shared board since parameter suggests incremental reads, not by itself a live-updating post guarantee. Recommend explicit provenance/source version, copy vs linked labels, deletion/revocation semantics and per-attachment privacy preview. Do not invoke /use as a read operation: it writes user data.

## C10 — Stories and live room lifecycle

`1_r2c9ecqch2d.js`: likeStory, postStory, replyToStory (DM story_reply reference), deleteStory. `0aeuerprvky5p.js` UI says added story for 24 hours; actual expiration server enforcement/storage deletion unknown. `0k2m_6bnrs0dg.js` ships story editor with typed text/ticker stickers/font styles.

Live room implementation remains `429r5cw41-mug.js`: same-origin room join returns {url,token}, LiveKit Room adaptiveStream/dynacast with mic/camera/screenshare lifecycle; heartbeat at server beatSeconds and 30s refresh in joined state; listener/host roles and local mini player. Parent sees currently empty Live UI; no room joined. Therefore implemented capability strong, current live experience/quality untested.

## C11 — Moderation exists, effectiveness unknown

`2ud3npa5i5w5r.js` report categories exactly Spam, Selling signals, Abuse, Something else; action report -> `/api/cm/moderation`; confirmation text says team will look at it. Own-post edit/delete have client controls. `445odbax5i1yy.js`/`011athhcbz3yu.js` user menu Mute (leaves feeds) and Block (no longer see each other). `0nptr_ecqz1bf.js` post response supports held state and copy 'LIQUID takes a quick look before others see it'. No evidence that all posts are premoderated, of automated classifiers, response SLA, or server block enforcement.

User-generated posts can contain distress, harassment or manipulative financial content. Treat this as a concrete community-operations responsibility; report existence is not a demonstrated escalation system. Avoid quoting or naming vulnerable members in report. Separate paid badge, independently verified trader evidence and unverified journal-derived numbers.

## C12 — Claims and product risks

Journal-share UI says numbers come from journal so nobody can fake them (`0aeuerprvky5p.js`). This establishes internal provenance only: manual journals, selected winning posts and optional hidden context can still mislead. UI preview marks many noncertificate attachments verified; not proof of server verification. Paid Blue badge likewise verifies paying status, not trading skill or broker data. Parent DOM offers explanatory badge labels, which is positive; visual hierarchy should preserve these distinctions.

Community's strongest moat is learning loop: trade → explain/share → save another person's study/strategy → use/review. A generic timeline plus P&L leaderboard can instead reward performance theater. Prioritize domain content discovery, provenance and useful saves over raw engagement and winner-only screenshots.

## Open questions

Server ranking formula, social schema/indexes, moderation staffing/automation, rate limits, content authorization, anti-scrape, private attachment delivery, channel isolation, E2EE, membership enforcement, source revocation, data retention and actual runtime network timing are unknown. No claim of vulnerability follows from these unknowns.


---

# Dashboard metrics evidence — 29 Oct 2026

Scope: static shipped JS captured in prior investigation, plus four public script URLs supplied from the actual Share profile dialog DOM. No authenticated API requests or mutation tests. These are report-local labels, not REA Evidence IDs. Sources are deploy-specific chunks; use named exports and snippets below to re-find exact code.

## D-M1 — Shared dataset and hero scopes

`3g53kuvt7n6dl.js` dashboard module330257 reads `z=useTrades()`, journals `E`, weeklies `O`, accounts `I`, sync groups `F`, scope groups `W`, profile `Y`, playbooks `H`. `08ejs0cfik885.js` module872013 export useTrades returns inMode(store.trades, tradeMode), bypassed for demo. Thus real/paper selection occurs before Dashboard calculations. Server data enters persistent app stores from earlier B4-B6 sync layer; widgets are client aggregation, not separate live graph APIs.

Hero scope `ee = explicitlyPicked ?? validHeroScopeFav ?? {kind:"all"}`. Favourite stored as heroScopeFav; star controls it. `er` is selected trade array:
- all: all z
- 30d: `date >= format(subDays(new Date(),30),"yyyy-MM-dd")`
- week: `date >= format(startOfWeek(new Date(),{weekStartsOn:1}),"yyyy-MM-dd")`
- strategy: `trade.strategyId===scope.id`
- scope account/group: `filterByScope(z,value,W)` (allocations matter; generic amountForAny/scopeToAccounts in 2-ha43si5pot3.js use account allocations)
- realized: er remains z; only hero amount switches to payout sum.
No upper-date bound in hero week/30d branch. This is a code boundary, not proof actual data includes future trades.

## D-M2 — Total P&L and seven-day comparison

`2-ha43si5pot3.js` module349313 `calcStats`: excludes noTradeDay, sums literal `pnl`. Does not subtract fees here: whatever is stored in pnl is the input. Trade editor elsewhere can produce fee-adjusted pnl, but graphs must not subtract fees again.

Hero `CountingMoney(value: realized ? payoutTotal : stats.totalPnl, signed:true,hidden:hidePnl,glow:true)`. Color follows totalPnl outcome even realized path uses payout amount, implementation detail worth auditing visually. W/L counts are stats wins/losses.

Seven-day caption: cutoff browser-local yyyy-MM-dd seven days ago; base=sum(selected non-noTrade trades with date<=cutoff), now=sum(all selected actual trades), change=now-base; if abs(base)>1, pct=change/abs(base)*100 else absolute money. This is change in cumulative realized P&L, NOT return on initial capital. It may give huge/odd percentages near a small cumulative base. Display abs(pct).toFixed(1) plus arrow conveys sign.

Realized mode payout calculation uses `usePaperAwareFunded()`: iterate all payouts with finite numeric amount; total/count/accounts counted; prior base sums payout date<=seven-day cutoff. Realized payout amount differs from trading P&L; header explicitly says Realized (payouts).

## D-M3 — Performance cards precise formulas

`calcStats` in `2-ha43si5pot3.js`:
```
actual = trades.filter(!noTradeDay)
winners = actual.filter(isWinPnl(pnl))
losers  = actual.filter(isLossPnl(pnl))
decisive = winners.length+losers.length
winRate = decisive ? winners.length/decisive*100 : 0
profitFactor = absLoss>0 ? grossWin/absLoss : grossWin>0 ? Infinity : 0
avgWin = grossWin/winnerCount or 0
avgLoss = absLoss/loserCount or 0
avgRR = mean(rr) only on winning trades with rr!==undefined
avgR = mean(rr) on all actual trades where rr!==undefined
```
Win/loss helpers in module252784 use adjustable breakeven band `pnl>band` / `pnl<-band`; default settings may be zero but user can change it. Therefore winRate denominator excludes break-even-band trades, despite generic tooltip saying winning/total. TotalTrades still includes breakeven actual trades. Avg Win RR is not avgR and not avgWin/avgLoss.

Dashboard feeds cards Win Rate, Avg Win RR (sub-label PF), Avg Win/Loss using selected `er`. Currency helper `formatCurrency` is whole USD; RR 2 decimals; Win Rate in cards normally 1 decimal. In Share profile win rate uses 0 decimals.

`calcStatDeltas(er)` compares recent 30 days against preceding 30. UTC date cutoff helper uses toISOString().slice(0,10) after subtracting ms; recent `date>cutoff30`, previous `cutoff60<date<=cutoff30`. If previous period lacks needed evidence, fallback all earlier trades. Win rate delta requires >=5 decisive trades each period; avgRR requires >=3 winning trades with R and avgRR>0 each; avgWin delta >=3 wins and >0. Relative percent change `(current-prior)/prior*100`, not percentage-point change. Cards show Not enough history yet when comparison unavailable. Does not establish statistical significance.

## D-M4 — Cumulative P&L

`calcDailyPnl`: group selected actual trades by `trade.date`, sum pnl per date, sort date strings ascending, cumulative running sum. No empty-day interpolation and no opening account capital. Data passed to chart maps date to locale `MMM d` and value `Math.round(cumulative)`, so cents lost for plotting.

`3g53kuvt7n6dl.js` memoized `ah`: ResizeObserver for dimensions, double-rAF before first draw, Recharts AreaChart; monotone Area, stroke2, gradient fill, CartesianGrid horizontal dashed, Y domain auto plus max(8% abs(max),1), currency tick formatter. Animates 1100ms ease-out then endpoint glowing dot. Tooltip disabled under hidePnl. Entire curve color is positive/negative final total, not segmented by positive/negative individual points. Curve begins at first traded day, unlike share card curve which prepends 0.

**Scope mismatch in label:** displayed header is hardcoded “All time” although its `data=eL` comes from `er`, i.e. current hero scope. Recommend show applied scope and full ISO dates as keys. Current pretty date keys omit year and can collide across years; did not test rendering failure.

## D-M5 — This Week

`3g53kuvt7n6dl.js` e7 useMemo uses selected `er`, excludes noTradeDay. Week starts Monday local browser; current trades filter parseISO(date)>=startMonday; prior week uses prior Monday<=date<=Sunday. Sums pnl, decisive W/L win rate rounded to integer. Metrics compare prior week pnl and win-rate percentage-point delta; no upper-bound current date filter. “Monday to today” label may be broader in data if future-dated records exist.

Five day bars built Monday-Friday only, each sums selected trades for its date, `traded=length>0`, `future=barDate>new Date()`, normalization `dayMax=max(abs(dayPnl),1)`. Main week's sum can include weekend trades though weekend bars absent. This is important for crypto/weekend-capable product generalization.

## D-M6 — Goals

Dashboard tr component separately calls `useTrades()` (unfiltered by hero scope), `store.goals`, hidePnl. Goals data shape `{daily:number|null,weekly:number|null,monthly:number|null}`; source 1sqdod2hk78qw.js real setGoal updates Zustand and immediately `persistSettingsNow(getState())`. That delegates to dbSaveSettingsPatch and earlier /api/data/settings layer; not a fresh computation API.

Actuals exclude noTradeDay. Daily matches local `format(now,yyyy-MM-dd)`; weekly includes local Monday00:00 through Sunday23:59:59.999; monthly local month start/end. Repeating targets, not per-date goal records. Goals do not inherit Total PNL hero strategy/account/window filters; mode-aware real/paper selection still applies.

Edit strips non-numeric/./- characters then parseFloat; finite positive -> target, else null (clear). Enter saves, Escape cancels. No min increment/upper cap observed in this form. Progress `fill=clamp(actual/goal,0,1)`, `over=max(0,actual-goal)`, hit actual>=goal. Negative P&L gives zero progress. Main bar + optional bright overflow width min(33,over/goal*100); display whole USD. Input must not be treated as change already authorized during read-only audit.

## D-M7 — P&L Calendar

`3jwdyu-2gr-70.js` module PnlCalendar receives selected `er`; group per date excludes noTradeDay and accumulates pnl/count/wins/losses/ids/rSum/rN, using tradeR helper. Month summary is sum only in displayed month; month changes via subMonths/addMonths. Sunday-first rows, each 7 days and eighth week-total cell. Week aggregate includes ONLY cells inside month; at month boundaries calendar week-total is a partial week even when share opens a full week period (uses row Monday date). Explain this in recreation.

Supports money/R/% depending feature settings. R total sums available tradeR values, not average; missing R shown as count coverage. % uses account-size-aware `usePct` and reports missing account size; don't claim simple global pnl/startCapital without tracing that helper.

Money bar rule `eT(amount,target,maxAbs)`:
- if amount<0 OR target absent/nonpositive: pct=max(18,min(100,abs(amount)/maxAbs*100)), overflow0
- else pct=max(18,min(100,amount/target*100)); overflow=min(30,(amount-target)/target*100) if >target
Thus bars have minimum18% for readability; not precise linear magnitude at low amounts. Positive day bars compare daily goal; negative day bars relative to month max loss/profit absolute; R/% always relative max. Week bars similarly use weekly goal vs month's largest week. Color semantic outcome.

No-trade-day markers come via deskNoTradeDates; count of 'trading days' includes explicit no-trade choice, while actual trading-day count differs. Click real day opens sheet/modal with day PNL, W/L, individual trade links, Share day and Daily journal. Month/week/day sharing opens ShareCardModal rather than posting directly.

## D-M8 — Share profile, not public profile publishing

Public fetched the locally captured evidence, module496050 export FlexShareWindow. Parent observed modal then closed without sharing.

Uses independent `useTrades()`, mode-aware challenges/funded/accounts; default range all, Month/Year/All. Month/year select via `now.toISOString().slice(0,7|4)` and `trade.date.startsWith(...)` -> UTC boundary, unlike goals' local dates. Doesn't inherit hero scope.

Card aggregates calcStats, actual trades; winner/loser counts; dominant symbolRoot by NUMBER of trades, share=dominantCount/allCount, not exposure or PNL. Firms count challenge+funded accounts and broker marks include accounts; these counts not restricted to trades in selected time range. Sparkline starts [0], sums daily pnl, scales min/max into custom SVG polyline (not Recharts), requires >=3 points.

Export: offscreen card width420xheight760; `toPng(element,{pixelRatio:2.6})`, PNG nominal1092x1976; after double-rAF, blob to File. If web navigator.canShare(files), navigator.share({files,title:"LiquidJournal"}); abort exits; otherwise downloadDataUrl. Native app skips navigator share path. No server export endpoint/public URL or social posting in this specific code path. Needs explicit review of visible content before user shares; hidePnl from dashboard is not read in this card export module, so don't assume it redacts export.

## Rebuild implications

1. Define a single explicit DashboardScope object and surface it on EVERY affected widget; goals/share should say whether they deliberately ignore it.
2. Store money integer cents; maintain precise values while formatting/plotting. Separate net trading PNL, payouts, equity, and capital return.
3. Centralize exchange/session-date vs browser timezone, UTC ranges, week start and DST. Current code uses mix of local date-fns boundaries and UTC prefixes.
4. Use calendar bars as decorative progress only if min fill is explained; don't imply minimum18% encodes exact performance.
5. Reuse deterministic selectors for metrics, chart, calendar and exports; keep AI narrative separate. Tests should target breakeven band, noTrade, empty periods, future records, weekend, month boundary, multi-account allocations, no-loss PF infinity.


## D-M9 — Calendar percentage and R exact helpers (follow-up)

Source `3jwdyu-2gr-70.js`, modules553826 /682100 /739520; `2-ha43si5pot3.js` module349313 realizedR.

### Percentage is pooled unique account nominal capital

`usePct` reads feature preview pct-pnl, mode-aware useAccounts(), propFirm.challenges/fundedAccounts and store.pctBase. `accountSizes(accounts,challenges,funded)` map:
- broker account id -> broker.startingBalance when >0
- challenge.tagId -> challenge.accountSize when >0
- funded.tagId -> funded.accountSize when >0 (later map assignment can replace earlier same id)

For each actual trade (skip noTradeDay), get unique `[account,...extraAccounts]` nonempty IDs; if no IDs, sentinel none. For each referenced account choose mapped size, else global positive pctBase; sentinel uses pctBase. **If ANY account on this trade lacks a positive mapped/fallback size, skip WHOLE trade and increment missing.** Otherwise add whole trade.pnl to numerator and add each account id/size to a Map (count each account's capital once within that selected period).

```
pct = includedTrades>0 && sumUniqueCapital>0
    ? sumIncludedTradePnl / sumUniqueAccountCapital *100
    : null
```

Result also returns n included count, missing count, capital. Calendar computes this separately for each day/visible row/month; denominator may differ between days as participating account set changes. It does not sum daily percentages into monthly percentage. It is not equity-adjusted TWR, compounded return, drawdown-based risk return, or simple average of account percentages. The nominal starting size of a prop account is not the trader's economic capital at risk. Global pctBase may also stand in for missing account sizes, so UI should label the basis explicitly.

Synthetic example: dayA accounts A=25K and B=50K, pnl total750 ->1%; another day only A pnl250->1%; combined month uses total1000/(25000+50000)=1.3333%, not 2%. A trade with knownA and unknownB but no fallback is wholly omitted, not partly allocated. Missing count must remain visible.

Formatting `formatPct`: abs>=10 ->1 decimal, else2 decimals; formatted numeric zero becomes 0%, otherwise signed +/−. Calendar % selection gated by pct-pnl feature flag; if persisted calendarUnit pct while flag off fallback money.

### R fallback

`tradeR(trade)` uses finite numeric trade.rr if present; else `realizedR`:
- require entryPrice, exitPrice, stopLoss all not undefined
- long risk=entryPrice-stopLoss; R=(exitPrice-entryPrice)/risk
- short risk=stopLoss-entryPrice; R=(entryPrice-exitPrice)/risk
- risk<=0 ->null

No quantity, tick value or fees included in this fallback. Calendar sums R for all available values and counts coverage; noTradeDay excluded before helper. This differs from calcStats.avgRR/avgR which only use explicitly defined rr and do NOT call realizedR, so Calendar may show R when performance RR missing.



---

# Dashboard score / metrics: static evidence

Inspected shipped assets dated 29 October 2026. Local evidence labels D-S1–D-S9, not REA Evidence IDs. No target UI or API mutations. Main source: https://www.liquidjournal.app/_next/static/immutable/chunks/3g53kuvt7n6dl.js . General stats: https://www.liquidjournal.app/_next/static/immutable/chunks/2-ha43si5pot3.js .

## D-S1: Active version must be identified

Dashboard contains BOTH legacy and score-v2. `usePreview("score-v2")` selects path. Current inspected UI had the Score window switch, supporting the v2 branch. Do not describe v2 Discipline as AI. Legacy path remains in bundle; its implementation differs materially.

## D-S2: Data pipeline and scopes

Dashboard calls `useTrades()`, `useJournals()`, `useWeeklyReflections()`; data from shared client stores, not a new AI call per score. `08ejs0cfik885.js` useTrades passes records through `inMode`; `1sqdod2hk78qw.js` inMode returns paper records if paper mode, nonpaper if live. Demo bypasses this normal mode filtering.

Dashboard `er` view selector supports all; 30d (`date>=subDays(now,30)`); current week Monday; strategyId; account/group via filterByScope. Account/group scope remaps record `pnl` to selected account allocation (`amountFor`/`scopeToAccounts`), not necessarily entire original trade P&L. This means score monetary stats can change when scope changes; `rr` is not recomputed by this remapping itself.

V2 passes `trades: e1` where `e1 = strategy or scope ? er : z`. Thus hero time choices (30d/week/all/realized) do NOT automatically become v2 score time filter; the score's own switch controls time. Strategy/account scope DOES affect performance spokes. V2 passes `journalTrades:z` independently, so Discipline uses all mode-selected trades/journals rather than only selected strategy/account.

V2 `tM({trades,journalTrades,journals,weeklies,asOf,window,minTrades=10})` filters dates <=asOf; computes inclusive last30 calendar dates from asOf-29 to asOf. If 30d selected but fewer than 10 non-noTradeDay records in those dates, fallback all-time. This is a window fallback, not statistical reliability proof. Future-dated records excluded in score. NoTradeDay removed from performance and consistency.

## D-S3: General metric formulas

Source `2-ha43si5pot3.js`, exported calcStats:

- realTrades = records where !noTradeDay
- wins = pnl > B; losses = pnl < -B; `B` is user break-even money band
- decided = wins+losses; break-even trades are excluded from win-rate denominator
- totalPnl = sum pnl across all realTrades, including break-even-band trades
- winRate = wins/decided*100, or0
- grossProfit=sum pnl of wins; grossLoss=abs(sum pnl of losses)
- PF=grossProfit/grossLoss; if zero grossLoss and positive grossProfit => Infinity; otherwise0
- avgWin=grossProfit/wins; avgLoss=grossLoss/losses
- avgRR = mean rr among winning records that have rr !==undefined (not necessarily planned entry R:R)
- avgR = mean rr among ALL records with rr !==undefined, wins+losses+break-even
- best/worst=min/max pnl across realTrades

`breakevenRange` is settings data, fallback legacy palettes[].breakevenBand; positive finite amounts, default0. Thus Win Rate can change without trades changing when break-even range changes. `rr` source may originate from logging/import; this function does not derive it from candles. Missing R means excluded from avgR/avgRR, not zero-filled.

## D-S4: V2 exact normalization

Let clampRound(x)=max(0,min(100,round(x))). Every spoke rounds/clamps before averaging.

Let p=wins/(wins+losses), A=avgWin/avgLoss when both positive, b=1/(1+A), the win rate needed to break even given observed payoff. If no losses and wins>0, b=0. Otherwise b may be null.

### Win Rate score

- b null: clampRound(100*p)
- p>=1:100
- b<=0:clampRound(40+60*sqrt(p))
- p<=b:clampRound(40*p/b)
- p>b:clampRound(40+60*sqrt((p-b)/(1-b)))

This is deterministic payoff-aware normalization, NOT Bayesian estimation. Break-even scores40; p=100% scores100. This can produce score66 when raw win rate is43.8% because avg winner is substantially larger than avg loser.

### Profit Factor score

Infinity=>100; PF<=1 =>clampRound(40*PF); PF>1 =>clampRound(40+60*(PF-1)). PF1 =>40; PF2 or above=>100.

### Avg R score

avgR>=0 =>clampRound(40+150*avgR); avgR<0 =>clampRound(40+100*avgR). 0R=>40; +.4R=>100; -.4R=>0. Eligibility requires at least one record with rr !==undefined.

### Consistency score

Aggregate selected-window P&L by record date. Fewer than3 traded dates =>missing (excluded from overall), not0.

If net profit<=0: clampRound(greenDays/tradedDays*100).
If net profit>0: share=bestDailyPnl/netProfit. share<=.3=>100, else clampRound((1-share)/.7*100).

Best day > net total can produce negative expression then clamp0. This is profit-concentration heuristic resembling a prop consistency rule, not a smooth estimate of long-term consistency. Losing and profitable windows use different definitions; crossing net0 can change meaning.

### Overall

Arithmetic mean of spokes with `counts:true`, rounded once. Equal weight for available spokes. Missing spoke removed from denominator. Zero trades =>overall0. Win/PF counted when any performance trade exists; AvgR only when logged R exists; Consistency only>=3 dates; Discipline only if its eligible journal history exists. Different users may therefore average different numbers of axes. No Bayesian shrinkage or confidence interval found here.

## D-S5: V2 Discipline exact inputs and schedule

Trade-journal qualifying day if record date<=asOf AND either trimmed notes exist OR (not noTradeDay AND any positive/negative emotion, followedPlan defined, or tradeImages nonempty). Note that followedPlan=false still qualifies: score measures logging completion, not whether rules were followed.

Daily qualifying day if preMarket or postMarket object has nonempty string/array OR trimmed notes.
Weekly qualifying week if reflection object has nonempty string/array OR trimmed notes; uses weekStart<=asOf.

Determine earliest date across trades, daily journals, weekly weekStart. Look back at most10 weekdays, excluding weekends; do not go earlier than first history. Today included only if that relevant category already has a qualifying entry today, otherwise begin yesterday. Trade-day denominator and daily denominator computed independently.

Weekly sample: if this week's Monday has weekly reflection, current+previous Monday; otherwise previous two Mondays. Discard weeks earlier than first-history Monday. Thus current unfinished week not penalized in ordinary path.

Discipline=clampRound(80*qualifyingTradeDays/eligibleTradeWeekdays +10*qualifyingDailyDays/eligibleDailyWeekdays +10*completedWeeklyReviews/eligibleWeeks). Zero denominator contributes0. No eligible history =>missing.

80/10/10 are weights within Discipline; overall each of five spokes weight equally if all present. Discipline ignores score window's 30d/all switch and examines recent journal habit, roughly last2 weeks. Short history truncates denominator, so full completion can earn100 without10 full weekdays/2 complete weeks.

## D-S6: Since yesterday

Calls same tM once asOf=today and again asOf=today-1 using same current store content. Delta=today.overall-yesterday.overall when both have trades. This is a recalculation, not necessarily a persisted historic score: editing old entries can change both values. Rolling window and weekday-habit denominators can move score without new profit/loss.


## D-S8: Legacy branch for historical distinction

Legacy all-time score: WinRate score=clampRound(raw win percent); PF=clampRound(PF/3*100), Infinity mapped3; AvgR=clampRound(avgR/.5*100); Consistency=share of active dates that also have pre/post daily journal; Discipline=AI result.discipline.score only with Apex and result, otherwise excluded. Overall equal average. This accounts for old tooltip text in same bundle and possibility of different score shape across feature rollout. It is not evidence that current v2 uses AI.

## D-S9: Performance cards/deltas

Dashboard card text Avg Win RR displays calcStats.avgRR, PF sublabel; Win Rate circle is raw winRate (stroke fraction=winRate/100), W/L and real trade count; Avg Win/Loss displays avgWin and avgLoss currency. Distinguish Avg Win RR (winners only) from Liquid Score AvgR (expectancy over all logged R).

calcStatDeltas compares recent30 days with previous30 or earlier history fallback. Date key L() uses ISO UTC cutoff while some dashboard scope code uses local formatted date, so timezone boundaries deserve explicit tests. WinRate delta requires >=5 decided records both periods; AvgWinRR needs>=3 winning R records and avgRR>0 both; AvgWinLoss compares avgWin (not ratio) with>=3 wins and positive averages. Change displayed is relative percent `(current-previous)/previous*100`, not percentage-point change. No sufficient denominator=>Not enough history yet. This label concerns comparison evidence, not absence of current metric or score.

## Implementation critique for imitation

Keep metrics deterministic and unit-tested; make raw metric vs normalized heuristic explicit; version score formulas and persist input version/window; label Discipline 'journaling habit' in v2 to avoid implying behavioral adherence; show which axes counted. Do not substitute AI narrative for arithmetic. Confidence/sample reliability should be separately designed instead of inferred from 10-trade window fallback. Use canonical timezone/date grouping and allocation-consistent P&L/R definitions.


---

# Dashboard economic calendar — evidence and reconstruction notes

ตรวจ 29 ตุลาคม 2026 Asia/Bangkok. Scope: saved shipped client JS, official Forex Factory calendar/export. No authenticated Liquid APIs invoked, no user preferences changed. Local evidence labels DNEWS1–DNEWS8; not REA tool Evidence IDs.

## DNEWS1 — Data pipeline observed

`3g53kuvt7n6dl.js` imports module 917161 as F; component q invokes `F.loadWeekEvents(force)`. `3ivs_5n81h94u.js` module 917161 exports `loadWeekEvents` as p.

Exact loader structure:

```js
async function p(force=false) {
  let data=null;
  if (!force) try {
    if (localStorage.getItem("tv-econ-calendar-date") === localBrowserDate())
      data=JSON.parse(localStorage.getItem("tv-econ-calendar") ?? "null");
  } catch {}
  if (!Array.isArray(data)) try {
    let response=await fetch("/api/economic-calendar");
    if (!response.ok) return null;
    data=await response.json();
    try {
      localStorage.setItem("tv-econ-calendar",JSON.stringify(data));
      localStorage.setItem("tv-econ-calendar-date",localBrowserDate());
    } catch {}
  } catch { return null; }
  return Array.isArray(data) && data.length>0 ? data : null;
}
```

Reformatted for readability; local variable names expanded. Endpoint is same-origin. Browser does not directly fetch Forex Factory in this loader. This supports server adapter/proxy between Liquid and upstream. Server implementation, vendor contract, rate-limit handling, scrape logic and server cache are unknown.

## DNEWS2 — Why “real time” is not established

Dashboard loads once on component mount through requestAnimationFrame calling `N()`. Its Refresh news button sets spinner, awaits `N(true)`, then clears spinner. Retry on error also uses force. No setInterval, SSE, WebSocket, visibility refresh or release-specific automatic refresh appears in this news component.

Cache lifetime is a **local calendar day**, not a short TTL. If data fetched at 08:00, another normal load that date can reuse it all day. Force bypasses browser cache but does not prove bypass of the server/upstream cache. A page kept open across midnight does not itself have a midnight refresh timer in this component.

Conclusion: call this **weekly economic schedule with cached fetch + manual refresh**, not verified real-time release results. “Live” in helper function name fetchLiveEventsForDate is not measurement of latency or a push transport.

## DNEWS3 — Row schema and UI

Client consumes `{title,country,date,impact,forecast,previous}`. Country field contains currency codes. Row displays browser-local scheduled time, impact flag, currency, title; F forecast and P previous are shown on sm+ breakpoints. **No actual-release field is rendered in this component.** Holiday and Non-Economic render All day. Loading uses three skeleton rows; null loader result causes error/retry view; empty filtered results have separate Nothing scheduled messaging.

An empty upstream array is currently converted to null by loader rather than ready-empty. Whether server can return a legitimate empty week is untested; this is an edge case for implementation.

## DNEWS4 — Filters and state

Default currencies USD/EUR/GBP/JPY; default impacts High/Medium. Supported UI currencies: USD EUR GBP JPY AUD CAD CHF NZD CNY. Impact UI: High Medium Low Holiday. Component recognizes Non-Economic for all-day display even though it is not in listed impact choices.

Reads newsFilters from Zustand profile/app store first, else `tv-econ-filters` localStorage. Editable filter selection is separate from saved filters: changes preview immediately; Save calls setNewsFilters, persists localStorage and updates saved state. Copy says saved filters are also used by daily journal's news suggestions. Day/week selection persisted under `tv-news-view`. Do not test by saving without user approval because it changes preferences.

## DNEWS5 — Dates and timezone

Formatting uses `new Date(row.date).toLocaleTimeString([], {hour:"numeric",minute:"2-digit"})`, so Bangkok browser can show e.g. 19:30 while upstream date carries another offset. Day grouping/filtering uses `row.date.slice(0,10)` rather than a date key derived after conversion. Date header uses `new Date(dateKey+"T12:00:00").toLocaleDateString(...)`.

Potential boundary issue: an event crossing midnight in Bangkok could be grouped under the original source date while clock time is localized. This is a code-level test target, not a confirmed observed bug; actual Liquid server may normalize dates before returning them. Recommendations: store UTC instant + source offset; derive display day and time with the same explicit IANA timezone; handle tentative/all-day as distinct time kinds instead of inventing timestamps.

## DNEWS6 — Forex Factory official export independently verified

Official page https://www.forexfactory.com/calendar has Weekly Export links ICS/CSV/JSON/XML. Followed the official JSON link to:
https://nfs.faireconomy.media/ff_calendar_thisweek.json?version=2843473c47d5853dc9c912b414b7633e

Fetched once into the locally captured evidence; 97 events, union of keys exactly `country,date,forecast,impact,previous,title`. First event date uses ISO offset, e.g. `2026-10-25T15:00:00-04:00`. **No actual field in the inspected export.** Official calendar webpage separately has Actual column and notes times approximate/subject to change.

This proves a supported-looking public export path exists without needing to scrape table HTML. It does **not prove Liquid's backend uses this exact URL**, even though client data shape matches. The cache-busting version parameter belongs to the discovered current link and must not be treated as stable API version.

Primary sources for final citations:
- [Forex Factory calendar and Weekly Export](https://www.forexfactory.com/calendar)
- [Official weekly JSON export](https://nfs.faireconomy.media/ff_calendar_thisweek.json)
- [Liquid shipped loader](https://www.liquidjournal.app/_next/static/immutable/chunks/3ivs_5n81h94u.js)
- [Liquid Dashboard component](https://www.liquidjournal.app/_next/static/immutable/chunks/3g53kuvt7n6dl.js)

Do not assert official refresh interval, SLA, redistribution rights, API license or release latency: none established. Community forum claims about hourly exports/rate limits are not primary official policy evidence and were not used as authority.

## DNEWS7 — Suggested implementation for user's own product (design choice, not recovered server)

1. Server scheduled adapter fetches a permitted provider/export centrally; never every browser hitting upstream. Use shared cache and deduplicated refresh, bounded retries/backoff and schema validation; choose fetch cadence according to provider terms/limits.
2. Normalize to id/title/currency/impact/scheduledAt/timeKind/source/forecast/previous plus actual only if provider supplies it. Derive stable event identity and retain revisions.
3. Store sourceFetchedAt, sourceUpdatedAt when available, servedAt and stale/error state. Return cached successful data on transient failure with an explicit stale marker.
4. Browser fetches own `/api/economic-calendar?week=...` endpoint; filters by currency/impact and converts times consistently. Include Refresh action and last-updated label.
5. If product needs actual economic figures at release time, add a licensed low-latency calendar feed/API with actual/revision events. Weekly export plus a WebSocket to clients cannot make upstream data real-time.
6. Separate scheduled news calendar from news articles: current Liquid widget is economic events, not an article/news scraping pipeline.

## DNEWS8 — Unknowns and verification required

Liquid upstream endpoint/provider, server refresh TTL, cache layer, historical week storage, event ID algorithm, edits/revisions, actual results, API policy/license, latency and failover remain unknown. Browser code alone cannot establish cron, Redis, Supabase storage, HTML scraping, background workers or real-time publication. Runtime evidence not captured for the data response; all Liquid network behavior here is inferred from shipped implementation, not live packet observation.

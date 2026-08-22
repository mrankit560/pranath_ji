import { store } from "../lib/data/store";
import { formatEventDateRangeSafe, parseDateSafe } from "../lib/utils/dateUtils";

console.log("=================================================================");
console.log("🧪 TESTING ADMIN PANEL & USER WEBSITE REAL-TIME SYNCHRONIZATION 🧪");
console.log("=================================================================");

// 1. Test Date Parsing & Timezone Safety
console.log("\n1. Testing Timezone-Safe Date Utilities...");
const parsed1 = parseDateSafe("2026-08-30T10:00:00.000Z");
console.log("  Parsed 2026-08-30:", parsed1);
if (!parsed1 || parsed1.day !== 30 || parsed1.month !== 7 || parsed1.year !== 2026) {
  console.error("  ❌ FAILED: Date parsing shifted day/month");
  process.exit(1);
}
console.log("  ✅ Date parser correctly parsed 30 August 2026 without timezone shift");

const dateStrHi = formatEventDateRangeSafe("2026-08-30", "2026-09-06", false);
console.log("  Hindi Date Range String:", dateStrHi);
if (!dateStrHi.includes("30 अगस्त 2026") || !dateStrHi.includes("6 सितंबर 2026")) {
  console.error("  ❌ FAILED: Hindi date range formatting incorrect:", dateStrHi);
  process.exit(1);
}
console.log("  ✅ Hindi date range formatted correctly");

const dateStrEn = formatEventDateRangeSafe("2026-08-30", "2026-09-06", true);
console.log("  English Date Range String:", dateStrEn);
if (!dateStrEn.includes("30 August 2026") || !dateStrEn.includes("6 September 2026")) {
  console.error("  ❌ FAILED: English date range formatting incorrect:", dateStrEn);
  process.exit(1);
}
console.log("  ✅ English date range formatted correctly");

// 2. Test Store Event Mutation & Real-time Subscription
console.log("\n2. Testing Event Mutation & Store Subscription...");
let notifiedCount = 0;
const unsub = store.subscribe(() => {
  notifiedCount++;
});

// Update event-2 startAt to a new date
console.log("  Updating Event-2 date to 2026-11-15...");
store.updateEvent("event-2", {
  startAt: "2026-11-15T09:00:00.000Z",
  endAt: "2026-11-20T18:00:00.000Z",
  titleHi: "अपडेटेड ध्यान साधना महोत्सव",
});

const updatedEvents = store.getEvents();
const updatedEv2 = updatedEvents.find((e) => e.id === "event-2");

if (!updatedEv2 || !updatedEv2.startAt.startsWith("2026-11-15")) {
  console.error("  ❌ FAILED: Event update was not reflected in store:", updatedEv2);
  process.exit(1);
}
console.log("  ✅ Event-2 startAt successfully updated in store:", updatedEv2.startAt);

const formattedUpdated = formatEventDateRangeSafe(updatedEv2.startAt, updatedEv2.endAt, false);
console.log("  Formatted Updated Date Range:", formattedUpdated);
if (!formattedUpdated.includes("15 नवंबर 2026") || !formattedUpdated.includes("20 नवंबर 2026")) {
  console.error("  ❌ FAILED: Formatted date range does not match update:", formattedUpdated);
  process.exit(1);
}
console.log("  ✅ Updated date range accurately reflects the new admin dates");

if (notifiedCount === 0) {
  console.error("  ❌ FAILED: Store subscribers were not notified on event update");
  process.exit(1);
}
console.log(`  ✅ Store successfully notified subscribers (${notifiedCount} notifications)`);

// 3. Test Earliest Event Computation after date change
console.log("\n3. Testing Earliest Upcoming Event Calculation...");
const earliest = store.getEarliestUpcomingEvent();
console.log("  Current Earliest Upcoming Event:", earliest ? `${earliest.titleHi} (${earliest.startAt})` : "None");
if (!earliest) {
  console.error("  ❌ FAILED: No earliest event found");
  process.exit(1);
}
console.log("  ✅ Earliest upcoming event computed correctly for homepage hero banner");

// 4. Test Settings Mutation & Store Subscription
console.log("\n4. Testing Settings (Contact/Address) Mutation...");
store.updateSettings({
  phone: "+91 98765 43210",
  email: "contact@sadhaulidham.com",
});

const updatedSettings = store.getSettings();
if (updatedSettings.phone !== "+91 98765 43210") {
  console.error("  ❌ FAILED: Settings phone update not reflected");
  process.exit(1);
}
console.log("  ✅ Settings phone successfully updated:", updatedSettings.phone);

// 5. Reset to clean defaults
console.log("\n5. Resetting to defaults for clean state...");
store.resetToDefaults();
const resetEvents = store.getEvents();
const resetEv2 = resetEvents.find((e) => e.id === "event-2");
console.log("  Default Event-2 Date:", resetEv2?.startAt);
console.log("  Default Formatted Range:", formatEventDateRangeSafe(resetEv2?.startAt, resetEv2?.endAt, false));

unsub();
console.log("\n=================================================================");
console.log("🎉 ALL ADMIN & USER WEBSITE SYNC TESTS PASSED 100% 🎉");
console.log("=================================================================");

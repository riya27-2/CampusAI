// Server chalta rehna chahiye (npm run dev, doosre terminal mein).
//
//   node test-ai.js          -> college info upload + saare sawal
//   node test-ai.js ask      -> sirf sawal (upload dobara nahi hoga)

const BASE = "http://localhost:5000/api/ai";

// q     = sawal
// a     = POORA sentence (isi se college info banti hai, isme topic ka naam hona chahiye)
// check = jawab mein inme se koi ek text aaye to PASS (Roman ya Devanagari dono rakh sakte ho)
const qa = [
  { q: "Library kitne baje khulti hai?",
    a: "CampusAI college ka library roz subah 9 baje se shaam 4 baje tak khulta hai.",
    check: ["4"] },
  { q: "Computer department ki faculty kon hai?",
    a: "Computer department ki faculty Mrs. Kalyani Deshpandey hain.",
    check: ["Kalyani", "कल्याणी"] },
  { q: "Principal ka office kahan hai?",
    a: "Principal ka office floor 1 par hai.",
    check: ["floor 1", "1"] },
  { q: "Canteen kitne baje tak khuli rehti hai?",
    a: "College ki canteen subah 8 baje se shaam 8 baje tak khuli rehti hai.",
    check: ["8"] },
  { q: "Hostel mein entry ka aakhri time kya hai?",
    a: "Hostel mein entry ka aakhri time raat 10 baje hai.",
    check: ["10"] },
  { q: "Humare college ka time kya hai?",
    a: "College ka time subah 9:00 AM se dopahar 3:30 PM tak hai.",
    check: ["3:30", "3.30"] },
  { q: "Computer department ke HOD kon hai?",
    a: "Computer department ke HOD Mr. Ajay Baria hain.",
    check: ["Ajay", "अजय"] },
  { q: "Bonafide certificate kaise milega?",
    a: "Bonafide certificate ke liye admin office se contact karein.",
    check: ["admin", "एडमिन", "प्रशासन"] },
  { q: "Degree ki per semester ki fees kya hai?",
    a: "Degree ki per semester ki fees 34,650 rupaye hai (saal 2026-27 ke liye).",
    check: ["34,650", "34650"] },
  { q: "Detain rules in GTU?",
    a: "GTU detain rules: if a student has more than 4 pending backlogs, the student will be detained for one year. Backlogs from the immediate previous semester are not counted.",
    check: ["4"] },
  { q: "Scholarship mein apply kaise karein?",
    a: "Scholarship ke liye apply karne ke liye Digital Gujarat portal par registration karein.",
    check: ["Digital Gujarat", "डिजिटल गुजरात"] },
  { q: "Internal exam mein passing marks kitne hain?",
    a: "Internal exam mein passing marks 30 mein se 12 hain.",
    check: ["12"] },
  { q: "External exam mein passing marks kitne hain?",
    a: "External exam mein passing marks 70 mein se 23 hain.",
    check: ["23"] },
];

// Jinka jawab data mein nahi hai (AI ko andaza nahi lagana chahiye)
const unknown = [
  "Sem wise subject kitne hain?",
  "Meri exam kab start hogi?",
];

// College info in answers se khud banti hai
const collegeInfo = "\n" + qa.map((x) => x.a).join("\n") + "\n";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function ingest() {
  const form = new FormData();
  form.append("file", new Blob([collegeInfo], { type: "text/plain" }), "college-info.txt");
  const res = await fetch(`${BASE}/ingest`, { method: "POST", body: form });
  console.log("1) Ingest:", res.status, await res.json());
}

async function ask(question, attempt = 1) {
  try {
    const res = await fetch(`${BASE}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const data = await res.json();
    return { status: res.status, answer: data.answer ?? JSON.stringify(data) };
  } catch (err) {
    console.log(`Sawal fail hua (koshish ${attempt}):`, err.cause?.code || err.message);
    if (attempt < 2) {
      await sleep(3000);
      return ask(question, attempt + 1);
    }
    return { status: 0, answer: "" };
  }
}

if (process.argv[2] !== "ask") await ingest();

console.log("\n===== Jawab data mein hai =====");
let pass = 0;
for (let i = 0; i < qa.length; i++) {
  const { q, a, check } = qa[i];
  const r = await ask(q);
  const answer = r.answer.toLowerCase();
  // Server error ko PASS na gino
  const isError = r.status !== 200 || answer.includes('"error"');
  const ok = !isError && check.some((c) => answer.includes(c.toLowerCase()));
  if (ok) pass++;
  console.log(`\nQ${i + 1}: ${q}`);
  console.log(`Expected (A${i + 1}): ${a}`);
  console.log(`AI jawab: ${r.answer}`);
  console.log(ok ? "Result: PASS" : "Result: FAIL");
  await sleep(4000); // free models ke rate limit (429) se bachne ke liye
}
console.log(`\nScore: ${pass}/${qa.length}`);

console.log("\n===== Jawab data mein NAHI hai =====");
for (const q of unknown) {
  const r = await ask(q);
  console.log(`\nSawal: ${q}`);
  console.log(`AI jawab: ${r.answer}`);
  await sleep(4000);
}
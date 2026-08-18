import fs from "node:fs";

const path = "/home/ubuntu/fortrex-fx/client/src/pages/Home.tsx";
let source = fs.readFileSync(path, "utf8");
const replacements = [
  ["Genesis clearance", "Private launch list"],
  ["Secure your position.", "Keep your name close."],
  ["Instant verification. Secure clearance. Your place is subject to published Genesis terms.", "Quietly reserve your place before the signal goes public."],
  ["Lock In 1.25x REX Tier", "Join the Genesis List"],
  ["TERMINAL / GENESIS_POOL", "SIGNAL / PRIVATE_LAUNCH"],
  ["Verifying spot in pool", "Reading the launch signal"],
  ["Assigning Genesis Member ID", "Reserving your private access"],
  ["Multiplier locked", "Early access status locked"],
  ["Bring 2 verified traders to upgrade permanently to the 2.00x REX tier, subject to published program terms.", "Your first signal is almost here. Keep your invitation close."],
  ["Enter the Citadel", "Enter Fortrex"],
  ["Genesis registration / 001", "Private launch / 001"],
  ["A private arena for traders who keep score. Enter the first 10,000 Genesis positions and establish your place before the gates close.", "For traders who recognize the feeling of being early. Fortrex is preparing something different—and the first names will know before everyone else."],
  ["No deposits. No trading interface. Just the arena.", "No explanations yet. Just a signal worth following."],
  ["Genesis allocation", "Private launch access"],
  ["filled", "names secured"],
  ["When the 10,000th trader secures their spot, the gates close. No exceptions.", "When the list is complete, this signal goes quiet. No second opening."],
  ["Live pool state", "Launch signal"],
  ["architects", "early names"],
  ["genesis tier", "launch status"],
  ["The truth nobody tells traders", "The feeling you already know"],
  ["You’ve spent years mastering the markets.", "You know what it feels like to notice something before it becomes obvious."],
  ["Reading the noise. Building the discipline.", "To see the first light before the room changes."],
  ["What if your skill finally meant something?", "What if this time, being early meant something?"],
  ["Every trader who came late to something big wished they were first.", "The people who arrive early rarely need to explain why."],
  ["REX / earned-only currency", "A name is already moving"],
  ["Your edge.<br /><span className=\"gold-text\">Compounded.</span>", "Something is<br /><span className=\"gold-text\">taking shape.</span>"],
  ["REX is the core asset of the Fortrex ecosystem. It cannot be purchased. It is earned through skill, performance, and meaningful network contribution under published program terms.", "There is a name for what comes next. You will understand it when the doors open. For now, the signal is enough."],
  ["The early keep score.", "The early ones remember the feeling."],
  ["Architects’ circle", "The first signal"],
  ["Admin-published ranking data appears here. Until the first official rows are entered, shown rows are presentation placeholders only.", "10,000 names will receive the first message. The list will not stay open forever."],
  ["Community / the Citadel", "Stay close to the signal"],
  ["Stay connected<br /><span className=\"gold-text\">to the signal.</span>", "When it moves,<br /><span className=\"gold-text\">you’ll know.</span>"],
  ["The first generation will receive the community coordinates after clearance.", "The first message will arrive where the signal is strongest."],
  ["Citadel", "The Signal Room"],
  ["Market room", "The Broadcast"],
  ["Signal feed", "The Visual Log"],
  ["Field notes", "The Field Notes"],
];
for (const [from, to] of replacements) source = source.split(from).join(to);

const replacementSection = `<section className="border-y border-[#f2d18a]/10 bg-[#08080b]/80"><div className="mx-auto max-w-4xl px-5 py-28 text-center lg:px-8"><SectionKicker>The first signal</SectionKicker><h2 className="display text-5xl font-bold leading-[.98] sm:text-7xl">The early ones<br /><span className="gold-text">feel it first.</span></h2><p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-[#a99b7a]">Fortrex is preparing a new home for traders who have learned to trust their instincts. The details will come later. The feeling starts now.</p><div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-[#f2d18a]/16 bg-white/[.025] p-7 text-left"><div className="flex items-start gap-4"><Diamond className="mt-1 shrink-0 text-[#f2d18a]" /><div><div className="display text-2xl font-bold text-[#fff7e6]">10,000 names. One first message.</div><p className="mt-3 text-sm leading-7 text-[#a99b7a]">The Genesis list is the only way to be there before the rest of the world knows what Fortrex is becoming.</p></div></div></div></div></section>`;
source = source.replace(/<section className="border-y border-\[#f2d18a\]\/10 bg-\[#08080b\]\/80">[\s\S]*?<\/section>/, replacementSection);
fs.writeFileSync(path, source);

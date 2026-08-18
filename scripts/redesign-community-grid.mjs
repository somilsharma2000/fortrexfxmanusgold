import fs from "node:fs";

const path = "client/src/pages/Home.tsx";
const source = fs.readFileSync(path, "utf8");
const start = source.indexOf('<div className="community-launch-note');
const endMarker = "</div>{visibleChannels.length === 0";
const end = source.indexOf(endMarker, start);
if (start === -1 || end === -1) throw new Error("Community launch section markers not found");
const replacement = `<div className="community-launch-note material-card mx-auto mb-8 max-w-xl rounded-xl px-5 py-3 text-center"><div className="community-launch-eyebrow">OFFICIAL CHANNELS LAUNCHING SOON</div><p className="mt-1.5 text-xs leading-5 text-[#a99b7a]">Join the Genesis List to be notified when Fortrex opens its official community channels.</p></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{visibleChannels.map((item) => { const Icon = item.icon; return <div key={item.sub} aria-label={item.sub + ": " + item.handle} className="neon-social-card group relative rounded-2xl p-5 text-left transition"><div className="community-card-header"><div className="community-card-platform-icon" aria-hidden="true"><Icon size={23} /></div><ArrowUpRight size={17} className="community-card-arrow" aria-hidden="true" /></div><div className="community-card-tag"><HighlightedText text={item.sub} query={communityQuery} /></div><div className="community-card-title"><HighlightedText text={item.name} query={communityQuery} /></div><p className="community-card-copy"><HighlightedText text={item.message} query={communityQuery} /></p><div className="community-card-footer"><span className="community-card-status"><span className="community-card-status-dot" aria-hidden="true" /> COMING SOON</span><button type="button" onClick={() => { trackEvent("fortrex_cta_click", { placement: "community_card", label: "Notify Me / " + item.sub }); setModalOpen(true); }} className="community-card-notify">Notify Me <ArrowUpRight size={12} aria-hidden="true" /></button></div></div>; })}</div>`;
const updated = source.slice(0, start) + replacement + source.slice(end + "</div>".length);
fs.writeFileSync(path, updated);
console.log("Redesigned Official Channels banner and card grid");

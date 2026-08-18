import fs from "node:fs";

const path = "client/src/pages/Home.tsx";
let source = fs.readFileSync(path, "utf8");
const start = source.indexOf('<form className="community-card-footer community-notify-form"');
const end = source.indexOf('</form>', start);
if (start === -1 || end === -1) throw new Error("Notify Me social-card form not found");
const replacement = '<div className="community-card-footer"><span className="community-card-status"><span className="community-card-status-dot" aria-hidden="true" /> {item.status}</span><span className="community-card-availability">{item.availability}</span></div>';
source = source.slice(0, start) + replacement + source.slice(end + '</form>'.length);
fs.writeFileSync(path, source);
console.log("Removed Notify Me social-card controls");

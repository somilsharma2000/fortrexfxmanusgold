import { ArrowUpRight, CircleDot, Crown, Droplets, Layers3, Moon, Sparkles, Sun } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

const colors = [
  { name: "Obsidian", value: "#050505", className: "bg-[#050505]" },
  { name: "Graphite", value: "#111114", className: "bg-[#111114]" },
  { name: "Beveled Gold", value: "#D8A64D", className: "bg-[#D8A64D]" },
  { name: "Gold Highlight", value: "#F4D28C", className: "bg-[#F4D28C]" },
  { name: "Steel", value: "#9CA4AD", className: "bg-[#9CA4AD]" },
  { name: "Spectral Blue", value: "#4C9FC1", className: "bg-[#4C9FC1]" },
  { name: "Spectral Violet", value: "#7656A7", className: "bg-[#7656A7]" },
];

const surfaces = [
  { name: "Obsidian Glass", description: "Frosted graphite fill, soft inner highlight, and a beveled gold edge.", className: "glass" },
  { name: "Gold Chrome", description: "Warm metal gradient reserved for primary actions and key states.", className: "token-gold-surface" },
  { name: "Spectral Edge", description: "Subtle blue/violet reflection used as a controlled secondary highlight.", className: "token-spectral-surface" },
];

export default function BrandTokens() {
  const { theme, toggleTheme } = useTheme();
  const [activeDemo, setActiveDemo] = useState("glass");

  return (
    <main className="token-page fortrex-shell min-h-screen overflow-hidden px-5 py-8 text-[#f0eadc] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <header className="token-header glass mb-8 flex flex-col gap-6 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-center gap-4">
            <img onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "https://fortrexfx-lwqfvhpi.manus.space/manus-storage/fortrex-crown-clean_eedb458b.png"; }} src="/manus-storage/fortrex-crown-clean_eedb458b.png" alt="FORTREX crown" className="brand-crown-mark brand-crown-mark-token" />
            <div>
              <div className="display text-xl font-bold tracking-[.18em] text-[#fff7e6]">FORTREX <span className="text-[#d8a64d]">FX</span></div>
              <p className="mt-1 text-xs uppercase tracking-[.18em] text-[#a99b7a]">Crown material language / 001</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3"><button type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} className="theme-toggle secondary-cta inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-xs font-bold uppercase tracking-[.12em]">{theme === "dark" ? <Sun size={14} /> : <Moon size={14} />} {theme === "dark" ? "Light surface" : "Dark surface"}</button><a href="/" className="secondary-cta inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-xs font-bold uppercase tracking-[.12em]">Back to site <ArrowUpRight size={14} /></a></div>
        </header>

        <section className="mb-8 grid gap-6 lg:grid-cols-[1.08fr_.92fr]">
          <div className="token-hero glass rounded-3xl p-7 sm:p-10">
            <div className="mb-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.22em] text-[#f4d28c]"><Crown size={15} /> The Fortrex material system</div>
            <h1 className="display max-w-3xl text-5xl font-bold leading-[.95] sm:text-7xl">Obsidian. <span className="gold-text">Faceted.</span> Rising.</h1>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-[#b9ae96]">Every surface should feel cut from the same crown: black crystal depth, beveled gold architecture, steel reflections, and only enough spectral color to suggest refraction.</p>
            <div className="mt-8 flex flex-wrap gap-3 text-[10px] font-bold uppercase tracking-[.16em] text-[#a99b7a]"><span className="token-chip"><Layers3 size={13} /> Layered depth</span><span className="token-chip"><Droplets size={13} /> Frosted glass</span><span className="token-chip"><Sparkles size={13} /> Controlled glow</span></div>
          </div>
          <div className="token-crown-stage glass flex min-h-[320px] items-center justify-center rounded-3xl p-6">
            <div className="relative flex h-full w-full items-center justify-center"><div className="token-crown-halo" /><img onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "https://fortrexfx-lwqfvhpi.manus.space/manus-storage/fortrex-crown-clean_eedb458b.png"; }} src="/manus-storage/fortrex-crown-clean_eedb458b.png" alt="Faceted translucent Fortrex crown" className="token-crown-image" /></div>
          </div>
        </section>

        <section className="mb-8 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
          <div className="glass rounded-3xl p-6 sm:p-8"><div className="mb-6 flex items-center justify-between"><h2 className="display text-2xl font-bold">Color tokens</h2><span className="text-[10px] uppercase tracking-[.18em] text-[#a99b7a]">01 / Palette</span></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{colors.map((color) => <div key={color.name} className="token-swatch"><div className={`${color.className} h-16 rounded-2xl border border-white/10`} /><div className="mt-3 text-xs font-semibold text-[#f0eadc]">{color.name}</div><div className="mt-1 font-mono text-[10px] uppercase text-[#8f866f]">{color.value}</div></div>)}</div></div>
          <div className="glass rounded-3xl p-6 sm:p-8"><div className="mb-6 flex items-center justify-between"><h2 className="display text-2xl font-bold">Type hierarchy</h2><span className="text-[10px] uppercase tracking-[.18em] text-[#a99b7a]">02 / Voice</span></div><div className="space-y-5"><div><div className="display text-4xl font-bold leading-none text-[#fff7e6]">Display / Rise</div><div className="mt-2 text-[10px] uppercase tracking-[.15em] text-[#8f866f]">Wide geometric / high impact</div></div><div><div className="text-lg font-semibold text-[#f4d28c]">Interface / Clarity</div><div className="mt-2 text-[10px] uppercase tracking-[.15em] text-[#8f866f]">Functional / readable / calm</div></div><div><div className="font-mono text-sm text-[#9ca4ad]">SYSTEM / FIRST_REVEAL / 001</div><div className="mt-2 text-[10px] uppercase tracking-[.15em] text-[#8f866f]">Technical / measured / precise</div></div></div></div>
        </section>

        <section className="mb-8 glass rounded-3xl p-6 sm:p-8"><div className="mb-6 flex items-center justify-between"><h2 className="display text-2xl font-bold">Surface states</h2><span className="text-[10px] uppercase tracking-[.18em] text-[#a99b7a]">03 / Materials</span></div><div className="grid gap-4 md:grid-cols-3">{surfaces.map((surface) => <div key={surface.name} className={`${surface.className} token-surface-card rounded-2xl p-5`}><div className="mb-10 h-10 w-10 rounded-xl border border-[#f4d28c]/35 bg-black/20 shadow-[inset_0_1px_0_rgba(255,244,214,.2)]" /><div className="text-sm font-semibold text-[#fff7e6]">{surface.name}</div><p className="mt-2 text-xs leading-6 text-[#a99b7a]">{surface.description}</p></div>)}</div></section>

        <section className="mb-8 glass rounded-3xl p-6 sm:p-8"><div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="display text-2xl font-bold">Interaction gallery</h2><p className="mt-2 max-w-xl text-xs leading-6 text-[#a99b7a]">Hover or focus each specimen to inspect the crown-derived response. On touch devices, tap a specimen to pin its state.</p></div><span className="text-[10px] uppercase tracking-[.18em] text-[#a99b7a]">04 / States</span></div><div className="grid gap-4 md:grid-cols-3">{[{ id: "glass", label: "Frosted glass", detail: "Lift + reflective sweep", icon: <Layers3 size={18} /> }, { id: "gold", label: "Gold chrome", detail: "Warm edge + press depth", icon: <Crown size={18} /> }, { id: "spectral", label: "Spectral edge", detail: "Steel tint + restrained glow", icon: <Sparkles size={18} /> }].map((demo) => <button type="button" key={demo.id} onClick={() => setActiveDemo(demo.id)} className={`token-gallery-card token-gallery-${demo.id} ${activeDemo === demo.id ? "is-active" : ""} rounded-2xl p-5 text-left`} aria-pressed={activeDemo === demo.id}><div className="mb-12 flex items-center justify-between"><span className="token-gallery-icon">{demo.icon}</span><span className="font-mono text-[10px] uppercase tracking-[.16em] text-[#8f866f]">{activeDemo === demo.id ? "Active" : "Hover"}</span></div><div className="text-sm font-semibold text-[#fff7e6]">{demo.label}</div><p className="mt-2 text-xs text-[#a99b7a]">{demo.detail}</p></button>)}</div></section>

        <footer className="flex flex-col gap-3 border-t border-[#d8a64d]/15 py-6 text-[10px] uppercase tracking-[.16em] text-[#8f866f] sm:flex-row sm:items-center sm:justify-between"><span><CircleDot size={12} className="mr-2 inline text-[#f4d28c]" /> Fortrex visual reference</span><span>Black crystal / beveled gold / controlled refraction</span></footer>
      </div>
    </main>
  );
}

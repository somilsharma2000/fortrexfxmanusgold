# FORTREX FX
## Base44 Website + Instagram Visual Specification

**Version:** 1.0  
**Brand direction:** Dark luxury, stealth launch, futuristic fintech, institutional confidence  
**Primary phrase:** *Where traders rise.*

> Fortrex should feel like a sealed architectural program that is about to open: precise, restrained, premium, and emotionally charged. It must create curiosity without revealing platform mechanics too early.

## 1. Brand Foundation

Fortrex is positioned as a high-trust, skill-led trading community for people who value timing, preparation, and being early. The visual system combines obsidian surfaces, beveled gold identity, translucent glass, restrained cyan/emerald reflections, and cinematic negative space.

The public website should communicate **anticipation, status, clarity, and controlled access**. It should not feel like a loud crypto landing page, an aggressive sales funnel, or an arcade interface.

Avoid the words **signals**, **deposits**, and **private** in public-facing launch copy. Avoid operational explanations, exaggerated promises, guaranteed outcomes, fake testimonials, fabricated reviews, or decorative buttons that do not perform a real action.

## 2. Core Visual Keywords

Use these keywords consistently when briefing designers, Base44, image tools, or social-media creators:

`obsidian black`, `dark luxury`, `beveled gold`, `translucent crown`, `liquid glass`, `frosted glass`, `institutional fintech`, `cinematic negative space`, `subtle cyan reflection`, `emerald edge light`, `precision typography`, `architectural interface`, `stealth launch`, `high contrast`, `controlled glow`, `premium restraint`.

Avoid these visual directions:

`rainbow cyberpunk`, `cartoon crypto`, `casino`, `neon overload`, `generic dashboard`, `fake trading profit`, `plastic 3D`, `cheap gold gradient`, `busy particle storm`, `unreadable glass text`, `overlapping cards`.

## 3. Color System

Use the 60–30–10 rule. Approximately 60% of the interface is dark canvas, 30% is structural glass and graphite, and 10% is gold or state color.

| Token | Hex / value | Usage |
|---|---:|---|
| Obsidian 950 | `#050509` | Main canvas and hero background |
| Obsidian 900 | `#08080B` | Section backgrounds |
| Ink 800 | `#101014` | Dense surfaces and modal interiors |
| Graphite 700 | `#17171B` | Cards, panels, and controls |
| Smoke Glass | `rgba(255,255,255,.045)` | Standard frosted fill |
| Deep Gold | `#80652C` | Low-intensity gradients and progress starts |
| Fortrex Gold | `#C9973E` | Main brand accent and active controls |
| Champagne Gold | `#F2D18A` | Highlights, headings, and focus states |
| Ivory | `#FFF7E6` | Primary heading and button text |
| Warm Muted | `#A99B7A` | Body copy and secondary labels |
| Muted Slate | `#766C57` | Tertiary metadata |
| Steel Reflection | `#AAB4BD` | Controlled material reflection |
| Signal Cyan | `#54D7D0` | Small spectral reflection only |
| Emerald Edge | `#7DE3B3` | Success state and subtle glass edge light |
| Error Red | `#FF7D82` | Validation only |

### Recommended gradients

```css
--fortrex-gold-gradient: linear-gradient(135deg, #F2D18A 0%, #C9973E 52%, #80652C 100%);
--fortrex-obsidian-gradient: linear-gradient(180deg, #101014 0%, #050509 100%);
--fortrex-glass-gradient: linear-gradient(145deg, rgba(255,255,255,.08), rgba(255,255,255,.025));
--fortrex-spectral-gradient: linear-gradient(115deg, rgba(84,215,208,.18), rgba(125,227,179,.08), rgba(242,209,138,.16));
```

## 4. Typography

Use **Space Grotesk** or **Sora** for display headlines and **Inter** for body/interface text. If Base44 limits font loading, use `Arial`, `Helvetica Neue`, or another clean geometric sans-serif fallback.

| Level | Font | Weight | Size guidance | Treatment |
|---|---|---:|---:|---|
| Hero display | Space Grotesk | 700 | 64–112px desktop; 48–64px mobile | Uppercase, tight line height, champagne gradient |
| Section heading | Space Grotesk | 700 | 48–72px | One strong phrase, centered or deliberately aligned |
| Card title | Space Grotesk | 650 | 24–32px | White/ivory with restrained glow |
| Body | Inter | 400 | 15–18px | Muted warm beige, line-height 1.7–1.9 |
| Label | Inter / monospace | 700 | 9–12px | Uppercase, tracking .16–.24em |
| Metadata | JetBrains Mono / monospace | 500 | 10–12px | Technical, muted gold or slate |
| CTA | Inter | 700 | 11–14px | Uppercase, tracking .1–.16em |

Typography rules: never use more than two font families in one composition. Keep display lines short. Do not center-align paragraphs wider than approximately 640px. Maintain high contrast over glass surfaces.

## 5. Spacing, Radius, and Depth

Use an 8px spacing grid. Common values are `8, 16, 24, 32, 40, 48, 64, 80, 112px`.

| Element | Rule |
|---|---|
| Main content width | 1120–1280px maximum |
| Mobile page padding | 20–24px |
| Desktop page padding | 32–48px |
| Standard card padding | 24–32px |
| Modal padding | 24px mobile; 32–40px desktop |
| Small radius | 10–12px |
| Card radius | 18–24px |
| Pill radius | 999px |
| Standard glass blur | 16–24px |
| Large shadow | `0 24px 64px rgba(0,0,0,.35)` |

Cards should have one dominant edge, one controlled highlight, and one restrained glow. Do not stack more than two translucent layers without clear separation.

## 6. Glassmorphism Recipe

```css
.fortrex-glass {
  background: rgba(18, 18, 22, .68);
  backdrop-filter: blur(20px) saturate(120%);
  -webkit-backdrop-filter: blur(20px) saturate(120%);
  border: 1px solid rgba(255, 255, 255, .12);
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, .14),
    0 20px 48px rgba(0, 0, 0, .45);
}
```

For the top of important cards, add a soft radial light rather than a hard white gradient:

```css
background-image: radial-gradient(circle at 50% 0%, rgba(242,209,138,.14), transparent 55%);
```

Glass is a surface treatment, not a replacement for contrast. Text must remain readable without relying on blur.

## 7. Website Information Architecture for Base44

### Navigation

Use a compact header with the translucent Fortrex crown and wordmark on the left. Use one primary action on the right: **Join the Genesis List** before registration and **Join Community** after registration. On mobile, use a sticky bottom bar with Register and Community actions; after registration, the second action becomes Profile.

Do not add a large multi-link navigation menu to the public launch page. The landing page should feel focused and intentional.

### Hero

The hero is centered and spacious. Recommended order:

1. Small kicker: `LAUNCH / 001`.
2. Main headline: `WHERE / TRADERS / RISE.`.
3. One short curiosity paragraph.
4. Primary CTA: `JOIN THE GENESIS LIST`.
5. Supporting line: `No explanations yet. Just something worth following.`
6. Live Genesis counter with progress bar and last-update tooltip.
7. Gate notice: `When the list is complete, this list closes. No second opening.`

The hero must remain visually strong even if the crown or any secondary card is removed. Never let an optional visual block create an empty or asymmetrical gap.

### Narrative sections

Use three to five short sections below the hero. Each section should have a single emotional objective:

| Section | Objective | Example direction |
|---|---|---|
| Recognition | Make the visitor feel understood | “You know what it feels like to notice something before it becomes obvious.” |
| Anticipation | Create tension | “Something is taking shape.” |
| First reveal | Establish scarcity | “10,000 names. One first message.” |
| Community | Provide a credible next step | “The first message will arrive where Fortrex feels closest.” |
| Footer | Close with confidence | “Where traders rise.” |

### Registration modal

The modal should have three states: entry, verification, and success. Entry requires full name, Indian mobile number, and email. Show inline validation beside the relevant field. Verification uses a short terminal-like sequence. Success uses a centered animated checkmark, a personalized welcome line, encrypted-transmission confirmation, countdown, and real actions such as copy invite, share status, and close/explore.

The modal should be keyboard accessible, closable with Escape, focus-trapped, and internally scrollable on mobile. The backdrop should be dark and softly blurred without blocking the modal content.

### Community

Use four glass cards for Discord, YouTube, Instagram, and Threads only when the destinations are approved. Until then, label them honestly as launching soon and use functional update capture. Never invent official handles or URLs.

### Admin

Keep admin pages separate from the public cinematic experience. Use a practical dashboard with clear labels, tables, status badges, CSV import, role-gated actions, and audit-friendly controls. The public design language may carry through in colors, but admin usability takes priority over spectacle.

## 8. Base44 Build Prompt

Paste the following as the high-level Base44 build brief:

> Build a responsive public pre-launch website for FORTREX FX using a dark luxury fintech visual system. Use an obsidian black background, warm beveled gold accents, translucent frosted glass panels, a centered layout, and a restrained cyan/emerald spectral reflection. The site should feel like a stealth launch for skilled traders: premium, curious, institutional, and emotionally precise. Use Space Grotesk for large uppercase headings and Inter for body text. Create a compact header, centered hero, live Genesis List counter, registration modal with name/mobile/email validation, verification state, personalized success state, community launch-soon section, and footer. Use real interactive controls only. Do not fabricate reviews, testimonials, handles, URLs, or platform data. Do not use the words signals, deposits, or private in public copy. Preserve reduced-motion support, keyboard accessibility, responsive mobile behavior, and clean spacing. Keep all important content centered and never allow cards or decorative imagery to overflow horizontally.

## 9. Motion System

Motion should be slow enough to feel cinematic but fast enough to remain usable.

| Interaction | Duration | Motion |
|---|---:|---|
| Button hover | 180–220ms | Lift 2px, glow, reflective sweep |
| Card hover | 220–300ms | Slight lift and edge highlight |
| Modal entrance | 320–500ms | Opacity + translateY + scale from .98 to 1 |
| Success reveal | 500–700ms | Staged rise, checkmark pop, glow pulse |
| Counter roll | 900–1200ms | Ease-out from 0 to current value |
| Toast | 220–320ms | Slide up 8–12px with opacity |
| Crown reveal | 700–1200ms | Fade and slight scale, never bounce |

Respect `prefers-reduced-motion: reduce`. In reduced-motion mode, replace motion with instant state changes and preserve contrast.

## 10. Instagram System

### Format matrix

| Format | Size | Use |
|---|---:|---|
| Feed portrait | 1080 × 1350 | Primary announcement and quote posts |
| Square | 1080 × 1080 | Logo, countdown, quote, status cards |
| Story | 1080 × 1920 | Registration CTA, polls, countdowns |
| Reel cover | 1080 × 1920 | Cinematic motion thumbnail |
| Carousel | 1080 × 1350 each | Narrative and educational sequences |

Keep critical text inside a 90px safe margin on feed posts and a 180px top/bottom safe area on Stories.

### Instagram composition rules

Use one focal object per frame: crown, wordmark, light beam, glass form, or typographic statement. Place it against large obsidian negative space. Add one gold accent and no more than one secondary cyan/emerald reflection. Keep text to a maximum of two hierarchy levels per frame.

Recommended layout: 70% dark negative space, 20% focal glass or crown form, 10% text and gold accent. Use asymmetry only when the text remains visually centered in its own plate.

### Feed template A: Quote / emotional hook

- Background: `#050509` with a subtle radial gold haze.
- Small label: `FORTREX / FIELD NOTE 001`.
- Main text: `The people who arrive early rarely need to explain why.`
- Footer: `Where traders rise.` plus small crown watermark.
- Typography: 64–86px Space Grotesk, champagne gradient.

### Feed template B: Launch status

- Header: `LAUNCH / 001`.
- Main line: `THE FIRST MESSAGE IS CLOSE.`
- Secondary line: `Join the Genesis List.`
- Visual: centered crown or abstract glass aperture.
- CTA treatment: gold pill at the bottom, never a fake button if the graphic is not interactive.

### Feed template C: Genesis counter

- Label: `GENESIS LIST`.
- Large number: `1,844 / 10,000` or the current verified count.
- Progress bar: dark graphite track with gold fill.
- Supporting copy: `When the list is complete, this list closes. No second opening.`
- Use only live or verified data. If the number is illustrative, label it as a concept mockup outside the public-facing post.

### Feed template D: Crown material study

- Full black background.
- Centered translucent crown with beveled gold edge and subtle cyan reflection.
- Tiny metadata: `MATERIAL STUDY / FORTREX FX`.
- No paragraphs. Let the object carry the frame.

### Feed template E: Carousel narrative

| Slide | Copy direction |
|---:|---|
| 1 | “You notice it before it becomes obvious.” |
| 2 | “You feel the room change before the room changes.” |
| 3 | “Being early is not noise. It is timing.” |
| 4 | “Fortrex is preparing something different.” |
| 5 | “Join the first 10,000 names.” |

## 11. Image-Generation Prompts

### Crown hero prompt

> Premium translucent 3D crown for FORTREX FX, inspired by a beveled architectural crest, centered upright, clean transparent edges, dark obsidian studio background, warm champagne-gold bevels, subtle cyan and emerald spectral reflections, soft radial light behind the crown, physically accurate glass and chrome, controlled caustics, cinematic rim light, high contrast, no text, no extra objects, no rectangular backdrop, no hard bounding box, luxury fintech identity, portrait composition.

### Instagram quote background prompt

> Dark luxury obsidian background for a premium fintech brand, almost-black canvas, extremely subtle grain, soft champagne-gold radial haze centered behind the future headline area, faint glass refraction at the edges, large clean negative space, restrained cyan reflection, no text, no logo, no people, no coins, no charts, no neon overload, 4:5 portrait composition.

### Glass portal prompt

> Abstract dark glass aperture for FORTREX FX, architectural circular opening made of translucent smoked glass and brushed black metal, beveled champagne-gold rim, subtle emerald and cyan edge reflections, black background, controlled bloom, premium institutional fintech mood, minimal composition, no text, no symbols, no extra panels, 4:5 portrait.

### Reel motion prompt

> Slow cinematic reveal of a translucent beveled crown emerging from deep obsidian darkness, champagne-gold edge light gradually turning on, subtle cyan spectral reflection passing across the surface, tiny restrained dust particles, no camera shake, no aggressive zoom, premium institutional fintech, 9:16 vertical, no text.

## 12. Copy System

### Approved tone

Use short, confident, emotionally intelligent sentences. Favor words such as **early, first, rise, reveal, clarity, circle, signal-free anticipation, close, ready, names, position, architects, and timing**. Keep claims precise and avoid promising outcomes.

### Approved CTA examples

| Context | CTA |
|---|---|
| Header | Join the Genesis List |
| Hero | Join the Genesis List |
| Returning user | Join Community |
| Community placeholder | Join for updates |
| Modal submit | Secure my place |
| Footer | Stay close |

### Avoid

Avoid hype such as “guaranteed returns,” “risk-free,” “instant wealth,” “secret signals,” “exclusive private profits,” or any language implying a guaranteed financial outcome. Never use fabricated social proof or fake user testimonials.

## 13. Accessibility and Quality Checklist

Before publishing a Base44 page or Instagram asset, confirm that all important text passes contrast checks, every button performs a real action, keyboard focus is visible, modal focus is trapped, touch targets are at least 44px, text does not clip at 320–390px widths, no card extends beyond the viewport, reduced-motion mode removes nonessential animation, and image assets have descriptive alt text on the website.

For social posts, confirm that the text is readable without zooming, the logo is not clipped, the headline has safe margins, the design does not imply an unverified metric, and the caption does not make unsupported performance claims.

## 14. Final Base44 Acceptance Criteria

The Base44 build is ready when the hero is centered, the dark-gold visual language is consistent, the registration flow works end to end, Indian mobile validation is enforced, the live counter uses a verified source, the mobile bottom navigation is usable, the community state is honest, no public copy contains blocked terminology, no decorative control is fake, and the website remains visually clean at 375px, 768px, and 1440px widths.

The Instagram system is ready when every post can be recognized as Fortrex without reading the caption, the crown and gold material are consistent, the visual hierarchy is simple, the copy is curiosity-led rather than deceptive, and every metric or claim is verified before publication.

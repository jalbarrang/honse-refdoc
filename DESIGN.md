---
name: Uma musume - Reference Document
description: A race-ledger reference site - dense, ruled, numerate, built for sub-minute lookup.
colors:
  paper-white: "oklch(0.985 0.004 140)"
  panel: "oklch(0.955 0.008 140)"
  ink: "oklch(0.24 0.02 150)"
  ink-muted: "oklch(0.45 0.025 145)"
  turf-green: "oklch(0.47 0.12 135)"
  turf-green-deep: "oklch(0.39 0.11 135)"
  turf-green-strong: "oklch(0.47 0.12 135)"
  turf-green-strong-hover: "oklch(0.39 0.11 135)"
  on-accent: "#ffffff"
  turf-green-tint: "oklch(0.94 0.045 135)"
  rule-line: "oklch(0.87 0.018 140)"
  danger: "oklch(0.52 0.16 25)"
typography:
  display:
    fontFamily: "Figtree Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.15rem"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Figtree Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.85rem"
    fontWeight: 780
    lineHeight: 1.1
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Figtree Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.4rem"
    fontWeight: 750
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Figtree Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Figtree Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.76rem"
    fontWeight: 700
    lineHeight: 1.3
rounded:
  sm: "0.3rem"
  md: "0.5rem"
  lg: "0.6rem"
  xl: "0.75rem"
spacing:
  row: "0.7rem"
  gutter: "1rem"
  section: "2.5rem"
components:
  button-primary:
    backgroundColor: "{colors.turf-green-strong}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.md}"
    padding: "0.55rem 0.95rem"
  button-primary-hover:
    backgroundColor: "{colors.turf-green-strong-hover}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.sm}"
    padding: "0.32rem 0.65rem"
  input:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0.6rem 0.7rem"
  nav-link-current:
    backgroundColor: "{colors.turf-green-strong}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.sm}"
    padding: "0.45rem 0.55rem"
---

# Design System: Uma musume - Reference Document

## 1. Overview

**Creative North Star: "The Race Ledger"**

The system reads like a bookmaker's ledger: clean columns, ruled hairlines, tabular numerals, and one working color of ink. It exists for a single reader with a training run open on the other screen and a question that needs answering in under a minute, so every visual decision favors scanning over atmosphere. Structure comes from lines and alignment, never from boxes stacked in boxes.

The palette is shared with the hachimi-redux overlay's `honse_ui` tokens (`crates/honse-ui/src/theme.rs`), so the in-game tooling and this reference site read as one family: the dark scheme carries the slate surfaces verbatim with the token set's green accent family (`good`, `uma_400`, `uma_300`), echoing the game's own green UI, and the light scheme derives the same turf-green hue at inverted lightness.

It explicitly rejects the three failure modes named in PRODUCT.md: Fandom/wiki clutter (competing sidebars, boxes everywhere), the interchangeable Docusaurus/GitBook docs-chrome look, and the gamer aesthetic of dark neon and HUD frames. It stays distinct from generic docs sites through discipline, not decoration: denser rows, ledger restraint, and a single committed green.

**Key Characteristics:**

- One typeface (Figtree Variable) at every level; hierarchy comes from weight and size, not font pairing.
- One accent (Turf Green) doing all interactive work: links, primary actions, current selection.
- Ruled 1px hairlines and baseline-aligned grids instead of cards.
- Tabular numerals wherever a number appears.
- Flat at rest; shadows exist only under floating layers.

## 2. Colors

A green-cast neutral field with a single committed turf-green accent inherited from `honse_ui` (and from the game's own UI); warmth is nowhere in the chrome, it belongs to the content.

### Primary

- **Turf Green** (oklch(0.47 0.12 135) light / #6fd06f dark, the `honse_ui` `uma_400`): the one working ink, matching the game's green UI. Links, the primary CTA, the current nav item, focus rings, selection highlights, result counts. If it is interactive or currently selected, it is Turf Green; if it is neither, it is not.
- **Deep Turf Green** (oklch(0.39 0.11 135)): hover/active shift of the same ink. Never appears at rest.
- **Turf Green Tint** (oklch(0.94 0.045 135)): hover wash on rows, table-of-contents hovers, and callout backgrounds. The only tinted surface in the system.

### Neutral

- **Paper White** (oklch(0.985 0.004 140)): the body surface and input fields. Near-white with a barely-cool cast; never warm.
- **Panel** (oklch(0.955 0.008 140)): the second neutral layer - sidebar rail wash, table headers, table-of-contents, attribution blocks, footer.
- **Ink** (oklch(0.24 0.02 150)): all headings and body text. Comfortably above 12:1 against Paper White.
- **Muted Ink** (oklch(0.45 0.025 145)): descriptions, metadata, secondary labels. Holds above 5.5:1 on Paper White; comfortably AA.
- **Rule Line** (oklch(0.87 0.018 140)): every hairline - row separators, section rules, table borders, control borders.

### Tertiary

- **Danger** (oklch(0.52 0.16 25) light / #ff7a6b dark): search errors and failure text only, mapped from the `honse_ui` `bad` token.

### Dark Scheme

The ledger flips automatically with the OS (`prefers-color-scheme: dark`); there is no toggle. Dark mode is the `honse_ui` token set verbatim: bg #0b0e13, panel #151a23 (surface_1), hover/callout tint #242c3d (surface_3), rule line #2c3648, ink #eaeff6 (fg), muted ink #a3b1c4 (fg_muted), accent #6fd06f (uma_400), accent hover #8fe08f (uma_300), danger #ff7a6b (bad). Solid fills use #4fbb4f (good) with near-black #0b0e13 labels, while light mode uses deep-green fills with white labels; the `on-accent` token carries the label color per scheme.

### Named Rules

**The One Green Rule.** Turf Green is used for interaction and current state, never for decoration. A screen where the accent exceeds roughly 10% of the surface is misusing it.

**The No-Warmth Rule.** The chrome never tints warm. Cream, sand, and parchment neutrals are prohibited; game screenshots supply all the warmth this site needs.

**The Two-Role Accent Rule.** Text accent and fill accent are separate tokens. New interactive text uses `--color-accent`; new solid fills use `--color-accent-strong` with `--color-on-accent` labels (white in light mode, near-black in dark mode). Never hard-code a label color on an accent fill.

**The Shared-Source Rule.** Color changes start in hachimi-redux's `honse_ui` tokens and propagate here, not the other way around. Dark values stay verbatim; light values stay in the same hue family.

## 3. Typography

**Display Font:** Figtree Variable (with ui-sans-serif, system-ui fallback)
**Body Font:** Figtree Variable (same family throughout)

**Character:** One humanist-geometric sans carries everything. Hierarchy is built entirely from weight (400 to 800) and a tight 1.2-ratio scale, which keeps the ledger feeling like one continuous document rather than a themed site.

### Hierarchy

- **Display** (800, 2.15rem, 1.1, -0.02em): home hero heading only.
- **Headline** (780, 1.75-1.85rem, 1.1): page titles on hubs, articles, and the 404.
- **Title** (750, 1.4rem, 1.2): article h2, with a hairline rule above the content that follows; h3 steps down to 1.15rem.
- **Body** (400, 0.95rem, 1.65): article prose, capped at a 44rem measure (~70ch).
- **Label** (650-750, 0.72-0.8rem): kickers, rail labels, form labels, counts, dates. Sentence case; no uppercase tracking.

### Named Rules

**The Tabular Rule.** Any element that can contain a number (tables, dates, counts, the 404 code) sets `font-variant-numeric: tabular-nums`. Numbers align or they are wrong.

**The No-Eyebrow Rule.** No uppercase tracked kickers above sections. Section identity comes from the heading itself.

## 4. Elevation

Flat by default. Depth in the document plane is conveyed by tonal layering (Paper White vs Panel) and hairlines, never by shadows. Shadows exist solely to separate floating layers from the page.

### Shadow Vocabulary

- **Dropdown** (`box-shadow: 0 10px 28px oklch(0.25 0.02 262 / 0.22)`): the mobile nav popover.
- **Modal** (`box-shadow: 0 18px 48px oklch(0.25 0.02 262 / 0.28)`): the search dialog, which carries no border in light mode; the shadow alone lifts it.

### Named Rules

**The Two Shadows Rule.** Only the two floating layers above may cast shadows. Anything in the document flow (cards, tables, images, callouts) is flat with a 1px Rule Line border at most. Never pair a border with a soft wide shadow on the same element. Exception: in the dark scheme, shadows read poorly, so the two floating layers gain a 1px Rule Line hairline as well.

## 5. Components

Quiet and precise: controls recede until needed, then respond with a border-color or background shift in 120-150ms.

### Buttons

- **Shape:** gently rounded (0.5rem); small ghost controls at 0.4rem.
- **Primary:** Strong Turf Green background with on-accent text, 0.55rem x 0.95rem padding, weight 650. One per screen at most (the hero CTA).
- **Hover / Focus:** background shifts to the strong-hover step; focus uses a 2px accent outline offset 2px.
- **Ghost (Close, secondary actions):** transparent with a Rule Line border and Muted Ink text; hover shifts border to the accent and text to Ink.

### Search Trigger

The signature header control: a Panel-filled, Rule Line-bordered button (0.5rem radius) with a magnifier icon, "Search field guide" label, and a `/` keycap. Hover shifts only the border to the accent.

### Cards / Containers

- **Corner Style:** 0.6rem for panels (table of contents, attribution), 0.75rem for the dialog. Nothing exceeds 0.75rem.
- **Background:** Panel; content itself never sits in cards.
- **Shadow Strategy:** none (see The Two Shadows Rule).
- **Border:** none on Panel blocks; 1px Rule Line on images and tables.
- **Internal Padding:** about 1rem.

### Inputs / Fields

- **Style:** 1px Rule Line stroke on Paper White, 0.5rem radius, 0.6rem x 0.7rem padding.
- **Focus:** border and 2px outline both go accent, outline offset 0.
- **Error:** message text in Danger; the field itself stays neutral.

### Navigation

- **Rail (desktop):** a Panel-washed left column of 0.84rem links in Muted Ink; hover washes the row in Turf Green Tint, the current page fills solid Strong Turf Green with on-accent text (0.4rem radius). No numbering, no side-stripe markers.
- **Breadcrumbs:** 0.78rem accent links separated by muted chevrons; they alone state the article's location.
- **Mobile:** the rail collapses into a bordered summary popover using the Dropdown shadow.
- **Header wordmark:** plain text, no icon badge. "Uma musume - Reference Document" at weight 750, clamped 0.85-1rem so it wraps to two balanced lines on narrow viewports.

### Ledger Rows (signature component)

Hub indexes and the home domain list share one row grammar: title (700) and a one-line clamped description (Muted Ink) on the left, a tabular count or date on the right, a 1px Rule Line below, and a full-row Turf Green Tint wash on hover. Rows are links; the whole surface is the target.

### Sticky Footer

The attribution footer (`position: sticky; bottom: 0`) stays pinned to the viewport bottom so the CC BY-NC credit to Erzzy and Kireina is always visible. It is Panel-filled with a Rule Line top border and compact 0.7rem padding.

## 6. Do's and Don'ts

### Do:

- **Do** route every interactive treatment through Turf Green: links, hovers, focus, current state. One ink, used consistently.
- **Do** keep body text at 0.95rem/1.65 within a 44rem measure, and set tabular-nums on anything numeric.
- **Do** build structure from 1px Rule Line hairlines and alignment; a new section gets a rule and space, not a box.
- **Do** keep motion at 120-150ms ease on background/border/color only, with the reduced-motion query zeroing all of it.
- **Do** keep the CC BY-NC attribution to Erzzy and Kireina visible on every article (the Panel attribution block) and in the sticky footer.

### Don't:

- **Don't** recreate "Fandom/wiki clutter": no ads-shaped layouts, no boxes everywhere, no dense competing sidebars. One rail, one content column, one optional TOC.
- **Don't** drift into "generic docs-site chrome (the interchangeable Docusaurus/GitBook look)": no card grids of doc links, no icon-heavy feature tiles, no floating theme switcher chrome.
- **Don't** touch the "gamer aesthetic: dark neon, HUD frames, anime gradients". No glows, no gradient text, no angular frame decorations.
- **Don't** use warm neutrals (cream/sand/parchment) anywhere in the chrome; the palette is cool or it is wrong.
- **Don't** put a colored side-stripe (`border-left` > 1px) on callouts or list items; callouts are Turf Green Tint washes with no stripe.
- **Don't** exceed 0.75rem radius on any surface, and never pair a border with a wide soft shadow on the same element.
- **Don't** fork the palette from hachimi-redux; `honse_ui` is the source of truth for hue decisions.

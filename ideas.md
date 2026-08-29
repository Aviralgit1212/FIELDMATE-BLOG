# Visual Resolution — Design Exploration

## Three Possible Directions

### Theme Name: Signal Atlas
**Very Brief Intro:** An editorial engineering journal framed by a drifting field of machine signals. It makes a long technical story feel like a collected, trustworthy transmission rather than a product landing page.

**Probability:** 0.07

### Theme Name: Night Service Manual
**Very Brief Intro:** A dark industrial documentation artifact inspired by printed maintenance binders, annotated schematics, and workshop displays. The typography carries the atmosphere; visual effects remain deliberately restrained.

**Probability:** 0.03

### Theme Name: Deep Field Console
**Very Brief Intro:** A quiet, data-dense reading environment that treats the article as a live diagnostic signal moving through a hidden system. Fine cyan lines and connection points add depth without competing with prose.

**Probability:** 0.09

## Chosen Approach: Deep Field Console

### Design Movement
**Contemporary technical editorialism**, combining the dimensional restraint of a scientific field notebook with the visual vocabulary of mission-control instrumentation.

### Core Principles
1. **Reading comes first:** text always sits on stable, high-contrast graphite surfaces rather than directly on the animated scene.
2. **Signal, not spectacle:** cyan is used like an illuminated status indicator: for anchors, rule lines, section identifiers, and the architecture terminal border.
3. **Asymmetric flow:** the desktop layout has a quiet technical rail on the left and a deeply legible article column offset to the right.
4. **Evidence of structure:** fine rules, index numbers, and terminal-like components make the architecture feel engineered without mimicking a dashboard.

### Color Philosophy
The base is a layered **graphite-to-midnight navy**, chosen to feel precise and calm rather than theatrical. **Signal cyan (#68e4e8)** appears only in moments of navigation and emphasis, acting as an ownable diagnostic indicator. Muted blue-grey keeps long paragraphs low-fatigue, while off-white is reserved for headings and key interface text.

### Layout Paradigm
The page works as a **technical reading spine**: a desktop left rail holds the document wordmark, live scroll position, and section navigation; a narrower article column begins later across the canvas. The hero is a tall signal cover rather than a centered marketing block. On mobile the rail collapses into a slim top bar and the article becomes a single uninterrupted reading column.

### Signature Elements
1. **Signal rails:** vertical cyan rule fragments and tiny index labels that recur at sectional thresholds.
2. **Terminal architecture box:** a high-contrast monospace enclosure for the supplied ASCII system diagram.
3. **Background node field:** a low-opacity, canvas-like Three.js network whose geometry shifts gently with scrolling.

### Interaction Philosophy
Interaction is utilitarian and calm. Navigation links scroll precisely to a section and update the reading position. Hover behavior uses only a short color and rule-length transition, while the background responds slowly enough to be felt rather than noticed.

### Animation
The background network uses tiny nodes and rare nearby-line connections. Camera depth and node drift react to scroll progress, with a brief 180ms transition for the navigation indicator. All non-essential animation pauses under `prefers-reduced-motion`; the background stays as a static, dim field in that mode. On small screens the scene uses fewer nodes and shorter connection distance.

### Typography System
**Space Mono** is the technical display face for headings, metadata, section labels, navigation, and the diagram. **DM Sans** is the reading face for prose at a generous 1.78 line height. Headings are all-caps only for small labels; primary section headings use normal casing for readable editorial rhythm.

### Brand Essence
**Visual Resolution is a technical field note about how FieldMate connects voice, vision, and memory into a diagnostic partner for moments when expertise is not nearby.**

**Personality adjectives:** measured, lucid, field-ready.

### Brand Voice
Headlines read like the titles of internal engineering essays; CTAs and microcopy read like concise interface status messages.

Example lines: “Trace the path of a single diagnostic turn.” and “Scroll to follow the signal.”

### Wordmark & Logo
The wordmark is a custom relationship between a solid **V** signal pointer and the letterspaced title **VISUAL RESOLUTION**, set in Space Mono. The logo mark is a simple broken-line aperture: two cyan angles converging around one small glowing node, without brand-name text.

### Signature Brand Color
**Field Signal Cyan — #68E4E8**

## Style Decisions

- The desktop rail is a persistent, visibly occupied technical spine: it carries the full identity artifact, section position, status language, and signal-rule fragments.
- Non-diagram images are styled as diagnostic evidence plates through visual metadata, scan-like borders, and field-note framing instead of cinematic decoration.
- The aperture/V mark plus letterspaced VISUAL RESOLUTION wordmark functions as the brand identity; the large hero title remains an editorial article title.

## Approved Revision: Cinematic Hybrid

### Experience Structure
The site opens as a **scroll-directed product film**. The hero places a three-dimensional diagnostic signal core behind the article title, while the viewport moves through large chapter beats for Resolution, Diagnosis, Architecture, Voice, and Horizon. After each beat, content settles into an intentionally quiet reading panel.

### Cinematic Rules
The 3D core, node field, and typography should move in different depth layers. Scroll is the director: it changes camera offset, ring rotation, title scale, and the chapter backdrop, never triggering uncontrolled or high-speed animation. No section hides or alters the original prose; the long-form copy remains in the source order within high-contrast editorial surfaces.

### Material Direction
Dark glass, hairline cyan instrumentation, soft phosphor light, occasional red-orange diagnostic states, and scan-line grain replace the previous flat document feel. Screens should look authored, not like a generic SaaS dashboard or a game HUD.

## Full Immersive Story System

### Central Metaphor
**The diagnostic signal core is FieldMate becoming aware.** It begins as a dormant, contained aperture; resolves into vision when it can observe; becomes a branching memory field when it can retrieve evidence; emits a living waveform when it can converse; and returns as an open, stable resolution core when expertise is finally available.

### Scroll Arc
The opening is deliberately sparse: a fixed 3D signal core and two short paragraphs establish the human problem. The page then moves through five spatial stages. Each stage has one overwhelmingly clear visual state, a large original heading, and a quiet, high-contrast reading card holding the source text. The visuals are never decorative repeats: **Vision** uses a scanning optical frame, **Diagnosis** activates a fault-alert cross-section, **Architecture** expands into a memory lattice, **Voice** becomes a reactive waveform, and **Horizon** opens the core into a wearable-ready aperture.

### Storytelling Rules
The canvas is a single evolving world, not a set of unrelated effects. Scroll changes camera perspective, object scale, signal color, and which custom geometry is active. Section metadata is minimal and precise; large editorial headings use the sans-serif display voice, while Space Mono is reserved for coordinates, live-state messages, and small diagnostic labels. Long paragraphs must remain quiet, readable, and source-ordered inside solid dark glass reading cards.

### Chapter Material States
Vision is an optical scan frame, Diagnosis is a rare red-orange fault cross-section, Architecture is a cyan memory lattice, Voice is a phosphor waveform field, and Horizon is a calm open aperture. The diagnostic core remains present as a fixed, evolving protagonist, and each chapter uses an echo of its geometry in the surrounding environment.

### Interaction and Accessibility
Sections use natural scroll rather than a captured scroll experience. The 3D canvas never blocks content or input. For reduced motion, it renders a fixed state per section without animation; for mobile, the core reduces particle density and moves behind a single-column story surface.

## Approved Revision: GSAP Cinematic Scroll

### Experience Architecture
The desktop story is rebuilt as six authored **scroll stages**: Signal Boot, Vision, Trace, Recall, Voice, and Resolve. Every stage receives a long scroll runway, pins at the center of the viewport, and follows a single scrubbed GSAP timeline. The stage first announces a large title in depth, then reveals the source content inside a stable glass document surface, then exits sideways or through a mask to hand control to the next state.

### Motion System
GSAP ScrollTrigger is the timing conductor. Smooth scroll movement is normalized before it reaches the timelines. Each scene uses an explicit entry, hold, and exit: deep background geometry crosses at a low speed, the 3D core follows camera waypoints, a major title slides through a masked aperture, metadata resolves after the title, and the reading card arrives last. Scroll is never hijacked; content remains selectable and the document can still be navigated normally.

### Scene Choreography
Vision enters through an optical shutter with the card arriving from the left. Trace uses a rare fault-orange cross-section with a right-entry diagnostic card. Recall pulls backward through the memory lattice while text rises from a dark floor plane. Voice moves through waveform rails as the card enters laterally. Resolve slows the camera, opens the aperture, and lets the closing card settle in an illuminated field. The source headings, paragraphs, link, and ASCII diagram remain verbatim and in their source order.

### Responsive Rule
The pinned choreography is desktop-first. Mobile and reduced-motion presentations keep the same content and visual states but deliberately remove pins, horizontal travel, scroll smoothing, and non-essential masking, preserving direct linear reading.

## Current Scope: Static Technical Blog Reset

The latest supplied brief supersedes the cinematic direction above. **Deep Field Ledger** is the active design system: a content-first dark technical article with no staged or pinned story scenes. The article remains a narrow, vertical research ledger over a restrained, low-opacity Three.js signal network. IBM Plex Mono supplies technical headings and labels; Source Sans 3 carries the long-form copy. Field Signal Cyan (`#68E4E8`) remains reserved for diagram framing, metadata, rules, links, and quiet system cues.

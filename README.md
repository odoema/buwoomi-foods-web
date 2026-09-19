# BUWOOMI FOODS — Customer Ordering App (Web)

**Good Food. Closer to You.**

This is a self-contained customer ordering application of the BUWOOMI FOODS
customer ordering app — 16 screens, wired together with real client-side
navigation, animated screen transitions (including an iOS-style "morph" from
a menu item's photo into its detail hero image), and a working cart/checkout
flow. No build step, no dependencies, no backend.

## Deploy to Netlify

**Option A — drag and drop (fastest)**
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag this whole folder onto the page
3. Done — Netlify gives you a live URL immediately

**Option B — Netlify CLI**
```bash
npm install -g netlify-cli
cd buwoomi-foods-web
netlify deploy --prod
```

**Option C — Git**
Push this folder to a GitHub/GitLab repo, then in Netlify choose
"Import an existing project" and point it at the repo. Build command: none.
Publish directory: `.` (already set in `netlify.toml`).

No environment variables or build configuration are required — it's plain
HTML/CSS/JS.

## What's in here

| File | Purpose |
|---|---|
| `index.html` | Entry point — the phone-frame shell and desktop showcase chrome |
| `styles.css` | All styling, including the view-transition animations |
| `app.js` | Screen data, state, navigation, and all interactivity |
| `assets/` | Optimized logo images and a generated favicon set |
| `manifest.webmanifest` | Lets the application be "added to home screen" on mobile |
| `netlify.toml` | Publish directory + sensible caching/security headers |

## Browsing it

- **Desktop**: shows a phone mockup with a sidebar you can use to jump to any
  of the 16 screens directly (handy for reviewing the flow without clicking
  through it).
- **Mobile**: the phone frame goes away and the app fills the real viewport
  edge-to-edge, like a real installed app. Tap the round ☰ button
  (bottom-right) to jump between screens.
- Menu item photos load from Unsplash at runtime, so an internet connection
  is needed to see them (everything else — logo, icons, layout — is fully
  self-contained).

## What changed from the original application

- Fixed: selecting "Large" size or extras on the item details screen now
  actually changes the price carried into the cart (previously ignored).
- Fixed: the star rating on the "Delivered" screen was decorative; it's now
  tappable and updates.
- Replaced emoji icons (tab bar, status bar, back/heart/phone/chat buttons)
  with a small inline SVG icon set, so the UI looks the same on every device
  and OS instead of depending on the visitor's emoji font.
- Added animated screen transitions using the View Transitions API: a
  directional slide between "forward"/"back" navigation, a cross-fade
  between tab-bar destinations, and a shared-element morph between a menu
  item's thumbnail and its detail hero photo. Falls back to a simple fade on
  browsers without View Transitions support, and is skipped entirely when
  the visitor's OS has "reduce motion" turned on.
- Added a toast confirmation on "add to cart," a live cart badge on the tab
  bar, and small tactile touches (button press feedback, a staggered
  fade-in for lists, a "pop" animation on add).
- Cart contents now persist across a page reload (localStorage).
- Compressed the logo PNGs (~1.1 MB each → ~25–35 KB) and added a proper
  favicon/app-icon set.
- Made the layout genuinely responsive: on a real phone the application now
  fills the screen edge-to-edge instead of rendering a fixed-size mockup
  that could overflow a small viewport.

## Visual-parity pass (v2) — against the approved 14-screen reference

- Home screen category selector: replaced plain text pills with icon-topped
  circular buttons (flame / drumstick / steak / leaf / cup) to match the
  reference.
- Item Details "Choose size": replaced the radio-button rows with a proper
  segmented pill toggle (Regular / Large).
- Order Tracking (Preparing): replaced the raw `●` and `☐` placeholder
  characters on two of the four timeline steps with real SVG icons (chef
  hat / home), matching the icon treatment already used on the other two
  steps.
- Order Tracking (Out for Delivery): replaced the raw emoji pins
  (📍 🏠 🛵) on the map with proper SVG pin/marker badges and added a
  dashed route line — the one screen where the earlier emoji-to-SVG icon
  migration hadn't actually been applied.
- Orders and Profile screens were kept as-is: the reference's own Home
  screen mockup shows a 5-icon tab bar (Home, Menu, Orders, Cart, Profile),
  confirming these are expected destinations, not extra screens.

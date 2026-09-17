# BUWOOMI FOODS — backend setup (Supabase)

This turns the application from mock data into a real app: real menu data,
real sign-up/sign-in, and orders that actually get saved.

## 1. Run the schema

1. Open your project: https://supabase.com/dashboard/project/tyhqwngqxbcivfphgxck
2. Go to **SQL Editor → New query**
3. Paste the contents of `schema.sql`, click **Run**
4. New query again → paste `seed.sql`, click **Run**
   (this loads the current menu, categories and extras)

## 2. Get your anon key

1. **Project Settings → API**
2. Copy the **anon / public** key (or the newer `sb_publishable_...` key)
3. Open `supabase-config.js` in the site folder and paste it in:
   ```js
   window.SUPABASE_ANON_KEY = "sb_publishable_...";
   ```
4. Redeploy. The app auto-detects the key and switches from mock data to
   the live backend — nothing else to change.

## What's wired up

- **Menu** — `home`/`menu` screens fetch categories, items and extras from
  the `menu_items` / `categories` / `extras` tables on load. Falls back to
  the built-in mock menu if the backend isn't configured or is unreachable.
- **Auth** — the login screen does real email/password sign-up and sign-in
  via Supabase Auth. A `profiles` row is created automatically for every
  new user (via a database trigger).
- **Orders** — placing an order at checkout writes a row to `orders` plus
  one row per cart line to `order_items`, tied to the signed-in user.
- **Order history** — the Orders and Profile screens pull the signed-in
  user's real past orders.

## Security

Row Level Security is enabled on every table:
- `menu_items`, `categories`, `extras` — public read-only
- `profiles`, `addresses`, `orders`, `order_items` — each user can only
  see and write their own rows (`auth.uid() = user_id`)

## Not built yet (left as static/demo for now)

- Order status transitions (preparing → out for delivery → delivered) are
  still just screen navigation, not driven by real state changes
- Rider assignment / live tracking
- Rating submission doesn't write back to the `orders.rating` column yet
- Saved addresses screen is still a placeholder (the `addresses` table
  exists and is ready for it)
- Payment methods aren't actually charged — `payment_method` is stored as
  a label the way MTN/Airtel/Card/Cash was already in the application

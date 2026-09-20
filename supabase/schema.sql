-- ============================================================================
-- BUWOOMI FOODS — backend schema for Supabase (Postgres)
-- Run this in: Supabase Dashboard → SQL Editor → New query → Run
-- Project: buwoomifoods (tyhqwngqxbcivfphgxck)
-- ============================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- profiles  (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  is_admin boolean not null default false
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select to authenticated
  using ((select auth.uid()) = id);
create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- auto-create a profile row whenever someone signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'phone')
  on conflict (id) do nothing;
  return new;
end;
$ language plpgsql security definer set search_path = '';

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- addresses
-- ---------------------------------------------------------------------------
create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  label text not null default 'Home',
  line1 text not null,
  city text not null default 'Kampala',
  latitude double precision,
  longitude double precision,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.addresses enable row level security;

create policy "addresses_owner_all" on public.addresses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id text primary key,
  name text not null,
  icon text,
  sort_order int not null default 0
);

alter table public.categories enable row level security;
create policy "categories_public_read" on public.categories for select using (true);

-- ---------------------------------------------------------------------------
-- menu_items
-- ---------------------------------------------------------------------------
create table if not exists public.menu_items (
  id text primary key,
  name text not null,
  description text,
  price_ugx integer not null,
  category_id text references public.categories(id),
  image_url text,
  is_popular boolean not null default false,
  is_available boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.menu_items enable row level security;
create policy "menu_items_public_read" on public.menu_items for select using (true);

-- ---------------------------------------------------------------------------
-- extras  (e.g. Extra Chicken, Avocado)
-- ---------------------------------------------------------------------------
create table if not exists public.extras (
  id text primary key,
  label text not null,
  price_ugx integer not null
);

alter table public.extras enable row level security;
create policy "extras_public_read" on public.extras for select using (true);

-- ---------------------------------------------------------------------------
-- orders + order_items
-- ---------------------------------------------------------------------------
do $$ begin
  create type public.order_status as enum
    ('placed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled');
exception when duplicate_object then null;
end $$;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_no text not null unique,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status public.order_status not null default 'placed',
  subtotal_ugx integer not null,
  delivery_fee_ugx integer not null default 5000,
  total_ugx integer not null,
  payment_method text not null,
  delivery_address_id uuid references public.addresses(id),
  rider_name text,
  rider_phone text,
  rating int check (rating between 1 and 5),
  rating_comment text,
  placed_at timestamptz not null default now(),
  delivered_at timestamptz
);

alter table public.orders enable row level security;
create policy "orders_owner_select" on public.orders for select using (auth.uid() = user_id);
create policy "orders_owner_insert" on public.orders for insert with check (auth.uid() = user_id);
create policy "orders_owner_update" on public.orders for update using (auth.uid() = user_id);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  menu_item_id text references public.menu_items(id),
  name_snapshot text not null,
  price_snapshot integer not null,
  qty int not null default 1,
  size text,
  extras jsonb not null default '[]'
);

alter table public.order_items enable row level security;

create policy "order_items_owner_select" on public.order_items
  for select using (exists (
    select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()
  ));
create policy "order_items_owner_insert" on public.order_items
  for insert with check (exists (
    select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()
  ));

-- ---------------------------------------------------------------------------
-- indexes
-- ---------------------------------------------------------------------------
create index if not exists idx_menu_items_category on public.menu_items(category_id);
create index if not exists idx_orders_user on public.orders(user_id, placed_at desc);
create index if not exists idx_order_items_order on public.order_items(order_id);
create index if not exists idx_addresses_user on public.addresses(user_id);

-- ---------------------------------------------------------------------------
-- favourites
-- ---------------------------------------------------------------------------
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  menu_item_id text not null references public.menu_items(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, menu_item_id)
);

alter table public.favorites enable row level security;
create policy "favorites_owner_all" on public.favorites
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create index if not exists idx_favorites_user on public.favorites(user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- saved payment methods
-- Stores only masked/reference data; never store full card numbers or CVV.
-- ---------------------------------------------------------------------------
create table if not exists public.saved_payment_methods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  method_type text not null check (method_type in ('mtn','airtel','card','cash')),
  label text not null,
  last4 text,
  provider_reference text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.saved_payment_methods enable row level security;
create policy "saved_payment_methods_owner_all" on public.saved_payment_methods
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create index if not exists idx_saved_payment_methods_user on public.saved_payment_methods(user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- notifications
-- ---------------------------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text not null,
  kind text not null default 'general',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;
create policy "notifications_owner_select" on public.notifications
  for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "notifications_owner_update" on public.notifications
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "notifications_owner_insert" on public.notifications
  for insert to authenticated
  with check ((select auth.uid()) = user_id);
create index if not exists idx_notifications_user on public.notifications(user_id, created_at desc);

-- Foreign-key indexes for order lookups.
create index if not exists idx_order_items_menu_item on public.order_items(menu_item_id);
create index if not exists idx_orders_delivery_address on public.orders(delivery_address_id);

-- Profile creation is server-side only. Clients must not insert profiles or
-- call the trigger function directly.
revoke insert on table public.profiles from anon, authenticated;
revoke update on table public.profiles from anon, authenticated;
grant update (full_name, phone, avatar_url) on table public.profiles to authenticated;
revoke execute on function public.handle_new_user() from public;
grant execute on function public.handle_new_user() to postgres;

-- ---------------------------------------------------------------------------
-- Production operations hardening / admin controls
-- ---------------------------------------------------------------------------
create schema if not exists private;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $ select exists (
  select 1
  from public.profiles
  where id = (select auth.uid())
    and is_admin = true
); $;
revoke execute on function private.is_admin() from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.is_admin() to authenticated;

-- Admin catalog/order/settings policies are applied in the production migrations.
-- See the Supabase migration history for the canonical deployed policy definitions.

-- Production migrations may add trigger-only SECURITY DEFINER helpers. Keep them
-- non-callable through the Data API while preserving trigger execution.
do $
begin
  if to_regprocedure('public.guard_customer_order_update()') is not null then
    revoke execute on function public.guard_customer_order_update() from public, anon, authenticated;
  end if;
  if to_regprocedure('public.place_order_secure_v2(jsonb,text,uuid,timestamptz)') is not null then
    revoke execute on function public.place_order_secure_v2(jsonb,text,uuid,timestamptz) from public;
    grant execute on function public.place_order_secure_v2(jsonb,text,uuid,timestamptz) to authenticated;
  end if;
end $;

create table if not exists public.app_settings (
  id text primary key default 'default',
  delivery_fee_ugx integer not null default 5000,
  minimum_order_ugx integer not null default 0,
  estimated_delivery_min integer not null default 25,
  estimated_delivery_max integer not null default 35,
  service_area text not null default 'Kampala',
  support_email text not null default 'support@buwoomifoods.online',
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id)
);
alter table public.app_settings enable row level security;
insert into public.app_settings (id) values ('default') on conflict (id) do nothing;

create unique index if not exists uq_addresses_one_default_per_user on public.addresses(user_id) where is_default = true;
create unique index if not exists uq_payment_methods_one_default_per_user on public.saved_payment_methods(user_id) where is_default = true;
create index if not exists idx_orders_status_placed on public.orders(status, placed_at desc);

-- Customer order placement is handled atomically and server-side by
-- public.place_order_secure(jsonb,text,uuid), which recalculates menu prices,
-- extras, delivery fee and minimum order before inserting the order.
revoke execute on function public.place_order_secure(jsonb, text, uuid) from public;
grant execute on function public.place_order_secure(jsonb, text, uuid) to authenticated;

-- Canonical admin/customer RLS policies for production. Admin access is combined
-- with owner access to avoid multiple permissive policies for the same action.
drop policy if exists notifications_admin_insert on public.notifications;
drop policy if exists notifications_owner_insert on public.notifications;
create policy notifications_insert on public.notifications
  for insert to authenticated
  with check ((select private.is_admin()) or (select auth.uid()) = user_id);

drop policy if exists orders_admin_select on public.orders;
drop policy if exists orders_owner_select on public.orders;
create policy orders_select on public.orders
  for select to authenticated
  using ((select private.is_admin()) or (select auth.uid()) = user_id);

drop policy if exists orders_admin_update on public.orders;
drop policy if exists orders_owner_update on public.orders;
create policy orders_update on public.orders
  for update to authenticated
  using ((select private.is_admin()) or (select auth.uid()) = user_id)
  with check ((select private.is_admin()) or (select auth.uid()) = user_id);

drop policy if exists profiles_admin_select on public.profiles;
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select on public.profiles
  for select to authenticated
  using ((select private.is_admin()) or (select auth.uid()) = id);


-- Foreign-key indexes added for production query/planner performance.
create index if not exists idx_app_settings_updated_by on public.app_settings(updated_by);
create index if not exists idx_favorites_menu_item on public.favorites(menu_item_id);

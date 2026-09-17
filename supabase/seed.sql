-- ============================================================================
-- BUWOOMI FOODS — seed data (matches the current application's menu)
-- Run this AFTER schema.sql, in the SQL Editor.
-- ============================================================================

insert into public.categories (id, name, icon, sort_order) values
  ('popular', 'Popular', 'flame', 0),
  ('chicken', 'Chicken', 'drumstick', 1),
  ('beef',    'Beef',    'beef',      2),
  ('veggie',  'Veggie',  'leaf',      3),
  ('drinks',  'Drinks',  'cup',       4)
on conflict (id) do nothing;

insert into public.menu_items (id, name, description, price_ugx, category_id, image_url, is_popular) values
  ('gcb', 'Grilled Chicken Bowl', 'Juicy grilled chicken, steamed rice, fresh salad and our special sauce.', 18000, 'chicken', 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80', true),
  ('cb',  'Chicken Burger',       'Crispy chicken fillet, house sauce, fresh lettuce — served with fries.', 15000, 'chicken', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80', false),
  ('bs',  'Beef Stew',            'Slow-cooked beef stew, served with rice or matooke.',                    16000, 'beef',    'https://images.unsplash.com/photo-1604908177522-040670eb827d?w=800&q=80', true),
  ('ff',  'Fish Fillet',          'Pan-seared fish fillet with fries and a fresh garden salad.',            20000, 'beef',    'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80', true),
  ('vp',  'Veggie Pasta',         'Fresh seasonal vegetables tossed with pasta in a light herb sauce.',     14000, 'veggie',  'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80', false),
  ('cw',  'Chicken Wings',        '6-piece grilled wings tossed in our special sauce.',                     16000, 'chicken', 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=800&q=80', true),
  ('fj',  'Fresh Juice',          'Seasonal fruit, freshly pressed to order.',                                5000, 'drinks',  'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&q=80', false)
on conflict (id) do nothing;

insert into public.extras (id, label, price_ugx) values
  ('chicken', 'Extra Chicken', 5000),
  ('avo',     'Avocado',       2000)
on conflict (id) do nothing;

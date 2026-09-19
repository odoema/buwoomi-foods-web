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

-- ---------------------------------------------------------------------------
-- BUWOOMI FOODS — Uganda fast-food catalogue expansion
-- Based on a review of common Ugandan fast-food/street-food offerings.
-- Prices are starter catalogue values and should be confirmed by the business.
-- ---------------------------------------------------------------------------

insert into public.categories (id, name, icon, sort_order) values
  ('rolex',   'Rolex',       'flame',      1),
  ('chips',   'Chips & Meals','bag',        2),
  ('snacks',  'Snacks',      'bag',        3),
  ('pizza',   'Pizza',       'flame',      4),
  ('breakfast','Breakfast',  'cup',         5),
  ('local',   'Local Favourites','leaf',     6)
on conflict (id) do nothing;

insert into public.menu_items
  (id, name, description, price_ugx, category_id, image_url, is_popular, is_available)
values
  ('ug-rolex', 'Classic Rolex', 'Fresh chapati rolled around a two-egg omelette with tomato, onion and cabbage.', 5000, 'rolex', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80', true, true),
  ('ug-chicken-rolex', 'Chicken Rolex', 'Chapati and egg omelette with seasoned chicken, tomato, onion and cabbage.', 10000, 'rolex', 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80', true, true),
  ('ug-beef-rolex', 'Beef Rolex', 'Chapati and egg omelette with seasoned beef, tomato, onion and cabbage.', 10000, 'rolex', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80', true, true),
  ('ug-chips', 'Chips', 'Crispy golden potato chips served with tomato sauce or kachumbari.', 7000, 'chips', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80', true, true),
  ('ug-chips-chicken', 'Chips & Chicken', 'Crispy chips served with a juicy piece of fried chicken and fresh salad.', 15000, 'chips', 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=800&q=80', true, true),
  ('ug-chips-egg', 'Chips & Omelette', 'Crispy chips served with a two-egg vegetable omelette and salad.', 10000, 'chips', 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80', false, true),
  ('ug-fried-chicken', 'Fried Chicken', 'Crispy seasoned fried chicken served hot with a fresh side salad.', 10000, 'chicken', 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&q=80', true, true),
  ('ug-muchomo', 'Muchomo', 'Grilled beef pieces seasoned and served as a quick, smoky meat snack.', 10000, 'snacks', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80', true, true),
  ('ug-beef-samosa', 'Beef Samosa', 'Crispy pastry filled with seasoned minced beef. Sold as a pair.', 4000, 'snacks', 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=800&q=80', true, true),
  ('ug-veg-samosa', 'Vegetable Samosa', 'Crispy pastry filled with seasoned vegetables. Sold as a pair.', 3000, 'snacks', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80', false, true),
  ('ug-sausage', 'Beef Sausages', 'Two grilled or fried beef sausages served with a simple salad.', 5000, 'snacks', 'https://images.unsplash.com/photo-1612392062631-94dd858cba88?w=800&q=80', false, true),
  ('ug-chapati', 'Chapati', 'Freshly cooked soft Ugandan-style chapati.', 2000, 'breakfast', 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=800&q=80', false, true),
  ('ug-mandazi', 'Mandazi', 'Soft lightly sweet fried dough, ideal with tea or coffee.', 2000, 'breakfast', 'https://images.unsplash.com/photo-1626803775151-61d756612f97?w=800&q=80', false, true),
  ('ug-egg-roll', 'Egg Roll', 'Boiled egg wrapped in seasoned dough and fried until golden.', 3000, 'breakfast', 'https://images.unsplash.com/photo-1510693206972-df098f6788f3?w=800&q=80', false, true),
  ('ug-pizza', 'Chicken Pizza', 'Cheesy pizza topped with seasoned chicken, onions and peppers.', 25000, 'pizza', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80', true, true),
  ('ug-beef-pizza', 'Beef Pizza', 'Cheesy pizza topped with seasoned beef, onions and peppers.', 25000, 'pizza', 'https://images.unsplash.com/photo-1579751626657-72bc17010498?w=800&q=80', false, true),
  ('ug-matooke-beef', 'Beef & Matooke', 'Tender beef stew served with matooke and a fresh vegetable side.', 16000, 'local', 'https://images.unsplash.com/photo-1604908177522-040670eb827d?w=800&q=80', true, true),
  ('ug-pilau-chicken', 'Chicken Pilau', 'Spiced East African rice served with seasoned chicken and salad.', 15000, 'local', 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80', true, true),
  ('ug-katogo', 'Katogo', 'A filling Ugandan one-pot breakfast of matooke, sauce and your choice of protein.', 12000, 'local', 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80', false, true),
  ('ug-gonja', 'Roasted Gonja', 'Sweet plantain roasted until smoky and tender.', 4000, 'snacks', 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=800&q=80', false, true),
  ('ug-cassava', 'Fried Cassava', 'Crispy fried cassava sticks served with a dipping sauce.', 5000, 'snacks', 'https://images.unsplash.com/photo-1623238913973-21e45cced554?w=800&q=80', false, true),
  ('ug-tea', 'African Tea', 'Hot milky tea with ginger and local spices.', 3000, 'breakfast', 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800&q=80', false, true)
on conflict (id) do nothing;

insert into public.extras (id, label, price_ugx) values
  ('extra-egg', 'Extra Egg', 2000),
  ('extra-chips', 'Extra Chips', 4000),
  ('cheese', 'Cheese', 3000),
  ('sausage-extra', 'Extra Sausage', 2500),
  ('kachumbari', 'Extra Kachumbari', 1500)
on conflict (id) do nothing;

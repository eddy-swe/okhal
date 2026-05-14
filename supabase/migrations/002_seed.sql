-- ══════════════════════════════════════════════════════
--  002_seed.sql
--  Run AFTER 001_schema.sql
-- ══════════════════════════════════════════════════════

-- ── Categories ────────────────────────────────────────
INSERT INTO public.menu_categories (id, name, display_order) VALUES
  ('cat-mains-0001-0000-000000000000', 'Mains',              1),
  ('cat-sides-0002-0000-000000000000', 'Sides & Starters',   2),
  ('cat-drink-0003-0000-000000000000', 'Beverages',          3),
  ('cat-sweet-0004-0000-000000000000', 'Desserts & Snacks',  4);


-- ── Mains ─────────────────────────────────────────────
INSERT INTO public.menu_items (category_id, name, description, price, available) VALUES

('cat-mains-0001-0000-000000000000',
 'Nyama Choma',
 'Kenyan grilled goat, slow-cooked over open charcoal. Served with kachumbari and ugali. The heartbeat of any East African gathering.',
 14.50, true),

('cat-mains-0001-0000-000000000000',
 'Doro Wat',
 'Ethiopia''s most beloved dish — whole chicken legs slow-braised in berbere spice paste with clarified butter and boiled eggs. Served on injera.',
 15.00, true),

('cat-mains-0001-0000-000000000000',
 'Misir Wat',
 'Split red lentils simmered low and slow with berbere, onion, and spiced butter. Rich, earthy, deeply satisfying. Vegan.',
 11.00, true),

('cat-mains-0001-0000-000000000000',
 'Tibs',
 'Pan-seared beef strips with jalapeño, rosemary, and onion, tossed in a hot iron skillet at the last moment. Medium spice.',
 16.00, true),

('cat-mains-0001-0000-000000000000',
 'Kenyan Pilau',
 'Long-grain rice cooked in beef broth with whole spices — cumin, cardamom, cloves, cinnamon. Topped with caramelised onion and boiled egg.',
 12.00, true),

('cat-mains-0001-0000-000000000000',
 'Ugali na Nyama',
 'Firm white maize meal paired with slow-braised beef in a tomato-onion stew. Simple, filling, and the foundation of Kenyan home cooking.',
 10.00, true),

('cat-mains-0001-0000-000000000000',
 'Kitfo',
 'Ethiopian lean minced beef seasoned with mitmita spice and niter kibbeh (spiced clarified butter). Served lightly warmed with ayib cheese.',
 17.00, true),

('cat-mains-0001-0000-000000000000',
 'Shiro Wat',
 'A thick, slow-cooked stew of ground chickpea flour with garlic, ginger, and berbere. A staple of Ethiopian fasting cuisine. Vegan.',
 10.50, true);


-- ── Sides & Starters ──────────────────────────────────
INSERT INTO public.menu_items (category_id, name, description, price, available) VALUES

('cat-sides-0002-0000-000000000000',
 'Injera Basket',
 'A generous portion of traditional Ethiopian sourdough flatbread — spongy, slightly tangy, baked on a mitad clay plate. Serves 2.',
 4.00, true),

('cat-sides-0002-0000-000000000000',
 'Beef Samosa (3 pcs)',
 'Crispy golden pastry filled with spiced minced beef, green chilli, and coriander. Fried to order. Served with tamarind chutney.',
 6.50, true),

('cat-sides-0002-0000-000000000000',
 'Vegetable Samosa (3 pcs)',
 'The same crispy pastry, filled with spiced potato, peas, and carrot. Vegan. Served with tamarind chutney.',
 5.50, true),

('cat-sides-0002-0000-000000000000',
 'Chapati (2 pcs)',
 'Soft, flaky East African flatbread made with white flour, oil, and a touch of salt. Cooked on a dry griddle until golden.',
 3.50, true),

('cat-sides-0002-0000-000000000000',
 'Kachumbari',
 'Classic East African tomato and red onion salad with fresh coriander, lemon juice, and green chilli. Bright and refreshing.',
 4.00, true),

('cat-sides-0002-0000-000000000000',
 'Mutura',
 'Traditional Kenyan grilled sausage made with spiced offal and blood, packed into a natural casing and roasted over charcoal. A Nairobi street classic.',
 7.00, true);


-- ── Beverages ─────────────────────────────────────────
INSERT INTO public.menu_items (category_id, name, description, price, available) VALUES

('cat-drink-0003-0000-000000000000',
 'Buna (Ethiopian Coffee)',
 'Dark-roasted beans ground by hand and brewed in a clay jebena pot. Served in small cups with popcorn, in the traditional ceremony style.',
 4.50, true),

('cat-drink-0003-0000-000000000000',
 'Kenyan Chai',
 'Strong black tea brewed with whole milk, ginger, cardamom, and cinnamon. Sweetened to order. The original Kenyan chai masala.',
 3.00, true),

('cat-drink-0003-0000-000000000000',
 'Fresh Mango Juice',
 'Cold-pressed Kenyan Ngowe mangoes, nothing added. Thick, fragrant, and naturally sweet. Seasonal.',
 4.50, true),

('cat-drink-0003-0000-000000000000',
 'Tangawizi Soda',
 'East African ginger soda with real ginger root, a squeeze of lime, and a hint of chilli. Fiery and refreshing.',
 3.50, true);


-- ── Desserts & Snacks ─────────────────────────────────
INSERT INTO public.menu_items (category_id, name, description, price, available) VALUES

('cat-sweet-0004-0000-000000000000',
 'Mandazi (3 pcs)',
 'Lightly sweetened East African fried dough spiced with cardamom and coconut milk. Soft inside, golden outside. Best eaten warm.',
 4.00, true),

('cat-sweet-0004-0000-000000000000',
 'Swahili Halwa',
 'Dense, jewel-coloured semolina sweet cooked with ghee, rosewater, and cardamom. A Mombasa coastal speciality. Served in small cubes.',
 5.00, true);
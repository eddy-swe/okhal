-- ══════════════════════════════════════════════════════
--  001_schema.sql
--  Run this in: Supabase Dashboard → SQL Editor → New query
-- ══════════════════════════════════════════════════════

-- UUID helper (already enabled on Supabase, but safe to repeat)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ──────────────────────────────────────────────────────
--  TABLES
-- ──────────────────────────────────────────────────────

-- Users
-- Mirrors auth.users (created by Supabase Auth).
-- We store only the extra fields we need: email cache + role.
CREATE TABLE public.users (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT        NOT NULL,
  full_name   TEXT,
  role        TEXT        NOT NULL DEFAULT 'customer'
                          CHECK (role IN ('customer', 'staff')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Menu categories
CREATE TABLE public.menu_categories (
  id            UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT    NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0
);

-- Menu items
CREATE TABLE public.menu_items (
  id          UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID           REFERENCES public.menu_categories(id) ON DELETE SET NULL,
  name        TEXT           NOT NULL,
  description TEXT,
  price       NUMERIC(10,2)  NOT NULL CHECK (price >= 0),
  image_url   TEXT,
  available   BOOLEAN        NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- Orders
CREATE TABLE public.orders (
  id                UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID           REFERENCES public.users(id) ON DELETE SET NULL,
  status            TEXT           NOT NULL DEFAULT 'received'
                                   CHECK (status IN ('received','preparing','ready','delivered')),
  delivery_address  TEXT           NOT NULL,
  total_amount      NUMERIC(10,2)  NOT NULL CHECK (total_amount >= 0),
  stripe_session_id TEXT,
  created_at        TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- Order items (line items)
CREATE TABLE public.order_items (
  id           UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id     UUID          NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  menu_item_id UUID          REFERENCES public.menu_items(id) ON DELETE SET NULL,
  quantity     INTEGER       NOT NULL CHECK (quantity > 0),
  unit_price   NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0)
);


-- ──────────────────────────────────────────────────────
--  TRIGGERS
-- ──────────────────────────────────────────────────────

-- 1. Auto-create a public.users row whenever someone signs up via Supabase Auth.
--    SECURITY DEFINER means it runs as the DB owner, bypassing RLS on insert.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    -- Allows seeding staff accounts via raw_user_meta_data: { "role": "staff" }
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Keep orders.updated_at fresh on every status change.
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER orders_set_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ──────────────────────────────────────────────────────
--  HELPER: is the current JWT a staff member?
--  Used in every RLS policy below instead of repeating the sub-select.
-- ──────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'staff'
  );
$$;


-- ──────────────────────────────────────────────────────
--  ROW LEVEL SECURITY
-- ──────────────────────────────────────────────────────

ALTER TABLE public.users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items   ENABLE ROW LEVEL SECURITY;


-- users ------------------------------------------------
CREATE POLICY "Own profile: select"
  ON public.users FOR SELECT
  USING (auth.uid() = id OR public.is_staff());

-- Prevent customers from escalating their own role
CREATE POLICY "Own profile: update (no role change)"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT role FROM public.users WHERE id = auth.uid())
  );


-- menu_categories --------------------------------------
-- Public read, staff write
CREATE POLICY "Menu categories: public read"
  ON public.menu_categories FOR SELECT USING (true);

CREATE POLICY "Menu categories: staff write"
  ON public.menu_categories FOR ALL
  USING (public.is_staff()) WITH CHECK (public.is_staff());


-- menu_items -------------------------------------------
-- Customers see only available items; staff sees everything
CREATE POLICY "Menu items: customer read"
  ON public.menu_items FOR SELECT
  USING (available = true OR public.is_staff());

CREATE POLICY "Menu items: staff write"
  ON public.menu_items FOR ALL
  USING (public.is_staff()) WITH CHECK (public.is_staff());


-- orders -----------------------------------------------
-- Customers see only their own orders; staff sees all
CREATE POLICY "Orders: customer select"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id OR public.is_staff());

-- The Stripe webhook (service role key) inserts orders, bypassing RLS.
-- Authenticated customers can also insert their own orders directly.
CREATE POLICY "Orders: customer insert"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Only staff may update status
CREATE POLICY "Orders: staff update"
  ON public.orders FOR UPDATE
  USING (public.is_staff());


-- order_items ------------------------------------------
CREATE POLICY "Order items: read own"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id
        AND (o.user_id = auth.uid() OR public.is_staff())
    )
  );

-- Inserting order_items is done server-side (Stripe webhook) with the
-- service role key, which bypasses RLS entirely — no INSERT policy needed.


-- ──────────────────────────────────────────────────────
--  REALTIME
--  Enable Supabase Realtime on orders so the staff dashboard
--  and customer tracking page get live updates.
-- ──────────────────────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
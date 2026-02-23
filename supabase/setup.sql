-- ═══════════════════════════════════════════════════════════════
-- Bata Ganik — Supabase Setup SQL
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ═══════════════════════════════════════════════════════════════

-- ── 1. Enable Row-Level Security on all tables ────────────────

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- ── 2. Products — public read, admin write ────────────────────

CREATE POLICY "Anyone can read published products"
  ON products FOR SELECT
  USING ("isPublished" = true);

CREATE POLICY "Admin has full access to products"
  ON products FOR ALL
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin')
  );

CREATE POLICY "Anyone can read product images"
  ON product_images FOR SELECT
  USING (true);

CREATE POLICY "Admin has full access to product images"
  ON product_images FOR ALL
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin')
  );

CREATE POLICY "Anyone can read variants"
  ON product_variants FOR SELECT
  USING (true);

CREATE POLICY "Admin has full access to variants"
  ON product_variants FOR ALL
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin')
  );

CREATE POLICY "Anyone can read active collections"
  ON collections FOR SELECT
  USING ("isActive" = true);

CREATE POLICY "Admin has full access to collections"
  ON collections FOR ALL
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin')
  );

-- ── 3. Carts — session or user owned ─────────────────────────
-- NOTE: Cart access is handled server-side via service role key.
-- These policies are a safety net.

CREATE POLICY "Owner can access their cart"
  ON carts FOR ALL
  USING (
    "customerId" = auth.uid()::text
    OR auth.uid() IS NULL  -- guest access via service role
  );

-- ── 4. Customers — own data only ──────────────────────────────

CREATE POLICY "Customer can read own profile"
  ON customers FOR SELECT
  USING (id = auth.uid()::text);

CREATE POLICY "Customer can update own profile"
  ON customers FOR UPDATE
  USING (id = auth.uid()::text);

CREATE POLICY "Admin can read all customers"
  ON customers FOR SELECT
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin')
  );

-- ── 5. Orders — customers see own, admins see all ─────────────

CREATE POLICY "Customer can read own orders"
  ON orders FOR SELECT
  USING ("customerId" = auth.uid()::text);

CREATE POLICY "Admin has full access to orders"
  ON orders FOR ALL
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin')
  );

CREATE POLICY "Customer can read their order items"
  ON order_items FOR SELECT
  USING (
    "orderId" IN (
      SELECT id FROM orders WHERE "customerId" = auth.uid()::text
    )
  );

-- ── 6. Contact messages — admin only ─────────────────────────

CREATE POLICY "Admin can read contact messages"
  ON contact_messages FOR SELECT
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin')
  );

-- ── 7. Storage Buckets ────────────────────────────────────────

-- Create product images bucket (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create brand assets bucket (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('brand-assets', 'brand-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: anyone can read public buckets
CREATE POLICY "Public can read product images"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('product-images', 'brand-assets'));

-- Only admins can upload
CREATE POLICY "Admin can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id IN ('product-images', 'brand-assets')
    AND (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin')
  );

-- ── 8. Create admin user (run AFTER user registers in Supabase Auth) ──
-- Replace 'your-admin-user-uuid' with the actual UUID from Supabase Auth dashboard

-- UPDATE auth.users
--   SET app_metadata = jsonb_set(app_metadata, '{role}', '"admin"')
-- WHERE id = 'your-admin-user-uuid';

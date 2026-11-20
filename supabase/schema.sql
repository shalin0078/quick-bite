-- ================================================================
-- QUICKBITE DATABASE SCHEMA (PostgreSQL / Supabase)
-- ================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    custom_user_id VARCHAR(32) UNIQUE NOT NULL, -- e.g. QB-CUST-849201
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(30),
    role VARCHAR(30) DEFAULT 'customer' CHECK (role IN ('customer', 'delivery_partner', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index on email and custom_user_id
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_custom_id ON public.customers(custom_user_id);

-- 3. DELIVERY ADDRESSES TABLE
CREATE TABLE IF NOT EXISTS public.delivery_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    address_line TEXT NOT NULL,
    street TEXT,
    city VARCHAR(100) NOT NULL DEFAULT 'Vadodara',
    state VARCHAR(100) DEFAULT 'Gujarat',
    pincode VARCHAR(20) NOT NULL,
    address_type VARCHAR(30) DEFAULT 'Home' CHECK (address_type IN ('Home', 'Work', 'Other')),
    is_default BOOLEAN DEFAULT FALSE,
    latitude DOUBLE PRECISION NOT NULL DEFAULT 22.3072,
    longitude DOUBLE PRECISION NOT NULL DEFAULT 73.1812,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_addresses_customer_id ON public.delivery_addresses(customer_id);

-- 4. DELIVERY PARTNERS TABLE
CREATE TABLE IF NOT EXISTS public.delivery_partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
    custom_partner_id VARCHAR(32) UNIQUE NOT NULL, -- e.g. QB-RIDER-392011
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(30) NOT NULL,
    vehicle_type VARCHAR(50) DEFAULT 'Motorcycle (Scooter)',
    bike_number VARCHAR(30) DEFAULT 'GJ-06-BQ-4912',
    rating NUMERIC(2,1) DEFAULT 4.9,
    availability_status VARCHAR(30) DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'offline')),
    current_latitude DOUBLE PRECISION DEFAULT 22.3120,
    current_longitude DOUBLE PRECISION DEFAULT 73.1750,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_partners_status ON public.delivery_partners(availability_status);

-- 5. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id VARCHAR(32) PRIMARY KEY, -- e.g. QB12345678
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
    restaurant_id VARCHAR(100) NOT NULL,
    restaurant_name VARCHAR(150) NOT NULL,
    delivery_partner_id UUID REFERENCES public.delivery_partners(id) ON DELETE SET NULL,
    delivery_address_id UUID REFERENCES public.delivery_addresses(id) ON DELETE SET NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    item_total NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    discount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    platform_fee NUMERIC(10,2) NOT NULL DEFAULT 5.00,
    total_amount NUMERIC(10,2) NOT NULL,
    applied_coupon VARCHAR(50),
    payment_method VARCHAR(50) NOT NULL DEFAULT 'Cash on Delivery',
    payment_status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
    order_status VARCHAR(50) NOT NULL DEFAULT 'Order Placed' CHECK (order_status IN (
        'Order Placed',
        'Restaurant Confirmed',
        'Preparing Your Food',
        'Ready for Pickup',
        'Picked Up by Delivery Partner',
        'Out for Delivery',
        'Delivered'
    )),
    restaurant_lat DOUBLE PRECISION NOT NULL DEFAULT 22.3175,
    restaurant_lng DOUBLE PRECISION NOT NULL DEFAULT 73.1680,
    delivery_lat DOUBLE PRECISION NOT NULL DEFAULT 22.3072,
    delivery_lng DOUBLE PRECISION NOT NULL DEFAULT 73.1812,
    estimated_delivery_mins INT DEFAULT 25,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivered_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_orders_customer ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_partner ON public.orders(delivery_partner_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);

-- 6. DELIVERY LOCATIONS TABLE (Real-time breadcrumbs & tracking)
CREATE TABLE IF NOT EXISTS public.delivery_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id VARCHAR(32) NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    delivery_partner_id UUID NOT NULL REFERENCES public.delivery_partners(id) ON DELETE CASCADE,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    heading DOUBLE PRECISION DEFAULT 0.0,
    speed DOUBLE PRECISION DEFAULT 0.0,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_locations_order ON public.delivery_locations(order_id);
CREATE INDEX IF NOT EXISTS idx_locations_recorded_at ON public.delivery_locations(recorded_at DESC);

-- 7. DELIVERY OTP TABLE (Cryptographically hashed, 10m expiry, max 5 attempts)
CREATE TABLE IF NOT EXISTS public.delivery_otp (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id VARCHAR(32) UNIQUE NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    otp_hash VARCHAR(128) NOT NULL, -- SHA-256 hash of 6-digit OTP
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    attempts INT DEFAULT 0,
    max_attempts INT DEFAULT 5,
    last_sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_otp_order ON public.delivery_otp(order_id);

-- 8. ORDER STATUS HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.order_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id VARCHAR(32) NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    updated_by UUID,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_status_history_order ON public.order_status_history(order_id);

-- ================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================================

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_otp ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

-- Customers can view/update only their own profile
CREATE POLICY "Customers view own profile"
    ON public.customers FOR SELECT
    USING (auth.uid() = auth_id);

CREATE POLICY "Customers update own profile"
    ON public.customers FOR UPDATE
    USING (auth.uid() = auth_id);

-- Delivery addresses: Customer owns their addresses
CREATE POLICY "Customers view own addresses"
    ON public.delivery_addresses FOR SELECT
    USING (customer_id IN (SELECT id FROM public.customers WHERE auth_id = auth.uid()));

CREATE POLICY "Customers manage own addresses"
    ON public.delivery_addresses FOR ALL
    USING (customer_id IN (SELECT id FROM public.customers WHERE auth_id = auth.uid()));

-- Orders: Customer can read their orders, Partner can read assigned orders, Admin can read all
CREATE POLICY "Customer reads own orders"
    ON public.orders FOR SELECT
    USING (
        customer_id IN (SELECT id FROM public.customers WHERE auth_id = auth.uid()) OR
        delivery_partner_id IN (SELECT id FROM public.delivery_partners WHERE auth_id = auth.uid())
    );

-- Delivery Locations: readable by customer of the order and the assigned partner
CREATE POLICY "Order parties read locations"
    ON public.delivery_locations FOR SELECT
    USING (
        order_id IN (
            SELECT id FROM public.orders WHERE
            customer_id IN (SELECT id FROM public.customers WHERE auth_id = auth.uid()) OR
            delivery_partner_id IN (SELECT id FROM public.delivery_partners WHERE auth_id = auth.uid())
        )
    );

-- Delivery OTP: NEVER readable directly by clients to prevent leak of hashes
CREATE POLICY "No direct client access to OTP table"
    ON public.delivery_otp FOR ALL
    USING (false);

-- Enable Supabase Realtime Publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders, public.delivery_locations, public.order_status_history;

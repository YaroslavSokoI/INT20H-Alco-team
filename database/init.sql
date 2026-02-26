CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    login VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL CHECK (role IN ('admin', 'manager')),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    subtotal DECIMAL(12, 4) NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    composite_tax_rate DECIMAL(8, 6) NOT NULL,
    tax_amount DECIMAL(12, 4) NOT NULL,
    total_amount DECIMAL(12, 4) NOT NULL,
    state_rate DECIMAL(8, 6) NOT NULL DEFAULT 0,
    county_rate DECIMAL(8, 6) NOT NULL DEFAULT 0,
    city_rate DECIMAL(8, 6) NOT NULL DEFAULT 0,
    special_rates DECIMAL(8, 6) NOT NULL DEFAULT 0,
    jurisdictions JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_state ON orders ((jurisdictions ->> 'state'));

CREATE INDEX IF NOT EXISTS idx_orders_city ON orders ((jurisdictions ->> 'city'));

CREATE INDEX IF NOT EXISTS idx_orders_timestamp ON orders (timestamp);
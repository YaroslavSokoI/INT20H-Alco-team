CREATE DATABASE wellness_orders;

\c wellness_orders;

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT gen_random_uuid () UNIQUE,
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

CREATE INDEX idx_orders_state ON orders ((jurisdictions ->> 'state'));

CREATE INDEX idx_orders_city ON orders ((jurisdictions ->> 'city'));

CREATE INDEX idx_orders_timestamp ON orders (timestamp);
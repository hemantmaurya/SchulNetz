-- 003_create_vehicles_table.sql
-- Creates vehicles table for school transport management

CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    vehicle_number VARCHAR(50) UNIQUE NOT NULL,
    driver_name VARCHAR(100),
    capacity INTEGER NOT NULL,
    route_name VARCHAR(200),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_vehicles_number ON vehicles(vehicle_number);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);

COMMENT ON TABLE vehicles IS 'School transport vehicles (buses, vans, etc.)';

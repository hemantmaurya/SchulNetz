-- 005_add_route_name_and_fuel_type.sql
-- Adds back route_name and adds new fuel_type column

ALTER TABLE vehicles 
ADD COLUMN IF NOT EXISTS route_name VARCHAR(200);

ALTER TABLE vehicles 
ADD COLUMN IF NOT EXISTS fuel_type VARCHAR(50) DEFAULT 'diesel';

COMMENT ON COLUMN vehicles.fuel_type IS 'Fuel type: diesel, petrol, electric, cng';

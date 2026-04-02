-- 004_drop_route_name_from_vehicles.sql
-- Removes route_name column (testing column drop)

ALTER TABLE vehicles 
DROP COLUMN IF EXISTS route_name;

COMMENT ON TABLE vehicles IS 'Vehicles table after dropping route_name column';

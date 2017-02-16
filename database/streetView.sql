DROP DATABASE IF EXISTS homeSlice;
CREATE DATABASE homeSlice;

\c homeslice;

CREATE TABLE streetview (
  id SERIAL PRIMARY KEY,
  location VARCHAR(100),
  latLng POINT,
  description VARCHAR(255),
  pano_id VARCHAR(100),
  guess VARCHAR(255)
);

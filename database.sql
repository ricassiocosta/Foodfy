DROP DATABASE IF EXISTS foodfy;
CREATE DATABASE foodfy;

CREATE TABLE IF NOT EXISTS "files" (
	id SERIAL PRIMARY KEY,
  name TEXT,
  path TEXT NOT NULL
);

CREATE TABLE "chefs" (
  id SERIAL PRIMARY KEY,
  name TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  file_id INT
);

ALTER TABLE "chefs" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id");

CREATE TABLE "recipes" (
	id SERIAL PRIMARY KEY,
  chef_id INTEGER,
  title TEXT,
  ingredients TEXT[],
  preparation TEXT[],
  information TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "recipes" ADD FOREIGN KEY ("chef_id") REFERENCES "chefs" ("id");

CREATE TABLE "recipe_files" (
	id SERIAL PRIMARY KEY,
  recipe_id INT,
  file_id INT
);

ALTER TABLE "recipe_files" ADD FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id") ON DELETE CASCADE;
ALTER TABLE "recipe_files" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id") ON DELETE CASCADE;

CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
	BEGIN
  	NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
  END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON recipes
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
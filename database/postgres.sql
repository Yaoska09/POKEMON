CREATE TABLE player (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20),
    location VARCHAR(50)
);

INSERT INTO player (name, location)
VALUES ('Ash Ketchum', 'Pallet Town');

INSERT INTO player (name, location)
VALUES ('Misty', 'Cerulean City');

INSERT INTO player (name, location)
VALUES ('Brock', 'Pewter City');

INSERT INTO player (name, location)
VALUES ('Gary Oak', 'Pallet Town');


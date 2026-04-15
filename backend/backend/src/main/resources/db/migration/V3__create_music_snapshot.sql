CREATE TABLE music_snapshot (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT       UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    track_name  VARCHAR(255),
    artist_name VARCHAR(255),
    album_art   VARCHAR(500),
    preview_url VARCHAR(500),
    is_playing  BOOLEAN      NOT NULL DEFAULT FALSE,
    synced_at   TIMESTAMP    NOT NULL DEFAULT NOW()
);

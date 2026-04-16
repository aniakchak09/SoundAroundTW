CREATE TABLE track (
    id          BIGSERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    artist      VARCHAR(255) NOT NULL,
    album       VARCHAR(255),
    preview_url VARCHAR(500),
    lastfm_url  VARCHAR(500)
);

CREATE TABLE user_tracks (
    user_id  BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    track_id BIGINT NOT NULL REFERENCES track(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, track_id)
);

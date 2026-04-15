CREATE TABLE users (
    id         BIGSERIAL PRIMARY KEY,
    username   VARCHAR(50)  UNIQUE NOT NULL,
    email      VARCHAR(100) UNIQUE NOT NULL,
    password   VARCHAR(255) NOT NULL,
    lastfm_username VARCHAR(50),
    avatar_url VARCHAR(500),
    privacy_mode VARCHAR(20) NOT NULL DEFAULT 'PUBLIC',
    role       VARCHAR(20)  NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP   NOT NULL DEFAULT NOW()
);

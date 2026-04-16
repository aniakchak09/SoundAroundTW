CREATE TABLE feedback (
    id                   BIGSERIAL PRIMARY KEY,
    user_id              BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category             VARCHAR(50) NOT NULL,
    rating               INT         NOT NULL,
    subscribe_to_updates BOOLEAN     NOT NULL DEFAULT FALSE,
    message              TEXT        NOT NULL,
    created_at           TIMESTAMP   NOT NULL DEFAULT NOW()
);

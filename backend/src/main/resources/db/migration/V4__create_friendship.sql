CREATE TABLE friendship (
    id           BIGSERIAL PRIMARY KEY,
    requester_id BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    addressee_id BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status       VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    match_score  INT,
    created_at   TIMESTAMP   NOT NULL DEFAULT NOW(),
    UNIQUE (requester_id, addressee_id)
);

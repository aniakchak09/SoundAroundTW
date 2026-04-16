package com.soundaround.backend.dto.music

import jakarta.validation.constraints.NotBlank

data class SyncSnapshotRequest(
    @field:NotBlank
    val lastfmUsername: String
)

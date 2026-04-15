package com.soundaround.backend.dto.track

import jakarta.validation.constraints.NotBlank

data class TrackRequest(
    @field:NotBlank val title: String,
    @field:NotBlank val artist: String,
    val album: String? = null,
    val previewUrl: String? = null,
    val lastfmUrl: String? = null
)

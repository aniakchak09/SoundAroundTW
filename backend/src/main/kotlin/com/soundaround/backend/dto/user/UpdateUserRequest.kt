package com.soundaround.backend.dto.user

import com.soundaround.backend.entity.PrivacyMode
import jakarta.validation.constraints.Size

data class UpdateUserRequest(
    @field:Size(min = 3, max = 50)
    val username: String? = null,
    val lastfmUsername: String? = null,
    val avatarUrl: String? = null,
    val privacyMode: PrivacyMode? = null
)

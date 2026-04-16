package com.soundaround.backend.dto.user

import com.soundaround.backend.entity.PrivacyMode
import com.soundaround.backend.entity.Role
import com.soundaround.backend.entity.User
import java.time.LocalDateTime

data class UserResponse(
    val id: Long,
    val username: String,
    val email: String,
    val lastfmUsername: String?,
    val avatarUrl: String?,
    val privacyMode: PrivacyMode,
    val role: Role,
    val createdAt: LocalDateTime
) {
    companion object {
        fun from(user: User) = UserResponse(
            id = user.id,
            username = user.username,
            email = user.email,
            lastfmUsername = user.lastfmUsername,
            avatarUrl = user.avatarUrl,
            privacyMode = user.privacyMode,
            role = user.role,
            createdAt = user.createdAt
        )
    }
}

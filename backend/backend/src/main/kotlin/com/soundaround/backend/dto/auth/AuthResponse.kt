package com.soundaround.backend.dto.auth

data class AuthResponse(
    val token: String,
    val userId: Long,
    val username: String,
    val email: String,
    val role: String
)

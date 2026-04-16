package com.soundaround.backend.dto.auth

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size

data class RegisterRequest(
    @field:NotBlank @field:Size(min = 3, max = 50)
    val username: String,

    @field:NotBlank @field:Email
    val email: String,

    @field:NotBlank
    @field:Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#\$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?]).{8,}$",
        message = "Password must be at least 8 characters and include uppercase, lowercase, digit, and special character"
    )
    val password: String,

    val lastfmUsername: String? = null
)

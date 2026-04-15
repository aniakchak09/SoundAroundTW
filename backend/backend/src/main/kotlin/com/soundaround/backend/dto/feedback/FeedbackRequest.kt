package com.soundaround.backend.dto.feedback

import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

data class FeedbackRequest(
    @field:NotBlank
    val category: String,

    @field:NotNull @field:Min(1) @field:Max(5)
    val rating: Int,

    val subscribeToUpdates: Boolean = false,

    @field:NotBlank
    val message: String
)

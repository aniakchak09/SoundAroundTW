package com.soundaround.backend.dto.feedback

import com.soundaround.backend.entity.Feedback
import java.time.LocalDateTime

data class FeedbackResponse(
    val id: Long,
    val userId: Long,
    val category: String,
    val rating: Int,
    val subscribeToUpdates: Boolean,
    val message: String,
    val createdAt: LocalDateTime
) {
    companion object {
        fun from(feedback: Feedback) = FeedbackResponse(
            id = feedback.id,
            userId = feedback.user.id,
            category = feedback.category,
            rating = feedback.rating,
            subscribeToUpdates = feedback.subscribeToUpdates,
            message = feedback.message,
            createdAt = feedback.createdAt
        )
    }
}

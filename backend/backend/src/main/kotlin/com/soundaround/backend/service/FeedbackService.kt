package com.soundaround.backend.service

import com.soundaround.backend.dto.feedback.FeedbackRequest
import com.soundaround.backend.dto.feedback.FeedbackResponse
import com.soundaround.backend.entity.Feedback
import com.soundaround.backend.exception.ResourceNotFoundException
import com.soundaround.backend.repository.FeedbackRepository
import com.soundaround.backend.repository.UserRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class FeedbackService(
    private val feedbackRepository: FeedbackRepository,
    private val userRepository: UserRepository
) {
    fun getAll(pageable: Pageable): Page<FeedbackResponse> =
        feedbackRepository.findAll(pageable).map { FeedbackResponse.from(it) }

    fun getByUser(userId: Long, pageable: Pageable): Page<FeedbackResponse> =
        feedbackRepository.findByUserId(userId, pageable).map { FeedbackResponse.from(it) }

    @Transactional
    fun submit(userId: Long, request: FeedbackRequest): FeedbackResponse {
        val user = userRepository.findById(userId)
            .orElseThrow { ResourceNotFoundException("User $userId not found") }
        val feedback = Feedback(
            user = user,
            category = request.category,
            rating = request.rating,
            subscribeToUpdates = request.subscribeToUpdates,
            message = request.message
        )
        return FeedbackResponse.from(feedbackRepository.save(feedback))
    }

    @Transactional
    fun delete(id: Long) {
        if (!feedbackRepository.existsById(id)) throw ResourceNotFoundException("Feedback $id not found")
        feedbackRepository.deleteById(id)
    }
}

package com.soundaround.backend.controller

import com.soundaround.backend.dto.feedback.FeedbackRequest
import com.soundaround.backend.dto.feedback.FeedbackResponse
import com.soundaround.backend.service.FeedbackService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/feedback")
@Tag(name = "Feedback")
@SecurityRequirement(name = "bearerAuth")
class FeedbackController(private val feedbackService: FeedbackService) {

    @GetMapping
    @Operation(summary = "Get all feedback entries (admin)")
    fun getAll(pageable: Pageable): Page<FeedbackResponse> = feedbackService.getAll(pageable)

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get feedback submitted by a user")
    fun getByUser(@PathVariable userId: Long, pageable: Pageable): Page<FeedbackResponse> =
        feedbackService.getByUser(userId, pageable)

    @PostMapping("/user/{userId}")
    @Operation(summary = "Submit feedback")
    fun submit(
        @PathVariable userId: Long,
        @Valid @RequestBody request: FeedbackRequest
    ): ResponseEntity<FeedbackResponse> =
        ResponseEntity.status(HttpStatus.CREATED).body(feedbackService.submit(userId, request))

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete feedback entry")
    fun delete(@PathVariable id: Long): ResponseEntity<Void> {
        feedbackService.delete(id)
        return ResponseEntity.noContent().build()
    }
}

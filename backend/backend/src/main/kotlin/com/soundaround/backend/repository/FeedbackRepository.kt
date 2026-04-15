package com.soundaround.backend.repository

import com.soundaround.backend.entity.Feedback
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository

interface FeedbackRepository : JpaRepository<Feedback, Long> {
    fun findByUserId(userId: Long, pageable: Pageable): Page<Feedback>
}

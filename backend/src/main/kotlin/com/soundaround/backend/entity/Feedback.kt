package com.soundaround.backend.entity

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "feedback")
class Feedback(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    var user: User,

    @Column(nullable = false, length = 50)
    var category: String,

    @Column(nullable = false)
    var rating: Int,

    @Column(name = "subscribe_to_updates", nullable = false)
    var subscribeToUpdates: Boolean = false,

    @Column(nullable = false, columnDefinition = "TEXT")
    var message: String,

    @Column(name = "created_at", nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now()
)

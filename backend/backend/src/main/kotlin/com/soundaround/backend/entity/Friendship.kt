package com.soundaround.backend.entity

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "friendship")
class Friendship(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_id", nullable = false)
    var requester: User,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "addressee_id", nullable = false)
    var addressee: User,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    var status: FriendshipStatus = FriendshipStatus.PENDING,

    @Column(name = "match_score")
    var matchScore: Int? = null,

    @Column(name = "created_at", nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now()
)

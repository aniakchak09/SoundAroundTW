package com.soundaround.backend.entity

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "location")
class Location(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    var user: User,

    @Column(nullable = false)
    var lat: Double,

    @Column(nullable = false)
    var lng: Double,

    @Column(name = "last_seen", nullable = false)
    var lastSeen: LocalDateTime = LocalDateTime.now()
)

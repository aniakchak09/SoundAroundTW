package com.soundaround.backend.entity

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "users")
class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(unique = true, nullable = false, length = 50)
    var username: String,

    @Column(unique = true, nullable = false, length = 100)
    var email: String,

    @Column(nullable = false)
    var password: String,

    @Column(name = "lastfm_username", length = 50)
    var lastfmUsername: String? = null,

    @Column(name = "avatar_url", length = 500)
    var avatarUrl: String? = null,

    @Enumerated(EnumType.STRING)
    @Column(name = "privacy_mode", nullable = false, length = 20)
    var privacyMode: PrivacyMode = PrivacyMode.PUBLIC,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    var role: Role = Role.USER,

    @Column(name = "created_at", nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @OneToOne(mappedBy = "user", cascade = [CascadeType.ALL], fetch = FetchType.LAZY, orphanRemoval = true)
    var location: Location? = null,

    @OneToOne(mappedBy = "user", cascade = [CascadeType.ALL], fetch = FetchType.LAZY, orphanRemoval = true)
    var musicSnapshot: MusicSnapshot? = null,

    @OneToMany(mappedBy = "requester", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    var sentFriendships: MutableList<Friendship> = mutableListOf(),

    @OneToMany(mappedBy = "addressee", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    var receivedFriendships: MutableList<Friendship> = mutableListOf(),

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "user_tracks",
        joinColumns = [JoinColumn(name = "user_id")],
        inverseJoinColumns = [JoinColumn(name = "track_id")]
    )
    var tracks: MutableList<Track> = mutableListOf(),

    @OneToMany(mappedBy = "user", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    var feedbacks: MutableList<Feedback> = mutableListOf()
)

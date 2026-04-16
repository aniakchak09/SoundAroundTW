package com.soundaround.backend.entity

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "music_snapshot")
class MusicSnapshot(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    var user: User,

    @Column(name = "track_name", length = 255)
    var trackName: String? = null,

    @Column(name = "artist_name", length = 255)
    var artistName: String? = null,

    @Column(name = "album_art", length = 500)
    var albumArt: String? = null,

    @Column(name = "preview_url", length = 500)
    var previewUrl: String? = null,

    @Column(name = "is_playing", nullable = false)
    var isPlaying: Boolean = false,

    @Column(name = "synced_at", nullable = false)
    var syncedAt: LocalDateTime = LocalDateTime.now()
)

package com.soundaround.backend.entity

import jakarta.persistence.*

@Entity
@Table(name = "track")
class Track(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false, length = 255)
    var title: String,

    @Column(nullable = false, length = 255)
    var artist: String,

    @Column(length = 255)
    var album: String? = null,

    @Column(name = "preview_url", length = 500)
    var previewUrl: String? = null,

    @Column(name = "lastfm_url", length = 500)
    var lastfmUrl: String? = null,

    @ManyToMany(mappedBy = "tracks", fetch = FetchType.LAZY)
    var listeners: MutableList<User> = mutableListOf()
)

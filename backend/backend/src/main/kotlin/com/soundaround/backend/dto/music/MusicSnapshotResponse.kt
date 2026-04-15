package com.soundaround.backend.dto.music

import com.soundaround.backend.entity.MusicSnapshot
import java.time.LocalDateTime

data class MusicSnapshotResponse(
    val id: Long,
    val userId: Long,
    val trackName: String?,
    val artistName: String?,
    val albumArt: String?,
    val previewUrl: String?,
    val isPlaying: Boolean,
    val syncedAt: LocalDateTime
) {
    companion object {
        fun from(snapshot: MusicSnapshot) = MusicSnapshotResponse(
            id = snapshot.id,
            userId = snapshot.user.id,
            trackName = snapshot.trackName,
            artistName = snapshot.artistName,
            albumArt = snapshot.albumArt,
            previewUrl = snapshot.previewUrl,
            isPlaying = snapshot.isPlaying,
            syncedAt = snapshot.syncedAt
        )
    }
}

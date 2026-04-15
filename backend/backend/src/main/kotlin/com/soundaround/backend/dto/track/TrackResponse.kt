package com.soundaround.backend.dto.track

import com.soundaround.backend.entity.Track

data class TrackResponse(
    val id: Long,
    val title: String,
    val artist: String,
    val album: String?,
    val previewUrl: String?,
    val lastfmUrl: String?
) {
    companion object {
        fun from(track: Track) = TrackResponse(
            id = track.id,
            title = track.title,
            artist = track.artist,
            album = track.album,
            previewUrl = track.previewUrl,
            lastfmUrl = track.lastfmUrl
        )
    }
}

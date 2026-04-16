package com.soundaround.backend.service

import com.soundaround.backend.dto.music.MusicSnapshotResponse
import com.soundaround.backend.dto.music.SyncSnapshotRequest
import com.soundaround.backend.entity.MusicSnapshot
import com.soundaround.backend.exception.ResourceNotFoundException
import com.soundaround.backend.repository.MusicSnapshotRepository
import com.soundaround.backend.repository.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class MusicSnapshotService(
    private val snapshotRepository: MusicSnapshotRepository,
    private val userRepository: UserRepository,
    private val lastFmService: LastFmService
) {
    fun getByUserId(userId: Long): MusicSnapshotResponse =
        snapshotRepository.findByUserId(userId).map { MusicSnapshotResponse.from(it) }
            .orElseThrow { ResourceNotFoundException("Music snapshot for user $userId not found") }

    @Transactional
    fun sync(userId: Long, request: SyncSnapshotRequest): MusicSnapshotResponse {
        val user = userRepository.findById(userId)
            .orElseThrow { ResourceNotFoundException("User $userId not found") }
        val nowPlaying = lastFmService.getNowPlaying(request.lastfmUsername)
        val snapshot = snapshotRepository.findByUserId(userId)
            .orElse(MusicSnapshot(user = user, isPlaying = false))
        if (nowPlaying != null) {
            snapshot.trackName = nowPlaying.trackName
            snapshot.artistName = nowPlaying.artistName
            snapshot.albumArt = nowPlaying.albumArt
            snapshot.isPlaying = true
        } else {
            snapshot.isPlaying = false
            // keep existing trackName/artistName/albumArt as last listened
        }
        snapshot.syncedAt = LocalDateTime.now()
        return MusicSnapshotResponse.from(snapshotRepository.save(snapshot))
    }
}

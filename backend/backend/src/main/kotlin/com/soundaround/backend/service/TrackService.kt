package com.soundaround.backend.service

import com.soundaround.backend.dto.track.TrackRequest
import com.soundaround.backend.dto.track.TrackResponse
import com.soundaround.backend.entity.Track
import com.soundaround.backend.exception.ResourceNotFoundException
import com.soundaround.backend.repository.TrackRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class TrackService(private val trackRepository: TrackRepository) {

    fun getAll(pageable: Pageable): Page<TrackResponse> =
        trackRepository.findAll(pageable).map { TrackResponse.from(it) }

    fun getById(id: Long): TrackResponse =
        trackRepository.findById(id).map { TrackResponse.from(it) }
            .orElseThrow { ResourceNotFoundException("Track $id not found") }

    fun search(query: String, pageable: Pageable): Page<TrackResponse> =
        trackRepository.searchTracks(query, pageable).map { TrackResponse.from(it) }

    fun getByUser(userId: Long, pageable: Pageable): Page<TrackResponse> =
        trackRepository.findByListenerId(userId, pageable).map { TrackResponse.from(it) }

    @Transactional
    fun create(request: TrackRequest): TrackResponse {
        val track = Track(
            title = request.title,
            artist = request.artist,
            album = request.album,
            previewUrl = request.previewUrl,
            lastfmUrl = request.lastfmUrl
        )
        return TrackResponse.from(trackRepository.save(track))
    }

    @Transactional
    fun update(id: Long, request: TrackRequest): TrackResponse {
        val track = trackRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Track $id not found") }
        track.title = request.title
        track.artist = request.artist
        track.album = request.album
        track.previewUrl = request.previewUrl
        track.lastfmUrl = request.lastfmUrl
        return TrackResponse.from(trackRepository.save(track))
    }

    @Transactional
    fun delete(id: Long) {
        if (!trackRepository.existsById(id)) throw ResourceNotFoundException("Track $id not found")
        trackRepository.deleteById(id)
    }
}

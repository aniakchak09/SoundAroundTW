package com.soundaround.backend.repository

import com.soundaround.backend.entity.Track
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.util.Optional

interface TrackRepository : JpaRepository<Track, Long> {
    fun findByTitleAndArtist(title: String, artist: String): Optional<Track>

    @Query("""
        SELECT t FROM Track t
        WHERE LOWER(t.title)  LIKE LOWER(CONCAT('%', :query, '%'))
           OR LOWER(t.artist) LIKE LOWER(CONCAT('%', :query, '%'))
    """)
    fun searchTracks(@Param("query") query: String, pageable: Pageable): Page<Track>

    @Query("SELECT t FROM Track t JOIN t.listeners u WHERE u.id = :userId")
    fun findByListenerId(@Param("userId") userId: Long, pageable: Pageable): Page<Track>
}

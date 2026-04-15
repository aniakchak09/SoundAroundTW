package com.soundaround.backend.repository

import com.soundaround.backend.entity.MusicSnapshot
import org.springframework.data.jpa.repository.JpaRepository
import java.util.Optional

interface MusicSnapshotRepository : JpaRepository<MusicSnapshot, Long> {
    fun findByUserId(userId: Long): Optional<MusicSnapshot>
}

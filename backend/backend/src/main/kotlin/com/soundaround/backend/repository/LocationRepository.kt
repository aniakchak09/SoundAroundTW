package com.soundaround.backend.repository

import com.soundaround.backend.entity.Location
import com.soundaround.backend.entity.PrivacyMode
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.util.Optional

interface LocationRepository : JpaRepository<Location, Long> {
    fun findByUserId(userId: Long): Optional<Location>

    @Query("SELECT l FROM Location l JOIN l.user u WHERE u.privacyMode <> com.soundaround.backend.entity.PrivacyMode.PRIVATE")
    fun findAllPublicLocations(): List<Location>
}

package com.soundaround.backend.dto.location

import com.soundaround.backend.entity.Location
import java.time.LocalDateTime

data class LocationResponse(
    val id: Long,
    val userId: Long,
    val lat: Double,
    val lng: Double,
    val lastSeen: LocalDateTime
) {
    companion object {
        fun from(location: Location) = LocationResponse(
            id = location.id,
            userId = location.user.id,
            lat = location.lat,
            lng = location.lng,
            lastSeen = location.lastSeen
        )
    }
}

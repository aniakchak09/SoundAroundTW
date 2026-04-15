package com.soundaround.backend.service

import com.soundaround.backend.dto.location.LocationResponse
import com.soundaround.backend.dto.location.UpdateLocationRequest
import com.soundaround.backend.entity.Location
import com.soundaround.backend.exception.ResourceNotFoundException
import com.soundaround.backend.repository.LocationRepository
import com.soundaround.backend.repository.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import kotlin.math.*

@Service
class LocationService(
    private val locationRepository: LocationRepository,
    private val userRepository: UserRepository
) {
    fun getByUserId(userId: Long): LocationResponse =
        locationRepository.findByUserId(userId).map { LocationResponse.from(it) }
            .orElseThrow { ResourceNotFoundException("Location for user $userId not found") }

    fun getNearby(lat: Double, lng: Double, radiusKm: Double): List<LocationResponse> =
        locationRepository.findAllPublicLocations()
            .filter { haversineKm(lat, lng, it.lat, it.lng) <= radiusKm }
            .map { LocationResponse.from(it) }

    @Transactional
    fun upsert(userId: Long, request: UpdateLocationRequest): LocationResponse {
        val user = userRepository.findById(userId)
            .orElseThrow { ResourceNotFoundException("User $userId not found") }
        val location = locationRepository.findByUserId(userId).orElse(Location(user = user, lat = 0.0, lng = 0.0))
        location.lat = request.lat
        location.lng = request.lng
        location.lastSeen = LocalDateTime.now()
        return LocationResponse.from(locationRepository.save(location))
    }

    @Transactional
    fun delete(userId: Long) {
        val location = locationRepository.findByUserId(userId)
            .orElseThrow { ResourceNotFoundException("Location for user $userId not found") }
        locationRepository.delete(location)
    }

    private fun haversineKm(lat1: Double, lon1: Double, lat2: Double, lon2: Double): Double {
        val r = 6371.0
        val dLat = Math.toRadians(lat2 - lat1)
        val dLon = Math.toRadians(lon2 - lon1)
        val a = sin(dLat / 2).pow(2) + cos(Math.toRadians(lat1)) * cos(Math.toRadians(lat2)) * sin(dLon / 2).pow(2)
        return r * 2 * atan2(sqrt(a), sqrt(1 - a))
    }
}

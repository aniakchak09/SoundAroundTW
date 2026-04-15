package com.soundaround.backend.controller

import com.soundaround.backend.dto.location.LocationResponse
import com.soundaround.backend.dto.location.UpdateLocationRequest
import com.soundaround.backend.service.LocationService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/locations")
@Tag(name = "Locations")
@SecurityRequirement(name = "bearerAuth")
class LocationController(private val locationService: LocationService) {

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get location for a user")
    fun getByUser(@PathVariable userId: Long): ResponseEntity<LocationResponse> =
        ResponseEntity.ok(locationService.getByUserId(userId))

    @GetMapping("/nearby")
    @Operation(summary = "Get public users within a radius (km, default 5)")
    fun getNearby(
        @RequestParam lat: Double,
        @RequestParam lng: Double,
        @RequestParam(defaultValue = "5.0") radiusKm: Double
    ): ResponseEntity<List<LocationResponse>> =
        ResponseEntity.ok(locationService.getNearby(lat, lng, radiusKm))

    @PutMapping("/user/{userId}")
    @Operation(summary = "Create or update location for a user")
    fun upsert(
        @PathVariable userId: Long,
        @Valid @RequestBody request: UpdateLocationRequest
    ): ResponseEntity<LocationResponse> =
        ResponseEntity.ok(locationService.upsert(userId, request))

    @DeleteMapping("/user/{userId}")
    @Operation(summary = "Remove location for a user")
    fun delete(@PathVariable userId: Long): ResponseEntity<Void> {
        locationService.delete(userId)
        return ResponseEntity.noContent().build()
    }
}

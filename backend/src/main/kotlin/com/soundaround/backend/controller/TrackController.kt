package com.soundaround.backend.controller

import com.soundaround.backend.dto.track.TrackRequest
import com.soundaround.backend.dto.track.TrackResponse
import com.soundaround.backend.service.TrackService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/tracks")
@Tag(name = "Tracks")
@SecurityRequirement(name = "bearerAuth")
class TrackController(private val trackService: TrackService) {

    @GetMapping
    @Operation(summary = "Get all tracks paginated")
    fun getAll(pageable: Pageable): Page<TrackResponse> = trackService.getAll(pageable)

    @GetMapping("/{id}")
    @Operation(summary = "Get track by ID")
    fun getById(@PathVariable id: Long): ResponseEntity<TrackResponse> =
        ResponseEntity.ok(trackService.getById(id))

    @GetMapping("/search")
    @Operation(summary = "Search tracks by title or artist")
    fun search(@RequestParam query: String, pageable: Pageable): Page<TrackResponse> =
        trackService.search(query, pageable)

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get tracks listened to by a specific user")
    fun getByUser(@PathVariable userId: Long, pageable: Pageable): Page<TrackResponse> =
        trackService.getByUser(userId, pageable)

    @PostMapping
    @Operation(summary = "Create a track")
    fun create(@Valid @RequestBody request: TrackRequest): ResponseEntity<TrackResponse> =
        ResponseEntity.status(HttpStatus.CREATED).body(trackService.create(request))

    @PutMapping("/{id}")
    @Operation(summary = "Update a track")
    fun update(
        @PathVariable id: Long,
        @Valid @RequestBody request: TrackRequest
    ): ResponseEntity<TrackResponse> =
        ResponseEntity.ok(trackService.update(id, request))

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a track")
    fun delete(@PathVariable id: Long): ResponseEntity<Void> {
        trackService.delete(id)
        return ResponseEntity.noContent().build()
    }
}

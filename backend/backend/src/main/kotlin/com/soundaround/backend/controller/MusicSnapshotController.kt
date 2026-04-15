package com.soundaround.backend.controller

import com.soundaround.backend.dto.music.MusicSnapshotResponse
import com.soundaround.backend.dto.music.SyncSnapshotRequest
import com.soundaround.backend.service.MusicSnapshotService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/music")
@Tag(name = "Music Snapshots")
@SecurityRequirement(name = "bearerAuth")
class MusicSnapshotController(private val snapshotService: MusicSnapshotService) {

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get current music snapshot for a user")
    fun getByUser(@PathVariable userId: Long): ResponseEntity<MusicSnapshotResponse> =
        ResponseEntity.ok(snapshotService.getByUserId(userId))

    @PostMapping("/user/{userId}/sync")
    @Operation(summary = "Sync now-playing track from Last.fm")
    fun sync(
        @PathVariable userId: Long,
        @Valid @RequestBody request: SyncSnapshotRequest
    ): ResponseEntity<MusicSnapshotResponse> =
        ResponseEntity.ok(snapshotService.sync(userId, request))
}

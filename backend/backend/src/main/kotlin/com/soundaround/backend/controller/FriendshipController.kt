package com.soundaround.backend.controller

import com.soundaround.backend.dto.friendship.FriendshipRequest
import com.soundaround.backend.dto.friendship.FriendshipResponse
import com.soundaround.backend.service.FriendshipService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/friendships")
@Tag(name = "Friendships")
@SecurityRequirement(name = "bearerAuth")
class FriendshipController(private val friendshipService: FriendshipService) {

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get accepted friends for a user")
    fun getFriends(@PathVariable userId: Long, pageable: Pageable): Page<FriendshipResponse> =
        friendshipService.getFriends(userId, pageable)

    @GetMapping("/user/{userId}/pending")
    @Operation(summary = "Get pending friend requests for a user")
    fun getPending(@PathVariable userId: Long, pageable: Pageable): Page<FriendshipResponse> =
        friendshipService.getPendingRequests(userId, pageable)

    @PostMapping("/user/{requesterId}")
    @Operation(summary = "Send a friend request")
    fun sendRequest(
        @PathVariable requesterId: Long,
        @RequestBody request: FriendshipRequest
    ): ResponseEntity<FriendshipResponse> =
        ResponseEntity.status(HttpStatus.CREATED).body(friendshipService.sendRequest(requesterId, request))

    @PutMapping("/{friendshipId}/accept")
    @Operation(summary = "Accept a friend request")
    fun accept(
        @PathVariable friendshipId: Long,
        @RequestParam userId: Long
    ): ResponseEntity<FriendshipResponse> =
        ResponseEntity.ok(friendshipService.accept(friendshipId, userId))

    @PutMapping("/{friendshipId}/block")
    @Operation(summary = "Block a user")
    fun block(
        @PathVariable friendshipId: Long,
        @RequestParam userId: Long
    ): ResponseEntity<FriendshipResponse> =
        ResponseEntity.ok(friendshipService.block(friendshipId, userId))

    @DeleteMapping("/{friendshipId}")
    @Operation(summary = "Remove a friendship")
    fun delete(
        @PathVariable friendshipId: Long,
        @RequestParam userId: Long
    ): ResponseEntity<Void> {
        friendshipService.delete(friendshipId, userId)
        return ResponseEntity.noContent().build()
    }
}

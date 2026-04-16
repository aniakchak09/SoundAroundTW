package com.soundaround.backend.controller

import com.soundaround.backend.dto.user.UpdateUserRequest
import com.soundaround.backend.dto.user.UserResponse
import com.soundaround.backend.service.UserService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/users")
@Tag(name = "Users")
@SecurityRequirement(name = "bearerAuth")
class UserController(private val userService: UserService) {

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all users paginated (admin only)")
    fun getAll(pageable: Pageable): Page<UserResponse> = userService.getAll(pageable)

    @GetMapping("/search")
    @Operation(summary = "Search users by username or email")
    fun search(@RequestParam query: String, pageable: Pageable): Page<UserResponse> =
        userService.search(query, pageable)

    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID")
    fun getById(@PathVariable id: Long): ResponseEntity<UserResponse> =
        ResponseEntity.ok(userService.getById(id))

    @PutMapping("/{id}")
    @Operation(summary = "Update user profile")
    fun update(
        @PathVariable id: Long,
        @Valid @RequestBody request: UpdateUserRequest
    ): ResponseEntity<UserResponse> =
        ResponseEntity.ok(userService.update(id, request))

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a user (admin only)")
    fun delete(@PathVariable id: Long): ResponseEntity<Void> {
        userService.delete(id)
        return ResponseEntity.noContent().build()
    }
}

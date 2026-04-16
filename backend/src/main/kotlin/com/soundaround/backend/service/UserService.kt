package com.soundaround.backend.service

import com.soundaround.backend.dto.user.UpdateUserRequest
import com.soundaround.backend.dto.user.UserResponse
import com.soundaround.backend.exception.ResourceNotFoundException
import com.soundaround.backend.repository.UserRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class UserService(private val userRepository: UserRepository) {

    fun getById(id: Long): UserResponse =
        userRepository.findById(id).map { UserResponse.from(it) }
            .orElseThrow { ResourceNotFoundException("User $id not found") }

    fun getAll(pageable: Pageable): Page<UserResponse> =
        userRepository.findAll(pageable).map { UserResponse.from(it) }

    fun search(query: String, pageable: Pageable): Page<UserResponse> =
        userRepository.searchUsers(query, pageable).map { UserResponse.from(it) }

    @Transactional
    fun update(id: Long, request: UpdateUserRequest): UserResponse {
        val user = userRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("User $id not found") }
        request.username?.let { user.username = it }
        request.lastfmUsername?.let { user.lastfmUsername = it }
        request.avatarUrl?.let { user.avatarUrl = it }
        request.privacyMode?.let { user.privacyMode = it }
        return UserResponse.from(userRepository.save(user))
    }

    @Transactional
    fun delete(id: Long) {
        if (!userRepository.existsById(id)) throw ResourceNotFoundException("User $id not found")
        userRepository.deleteById(id)
    }
}

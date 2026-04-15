package com.soundaround.backend.service

import com.soundaround.backend.dto.friendship.FriendshipRequest
import com.soundaround.backend.dto.friendship.FriendshipResponse
import com.soundaround.backend.entity.Friendship
import com.soundaround.backend.entity.FriendshipStatus
import com.soundaround.backend.exception.BadRequestException
import com.soundaround.backend.exception.ForbiddenException
import com.soundaround.backend.exception.ResourceNotFoundException
import com.soundaround.backend.repository.FriendshipRepository
import com.soundaround.backend.repository.UserRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class FriendshipService(
    private val friendshipRepository: FriendshipRepository,
    private val userRepository: UserRepository,
    private val emailService: EmailService
) {
    fun getFriends(userId: Long, pageable: Pageable): Page<FriendshipResponse> =
        friendshipRepository.findByUserIdAndStatus(userId, FriendshipStatus.ACCEPTED, pageable)
            .map { FriendshipResponse.from(it) }

    fun getPendingRequests(userId: Long, pageable: Pageable): Page<FriendshipResponse> =
        friendshipRepository.findPendingRequestsForUser(userId, pageable)
            .map { FriendshipResponse.from(it) }

    @Transactional
    fun sendRequest(requesterId: Long, request: FriendshipRequest): FriendshipResponse {
        if (requesterId == request.addresseeId)
            throw BadRequestException("Cannot send a friend request to yourself")
        val requester = userRepository.findById(requesterId)
            .orElseThrow { ResourceNotFoundException("User $requesterId not found") }
        val addressee = userRepository.findById(request.addresseeId)
            .orElseThrow { ResourceNotFoundException("User ${request.addresseeId} not found") }
        friendshipRepository.findBetweenUsers(requesterId, request.addresseeId).ifPresent {
            throw BadRequestException("Friendship already exists between these users")
        }
        return FriendshipResponse.from(
            friendshipRepository.save(Friendship(requester = requester, addressee = addressee))
        )
    }

    @Transactional
    fun accept(friendshipId: Long, userId: Long): FriendshipResponse {
        val friendship = friendshipRepository.findById(friendshipId)
            .orElseThrow { ResourceNotFoundException("Friendship $friendshipId not found") }
        if (friendship.addressee.id != userId)
            throw ForbiddenException("Only the addressee can accept this request")
        friendship.status = FriendshipStatus.ACCEPTED
        val saved = friendshipRepository.save(friendship)
        emailService.sendFriendRequestAccepted(
            friendship.requester.email,
            friendship.requester.username,
            friendship.addressee.username
        )
        return FriendshipResponse.from(saved)
    }

    @Transactional
    fun block(friendshipId: Long, userId: Long): FriendshipResponse {
        val friendship = friendshipRepository.findById(friendshipId)
            .orElseThrow { ResourceNotFoundException("Friendship $friendshipId not found") }
        if (friendship.requester.id != userId && friendship.addressee.id != userId)
            throw ForbiddenException("Not part of this friendship")
        friendship.status = FriendshipStatus.BLOCKED
        return FriendshipResponse.from(friendshipRepository.save(friendship))
    }

    @Transactional
    fun delete(friendshipId: Long, userId: Long) {
        val friendship = friendshipRepository.findById(friendshipId)
            .orElseThrow { ResourceNotFoundException("Friendship $friendshipId not found") }
        if (friendship.requester.id != userId && friendship.addressee.id != userId)
            throw ForbiddenException("Not part of this friendship")
        friendshipRepository.delete(friendship)
    }
}

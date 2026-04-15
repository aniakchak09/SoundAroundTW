package com.soundaround.backend.dto.friendship

import com.soundaround.backend.entity.Friendship
import com.soundaround.backend.entity.FriendshipStatus
import java.time.LocalDateTime

data class FriendshipResponse(
    val id: Long,
    val requesterId: Long,
    val requesterUsername: String,
    val addresseeId: Long,
    val addresseeUsername: String,
    val status: FriendshipStatus,
    val matchScore: Int?,
    val createdAt: LocalDateTime
) {
    companion object {
        fun from(friendship: Friendship) = FriendshipResponse(
            id = friendship.id,
            requesterId = friendship.requester.id,
            requesterUsername = friendship.requester.username,
            addresseeId = friendship.addressee.id,
            addresseeUsername = friendship.addressee.username,
            status = friendship.status,
            matchScore = friendship.matchScore,
            createdAt = friendship.createdAt
        )
    }
}

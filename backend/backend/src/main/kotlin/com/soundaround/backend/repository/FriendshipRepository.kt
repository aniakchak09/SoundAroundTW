package com.soundaround.backend.repository

import com.soundaround.backend.entity.Friendship
import com.soundaround.backend.entity.FriendshipStatus
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.util.Optional

interface FriendshipRepository : JpaRepository<Friendship, Long> {

    @Query("""
        SELECT f FROM Friendship f
        WHERE (f.requester.id = :userId OR f.addressee.id = :userId)
          AND f.status = :status
    """)
    fun findByUserIdAndStatus(
        @Param("userId") userId: Long,
        @Param("status") status: FriendshipStatus,
        pageable: Pageable
    ): Page<Friendship>

    @Query("""
        SELECT f FROM Friendship f
        WHERE (f.requester.id = :userId AND f.addressee.id = :otherId)
           OR (f.requester.id = :otherId AND f.addressee.id = :userId)
    """)
    fun findBetweenUsers(
        @Param("userId") userId: Long,
        @Param("otherId") otherId: Long
    ): Optional<Friendship>

    @Query("""
        SELECT f FROM Friendship f
        WHERE f.addressee.id = :userId
          AND f.status = com.soundaround.backend.entity.FriendshipStatus.PENDING
    """)
    fun findPendingRequestsForUser(@Param("userId") userId: Long, pageable: Pageable): Page<Friendship>
}

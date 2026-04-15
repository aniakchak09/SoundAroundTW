package com.soundaround.backend.security

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.io.Decoders
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Service
import java.util.Date
import javax.crypto.SecretKey

@Service
class JwtService(
    @Value("\${app.jwt.secret}") private val secret: String,
    @Value("\${app.jwt.expiration}") private val expirationMs: Long
) {
    private fun signingKey(): SecretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret))

    fun generateToken(userDetails: UserDetails): String = Jwts.builder()
        .subject(userDetails.username)
        .issuedAt(Date())
        .expiration(Date(System.currentTimeMillis() + expirationMs))
        .signWith(signingKey())
        .compact()

    fun extractUsername(token: String): String = extractClaim(token, Claims::getSubject)

    fun isTokenValid(token: String, userDetails: UserDetails): Boolean =
        extractUsername(token) == userDetails.username && !isExpired(token)

    private fun isExpired(token: String): Boolean =
        extractClaim(token, Claims::getExpiration).before(Date())

    private fun <T> extractClaim(token: String, resolver: (Claims) -> T): T =
        Jwts.parser().verifyWith(signingKey()).build()
            .parseSignedClaims(token).payload
            .let(resolver)
}

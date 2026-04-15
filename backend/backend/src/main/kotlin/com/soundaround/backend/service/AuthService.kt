package com.soundaround.backend.service

import com.soundaround.backend.dto.auth.AuthResponse
import com.soundaround.backend.dto.auth.LoginRequest
import com.soundaround.backend.dto.auth.RegisterRequest
import com.soundaround.backend.entity.User
import com.soundaround.backend.exception.DuplicateResourceException
import com.soundaround.backend.repository.UserRepository
import com.soundaround.backend.security.JwtService
import com.soundaround.backend.security.UserDetailsServiceImpl
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtService: JwtService,
    private val authenticationManager: AuthenticationManager,
    private val userDetailsService: UserDetailsServiceImpl,
    private val emailService: EmailService
) {
    @Transactional
    fun register(request: RegisterRequest): AuthResponse {
        if (userRepository.existsByEmail(request.email))
            throw DuplicateResourceException("Email already registered")
        if (userRepository.existsByUsername(request.username))
            throw DuplicateResourceException("Username already taken")

        val user = userRepository.save(
            User(
                username = request.username,
                email = request.email,
                password = passwordEncoder.encode(request.password),
                lastfmUsername = request.lastfmUsername
            )
        )
        emailService.sendWelcomeEmail(user.email, user.username)

        val token = jwtService.generateToken(userDetailsService.loadUserByUsername(user.email))
        return AuthResponse(token, user.id, user.username, user.email, user.role.name)
    }

    fun login(request: LoginRequest): AuthResponse {
        authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(request.email, request.password)
        )
        val user = userRepository.findByEmail(request.email).get()
        val token = jwtService.generateToken(userDetailsService.loadUserByUsername(user.email))
        return AuthResponse(token, user.id, user.username, user.email, user.role.name)
    }
}

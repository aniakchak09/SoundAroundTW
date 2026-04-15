package com.soundaround.backend.service

import org.slf4j.LoggerFactory
import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.stereotype.Service

@Service
class EmailService(private val mailSender: JavaMailSender) {

    private val log = LoggerFactory.getLogger(EmailService::class.java)

    fun sendWelcomeEmail(toEmail: String, username: String) {
        try {
            val msg = SimpleMailMessage()
            msg.setTo(toEmail)
            msg.subject = "Welcome to SoundAround!"
            msg.text = """
                Hi $username,

                Welcome to SoundAround! Connect your Last.fm account to start sharing your music with people nearby.

                The SoundAround Team
            """.trimIndent()
            mailSender.send(msg)
        } catch (ex: Exception) {
            log.warn("Could not send welcome email to {}: {}", toEmail, ex.message)
        }
    }

    fun sendFriendRequestAccepted(toEmail: String, toUsername: String, fromUsername: String) {
        try {
            val msg = SimpleMailMessage()
            msg.setTo(toEmail)
            msg.subject = "SoundAround – Friend request accepted!"
            msg.text = """
                Hi $toUsername,

                $fromUsername accepted your friend request on SoundAround!
                Start exploring music together.

                The SoundAround Team
            """.trimIndent()
            mailSender.send(msg)
        } catch (ex: Exception) {
            log.warn("Could not send friend-accepted email to {}: {}", toEmail, ex.message)
        }
    }
}

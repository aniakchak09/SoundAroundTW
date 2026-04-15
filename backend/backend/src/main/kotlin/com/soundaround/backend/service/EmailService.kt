package com.soundaround.backend.service

import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.stereotype.Service

@Service
class EmailService(private val mailSender: JavaMailSender) {

    fun sendWelcomeEmail(toEmail: String, username: String) {
        val msg = SimpleMailMessage()
        msg.setTo(toEmail)
        msg.subject = "Welcome to SoundAround!"
        msg.text = """
            Hi $username,

            Welcome to SoundAround! Connect your Last.fm account to start sharing your music with people nearby.

            The SoundAround Team
        """.trimIndent()
        mailSender.send(msg)
    }

    fun sendFriendRequestAccepted(toEmail: String, toUsername: String, fromUsername: String) {
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
    }
}

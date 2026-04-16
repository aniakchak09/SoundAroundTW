package com.soundaround.backend.service

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate

data class NowPlayingData(
    val trackName: String,
    val artistName: String,
    val albumArt: String?
)

@Service
class LastFmService(
    @Value("\${lastfm.api-key}") private val apiKey: String
) {
    private val restTemplate = RestTemplate()

    fun getNowPlaying(lastfmUsername: String): NowPlayingData? {
        return try {
            val url = "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=$lastfmUsername&api_key=$apiKey&format=json&limit=1"
            val response = restTemplate.getForObject(url, LastFmResponse::class.java)
            val track = response?.recenttracks?.track?.firstOrNull() ?: return null
            if (track.attr?.nowplaying != "true") return null
            NowPlayingData(
                trackName = track.name,
                artistName = track.artist.text,
                albumArt = track.image.lastOrNull()?.text?.takeIf { it.isNotBlank() }
            )
        } catch (e: Exception) {
            null
        }
    }
}

@JsonIgnoreProperties(ignoreUnknown = true)
data class LastFmResponse(val recenttracks: RecentTracks? = null)

@JsonIgnoreProperties(ignoreUnknown = true)
data class RecentTracks(val track: List<LastFmTrack>? = null)

@JsonIgnoreProperties(ignoreUnknown = true)
data class LastFmTrack(
    val name: String = "",
    val artist: LastFmArtist = LastFmArtist(),
    val image: List<LastFmImage> = emptyList(),
    @JsonProperty("@attr") val attr: LastFmAttr? = null
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class LastFmArtist(@JsonProperty("#text") val text: String = "")

@JsonIgnoreProperties(ignoreUnknown = true)
data class LastFmImage(
    @JsonProperty("#text") val text: String = "",
    val size: String = ""
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class LastFmAttr(val nowplaying: String = "false")

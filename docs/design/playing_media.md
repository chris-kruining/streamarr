# Playing media

This document will describe the application UX flow.

## Types of media & Expected behavior

- movie
  - actual movie -> show the video player and start/continue playing the movie
  - collection -> Show a picker for which movie to play (also allow play-all)
- audio/music
  - artist -> Show top songs, albums, and a play-all button
  - album -> Show songs in album and a play-all button
  - song -> Show audio player and start playing the song
- show/tv
  - series -> Show a picker for the seasons and include a play button that will start/continue the first non-completed episode
  - season -> Show a picker for the episodes and include a play button that will start/continue the first non-completed episode
  - episode -> Show the video player and start/continue the episode (include the skip to previous&next episode buttons)
- playlist -> play the selected entry according to the above listed definitions

## UX flow

```txt
WHEN type of media IS {
    audio -> {
        WHEN entry does not exist in lidarr {
            add entry to lidarr
        }

        WHEN queue record status IS {
            paused -> ???

            downloading -> {
                display estimated time remaining
                wait for download to complete
            }

            _ -> ???
        }

        play audio
    }

    show/tv -> {
        WHEN entry is not an episode {
            redirect to earliest non-completed episode
        }

        WHEN entry does not exist in sonarr {
            add entry to sonarr
        }

        WHEN queue record status IS {
            paused -> ???

            downloading -> {
                display estimated time remaining
                wait for download to complete
            }

            _ -> ???
        }

        play episode
    }

    movie -> {
        WHEN entry does not exist in radarr {
            add entry to radarr
        }

        WHEN queue record status IS {
            paused -> ???

            downloading -> {
                display estimated time remaining
                wait for download to complete
            }

            _ -> ???
        }

        play movie
    }
}
```

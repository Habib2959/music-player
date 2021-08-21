import axios from 'axios';
import React, { Component } from 'react';
import AudioControls from './AudioControls';
import { BaseUrl } from './BaseUrl';
import './playerUI.css'
import Seek from './Seek';



class PlayerUI extends Component {
    state = {
        songsData: [],
        currentSongIndex: 0,
        isPlaying: false,
        durationMinutes: 0,
        durationSeconds: 0,
        currentSecond: 0,
        currentMinute: 0,
        progressbar: 0
    }
    componentDidMount() {
        axios.get(BaseUrl + "songs")
            .then(response => {
                this.setState({
                    songsData: response.data
                })
            }).catch(error => console.log(error.message))
    }

    play = () => {
        let audio = document.querySelector('#audio');
        let playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // Automatic playback started!
                // Show playing UI.
                audio.play();
            })
                .catch(error => {
                    console.log(error)
                });
        }
    }

    pause = () => {
        let audio = document.querySelector('#audio');
        audio.pause()
    }

    nextSong = () => {
        this.setState({
            currentSongIndex: (this.state.currentSongIndex === this.state.songsData.length - 1 ? 0 : this.state.currentSongIndex + 1)
        })
    }
    prevSong = () => {
        let audio = document.querySelector('#audio');
        if (this.state.currentSongIndex === 0) {
            audio.load();
        } else {
            this.setState({
                currentSongIndex: (this.state.currentSongIndex - 1)
            })
        }

    }
    togglePlayAndPause = playOrPause => {
        this.setState({
            isPlaying: playOrPause
        })
    }

    timeUpdate = event => {
        let audio = document.querySelector('#audio');
        let currentTimeInMinutes = Math.floor(event.nativeEvent.srcElement.currentTime / 60);
        let currentTimeInSeconds = Math.floor(event.nativeEvent.srcElement.currentTime % 60);
        let seekUpdate = Math.floor(event.nativeEvent.srcElement.currentTime * 100 / audio.duration);
        this.setState({
            currentSecond: currentTimeInSeconds,
            currentMinute: currentTimeInMinutes,
            progressbar: seekUpdate
        })

    }
    duration = () => {
        let audio = document.querySelector('#audio');
        let durationInMinutes = Math.floor(audio.duration / 60);
        let durationReaminingSeconds = Math.floor(audio.duration % 60);
        this.setState({
            durationMinutes: durationInMinutes,
            durationSeconds: durationReaminingSeconds
        })
    }

    seekUpdate = event => {
        let audio = document.querySelector('#audio');
        let progressPercentage = (event.nativeEvent.offsetX / event.nativeEvent.srcElement.clientWidth);
        let UpdatedDuration = (audio.duration) * progressPercentage;
        audio.currentTime = UpdatedDuration;
    }
    autoplay = () => {
        let audio = document.querySelector('#audio');
        let playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // Automatic playback started!
                // Show playing UI.
                this.nextSong();
            })
                .catch(error => {
                    console.log(error)
                });
        }

    }

    componentDidUpdate() {
        if (this.state.isPlaying) {
            this.play()
        } else {
            this.pause()
        }
    }

    render() {

        const { currentSongIndex, isPlaying, durationMinutes, durationSeconds, currentSecond, currentMinute, progressbar } = this.state;
        let audio = null;
        let title = '';
        let author = '';
        if (this.state.songsData.length !== 0) {
            audio = <audio id="audio" src={BaseUrl + this.state.songsData[currentSongIndex].song} onTimeUpdate={(event) => this.timeUpdate(event)} onLoadedData={this.duration} onEnded={this.autoplay} />
            title = this.state.songsData[currentSongIndex].title;
            author = this.state.songsData[currentSongIndex].author;
        }
        return (
            <div>
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="titles">
                                    <h2>{title}</h2>
                                    <p>{`Author: ${author}`}</p>
                                </div>
                                <div className="time-duration">
                                    <span>{currentMinute < 10 ? `0${currentMinute}` : currentMinute}:{currentSecond < 10 ? `0${currentSecond}` : currentSecond}</span>
                                    <span>{durationMinutes < 10 ? `0${durationMinutes}` : durationMinutes}:{durationSeconds < 10 ? `0${durationSeconds}` : durationSeconds}</span>
                                </div>
                                <div className="audio">
                                    {audio}
                                </div>
                                <Seek seekUpdate={this.seekUpdate}
                                    progressWidth={progressbar} />
                                <AudioControls isPlaying={isPlaying}
                                    togglePlayAndPause={this.togglePlayAndPause}
                                    nextSong={this.nextSong}
                                    prevSong={this.prevSong} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PlayerUI;
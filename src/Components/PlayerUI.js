import axios from 'axios';
import React, { Component } from 'react';
import AudioControls from './AudioControls';
import './playerUI.css';
import SideBar from './SideBar';




class PlayerUI extends Component {
    state = {
        songsData: [],
        currentSongIndex: 0,
        isPlaying: false,
        durationMinutes: 0,
        durationSeconds: 0,
        currentSecond: 0,
        currentMinute: 0,
        progressbar: 0,
        sideBarClicked: false
    }
    componentDidMount() {
        axios.get("https://music-player-dev-990b7-default-rtdb.firebaseio.com/songs.json")
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
            durationSeconds: durationReaminingSeconds,
            isPlaying: (this.state.sideBarClicked? true : false)
        })

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
    handleSeek = (e) => {
        let audio = document.querySelector('#audio');
        let progressPercentage = Number(e.target.value)/100;
        let UpdatedDuration = (audio.duration) * progressPercentage;
        audio.currentTime = UpdatedDuration;
    }

    SideBarSongUpdate = clickedSongIndex => {
        this.setState({
            currentSongIndex : clickedSongIndex,
            currentSecond:0,
            currentMinute:0,
            sideBarClicked: true
        })
        
    }

    componentDidUpdate() {
        if (this.state.isPlaying) {
            this.play()
        } else {
            this.pause()
        }
    }

    render() {
        const { currentSongIndex, isPlaying, durationMinutes, durationSeconds, currentSecond, currentMinute, progressbar, songsData } = this.state;
        document.title = songsData.length < 1 ? "Music player" : `Now playing || ${songsData[currentSongIndex].title}`;
        let audio = null;
        let title = '';
        let author = '';
        if (songsData.length !== 0) {
            audio = <audio id="audio" src={songsData[currentSongIndex].song} onTimeUpdate={(event) => this.timeUpdate(event)} onLoadedData={this.duration} onEnded={this.autoplay} />
            title = songsData[currentSongIndex].title;
            author = songsData[currentSongIndex].author;
        }
        return (
            <div>
                <div className="container-fluid">
                    <div className="row flex-md-row flex-column-reverse">
                        <div className="col-md-6">
                            <SideBar songsData ={songsData} 
                            currentSongIndex={currentSongIndex}
                            isPlaying={isPlaying} 
                            togglePlayAndPause={this.togglePlayAndPause}
                            SideBarSongUpdate={this.SideBarSongUpdate}/>
                        </div>
                        <div className="col-md-6 d-flex justify-content-center align-items-center">
                            <div className="card">
                                <div className="titles">
                                    <h2>{title}</h2>
                                    <p>{`Author: ${author}`}</p>
                                </div>
                                <div className="time-duration">
                                    <span>{currentMinute < 10 ? `0${currentMinute}` : currentMinute}:{currentSecond < 10 ? `0${currentSecond}` : currentSecond}</span>
                                    <span>{durationMinutes < 10 ? `0${durationMinutes}` : durationMinutes}:{durationSeconds < 10 ? `0${durationSeconds}` : durationSeconds}</span>
                                </div>
                                <div className="audio" >
                                    {audio}
                                </div>
                                <input type="range" value={Number.isNaN(progressbar)? "0": String(progressbar) } min="0" max="100" onInput={this.handleSeek} className="slider"/>
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
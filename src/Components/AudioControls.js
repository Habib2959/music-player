import React from 'react';


const AudioControls = props => {
    return (
        <>
            <div className="controls">
                <i className="fa fa-backward" onClick={props.prevSong}></i>
                {props.isPlaying === false? <i className="fa fa-play-circle" onClick={()=>props.togglePlayAndPause(!props.isPlaying)}></i> : <i className="fa fa-pause-circle" onClick={()=>props.togglePlayAndPause(!props.isPlaying)}></i>}
                <i className="fa fa fa-forward" onClick={()=>props.nextSong()}></i>
            </div>
        </>
    )
}

export default AudioControls;
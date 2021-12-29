import React from 'react';


const AudioControls = props => {
    return (
        <>
            <div className="controls">
                <i className="fa fa-backward custom-icon" onClick={props.prevSong}></i>
                {props.isPlaying === false? <i className="fa fa-play-circle custom-icon" onClick={()=>props.togglePlayAndPause(!props.isPlaying)}></i> : <i className="fa fa-pause-circle custom-icon" onClick={()=>props.togglePlayAndPause(!props.isPlaying)}></i>}
                <i className="fa fa fa-forward custom-icon" onClick={()=>props.nextSong()}></i>
            </div>
        </>
    )
}

export default AudioControls;
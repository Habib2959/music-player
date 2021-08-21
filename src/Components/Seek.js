import React from 'react';

const Seek = props => {
    return (
        <>
            <div className="seek-main" onClick={(event)=>props.seekUpdate(event)}>
                <div className="seek-innner" style={{width: `${props.progressWidth}%`}}></div>
            </div>
        </>
    )
}

export default Seek;
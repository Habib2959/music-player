import React from 'react';


const SideBar = props => {
    let playOrPauseButton = (props.isPlaying === false ? <i className="fa fa-play-circle" onClick={() => props.togglePlayAndPause(!props.isPlaying)}></i> : <i className="fa fa-pause-circle" onClick={() => props.togglePlayAndPause(!props.isPlaying)}></i>);
    return (
        <>
            <ul className="list-group justify-content-center mx-auto" style={{ overflowY: "auto", height: "100vh", width: "400px" }}>
                {
                    props.songsData.map((songs, index) => {
                        return (
                            <li className={props.currentSongIndex === index ? "list-group-item active d-flex justify-content-between" : "list-group-item cursor-pointer"} key={Math.random()} onClick={()=>props.SideBarSongUpdate(index)}>
                                <div>
                                    <h3 className="fs-4 fst-italic">{songs.title}</h3>
                                    <p>{songs.author}</p>
                                </div>
                                <div>
                                    {
                                        props.currentSongIndex === index ? playOrPauseButton : <div></div>
                                    }
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
        </>
    )
}

export default SideBar;
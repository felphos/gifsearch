import React, {useState} from 'react';

function Gif(props) {
  const [loaded, setLoaded] = useState(false);
  return (
    <video
      className={`grid-item video ${loaded && 'loaded'}`}
      autoPlay
      loop
      src={props.images.original.mp4}
      onLoadedData={() => setLoaded(true)}
    />
  );
}

export default Gif;

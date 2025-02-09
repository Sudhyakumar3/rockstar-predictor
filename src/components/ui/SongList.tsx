import React from "react";

interface Song {
  title: string;
  artist: string;
  popularity: number;
  peak_position: number;
  weeks_on_chart: number;
  image_url: string;
}

interface SongListProps {
  songs: Song[];
}

const SongList: React.FC<SongListProps> = ({ songs }) => {
  return (
    <div>
      {songs.length > 0 ? (
        <ul>
          {songs.map((song, index) => (
            <li key={index}>
              <h3>{song.title} by {song.artist}</h3>
              <p>Popularity: {song.popularity}</p>
              <p>Peak Position: {song.peak_position}</p>
              <p>Weeks on Chart: {song.weeks_on_chart}</p>
              {song.image_url && <img src={song.image_url} alt={song.title} />}
            </li>
          ))}
        </ul>
      ) : (
        <p>No songs available for the selected month/year.</p>
      )}
    </div>
  );
};

export default SongList;

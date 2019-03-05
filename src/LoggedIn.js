import React, { Component } from 'react';
import './style.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Table, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

class LoggedIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      songUrl: null,
      selectedSongIndex: null,
      songs: null
    }

    this.selectSong = this.selectSong.bind(this);
  }

  componentDidMount() {
    fetch('http://52.5.208.6:3000')
      .then(res => {
        return res.json();
      })
      .then(jsonData => {
        this.setState({ songs: jsonData, isLoaded: true });
      })
      .catch(err => {
        alert(err);
      });
  }

  selectSong(event, index) {
    event.preventDefault();
    const { songs } = this.state;
    const selectedSong = songs[index];

    const params = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: `${selectedSong.genre}/${selectedSong.artist}/${selectedSong.album}/${selectedSong.song}`
      })
    };

    fetch('http://52.5.208.6:3000', params)
      .then(res => res.json())
      .then(res => {
        this.setState({ songUrl: res.url, selectedSongIndex: index }, () => {
          this.refs.audio.pause();
          this.refs.audio.load();
          this.refs.audio.play();
        });
      })
      .catch(err => {
        alert(err);
      });
  }

  renderList() {
    const { songs, selectedSongIndex } = this.state;
    const selectSong = this.selectSong;
    return (
      <tbody>
        {songs.map((s, index) => {
          return (
            <tr key={index}>
              <td>{songs[index].genre}</td>
              <td>{songs[index].artist}</td>
              <td>{songs[index].album}</td>
              <td>{songs[index].song}</td>
              <td><Button variant={selectedSongIndex === index ? "info" : "outline-info"} onClick={(event) => selectSong(event, index)}><FontAwesomeIcon icon={faPlay} /></Button></td>
            </tr>
          )
        })}
      </tbody>
    );
  };

  renderAudio() {
    const { songUrl } = this.state;
    return (
      <audio controls autoPlay ref="audio">
        <source src={songUrl} type="audio/mp4"></source>
        Your browser does not support the audio element.
      </audio>
    );
  }

  render() {
    const { songUrl } = this.state;
    return (
      <div>
        { songUrl ? this.renderAudio() : null }
      <div>
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>Genre</th>
              <th>Artist</th>
              <th>Album</th>
              <th>Song</th>
              <th>Play That Funky Moosic</th>
            </tr>
          </thead>
          { this.state.isLoaded ? this.renderList() : null }
        </Table>
      </div>
      </div>
    );
  }
}

export default LoggedIn;

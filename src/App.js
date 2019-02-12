import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Table, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import get from 'lodash/get';

class App extends Component {
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
    var songKey = get(selectedSong, 'artist') ? `${selectedSong.artist}/` : '';
    songKey += get(selectedSong, 'album') ? `${selectedSong.album}/` : '';
    songKey += get(selectedSong, 'song') ? selectedSong.song : '';

    const params = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: songKey
      })
    };

    fetch('http://52.5.208.6:3000', params)
      .then(res => res.json())
      .then(res => {
        this.setState({ songUrl: res.url, selectedSongIndex: index });
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
      <audio controls autoPlay>
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

export default App;

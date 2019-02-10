import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Table, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      isSongSelected: false,
      selectedSongIndex: null,
      songs: null
    }

    this.selectSong = this.selectSong.bind(this);
  }

  componentDidMount() {
    fetch('http://3.88.74.36:3000')
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
    this.setState({ selectedSongIndex: index, isSongSelected: true });
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
    const { songs, selectedSongIndex } = this.state;
    const selectedSong = songs[selectedSongIndex];
    var songPath = _.get(selectedSong, 'artist') ? `${selectedSong.artist}/` : '';
    songPath += _.get(selectedSong, 'album') ? `${selectedSong.album}/` : '';
    songPath += _.get(selectedSong, 'song') ? selectedSong.song : '';
    const s3Path = `https://s3.amazonaws.com/bucket-o-dub-dub-dub/${songPath}`;
    return (
      <div>
        <audio controls>
          <source src={s3Path} type="audio/mp4"></source>
          Your browser does not support the audio element.
        </audio>
      </div>
    );
  }

  render() {
    return (
      <div>
      { this.state.isSongSelected ? this.renderAudio() : null }
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

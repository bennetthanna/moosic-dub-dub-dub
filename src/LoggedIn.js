import React, { Component } from 'react';
import './style.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Table, Button, Breadcrumb } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import firebase from './firebase.js';
import _ from 'lodash';

class LoggedIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      songUrl: null,
      selectedSongIndex: null,
      selectedGenre: null,
      songs: null,
      genres: null,
      artists: null,
      albums: null,
      selectedBreadcrumb: 'genres'
    }

    this.selectSong = this.selectSong.bind(this);
    this.selectGenre = this.selectGenre.bind(this);
    this.logOut = this.logOut.bind(this);
    this.selectedBreadcrumb = this.selectedBreadcrumb.bind(this);
    this.renderData = this.renderData.bind(this);
  }

  componentDidMount() {
    const user = firebase.auth().currentUser;

    const params = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: user.displayName,
        email: user.email,
        id: user.uid
      })
    };

    fetch('http://localhost:3000/save-user', params)
      .then(res => res.json())
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        alert(err);
      });

    fetch('http://localhost:3000/genres')
      .then(res => {
        return res.json();
      })
      .then(jsonData => {
        this.setState({ genres: jsonData, isLoaded: true });
      })
      .catch(err => {
        alert(err);
      });
  }

  logOut(event) {
    const logOut = this.props.logOut;
    event.preventDefault();
    firebase.auth().signOut()
      .then(user => {
        logOut();
      })
      .catch(error => {
        alert(`ERROR: ${error}`);
      });
  }

  selectSong(event, index) {
    event.preventDefault();
    const { songs } = this.state;
    const selectedSong = songs[index];

    fetch(`http://localhost:3000/song?song=${selectedSong.song}`)
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

  selectGenre(event, index) {
    event.preventDefault();
    const { genres } = this.state;
    const selectedGenre = genres[index];

    fetch(`http://localhost:3000/artists/for/genre?genre=${selectedGenre}`)
      .then(res => res.json())
      .then(res => {
        this.setState({ artists: res, selectedGenre: genres[index] });
        console.log(this.state);
      })
      .catch(err => {
        alert(err);
      });
  }

  selectBreadcrumb(event, breadcrumb) {
    event.preventDefault();
    this.setState({ selectedBreadcrumb: breadcrumb });
  }

  renderData() {
    switch(this.state.selectedBreadcrumb) {
      case('genres'):
        return this.renderGenres();
      case('artists'):
        break;
      case('albums'):
        break;
      case('songs'):
        break;
      default:
        return this.renderGenres();
    }
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

  renderGenres() {
    const { genres } = this.state;
    const selectGenre = this.selectGenre;

    return (
      <Table striped bordered hover variant="dark">
        <tbody>
          {genres.map((genre, index) => {
          return (
            <tr key={index}>
              <td><Button variant="info" onClick={(event) => selectGenre(event, index)}>{genre}</Button></td>
            </tr>
          )
          })}
        </tbody>
      </Table>
      );
  };

  renderBreadcrumbs() {
    const { genres, artists, albums, songs } = this.state;
    const selectBreadcrumb = this.selectBreadcrumb;

    return (
      <Breadcrumb>
        { genres ? <Breadcrumb.Item onClick={(event) => selectBreadcrumb(event, 'genres')}>Genres</Breadcrumb.Item> : null }
        { artists ? <Breadcrumb.Item onClick={(event) => selectBreadcrumb(event, 'artists')}>Artists</Breadcrumb.Item> : null }
        { albums ? <Breadcrumb.Item onClick={(event) => selectBreadcrumb(event, 'albums')}>Albums</Breadcrumb.Item> : null }
        { songs ? <Breadcrumb.Item>Songs</Breadcrumb.Item> : null }
      </Breadcrumb>
    )
  }

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
    const { songUrl, genres, artists, albums, songs } = this.state;
    return (
      <div>
        { songUrl ? this.renderAudio() : null }
        { this.state.isLoaded ? this.renderBreadcrumbs() : null }
        { this.state.isLoaded ? this.renderData() : null }
      </div>
    );
  }
}

export default LoggedIn;

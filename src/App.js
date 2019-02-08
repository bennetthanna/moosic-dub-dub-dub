import React, { Component } from 'react';
import './App.css';
import _ from 'lodash';
import 'bootstrap/dist/css/bootstrap.css';
import { Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      selectedSong: null,
      songs: null
    }
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

  renderList() {
    const { songs } = this.state;
    return (
      <tbody>
        {songs.map((s, index) => {
          return (
            <tr>
              <td>{songs[index].artist}</td>
              <td>{songs[index].album}</td>
              <td>{songs[index].song}</td>
              <td><FontAwesomeIcon icon={faPlay} /></td>
            </tr>
          )
        })}
      </tbody>
    );
  };

  render() {
    return (
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Artist</th>
            <th>Album</th>
            <th>Song</th>
            <th></th>
          </tr>
        </thead>
        { this.state.isLoaded ? this.renderList() : null }
      </Table>
    );
  }
}

export default App;

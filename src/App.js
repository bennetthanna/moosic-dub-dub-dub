import React, { Component } from 'react';
import './App.css';
import _ from 'lodash';

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
      <ul className="list-group list-group-flush">
        {songs.map((s, index) => {
          return (
            <div key={index}>
              <button type="button" className="list-group-item list-group-item-action">{songs[index].song}</button>
            </div>
          )
        })}
      </ul>
    );
  };

  render() {
    return (
      <div>
        <div>
          { this.state.isLoaded ? this.renderList() : null }
        </div>
      </div>
    );
  }
}

export default App;

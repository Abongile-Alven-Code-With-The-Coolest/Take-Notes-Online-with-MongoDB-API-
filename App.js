import './App.css';
import { Component } from "react";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: []
    };
    this.API_URL = "http://localhost:3001/";
    this.refreshNotes = this.refreshNotes.bind(this);
    this.addClick = this.addClick.bind(this);
    this.deleteClick = this.deleteClick.bind(this);
  }

  componentDidMount() {
    this.refreshNotes();
  }

  async refreshNotes() {
    fetch(this.API_URL + "api/todoapp/GetNotes")
      .then(response => response.json())
      .then(data => {
        this.setState({ notes: data });
      });
  }

  async addClick() {
    const newNotes = document.getElementById("newNotes").value;
    const data = new FormData();
    data.append("newNotes", newNotes);

    fetch(this.API_URL + "api/todoapp/AddNotes", {
      method: "POST",
      body: data
    }).then(res => res.json())
      .then(results => {
        alert(results.message); // assuming results has a message property
        this.refreshNotes();
      });
  }

  async deleteClick(id) {
    fetch(this.API_URL + `api/todoapp/DeleteNotes?id=${id}`, {
      method: "DELETE",
    }).then(res => res.json())
      .then(results => {
        alert(results.message); // assuming results has a message property
        this.refreshNotes();
      });
  }

  render() {
    const { notes } = this.state;
    return (
      <div className="App">
        <h1>Write up your notes (Keep up with your thoughts)</h1>
        <input id="newNotes" />&nbsp;
        <button onClick={this.addClick}>Add Notes</button>
        {notes.map(note =>
          <p key={note.id}>
            <b>* {note.description}</b>
            <button onClick={() => this.deleteClick(note.id)}>Delete Notes</button>
          </p>
        )}
      </div>
    );
  }
}

export default App;

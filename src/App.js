import { useState, useEffect } from 'react'
import axios from 'axios'
import Note from "./components/Note";
import Notification from './components/Notification'
import './styles.css'

import noteService from './services/notes'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState("a new note...");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null)


  useEffect(() => {
    axios
      .get('/api/notes')
      .then(res => {
        setNotes(res.data)
      })
  }, [])

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }
  
    noteService
    .update(id, changedNote)
    .then(returnedNote => {
      setNotes(notes.map(note => note.id !== id ? note : returnedNote))
    })
    .catch(error => {
      setErrorMessage(
        `ERROR: Note '${note.content}' was already removed from server`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      setNotes(notes.filter(n => n.id !== id))
    })
  }

  

const addNote = event => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      date: new Date(),
      important: Math.random() < 0.5,
    }
  
   
    noteService
    .create(noteObject)
    .then(returnedNote => {
      setErrorMessage("Successfully added "+  noteObject.content)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000);

      
      setNotes(notes.concat(returnedNote))
      setNewNote('')
    })  
      .catch(error => {
        setErrorMessage("Sorry Error: Your input is shorter than the minimum allowed length (5)" )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000);
      console.log(error.response.data)
       
      })
      
  

}

  

  const handleChange = (event) => {
    console.log(event.target.value);
    setNewNote(event.target.value);
  };

  const notesToShow = showAll
    ? notes
    : notes.filter((notes) => notes.important === true);


 
  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note key={note.id} note={note} notes={notes} setNotes={setNotes} toggleImportance={() => toggleImportanceOf(note.id)}/>
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleChange} />
        <button type="submit">save</button>
      </form>
    </div>
  );
};

export default App;

import axios from "axios"

const Note = ({ note, toggleImportance, setNotes, notes }) => {
  const label = note.important
    ? 'make not important' : 'make important'

    const del = (id) => {
      axios.delete("/api/notes/"+id)
      .then(response => {
        if(response.data != null){
          console.log("Item deleted");
          setNotes(notes.filter(note => note.id !== id));
        }
      });
    }


  return (
    <li>
      {note.content} 
      <button onClick={toggleImportance}>{label}</button>
      <button onClick={() => {del(note.id)}}>Delete</button>
    </li>
  )
}
export default Note;

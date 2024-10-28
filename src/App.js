import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, TextField, List, ListItem, ListItemText, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState({ id: '', title: '' });
  const API_URL = 'https://jsonplaceholder.typicode.com/posts';

  useEffect(() => {
    axios.get(API_URL).then((res) => setNotes(res.data.slice(0, 10))); // Load only 10 notes
  }, []);

  const handleSave = () => {
    if (currentNote.id) {
      axios.put(`${API_URL}/${currentNote.id}`, currentNote)
        .then(() => setNotes(notes.map(n => (n.id === currentNote.id ? currentNote : n))));
    } else {
      axios.post(API_URL, currentNote).then((res) => setNotes([...notes, res.data]));
    }
    setOpen(false);
    setCurrentNote({ id: '', title: '' });
  };

  const handleDelete = (id) => {
    axios.delete(`${API_URL}/${id}`).then(() => setNotes(notes.filter(n => n.id !== id)));
  };

  const openDialog = (note = { id: '', title: '' }) => {
    setCurrentNote(note);
    setOpen(true);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Note Taking App</h2>
      <Button variant="contained" onClick={() => openDialog()}>Add Note</Button>
      <List>
        {notes.map((note) => (
          <ListItem key={note.id}>
            <ListItemText primary={note.title} />
            <Button onClick={() => openDialog(note)}>Edit</Button>
            <Button onClick={() => handleDelete(note.id)}>Delete</Button>
          </ListItem>
        ))}
      </List>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{currentNote.id ? 'Edit Note' : 'Add Note'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            value={currentNote.title}
            onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default App;

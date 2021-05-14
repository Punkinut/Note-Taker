const express = require('express');
const path = require('path');
const fs = require('fs');
const uniqid = require('uniqid');
const jsonArr = require('./db/db');



const app = express();
const PORT = process.env.PORT || 3000;


let noteArr = [];
if(jsonArr) {
    jsonArr.forEach( nNote => {
        noteArr.push(nNote);
    })
}



app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.post('/api/notes', (req, res) => {
    const saveNote = req.body;
    noteArr.push(saveNote);
    // Gives a unique ID to each note so that you can call on them later
    noteArr.forEach((note) => {
        note.id = uniqid();
    })
    res.json(saveNote);
    fs.writeFile('db/db.json', JSON.stringify(noteArr, null, 2), (err) => {
        if(err) {
            console.log(err)
        }
    })
});

app.get('/api/notes', (req, res) => {
    if(jsonArr) {
        fs.readFile('db/db.json', (err, data) => {
            if (err) throw err;
            res.send(data);
        })
    }
})

app.delete('/api/notes/:id', (req, res) => {
    const { id } = req.params;
    noteArr.forEach(note => {
        if (note.id === id) {
            let changeArr = noteArr.filter(notes => {
                return notes.id !== id;
            })
            console.log(changeArr)
            res.send(id);
        }
    })
})

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'public/notes.html')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));


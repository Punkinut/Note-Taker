const express = require('express');
const path = require('path');
const fs = require('fs');
const uniqid = require('uniqid');



const app = express();
const PORT = process.env.PORT || 3000;


let noteArr = [];
const jsonArr = require('./db/db');
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
    fs.readFile('db/db.json', (err, data) => {
        if (err) throw err;
        res.send(data);
    })
})

app.delete('/api/notes/:id', (req, res) => {
    const { id } = req.params;
    noteArr.forEach(note => {
        if (note.id === id) {
            console.log('They are the same')
            res.send(id);
        } else {
            res.status(404).json({ message: 'The thing you were looking for does not exist'})
        }
    })

    // res.send(id);


    // const deleted = noteArr.find(note => note.id === id);
    // if (deleted) {
    //     noteArr = noteArr.filter(note => note.id !== id);
    //     res.send(deleted)
    // } else {
    //     res.status(404).json({ message: 'The thing you were looking for does not exist'})
    // }
})

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'public/notes.html')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));


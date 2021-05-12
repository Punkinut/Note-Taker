const express = require('express');
const path = require('path');
const fs = require('fs');


const app = express();
const PORT = process.env.PORT || 3000;

let noteArr = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'public/notes.html')));

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));

app.post('/api/notes', (req, res) => {
    const saveNote = req.body;
    noteArr.push(saveNote);
    res.json(saveNote);
    fs.writeFile('db/db.json', JSON.stringify(noteArr, null, 2), (err) => 
    err ? console.log(err) : console.log('Success'))
});

// app.get('api/notes', (req, res) => {
    
// })

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
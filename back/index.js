const express = require('express');
const cors = require('cors');
const app = express();

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

const gId = (req) => Number(req.params.id);
const gPerson = (req) => persons.find(obj => obj.id === gId(req));
const generateId = () => Math.floor(Math.random() * 1000000000);


app.use(cors());
app.use(express.json());

// *************
app.get('/', (req, res) => {
  res.send('<h1>API running</h1>');
});

// *************
app.get('/api/persons', (req, res) => {
  res.send(persons);
});

// *************
app.get('/api/info', (req, res) => {
  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date().toUTCString()}</p>`);
});

// *************
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(obj => obj.id === id);

  if (!person) return res.status(404).end();

  res.send(person);
});

// *************
app.delete('/api/persons/:id', (req, res) => {
  const person = gPerson(req);

  if (!person) return res.status(404).end();

  persons = persons.filter(obj => obj.id !== gId(req));
  res.send(JSON.stringify(person));
});

// *************
app.post('/api/persons', (req, res) => {
  if (!req.body.name || !req.body.number) {
    res.status(400).end();

  } else if (persons.map(obj => obj.name).includes(req.body.name)) {
    res.status(400).send({error: 'name must be unique'});

  } else {
    const newPerson = {
      id: generateId(),
      name: req.body.name,
      number: req.body.number || '',
    };

    persons = persons.concat(newPerson);
    res.send(JSON.stringify(newPerson));
  }
});

// *************
const unknownRoute = (req, res) => {
  res.status(404).send({error: 'unknown endpoint'});
};

app.use(unknownRoute);



const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

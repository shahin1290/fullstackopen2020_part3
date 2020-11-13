const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(express.json())
app.use(express.static('build'))
app.use(cors())
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms  :body')
)

let persons = [
  {
    name: 'Arto Hellas',
    number: 040 - 123456,
    id: 1,
  },
  {
    name: 'Ada Lovelace',
    number: 39 - 44 - 5323523,
    id: 2,
  },
  {
    name: 'Dan Abramov',
    number: 12 - 43 - 234345,
    id: 3,
  },
  {
    name: 'Mary Poppendieck',
    number: 39 - 23 - 6423122,
    id: 4,
  },
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>`
  )
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

const generateId = () => {
  return Math.random().toString(36).substr(2, 9)
}

app.post('/api/persons', (request, response) => {
  const { name, number } = request.body

  if (!name) return response.status(400).json({ error: 'name is missing' })

  if (!number) return response.status(400).json({ error: 'number is missing' })

  const isNameExists = persons.some(
    (person) => person.name.toLowerCase() === name.toLowerCase()
  )

  if (isNameExists)
    return response.status(400).json({ error: 'name must be unique' })

  const person = {
    name,
    number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find((person) => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter((person) => person.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

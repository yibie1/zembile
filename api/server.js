const express = require('express')
const cors = require('cors')
const path = require('path')

const payments = require('./routes/payments')
const uploads = require('./routes/uploads')

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/payments', payments)
app.use('/api/uploads', uploads)

app.get('/', (req,res) => res.send({name: 'Zembile API'}))

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log('API running on', PORT))

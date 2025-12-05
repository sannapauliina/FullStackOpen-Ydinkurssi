const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 2) {
  // List all
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(p => {
      console.log(p.name, p.number)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length === 4) {
  // Add new
  const name = process.argv[2]
  const number = process.argv[3]

  const person = new Person({ name, number })

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  // Instruction
  console.log('usage:')
  console.log('  node mongo.js <password>                       # list all')
  console.log('  node mongo.js <password> "Name" <number>      # add new')
  mongoose.connection.close()
}

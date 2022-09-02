const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const HASH_ROUND = 10

let playerSchema = mongoose.Schema({
  email: {
    type: String,
    require: [true, "Email harus diisi"]
  },
  name: {
    type: String,
    require: [true, "Nama harus diisi"]
  },
  username: {
    type: String,
    require: [true, "Nama harus diisi"],
    maxlength: [255, "Panjang username harus antara 3 - 225 karakter"],
    minlength: [3, "Panjang username harus antara 3 - 225 karakter"],
  },
  password: {
    type: String,
    require: [true, "Password harus diisi"],
    maxlength: [16, "Panjang password harus antara 8 - 16 karakter"],
    minlength: [8, "Panjang username harus antara 8 - 16 karakter"],
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user"
  },
  status: {
    type: String,
    enum: ["Y", "N"],
    default: "Y"
  },
  avatar: {
    type: String,
  },
  fileName: {
    type: String
  },
  phoneNumber: {
    type: String,
    require: [true, "Nomor Telepon harus diisi"],
    maxlength: [13, "Nomor telepon harus antara 9 - 13 karakter"],
    minlength: [9, "Nomor telepon harus antara 9 - 13 karakter"],
  },
  favorite: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }
}, { timestamps: true })

playerSchema.path('email').validate(async function (value) {
  try {
    const count = await this.model('Player').countDocuments({email: value})
    return !count
  } catch (error) {
    throw error
  }
}, attr => `${attr.value} sudah terdaftar`)

playerSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, HASH_ROUND)
  next()
})

module.exports = mongoose.model('Player', playerSchema)
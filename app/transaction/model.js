const mongoose = require('mongoose')

let transactionSchema = mongoose.Schema({
  historyVoucherTopup: {
    gameName: { type: String, require: [true, 'Nama game harus diisi']},
    category: { type: String, require: [true, 'Kategori harus diisi']},
    thumbnail: { type: String },
    coinName: { type: String, require: [true, 'Nama koin harus diisi']},
    coinQuantity: { type: String, require: [true, 'Jumlah koin harus diisi']},
    price: { type: Number },
  },
  historyPayment: {
    name: { type: String, require: [true, 'Nama harus diisi']},
    type: { type: String, require: [true, 'Tipe pembayaran harus diisi']},
    bankName: { type: String, require: [true, 'Nama bank harus diisi']},
    noRekening: { type: String, require: [true, 'Nomor rekening harus diisi']},
  },
  name: {
    type: String,
    require: [true, "Nama harus diisi"],
    maxlength: [225, "Panjang nama harus antara 3 - 225 karakter"],
    minlength: [3, "Panjang nama harus antara 3 - 225 karakter"]
  },
  accountUser: {
    type: String,
    require: [true, "Nama akun harus diisi"],
    maxlength: [225, "Panjang nama harus antara 3 - 225 karakter"],
    minlength: [3, "Panjang nama harus antara 3 - 225 karakter"]
  },
  tax: {
    type: Number,
    default: 0
  },
  value: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Pending', 'Success', 'Failed'],
    default: 'Pending'
  },
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  },
  historyUser: {
    name: { type: String, require: [true, 'Nama harus diisi']},
    phoneNumber: {
      type: Number,
      require: [true, "Nomor telepon harus diisi"],
      maxlength: [13, "Panjang angka harus antara 9 - 13 karakter"],
      minlength: [9, "Panjang angka harus antara 9 - 13 karakter"]
    }
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true })

module.exports = mongoose.model('Transaction', transactionSchema)
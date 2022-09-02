const Payment = require('./model')
const Bank = require('../bank/model')

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage")
      const alertStatus = req.flash("alertStatus")

      const alert = { message: alertMessage, status: alertStatus }
      const payment = await Payment.find().populate('banks')
      res.render('admin/payment/view_payment', {
        payment,
        alert,
        name: req.session.user.name,
        title: 'Halaman Payment'
      })
    } catch (error) {
      req.flash('alertMessage', `${error.message}`)
      req.flash('alertStatus', 'danger')
      req.redirect('/payment')
    }
  },
  viewCreate: async (req, res) => {
    try {
      const banks = await Bank.find()
      res.render('admin/payment/create', {
        banks,
        name: req.session.user.name,
        title: 'Halaman Tambah Payment'
      });
    } catch (error) {
      req.flash('alertMessage', `${error.message}`)
      req.flash('alertStatus', 'danger')
      req.redirect('/payment')
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { banks, type } = req.body
      let payment = await Payment({ banks, type })
      await payment.save();

      req.flash('alertMessage', "Berhasil tambah jenis pembayaran")
      req.flash('alertStatus', "success")

      res.redirect('/payment')
    } catch (error) {
      req.flash('alertMessage', `${error.message}`)
      req.flash('alertStatus', 'danger')
      req.redirect('/payment')
    }
  },
  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;

      const payment = await Payment.findOne({ _id: id })
      const banks = await Bank.find()

      res.render('admin/payment/edit', {
        payment,
        banks,
        name: req.session.user.name,
        title: 'Halaman Edit Payment'
      })
    } catch (error) {
      req.flash('alertMessage', `${error.message}`)
      req.flash('alertStatus', 'danger')
      req.redirect('/payment')
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { type, banks } = req.body

      await Payment.findOneAndUpdate({
        _id: id
      }, { type, banks });

      req.flash('alertMessage', "Berhasil ubah jenis pembayaran")
      req.flash('alertStatus', "success")

      res.redirect('/payment')
    } catch (error) {
      req.flash('alertMessage', "Error, Please contact administrator")
      req.flash('alertStatus', 'danger')
      req.redirect('/payment')
    }
  },
  actionStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const payment = await Payment.findOne({ _id: id});
      let status = payment.status === 'Y' ? 'N' : 'Y'
  
      await Payment.findOneAndUpdate({
        _id: id
      }, { status })

      req.flash('alertMessage', "Berhasil ubah status")
      req.flash('alertStatus', "success")

      res.redirect('/payment');
    } catch (error) {
      req.flash('alertMessage', "Error, Please contact administrator")
      req.flash('alertStatus', 'danger')
      res.redirect('/payment')
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;
      await Payment.findOneAndRemove({
        _id: id
      })

      req.flash('alertMessage', "Berhasil hapus jenis pembayaran")
      req.flash('alertStatus', "success")

      res.redirect('/payment');
    } catch (error) {
      req.flash('alertMessage', "Error, Please contact administrator")
      req.flash('alertStatus', 'danger')
      req.redirect('/payment')
    }
  }
}
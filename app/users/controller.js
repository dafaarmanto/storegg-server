const User = require('./model')
const bcypt = require('bcryptjs')

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage")
      const alertStatus = req.flash("alertStatus")

      const alert = { message: alertMessage, status: alertStatus }
      
      if (req.session.user === null || req.session.user === undefined) {
        res.render('admin/users/view_signin', {
          alert,
          title: 'Log In'
        })
      } else {
        res.redirect('/dashboard')
      }

    } catch (error) {
      req.flash('alertMessage', `${error.message}`)
      req.flash('alertStatus', 'danger')
      req.redirect('/')
    }
  },
  actionSignin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const check = await User.findOne({ email: email })

      if (check) {
        if (check.status === 'Y') {
          const checkPassword = await bcypt.compare(password, check.password)
          if (checkPassword) {
            req.session.user = {
              id: check._id,
              email: check.email,
              status: check.status,
              name: check.name
            }
            res.redirect('/dashboard')
          } else {
            req.flash('alertMessage', 'Email atau password yang anda masukkan salah')
            req.flash('alertStatus', 'danger')
            res.redirect('/')
          }
        } else {
          req.flash('alertMessage', 'Mohon maaf status anda belum aktif')
          req.flash('alertStatus', 'danger')
          res.redirect('/')
        }
      } else {
        req.flash('alertMessage', 'Email atau password yang anda masukkan salah')
        req.flash('alertStatus', 'danger')
        res.redirect('/')
      }
    } catch (error) {
      req.flash('alertMessage', `${error.message}`)
      req.flash('alertStatus', 'danger')
      req.redirect('/')
    }
  },
  actionLogout: (req, res) => {
    req.session.destroy();
    res.redirect('/')
  }
}
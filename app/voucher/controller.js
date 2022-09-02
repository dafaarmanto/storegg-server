const path = require('path')
const fs = require('fs')
const config = require('../../config')

const Voucher = require('./model')
const Category = require('../category/model')
const Nominal = require('../nominal/model')

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage")
      const alertStatus = req.flash("alertStatus")

      const alert = { message: alertMessage, status: alertStatus }
      const voucher = await Voucher.find()
        .populate('category')
        .populate('nominals')

      console.log(voucher)
      res.render('admin/voucher/view_voucher', {
        voucher,
        alert,
        name: req.session.user.name,
        title: 'Halaman Voucher'
      })
    } catch (error) {
      req.flash('alertMessage', `${error.message}`)
      req.flash('alertStatus', 'danger')
      req.redirect('/voucher')
    }
  },
  viewCreate: async (req, res) => {
    try {
      const category = await Category.find();
      const nominal = await Nominal.find();
      res.render('admin/voucher/create', {
        category,
        nominal,
        name: req.session.user.name,
        title: 'Halaman Tambah Voucher'
      });
    } catch (error) {
      req.flash('alertMessage', `${error.message}`)
      req.flash('alertStatus', 'danger')
      req.redirect('/voucher')
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { name, category, nominals } = req.body

      if (req.file) {
        let tmp_path = req.file.path;
        let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length -1];
        let filename = req.file.filename + '.' + originalExt;
        let targetPath = path.resolve(config.rootPath, `public/uploads/${filename}`)
      
        const src = fs.createReadStream(tmp_path)
        const dest = fs.createWriteStream(targetPath)

        src.pipe(dest)

        src.on('end', async () => {
          try {
            const voucher = new Voucher({
              name,
              category,
              nominals,
              thumbnail: filename
            })

            await voucher.save();

            req.flash('alertMessage', "Berhasil tambah voucher")
            req.flash('alertStatus', "success")

            res.redirect('/voucher')
          } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            req.redirect('/voucher')
          }
        })
      } else {
        try {
          const voucher = new Voucher({
            name,
            category,
            nominals
          })
  
          await voucher.save();
  
          req.flash('alertMessage', "Berhasil tambah voucher")
          req.flash('alertStatus', "success")
  
          res.redirect('/voucher')
        } catch (error) {
          req.flash('alertMessage', `${error.message}`)
          req.flash('alertStatus', 'danger')
          req.redirect('/voucher')
        }
      }
    } catch (error) {
      req.flash('alertMessage', `${error.message}`)
      req.flash('alertStatus', 'danger')
      req.redirect('/voucher')
    }
  },
  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;

      const category = await Category.find();
      const nominal = await Nominal.find();
      const voucher = await Voucher.findOne({ _id: id })
        .populate('category')
        .populate('nominals')

      res.render('admin/voucher/edit', {
        voucher,
        category,
        nominal,
        name: req.session.user.name,
        title: 'Halaman Edit Voucher'
      })
    } catch (error) {
      req.flash('alertMessage', `${error.message}`)
      req.flash('alertStatus', 'danger')
      req.redirect('/voucher')
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, category, nominals, image } = req.body

      if (req.file) {
        let tmp_path = req.file.path;
        let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length -1];
        let filename = req.file.filename + '.' + originalExt;
        let targetPath = path.resolve(config.rootPath, `public/uploads/${filename}`)
      
        const src = fs.createReadStream(tmp_path)
        const dest = fs.createWriteStream(targetPath)

        src.pipe(dest)

        src.on('end', async () => {
          try {
            const voucher = await Voucher.findOne({ _id: id })
           
            let currentImage = `${config.rootPath}/public/uploads/${voucher.thumbnail}`;

            if (fs.existsSync(currentImage)) {
              fs.unlinkSync(currentImage)
            }

            await Voucher.findOneAndUpdate({
              _id: id
            }, {
              name,
              category,
              nominals,
              thumbnail: filename
            })

            req.flash('alertMessage', "Berhasil ubah voucher")
            req.flash('alertStatus', "success")

            req.redirect('/voucher')
          } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            req.redirect('/voucher')
          }
        })
      } else {
        try {
          await Voucher.findOneAndUpdate({
            _id: id
          }, {
            name,
            category,
            nominals
          })
  
          req.flash('alertMessage', "Berhasil ubah voucher")
          req.flash('alertStatus', "success")
  
          req.redirect('/voucher')
        } catch (error) {
          req.flash('alertMessage', `${error.message}`)
          req.flash('alertStatus', 'danger')
          req.redirect('/voucher')
        }
      }

      await Voucher.findOneAndUpdate({
        _id: id
      }, { name, category, nominals, image });

      req.flash('alertMessage', "Berhasil ubah nominal")
      req.flash('alertStatus', "success")

      res.redirect('/voucher')
    } catch (error) {
      req.flash('alertMessage', "Error, Please contact administrator")
      req.flash('alertStatus', 'danger')
      req.redirect('/voucher')
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params; 
      const voucher = await Voucher.findOne({ _id: id })

      await Voucher.findOneAndRemove({
        _id: id
      })

      let currentImage = `${config.rootPath}/public/uploads/${voucher.thumbnail}`;

      if (fs.existsSync(currentImage)) {
        fs.unlinkSync(currentImage)
      }

      req.flash('alertMessage', "Berhasil hapus voucher")
      req.flash('alertStatus', "success")

      res.redirect('/voucher');
    } catch (error) {
      req.flash('alertMessage', "Error, Please contact administrator")
      req.flash('alertStatus', 'danger')
      res.redirect('/voucher')
    }
  },
  actionStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const voucher = await Voucher.findOne({ _id: id});
      let status = voucher.status === 'Y' ? 'N' : 'Y'
  
      await Voucher.findOneAndUpdate({
        _id: id
      }, { status })

      req.flash('alertMessage', "Berhasil ubah status")
      req.flash('alertStatus', "success")

      res.redirect('/voucher');
    } catch (error) {
      req.flash('alertMessage', "Error, Please contact administrator")
      req.flash('alertStatus', 'danger')
      res.redirect('/voucher')
    }
  }
}
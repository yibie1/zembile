const express = require('express')
const multer = require('multer')
const path = require('path')

const upload = multer({ dest: path.join(__dirname, '..', 'uploads/') })
const router = express.Router()

router.post('/', upload.single('proof'), (req,res) => {
  // TODO: store metadata in DB and associate with order
  res.json({ok:true, file: req.file})
})

module.exports = router

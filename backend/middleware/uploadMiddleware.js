const multer = require('multer');

var storage = multer.diskStorage({
  destination: function(req,file,cb) {
    cb(null,__dirname + '/temp');
  },
  filename: function(req,file,cb){
    cb(null,file.fieldname + '-' + Date.now());
  }
});

const imageFilter = function(req, file, cb) {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error('Only image files are accepted!'), false);
  }
  cb(null, true);
};

var upload = multer({storage: storage, fileFilter: imageFilter});

module.exports = upload;
const multer = require('multer');
require("dotenv").config();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,process.env.FILE_UPLOAD);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null,  file.fieldname + '-' + uniqueSuffix + tipoArquivo(file.mimetype));
    }
  });
    
  const upload = multer({
    storage,
    limits: {fileSize: 1024 * 1024 * 10}
  });
  
    const tipoArquivo = (typefile) =>{
        switch(typefile){
            case "image/png":
            return ".png"

            case "image/jpeg":             
            return ".jpeg"

            case "image/jpg":
            return ".jpg"
        }    
    } 

    


module.exports = upload
  
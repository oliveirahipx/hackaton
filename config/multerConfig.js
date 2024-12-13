const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Configuração do Cloudinary com suas credenciais
cloudinary.config({
  cloud_name: 'duslicdkg',
  api_key: '555614914946318',
  api_secret: 'tUvNLdc1QW7X2eQJ-rqFQseUMOs',
});

// Configuração do Multer para usar memoryStorage, já que a imagem vai para o Cloudinary
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

module.exports = { upload, cloudinary };

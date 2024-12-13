const app = require('./config/server');
const pool = require('./config/db');  // Importando corretamente o db.js de config
const multerConfig = require('./config/multerConfig');
app.use(multerConfig.upload.single('imagemPerfil'));


const rotaIndex = require('./app/routes/Index');
rotaIndex(app, pool);

const rotaLogin = require('./app/routes/login');
rotaLogin(app, pool);

const rotaPerfil = require('./app/routes/perfil');
rotaPerfil(app, pool);

const rotaNoticias = require('./app/routes/noticias');
rotaNoticias(app, pool);

app.listen(3000, function() {
    console.log("Server ON");
});

const { upload, cloudinary } = require('../../config/multerConfig');
module.exports = function(app, pool) {
    // Middleware para verificar autenticação
    function isAuthenticated(req, res, next) {
        if (req.session && req.session.user && req.session.user.id) {
            return next(); // Se o usuário estiver logado, continua
        } else {
            res.redirect('/login'); // Se não estiver logado, redireciona para a página de login
        }
    }

    // Rota para a página de perfil (verifica se o usuário está logado)
    app.get('/perfil', isAuthenticated, function(req, res) {
        const usuarioId = req.session.user.id; // Acessa o ID do usuário da sessão

        pool.query('SELECT * FROM usuarios WHERE id = $1', [usuarioId], (err, result) => {
            if (err) {
                console.error('Erro ao buscar dados do usuário:', err);
                return res.status(500).send('Erro ao buscar dados do usuário');
            }

            if (result.rows.length === 0) {
                console.error('Usuário não encontrado');
                return res.status(404).send('Usuário não encontrado');
            }

            const usuario = result.rows[0];
            
            // Atualizando `imagemPerfil` com o valor do banco
            usuario.imagemPerfil = usuario.imagemPerfil || 'https://res.cloudinary.com/duslicdkg/image/upload/v1732682709/user_images/hvgfrnagncizszy4lu83.jpg';

            console.log('URL da imagem de perfil carregada do banco:', usuario.imagemPerfil);

            res.render('perfil', { 
                usuario, 
                session: req.session // Enviando a sessão para o EJS para uso nas sidebars
            });
        });
    });

    // Rota para upload de imagem de perfil
    app.post('/upload', isAuthenticated, upload.single('imagemPerfil'), (req, res) => {
        const usuarioId = req.session.user.id; // Acessa o ID do usuário da sessão

        // Verifica se o arquivo foi enviado
        if (!req.file) {
            return res.status(400).send('Nenhuma imagem foi enviada');
        }

        // Fazendo upload da imagem para o Cloudinary
        cloudinary.uploader.upload_stream({ folder: 'user_images' }, (error, result) => {
            if (error) {
                console.error('Erro ao fazer upload da imagem para o Cloudinary:', error);
                return res.status(500).send('Erro ao fazer upload da imagem para o Cloudinary');
            }

            // URL da imagem após o upload
            const imagemPerfil = result.secure_url;

            // Atualiza a imagem de perfil no banco de dados com a URL do Cloudinary
            pool.query('UPDATE usuarios SET imagemPerfil = $1 WHERE id = $2', [imagemPerfil, usuarioId], (err) => {
                if (err) {
                    console.error('Erro ao atualizar a imagem de perfil:', err);
                    return res.status(500).send('Erro ao atualizar a imagem de perfil');
                }

                console.log('Imagem de perfil atualizada para:', imagemPerfil);

                // Atualiza a sessão do usuário com a nova URL para evitar inconsistências
                req.session.user.imagemPerfil = imagemPerfil;

                res.redirect('/perfil'); // Redireciona de volta para a página de perfil
            });
        }).end(req.file.buffer); // Envia o arquivo para o Cloudinary a partir do buffer
    });
};

const bcrypt = require('bcrypt'); // Importando o bcrypt para hashear as senhas

module.exports = function(app, pool) {
    // Rota de Login
    app.get('/Login', function(req, res) {
        res.render('login', { session: req.session });
    });

    // Rota de Login POST
    app.post('/Login', async function(req, res) {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).render('login', { session: req.session, errorMessage: 'Por favor, preencha todos os campos!' });
        }

        try {
            const query = 'SELECT * FROM usuarios WHERE email = $1';
            const result = await pool.query(query, [email]);

            if (result.rows.length === 0) {
                return res.status(401).render('login', { session: req.session, errorMessage: 'Email ou senha incorretos!' });
            }

            const user = result.rows[0];
            const senhaMatch = await bcrypt.compare(senha, user.senha); // Verifica se a senha está correta

            if (!senhaMatch) {
                return res.status(401).render('login', { session: req.session, errorMessage: 'Email ou senha incorretos!' });
            }

 // Armazenar usuário na sessão
 req.session.user = { id: user.id, nome: user.nome, email: user.email, imagemPerfil: user.imagemPerfil };

            console.log("login bem sucedido");
            res.redirect('/index'); // Redirecionar para a página inicial após login
        } catch (error) {
            console.log("erro")
            console.error('Erro ao autenticar usuário:', error);
            res.status(500).render('login', { session: req.session, errorMessage: 'Erro ao realizar login, tente novamente mais tarde.' });
        }
    });

    // Rota de Cadastro
    app.post('/Cadastro', async function(req, res) {
        const { nome, email, senha1 } = req.body;

        if (!nome || !email || !senha1) {
            return res.status(400).render('login', { session: req.session, errorMessage: 'Por favor, preencha todos os campos!' });
        }

        try {
            const queryCheck = 'SELECT * FROM usuarios WHERE email = $1';
            const resultCheck = await pool.query(queryCheck, [email]);

            if (resultCheck.rows.length > 0) {
                return res.status(400).render('login', { session: req.session, errorMessage: 'Email já cadastrado!' });
            }

            // Hash da senha
            const hashedSenha = await bcrypt.hash(senha1, 10); // 10 é o número de salt rounds

            const queryInsert = 'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id';
            const resultInsert = await pool.query(queryInsert, [nome, email, hashedSenha]);

            // Armazenar a sessão do usuário após cadastro
            req.session.userId = resultInsert.rows[0].id;
            req.session.user = nome;

            res.redirect('/index'); // Redirecionar para a página inicial após cadastro
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            res.status(500).render('login', { session: req.session, errorMessage: 'Erro ao cadastrar usuário, tente novamente mais tarde.' });
        }
    });

    // Rota de Logout
    app.get('/Logout', function(req, res) {
        req.session.destroy(function(err) {
            if (err) {
                console.error('Erro ao destruir a sessão:', err);
                return res.redirect('/Login');
            }
            res.redirect('/Login');
        });
    });
};

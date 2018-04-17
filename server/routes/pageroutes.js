const path = require('path');

module.exports = function (app) {
    // === Routes === //
    app.get('/dummyGoals', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'public/DummyJSON', 'dummyGoals.json'));
    });
    app.get('/dummyUsers', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'public/DummyJSON', 'dummyUsers.json'));
    });

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
    });
    app.get('/signUp', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'public', 'sign_up.html'));
    });
    app.get('/dashboard', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'public', 'dashboard.html'));
    });
    app.get('/login', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
    });
    app.get('/goals', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'public', 'create_Goal.html'));
    });
}
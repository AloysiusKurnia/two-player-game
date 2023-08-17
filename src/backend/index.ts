import express from 'express';
import expressWs from 'express-ws';

const app = expressWs(express()).app;
const port = 3001;

app.set('view engine', 'pug');
app.set('views', './src/frontend/views')
app.use(express.static('dist/static'));

app.get('/', (_, res) => {
    res.render('index', {
        scriptSrc: 'scripts/battleship.index.js'
    });
});

app.listen(port, () => {
    console.log(`App is listening on port ${port}!`);
    console.log(`If you're on localhost, go to http://localhost:${port}`);
});
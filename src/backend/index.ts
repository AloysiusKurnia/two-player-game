import express from 'express';
import expressWs from 'express-ws';

const app = expressWs(express()).app;
const port = 3001;

app.set('view engine', 'pug');
app.set('views', './src/frontend/views')
app.use(express.static('dist/static'));

app.get('/', (_, res) => {
    res.render('index', {
        scriptSrc: 'scripts/preact-test.js'
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
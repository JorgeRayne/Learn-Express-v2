import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

//Init App
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')

//Home Route
app.get('/', (req, res) => {
    let articles = [
        {
            id:1,
            title: 'Article One',
            author: 'Brad Traversy',
            body: 'this is article one'
        },
        {
            id:2,
            title: 'Article Two',
            author: 'Jorge Rayne',
            body: 'this is article two'
        },
        {
            id:3,
            title: 'Article Three',
            author: 'Brad Traversy',
            body: 'this is article Three'
        },
    ]
    res.render('index', {
        title: 'Hello',
        articles: articles
    })
});
//Add Article
app.get('/article/add', (req, res) => {
    res.render('add_article', {
        title: 'Add Article'
    })
})

// Start Server
app.listen(8000, () => {
    console.log('Server is running at PORT: 8000')
});
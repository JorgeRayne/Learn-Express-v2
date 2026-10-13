import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Article from './models/articles.model.js';

//Database Connection
mongoose.connect('mongodb://localhost:27017/nodekb');
let db = mongoose.connection;

db.once('open', () => {
    console.log('database connected')
})
db.on('error', (err) => {
    console.log(err)
})


//Init App
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')

//Home Route
app.get('/', async (req, res) => {
    let articles = await Article.find({});
    console.log(articles)

    res.render('index', {
        title: 'Hello',
        articles: articles
    });
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
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
app.set('view engine', 'pug');

//middleware for extracting incoming request body (such as JSON, forms, plaintext) from an HTTP request and makes it available as a JavaScript object on
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//set public folder
app.use(express.static(path.join(__dirname, 'public')))
app.use(
    "/bower_components",
    express.static(path.join(__dirname, "bower_components"))
);

//Home Route
app.get('/', async (req, res) => {
    try {
        const articles = await Article.find();

        res.render('index', {
            title: "Articles",
            articles: articles
        })
    } catch (error) {
        console.log(error);
    }
});

// Get Single Data
app.get('/article/:id', async (req ,res) => {
    const article = await Article.findById(req.params.id)
    res.render('article', {
        article: article
    });
})

//Add Article Page
app.get('/articles/add', (req, res) => {
    res.render('add_article', {
        title: 'Add Article'
    })
})

//Add Article
app.post('/articles/add', async (req, res) => {
  try {
    const { title, author, body } = req.body;

    const article = new Article({
      title,
      author,
      body
    });

    await article.save();

    res.redirect("/");
  } catch (err) {
    console.error("Error saving article:", err);
    res.status(500).send("Failed to save article.");
  }
})

app.get('/article/edit/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id)
        if (!article){
            throw new Error('Article with id ' + id + ' didnt find');
        }
        res.render('article', {
            article: article
        });
    } catch (error) {
        console.log(error)
        res.render('article', {
            message: error
        });
    }
});

// Start Server
app.listen(8000, () => {
    console.log('Server is running at PORT: 8000')
});
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Article from './models/articles.model.js';
import { title } from 'process';

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

//Edit route
app.get('/article/edit/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id)
        if (!article){
            throw new Error('Article with id ' + id + ' didnt find');
        }
        res.render('edit_article', {
            title: 'Edit Article',
            article: article
        });
    } catch (error) {
        console.log(error)
        res.render('article', {
            message: error
        });
    }
});

//Update article
app.post('/articles/edit/:id', async (req, res) => {
    const id = req.params.id;
    const { title, author, body } = req.body;
    try {
        const article = await Article.findByIdAndUpdate(
            id,
            { title, author, body },
            {
                returnDocument: 'after'
            }
        );
        
        if(!article){
            return res.status(404).send(`Article with id ${id} not found`);
        }
        res.redirect('/')

    } catch (error) {
        
    }
})

app.delete('/article/:id', async (req, res) => {
     const id = req.params.id;

     try {
        const article = await Article.findByIdAndDelete(id);
        if(!article) {
            return res.status(404).send('Article not found');
        };
        res.status(200).send('Article deleted successfully');
     } catch (error) {
        console.error('Error deleting article:', error);

        if (error.name === 'CastError') {
            return res.status(400).send('Invalid article ID');
        }

        res.status(500).send('Failed to delete article');
     }
});
 
// Start Server
app.listen(8000, () => {
    console.log('Server is running at PORT: 8000')
});
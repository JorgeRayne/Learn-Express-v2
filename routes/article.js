import express from 'express'
import Article from '../models/articles.model.js';
import { body, validationResult } from 'express-validator';

const article = express.Router();

article.get('/', async (req, res) => {
    try {
        const articles = await Article.find();

        res.render('index', {
            title: "Articles",
            articles: articles
        })
    } catch (error) {
        console.log(error);
    }
})

//Add Article Page
article.get('/add', (req, res) => {
    res.render('add_article', {
        title: 'Add Article'
    })
})

//Get singel Article
article.get('/:id', async (req ,res) => {
    const article = await Article.findById(req.params.id)
    res.render('article', {
        article: article
    });
})


//Add Article
article.post('/add',[
    body('title')
        .notEmpty()
        .isString()
        .withMessage('Title is Required'),
    body('author')
        .notEmpty()
        .isString()
        .withMessage('Author is Required'),
    body('body')
        .notEmpty()
        .isString()
        .withMessage('Body is Required')
] ,async (req, res) => {
    const errors = validationResult(req);
    try {
        if (!errors.isEmpty()) {
            return res.status(400).render('add_article', {
                title: 'Add Article',
                errors: errors.array()
            });
        }
        const { title, author, body } = req.body;

        const article = new Article({
        title,
        author,
        body
        });

        await article.save();

        req.flash('success', 'Article Added');
        return res.redirect("/");
    } catch (err) {
        return res.render('add_article', {
            title: 'Add Article',
            errors: err
        })
    }
})

//Edit route
article.get('/edit/:id', async (req, res) => {
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
article.post('/edit/:id', async (req, res) => {
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
        req.flash("success", "Article updated successfully");
        return res.redirect('/')

    } catch (error) {
        
    }
})

article.delete('/:id', async (req, res) => {
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

export default article;
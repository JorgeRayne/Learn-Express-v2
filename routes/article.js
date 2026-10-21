import express from 'express'
import Article from '../models/articles.model.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

router.get('/', async (req, res) => {
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
router.get('/:id', async (req ,res) => {
    const article = await Article.findById(req.params.id)
    res.render('article', {
        article: article
    });
})

//Add Article Page
router.get('/add', (req, res) => {
    res.render('add_article', {
        title: 'Add Article'
    })
})

//Add Article
router.post('/add',[
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
        console.log(errors.array())
        if (!errors.isEmpty()) {
            console.log(errors)
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
router.get('/edit/:id', async (req, res) => {
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
router.post('/edit/:id', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
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

export default router;
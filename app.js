import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Article from './models/articles.model.js';
import session from 'express-session';
import flash from 'connect-flash';
import article  from './routes/article.js';
import expressMessages from 'express-messages';
import user from './routes/users.js'

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
app.use("/bower_components", express.static(path.join(__dirname, "bower_components")));

//Express Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 60000
    }
  })
);

//Express Messages Middleware
app.use(flash());

app.use((req, res, next) => {
  res.locals.messages = expressMessages(req, res);
  next();
});


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

app.use('/article', article);
app.use('/user', user);
 
// Start Server
app.listen(8000, () => {
    console.log('Server is running at PORT: 8000')
});
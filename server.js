//adding express
const express = require('express')
//adding mongoose for the database
const mongoose = require('mongoose')
//adding express server response
const res = require('express/lib/response')
//adding method-override to create the DELETE option
const methodOverride = require('method-override')

//declaring articleRouter to create the methods GET/POST/PUT/DELETE
const articleRouter = require ('./routes/articles')
//declaring Article to get the database schema of the articles
const Article = require('./models/articles');

//creating the express app
const app = express()
//get Heroku's port or 8080 for the localhost
const port = process.env.PORT || 8080

//get the URI for the mongo database
const dbURI = "mongodb+srv://lorenzomariosa:rdTEO4Dfs3bixtYQ@wtblog.jefe3.mongodb.net/WTblog?retryWrites=true&w=majority"

//connecting mongosse to the URI for the database then listen to the port to access the browser
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology : true })
    .then(() => app.listen(port))
    .catch((error) => console.log(error))

//setting up the view engine converting ejs to HTLM
app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false}))
//overiding express methods to add DELETE
app.use(methodOverride('_method'))

//setting up the route
app.get('/', async (req, res) => {
    //getting all the articles in the database in chronological descending order
    const articles = await Article.find().sort({ createdAt: 'desc' })
    //linking the route to the home page in articles/index.ejs
    res.render('articles/index', {articles: articles})
})

//telling the app to use the articles router at '/articles'
app.use('/articles', articleRouter)

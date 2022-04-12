const express = require('express')
const mongoose = require('mongoose')
const Article = require('./models/articles');
const res = require('express/lib/response')
const articleRouter = require ('./routes/articles')
const methodOverride = require('method-override')

const app = express()
const port = process.env.PORT || 8080

const dbURI = "mongodb+srv://lorenzomariosa:rdTEO4Dfs3bixtYQ@wtblog.jefe3.mongodb.net/WTblog?retryWrites=true&w=majority"

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology : true })
    .then((result) => app.listen(8080))
    .catch((error) => console.log(error))

app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false}))
app.use(methodOverride('_method'))

app.get('/', async (req, res) => {
    const articles = await Article.find().sort({ createdAt: 'desc' })
    res.render('articles/index', {articles: articles})
})

app.use('/articles', articleRouter)

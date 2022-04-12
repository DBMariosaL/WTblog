const express = require('express');
const res = require('express/lib/response');

const Article = require('./../models/articles');
//setting up the router to create views
const router = express.Router()

//showing the new article page
router.get('/new', (req, res) => {
    res.render('articles/new', { article: new Article() })
})

//showing themodifying page of the article with it's id
router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', { article: article })
})

//showing the selected article with it's slug
router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug })
    if (article == null) {
        res.redirect('/')
    }
    res.render('articles/show', { article: article })
})

//Saving the new article and redirecting to the new page
router.post('/', async (req, res) => {
    let article = new Article({
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown
    })
    try {
        article = await article.save()
        res.redirect(`/articles/${article.slug}`)
    } catch (error) {
        console.log(error)
        res.render('articles/new', { article: article })
    }
})

//Saving the modified article and redirecting to the new page
router.put('/:id', async (req, res) => {
    req.article = await Article.findById(req.params.id)
    let article = req.article
    article.title = req.body.title
    article.description = req.body.description
    article.markdown = req.body.markdown
    try {
        article = await article.save()
        res.redirect(`/articles/${article.slug}`)
    } catch (error) {
        console.log(error)
        res.render('articles/edit', { article: article })
    }
})

//Deleting the modified article and redirecting to the route page
router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

//Creating the articles router accessed in the other files
module.exports = router
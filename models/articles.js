const mongoose = require('mongoose')
//adding slugify to put the article's title in the URL
const slugify = require('slugify')
// adding marked and dompurify to add secure and sanitized HTLM injections in the markdown section
const marked = require('marked')
const createDomPurify = require('dompurify')
const {JSDOM} = require('jsdom')

const domPurify = createDomPurify(new JSDOM().window)


//creating the article's schema for the database
const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    markdown: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    slug: {
        type: String,
        require: true,
        unique: true
    },
    sanitizedHtlm: {
        type: String,
        required: true
    }
})

//finalising the article's variables
articleSchema.pre('validate', function(next) {
    //modifying the URL by slugifing the title
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true})
    }
    //adding the sanitizedHTLM to the new markdown
    if(this.markdown) {
        this.sanitizedHtlm = domPurify.sanitize(marked.parse(this.markdown))
    }
    next()
})

//exporting the article's schema to the database
module.exports = mongoose.model('Articles', articleSchema)
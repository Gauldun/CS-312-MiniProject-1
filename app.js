import express from "express";
const app = express();
const port = 3000;

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
// Middleware to serve static files from the public directory
app.use(express.static('public'));

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Array to hold posts in memory
let posts = [];
const categories = ['Technology', 'Travel', 'Food', 'Lifestyle', 'Education', 'Other'];

// GET route for the home page. It renders the 'index' view with the current posts and categories
app.get('/', (req, res) => {
    res.render('index', { posts: posts, categories: categories });
});

// POST route to handle creating a new post
app.post('/create', (req, res) => {
    const { author, title, content, category } = req.body;
    const newPost = {
        id: Date.now(),
        author: author,
        title: title,
        content: content,
        category: category,
        date: new Date().toLocaleString()
    };
    posts.unshift(newPost);
    res.redirect('/');
});

// GET route to display the edit page for a specific post
app.get('/edit/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const postToEdit = posts.find(post => post.id === postId);
    if (postToEdit) {
        res.render('edit', { post: postToEdit, categories: categories });
    } else {
        res.redirect('/');
    }
});

// POST route to handle saving changes to an existing post
app.post('/edit/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const postIndex = posts.findIndex(post => post.id === postId);
    if (postIndex !== -1) {
        posts[postIndex] = {
            ...posts[postIndex],
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
            date: new Date().toLocaleString()
        };
        res.redirect('/');
    } else {
        res.redirect('/');
    }
});

// POST route to handle deleting a post
app.post('/delete/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    posts = posts.filter(post => post.id !== postId);
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
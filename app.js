import express from "express";
const app = express();
const port = 3000;

// Middleware to parse URL-encoded bodies (from HTML forms).
app.use(express.urlencoded({ extended: true }));
// Middleware to serve static files (like CSS) from the 'public' directory.
app.use(express.static('public'));

// Set the view engine to EJS.
app.set('view engine', 'ejs');

// An array to store all blog posts. This acts as a simple in-memory database.
let posts = [];
// An array of predefined categories for the blog posts.
const categories = ['Technology', 'Travel', 'Food', 'Lifestyle', 'Education', 'Other'];

// GET route for the home page. It renders the 'index' view with the current posts and categories.
app.get('/', (req, res) => {
    res.render('index', { posts: posts, categories: categories });
});

// POST route to handle creating a new post.
app.post('/create', (req, res) => {
    const { author, title, content, category } = req.body;
    const newPost = {
        // Creates a unique ID using the current timestamp.
        id: Date.now(),
        author: author,
        title: title,
        content: content,
        category: category,
        // Records the current date and time.
        date: new Date().toLocaleString()
    };
    // Adds the new post to the beginning of the 'posts' array.
    posts.unshift(newPost);
    // Redirects the user back to the home page.
    res.redirect('/');
});

// GET route to display the edit page for a specific post.
app.get('/edit/:id', (req, res) => {
    // Parses the post ID from the URL.
    const postId = parseInt(req.params.id);
    // Finds the post with the matching ID.
    const postToEdit = posts.find(post => post.id === postId);
    // If the post is found, render the 'edit' view with the post data and categories.
    if (postToEdit) {
        res.render('edit', { post: postToEdit, categories: categories });
    } else {
        // If not found, redirect to the home page.
        res.redirect('/');
    }
});

// POST route to handle saving changes to an existing post.
app.post('/edit/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    // Finds the index of the post with the matching ID.
    const postIndex = posts.findIndex(post => post.id === postId);
    // If the post is found...
    if (postIndex !== -1) {
        // Updates the post at that index with new data from the form.
        posts[postIndex] = {
            // Uses spread syntax to keep existing properties (like ID and author).
            ...posts[postIndex],
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
            // Updates the date to the current date and time.
            date: new Date().toLocaleString()
        };
        // Redirects to the home page after saving.
        res.redirect('/');
    } else {
        // If not found, redirect to the home page.
        res.redirect('/');
    }
});

// POST route to handle deleting a post.
app.post('/delete/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    // Filters out the post with the matching ID, effectively deleting it.
    posts = posts.filter(post => post.id !== postId);
    // Redirects to the home page after deletion.
    res.redirect('/');
});

// Starts the server and listens for incoming requests on the specified port.
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
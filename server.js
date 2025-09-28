const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create Express app
const app = express();
const PORT = 34001;

// ---------------------------------------------------------------------------
// MongoDB connection string – works both locally and in docker-compose.
// - In development, set MONGO_URI in your shell (or leave empty to use localhost)
// - In production (docker-compose), the service name `mongo` resolves automatically
// ---------------------------------------------------------------------------
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/ienza-tech';

// Configure CORS - allow Angular frontend
app.use(cors({
  origin: [
    'http://localhost:4200',          // Development
    'https://blog.ienza.tech'         // Production
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure file uploads
const UPLOAD_DIR = path.join(__dirname, 'uploads/blog-images');

// Create upload directory if it doesn't exist
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  console.log(`Created upload directory: ${UPLOAD_DIR}`);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Define Blog Schema - match existing structure
const blogSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  text: { type: String, required: true },
  story: { type: String, required: true },
  date: { type: String, required: true },
  files: [{ type: String }],
  tags: [{ type: String }] // New field for categories/tags
});

// Create Blog model
const Blog = mongoose.model('Blog', blogSchema, 'blogs');

// Generate random ID (similar to the Rust implementation)
function generateId(length = 6) {
  const charset = '123456789abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

// Helper function to get unique ID
async function getUniqueId() {
  let attempts = 30;
  while (attempts > 0) {
    const id = generateId();
    const existingBlog = await Blog.findOne({ _id: id });
    if (!existingBlog) {
      return id;
    }
    attempts--;
  }
  throw new Error('Unable to generate a unique ID after 30 attempts');
}

// Routes

// GET /manage/all - Get all blogs
app.get('/manage/all', async (req, res) => {
  try {
    const blogs = await Blog.find({});
    console.log(`Retrieved ${blogs.length} blogs`);
    res.json(blogs);
  } catch (err) {
    console.error('Error fetching all blogs:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /:id - Get blog by ID
app.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findOne({ _id: req.params.id });
    if (!blog) {
      console.log(`Blog with ID ${req.params.id} not found`);
      return res.status(404).json({ error: 'Blog not found' });
    }
    
    console.log(`Retrieved blog: ${blog.title}`);
    res.json(blog);
  } catch (err) {
    console.error(`Error fetching blog ${req.params.id}:`, err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /manage/add - Add new blog
app.post('/manage/add', upload.array('files', 5), async (req, res) => {
  try {
    const { title, text, story, date, tags } = req.body;
    
    // Validate required fields
    if (!title || !story) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Generate unique ID
    const id = await getUniqueId();
    
    // Process uploaded files
    const files = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        files.push(file.path);
      }
    }
    
    // Process tags (comma-separated string to array)
    let tagsArray = [];
    if (tags && typeof tags === 'string') {
      tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    } else if (Array.isArray(tags)) {
      tagsArray = tags;
    }

    // Auto-generate date if not provided (admin editor doesn't send date)
    const blogDate = date || new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Create new blog
    const newBlog = new Blog({
      _id: id,
      title,
      text,
      story,
      date: blogDate,
      files
    });
    
    await newBlog.save();
    console.log(`Created new blog: "${title}" with ID: ${id}, tags: [${tagsArray.join(', ')}]`);
    
    res.status(201).json({ 
      message: `Your new blog ID is: ${id}`,
      id
    });
  } catch (err) {
    console.error('Error creating blog:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error routes to match Rust backend
app.get('/errors/internal', (req, res) => {
  res.status(500).send('There was an internal server error while fetching your URL, sorry lol');
});

app.get('/errors/bad', (req, res) => {
  res.status(404).send('The URL you requested is not in our database');
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error handler middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Blog backend server running on port ${PORT}`);
  console.log(`MongoDB connection URL: ${MONGO_URI}`);
  console.log(`CORS enabled for: http://localhost:4200`);
  console.log(`File uploads directory: ${UPLOAD_DIR}`);
});

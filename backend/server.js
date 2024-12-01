const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // Import CORS
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for frontend-backend communication

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files (CSS, images, etc.)
app.use(express.static(path.join(__dirname, '../frontend')));


app.get('/index', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.get('/aboutus', (req, res) => {
  res.render('aboutus');
});

app.get('/support', (req, res) => {
  res.render('support');
});

app.get('/dashboard', (req, res) => {
  res.render('dashboard');
});

app.get('/overview', (req, res) => {
  res.render('overview');
});

app.get('/profile', (req, res) => {
  res.render('profile');
});

app.get('/budget', (req, res) => {
  res.render('budget');
});
// Define routes to render EJS templates
app.get('/analytics', (req, res) => {
    res.render('analytics', { pageTitle: 'Analytics' });
});

app.get('/bills', (req, res) => {
    res.render('bills', { pageTitle: 'Bills' });
});

app.get('/expenses', (req, res) => {
    res.render('expenses', { pageTitle: 'Expenses' });
});

app.get('/goals', (req, res) => {
    res.render('goals', { pageTitle: 'Goals' });
});

app.get('/income', (req, res) => {
    res.render('income', { pageTitle: 'Income' });
});

app.get('/report', (req, res) => {
    res.render('report', { pageTitle: 'report' });
});


// Routes
const expenseRoutes = require('./routes/expenses');
const authRoutes = require('./routes/auth'); 
const goalRoutes = require('./routes/goals');
const billRoutes = require('./routes/bills');
const incomesRouter = require('./routes/incomes'); 

app.use('/api/expenses', expenseRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/income', incomesRouter); 

// Default route
app.get('/', (req, res) => {
  res.render('index');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

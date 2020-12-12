const express = require('express');
const connectDB = require('./config/db')
const app = express();

// Connect Database
connectDB();

//Init Middleware

//express.json() is a method inbuilt in express to recognize the incoming Request
//Object as a JSON Object. This method is called as a middleware in your application using the code: app.use(express.json());
app.use(express.json({extended : false}));

app.get('/', (req,res) => res.send('API Running :)'));

// Define Routes
app.use('/api/users' , require('./routes/api/users'));
app.use('/api/auth' , require('./routes/api/auth'));
app.use('/api/profiles' , require('./routes/api/profiles'));
app.use('/api/products' , require('./routes/api/products'));
app.use('/api/services', require('./routes/api/services'));
app.use('/api/recommend/products', require('./routes/api/RecommenderSystem/products'));
app.use('/api/recommend/services', require('./routes/api/RecommenderSystem/services'));
app.use('/api/search/products', require('./routes/api/SearchEngine/products'));
app.use('/api/search/services', require('./routes/api/SearchEngine/services'));

const PORT = process.env.PORT;

app.listen(PORT, () => console.log('Server started :)'))
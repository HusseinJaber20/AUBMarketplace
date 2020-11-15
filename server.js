const express = require('express');
const connectDB = require('./config/db')
const app = express();

// Connect Database
connectDB();

//Init Middleware
//What is Middleware? It is those methods/functions/operations that are called BETWEEN 
//processing the Request and sending the Response in your application method.

//express.json() is a method inbuilt in express to recognize the incoming Request
//Object as a JSON Object. This method is called as a middleware in your application using the code: app.use(express.json());


app.use(express.json({extended : false}));

app.get('/', (req,res) => res.send('API Running :)'));

// Define Routes
app.use('/api/users' , require('./routes/api/users'));
app.use('/api/auth' , require('./routes/api/auth'));
app.use('/api/profiles' , require('./routes/api/profiles'));
app.use('/api/products' , require('./routes/api/products'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('Server started :)'))
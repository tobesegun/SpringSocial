const express = require ('express');
const mongoose = require ('mongoose');
const bodyParser =require('body-parser');
const passport = require('passport');

const posts = require('./routes/apis/post');
const profile = require('./routes/apis/profile');
const users = require('./routes/apis/user');
const admin = require('./routes/apis/admin');
const path = require('path');

const app = express();
// Body Parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//DB Config
const db = require('./config/keys').mongoURI

//Conect to mongo  
mongoose
    .connect(db)
    .then(() => console.log('Mongodb Connected'))
    .catch(err => console.log(err));

//passport middleware 
app.use(passport.initialize());

//passport config
require('./config/passport')(passport);
require('./config/passport2')(passport);

 //use router
 app.use('/api/users',users);
 app.use('/api/profile', profile);
 app.use('/api/posts', posts);
 app.use('/api/admins', admin);

 // Server static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT||5000;

app.listen(port, () => console.log(`server running on ${port}`));
 
require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const initializePassport = require('./config/passport');
const User = require('./models/user');
const bcrypt = require('bcrypt');

// Config: cookie, passport, cors etc

app.use(require('cors')());
app.use(
  cookieSession({
    name: 'iv-connect',
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.SESSION_SECRET],
  })
);

initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// Use Morgan Logger (development only)
if (process.env._NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use(express.static('public'));

var mongoConnectionURI = process.env.MONGO_URI;

// Connect Mongo
mongoose.connect(
  mongoConnectionURI,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  },
  (err) => {
    if (!err) return console.log('MONGO CONNECTED');
  }
);

mongoose.connection.on('error', (err) => {
  // CRITICAL MONGO ERROR
  console.log('MONGO connection error: ', err);
});

app.post('/auth/login', (req, res, next) => {
  passport.authenticate('local', function (err, user, info) {
    try {
      if (err) throw Error(err.message);

      if (!user) throw Error('Incorrect password or username');
      console.log('Ready to login');
      // req.logIn(user, function (err) {
      //   if (err) {
      //     return next(err);
      //   }
      //   return res.redirect('/users/' + user.username);
      // });
      res.json({ type: 'success', msg: 'Logged in successfully', user });
    } catch (error) {
      res.status(500).json({ type: 'failure', msg: error.message });
    }
  })(req, res, next);
});

app.post('/auth/register', async (req, res) => {
  try {
    let { name, username, password } = req.body;
    let hashedPass = await bcrypt.hash(password, 10);
    let user = await User.create({ name, username, password: hashedPass });
    res.json({ type: 'failure', user });
  } catch (err) {
    let msg = err.message;
    if (err.code === 11000) msg = 'Username is already taken or not available';
    res.status(500).json({ type: 'failure', msg });
  }
});

app.get('/users/:username', async (req, res) => {
  try {
    let { username } = req.params;
    let user = await User.findOne({ username });
    if (!user) throw Error('No user found');
    res.json({ type: 'failure', user });
  } catch (err) {
    let msg = err.message;
    if (err.code === 11000) msg = 'Username is already taken or not available';
    res.status(500).json({ type: 'failure', msg });
  }
});

//
//
//

// 404 Not found
app.use((req, res) => {
  res.status(404).json({ type: 'failure', msg: '404 Not Found' });
});

app.use((error, req, res, next) =>
  res.json({
    type: 'failure',
    msg: error.message,
    err: 'LAST_HOPE_ERR_Handler',
  })
);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log('🚀 Server up and running on port ' + PORT);
});

// socket io
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});
io.on('connection', (client) => {
  console.log(client.id);
  client.on('code', (data) => {
    console.log('sended code', data);
  });
  client.on('drawing', (data) => {
    client.broadcast.emit('drawing', data); // console.log('sended code', data);
  });
});

module.exports = app;

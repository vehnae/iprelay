const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const exphbs  = require('express-handlebars');
const basicAuth = require('express-basic-auth');
const config = require('./config');
const relays = require('./relays');
const app = express();
const router = express.Router();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', exphbs({
  extname: '.hbs',
  helpers: require('./helpers')
}));
app.set('view engine', 'hbs');

app.use(basicAuth({users: config.auth, challenge: true, realm: config.realm}));
app.use('/', router);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

router.get('/', (req, res) => {
  res.render('index', config);
});

router.get('/relay', (req, res) => {
  res.json({state:relays.state()});
});

router.post('/relay/:relay/:operation', (req, res) => {
  if (req.params.operation == 'on') {
    relays.on(req.params.relay);
    res.status(200);
  }
  else if (req.params.operation == 'off') {
    relays.off(req.params.relay);
    res.status(200);
  }
  else if (req.params.operation == 'pulse') {
    relays.pulse(req.params.relay);
    res.status(200);
  } else {
    res.status(400);
  }
  res.send();
});

relays.init();

module.exports = app;

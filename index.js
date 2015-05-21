var express = require('express'), 
    // Initialized Express application
    app = express(),
    path = require('path'),
    // ORM for mongodb
    mongoose = require('mongoose'),
    // Logs our HTTP requests
    morgan = require('morgan'),
    // Gives us POST params in request body
    bodyParser = require('body-parser'),
    // Simulate PUT & DELETE
    methodOverride = require('method-override');

// Connect our application to our local mongodb.
mongoose.connect('mongodb://foo:bar@ds031892.mongolab.com:31892/potluck');

var Dish = mongoose.model('Dish', {
  description: String,
  student: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Configure my application to use Jade.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Use my middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// Establish the routes for our applicaiton

// Index action
app.get('/', function(request, response, next) {
  Dish.find(function(error, dishes) {
    if (error) {
      response.send(error);
    }
    response.render('dishes/index', {description: 'Dishes', dishes: dishes});
  });
});

// New action
app.get('/dishes/new', function(request, response, next) {
  response.render('dishes/new', {
    description: "Bring a Dish"
  });
});

// Create action
app.post('/dishes', function(request, response, next) {
  var dish = new Dish();
  dish.description = request.body.description;
  dish.student = request.body.student;

  dish.save(function(error) {
    if (error) {
      response.send(error);
    }
    response.redirect('/');
  });
});

// Show action
app.get('/dishes/:id', function(request, response, next) {
  Dish.findOne({_id: request.params.id}, function(error, dish) {
    if (error) {
      response.send(error);
    }
    response.render('dishes/show', {description: dish.description, dish: dish});
  });
});

// Edit action
app.get('/dishes/:id/edit', function(request, response, next) {
  Dish.findOne({_id: request.params.id}, function(error, dish) {
    if (error) {
      response.send(error);
    }
    response.render('dishes/edit', {description: 'Edit this Dish', dish: dish});
  });
});

// Update action
app.put('/dishes/:id', function(request, response, next) {
  Dish.update({_id: request.params.id}, {description: request.body.description ,student: request.body.student}, function(error, dish) {
    if (error) {
      response.send(error);
    }
    response.redirect('/');
  });
});

// Destroy
app.delete('/dishes/:id', function(request, response, next) {
  Dish.findByIdAndRemove(request.params.id, function(error) {
    if (error) {
      response.send(error);
    }
    response.redirect('/');
  });
});

app.listen(3000);
console.log('App is listening on port 3000.');
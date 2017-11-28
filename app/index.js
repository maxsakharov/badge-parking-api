var shutdownHook = require('./shutdownhook');
var path    = require('path');
var cors    = require('cors')
var yaml    = require('yamljs');
var express = require('express');
var multer  = require('multer');
var morgan  = require('morgan')
var upload  = multer({dest: 'uploads/'});
var bodyParser  = require('body-parser')
var routes      = require(path.resolve('app/routes'));
var swaggerUi   = require('swagger-ui-express');

// set up
var app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api-docs', 
  swaggerUi.serve, 
  swaggerUi.setup(yaml.load('./swagger.yml'))
);

var server = app.listen(process.env.PORT || 8080, () => {
  console.log("Serving at " + (process.env.PORT || 8080));
});
shutdownHook.register(server);

app.get('/ping', (req, res) => { res.send({"status": "up"}) });

app.post('/badge', upload.single('badge'), routes.newBadge)
app.put('/badge/:id', routes.updateBadgeMetadata)
app.get('/badge',     routes.getBadgeList)
app.get('/badge/:id', routes.getBadgeMetadata);

app.get('/dashboard', routes.getDashboardBadge);

app.post('/location', routes.updateLocation);
app.get('/location',  routes.getLocation);

app.delete('/receipt',  routes.deleteReceipt);

app.use(function (err, req, res, next) {
  if(!err) return next();
  console.error(err);
  res.status(500).send({"error": err.message});
});

var SERVER_NAME = 'product-api'
var PORT = 8000;
var HOST = '127.0.0.1';
var countPost = 0;
var countGet = 0;
var countUpdate = 0;
var countDelete = 0;

var restify = require('restify')

  // Get a persistence engine for the products
  , productsSave = require('save')('products')

  // Create the restify server
  , server = restify.createServer({ name: SERVER_NAME})

  server.listen(PORT, HOST, function () {
  console.log('Server %s listening at %s', server.name, server.url)
  console.log('Resources for get/post/delete:')
  console.log(' /products')
  console.log(' /products/:id')
  console.log('Number of Get request: ' + countGet)  
  console.log('Number of Post request:' + countPost)  
  console.log('Number of Update request:' + countUpdate)
  console.log('Number of Delete request: ' + countDelete)  

})

server
  // Allow the use of POST
  .use(restify.fullResponse())

  // Maps req.body to req.params so there is no switching between them
  .use(restify.bodyParser())

// Get all products in the system
server.get('/products', function (req, res, next) {

  // Find every entity within the given collection
  productsSave.find({}, function (error, products) {

    // Return all of the products in the system
    res.send(products)
    console.log('Received a Get request')    
    countGet++;
    console.log('Number of Get request: ' + countGet)  
    console.log('Number of Post request:' + countPost)  
    console.log('Number of Update request:' + countUpdate)
    console.log('Number of Delete request: ' + countDelete)  
    })
})

// Get a single product by their product id
server.get('/products/:id', function (req, res, next) {

  // Find a single product by their id within save
  productsSave.findOne({ _id: req.params.id }, function (error, product) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    if (product) {
      // Send the product if no issues
      res.send(product)
    } else {
      // Send 404 header if the product doesn't exist
      res.send(404)
    }
    countGet++;
    console.log('Received a Get request by ID')        
    console.log('Number of Get request: ' + countGet)  
    console.log('Number of Post request:' + countPost)  
    console.log('Number of Update request:' + countUpdate)
    console.log('Number of Delete request: ' + countDelete)  
    })
})

// Create a new product
server.post('/products', function (req, res, next) {

  // Make sure name is defined
  if (req.params.productname === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('productname must be supplied'))
  }
  if (req.params.price === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('price must be supplied'))
  }
  var newProduct = {
		productname: req.params.productname, 
		price: req.params.price
  }
  console.log('Received a Post request')      
  countPost++
  console.log('Number of Get request: ' + countGet)  
  console.log('Number of Post request:' + countPost)  
  console.log('Number of Update request:' + countUpdate)
  console.log('Number of Delete request: ' + countDelete)  

  // Create the Product using the persistence engine
  productsSave.create( newProduct, function (error, product) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send the product if no issues
    res.send(201, product)
  })
})

// Update a product by their id
server.put('/products/:id', function (req, res, next) {

  // Make sure productname is defined
  if (req.params.productname === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('productname must be supplied'))
  }
  if (req.params.price === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('price must be supplied'))
  }
  
  var newProduct = {
		_id: req.params.id,
		productname: req.params.productname, 
		price: req.params.price
	}
  
  // Update the Product with the persistence engine
  productsSave.update(newProduct, function (error, product) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send a 200 OK response
    res.send(200)
  })
  countUpdate++
  console.log('Received an Update request')      
  console.log('Number of Get request: ' + countGet)  
  console.log('Number of Post request:' + countPost)  
  console.log('Number of Update request:' + countUpdate)
  console.log('Number of Delete request: ' + countDelete)  

})

// Delete product with the given id
server.del('/products/:id', function (req, res, next) {

  // Delete the product with the persistence engine
  productsSave.delete(req.params.id, function (error, product) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send a 200 OK response
    res.send()
  })
  countDelete++
  console.log('Received a Delete request')      
  console.log('Number of Get request: ' + countGet)  
  console.log('Number of Post request:' + countPost)  
  console.log('Number of Update request:' + countUpdate)
  console.log('Number of Delete request: ' + countDelete)  

})



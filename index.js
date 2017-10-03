var SERVER_NAME = 'patient-api'
var PORT = 8000;
var HOST = '127.0.0.1';
var countPost = 0;
var countGet = 0;
var countUpdate = 0;
var countDelete = 0;

var restify = require('restify')

  // Get a persistence engine for the patients
  , patientsSave = require('save')('patients')

  // Create the restify server
  , server = restify.createServer({ name: SERVER_NAME})

  server.listen(PORT, HOST, function () {
  console.log('Server %s listening at %s', server.name, server.url)
  console.log('Resources for get/post/delete:')
  console.log(' /patients')
  console.log(' /patients/:id')
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

// Get all patients in the system
server.get('/patients', function (req, res, next) {

  // Find every entity within the given collection
  patientsSave.find({}, function (error, patients) {

    // Return all of the patients in the system
    res.send(patients)
    console.log('Received a Get request')    
    countGet++;
    console.log('Number of Get request: ' + countGet)  
    console.log('Number of Post request:' + countPost)  
    console.log('Number of Update request:' + countUpdate)
    console.log('Number of Delete request: ' + countDelete)  
    })
})

// Get a single patient by their patient id
server.get('/patients/:id', function (req, res, next) {

  // Find a single patient by their id within save
  patientsSave.findOne({ _id: req.params.id }, function (error, patient) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    if (patient) {
      // Send the patient if no issues
      res.send(patient)
    } else {
      // Send 404 header if the patient doesn't exist
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

// Create a new patient
server.post('/patients', function (req, res, next) {

  // Make sure name is defined
  if (req.params.name === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('name must be supplied'))
  }
  if (req.params.age === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('age must be supplied'))
  }
  var newPatient = {
		name: req.params.name, 
		age: req.params.age
  }
  console.log('Received a Post request')      
  countPost++
  console.log('Number of Get request: ' + countGet)  
  console.log('Number of Post request:' + countPost)  
  console.log('Number of Update request:' + countUpdate)
  console.log('Number of Delete request: ' + countDelete)  

  // Create the Patient using the persistence engine
  patientsSave.create( newPatient, function (error, patient) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send the patient if no issues
    res.send(201, patient)
  })
})

// Update a patient by their id
server.put('/patients/:id', function (req, res, next) {

  // Make sure name is defined
  if (req.params.name === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('name must be supplied'))
  }
  if (req.params.age === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('age must be supplied'))
  }
  
  var newPatient = {
		_id: req.params.id,
		name: req.params.name, 
		age: req.params.age
	}
  
  // Update the Patient with the persistence engine
  patientsSave.update(newPatient, function (error, patient) {

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

// Delete patient with the given id
server.del('/patients/:id', function (req, res, next) {

  // Delete the patient with the persistence engine
  patientsSave.delete(req.params.id, function (error, patient) {

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



# Pokemon Favorites API

Pokemon API built in Node JS.

* Allows users to search Pokemon and select their favorites
* Favorites can be added or deleted
* Comments can be made on your favorite Pokemon and altered

Updates needed to make
* Fix the login process. Currently, there’s a user verification for the api itself. A key token is generated for a user and users can utilize this to access all their information stored in a MongoDB.
    * Need to allow users to login via front end and give permission to api from there. (Might be a better method to do this that allows a cookie to verify it to client. Token could be a permanent version where it doesn’t expire for a long time and can be utilized to always allow access for this user if token is available similar to many current APIs)
    * Currently, a token can be generated when accessing api with “http://localhost:3000/api/user/login” and providing the email and password in the body. Token spits back and allows us to plug into current version at the top for easy testing use for now.
    * New users can register into the database and access for API with “http://localhost:3000/api/user/register” and provide a name, email, and password. Allows users to then utilize this information to login.
* Update User Interface (which I’ll probably do today sometime)

npm packages used 
* @hapi/joi - For validation of information entered into the API
* Bcryptjs - allows us to hash password and encrypt it further. 
* cors - Allows us to ignore Cross-header issues that don’t allow us to connect to api
* dotenv - stores MongoDB information and our API secret token
* Express - allows routing 
* Jsonwebtoken - creates token we can assign to users to allow access to API for POST, DELETE, UPDATE, GET
* Mongoose - package for interacting with database
* Node-fetch - lets me use fetch for requests instead of using AJAX

devDependencies 
* Nodemon - allowed me to reload after saves to see results right away

When using, .env file will need to be created in the root file to get connection to database and also to create special token

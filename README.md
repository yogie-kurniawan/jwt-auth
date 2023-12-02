# jwt-auth
Authentication with JWT, Node.js and MongoDB

How to use run this project?
1. Run "npm i" to install all required packages
2. create an .env file, and define these variables:
    PORT=3000
    JWT_SECRET=yoursecret
    JWT_LIFETIME=1d
    MONGODB_URI=yourmongodburi
    SALT_ROUNDS=10
    SESSION_SECRET=yoursecret

3. run "npm start"

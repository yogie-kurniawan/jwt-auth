# jwt-auth
Authentication with JWT, Node.js and MongoDB

How to run this project?
1. Run "npm i" to install all required packages
2. Create an env file with ".env" extension (without a name) and define these variables:
    PORT=3000
    JWT_SECRET=yoursecret
    JWT_LIFETIME=1d
    MONGODB_URI=yourmongodburi
    SALT_ROUNDS=10
    SESSION_SECRET=yoursecret

3. Run "npm start"

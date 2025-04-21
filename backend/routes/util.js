
const mongoose = require('mongoose');

async function returnDbConnection() {
    try {
        const mongoURI = process.env.MONGOURI;

        await mongoose.connect(mongoURI, {
            newUrlParser: true, 
            useUnifedTopology: true,
        });

        console.log('Succesfully connected to MONGODB!');
        return mongoose.connection;
    } catch(e) {
        console.erorr("Error connecting to MONGODB: ", error);
        throw error;
    }
}

module.exports = returnDbConnection;

const mongoose = require('mongoose');

async function returnDbConnection() {
    try {
        const mongoURI = process.env.MONGOURI;

        const client = new MongoClient(mongoURI, {
            serverApi: {
              version: ServerApiVersion.v1,
              strict: true,
              deprecationErrors: true,
            }
          });

        await client.connect();

        console.log('Succesfully connected to MONGODB!');
        return client;
    } catch(e) {
        console.erorr("Error connecting to MONGODB: ", error);
        throw error;
    } finally {
        await client.close();
    }
}

module.exports = returnDbConnection;
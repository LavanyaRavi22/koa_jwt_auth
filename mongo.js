const MongoClient = require('mongodb').MongoClient;
//const MONGO_URL = "mongodb://localhost:27017/polyglot_ninja";
//const MONGO_URL = "mongodb://test1:qwerty1@ds129936.mlab.com:29936/polyglot_ninja";
const MONGO_URL = "mongodb://test1:qwerty1@ds225038.mlab.com:25038/polyglot_ninja";

module.exports = function (app) {
    MongoClient.connect(MONGO_URL)
        .then((connection) => {
	   // console.log(connection);
            app.people = connection.collection("people");
            console.log("Database connection established")
        })
        .catch((err) => console.error(err))

};

var mongoClient = require('mongodb').MongoClient;

const url = "mongodb+srv://perterpro:hahahihi@thang-ngo-bot-scidd.mongodb.net/test?retryWrites=true&w=majority";
const client = new mongoClient(url, { useNewUrlParser: true });

exports.insertWork = function () {   

    client.connect(err => {
        var db = client.db("bot-database");
        const collection = db.collection("bot-work");
        // perform actions on the collection object
        var data = {
            name: "ao thun",
            price: 50000,
            category: "quan ao"
        }
        collection.insertOne(data, function (err,res) {
            //neu xay ra loir
            if (err) throw err;
            //neu khong co loi
            console.log('Them thanh cong');
        });
        client.close();
    });

    // client.connect(function(err, db){
    //     const collection = db.db('bot-database').collection('bot-work');
    //     var data = {
    //         name: "ao thun",
    //         price: 50000,
    //         category: "quan ao"
    //     }
    //     collection.insertOne(data, function (err,res) {
    //         //neu xay ra loir
    //         if (err) throw err;
    //         //neu khong co loi
    //         console.log('Them thanh cong');
    //     });
    //     client.close();
    // });

    
}
const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
const multer = require('multer');

const app = express();
app.use(cors());

const CONNECTION_STRING = "mongodb+srv://admin:lWoLCynxAKckrr9P@cluster0.wacmmtv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DATABASENAME = "todoappdb";
let database;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(CONNECTION_STRING, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function connectToDatabase() {
    try {
        await client.connect();
        database = client.db(DATABASENAME);
        console.log("MongoDB connection successful");

        const PORT = process.env.PORT || 3001;
        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        });
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}

connectToDatabase().catch(console.dir);

app.get('/api/todoapp/GetNotes', (request, response) => {
    if (!database) {
        console.error("Database not connected");
        return response.status(500).send("Database not connected");
    }

    database.collection('todoappcollection').find({}).toArray((error, result) => {
        if (error) {
            console.error("Error fetching notes:", error);
            return response.status(500).send(error);
        } else {
            response.send(result);
        }
    });
});

app.post('/api/todoapp/AddNotes', multer().none(), async (request, response) => {
    try {
        if (!database) {
            return response.status(500).json({ error: "Database not connected" });
        }

        const numOfDocs = await database.collection('todoappcollection').countDocuments();

        await database.collection('todoappcollection').insertOne({
            id: (numOfDocs + 1).toString(),
            description: request.body.newNotes
        });

        response.json({ message: "Added Successfully" });
    } catch (error) {
        console.error("Error adding note:", error);
        response.status(500).json({ error: "Failed to add note" });
    }
});

app.post('/api/todoapp/DeleteNotes', async (request, response) => {
    try {
        if (!database) {
            return response.status(500).json({ error: "Database not connected" });
        }

        await database.collection('todoappcollection').deleteOne({
            id: request.query.id
        });

        response.json({ message: "Deleted Successfully" });
    } catch (error) {
        console.error("Error deleting note:", error);
        response.status(500).json({ error: "Failed to delete note" });
    }
});

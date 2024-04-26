const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
const app = express();

const uri = "mongodb+srv://satya:satya@cluster0.8thgg4a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
let collection;

async function connectToMongo() {
    try {
        await client.connect();
        console.log("Connected to MongoDB Atlas");
        const database = client.db('SE');
        collection = database.collection('product');
    } catch (error) {
        console.error("Error connecting to MongoDB Atlas", error);
    }
}

connectToMongo();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Server is running' });
});

// Create
app.post('/create', async (req, res) => {
    try {
        const data = req.body;
        const result = await collection.insertOne(data);
        res.json({ message: 'Document created successfully', id: result.insertedId });
    } catch (error) {
        console.error("Error creating document", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Read
app.get('/read', async (req, res) => {
    try {
        const documents = await collection.find({}).toArray();
        res.json({ data: documents });
    } catch (error) {
        console.error("Error reading documents", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update
app.put('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const result = await collection.updateOne({id: (int)(id) }, { $set: data });
        if (result.modifiedCount) {
            res.json({ message: 'Document updated successfully' });
        } else {
            res.status(404).json({ message: 'Document not found' });
        }
    } catch (error) {
        console.error("Error updating document", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete
app.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await collection.deleteOne({ id: (int)(id) });
        if (result.deletedCount) {
            res.json({ message: 'Document deleted successfully' });
        } else {
            res.status(404).json({ message: 'Document not found' });
        }
    } catch (error) {
        console.error("Error deleting document", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

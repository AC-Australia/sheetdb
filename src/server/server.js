const express = require('express');
const cors = require('cors');
const app = express();
let sheetdb
app.use(cors());
app.use(express.json())

//This Process Returns All Material Types From the Sheet Database
app.put('/api/setup-db', async(req,res) =>{
    try{
        console.log("THIS LOCATION", req.body.locPath)
        let connection = sheetdb.getNewDbConnection(req.body.locPath)  
        res.json(connection) 
    }catch(err){
        console.log("ERROR READING DB")
        console.log(err)
        res.status(404).send("Database Could not be found")
    }
});

app.get('/api/material-list', async (req,res) => {
    let list = await sheetdb.getMaterialsFromDB();
    res.json(list);
});

app.get('/api/thickness-list', async (req,res) => {
    let list = await sheetdb.getThicknessFromDB();
    res.json(list);
});

app.get('/api/sheets-list', async (req,res) => {
    let list = await sheetdb.getSheetsFromDB();
    res.json(list);
});

app.get('/', (req,res) => {
    res.json("blake")
})

app.put('/api/update-size', async (req,res) => {
    let newSheet = await sheetdb.putUpdatesize(req.body)
    res.json(newSheet);
})

app.put('/api/delete-size', async (req,res) => {
    let deletedSheet = await sheetdb.putDeletesize(req.body)
    res.json(deletedSheet);
})



const startExpress = () => {
    const port = process.env.expressPort;
    app.listen(port);
    console.log('App is listening on port ' + port);
    sheetdb = require('./sheetdb');
}



module.exports.startExpress = startExpress;
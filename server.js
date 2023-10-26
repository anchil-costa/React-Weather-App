const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sybsc',
    database: 'anchil',
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }

    console.log('Connected to the database');
});

app.post('/api/saveCity', (req, res) => {
    const { saveCity } = req.body;

    const insertQuery = 'INSERT INTO city (city_name) VALUES (?)';

    const values = [saveCity];

    db.query(insertQuery, values, (err, result) => {
        if (err) {
            console.error('Error saving city:', err);
            return;
        }
        console.log('City saved successfully');
        res.json({ message: 'City Saved successfully' });
    });
});

app.get('/api/getSaveCity', (req, res) => {
    const selectQuery = 'SELECT * FROM city';
    db.query(selectQuery, (err, results) => {
    
    if (err) {
    console.error('Error fetching saved cities:', err);
    return;
    }
    res.json(results);
    });
    });
    
    app.delete('/api/deleteCity/:id', async(req,res)=>{
        const cityId=req.params.id;

        const deleteQuery =`DELETE FROM city WHERE id=${cityId}`;
        db.query(deleteQuery,(err,results)=>{
            if (err) {
                console.error('Error deleting saved cities:', err);
                return;
                }
                else{
                    res.json({message:'City deleted'});
                }
        })
    });

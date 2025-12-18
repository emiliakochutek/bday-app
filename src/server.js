const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

const PORT = process.env.PORT;
const APP_TITLE = process.env.APP_TITLE || "Birthday list";
const MONGO_URL = process.env.MONGO_URL;

app.use(bodyParser.json());
app.use(express.static('src/public'));

mongoose.connect(MONGO_URL)
    .then(() => console.log('>>> Połączono z bazą MongoDB!'))
    .catch(err => console.error('>>> Błąd połączenia z bazą:', err));

const BirthdaySchema = new mongoose.Schema({
    name: String,
    date: String
});
const BirthdayModel = mongoose.model('Birthday', BirthdaySchema);


app.get('/api/config', (req, res) => {
    res.json({ title: APP_TITLE });
});

app.get('/api/birthdays', async (req, res) => {
    try {
        const birthdays = await BirthdayModel.find();
        res.json(birthdays);
    } catch (err) {
        res.status(500).json({ error: 'Błąd bazy danych' });
    }
});

app.post('/api/birthdays', async (req, res) => {
    try {
        const newBday = new BirthdayModel({
            name: req.body.name,
            date: req.body.date
        });
        await newBday.save();
        res.status(201).send('Dodano');
    } catch (err) {
        res.status(500).json({ error: 'Nie udało się zapisać' });
    }
});

app.listen(PORT, () => {
    console.log(`--- Aplikacja "${APP_TITLE}" działa na porcie ${PORT} ---`);
});
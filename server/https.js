import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import fs from 'fs';
import https from 'https';

const options = {
  key: fs.readFileSync('./certificates/server.key'),
  cert: fs.readFileSync('./certificates/server.crt'),
};

const app = express();
const port = 3007;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile('./static/index.html');
});

https.createServer(options, app).listen(port, () => {
  console.log(`Example app listening on: https://localhost:${port}`);
});

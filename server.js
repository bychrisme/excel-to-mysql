import express from 'express';
import bodyparser from 'body-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import fileUpload from 'express-fileupload';

// import routes
import ConvertRoutes from './app/routes/convert.route';

dotenv.config();

const app = express();

var corsOptions = {
    origin: process.env.CLIENT_HOST || "*"
};

app.use(express.static('public'));
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(bodyparser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.json({limit: '50mb'}));
app.use(bodyparser.urlencoded({extended: true, limit: '50mb'}));
app.use(fileUpload());

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to my application",
    })
});
app.use("/api", ConvertRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Welcome on my application.`);
  console.log(`Author : bychrisme <christianmeli81@gmail.com>.`);
  console.log(`Server is running on port ${PORT}.`);
  console.log(`You can launch your application in browser using http://localhost:${PORT}.`);
  console.log(``);
});
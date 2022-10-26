require("dotenv").config();
const rateLimiter = require("express-rate-limit");
const express = require("express");
const path = require('path')

const app = express();
app.use(express.json());



app.use(express.static("public/Sea Horse"))

app.get("/seahorse", (req, res) => {
	res.sendFile(__dirname + "/public/Sea Horse/play.html")
})

app.use(express.static("public/Escape Dog"))

app.get("/escapedog", (req, res) => {
	res.sendFile(__dirname + "/public/Escape Dog/play.html")
})

app.get("/", (req, res) => {
	res.send("Umulio API")
})

app.get('*', function(req, res){
  res.status(404).send("Not sure what you were looking for...");
});

const port = process.env.PORT || 3000;
const start = async () => {
	try {
		// await connectDB(process.env.MONGO_URL);
		app.listen(port, () =>
			console.log(`Server is listening on port ${port}...`)
		);
	} catch (error) {
		console.log(error);
	}
};

start();

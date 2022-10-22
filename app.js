require("dotenv").config();
const rateLimiter = require("express-rate-limit");
const express = require("express");
const path = require('path')

const app = express();
app.use(express.json());

app.use(express.static("Escape Dog"))

app.get("/play", (req, res) => {
	res.sendFile(__dirname + "/Escape Dog/play.html")
})

app.get('*', function(req, res){
  res.status(404).send("Not sure what you were looking for...");
});

const port = 3000 || process.env.PORT;
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

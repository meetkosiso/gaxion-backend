import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import jsend from 'jsend';
import api from './api';

// config dotenv
dotenv.config();

// instantiate express
const app = express();

// db connect
if (process.env.NODE_ENV === 'production') {
	mongoose.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		poolSize: 500
	});
} else if (process.env.NODE_ENV === 'test') {
	mongoose.connect(process.env.Mongo_testing, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});
}

// LOG ENVIRONMENT
console.log('ENVIRONMENT:', process.env.NODE_ENV);

// middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(jsend.middleware);
app.set('view engine', 'ejs');

// parse application/json and look for raw text
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json' }));

// home
app.get('/', (req, res) => {
	res.json({ message: 'Welcome to Gaxion API.' });
});

// Use Routes
app.use('/api/v1/gaxion', api);

app.use((req, res, next) => {
	const error = new Error('Not found!');
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: `Gaxion TEST API says ${error.message}`
		}
	});
	next();
});

// start listening..
app.listen(process.env.PORT || 3009, () => {
	console.log(`Now listening for request at ${process.env.PORT}...`);
});

module.exports = app;

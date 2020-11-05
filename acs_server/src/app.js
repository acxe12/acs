import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';
import cors from 'cors';


//import { provideToken } from '/routes/provideToken.js';

const app = express();
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', routes);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    res
        .status(err.status || 500)
        .render('error', {
            message: err.message
        });
});

export default app;
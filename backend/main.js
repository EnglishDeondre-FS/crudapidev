const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const movieRouter = require('./routes/movie.routes');
const actorRouter = require('./routes/actor.routes');

const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));
app.use(helmet());
app.use(morgan('dev'));

app.use('/movie', movieRouter);
app.use('/actor', actorRouter);

app.listen(1337, (port) => { 
    console.log(`Server listening at http://localhost:${port}`);
});
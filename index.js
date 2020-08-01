const express = require("express");
const logger = require('morgan')
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const xssFilter = require('x-xss-protection')
const helmet = require('helmet');

const { config } = require("dotenv");
if (process.env.NODE_ENV === "production") {
  config({ path: "./src/config/.env.prod" });
} else {
  config({ path: "./src/config/.env.dev" });
}

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,     // 15 minutes
    max: 100,                     // limit each IP to 100 requests per windowMs
    message: 'Too Many Requests :('
});
  
// Apply Rate Limit to all requests
app.use(limiter);

// Apply XSS Filter
app.use(xssFilter())

// Use Helmet to apply extra security
app.use(helmet());

app.use(logger('dev'))
app.use(express.json());
app.use(cors());

const server = app.listen(3000);

app.use('/places', require('./src/routes/PlacesRouter'))

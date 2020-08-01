const express = require('express');
const router = express.Router();
const axios = require('axios')

router.get('/test', async (req, res) => {

    res.status(200).send(`Oi EnvVar ${process.env.API_KEY}`)

})


module.exports = router;
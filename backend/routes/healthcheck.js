const router = require('express').Router();


router.route('/').get((req,res) => {
  // consider adding DB check  
  const healthcheck = {
    // uptime tells us how long the server
    // has been running in seconds
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now()
  };
  try {
    res.send(healthcheck);
  } catch (e) {
    healthcheck.message = e;
    res.status(503).send();
  }
});

module.exports = router;
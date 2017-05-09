const axios = require('axios')

function auth(req, res, next){
  axios.get(`https://graph.facebook.com/debug_token?input_token=${req.get('authorization')}&access_token=${process.env.FB_ID}|${process.env.FB_SECRET}`)
  .then(response => {
    if(response.data.data.is_valid)
      next()
    else
      res.json({error: 'NOT LOGGED IN'})
  })
}

module.exports = auth
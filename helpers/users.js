const db = require('../helpers/db-connect')

exports = module.exports = {}

exports.findAll = function(req, res){
	db.query('SELECT * FROM users', [], (err, response) => {
    if(err) console.log(err)
		res.json(response.rows)
  })
}
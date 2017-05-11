const db = require('../helpers/db-connect')

exports = module.exports = {}

exports.findAll = function(req, res){
	db.query('SELECT * FROM users', [], (err, response) => {
    if(err) console.log(err)
		res.json(response.rows)
  })
}

exports.findOne = function(req, res){
	db.query('SELECT * FROM users WHERE id = $1', [req.params.id], (err, response) => {
    if(err) console.log(err)
		res.json(response.rows[0])
  })
}
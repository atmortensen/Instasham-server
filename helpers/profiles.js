const db = require('../helpers/db-connect')

exports = module.exports = {}

exports.login = function(req, res){
	db.query('SELECT * FROM users WHERE id = $1', [req.body.id], (err, response) => {
    if(err) console.log(err)
  	if(!response.rows[0]){
  		db.query('INSERT INTO users (id, image, name) VALUES ($1, $2, $3) RETURNING *', 
  		[req.body.id, req.body.picture.data.url, req.body.name], (err, response) => {
  			if(err) console.log(err)
  			res.json(response.rows[0])
  		})
  	} else {
  		res.json(response.rows[0])
  	}
  })
}
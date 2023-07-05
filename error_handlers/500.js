module.exports= (err, req, res, next)=> {
    console.error(err.stack)
    res.status(500).send({
        "status": 500,
        "responseText": "Sorry, something went wrong"
        })
  };
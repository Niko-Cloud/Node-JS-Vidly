
module.exports = function (req,res,next){
    //401 Unauthorized -> user without valid json token
    //403 Forbidden -> user have valid json token, but cant access
    if(!req.user.isAdmin) return res.status(403).send('Acces denied')

    next()
}
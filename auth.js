const jwt = require('jsonwebtoken')
 
const auth = async (req,res,next)=>{
    const token = req.headers.authorization.replace('Bearer ','');

    if (token) {
        try {
            const id = jwt.verify(token, "jgvchgvfkuycvjhvkcuvwljchvyucvhj");
            req.user_id = id;
        } catch (error) {
            return res.send({
                successe: false,
                message: error.message,
                data: null,
            })
        }
    } else {
        return res.send({
            success: false,
            message: 'Пройдите авторизацию',
            data: null,
        })
    }
    next();
}

module.exports = auth;


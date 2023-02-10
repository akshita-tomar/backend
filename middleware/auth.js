const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    try {

        let token = req.headers.authorization;

        if (token) {
            
            token = token.split(" ")[1];

            let user = jwt.verify(token, "HHH")
            req.result=user

        } else {

            return res.status(401).json({ message: "unauthorized user" })
        }

        next();

    } catch (error) {

        console.log(error);
        
        return res.status(401).json({ message: "unauthorized user" })
    }

};

module.exports = verifyToken;
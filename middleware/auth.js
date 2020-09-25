// need to auth user to make sure they're logged in for
// specific actions

const jwt = require('jsonwebtoken');
// next is function to do after auth
const auth = async (req, res, next) => {
    try {
        const token = req.header("x-auth-token");

        if (!token) {
            return res.status(401).json({
                msg: 'No authentication token. Authorization denied.'
            });
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) {
            return res.status(401).json({
                msg: 'Token verification failed. Authorization denied.'
            });
        }

        req.user = verified.id;
        next(); // runs the function after this declartion of `auth`
    } catch (err) {
        res.status(500).send({
            err: err.message
        });
    }
};

module.exports = auth;

const admins = ['adnan@email.com', 'raga']

function isAdmin(req, res, next) {
    let isAdmin = req.decoded.user.isAdmin;
    console.log(666, isAdmin)
    if (isAdmin) {
        next();
    } else {
        res.status(404).json({
            success: false,
            message: 'Access Denied'
        })
    }
}

module.exports = isAdmin;
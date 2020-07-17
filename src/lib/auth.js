module.exports = {
    //Redirección al estar logueado
    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/signin');
    },
    //Redirección al estar deslogueado
    isNotLoggedIn(req, res, next) {
        if(!req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/profile');
    }
};
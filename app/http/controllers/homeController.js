const controller = require('./controller');

class HomeController extends controller {
    
    index(req , res) {
        res.render('home/index');
    }

}

module.exports = new HomeController();
const User = require('../models/user');

// exports.deleteusers = async (req, res) => {
//     try {
//         let user = await User.find();
//         if (!user) {
//             res.status(404);
//         }
//         res.json(user);
//     } catch (error) {
//         console.log(error);
//         res.status(500).send('Hubo un error');
//     }
// }

exports.loadUser = async (req, res) => {
    try {
        let user = await User.findById(req.payload.id);
        if (!user) {
            res.status(404);
        }
        res.json(user.toAuthJSON());
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.getProfile = async (req, res) => {
    try {
        let user = await User.findById(req.payload.id);
        if (!user) {
            res.json({"result":false});
        }
        res.json(user.toProfileJSONFor());
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.login = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.json({ msg: "User doesn't exists" });
        } else {

            if (user.validPassword(req.body.password)) {
                return res.json(user.toAuthJSON());
            } else {
                return res.json({ msg: "Wrong password" });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.register = async (req, res, next) => {
    var user = new User();

    user.username = req.body.username;
    user.email = req.body.email;
    user.setPassword(req.body.password);
    user.image = 'https://static.productionready.io/images/smiley-cyrus.jpg';
    user.bio = 'Hello, this is my profile.';

    user.save().then(function () {
        return res.json(user.toAuthJSON());
    }).catch(next);
}

exports.updateUser = async (req, res, next) => {
    let user = await User.findById(req.payload.id);

    if (!user) { return res.sendStatus(401); }

    if (typeof req.body.bio !== 'undefined') {
        user.bio = req.body.bio;
    }

    if (typeof req.body.password !== 'undefined') {
        user.setPassword(req.body.password);
    }

    user.save().then(function () {
        return res.json(user.toProfileJSONFor());
    });
}
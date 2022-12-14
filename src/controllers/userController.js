const userModel = require("../models/userModel");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const isValidName = function (name) {
    if (/^[a-zA-Z\.]*$/.test(name)) return true
    return false
}
const isValidPassword = function (password) {
    if (/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(password)) return true;
    return false
}
//========================Create user=============================================

const createUser = async function (req, res) {
    try {
        let data = req.body;
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "please give some data" });
        const { name, password } = data;
        if (!name) return res.status(400).send({ status: false, message: "please give name" })
        if (!isValidName(name)) return res.status(400).send({ status: false, message: "name is invalid" })

        if (!password) return res.status(400).send({ status: false, message: "please give password" })
        if (!isValidPassword(password)) return res.status(400).send({ status: false, message: "password is invalid" })

        data.password = await bcrypt.hash(password, 10)

        const user = await userModel.create(data);
        return res.status(201).send({ status: true, message: "user is succcessfully created", data: user })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

//========================User Login===========================================

const userLogin = async function (req, res) {
    try {
        let data = req.body
        const { username, password } = data;

        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "please give some data" });

        if (!username) return res.status(400).send({ status: false, message: "Please enter username" })
        if (!isValidName(username)) return res.status(400).send({ status: false, message: "name is invalid" })

        if (!password) return res.status(400).send({ status: false, message: "please give password" })
        if (!isValidPassword(password)) return res.status(400).send({ status: false, message: "password is invalid" })

        const login = await userModel.findOne({ username })
        if (!login) return res.status(404).send({ status: false, message: "user not found" })

        let decode = await bcrypt.compare(password, login.password);
        if (!decode) return res.status(400).send({ status: false, message: "Password does not match" });

        let token = jwt.sign(
            {
                userId: login._id.toString()
            },
            "No body knows , its secret "
        );
        return res.status(200).send({ status: true, message: "user login successful", data: { userId: login._id, token: token } })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { createUser, userLogin }
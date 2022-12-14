const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const marksController = require("../controllers/marksControllers");
const middleWares = require("../middleware/middleWare")

//=======================User Api's===========================================
router.post("/register",userController.createUser);
router.post("/login",userController.userLogin)

//=======================Marks Api's===========================================

router.post("/createStudent",marksController.createStudent);
router.get("/getDetails/:userId",middleWares.authentication,middleWares.isUserAuthorised,marksController.getStudent);
router.put("/update/:userId",middleWares.authentication,middleWares.isUserAuthorised,marksController.updateStudent);
router.delete("/delete/:userId",middleWares.authentication,middleWares.isUserAuthorised,marksController.deleteStudent)

router.all("/*", function (req, res) {
    res.status(400).send({status: false, message: "Make Sure Your Endpoint is Correct !!!"
    })
})
module.exports = router
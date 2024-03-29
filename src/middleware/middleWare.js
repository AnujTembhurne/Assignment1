const userModel = require('../models/userModel')
const marksModel = require('../models/marksModel')
const jwt = require("jsonwebtoken");

const authentication = async (req, res, next) => {
    try {
      let token = req.headers["x-api-key"]
  
      // console.log(token)
      if (!token)
        return res
          .status(400)
          .send({ status: false, msg: "token must be present" });
  
      jwt.verify(token, "No body knows , its secret ", (err, decodedToken) => {
        if (err) {
          let message =
            err.message === "jwt expired"
              ? "token is expired"
              : "token is invalid";
          return res.status(401).send({ status: false, message: message });
        }
        req.headers = decodedToken;
        next();
      });
    } catch (err) {
      return res.status(500).send({ status: false, message: err.message });
    }
  };
  
  //=========================AUTHORIZATION FOR USER UDPATE===============================
  
  const isUserAuthorised = async (req, res, next) => {
    let userId = req.params.userId;
  
    // if (!isVali(userId))
    //   return res.status(403).send({ status: false, message: "Invalid UserId" });
  
    let isUserPresent = await userModel.findById(userId);
    if (!isUserPresent)
      return res
        .status(404)
        .send({ status: false, message: "User does not exist" });
  
    let loginUserId = req.headers.userId;
    if (loginUserId !== userId) {
      return res
        .status(403)
        .send({ status: false, message: "You are not authorised" });
    }
    next();
  };
  //-------------------------------------------------------------------------------------
  module.exports = { authentication, isUserAuthorised };
const express=require("express");
const jwt = require('jsonwebtoken');
const router=express.Router();
const mongoose=require("mongoose");
const Item=require("../models/Item");

const secretKey="secretkey";
const refreshkey="refreshkey";
//JWT authentication

router.post("/login",(req,res)=>{
    const user=({
        user:"user123",
        password:"123"
    });
    const accessToken = jwt.sign(user, secretKey, { expiresIn: '15m' });
    const refreshToken = jwt.sign(user, refreshkey, { expiresIn: '7d' });
    res.json({ accessToken, refreshToken });
});

const verifyAccessToken = (req, res, next) => {
    const accessToken = req.headers.authorization;
    const refreshToken = req.headers.refreshToken;
  
    if (!accessToken && !refreshToken) {
      return res.status(401).json({ message: 'Access token and refresh token missing' });
    }
  
    try {
      const decoded = jwt.verify(accessToken, secretKey);
      // Access token is valid, proceed to the next middleware or route handler
      req.userId = decoded.userId;
      next();
    } catch (accessTokenError) {
      if (accessTokenError.name === 'TokenExpiredError' && refreshToken) {
        try {
          const decodedRefreshToken = jwt.verify(refreshToken, refreshkey);
          // Refresh token is valid, generate a new access token
          const newAccessToken = jwt.sign({ userId: decodedRefreshToken.userId }, secretKey, { expiresIn: '15m' });
          req.userId = decodedRefreshToken.userId;
          res.set('Authorization', newAccessToken);
          next();
        } catch (refreshTokenError) {
          return res.status(401).json({ message: 'Invalid refresh token' });
        }
      } else {
        return res.status(401).json({ message: 'Invalid access token' });
      }
    }
    console.log('Secret Key:', secretKey);
console.log('Refresh Key:', refreshkey);
  };
  // All CRUD operations
router.post("/api/create",verifyAccessToken, (req,res)=>{
   
    const item1=new Item({
        user:req.body.user,
        password:req.body.password

    });
    item1.save()
    .then(savedData => {
      res.send('Data saved successfully!');
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('An error occurred while saving the data.');
    });
});
router.get("/api/read",verifyAccessToken,(req,res)=>{
    Item.find()
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('An error occurred while fetching the data.');
    });

    });
    
router.patch("/api/:id",verifyAccessToken,(req,res)=>{
    const id=req.params.id;
    Item.find({_id:id})
    .then(data => {
       res.send(data);
      })
      .catch(error => {

        console.error(error);
      });
});

router.delete("/api/:id",verifyAccessToken,(req,res)=>{
    const id=req.params.id;
   Item.deleteOne({ _id: id })
    .then(() => {
    
      res.send('Document deleted successfully!');
    })
    .catch(error => {

      console.error(error);
      res.status(500).send('An error occurred while deleting the document.');
    });
});
router.get('/protected',verifyAccessToken, (req, res) => {
    res.json({ message: 'Protected resource accessed successfully' });
  });



module.exports=router;
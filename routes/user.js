const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

router.post('/signUp',(req,res,next)=>{
    User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          msg: "email already exists"
        });
      } else{
        bcrypt.hash(req.body.password,10,(err,hash)=>{
            if(err){
                return res.status(500).json({
                    error:err
                });
            }else{
                const user= new User({
                    _id: new mongoose.Types.ObjectId(),
                    email: req.body.email,
                    password:hash
                  });
                  user.save().then(result=>{
                      console.log(result);
                      res.status(201).json({
                          msg:"User Created Successfully",   
                      });
                  }).catch(err=>{
                    res.status(500).json({
                        msg:"User can not be created",
                        error:err    
                    });
                  });
                
            }
        }); 
      }
    })
});


router.post('/login',(req,res,next)=>{
    User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          msg: "no such email exist"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            msg: "password is invalid"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id
            },
            process.env.TOKEN_KEY,
            {
                expiresIn: "1h"
            }
          );
          return res.status(200).json({
            msg: "login successful",
            token: token
          });
        }
        res.status(401).json({
          msg: "password is invalid"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });

});




router.delete('/:id',(req,res)=>{
    var id = req.params.id
    User.findByIdAndDelete({_id:id}).exec().then(doc =>{
        res.status(200).json({
            msg:"User deleted Successfully",
        });
    }).catch(err =>{
        res.status(500).json({
            error:err
        })
    })
});





module.exports = router
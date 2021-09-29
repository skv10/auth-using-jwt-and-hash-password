const express = require('express');
const router = express.Router();

const Product = require("../models/product");
const jwtAuth = require("../Authentication Folder/auth")

router.get('/',(req,res)=>{
    Product.find().select('name price').exec().then(docs =>{
        if(docs.length >=0){
            res.status(200).json(docs);
            
        }else{
            res.status(200).json({msg:"No data found"})
        }
    }).catch(err =>{
        res.status(500).json({
            error:err
        });
    });
});

router.post('/',jwtAuth,(req,res)=>{
   const product =new Product({
       name:req.body.name,
       price:req.body.price
   });
   product.save().then(result =>{
       res.status(201).json({
           message:"Product created successfully",
           data:{
               name:result.name,
               price:result.price
           }
       })
   }).catch(err =>{
       res.status(500).json({error:err})
   });
});

router.get('/:id',(req,res)=>{
    var id = req.params.id
    Product.findById(id).select('name price').exec().then(doc =>{
        console.log(doc);
        if(doc){
            res.status(200).json(doc);

        }else{
            res.status(404).json({message:"No valid entry found for id"});
        }
    }).catch(err =>{
        console.log(err);
        res.status(500).json({error:err})
    })
});

router.put('/:id',(req,res)=>{
    var id = req.params.id;
    const updateOps ={};
    for (const ops of req.body){
        updateOps[ops.propName]=ops.value;
    }
    Product.updateOne({_id:id},{$set:updateOps}).exec().then(result =>{
        res.status(201).json(result);
    }).catch(err =>{
        res.status(500).json({
            error:err
        });
    });
});

router.delete('/:id',(req,res)=>{
    var id = req.params.id
    Product.findByIdAndDelete({_id:id}).exec().then(doc =>{
        res.status(200).json({
            msg:"Product deleted Successfully",
            data:{
                name:doc.name,
                price:doc.price
            }
        });
    }).catch(err =>{
        res.status(500).json({
            error:err
        })
    })
});


module.exports = router;
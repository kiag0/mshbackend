
// middleware to check authentication
const CheckAuth = require('../middleware/check-auth');
//prog model
const Program = require('../models/program');
const express = require('express');
const router = express.Router();


router.get('', (req, res, next) => {
    let fetchedProgs;
    Program.find()
    .then(documents => {
        res.status(200).json({
            programs: documents
        })
    })
    .catch( err => {
        res.status(401).json({
            programs: documents,
            message: 'We experienced an error'
        }) 
    })
}); 


  // add prog to db
  router.post("",CheckAuth, (req, res, next) => {
    const prog = new Program({
      title: req.body.title,
      songs: req.body.songs,
      creator: req.userData.phone
    });
    prog.save().then(createdProg => {
      res.status(201).json({
        message: "song added successfully",
        progId: createdProg._id
      });
    });
  });
  //edit program
  router.put('/:id', CheckAuth,(req, res, next) => {
    
    const prog = req.body;
    console.log (" => " + JSON.stringify(req.body));
    prog._id = req.params.id;
    Program.updateOne({_id: req.params.id}, prog)
    .then(result => {
       console.log(result);
       res.status(200).json({message: "edit successful"});
    })
    .catch(err => {
      console.log(err);
    })
  });
  
  //delete given song
  router.delete("/:id",CheckAuth, (req, res, next) => {
    Song.deleteOne({ _id: req.params.id }).then(result => {
      console.log(result);   
      res.status(200).json({ message: "song deleted!" });
    });
  });

module.exports = router;
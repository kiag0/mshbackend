
/*
  # all routes for song manipulation
*/


const express = require('express');
const router = express.Router();
//hymn model
const Song = require('../models/song'); 
// middleware to check authentication
const CheckAuth = require('../middleware/check-auth');


// add song to db
router.post("",CheckAuth, (req, res, next) => {
    console.log(req.body);
    const song = new Song({
      title: req.body.title,
      category: req.body.category,
      stanzas:req.body.stanzas,
      chorus:req.body.chorus,
      author:req.body.author
  
    });
    song.save().then(createdSong => {
      res.status(201).json({
        message: "song added successfully",
        songId: createdSong._id
      });
    });
  });
  
  // load songs to ui
  router.get("", (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    let fetchedSongs;
    const songQuery = Song.find();
  
    if(pageSize && currentPage) {
      songQuery
      .skip(pageSize*(currentPage-1))
      .limit(pageSize);
    }
  
    songQuery.find().then(documents => {
      fetchedSongs = documents;
      return Song.count()
    })
      .then(count => {
        res.status(200).json({
          message: "songs fetched successfully!",
          songs: fetchedSongs,
          maxSongs: count
        });
      });
  });
  
  //edit song
  router.put('/:id', CheckAuth,(req, res, next) => {
    
    const song = req.body;
    console.log (" => " + JSON.stringify(req.body));
    song._id = req.params.id;
    Song.updateOne({_id: req.params.id}, song)
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

  // get songs on given category


module.exports = router;
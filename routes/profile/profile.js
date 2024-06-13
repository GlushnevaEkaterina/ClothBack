const express = require('express');
const {knex}=require('../../config/databaseConfig');
const auth = require('../../auth');
const router = express.Router();

router.get('/',auth, async(req,res)=>{
    const id = req.user_id
    const profile = await knex.select("*")
    .from("profiles")
    .where('profiles.id',id)

    const posts = await knex.select('id', 'uri_post').from('posts').where('posts.profile_id', profile[0].id);

    const responseJson = {
        ...profile[0],
        posts,
    };

  
    res.json(responseJson)
})


module.exports = router;
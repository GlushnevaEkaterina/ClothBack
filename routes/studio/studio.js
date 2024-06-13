const express = require('express');
const router = express.Router();
const {knex}=require('../../config/databaseConfig');
const auth = require('../../auth');

router.get('/',auth, async(req,res)=>{
    const id = req.user_id
  const prob = await knex
  .select('collages.id','collages.name','collages.uri_collage',
  knex.raw('SUM(items.price) as sum'),
  knex.raw('COUNT(items_collage.item_id) as count'))
  .from ('collages')
  .leftJoin('items_collage','collages.id','items_collage.collage_id')
  .leftJoin('items','items_collage.item_id','items.id')
  .where('collages.profile_id',id)
  .groupBy('collages.id')
  res.json(prob)
})

module.exports = router;
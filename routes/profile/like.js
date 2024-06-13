const express = require('express');
const router = express.Router();
const {knex}=require('../../config/databaseConfig');
const auth = require('../../auth');
// const auth = require('../auth');

router.get('/all', async(req, res) => {
  const items = await knex.select("*").from("items")
  res.json(items)
});

router.get('/like',auth, async(req, res) => {
  const id = req.user_id
  const items = await knex.select('items.id as id', 'items.item_name as name', 'shops.shop_name', 'uri_images.uri_image', 'items.price', 'items.sale', 'items.sale_price')
  .from("likes")
  .leftJoin('items', 'likes.item_id', 'items.id')
  .leftJoin('uri_images','items.uri_image_id','uri_images.id')
  .leftJoin('shops', 'shops.id', 'items.shop_id')
  .where('likes.profile_id', id)

  res.json(items)
});


module.exports=router;
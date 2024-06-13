const express = require('express');
const router = express.Router();
const {knex}=require('../../config/databaseConfig');
const auth = require('../../auth');

router.get('/collage/add', async(rea,res)=>{
  const item = await knex.select('*').from('uri_images').rightJoin('items','items.uri_image_id','uri_images.id')
  res.json(item)
})

router.post('/collage/save', auth, express.json(), async(req,res)=>{
    const id = req.user_id
  const reqert = req.body;
  const name = await knex.select("id")
    .from("collages")
    .where('profile_id',id)
    .andWhere('name',reqert.name)
    if (name.length!=0){
      return res.send(
        {
         massage:'Такое название коллажа у вас уже существует. Придумайте другое название'
        }
      )
    }
  await knex('collages').insert({
    name: reqert.name,
    uri_collage: reqert.uri_collage,
    profile_id: id,
    description: reqert.description
  })

  const collage_id = await knex.select("id")
    .from("collages")
    .where('profile_id',id)
    .andWhere('name',reqert.name)

  for (i=0;i<=reqert.items.length-1; i++){
    await knex('items_collage').insert({
      item_id: reqert.items[i].id, 
      haight: reqert.items[i].height, 
      collage_id: collage_id[0].id,
      width: reqert.items[i].width,
      x: reqert.items[i].x,
      y: reqert.items[i].y,
      rotation: reqert.items[i].rotation,
      scale: reqert.items[i].scale,
      zindex: reqert.items[i].zindex,
      flip: reqert.items[i].flip,
    })
    console.log(i)
  }
  return res.send({
    massage:'Коллаж добавлен'
  })
})

router.post('/collage/element', express.json(), async(req,res)=>{
  const reqert = req.body;
  const data = {
    uri_image: reqert.uri_image,
    elements: reqert.elements
  }
  console.log('data', data);
  let response = await fetch(
        'https://c06d-34-139-242-202.ngrok-free.app/studio/collage/element',
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify(data),
        }
      )
        .then(async response => await response.json(response))
        .then(async resData => {
          console.log('resData', resData[0].height);
          })
        .catch(err => {
          console.log('----------', err)
          return err
        })
        return res.send({
    massage:'Коллаж добавлен'
  })
    })


module.exports = router;
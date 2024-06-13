const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken')

const router = express.Router();
const auth = require('../auth');
const {knex}=require('../config/databaseConfig');


router.post('/login', express.json(), async (req, res) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.send({
                success: false,
                message: "Логин или пароль не введны",
                data: null,
            });
        } else {
            const user = await knex('profiles').select('id','password').where('email', email).first();
            if (user) {
                const comparePassword = await bcryptjs.compare(password, user.password);

                if (comparePassword) {
                    const token = jwt.sign(user.id, "jgvchgvfkuycvjhvkcuvwljchvyucvhj")

                    return res.send({
                        success: true,
                        message: "Авторизация прошла успешно",
                        data: {
                            token,
                            id: user.id,
                        }
                    })
                } else {
                    return res.send({
                        success: false,
                        message: "Неверный логин или пароль",
                        data: null,
                    })
                }
            }
            else{
                return res.send({
                    success: false,
                    message: "Неверный логин или пароль",
                    data: null,
                })
            }
        }
    } catch (error) {
        console.log('error login', error)
    }
})

router.post('/register', express.json(), async (req, res) => {
    try {
        const { email, password , name, sex} = req.body;
        if (!email || !password || !name) {
            return res.send({
                success: false,
                message: 'Пожалуйста введите ваши данные',
                data: null,
            })
        }
        
        const user = await knex('profiles').select('id','password').where('email', email).first();

        if (user) {
            return res.send({
                success: false,
                message: 'Этот email уже занят',
                data: null,
            })
        }
            
        const hash_password = await bcryptjs.hash(password, 12);
        const result = await knex('profiles').insert({
            email: email,
            password: hash_password,
            name: name,
            sex: sex
        });

        const user_id = { 
            user_id: result,
        };
        const token = jwt.sign(user_id, "jgvchgvfkuycvjhvkcuvwljchvyucvhj");

        if (result) {
            return res.send({
                success: true,
                message: 'Регестрация прошла успешно',
                data: {
                    token: token,
                }
            }) 
        }

        return res.send({
            success: false,
            message: 'Произошла ошибка',
            data: null,
        });
    } catch (error) {
        return res.send({
            success: false,
            message: error.message,
            data: null,
        })

    }
});

router.post('/register/body', auth, express.json(),async(req,res)=>{

    const id = req.user_id
    console.log('id======',id)
    const param = req.body;
    await knex('profiles')
          .where('id','=', id)
          .update({
            name: param.name,
            height: param.height,
            shoulders: param.shoulders,
            breast: param.breast,
            waist: param.waist,
            hips: param.hips            
          })
          .then(()=>{
            res.json({
                success: true,
                    message: 'Параметры изменены',
                    data: null
            })
          }).catch(error=>{
            res.json({
                successe: false,
                    message: error.message,
                    data: null,
            })
          })
})

module.exports = router;

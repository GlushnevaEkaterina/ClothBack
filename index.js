const express = require('express');
const app = express();

const userRoute = require('./routes/user')
const profileRoute = require('./routes/profile/profile')
const likeRoute = require('./routes/profile/like')
const studioRoute = require('./routes/studio/studio')
const collageRoute = require('./routes/studio/collage')

const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.use('/user', userRoute);
app.use('/profile', profileRoute);
app.use('/profile', likeRoute)
app.use('/studio', studioRoute)
app.use('/studio', collageRoute)

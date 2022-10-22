const path = require('node:path');
const express = require('express');
const dotenv = require('dotenv');
const webPush = require('web-push');

dotenv.config();

const app = express();

app.use(express.static(path.join(__dirname, 'static')));
app.use(express.json());

webPush.setVapidDetails(
    'mailto:lautarojgarcia177@gmail.com',
    process.env.VAPID__PUBLIC_KEY,
    process.env.VAPID__PRIVATE_KEY
);

app.get("/vapidPublicKey", (req,res,next) => {
    res.send(process.env.VAPID__PUBLIC_KEY);
});

app.post("/suscribir", function (req, res, next) {
    webPush.sendNotification(
        req.body,
        JSON.stringify({
            title: 'Notificacion push',
            options: {
                body: 'Hola mundo'
            }
        })
    )
});

app.listen(process.env.PORT, () => console.log(`Servidor ejecutandose en http://localhost:${process.env.PORT}`));
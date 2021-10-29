import express from 'express';
import cors from 'cors'
import listEndpoints from 'express-list-endpoints';
import mediaRouter from './services/media/media.js'
import reviewsRouter from './services/reviews/reviews.js'


const server = express()

const whitelist = [process.env.FE_URL , process.env.FE_DEV_URL]
const corsOptions = {
    origin : function (origin, next) { 
        if (!origin || whitelist.indexOf(origin) !== -1) {
            next(null , true)
        } else {
            next(new Error("CROSS ORIGIN ERROR"))
        }
    }
}

server.use(cors(corsOptions));
server.use(express.json())


//endpoints
server.use("/media" , mediaRouter)
server.use("/reviews" , reviewsRouter)


//error handlers


const port = process.env.PORT

console.table(listEndpoints(server));

server.listen(port)
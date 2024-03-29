import * as express from 'express'
import * as mongoose from 'mongoose';
import * as mysql from 'mysql';
import productRouter from './Routers/productRouter';
import userRouter from './Routers/userRouter';
import orderRouter from './Routers/orderRouter';
import categoryRouter from './Routers/categoryRouter';
import * as cors from 'cors';
import * as morgan from 'morgan'
import * as bodyParser from 'body-parser'


import cartRouter from './Routers/cartRouter';

import * as path from 'path'
import reviewRouter from './Routers/reviewRouter';
import  transactionRouter  from './Routers/transactionRouter';
import appRouter from './Routers/appRouter';
import featuresRouter from './Routers/featuresRouter';

export class Server {
    app: express.Application = express();
    constructor() {
        this.setConfiguration();
        this.setRouter();
        this.error404Handler();
        this.handleErrors();
    }
    setConfiguration() {
        this.configureBodyParser();
        // this.connectsqlDB();
        this.connectMongoDB();
        // this.handlebarsTemplate();
        // this.setSession();
        // this.connectToFlash();
        this.enableCors();
    }
    connectsqlDB() {
        mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',

        }).connect((err) => {
            console.log('mysql connected successfully', err)
        });

    }

    async connectMongoDB() {

        try {
            const uri = "mongodb+srv://vg100:vg100@cluster0.bszog.mongodb.net/test";
            mongoose.connect(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            console.log("You successfully connected to MongoDB!");
        } finally {
            //   await client.close();
        }

    }
    //get data in json format from the user
    configureBodyParser() {
        this.app.use(bodyParser.urlencoded({ extended: true }))
        this.app.use(bodyParser.json())
        this.app.use(express.json())
        // this.app.use(morgan('tiny'))
    }

    enableCors() {
        this.app.use(cors({
            allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token', 'Authorization'],
            credentials: true,
            methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
            origin: '*',
            preflightContinue: false
        }));
    }

    handlebarsTemplate() {
        this.app.use(express.static(path.join(__dirname, "../public")));
        this.app.set('views', path.join(__dirname, 'views'));
        this.app.set('view engine', 'hbs');
    }

    setRouter() {
        this.app.use('/', appRouter);
        this.app.use('/api/v1/users', userRouter);
        this.app.use('/api/v1/categories', categoryRouter);
        this.app.use('/api/v1/features', featuresRouter);
        this.app.use('/api/v1/cart', cartRouter);
        this.app.use('/api/v1/products', productRouter);
        this.app.use('/api/v1/orders', orderRouter);
        this.app.use('/api/v1/reviews', reviewRouter);
        this.app.use('/api/v1/transaction', transactionRouter);
    }

    handleErrors() {
        this.app.use((error: any, req: any, res: any, next: any): void => {
            let errorStatus = req.errorStatus || 500
            res.status(errorStatus).json({
                message: error.message,
                status_code: errorStatus
            })
        })

    }

    error404Handler() {
        this.app.use((req, res) => {
            res.status(404).json({
                message: 'Not Found',
                status_code: 404,
            })
        });
    }


}



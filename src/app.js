import express from "express";
import morgan from "morgan";
import cors from 'cors'
import * as dotenv from 'dotenv'
import employeesRoutes from './routers/employees/employees.routes.js'
import indexRoutes from "./routers/index.routes.js"
import auth from './routers/auth.routes.js'
dotenv.config()


const app = express();

app.use(cors(/*{
    origin: function (origin, collback) {
        if (whiteList.includes(origin)) {
            return collback(null, origin)
        }
        return collback("Error de CORS origin: "+ origin+ " No autorizado")
    }
}*/));

app.use(morgan('dev'));
app.use(express.json())

app.use('/',indexRoutes)
app.use('/api/v1/auth',auth)
app.use('/api/v1',employeesRoutes)



export default app;
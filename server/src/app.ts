import express, {
    type NextFunction,
    type Request,
    type Response,
} from 'express'
import 'reflect-metadata'
import { HttpError } from 'http-errors'
import logger from './config/logger.ts'
import cors from 'cors'
import chatRouter from './routes/chat.ts'

const app = express()
app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
    return res.send('Welcome to Expense Agent endpoints!')
})

/*
Middleware: for service routes. 
*/
app.use('/chat', chatRouter)

/*
Global error handler.
*/
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.stack)

    res.status(err.statusCode).json({
        errors: [
            {
                type: err.name,
                message: err.message,
                path: '',
                location: '',
            },
        ],
    })
})

export default app
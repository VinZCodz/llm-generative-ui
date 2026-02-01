import app from './app.ts'
import logger from './config/logger.ts'

const startServer = () => {
    const PORT = process.env.PORT
    try {
        app.listen(PORT, () =>
            logger.info(`Server up and running at PORT:${PORT}`)
        )
    } catch (error) {
        logger.warn(error)
        process.exit(1)
    }
}

startServer()
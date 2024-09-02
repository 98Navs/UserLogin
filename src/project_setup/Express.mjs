//src/project_setup/Express.mjs
import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import compression from 'compression';
import * as Routes from "../routes/AllRoutes.mjs";
import cluster from 'cluster';

const setupExpressApp = async () => {
    const app = express();
    app.use(compression());
    app.use(cookieParser());
    app.use(express.json({ limit: '1mb' }));
    app.use(express.urlencoded({ extended: true, limit: '1mb' }));
    app.use(cors({
        credentials: true,
        origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:5173', 'http://localhost:1102', 'https://user-login-phi-sooty.vercel.app']
    }));
    app.use(express.static('src/public'));

    // // Middleware for Worker ID and Logging
    // app.use((req, res, next) => {
    //     const workerId = cluster.worker?.id || 'unknown';
    //     res.setHeader('X-Worker-ID', workerId);
    //     console.log(`Worker ${workerId} - ${req.method} ${req.url} - ${new Date().toISOString()}`);
    //     next();
    // });

    // Mount routes
    Object.values(Routes).forEach(route => app.use(route));

    // Start the server
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT} for Worker ${process.pid}`));

    return app;
};

export default setupExpressApp;
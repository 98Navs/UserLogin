//src/project_setup/Express.mjs
import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import * as Routes from "../routes/AllRoutes.mjs";

export default async function setupExpressApp() {
    const app = express();
    app.use(cookieParser());
    app.use(express.json({ limit: '1mb' }));
    app.use(express.urlencoded({ extended: true, limit: '1mb' }));
    app.use(cors({
        credentials: true,
        origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:5173', 'http://localhost:1102', 'https://user-login-phi-sooty.vercel.app', 'https://documentverification-two.vercel.app']
    }));

    app.use(express.static('src/public'));

    // Mount routes
    Object.values(Routes).forEach(route => app.use(route));

    // Start the server
    app.listen(process.env.PORT, () => { console.log(`Server is running on port ${process.env.PORT} `); });

    return app;
}
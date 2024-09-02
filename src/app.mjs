import express from 'express';
import connectToDatabase from './project_setup/Database.mjs';
import setupExpressApp from './project_setup/Express.mjs';
import cluster from 'cluster';
import os from 'os';
import dns from 'dns';
import { monitorEventLoopDelay } from 'perf_hooks';

const numCPUs = os.cpus().length;

export default numCPUs ;
const MEMORY_USAGE_THRESHOLD = 100 * 1024 * 1024; // 100 MB
const EVENT_LOOP_DELAY_THRESHOLD = 500; // 500 ms

const setupWorker = async () => {
    const app = express();
    await connectToDatabase();
    await setupExpressApp(app);

    // Memory Management and Event Loop Monitoring
    const memoryInterval = setInterval(() => {
        const { rss } = process.memoryUsage();
        if (rss > MEMORY_USAGE_THRESHOLD) console.warn(`High Memory Usage (Worker ${process.pid}): ${rss}`);
    }, 10000);

    const eventLoopDelay = monitorEventLoopDelay().enable();
    const eventLoopInterval = setInterval(() => {
        const delay = eventLoopDelay.mean / 1e6; // ms
        if (delay > EVENT_LOOP_DELAY_THRESHOLD) console.warn(`High Event Loop Delay (Worker ${process.pid}): ${delay.toFixed(2)} ms`);
    }, 10000);

    // DNS Caching
    dns.setServers(['8.8.8.8', '8.8.4.4']);
};

const startCluster = () => {
    console.log(`Master ${process.pid} is running`);
    Array.from({ length: numCPUs }, () => cluster.fork());
    cluster.on('exit', worker => {
        console.log(`Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork();
    });
};

cluster.isPrimary ? startCluster() : setupWorker();

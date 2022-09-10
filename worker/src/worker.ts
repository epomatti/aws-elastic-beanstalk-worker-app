var http = require('http');
require('dotenv').config();

const WORKER_PORT: number = Number(process.env.WORKER_PORT);
const LONG_RUNNING_TASK_DURATION: number = Number(process.env.LONG_RUNNING_TASK_DURATION);

const delay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const start = async () => {
  http.createServer(function (req: any, res: any) {

    // Simulates a long-running process
    console.log("Processing 1 message")
    delay(LONG_RUNNING_TASK_DURATION);

    res.write('');
    res.end();
    
  }).listen(WORKER_PORT);
}

export { start };
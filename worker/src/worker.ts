import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';

const WORKER_PORT: number = Number(process.env.WORKER_PORT);
const LONG_RUNNING_TASK_DURATION: number = Number(process.env.LONG_RUNNING_TASK_DURATION);

const delay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const start = async () => {

  const app = express()
  const port = WORKER_PORT

  app.post('/', (req: any, res: any) => {
    console.log("received message");
    delay(LONG_RUNNING_TASK_DURATION);
    res.send('Ok')
  })

  app.get('/health', (req: any, res: any) => {
    res.send('Ok')
  })

  app.listen(port, () => {
    console.log(`Worker endpoint started on port ${port}`)
  })
}

export { start };

require('dotenv').config();

const WORKER_PORT: number = Number(process.env.WORKER_PORT);
const LONG_RUNNING_TASK_DURATION: number = Number(process.env.LONG_RUNNING_TASK_DURATION);

const delay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const start = async () => {

  const express = require('express')
  const app = express()
  const port = WORKER_PORT

  app.get('/', (req: any, res: any) => {
    console.log("received message");
    delay(LONG_RUNNING_TASK_DURATION);
  })

  app.get('/health', (req: any, res: any) => {
    res.send('Ok')
  })

  app.listen(port, () => {
    console.log(`Worker endpoint started on port ${port}`)
  })
}

export { start };
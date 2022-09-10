import * as worker from './worker'

(async () => {
  try {
    await worker.start();
  } catch (e) {
    console.error(e);
  }
})();

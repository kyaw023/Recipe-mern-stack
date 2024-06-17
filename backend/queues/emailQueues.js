const Queue = require("bull");

const emailQueue = new Queue("audio transcoding", {
  redis: { port: 6379, host: "127.0.0.1" },
});

emailQueue.process((job) => {
  setTimeout(async () => {
    await sendEmail(job.data);
  }, 5000);
});

module.exports = emailQueue;

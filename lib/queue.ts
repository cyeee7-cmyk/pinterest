import Queue from "bull";

let pinQueue: Queue.Queue | null = null;

export function getPinQueue() {
  if (!pinQueue) {
    // 使用内存存储（开发用），生产应使用Redis
    pinQueue = new Queue("pin-publish", {
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
      },
    });
  }
  return pinQueue;
}

export async function schedulePinPublish(
  pinId: string,
  scheduledAt: Date
) {
  const queue = getPinQueue();
  const delay = scheduledAt.getTime() - Date.now();

  if (delay < 0) {
    throw new Error("定时时间不能早于现在");
  }

  await queue.add(
    { pinId },
    {
      delay,
      jobId: pinId,
    }
  );
}

export function setupPinQueueProcessor() {
  const queue = getPinQueue();

  queue.process(async (job) => {
    const { pinId } = job.data;
    console.log(`发布Pin: ${pinId}`);

    // 这里会在时间到达时执行
    // 实际发布到Pinterest的逻辑
    return { success: true, pinId };
  });

  queue.on("completed", (job) => {
    console.log(`Pin ${job.id} 发布成功`);
  });

  queue.on("failed", (job, err) => {
    console.error(`Pin ${job.id} 发布失败:`, err);
  });
}

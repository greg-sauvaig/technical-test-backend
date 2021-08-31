const sleep = (interval) => {
  const start = new Date().getTime();
  while (true) {
    const now = new Date().getTime();
    if (now - start >= interval) {
      return;
    }
  }
};

export const compute = async (payload) => {
  sleep(3000);
  return Object.assign(payload, { slow_computation: "0.0009878" });
};

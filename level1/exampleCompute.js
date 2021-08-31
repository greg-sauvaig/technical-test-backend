import { compute } from "./lib/slowComputation.js";

const exampleCompute = async () => {
  const oneLog = {
    id: "2acc4f33-1f80-43d0-a4a6-b2d8c1dbbe47",
    service_name: "web",
    process: "web.1089",
    load_avg_1m: "0.04",
    load_avg_5m: "0.10",
    load_avg_15m: "0.31",
  };
  const result = await compute(oneLog);
  console.log(result);
};

exampleCompute();

const choose = (choices) => {
  var index = Math.floor(Math.random() * choices.length);
  return choices[index];
};

const getRandomInt = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};

const getRound = (toRound) => {
  return Math.round((toRound + Number.EPSILON) * 100) / 100;
};

const sample = (uuid) => {
  const service = choose(["web", "admin", "api"]);
  return [
    `id=${uuid}`,
    `service_name=${service}`,
    `process=${service}.${getRandomInt(1, 4001)}`,
    `sample#load_avg_1m=${getRound(Math.random())}`,
    `sample#load_avg_5m=${getRound(Math.random())}`,
    `sample#load_avg_15m=${getRound(Math.random())}`,
  ];
};

exports.default = sample;

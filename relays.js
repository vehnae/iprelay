const Gpio = require('onoff').Gpio;
const config = require('./config');

const gpios = [];
const state = [];

config.relays.forEach(relay => {
    gpios.push(new Gpio(relay.pin, 'out'));
    state.push(false);
})

module.exports = {
  state: () => state,
  on: (relayIndex) => {
    gpios[relayIndex].writeSync(1);
    state[relayIndex] = true;
  },
  off: (relayIndex) => {
    gpios[relayIndex].writeSync(0);
    state[relayIndex] = false;
  },
  pulse: (relayIndex) => {
    gpios[relayIndex].writeSync(1);
    state[relayIndex] = true;
    setTimeout(() => {
      gpios[relayIndex].writeSync(0);
      state[relayIndex] = false;
    }, 1000);
  }
}

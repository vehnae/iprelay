const { exec } = require('child_process');
const config = require('./config');

const state = [];

config.relays.forEach(relay => {
    state.push(false);
})

module.exports = {
  state: () => state,
  on: (relayIndex) => {
    exec(`gpio write ${config.relays[relayIndex].pins} 0`);
    state[relayIndex] = true;
  },
  off: (relayIndex) => {
    exec(`gpio write ${config.relays[relayIndex].pins} 1`);
    state[relayIndex] = false;
  },
  pulse: (relayIndex) => {
    exec(`gpio write ${config.relays[relayIndex].pins} 0`);
    state[relayIndex] = true;
    setTimeout(() => {
      exec(`gpio write ${config.relays[relayIndex].pins} 1`);
      state[relayIndex] = false;
    }, 1000);
  }
}

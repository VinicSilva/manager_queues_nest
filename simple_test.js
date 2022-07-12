'use strict';

const axios = require('axios').default;
const later = (delay, value) => new Promise((resolve) => setTimeout(resolve, delay, value));

[1].map(async fakeContact => {
  for (let fakeMessage = 1; fakeMessage <= 10;fakeMessage++) {
    const message = {
      contactKey: `jb${fakeContact}`,
      message: `Contact ${fakeContact} - Message XPTO ${fakeMessage}`
    }
    await later(1000, 'DELAY');
    axios.post('http://localhost:3008', message).then(res => console.log(res.data));
  }
})


'use strict';

const axios = require('axios').default;


[1,2,3,4,5].map(async fakeContact => {
  for (const fakeMessage of [1,2,3,4,5]) {
    const message = {
      contactKey: `jb${fakeContact}`,
      message: `Contact ${fakeContact} - Message XPTO ${fakeMessage}`
    }
    const later = (delay, value) => new Promise((resolve) => setTimeout(resolve, delay, value));
    await later(1000, 'DELAY');
    axios.post('http://localhost:3008', message).then(res => console.log(res.data));
  }
})


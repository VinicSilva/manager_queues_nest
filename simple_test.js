'use strict';

const axios = require('axios').default;
const later = (delay, value) => new Promise((resolve) => setTimeout(resolve, delay, value));

function uid() {
  return (performance.now().toString(36)+Math.random().toString(36)).replace(/\./g,"");
};

[1,2,3,4,5].map(async fakeContact => {
  for (let fakeMessage = 1; fakeMessage <= 5;fakeMessage++) {
    await later(1000, 'DELAY');
    const message = {
      traceId: uid(),
      contactKey: `jb${fakeContact}`,
      message: `Contact ${fakeContact} - Message XPTO ${fakeMessage}`
    }
    
    axios.post('http://localhost:3008', message).then(res => console.log(res.data));
  }
})


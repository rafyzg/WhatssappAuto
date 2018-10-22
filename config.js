module.exports = function(rabbit) {
    return rabbit.configure({
        connection: {
            name: "WhatssappAuto"
        },
        exchanges: [
            { name: "whatssapp.exchange"}
        ],
        queues:[
          { name:"whatssapp.q", limit: 1},
          ],
        bindings:[
        { exchange: "whatssapp.exchange", target: "whatssapp.q", keys: ["block", "message", "group"] },
        ]
      }).then(null, (err) => {
        console.log("Rabbitmq receiver connection error");
        console.log(err.stack);
        process.exit(1);
    });
}; 

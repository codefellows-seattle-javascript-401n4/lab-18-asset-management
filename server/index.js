'use strict';

require(__dirname + '/server').start();
server.listen(process.env.PORT || 3000);
console.log('server started on port ' + process.env.PORT || 3000);

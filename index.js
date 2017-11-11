'use strict';
require('dotenv').config();

require(__dirname + '/lib/server').start(process.env.BACKEND_PORT || 3000);
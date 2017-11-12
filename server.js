'use strict';

require('dotenv').config();
require('./lib/_server').start(process.env.PORT);

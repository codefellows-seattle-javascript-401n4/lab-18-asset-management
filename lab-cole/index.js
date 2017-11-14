'user strict';

require('dotenv').config()//Do I need to install something for env?
require('./lib/server.js').start()

//Why do we require the above two lines without assigning them to a variable?
//What does .config() do?

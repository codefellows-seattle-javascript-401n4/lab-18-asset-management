

*model/image*

 _name_ STRING Name of image file
 _path_ STRING Path to image file



To run via command line: 

1. _start the database_
mkdir db
mongod --dbpath=./db

2. _start server in a 2nd terminal_
nodemon server.js  

3. _make a POST to create a new Image, in a 3rd terminal_ 

 `http $ echo '{"path":"<relative-path-to-image>", "name":"<name-of-image>"}' | http POST localhost:3000/api/1.0/image`

 This returns an _id

4. _now make a POST to upload the image file_

`http -f POST localhost:3000/api/1.0/image/<_id> name='photo' photo@<absolute_path_to_file>`



To run via test:

1. _start the database_
mkdir db
mongod --dbpath=./db

2. _run tests in a 2nd terminal_
npm test
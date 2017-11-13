

#### Description
* created an AWS account
* created an AWS Access Key and Secret
  * added the Access Key and Secret to your `.env` file
* created a new model that represents a file type that you want to store on AWS S3
  * ex: `.mp3`, `.mp4`, `.png`, etc
* created a test that uploads one of these files to your route
* used the `aws-sdk` to assist with uploading
* used `multer` to parse the file upload request

#### Server Endpoint
* `POST` - `/api/upload`- uploads the image to mongodb
* `POST` - `/api/amazon/:id`-finds image by ID and uploads it to the bucket

#### Tests
* `POST` - **200** - test that the upload worked and a resource object is returned
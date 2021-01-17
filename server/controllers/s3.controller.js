let aws = require('aws-sdk')
let multer = require('multer')
let multerS3 = require('multer-s3')

aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  });

let s3 = new aws.S3({ /* ... */ })
 
let upload = multer({
  storage: multerS3({
    s3: s3,
    acl: 'public-read',
    bucket: 'mernsocial.img',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, req.s3key)
    }
  })
})

const singleImageUpload = upload.single('image')
const uploadToS3 = (req, res) => {
        req.s3key = new Date().toISOString()
        return new Promise((resolve, reject) => {
        let resource_url = `https://s3.ap-northeast-2.amazonaws.com/mernsocial.img/${req.s3key}`
        console.log(1)
        singleImageUpload(req, res, (err) => {
        if (err){
            reject(err)
            }
        resolve(resource_url)
        })
}
        )
}

export default uploadToS3;
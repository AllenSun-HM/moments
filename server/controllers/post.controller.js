import Post from '../models/post.model'
import errorHandler from './../helpers/dbErrorHandler'
import uploadToS3 from './s3.controller'
const create = async (req, res, next) => {
  
    uploadToS3(req, res).then(url => {
      res.set('Cache-Control', 'public, max-age=30000')
      let post = new Post({
        text: req.body.text,
        photo: url,
        postedBy: req.profile
      })
      res.json(post)
      console.log(req.profile)
      post.save()
    })
    .catch(err => {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    })
  }


const postByID = async (req, res, next, id) => {
  try{
    let post = await Post.findById(id).populate('postedBy', '_id name').exec()
    if (!post)
      return res.status('400').json({
        error: "Post not found"
      })
    req.post = post
    next()
  }catch(err){
    return res.status('400').json({
      error: "Could not retrieve use post"
    })
  }
}

const listByUser = async (req, res) => {
  try{
    let posts = await Post.find({postedBy: req.profile._id})
                          .populate('comments.postedBy', '_id name')
                          .populate('postedBy', '_id name')
                          .sort('-created')
                          .exec()
    res.set('Cache-Control', 'public, max-age=3000')
    res.json(posts)
  }catch(err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const listNewsFeed =  async  (req, res) => {
  let following = req.profile.following
  following.push(req.profile._id)
  try{
    let posts = await Post.find({postedBy: { $in : req.profile.following } })
                          .populate('comments.postedBy', '_id name')
                          .populate('postedBy', '_id name')
                          .sort('-created')
                          .exec()
    res.set('Cache-Control', 'public, max-age=10')

    res.json(posts)
  }catch(err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const remove = async (req, res) => {
  let post = req.post
  try{
    let deletedPost = await post.remove()
    res.json(deletedPost)
  }catch(err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const photo = (req, res, next) => {
    console.log(req)
    res.set("Content-Type", req.post.image.contentType)
    res.set('Cache-Control', 'public, max-age=3000')
    return res.send(req.post.image.data)
}

const like = async (req, res) => {
  try{
    let result = await Post.findByIdAndUpdate(req.body.postId, {$push: {likes: req.body.userId}}, {new: true})
    res.set('Cache-Control', 'public, max-age=3000')
    res.json(result)
  }catch(err){
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
  }
}

const unlike = async (req, res) => {
  try{
    let result = await Post.findByIdAndUpdate(req.body.postId, {$pull: {likes: req.body.userId}}, {new: true})
    res.set('Cache-Control', 'public, max-age=3000')
    res.json(result)
  }catch(err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const comment = async (req, res) => {
  let comment = req.body.comment
  comment.postedBy = req.body.userId
  try{
    let result = await Post.findByIdAndUpdate(req.body.postId, {$push: {comments: comment}}, {new: true})
                            .populate('comments.postedBy', '_id name')
                            .populate('postedBy', '_id name')
                            .exec()
    res.set('Cache-Control', 'public, max-age=3000')
    res.json(result)
  }catch(err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}
const uncomment = async (req, res) => {
  let comment = req.body.comment
  try{
    let result = await Post.findByIdAndUpdate(req.body.postId, {$pull: {comments: {_id: comment._id}}}, {new: true})
                          .populate('comments.postedBy', '_id name')
                          .populate('postedBy', '_id name')
                          .exec()
    res.json(result)
  }catch(err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const isPoster = (req, res, next) => {
  let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id
  if(!isPoster){
    return res.status('403').json({
      error: "User is not authorized"
    })
  }
  next()
}

export default {
  listByUser,
  listNewsFeed,
  create,
  postByID,
  remove,
  photo,
  like,
  unlike,
  comment,
  uncomment,
  isPoster
}

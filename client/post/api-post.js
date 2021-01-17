import axios from 'axios'
const create = async (params, credentials, post) => {
  try {
    return axios.post('/api/posts/new/'+ params.userId, post, {
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }, 
    })
  } catch(err) {
    console.log(err)
  }
}

const listByUser = async (params, credentials) => {
  try {
    let response = await axios.get('/api/posts/by/'+ params.userId, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}

const listNewsFeed = async (params, credentials, signal) => {
  try {
    let response = await fetch('/api/posts/feed/'+ params.userId, {
      method: 'GET',
      signal: signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    })    

    return await response.json()
  } catch(err) {
    console.log(err)
  }
}

const remove = async (params, credentials) => {
  try {
    let response = await axios.delete('/api/posts/' + params.postId, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}


const like = async (params, credentials, postId) => {
  try {
    let response = await axios.put('/api/posts/like/', JSON.stringify({userId:params.userId, postId: postId}),
    {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
        })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}


const unlike = async (params, credentials, postId) => {
  try {
    let response = await axios.put('/api/posts/unlike/', JSON.stringify({userId:params.userId, postId: postId}), {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}


const comment = async (params, credentials, postId, comment) => {
  try {
    let response = await axios.put('/api/posts/comment/', JSON.stringify({userId:params.userId, postId: postId, comment: comment}),
     {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
        })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}


const uncomment = async (params, credentials, postId, comment) => {
  try {
    let response = await fetch('/api/posts/uncomment/', JSON.stringify({userId:params.userId, postId: postId, comment: comment}), 
    {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
        })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}


export {
  listNewsFeed,
  listByUser,
  create,
  remove,
  like,
  unlike,
  comment,
  uncomment
}

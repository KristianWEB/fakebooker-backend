# Post Api

> Protected: req must have an "authorization" header with a "jwt" schema. Ex: ("authorization": "jwt Token")

If the server has a error then the server will respond with:
```js
500
{
  success: false,
  msg: "Internal Server Error"
}
```
This can happen with any request


## GET "/api/post/:username"
 Description: Returns all posts on a user's wall

search queries: 
```
recent: number, // will only return a recent number of post
```

Example responses: 
```js
200 
{
  success: true,
  posts: [
    {
    typeOfPost: String,
    likedBy: [ // array of users with less data
      {
      profileImage: String,
      username: String
      }
    ],
    disLikedBy: [ // array of users with less data
      {
      profileImage: String,
      username: String
      }
    ],
    edited: Boolean,
    lastEditedDate: Number,
    _id: ObjectId,
    user: {
        profileImage: String,
        username: String
    },
    content: String,
    destination: {
        profileImage: String,
        username: String
    },
    creationDate: Number,
    comments: [] // will be an empty array until comments it set up
    }
  ]
}

404
{
  success: false,
  msg: "There is no user by that username"
}
```

## GET "/api/post"
Description: Returns all posts on the the logged in user's wall. 

Protected

search queries: 
```
recent: number, // will only return a recent number of post
```

Example responses: 
```js
200 
{
  success: true,
  posts: [
    {
    typeOfPost: String,
    likedBy: [ // array of users with less data
      {
      profileImage: String,
      username: String
      }
    ],
    disLikedBy: [ // array of users with less data
      {
      profileImage: String,
      username: String
      }
    ],
    edited: Boolean,
    lastEditedDate: Number,
    _id: ObjectId,
    user: {
        profileImage: String,
        username: String
    },
    content: String,
    destination: {
        profileImage: String,
        username: String
    },
    creationDate: Number,
    comments: [] // will be an empty array until comments it set up
    }
  ]
}
```

## POST "/api/post"
Description: Creates a post for the logged in user and returns it. 

Protected

Expected body:
```
destination: ObjectId // optional - will default to the logged in user's id if not set
typeOfPost: String // optional - will default to "text" if not set
content: String
```

Example responses: 
```js
200 
{
  success: true,
  post:{
    typeOfPost: String,
    likedBy: [],
    disLikedBy: [],
    edited: false,
    lastEditedDate: Null,
    _id: ObjectId,
    user: {
        profileImage: String,
        username: String
    },
    content: String,
    destination: {
        profileImage: String,
        username: String
    },
    creationDate: Number,
    comments: [] // will be an empty array until comments it set up
  }
}

400

{
  success: false,
  errors: [
        {
            msg: "content is required",
            param: "content",
            location: "body"
        }
    ]
}
```

## PATCH "/api/post/:id"
Description: Edits the post that matches the id parameter and returns the updated post. 

Protected

Expected body:
```
typeOfPost: String, // optional
content: String,
```

Example responses: 
```js
200 
{
  success: true,
  posts: [
    {
    typeOfPost: String,
    likedBy: [ // array of users with less data
      {
      profileImage: String,
      username: String
      }
    ],
    disLikedBy: [ // array of users with less data
      {
      profileImage: String,
      username: String
      }
    ],
    edited: Boolean,
    lastEditedDate: Number,
    _id: ObjectId,
    user: {
        profileImage: String,
        username: String
    },
    content: String,
    destination: {
        profileImage: String,
        username: String
    },
    creationDate: Number,
    comments: [] // will be an empty array until comments it set up
    }
  ]
}

400
{
  success: false,
  errors: [
        {
            msg: "content is required",
            param: "content",
            location: "body"
        }
    ]
}
```

## PATCH "/api/posts/status/:id"
Description: Updates the likedBy and disLikedBy of a post that matches the id parameter

Protected

Expected body: either a "like" or "dislike" field
```
like: 1 or -1  // if 1, adds userId to likedBy array. if -1, removes userId from likedBy array.
dislike: 1 or -1 // if 1, adds userId to disLikedBy array. if -1, removes userId from disLikedBy array.
```

Example responses: 
```js
200 
{
  success: true,
}

400
{
  success: false,
  msg: "like and dislike fields can't both be defined"
}
```

## DELETE "/api/posts/:id"
Description: Deletes a post that matches the id parameter

Protected

Example responses: 
```js
200 
{
  success: true,
}
```
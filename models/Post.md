### Post Model

```javascript
    [
        {
            id: String, // ObjectId of post
            source: String, // ObjectId of person who made the post
            destination: String, // ObjectId of person who received the post(whose wall?)
            typeOfPost: String, // Type of post[i.e., text, image, url like reddit?]
            content: String, // actual content of the post
            creationDate: Number, // unix timestamp of when this post was created
            likedBy: [{
                id: String, // ObjectId of the user,
            }], // array of users who liked this post
            disLikedBy: [{
                id: String, // ObjectId of the user,
            }], // array of users who disliked this post
            edited: boolean,
            lastEditedDate: Number, // unix timestamp lastEdited
            comments: [Comment], // array of comments
        }
    ]
```
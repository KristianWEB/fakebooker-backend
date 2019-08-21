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
            likesCount: Number, // numer of current likes
            dislikesCount: Number, // numer of current dislikes
            likedBy: [{
                id: String, // ObjectId of the user,
                username: String,
                displayName: String,
                profileImage: String, // so that we can show small image
            }], // array of users who liked this post
            disLikedBy: [{
                id: String, // ObjectId of the user,
                username: String,
                displayName: String,
                profileImage: String, // so that we can show small image
            }], // array of users who disliked this post
            comments: [Comment], // array of comments
            edited: boolean,
            lastEditedDate: Number, // unix timestamp lastEdited
        }
    ]
```
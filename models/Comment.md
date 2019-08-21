### Comment Model

```javascript
    [
        {
            id: String, // ObjectId of the comment
            postId: String, // ObjectId i.e., postId where this comment comes from
            user: {
                id: String, // ObjectId of the user
                username: String,
                displayName: String,
                profileImage: String,
            }, // user who made this comment
            content: String, // actual content of the comment
            creationDate: Number, // unix timestamp of when this comment was created
            likesCount: Number, // numer of current likes
            dislikesCount: Number, // numer of current dislikes
            likedBy: [{
                id: String, // ObjectId of the user,
                username: String,
                displayName: String,
                profileImage: String, // so that we can show small image
            }], // array of users who liked this comment
            disLikedBy: [{
                id: String, // ObjectId of the user,
                username: String,
                displayName: String,
                profileImage: String, // so that we can show small image
            }], // array of users who disliked this comment
            edited: boolean,
            lastEditedDate: Number, // unix timestamp lastEdited
        }
    ]
```
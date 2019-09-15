### Comment Model

```javascript
    [
        {
        id: String, // ObjectId of the comment
        userId: String, // ObjectId of the user
        content: String, // actual content of the comment
        creationDate: Number, // unix timestamp of when this comment was created
        likedBy: [{
            id: String, // ObjectId of the user,
        }], // array of users who liked this comment
        disLikedBy: [{
            id: String, // ObjectId of the user,
        }], // array of users who disliked this comment
        edited: boolean,
        lastEditedDate: Number, // unix timestamp lastEdited
        }
    ]
```
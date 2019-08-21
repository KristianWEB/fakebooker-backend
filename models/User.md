### User Model

```javascript
    {
        email: String, // unique in the entire application
        displayName: String, // no need to be unique
        profileImg: String, // to be decided most likely base64 img or blob
        coverImg: String, // to be decided most likely base64 img or blob
        photos: Array[byte] // array of top 9 base64 images,
        joinDate: Number, // unix timestamp
        lastLogin Number, // unix timestamp
        status: {
            isActive: boolean,
            lastActiveDate: Number, // unix timestamp
        }
        about: {
            dob: Number, // unix timestamp for date of birth,
            bio: String, // their bio or description
        }, // about section
        friends: Array[Friend], // Array of friends
        timeline: Array[Post], // Array of posts
    }
```
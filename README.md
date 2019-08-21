### API Specification Draft #1

This is the api specification draft. This includes all the tentative endpoints, their HTTP methods, request bodies, response bodies, headers and other related information useful for developing api's on the backend and also consuming api's on the frontend.

#### Auth Endpoints

BaseURL: `http://<ip>:<port>/api`

- *Register Endpoint* : Used to register the user

```javascript
POST /auth/register

    Headers:
    {
        "Content-Type": "application/json",
    }

    RequestBody:
    {
        "email": "johndoe@gmail.com",
        "password": "testing123",
    }
    ResponseBody:
    {
        // to be decided, but for now its just a acknowledgement
    }
```

- *Login Endpoint* : Used to login the user

```javascript
POST /auth/login

    Headers:
    {
        "Content-Type": "application/json",
    }

    RequestBody:
    {
        "email": "johndoe@gmail.com",
        "password": "testing123",
    }
    ResponseBodies:
    Note: Use the below token and store it in localStorage on the frontend and send it as an Authorization Header to access every protected route.

    200 Success
    {
        "success": true,
        "token": "JWT <token>"
        "user": {
            "id": "user_id",
            "email": "johndoe@gmail.com"
        }
    }

    404 User not found
    {
        "success": false,
        "msg": "User not found",
    }

    409 Some other error occurred
    {
        "success": false,
        "msg": "Some error occurred while logging in",
    }
```

- *Test Endpoint* : Used for testing the auth functionality

```javascript
GET /auth/test
    Headers:
    {
        "Content-Type": "application/json",
        "Authorization": "JWT <token>",
    }

    ResponseBodies:
    200 Success:
    {
        "success": true,
        user: {
            email: "johndoe@gmail.com",
            ... and some other user details
        }
    }

    401 Unauthorized
    {
        "success": false,
        "msg": "You are unauthorized",
    }

```

#### Profile Endpoints
- *Overview endpoint* : Used to display profile information i.e., when someone visits this user's profile page. Here we only show an overview like displayName, cover image, profile, image, top 9 friends(names and their images), all the latest posts that were made by this user or were made on this user's wall and so on. More detailed information about this user or all their list of friends etc is in the next endpoint.

```javascript
GET /profile or GET /profile/overview
    Headers: {
        "Content-Type": "application/json",
        "Authorization": "JWT <token>",
    }

    ResponseBodies:
    200 success:
    {
        "success": true,
        "email": "johndoe@gmail.com", // unique in the entire application
        "displayName": "John Doe", // no need to be unique
        "profileImg": ...., // to be decided most likely base64 img or blob
        "coverImg": ...., // to be decided most likely base64 img or blob
        "photos": base64IMG[] // array of top 9 base64 images,
        "joinDate": 125325235, // unix timestamp
        "lastLogin" 12124124, // unix timestamp
        "status": {
            "isActive": boolean,
            "lastActiveDate": 124124412, // unix timestamp
        }
        "friends": [
            {
                "id": "ObjectId", // string
                "name": "John friend1",
                "image": "John friend1 image",
            },
        ], // array of top 9 friends but only their ids, names and images
        "about": {
            "dob": 124124124, // unix timestamp for date of birth,
            "bio": "hello I am ..", // their bio or description
        }, // brief overview of about section, detailed overview in next endpoint
        "timeline": {}, // list of top 10 posts and their related information like comments etc
    }

    // Other error code based respones to be decided
```
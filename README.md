# gaxion-backend
This is a backend service, that provides a services to enable users to save, by first the user creates a tribe, assign members to his tribe, the services determines the cycles of each member of the tribe, the service makes is easy for users to seed to their tribe and receive harvest when it's their turn.
# bibliotech-backend

## To install the App Dependencies
```
npm install
```

## To start the App on Production

```
npm start
```

## To run unit and integration Test

```
npm run test
```

## Base Url on a local machine

```
http://localhost:3009/api/v1/gaxion
```
## Login Route
```
Request Type: Post
Route: /auth/login
```

## User Creation Route

```
Request Type: Post
Route: /auth/create
Request Body: {
 name: 'User Name',
 email: 'Email',
 password: 'Password',
}
```

## create a tribe
```
Request Type: Post
Route: /tribe/create
Request Body: {
 name: 'tribe name',
 amount: 'specific amount that each member is expected to seed monthly',
 privacy: 'is tribe private or public',
 frequency: 'the frequency of the seeding'
 creator: 'the id of the tribe creator'
}
```

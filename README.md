# Setup
## frontend
Move to the frontend directory
```
cd frontend
```
Install packages
```
npm install
```
Start the dev server
```
npm run serve
```

## backend
Move to the backend directory
```
cd backend
```
Install packages
```
npm install
```
Start the server
- in Linux or Mac
```
npm run start
```
- in windows (needs two terminals)
```
npm run serve
```
```
npm run database
```
Init or clear the database
```
npm run reset-db
```

# Dev items

* [X] init frontend
* [X] init backend
  * [X] init database
* Database schema
  * [X] PROPERTY
  * [ ] USER
  * [ ] BOOKINGS

## Minimum requirements
## 1. Make sure there's a list, which lets you see/find any property around your current location.
### Frontend
* [X] Get the current location
* [X] Query properties which are nearby the current location from the backend
* [X] Display all the properties as a list
  * [X] Sort the list by distance
### Backend
* [X] GET API for accepting queries of nearby properties
  * [X] Query nearby properties by HERE place API
  * [X] Store distinct result into database (demo purpose)


## 2. Make sure the user can select a specific property, and create a "fake" booking request.
### Frontend
* [X] Navigate to the booking page when the user clicks on a property
  * [ ] Display booking form
    * [ ] Select checkin and checkout dates
    * [ ] Select number of rooms
    * [ ] Input username, email
  * [ ] Calculate the total
  * [ ] Submit to confirm booking
* [ ] Navigate/ display the confirmation page when the booking is completed
  * [ ] Be able to review the confirmation page by the same url later
### Backend
* [ ] POST API for creating a new booking record
  * [ ] Create a new user record (if the username, email not exist yet)
  * [ ] Create a new booking record

## 3. Show the booking requests list with a public API.
* [ ] /properties/PROPERTY_ID/bookings
* [ ] /users/USER_ID/bookings

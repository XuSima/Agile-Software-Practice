# Assignment 1 - Agile Software Practice.

Name: Xu Sima

## Overview.

There are 12 API, including 6 gets, 2 posts, 2 puts and 2 deletes.
All of them realize CRUD of students and teachers. 

## API endpoints.

+ GET /students: get all the students.
+ GET /students/:id: get one student by a valid ID.
+ GET /students/name/:name: get one student by a valid name.
+ POST /students: add a student.
+ PUT /students/:id/votes: upvote a student.
+ DELETE /students/:id: delete a student.
+ GET /teachers: get all the teachers.
+ GET /teachers/:id: get one teacher by a valid ID.
+ GET /teachers/name/:name: get one teacher by a valid name.
+ POST /teachers: add a teacher.
+ PUT /teachers/:id/votes: upvote a teacher.
+ DELETE /teachers/:id: delete a teacher.

## Data model.

![][datamodel]

## Sample Test execution.

~~~
 Students
    GET /students
connected to database
GET /students 200 4.631 ms - 264
      √ should GET all the students
    GET /students/:id
      when the id is valid
GET /students/5dbff5861ecb97680ce96a31 200 1.731 ms - 132
        √ should return the matching student
      when the id is invalid
GET /students/99 200 0.898 ms - 220
        √ should return the error message
    GET /students/name/:name
      when the name is valid
GET /students/name/Jim 200 1.443 ms - 132
        √ should return the matching student
      when the name is invalid
GET /students/name/undefined 200 0.790 ms - 2
        √ should return the error message
    POST /students
POST /students 200 1.654 ms - 173
      √ should return confirmation message and update
GET /students/5dbff5861ecb97680ce96a3c 200 1.200 ms - 139
    PUT /students/:id/vote
      when the id is valid
PUT /students/5dbff5861ecb97680ce96a3d/votes 200 4.062 ms - 168
        √ should return a message and the student upvoted by 1
GET /students/5dbff5861ecb97680ce96a3d 200 1.140 ms - 132
      when the id is invalid
PUT /students/1100001/vote 404 7.191 ms - 6881
        √ should return a 404 page
    DELETE /students/:id
      when id is valid
(node:26636) DeprecationWarning: Mongoose: `findOneAndUpdate()` and `findOneAndDelete()` without the `useFindAndModify` opt
ion set to false are deprecated. See: https://mongoosejs.com/docs/deprecations.html#-findandmodify-
DELETE /students/5dbff5861ecb97680ce96a41 200 3.188 ms - 30
        √ should return a confirmation message
      when id is invalid
DELETE /students/9999 404 0.310 ms - 184
        √ should return 404 page

  Teachers
GET /students/5dbff5861ecb97680ce96a43 200 1.508 ms - 132
    GET /teachers
GET /teachers 200 1.325 ms - 246
      √ should GET all the teachers
    GET /teachers/:id
      when the id is valid
GET /teachers/5dbff5861ecb97680ce96a47 200 1.121 ms - 123
        √ should return the matching teacher
      when the id is invalid
GET /teachers/99 200 0.263 ms - 220
        √ should return the error message
    GET /teachers/name/:name
      when the name is valid
GET /teachers/name/Jim 200 1.051 ms - 123
        √ should return the matching teacher
      when the name is invalid
GET /teachers/name/undefined 200 0.817 ms - 2
        √ should return the error message
    POST /teachers
POST /teachers 200 1.447 ms - 164
      √ should return confirmation message and update
GET /teachers/5dbff5861ecb97680ce96a52 200 1.292 ms - 130
    PUT /teachers/:id/vote
      when the id is valid
PUT /teachers/5dbff5861ecb97680ce96a53/votes 200 2.558 ms - 159
        √ should return a message and the teacher upvoted by 1
GET /teachers/5dbff5861ecb97680ce96a53 200 1.396 ms - 123
    when the id is invalid
PUT /teachers/1100001/vote 404 0.974 ms - 6881
      √ should return a 404 and a message for invalid teacher id
    DELETE /teachers/:id
      when id is valid
DELETE /teachers/5dbff5861ecb97680ce96a57 200 1.415 ms - 30
        √ should return a confirmation message
      when id is invalid
DELETE /teachers/9999 404 0.257 ms - 184
        √ should return 404 page


  20 passing (3s)

~~~

[datamodel]: ./Datamodel.PNG
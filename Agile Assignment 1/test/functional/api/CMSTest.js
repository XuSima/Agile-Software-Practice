/*eslint no-console: "off" */
/*eslint no-unused-vars: "off" */

const chai = require("chai")
const Student = require("../../../models/students")
const Teacher = require("../../../models/teachers")

const expect = chai.expect
const request = require("supertest")
const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer
const mongoose = require("mongoose")


let server
let mongod
let db, validID, validName

describe("Students", () => {
    before(async () => {
        try {
            mongod = new MongoMemoryServer({
                instance: {
                    port: 27017,
                    dbPath: "./test/database",
                    dbName: "project" // by default generate random dbName
                }
            })
            // Async Trick - this ensures the database is created before
            // we try to connect to it or start the server
            await mongod.getConnectionString()

            mongoose.connect("mongodb://localhost:27017/project", {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            server = require("../../../bin/www")
        } catch (error) {
            console.log(error)
        }
    })

    after(async () => {
        try {
            // await db.dropDatabase();
        } catch (error) {
            console.log(error)
        }
    })

    beforeEach(async () => {
        try {
            await Student.deleteMany({})
            let student = new Student()
            student.name = "Jim"
            student.age = 22
            student.gender = 0
            student.grade = 3
            student.performance = 0
            student.hobbies = "Go"
            student.upvotes = 0
            await student.save()
            student = new Student()
            student.name = "Jack"
            student.age = 23
            student.gender = 0
            student.grade = 3
            student.performance = 0
            student.hobbies = "Go"
            student.upvotes = 0
            await student.save()
            student = await Student.findOne({age: 22})
            validID = student._id
            validName = student.name
        } catch (error) {
            console.log(error)
        }
    })
    describe("GET /students", () => {
        it("should GET all the students", done => {
            request(server)
                .get("/students")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    try {
                        expect(res.body).to.be.a("array")
                        expect(res.body.length).to.equal(2)
                        done()
                    } catch (e) {
                        done(e)
                    }
                })
        })
    })
    describe("GET /students/:id", () => {
        describe("when the id is valid", () => {
            it("should return the matching student", done => {
                request(server)
                    .get(`/students/${validID}`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        // student.name = "Jim";
                        // student.age = 22;
                        // student.gender = 0;
                        // student.grade = 3;
                        // student.performance = 0
                        // student.hobbies = "Go"
                        // student.upvotes = 0
                        expect(res.body[0]).to.have.property("name", "Jim")
                        expect(res.body[0]).to.have.property("age", 22)
                        expect(res.body[0]).to.have.property("gender", 0)
                        expect(res.body[0]).to.have.property("grade", 3)
                        expect(res.body[0]).to.have.property("performance", "0")
                        expect(res.body[0]).to.have.property("hobbies", "Go")
                        expect(res.body[0]).to.have.property("upvotes", 0)
                        done(err)
                    })
            })
        })
        describe("when the id is invalid", () => {
            it("should return the error message", done => {
                request(server)
                    .get("/students/99")
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.message).equals("Student NOT Found!")
                        done(err)
                    })
            })
        })
    })
    describe("GET /students/name/:name", () => {
        describe("when the name is valid", () => {
            it("should return the matching student", done => {
                request(server)
                    .get(`/students/name/${validName}`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        // student.name = "Jim";
                        // student.age = 22;
                        // student.gender = 0;
                        // student.grade = 3;
                        // student.performance = 0
                        // student.hobbies = "Go"
                        // student.upvotes = 0
                        expect(res.body[0]).to.have.property("name", "Jim")
                        expect(res.body[0]).to.have.property("age", 22)
                        expect(res.body[0]).to.have.property("gender", 0)
                        expect(res.body[0]).to.have.property("grade", 3)
                        expect(res.body[0]).to.have.property("performance", "0")
                        expect(res.body[0]).to.have.property("hobbies", "Go")
                        expect(res.body[0]).to.have.property("upvotes", 0)
                        done(err)
                    })
            })
        })
        describe("when the name is invalid", () => {
            it("should return the error message", done => {
                let validNameT
                let teacher = new Teacher()
                teacher.name = "Jone"
                teacher.age = 25
                teacher.gender = 0
                teacher.grade = 3
                teacher.rank = 0
                teacher.hobbies = "Go"
                teacher.upvotes = 0
                teacher.save()
                teacher = Teacher.findOne({age: 25})
                validNameT = teacher.name
                request(server)
                    .get(`/students/name/${validNameT}`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .then(res => {
                        expect(res.body.message).equals(undefined)
                        done()
                    })
            })
        })
    })
    describe("POST /students", () => {
        it("should return confirmation message and update", () => {
            const student = {
                name: "Nancy",
                age: 30,
                gender: 0,
                grade: 2,
                performance: 1,
                hobbies: "Running",
                upvotes:0
            }
            return request(server)
                .post("/students")
                .send(student)
                .expect(200)
                .then(res => {
                    expect(res.body.message).equals("Student Added!")
                    validID = res.body.data._id
                })
        })
        //check update
        after(() => {
            return request(server)
                .get(`/students/${validID}`)
                .expect(200)
                .then(res => {
                    expect(res.body[0]).to.have.property("name", "Nancy")
                    expect(res.body[0]).to.have.property("age", 30)
                    expect(res.body[0]).to.have.property("gender", 0)
                    expect(res.body[0]).to.have.property("grade", 2)
                    expect(res.body[0]).to.have.property("performance", "1")
                    expect(res.body[0]).to.have.property("hobbies", "Running")
                    expect(res.body[0]).to.have.property("upvotes", 0)
                })
        })
    })
    describe("PUT /students/:id/vote", () => {
        describe("when the id is valid", () => {
            it("should return a message and the student upvoted by 1", () => {
                return request(server)
                    .put(`/students/${validID}/votes`)
                    .expect(200)
                    .then(resp => {
                        expect(resp.body).to.include({
                            message: "Student Upvoted!"
                        })
                        expect(resp.body.data).to.have.property("upvotes", 1)
                    })
            })
            after(() => {
                return request(server)
                    .get(`/students/${validID}`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .then(resp => {
                        expect(resp.body[0]).to.have.property("upvotes", 1)
                    })
            })
        })
        describe("when the id is invalid", () => {
            it("should return a 404 page", () => {
                return request(server)
                    .put("/students/1100001/vote")
                    .expect(404)
            })
        })
    })
    describe("DELETE /students/:id", () => {
        describe("when id is valid", () => {
            it("should return a confirmation message", () => {
                return request(server)
                    .delete(`/students/${validID}`)
                    .expect(200)
                    .then(res => {
                        expect(res.body.message).equals("Student Deleted!")
                        })
                    })
            })
            after(() => {
                request(server)
                    .get(`/students/${validID}`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .then(res => {
                        expect(res.body.length).to.equal(1)
                    })

            })
        describe("when id is invalid", () => {
            it("should return 404 page", () => {
                return request(server)
                    .delete("/students/9999")
                    .expect(404)
            })
        })
    })
})


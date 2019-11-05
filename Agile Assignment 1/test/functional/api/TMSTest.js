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

describe("Teachers", () => {
    before(async () => {
        try {
            mongod = new MongoMemoryServer({
                instance: {
                    port: 27017,
                    dbPath: "./test/database1",
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
            await Teacher.deleteMany({})
            let teacher = new Teacher()
            teacher.name = "Jim"
            teacher.age = 22
            teacher.gender = 0
            teacher.grade = 3
            teacher.rank = 0
            teacher.hobbies = "Go"
            teacher.upvotes = 0
            await teacher.save()
            teacher = new Teacher()
            teacher.name = "Jack"
            teacher.age = 23
            teacher.gender = 0
            teacher.grade = 3
            teacher.rank = 0
            teacher.hobbies = "Go"
            teacher.upvotes = 0
            await teacher.save()
            teacher = await Teacher.findOne({age: 22})
            validID = teacher._id
            validName = teacher.name

        } catch (error) {
            console.log(error)
        }
    })
    describe("GET /teachers", () => {
        it("should GET all the teachers", done => {
            request(server)
                .get("/teachers")
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
    describe("GET /teachers/:id", () => {
        describe("when the id is valid", () => {
            it("should return the matching teacher", done => {
                request(server)
                    .get(`/teachers/${validID}`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        // teacher.name = "Jim"
                        // teacher.age = 22
                        // teacher.gender = 0
                        // teacher.grade = 3
                        // teacher.rank = 0
                        // teacher.hobbies = "Go"
                        // teacher.upvotes = 0
                        expect(res.body[0]).to.have.property("name", "Jim")
                        expect(res.body[0]).to.have.property("age", 22)
                        expect(res.body[0]).to.have.property("gender", 0)
                        expect(res.body[0]).to.have.property("grade", 3)
                        expect(res.body[0]).to.have.property("rank", 0)
                        expect(res.body[0]).to.have.property("hobbies", "Go")
                        expect(res.body[0]).to.have.property("upvotes", 0)
                        done(err)
                    })
            })
        })
        describe("when the id is invalid", () => {
            it("should return the error message", done => {
                request(server)
                    .get("/teachers/99")
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.message).equals("Teacher NOT Found!")
                        done(err)
                    })
            })
        })
    })
    describe("GET /teachers/name/:name", () => {
        describe("when the name is valid", () => {
            it("should return the matching teacher", done => {
                request(server)
                    .get(`/teachers/name/${validName}`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        // teacher.name = "Jim";
                        // teacher.age = 22;
                        // teacher.gender = 0;
                        // teacher.grade = 3;
                        // teacher.rank = 0
                        // teacher.hobbies = "Go"
                        // teacher.upvotes = 0
                        expect(res.body[0]).to.have.property("name", "Jim")
                        expect(res.body[0]).to.have.property("age", 22)
                        expect(res.body[0]).to.have.property("gender", 0)
                        expect(res.body[0]).to.have.property("grade", 3)
                        expect(res.body[0]).to.have.property("rank", 0)
                        expect(res.body[0]).to.have.property("hobbies", "Go")
                        expect(res.body[0]).to.have.property("upvotes", 0)
                        done(err)
                    })
            })
        })
        describe("when the name is invalid", () => {
            it("should return the error message", done => {
                let validNameS
                let student = new Student()
                student.name = "Jone"
                student.age = 25
                student.gender = 0
                student.grade = 3
                student.performance = 0
                student.hobbies = "Go"
                student.upvotes = 0
                student.save()
                student = Student.findOne({age: 25})
                validNameS = student.name
                request(server)
                    .get(`/teachers/name/${validNameS}`)
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
    describe("POST /teachers", () => {
        it("should return confirmation message and update", () => {
            const teacher = {
                name: "Nancy",
                age: 30,
                gender: 0,
                grade: 2,
                rank: 1,
                hobbies: "Running",
                upvotes:0
            }
            return request(server)
                .post("/teachers")
                .send(teacher)
                .expect(200)
                .then(res => {
                    expect(res.body.message).equals("Teacher Added!")
                    validID = res.body.data._id
                })
        })
        after(() => {
            return request(server)
                .get(`/teachers/${validID}`)
                .expect(200)
                .then(res => {
                    expect(res.body[0]).to.have.property("name", "Nancy")
                    expect(res.body[0]).to.have.property("age", 30)
                    expect(res.body[0]).to.have.property("gender", 0)
                    expect(res.body[0]).to.have.property("grade", 2)
                    expect(res.body[0]).to.have.property("rank", 1)
                    expect(res.body[0]).to.have.property("hobbies", "Running")
                    expect(res.body[0]).to.have.property("upvotes", 0)
                })
        })
    })
    describe("PUT /teachers/:id/vote", () => {
        describe("when the id is valid", () => {
            it("should return a message and the teacher upvoted by 1", () => {
                return request(server)
                    .put(`/teachers/${validID}/votes`)
                    .expect(200)
                    .then(resp => {
                        expect(resp.body).to.include({
                            message: "Teacher Upvoted!"
                        })
                        expect(resp.body.data).to.have.property("upvotes", 1)
                    })
            })
            after(() => {
                return request(server)
                    .get(`/teachers/${validID}`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .then(resp => {
                        expect(resp.body[0]).to.have.property("upvotes", 1)
                    })
            })
        })
    })
    describe("when the id is invalid", () => {
        it("should return a 404 and a message for invalid teacher id", () => {
            return request(server)
                .put("/teachers/1100001/vote")
                .expect(404)
        })
    })

    describe("DELETE /teachers/:id", () => {
        describe("when id is valid", () => {
            it("should return a confirmation message", () => {
                return request(server)
                    .delete(`/teachers/${validID}`)
                    .expect(200)
                    .then(res => {
                        expect(res.body.message).equals("Teacher Deleted!")
                    })
            })
        })
        after(() => {
            request(server)
                .get(`/teachers/${validID}`)
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
                    .delete("/teachers/9999")
                    .expect(404)
            })
        })
    })
})
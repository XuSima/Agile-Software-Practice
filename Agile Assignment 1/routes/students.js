/*eslint no-console: "off" */
var Teacher = require("../models/teachers")
var Student = require("../models/students")
var express = require("express")
var router = express.Router()
var mongoose = require("mongoose")


mongoose.connect("mongodb://localhost/project",
    {useNewUrlParser: true, useUnifiedTopology: true})

var db = mongoose.connection

db.on("error", function (err) {
    console.log("connection error", err)
})
db.once("open", function () {
    console.log("connected to database")
})

router.findAll = function(req, res) {

    Student.find(function(err, students) {
        if (err)
            res.send(err)
        else {
            res.json(students)
        }
    })
}

router.findOneByName = function(req, res) {

    Student.find({ "name" : req.params.name },function(err, student) {
        if (err)
            res.json({ message: "Student NOT Found!", errmsg : err } )
        else
            res.json(student)
    })
}

router.findOneById = function(req, res) {

    Student.find({ "_id" : req.params.id },function(err, student) {
        if (err)
            res.json({ message: "Student NOT Found!", errmsg : err } )
        else
            res.json(student)
    })
}

router.addStudent = function(req, res) {

    let student = new Student()
    student.name = req.body.name
    student.age = req.body.age
    student.gender= req.body.gender
    student.grade = req.body.grade
    student.performance = req.body.performance
    student.hobbies = req.body.hobbies
    student.upvotes = req.body.upvotes

    student.save(function(err) {
        if (err)
            res.send(err)
        res.json({ message: "Student Added!", data: student })
    })
}

router.deleteStudent = function(req, res) {

    Student.findByIdAndRemove(req.params.id, function(err) {
        if (err){
            res.status(404)
            res.send(err)
        }

        else
            res.json({ message: "Student Deleted!"})
    })
}

router.incrementUpvotes = function(req, res) {

    Student.findById(req.params.id, function(err,student) {
        if (err)
            res.send(err)
        else {
            student.upvotes += 1
            student.save(function (err) {
                if (err)
                    res.send(err)
                else
                    res.json({ message: "Student Upvoted!", data: student })
            })
        }
    })
}


router.findAllTeacher = function(req, res) {


    Teacher.find(function(err, teachers) {
        if (err)
            res.send(err)
        else {
            res.json(teachers)
        }
    })
}

router.findOneByTeacherName = function(req, res) {

    Teacher.find({ "name" : req.params.name },function(err, teacher) {
        if (err)
            res.json({ message: "Teacher NOT Found!", errmsg : err } )
        else
            res.json(teacher)
    })
}

router.findOneByTeacherId = function(req, res) {

    Teacher.find({ "_id" : req.params.id },function(err, teacher) {
        if (err)
            res.json({ message: "Teacher NOT Found!", errmsg : err } )
        else
            res.json(teacher)
    })
}

router.addTeacher = function(req, res) {

    let teacher = new Teacher()
    teacher.name = req.body.name
    teacher.age = req.body.age
    teacher.gender= req.body.gender
    teacher.grade = req.body.grade
    teacher.rank = req.body.rank
    teacher.hobbies = req.body.hobbies
    teacher.upvotes = req.body.upvotes

    teacher.save(function(err) {
        if (err)
            res.send(err)
        res.json({ message: "Teacher Added!", data: teacher })
    })
}

router.deleteTeacher = function(req, res) {

    Teacher.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.status(404)
            res.send(err)
        }
        else
            res.json({ message: "Teacher Deleted!",})
    })
}

router.incrementTeacherUpvotes = function(req, res) {

    Teacher.findById(req.params.id, function(err,teacher) {
        if (err)
            res.send(err)
        else {
            teacher.upvotes += 1
            teacher.save(function (err) {
                if (err)
                    res.send(err)
                else
                    res.json({ message: "Teacher Upvoted!", data: teacher})
            })
        }
    })
}

module.exports = router
/*eslint no-unused-vars: "off" */
var express = require("express")
var path = require("path")
var favicon = require("serve-favicon")
var logger = require("morgan")
var cookieParser = require("cookie-parser")
var bodyParser = require("body-parser")
var routes = require("./routes/index")
var users = require("./routes/users")
const students = require("./routes/students")

var app = express()

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))
if (process.env.NODE_ENV !== "test") {  
    app.use(logger("dev"))
}

app.use("/", routes)
app.use("/users", users)

//Our Custom Routes
app.get("/students", students.findAll)
app.get("/students/:id", students.findOneById)
app.get("/students/name/:name", students.findOneByName)
app.post("/students", students.addStudent)
app.put("/students/:id/votes", students.incrementUpvotes)
app.delete("/students/:id", students.deleteStudent)
app.get("/teachers", students.findAllTeacher)
app.get("/teachers/:id", students.findOneByTeacherId)
app.get("/teachers/name/:name", students.findOneByTeacherName)
app.post("/teachers", students.addTeacher)
app.put("/teachers/:id/votes", students.incrementTeacherUpvotes)
app.delete("/teachers/:id", students.deleteTeacher)



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error("Not Found")
    err.status = 404
    next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500)
        res.render("error", {
            message: err.message,
            error: err
        })
    })
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    res.render("error", {
        message: err.message,
        error: {}
    })
})


module.exports = app

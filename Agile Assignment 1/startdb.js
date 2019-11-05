const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer;
const mongoose = require("mongoose");
const Student= require("./models/students");

async function foo() {
  const mongod = new MongoMemoryServer({
    instance: {
      port: 27017, // by default choose any free port
      dbName: "project" //// by default generate random dbName
      // dbPath: "./test/database"
    }
  });
  try { 
  await mongod.getConnectionString();

  await mongoose.connect("mongodb://localhost:27017/project");
  await mongod.getConnectionString();

      await Student.deleteMany({});
      let student = new Student();
      student.name = "Jim";
      student.age = 22;
      student.gender = 0;
      student.grade = 3;
      student.performance = 0
      student.hobbies = "Go"
      await student.save();
      student = new Student();
      student.name = "Jack";
      student.age = 23;
      student.gender = 0;
      student.grade = 3;
      student.performance = 0
      student.hobbies = "Go"
      await student.save();
     let students = await Student.find()
            console.log(students)
  }
      catch(error) {
        console.log(error)
      }
 
  // return await mongod.getConnectionString();
  // console.log( uri )
  // await mongod.stop();
}

foo();
//  bar()

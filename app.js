const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("./public"));

// database creation and connection
mongoose
  .connect("mongodb://localhost:27017/StudentApi", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connection extablished");
  })
  .catch((e) => {
    console.log(e);
  });

// schema for the databse
const StudentSchema = new mongoose.Schema({
  name: String,
  Class: String,
  RollNo: Number,
  hobbies: Array,
  FavSubject: String,
});

// creating collection and definig schema
const Record = new mongoose.model("Record", StudentSchema);

// api's

// Home Page
app.get("/", (request, respond) => {
  respond.sendFile(path.resolve(__dirname, "./public/index.html"));
});

// to store data in database
app.post("/api/Student", (request, respond) => {
  const { name, Class, RollNo, hobbies, FavSubject } = request.body;
  const insertRecord = async () => {
    try {
      const student = new Record({
        name: name,
        Class: Class,
        RollNo: RollNo,
        hobbies: hobbies,
        FavSubject: FavSubject,
      });
      const result = await Record.insertMany([student]);
      console.log("Record inserted Successfully");
      respond.json({ response: true, data: result });
    } catch (e) {
      console.log("record not entered");
    }
  };
  insertRecord();
});

// to get all the student
app.get("/api/Student", (request, respond) => {
  const ViewData = async () => {
    try {
      const result = await Record.find();
      respond.json({ response: true, data: result });
    } catch (e) {
      console.log(e);
    }
  };
  ViewData();
});

// to view individual student record on the basis of name
app.get("/api/Student/name=:name", (request, respond) => {
  const { name } = request.params;
  const FindStudent = async (name) => {
    try {
      const result = await Record.find({ name: name });
      if (result.length > 0) {
        respond.json({ response: true, data: result });
      } else {
        respond.json({
          response: true,
          data: `No Student Found named ${name}`,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };
  FindStudent(name);
});

// to find student how study in MCA and displaying there name and RollNO
app.get("/api/Students/", (request, respond) => {
  const { Class } = request.query;
  const FindStudents = async (Class) => {
    try {
      const result = await Record.find(
        { Class: Class },
        { name: 1, RollNo: 1 }
      );
      if (result.length > 0) {
        respond.json({ response: true, data: result });
      } else {
        respond.json({
          response: true,
          data: `No Student Found in the class ${Class} or no such Class is there`,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };
  FindStudents(Class);
});

// api to show hobbies and name
app.get("/api/Student/hobbies", (request, respond) => {
  const FindHobbies = async () => {
    try {
      const result = await Record.find({}, { name: 1, hobbies: 1 });
      respond.json({ response: true, data: result });
    } catch (e) {
      console.log(e);
    }
  };
  FindHobbies();
});

// to find commom hobbie
app.get("/api/Student/hobbies=:hobby", (request, respond) => {
  const { hobby } = request.params;
  const FindHobby = async (hobby) => {
    try {
      const result = await Record.find({ hobbies: hobby }, { name: 1 });
      if (result.length > 0) {
        respond.json({ response: true, data: result });
      } else {
        respond.json({
          response: true,
          data: `No Student have ${hobby}  as hobby`,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };
  FindHobby(hobby);
});

// to update student Record
app.put("/api/Student/name=:name", (request, respond) => {
  const { name } = request.params;
  const { RollNo } = request.body;
  const Update = async (name) => {
    try {
      const result = await Record.updateOne(
        { name },
        { $set: { RollNo: RollNo } }
      );
      respond.json({ response: true, data: "Record Updated" });
    } catch (e) {
      console.log(e);
    }
  };
  Update(name);
});

// to delete student record
app.delete("/api/Student/name=:name", (request, respond) => {
  const { name } = request.params;
  const deleteStudent = async () => {
    try {
      const result = await Record.remove({ name });
      respond.json({ respond: true, data: `${name} record deleted` });
    } catch (e) {
      console.log(e);
    }
  };
  deleteStudent(name);
});
app.listen(8080, () => {
  console.log("server started");
});

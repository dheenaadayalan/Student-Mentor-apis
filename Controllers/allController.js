import Student from "../Models/studentSchema.js";
import Mentor from "../Models/mentorSchema.js";

export const createStudent = async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.status(200).json({
      message: "Student created successfully",
      data: [newStudent],
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server error in creating student" });
  }
};

export const createMentor = async (req, res) => {
  try {
    const newMentor = new Mentor(req.body);
    await newMentor.save();
    res.status(200).json({
      message: "Mentor created successfully",
      data: [newMentor],
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server error in creating mentor" });
  }
};

export const addMentor = async (req, res) => {
  try {
    const { mentor, students } = req.body;
    const updateMentor = await Mentor.find({ mentorName: mentor });
    const studentList = await Student.find();
    const updatedStudentList = updateMentor[0].mentorStudents;

    await students.map(async (element) => {
      let list = studentList.find((ele) => ele.studentName == element);
      console.log(list);
      if (list.haveMentor == false) {
        updatedStudentList.push(element);
        let prvM = [];
        prvM.push(mentor);
        await Student.updateOne(
          { studentName: element },
          {
            haveMentor: true,
            mentorName: mentor,
            mentorPrv: prvM,
          }
        );
      } else {
        return;
      }
    });

    const result = await Mentor.updateOne(
      { mentorName: mentor },
      {
        mentorStudents: updatedStudentList,
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Mentor Not Found" });
    }
    const updatedMentor = await Mentor.find({ mentorName: mentor });
    res.status(200).json({
      message: "Mentor Updated Successfully",
      result: updatedMentor,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server error in assineing mentor" });
  }
};

export const updateMentor = async (req, res) => {
  try {
    const { oldMentor, newMentor, student } = req.body;
    const oldMentorData = await Mentor.find({ mentorName: oldMentor });
    const oldMentorList = oldMentorData[0].mentorStudents;
    const index = oldMentorList.indexOf(student);
    if (index > -1) {
      oldMentorList.splice(index, 1);
    }

    const result = await Mentor.updateOne(
      { mentorName: oldMentor },
      {
        mentorStudents: oldMentorList,
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Mentor Not Found" });
    }

    const newMentorData = await Mentor.find({ mentorName: newMentor });
    const newMentorList = newMentorData[0].mentorStudents;
    newMentorList.push(student);

    const resultNew = await Mentor.updateOne(
      { mentorName: newMentor },
      {
        mentorStudents: newMentorList,
      }
    );

    if (resultNew.matchedCount === 0) {
      return res.status(404).json({ message: "Mentor Not Found" });
    }

    const updatedMentorNew = await Mentor.find({ mentorName: newMentor });
    res.status(200).json({
      message: "Student removed",
      result: updatedMentorNew,
    });

    const studentdata = await Student.find({ studentName: student });
    const studentMentorOld = studentdata[0].mentorPrv;
    studentMentorOld.push(newMentor);
    const resultStudent = await Student.updateOne(
      { studentName: student },
      {
        mentorName: newMentor,
        mentorPrv: studentMentorOld,
      }
    );

    if (resultStudent.matchedCount === 0) {
      return res.status(404).json({ message: "Mentor Not Found" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server error in updateing mentor" });
  }
};

export const getStudentNames = async (req, res) => {
  try {
    const mentorId = req.params.id;
    const mentorData = await Mentor.findById(mentorId);
    if (!mentorData) {
      res.status(404).send("Employee Not Found");
    }
    res.status(200).json({
      message: "Mentor Retrieved Successfully",
      result: mentorData.mentorStudents,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server error in getbyid mmentor" });
  }
};

export const getMentorNames = async (req, res) => {
  try {
    const studentId = req.params.id;
    const studentData = await Student.findById(studentId);
    const data = studentData.mentorPrv;
    data.pop()
    if(data.length == 0){
      data.push("No old mentors")
    }
    if (!studentData) {
      res.status(404).send("Student Not Found");
    }
    res.status(200).json({
      message: "Student Mentor Retrieved Successfully",
      result: data,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server error in getbyid student" });
  }
};

import mongoose from "mongoose";

const studentSchema = mongoose.Schema({
    studentName: String,
    mentorName: String,
    haveMentor: Boolean,
    mentorPrv: Array,
});
  
const Student = mongoose.model("Student", studentSchema);
  
export default Student;


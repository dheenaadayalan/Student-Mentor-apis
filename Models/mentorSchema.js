import mongoose from "mongoose";

const mentorSchema = mongoose.Schema({
    mentorName: String,
    mentorStudents: Array,
});
  
const Mentor = mongoose.model("Mentor", mentorSchema);
  
export default Mentor;
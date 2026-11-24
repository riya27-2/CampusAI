import mongoose from "mongoose";

const person = { name: String, phone: String };

const departmentSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  icon: String,
  name: { type: String, required: true },
  description: String,
  hod: person,
  faculty: [person],
});

export default mongoose.model("Department", departmentSchema);

const asyncHandler = require("express-async-handler");
const {
  addNewStudent,
  updateStudent,
  getAllStudents,
  getStudentDetail,
  setStudentStatus,
} = require("./students-service");

const handleGetAllStudents = asyncHandler(async (req, res) => {
  const payload = req.query;
  const students = await getAllStudents(payload);
  res.status(200).json({ students });
});

const handleAddStudent = asyncHandler(async (req, res) => {
  const payload = req.body;
  const response = await addNewStudent(payload);
  res.status(201).json(response);
});

const handleUpdateStudent = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const payload = { ...req.body, id };
  const response = await updateStudent(payload);
  res.status(200).json(response);
});

const handleGetStudentDetail = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const student = await getStudentDetail(id);
  res.status(200).json({ student });
});

const handleStudentStatus = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;
  const { reviewerId, status } = req.body;
  const response = await setStudentStatus({ userId, reviewerId, status });
  res.status(200).json(response);
});

module.exports = {
  handleGetAllStudents,
  handleGetStudentDetail,
  handleAddStudent,
  handleStudentStatus,
  handleUpdateStudent,
};

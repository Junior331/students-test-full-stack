const { z } = require("zod");

const addStudentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.number().min(1),
  email: z.string().email(),
});

module.exports = {
  addStudentSchema,
};

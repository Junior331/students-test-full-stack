const { ApiError, sendAccountVerificationEmail } = require("../../utils");
const { findAllStudents, findStudentDetail, findStudentToSetStatus, addStudent, updateStudentDetail } = require("./students-repository");
const { findUserById } = require("../../shared/repository");

const checkStudentId = async (id) => {
    const isStudentFound = await findUserById(id);
    if (!isStudentFound) {
        throw new ApiError(404, "Student not found");
    }
}

const getAllStudents = async (payload) => {
    const students = await findAllStudents(payload);
    if (students.length <= 0) {
        throw new ApiError(404, "Students not found");
    }

    return students;
}

const getStudentDetail = async (id) => {
    await checkStudentId(id);

    const student = await findStudentDetail(id);
    if (!student) {
        throw new ApiError(404, "Student not found");
    }

    return student;
}

const validatePayload = (payload) => {
    const errors = [];
    if (isNaN(parseInt(payload.roll))) {
        errors.push("Field 'roll' must be a valid integer.");
    }

    if (errors.length > 0) {
        throw new ApiError(400, errors.join(" "));
    }
};

const addNewStudent = async (payload) => {
    const ADD_STUDENT_AND_EMAIL_SEND_SUCCESS = "Student added and verification email sent successfully.";
    const ADD_STUDENT_AND_BUT_EMAIL_SEND_FAIL = "Student added, but failed to send verification email.";

    try {
        validatePayload(payload);

        const result = await addStudent(payload);
        if (!result.status) {
            throw new ApiError(500, result.message || result.description || "Failed to add student.");
        }

        try {
            await sendAccountVerificationEmail({ userId: result.userId, userEmail: payload.email });
            return { message: ADD_STUDENT_AND_EMAIL_SEND_SUCCESS };
        } catch (error) {
            console.error("Error sending email:", error);
            return { message: ADD_STUDENT_AND_BUT_EMAIL_SEND_FAIL };
        }
    } catch (error) {
        console.error("Error in addNewStudent ::", error);
        throw new ApiError(500, "Unable to add student");
    }
};


const updateStudent = async (payload) => {
    try {
        const result = await updateStudentDetail(payload);
        if (result <= 0) {
            throw new ApiError(500, "Unable to update student detail");
        }
        return { message: "Student detail updated successfully" };
    } catch (error) {
        console.error("Error in updateStudent ::", error);
        throw new ApiError(500, "Unable to update student");
    }
}

const setStudentStatus = async ({ userId, reviewerId, status }) => {
    await checkStudentId(userId);

    const affectedRow = await findStudentToSetStatus({ userId, reviewerId, status });
    if (affectedRow <= 0) {
        throw new ApiError(500, "Unable to disable student");
    }

    return { message: "Student status changed successfully" };
}

module.exports = {
    getAllStudents,
    getStudentDetail,
    addNewStudent,
    setStudentStatus,
    updateStudent,
};

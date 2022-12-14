const marksModel = require("../models/marksModel");

const isValidName = function (name) {
    if (/^[a-zA-Z\.]*$/.test(name)) return true
    return false
}
const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}

//============================students marks doc===============================
const createStudent = async function (req, res) {
    try {
        let data = req.body;
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Please give some data" })

        const { studentsName, subject, marks, userId } = data;

        if (!studentsName) return res.status(400).send({ status: false, message: "please provide studentsName" })
        if (!subject) return res.status(400).send({ status: false, message: "please provide subject" })
        if (!marks) return res.status(400).send({ status: false, message: "please provide marks" })
        if (!userId) return res.status(400).send({ status: false, message: "please provide userId" })

        if (!isValidName(studentsName)) return res.status(400).send({ status: false, message: "studentsname is not valid" })
        if (!isValidName(subject)) return res.status(400).send({ status: false, message: "subject is not valid" })
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "userId is not valid" })

        const studentsProfile = await marksModel.create(data)
        return res.status(201).send({ status: false, message: "student created successfully", data: studentsProfile })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

//=============================get student===================================

const getStudent = async function (req, res) {
    try {
        let data = req.query
        let userId = req.params.userId
        const { studentsName, subject, marks } = data

        if (!studentsName) return res.status(400).send({ status: false, message: "please provide studentsName" })
        if (!subject) return res.status(400).send({ status: false, message: "please provide subject" })
        if (!isValidName(studentsName)) return res.status(400).send({ status: false, message: "studentsname is not valid" })
        if (!isValidName(subject)) return res.status(400).send({ status: false, message: "subject is not valid" })

        let ndata = {}

        if (studentsName) {
            ndata.studentsName = studentsName
        }
        if (subject) {
            ndata.subject = subject
        }

        let getDetails = await marksModel.find({ userId: userId, ...ndata }).select({ subject: 1, studentsName: 1, marks: 1, userId: 1 })
        if (!getDetails) return res.status(404).send({ status: false, message: "students marks not found" })

        return res.status(200).send({ status: true, message: "student list", data: getDetails })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

//============================ update student list ===========================================

const updateStudent = async function (req, res) {
    try {
        let userId = req.params.userId;
        let data = req.body;
        let { marks, studentId } = data;

        if (!isValidObjectId(studentId)) return res.status(400).send({ status: false, message: "userId is not valid" })
        let studentAvaiable = await marksModel.findOne({ _id: studentId });
        if (!studentAvaiable) return res.status(404).send({ status: false, message: "student with this id does not exist" })

        let updatedData = await marksModel.findOneAndUpdate({ _id: studentId }, { $set: { marks: studentAvaiable.marks + marks } }, { new: true })
        if (!updatedData) return res.status(404).send({ status: false, message: "student not found" })
        return res.status(200).send({ status: true, message: "students data updated successfully", data: updatedData })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

//==============================Delete student ===========================================

const deleteStudent = async function (req, res) {
    try {
        const userId = req.params.userId;
        let data = req.query;
        const { subject, studentsName } = data;

        let studentdet = await marksModel.updateMany({ $and: [{ userId: userId }, { $or: [{ studentsName: studentsName }, { subject: subject }] }] }, { $set: { studentsName: "", subject: "", marks: 0 } })
        res.status(200).send({ status: true, message: "student record deleted successfully", data: studentdet })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { createStudent, getStudent, updateStudent, deleteStudent }
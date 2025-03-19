const resp = require("./basecontroller");
const validation = require("./validationController");
const models = require("../models");
const LeaveModel = models.Leaves;
const UserModel = models.User; // Import User model to check user type

exports.createLeave = async (req, res) => {
  try {
    var validationRule = {
      doctor_id: "required|integer",
      start_date: "required|date",
      end_date: "required|date",
    };

    await validation(req.body, validationRule, null, async (err, status) => {
      if (!status) {
        return res.status(400).json(resp.sendError(err.errors, "Validation failed"));
      }

      // Check if the user is a doctor
      let doctor = await UserModel.findOne({
        where: { id: req.body.doctor_id, user_type: "doctor" },
      });

      if (!doctor) {
        return res.status(400).json(resp.sendError(null, "Only doctors can create leaves"));
      }

      // Create leave entry
      let leaveData = await LeaveModel.create(req.body);
      if (!leaveData) {
        return res.status(400).json(resp.sendError(null, "Leave not created"));
      }

      return res.status(200).json(resp.customInfo(leaveData, "Leave created successfully"));
    }).catch((err) => {
      console.log(err);
      res.status(400).json(resp.sendError(null, err.message));
    });
  } catch (error) {
    return res.status(500).json(resp.sendError(null, error.message));
  }
};

exports.getAllLeaves = async (req, res) => {
    try {
      let leaves = await LeaveModel.findAll({
        include: [
          {
            model: models.User,
            as: "doctor",
            attributes: ["id", "firstName", "lastName", "email"],
          },
        ],
      });
  
      return res.status(200).json(resp.customInfo(leaves, "Leaves fetched successfully"));
    } catch (error) {
      return res.status(500).json(resp.sendError(null, error.message));
    }
  };

exports.getLeaveById = async (req, res) => {
    try {
      const leaveId = req.params.id; // Get ID from request params
  
      let leave = await models.Leaves.findOne({
        where: { id: leaveId },
        include: [
          {
            model: models.User,
            as: "doctor", // Must match the alias in the association
            attributes: ["id", "firstName", "lastName", "email"],
          },
        ],
      });
  
      if (!leave) {
        return res.status(400).json(resp.sendError(null, "Leave not found"));
      }
  
      return res.status(200).json(resp.customInfo(leave, "Leave details fetched successfully"));
    } catch (error) {
      return res.status(500).json(resp.sendError(null, error.message));
    }
};

exports.updateLeave = async (req, res) => {
    try {
      const leaveId = req.params.id; // Get leave ID from request params
  
      // Validate input
      var validationRule = {
        start_date: "required|date",
        end_date: "required|date",
      };
  
      await validation(req.body, validationRule, null, async (err, status) => {
        if (!status) {
          return res.status(400).json(resp.sendError(err.errors, "Validation failed"));
        }
  
        // Find the leave entry
        let leave = await models.Leaves.findOne({ where: { id: leaveId } });
  
        if (!leave) {
          return res.status(404).json(resp.sendError(null, "Leave not found"));
        }
  
        // Update leave details
        await leave.update(req.body);
  
        return res.status(200).json(resp.customInfo(leave, "Leave updated successfully"));
      }).catch((err) => {
        console.log(err);
        res.status(400).json(resp.sendError(null, err.message));
      });
  
    } catch (error) {
      return res.status(500).json(resp.sendError(null, error.message));
    }
  };

exports.deleteLeave = async (req, res) => {
    try {
      const leaveId = req.params.id; // Get leave ID from request params
  
      // Find the leave entry
      let leave = await models.Leaves.findOne({ where: { id: leaveId } });
  
      if (!leave) {
        return res.status(404).json(resp.sendError(null, "Leave not found"));
      }
  
      // Soft delete by updating the `deletedAt` timestamp
      await leave.update({ deletedAt: new Date() });
  
      return res.status(200).json(resp.customInfo(null, "Leave deleted successfully"));
    } catch (error) {
      return res.status(500).json(resp.sendError(null, error.message));
    }
};

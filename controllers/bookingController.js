const resp = require("./basecontroller");
const validation = require("./validationController");
const models = require("../models");
const BookingModel = models.Booking;
const UserModel = models.User;

exports.createBooking = async (req, res) => {
  try {
    // Extract doctor ID from request body
    const { doctor_id, start_time, end_time, date } = req.body;

    // Validate required fields
    const validationRule = {
      doctor_id: "required|integer",
      start_time: "required|string",
      end_time: "required|string",
      date: "required|date",
    };

    await validation(req.body, validationRule, {}, async (err, status) => {
      if (!status) {
        return res
          .status(400)
          .json(resp.sendError(err.errors, "Validation failed"));
      } else {
        // Check if user is a doctor
        const doctor = await UserModel.findOne({
          where: { id: doctor_id, user_type: "doctor" },
        });

        if (!doctor) {
          return res
            .status(400)
            .json(
              resp.sendError(null, "Only doctors can create booking slots")
            );
        }

        // Create booking slot
        const bookingSlot = await BookingModel.create({
          doctor_id,
          start_time,
          end_time,
          date,
          booking_status: "available",
        });

        return res
          .status(200)
          .json(
            resp.customInfo(bookingSlot, "Booking slot created successfully")
          );
      }
    }).catch((err) => {
      console.log(err);
      res.status(400).json(resp.sendError(null, err.message));
    });
  } catch (error) {
    return res.status(500).json(resp.sendError(null, error.message));
  }
};

exports.getAllBooking = async (req, res) => {
  try {
    let userData = await BookingModel.findAll();
    if (userData.length = 0) {
      return res.status(200).json(resp.customInfo(null, "User not found"));
    }
    return res
      .status(200)
      .json(resp.customInfo(userData, "User list fetch successfully"));
  } catch (error) {
    return res.status(400).json(resp.sendError(null, error.message));
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await BookingModel.findOne({
      where: { id: userId  },
    });
    if (!user) {
      return res.status(200).json(resp.customInfo(null, "slot not found"));
    }

    return res.status(200).json(resp.fetched(user));
  } catch (error) {
    return res.status(400).json(resp.sendError(null, error.message));
  }
};

exports.cancleBooking = async (req, res) => {
  try {
    const userId = req.params.id;
    let userData = await BookingModel.findOne({
      where: { id: userId,  /*booking_status: "confirmed"*/ },
    });
    if (!userData) {
      return res.status(200).json(resp.customInfo(null, "slot not found"));
    }
    let update = userData.update({ booking_status: "cancelled" , deletedAt:new Date()});
    if (!update) {
      return res.status(200).json(resp.customInfo(null, "slot not updated"));
    }

    return res
      .status(200)
      .json(resp.customInfo(userData, "slot Delete successfully"));
  } catch (error) {
    return res.status(400).json(resp.sendError(null, error.message));
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const bookingId = req.params.id; // Get booking ID from request params
    const { booking_status, start_time, end_time } = req.body; // Get update data from request body

    // Find the booking by ID
    let booking = await BookingModel.findOne({
      where: { id: bookingId },
    });

    if (!booking) {
      return res.status(404).json(resp.customInfo(null, "Booking not found"));
    }

    // Update the booking details
    let updatedBooking = await booking.update({
      booking_status: booking_status || booking.booking_status,
      start_time: start_time || booking.start_time,
      end_time: end_time || booking.end_time,
      updatedAt: new Date(), // Set the current time for tracking updates
    });
    if (!updatedBooking) {
      return res.status(400).json(resp.customInfo(null, "booking not updated"));
    }
    return res.status(200).json(resp.customInfo(updatedBooking, "Booking updated successfully"));
  } catch (error) {
    return res.status(500).json(resp.sendError(null, error.message));
  }
};





// ****** for patient  *****//

exports.bookSlot = async (req, res) => {
  try {
    const bookingId = req.params.id; // Get booking ID from request params
    const { patient_id } = req.body; // Get patient_id from request body

    // Find the booking slot by ID
    let booking = await BookingModel.findOne({
      where: { id: bookingId, booking_status: "available" },
    });

    if (!booking) {
      return res.status(400).json(resp.customInfo(null, "Booking slot not available or not found"));
    }

    // Check if the patient exists and is of type "patient"
    const patient = await UserModel.findOne({
      where: { id: patient_id, user_type: "patient" },
    });

    if (!patient) {
      return res.status(400).json(resp.customInfo(null, "Only registered patients can book slots"));
    }

    // Update the slot to "confirmed" and assign the patient
    let updatedBooking = await booking.update({
      patient_id: patient_id,
      booking_status: "confirmed",
      updatedAt: new Date(), // Update timestamp
    });

    if (!updatedBooking) {
      return res.status(400).json(resp.customInfo(null, "Slot booking failed"));
    }

    return res.status(200).json(resp.customInfo(updatedBooking, "Slot booked successfully"));
  } catch (error) {
    return res.status(500).json(resp.sendError(null, error.message));
  }
};

exports.cancelSlot = async (req, res) => {
  try {
    const bookingId = req.params.id; // Get booking ID from request params

    // Find the booking by ID
    let booking = await BookingModel.findOne({ where: { id: bookingId } });

    if (!booking) {
      return res.status(400).json(resp.customInfo(null, "Booking not found"));
    }

    if (booking.booking_status !== "confirmed") {
      return res.status(400).json(resp.customInfo(null, "Only confirmed bookings can be canceled"));
    }

    // Cancel the slot by updating the status to 'available' and removing patient_id
    let updatedBooking = await booking.update({
      booking_status: "available",
      patient_id: null,
      updatedAt: new Date(), // Set current time for tracking updates
    });

    return res.status(200).json(resp.customInfo(updatedBooking, "Slot canceled successfully"));
  } catch (error) {
    return res.status(500).json(resp.sendError(null, error.message));
  }
};
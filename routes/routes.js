const express = require('express');
const multer = require('multer');
const upload = multer();
const group = require("express-group-routes");
const bodyParser = require('body-parser');
const router = express.Router();
const userController = require("../controllers/userController");
const bookingcontroller = require('../controllers/bookingController');
const adresscontroller = require('../controllers/addressController');
const Leavecontroller = require('../controllers/leavesController');
const authController = require('../controllers/authContoller');
const { authmiddleware , isAdmin} = require('../middleware/isAdmin');
// const handleDatabaseConnection =require('../middleware/dbconnection');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));


// 
router.post("/createUser",   upload.none(), authController.createUser);
router.post("/loginUser",   upload.none(), authController.loginUser);
// router.post("/createUser",   upload.none(), userController.createUser);
router.get("/getAllUser", authmiddleware, userController.getAllUser);
router.get("/getUserById/:id",  userController.getUserById);
router.delete("/deleteUserById/:id",  userController.deleteUser);
router.put("/updateUserById/:id",  upload.none(), userController.updateUser);


 //**** Booking API ******//

router.post("/createBooking",  upload.none(), bookingcontroller.createBooking);
router.get("/getAllBooking",  bookingcontroller.getAllBooking);
router.get("/getBookingById/:id",  bookingcontroller.getBookingById);
router.delete("/cancleBookingById/:id",  bookingcontroller.cancleBooking);
router.put("/updateBookingById/:id",  upload.none(), bookingcontroller.updateBooking);

//**** Address API ****//
router.post("/createAddress",  upload.none(), adresscontroller.createAddress);
router.put("/updateAddress/:id",  upload.none(), adresscontroller.updateAddress);
router.get("/getAllAddress",  adresscontroller.getAllAddress);
router.get("/getAllAddressById/:id",  adresscontroller.getAddressById);
router.delete("/deleteAddressById/:id",  adresscontroller.deleteAddress);

// **** leaves API ****//
router.post("/createLeave",  upload.none(), Leavecontroller.createLeave);
router.get("/getAllLeaves",  Leavecontroller.getAllLeaves);
router.get("/getLeaveById/:id",  Leavecontroller.getLeaveById);
router.put("/updateLeave/:id",  upload.none(), Leavecontroller.updateLeave);
router.delete("/deleteLeave/:id",  Leavecontroller.deleteLeave);



// ***** patient API ****//




// Create a sub-router for patient routes
const patientRouter = express.Router();
// Mount the patient router under "/patient"
router.use("/patient", patientRouter);
patientRouter.post("/bookSlot/:id",  upload.none(), bookingcontroller.bookSlot);
patientRouter.get("/getAllBooking",  bookingcontroller.getAllBooking);
patientRouter.put("/cancelSlot/:id",  bookingcontroller.cancelSlot);


// router.group("/patient", router => {
//   router.post("/bookSlot/:id",handleDatabaseConnection,upload.none(),bookingcontroller.bookSlot);
//   router.get("/getAllBooking",handleDatabaseConnection,bookingcontroller.getAllBooking);
//   router.put("/cancelSlot/:id",handleDatabaseConnection,bookingcontroller.cancelSlot);
// });





// router.group("/doctor", router => {
//     router.post("/createSlot", handleDatabaseConnection, upload.none(), slotcontroller.createSlot);
// });

//______ROUTE HERE______
// router.group("/admin", router => {
//   router.post("/addUser", upload.none(), userController.createUser);
//   router.get("/getAllUser", userController.getAllUser);
//   router.put("/updateUser/:id",upload.none(),userController.updateUser);
//   router.get("/getUserById/:id", userController.getUserById);
//   router.delete("/deleteById/:id", userController.deleteUser);
// });


module.exports = router;
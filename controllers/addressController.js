const resp = require("./basecontroller");
const validation = require("./validationController");
const models = require("../models");
const { where } = require("sequelize");
const UserModel = models.User;
const AddressModel = models.Address;

exports.createAddress = async (req, res) => {
    try {
      var validationRule = {
        street: "required|string",
        city: "required|string",
        state: "required|string",
        postal_code: "required|string",
        country: "required|string",
        user_id: "required|integer", // Ensure the user_id is provided

        
      };
  
      await validation(req.body, validationRule, null, async (err, status) => {
        if (!status) {
          return res.status(400).json(resp.sendError(err.errors, "Validation failed"));
        }
  
        // Create the address
        let addressData = await AddressModel.create(req.body);
        if (!addressData) {
          return res.status(400).json(resp.sendError(null, "Address not created"));
        }
  
        // Update user's address_id field
        let updatedUser = await UserModel.update(
          { address_id: addressData.id },
          { where: { id: req.body.user_id } }
        );
  
        if (!updatedUser) {
          return res.status(400).json(resp.sendError(null, "Failed to update user with address"));
        }
  
        return res.status(200).json(resp.customInfo(addressData, "Address created and user updated"));
      }).catch((err) => {
        console.log(err);
        res.status(400).json(resp.sendError(null, err.message));
      });
    } catch (error) {
      return res.status(500).json(resp.sendError(null, error.message));
    }
  };

exports.updateAddress = async (req, res) => {
    try {
       const adressId = req.params.id;
       let address = await AddressModel.findOne({
        where: { id:adressId,deletedAt: null}
       })
       if(!address){
        return res.status(400).json(resp.customInfo(null,"adress not found"))
       }
       let updateAdress = await address.update(req.body);
       if(!updateAdress){
        return res.status(400).json(resp.customInfo(null, "address not updated"));
       }
       return res.status(200).json(resp.customInfo(updateAdress, "User updated successfully"));
    } catch (error) {
        return res.status(400).json(resp.sendError(null, error.message)); 
    }
}

exports.getAllAddress = async (req, res) => {
    try {
        let adressList = await AddressModel.findAll({ where: { deletedAt: null } });
        if(!adressList){
            return res.status(200).json(resp.customInfo(null, "no adress found"));
        }
      if (adressList.length <= 0) {
        return res.status(200).json(resp.customInfo(null, "not found"));
      }
      return res.status(200).json(resp.customInfo(adressList, "User list fetch successfully"));
    } catch (error) {
      return res.status(400).json(resp.sendError(null, error.message));
    }
  };

exports.getAddressById = async (req, res) => {
    try {
      const addressId = req.params.id;
      let user = await AddressModel.findOne({
        where: { id: addressId, deletedAt: null },
      });
      if (!user) {
        return res.status(200).json(resp.customInfo(null, "address not found"));
      }
  
      return res.status(200).json(resp.fetched(user));
    } catch (error) {
      return res.status(400).json(resp.sendError(null, error.message));
    }
};


// new apis

exports.deleteAddress = async (req, res) => {
    try {
      const addressId = req.params.id;
  
      // Find the address
      let addressData = await AddressModel.findOne({
        where: { id: addressId },
      });
  
      if (!addressData) {
        return res.status(404).json(resp.customInfo(null, "Address not found"));
      }
  
      // Soft delete the address by setting deletedAt
      await addressData.update({ deletedAt: new Date() });
  
      // Update user table: set address_id = null where address_id = addressId
      await UserModel.update(
        { address_id: null },
        { where: { address_id: addressId } }
      );
  
      return res
        .status(200)
        .json(resp.customInfo(addressData, "Address deleted and user updated successfully"));
    } catch (error) {
      return res.status(500).json(resp.sendError(null, error.message));
    }
  };
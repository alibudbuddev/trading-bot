const WalletModel = require('./../models/wallet-model').model;
const controller = {};

controller.getWallet = async () => {
  try {
    const result = await WalletModel.findOne({id: 1});
    return {success: true, payload: result};
  } catch (error) {
    return {success: false, error: error.message};
  }
}

controller.updateOrCreate = async (balance) => {
  try {
    const filter = { id: 1 };
    const update = {
      balance: balance
    };

    await WalletModel.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true,
      rawResult: true // Return the raw result from the MongoDB driver
    });
    return {success: true}
  } catch (error) {
    return {success: false, error: error.message};
  }
}

module.exports = controller;
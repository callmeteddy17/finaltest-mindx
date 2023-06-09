const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const InventorySchema = new Schema({
  sku: {
    type: String,
    require: true,
    unique: true,
  },
  description: {
    type: String,
    require: true,
    min: 4,
    unique: true,
  },
  instock: {
    type: Number,
    require: true,
  },
});

const InventoryModel = model('Inventory', InventorySchema);

module.exports = InventoryModel;

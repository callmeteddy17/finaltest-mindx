const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('./User');
const Inventory = require('./Inventory');
const Order = require('./Order');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const app = express();

mongoose.connect(
  'mongodb+srv://dtd172000:*******@cluster0.9jwnpwf.mongodb.net/finaltest' // vì lý do bảo mật nên em không share được password, sẽ có ảnh đính kèm file về câu 1
);

// router.get('/inventory', async (req, res) => {
//   try {
//     const inventories = await Inventory.find();
//     res.json(inventories);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

router.get('/inventory', async (req, res) => {
  const { quantity } = req.query;
  const query = quantity === 'low' ? { instock: { $lt: 100 } } : {};
  try {
    const inventory = await Inventory.find(query);
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, role: req.user.role },
      process.env.JWT_SECRET
    );
    res.json({ token });
  }
);
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
}

router.get('/restricted', verifyToken, async (req, res) => {
  try {
    res.json({ message: 'This is a restricted resource' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('item');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.use(router);
app.listen(3000, () => {
  console.log('App is running at 3000');
});

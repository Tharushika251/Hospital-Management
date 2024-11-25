const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const QRCode = require('qrcode'); // Add QRCode package
const User = require('../models/User');
const router = express.Router();
const cookieParser = require('cookie-parser');

router.use(cookieParser());
const dotenv = require('dotenv');
dotenv.config();

// Register Route
router.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword, age, type } = req.body;

  // Validate fields
  if (!name || !email || !password || !confirmPassword || !age) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ msg: 'Passwords do not match' });
  }

  try {
    // Check if the user exists by email
    let userByEmail = await User.findOne({ email });
    if (userByEmail) {
      return res
        .status(400)
        .json({ msg: 'User already exists with this email' });
    }

    // Check if the user exists by name
    let userByName = await User.findOne({ name });
    if (userByName) {
      return res
        .status(400)
        .json({ msg: 'User already exists with this name' });
    }

    // Hash password and create user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user instance
    const user = new User({
      name,
      email,
      age,
      password: hashedPassword,
      type,
    });

    // Save the user to the database
    await user.save();

    // Generate QR code based on the user's ID
    const qrCodeData = JSON.stringify({ id: user._id, email: user.email, name : user.name, });
    const qrCodeUrl = await QRCode.toDataURL(qrCodeData);

    // Update the user with the QR code URL
    user.qrCode = qrCodeUrl; // Assuming you add this field to the schema
    await user.save();

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login Route
// Login Route
router.route('/login').post((req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
            res.json({ status: 'error', error: err.message });
          } else {
            if (result) {
              const token = jwt.sign({ email: user.email }, 'jwt-secret-key', {
                expiresIn: '1d',
              });
              // Set the token as a cookie
              res.cookie('token', token, { httpOnly: true, maxAge: 86400000 }); // Max age set to 1 day in milliseconds
              res.cookie('userEmail', user.email, { maxAge: 86400000 });

              // Send user details including QR code
              res.json({
                status: 'success',
                userId: user._id,
                name: user.name,
                age: user.age,
                type: user.type,
                qrCode: user.qrCode, // Add the QR code to the response
              });
            } else {
              res.status(401).json({ status: 'incorrect password' });
            }
          }
        });
      } else {
        res.status(404).json({ status: 'no record existed' });
      }
    })
    .catch((err) => {
      res.status(500).json({ status: 'error', error: err.message });
    });
});


// Route to search for users by username
router.get('/search', async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ msg: 'Please provide a username to search' });
  }

  try {
    const users = await User.find({
      name: { $regex: username, $options: 'i' },
    }).select('name _id');
    if (!users.length) {
      return res.status(404).json({ msg: 'No users found' });
    }
    const userSuggestions = users.map((user) => ({
      username: user.name,
      id: user._id,
    }));
    res.json(userSuggestions);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get users with user type 'user'
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ type: 'user' }); // Fetch users with type 'user'
    res.status(200).json(users); // Respond with the user details
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users.', error });
  }
});

router.get('/initial', async (req, res) => {
  try {
    // Fetch most active or recent users, you can customize this query based on your data
    const users = await User.find()
      .sort({ activity: -1 })
      .limit(10)
      .select('name _id');
    res.json(users.map((user) => ({ username: user.name, id: user._id })));
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;

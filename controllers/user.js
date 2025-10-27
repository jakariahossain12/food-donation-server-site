const User = require("../models/user");
// user data get by user email
async function handelGetUserByEmail(req, res) {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email query parameter is required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User retrieved successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
}
//  user data save in mongodb 
async function handelSaveUserData(req, res) {
  try {
    const userData = req.body;
    const query = { email: userData.email };

    if (!userData.email) {
      return res.status(400).json({ error: 'Email is required in request body' });
    }

    const existingUser = await User.findOne(query);

    if (existingUser) {
      existingUser.last_login = new Date().toISOString();
      await existingUser.save();
      return res.status(200).json({ message: 'User login time updated', user: existingUser });
    }

    const newUser = new User(userData);
    const savedUser = await newUser.save();
    res.status(201).json({ message: 'New user created', id: savedUser._id });

  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
}


module.exports={
    handelGetUserByEmail,
    handelSaveUserData
}
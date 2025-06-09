const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require("uuid");
const sendEmail = require('../Services/sendEmail');
const verifyEmail = require('../Services/verifyEmail');
const { setUser, getUser } = require('../Services/auth');

const users = {};

exports.signup = async (req, res) => {
  const { fullname, email, password } = req.body;
  
  if (!fullname || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  
  const isEmailValid = await verifyEmail(email);
  if (!isEmailValid) {
    return res.status(400).json({ message: 'Invalid email address' });
  }
  
  if (users[email]) {
    return res.status(400).json({ message: 'Email already exists' });
  }
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    users[email] = {
      id: uuidv4(),
      fullname,
      email,
      password: hashedPassword,
    };
    
    try {
      await sendEmail(
          email,
          'Welcome to Our Service!',
          `Your account has been created!\n\nYour credentials:\nEmail: ${email}\nPassword: ${password}`
      );
      res.status(201).json({ message: 'User created successfully and email sent!' });
    } catch (error) {
      res.status(500).json({ message: 'User created but failed to send email.' });
    }
    
  } catch (error) {
    console.error('Error signing up user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  const existingUser = users[email];
  
  if (!existingUser) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }
  
  const isPasswordValid = await bcrypt.compare(password, existingUser.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }
  
  const sessionId = uuidv4();
  setUser(sessionId, existingUser);
  res.cookie("uid", sessionId);
  res.status(200).json({ message: 'Login successful', sessionId });
};

exports.data = async (req, res) => {
  const { email } = req.params;
  
  const userData = users[email];
  if (!userData) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  res.status(200).json(userData);
};

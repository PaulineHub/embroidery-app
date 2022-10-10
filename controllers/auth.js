const User = require('../models/user');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {
  // check if user already exist
  const { email } = req.body;
  const user = await User.findOne({ email })
  if (user) {
    throw new BadRequestError('User already exists.');
  } else {
    // create new user
    const user = await User.create({ ...req.body });
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({ token });
  }
  
}

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials');
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials');
  }
  // compare password
  const token = user.createJWT();
  console.log('token',token);
  res.status(StatusCodes.OK).json({ user: token });
}



module.exports = {
  register,
  login
}

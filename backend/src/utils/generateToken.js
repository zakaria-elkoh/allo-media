import jwt from "jsonwebtoken";

const generateToken = function (user, expiresIn) {
  return jwt.sign(
    {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn }
  );
};

export default generateToken;

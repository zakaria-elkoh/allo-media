import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

export function sendOTP() {
  const mobileNo = "+212705074846";
  const OTP = generateRandomNumber(1000, 9999) || 2222;

  const params = {
    Message: `Welcome! Your mobile verification code is: ${OTP}. Mobile Number is: ${mobileNo}`,
    PhoneNumber: mobileNo,
  };

  const sns = new AWS.SNS({
    apiVersion: "2010-03-31",
    accessKeyId: process.env.AWS_ACCESS_TOKEN,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_TOKEN,
    region: process.env.AWS_REGION,
  });

  console.log("sns", sns);

  return sns
    .publish(params)
    .promise()
    .then((message) => {
      console.log("OTP SEND SUCCESS");
      return message;
    })
    .catch((err) => {
      console.log("Error ", err);
      throw err;
    });
}

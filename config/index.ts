import path from 'path';
const dotenv = require('dotenv-safe');

// Set the NODE_ENV to 'development' by default
// process.env.NODE_ENV = process.env.NODE_ENV || "development";

const envFound = dotenv.config({
  path: path.join(__dirname + '/.env'),
  sample: path.join(__dirname + '/.env.example'),
});

if (!envFound) {
  // This error should crash whole process
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

const loadEnvironmentVariables = () => {
  if (!envFound) {
    // This error should crash whole process
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
  } else {
    const example =
      process.env.NODE_ENV === 'development' ? './config/.env' : './config/.env.example';
    return dotenv.config({ example });
  }
};

export { loadEnvironmentVariables };

const mongoose = require('mongoose');
const { DatabaseError } = require('../utils/customErrors');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    const dbError = new DatabaseError(`Database Connection Error: ${error.message}`);
    logger.error(dbError.message);
    process.exit(1);
  }
};

module.exports = connectDB;

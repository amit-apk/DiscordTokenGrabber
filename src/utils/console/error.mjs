import process from "process";
import axios from "axios";
import colors from "colors";

export const error = async () => {
  try {
    process.on('unhandledRejection', (reason, p) => {
      console.log('\n\n\n\n\n=== unhandled Rejection ==='.toUpperCase().yellow.dim);
      console.log('Reason: ', reason.stack ? String(reason.stack).gray : String(reason).gray);
      console.log('=== unhandled Rejection ===\n\n\n\n\n'.toUpperCase().yellow.dim);
    });
    process.on("uncaughtException", (err, origin) => {
      console.log('\n\n\n\n\n\n=== uncaught Exception ==='.toUpperCase().yellow.dim);
      console.log('Exception: ', err.stack ? String(err.stack).gray : String(err).gray)
      console.log('=== uncaught Exception ===\n\n\n\n\n'.toUpperCase().yellow.dim);
    })
    process.on('uncaughtExceptionMonitor', (err, origin) => {
      console.log('\n\n\n\n\n=== uncaught Exception Monitor ==='.toUpperCase().yellow.dim);
      console.log('Exception: ', err.stack ? String(err.stack).gray : String(err).gray)
      console.log('=== uncaught Exception Monitor ===\n\n\n\n\n'.toUpperCase().yellow.dim);
    });
    process.on('warning', (err) => {
      console.log('\n\n\n\n\n=== uncaught Warning ==='.toUpperCase().yellow.dim);
      console.log('Exception: ', err.stack ? String(err.stack).gray : String(err).gray)
      console.log('=== uncaught Warning ===\n\n\n\n\n'.toUpperCase().yellow.dim);
    })
  } catch (err) {
    err.stack ? console.log(String(err.stack).bgRed) : console.log(String(err).gray)
  }
}

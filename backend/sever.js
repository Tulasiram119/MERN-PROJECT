const app = require("./app.js");
const dotenv = require("dotenv");
const connectToDatbase = require("./config/database.js");
//handling uncaught exceptions
process.on("uncaughtException",(err)=>{
    console.log(`Error :${err.message}`);
    console.log("server is shutting down due to uncaughtexception");
    process.exit(1);
})
dotenv.config({ path: "backend/config/config.env" });
connectToDatbase();
const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server is running on the port http://localhost:${process.env.PORT}`
  );
});

//unhandeled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err}`);
  console.log("server is closing due to un handled rejection");
  server.close(() => {
    process.exit(1);
  });
});

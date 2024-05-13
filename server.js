const express = require('express');
const userRouter = require("./routes/user/userRoute");
const postRouter = require("./routes/posts/postRoute");
const commentsRouter = require("./routes/comments/commentsRoute");
const categoriesRouter = require('./routes/categories/categoriesRoute');
const globalErrHandler = require('./middlewares/globalErrHandler');
const {appErr, AppErr} = require('./utils/appErr');
const isAdmin = require('./middlewares/isAdmin');

require('dotenv').config();
require("./config/dbconnect");
const app = express();

//----------------------
//Middlewares
//----------------------
app.use(express.json()); //Parse incoming requests with JSON payloads

//----------------------
//Routes
//----------------------

//user route
app.use("/api/v1/users/", userRouter);

//------------------
//post route
//------------------

app.use("/api/v1/posts/", postRouter);


//---------------------------
//comments route
//---------------------------

app.use("/api/v1/comments/", commentsRouter);

//--------------------------------------
//categories route
//--------------------------------------

app.use("/api/v1/categories/", categoriesRouter);

//---------------------------------------
//Error Handling Middleware
//---------------------------------------
app.use(globalErrHandler);

//404 error 
// app.use("*", (req, res) => {
//   res.statusCode(404).json({ status: "fail", message: "Route Not Found" });
// });


//Listen to server

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
    console.log(`Server is up and running on ${PORT}`);
  });
  

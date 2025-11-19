const express = require('express')
const path = require('node:path')
const expressSession = require('express-session')
const { PrismaClient } = require('@prisma/client')
const { PrismaSessionStore } = require('@quixo3/prisma-session-store')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const fileRouter = require('./routes/fileRouter')
const folderRouter = require('./routes/folderRouter')
const userRouter = require('./routes/userRouter')
const indexRouter = require('./routes/indexRouter')
const bodyParser = require('body-parser')
const passport = require('passport')

const app = express();


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use(
  expressSession({
    cookie: {
     maxAge: 7 * 24 * 60 * 60 * 1000 
    },
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(
      new PrismaClient(),
      {
        checkPeriod: 2 * 60 * 1000,  
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
  })
);

app.use(passport.session());
require('./config/passport');

app.use('/file', fileRouter)
app.use('/folder', folderRouter)
app.use('/users', userRouter);
app.use('/', indexRouter)


const PORT = 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Members Only - listening on port ${PORT}!`);
});


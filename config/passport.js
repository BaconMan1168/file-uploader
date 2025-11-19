const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyUser(username, password, done){
    try {
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        })

        if (!user){
            return done(null, false, { message: "Incorrect username or password"})
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match){
            return done(null, false, { message: "Incorrect username or password"})
        }

        return done(null, user);
    }
    catch (err) {
        return done(err);
    }
}

const strategy = new LocalStrategy(verifyUser);
passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser((userId, done) => {
    prisma.User.findUnique({
        where: {
            id: userId
        }
    }).then((user) => {
        done(null, user)
    }).catch(err => done(err)) 
})

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export default function configurePassport() {

    // Local Strategy
    passport.use(
        new LocalStrategy(async (username, password, done) => {
            try {
                // Find user by username
                const user = await User.findOne({ username });

                if (!user) {
                    return done(null, false, {
                        message: 'Invalid username or password'
                    });
                }

                // Compare submitted password with hashed password
                const isMatch = await bcrypt.compare(
                    password,
                    user.password
                );

                if (!isMatch) {
                    return done(null, false, {
                        message: 'Invalid username or password'
                    });
                }

                // Authentication successful
                return done(null, user);

            } catch (err) {
                return done(err);
            }
        })
    );

    // Store the user's ID in the session
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // Retrieve the user using the ID stored in the session
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    });
}

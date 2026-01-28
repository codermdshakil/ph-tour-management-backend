/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import bcryptjs from "bcryptjs";
import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { envVars } from "./env";




passport.use(
  new LocalStrategy({
    usernameField:"email",
    passwordField:"password"
  }, async (email:string, password:string, done) => {

    try {

      const isUserExist = await User.findOne({email});

      if(!isUserExist){
        return done(null, false, {message:"User does not Exist!!"})
      }

      // check user google authenticated
      const isGoogleAuthenticated = isUserExist.auths.some(providerObjects => providerObjects.provider == "google");

      if(isGoogleAuthenticated && !isUserExist.password){
        return done(null, false, {message:"You have authenticated through Google. SO, if you want to login with credentials, then at first login with Google and set a password with your Gmail and then you can login using Email and Password!!"})
      }

      

      const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string);

      if(!isPasswordMatched){
        return done(null, false, {message:"Password does not Matched!"})
      }

      // check if usre is google authenticated then show warning 

      return done(null, isUserExist);
      
    } catch (error) {
      console.log(error);
      done(error)
    }

  })
)


passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback,
    ) => {
      try {
        const email = profile.emails?.[0].value;

        if (!email) {
          return done(null, false, { message: "No Email found!" });
        }

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0].value,
            role: Role.USER,
            isVerified: true,
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });
        }

        return done(null, user);
      } catch (error) {
        console.log("Google strategy Error", error);
        return done(error);
      }
    },
  ),
);


passport.serializeUser((user:any, done:(err:any, id?:unknown) => void) => {
  done(null, user._id)
});

passport.deserializeUser(async (id:string, done :any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
    
  } catch (error) {
    console.log(error, "from passport config");
    done(error);
  }
})


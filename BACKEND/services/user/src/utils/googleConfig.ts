import {google} from "googleapis";



const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;


export const oauth2client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
     GOOGLE_CLIENT_SECRET,
     "postmessage"
     );


//"postmessage" tells Google OAuth:
//“I am NOT using a browser redirect.
// I will receive the auth code directly from the frontend and exchange it on the backend.”
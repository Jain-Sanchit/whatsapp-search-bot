import { google } from "googleapis";
import dotenv from "dotenv";
import twilio from "twilio";

dotenv.config();

const {
  SID,
  KEY,
  googleApiKey,
  cx,
} = require('../../keys');

twilio(SID, KEY);
const { MessagingResponse } = twilio.twiml;
const customsearch = google.customsearch("v1");

class WhatsappBot {
  static async googleSearch(req, res, next) {
      // console.log("BOTTT");
    const twiml = new MessagingResponse();
    const q = req.body.Body;    
    const options = { cx, q, auth: googleApiKey };

    try {
      const result = await customsearch.cse.list(options);
      const firstResult = result.data.items[0];
      const searchData = firstResult.snippet;
      const link = firstResult.link;
        // console.log(searchData);
      twiml.message(`${searchData} ${link}`);

      res.set("Content-Type", "text/xml");

      return res.status(200).send(twiml.toString());
    } catch (error) {
        // console.log(error);
      return next(error);
    }
  }
}

export default WhatsappBot;
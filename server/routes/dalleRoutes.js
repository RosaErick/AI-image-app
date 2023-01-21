import express from "express";
import * as dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";
dotenv.config();

const router = express.Router();

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

router.route("/").get((req, res) => {
  res.send("Hello World!");
});

router.route("/").post(async (req, res) => {
  try {
    const { prompt } = req.body;

    const aiResponse = await openai.createImage({
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    const image = aiResponse.data.data[0].b64_json;

    if (image) {
      res.status(200).json({
        photo: image,
      });
    } else {
      res.status(400).json({
        message: "Error",
      });
    }
  } catch (err) {
    console.log(err);

    res.status(500).json(err?.response?.data.error?.message || err);
  }
});

export default router;

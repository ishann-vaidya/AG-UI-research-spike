import express from "express";
import cors from "cors";
import {
  initStream,
  createIds,
  streamText,
} from "../shared/ag-ui-adapter.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/agent-mastra", async (req, res) => {
  initStream(res);

  const ids = createIds("mastra-thread");

  await streamText(
    res,
    "Mastra adapter active. Executing structured workflow simulation.",
    ids,
    60
  );
});

app.listen(8125, () => {
  console.log("Mastra dummy running on http://localhost:8125");
});

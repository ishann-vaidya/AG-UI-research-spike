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

app.post("/agent-langchain", async (req, res) => {
  initStream(res);

  const ids = createIds("langchain-thread");

  await streamText(
    res,
    "LangChain adapter active. Simulating reasoning chain execution.",
    ids,
    80
  );
});

app.listen(8124, () => {
  console.log("LangChain dummy running on http://localhost:8124");
});

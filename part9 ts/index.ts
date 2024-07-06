import express from "express";
import { calculateBmi } from "./bmiCalculator";
import { isNumber } from "./utils";
import { calculateExercises } from "./exerciseCalculator";
const app = express();
app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const { height, weight } = req.query;
  if (!isNumber(height) || !isNumber(weight)) {
    res.status(400).json({ error: "malformatted parameters" });
    return;
  }

  const heightNumber = Number(height);
  const weightNumber = Number(weight);

  const bmi = calculateBmi(heightNumber, weightNumber);
  const result = { height: heightNumber, weight: weightNumber, bmi };
  res.json(result);
});

app.post("/exercises", (req, res) => {
  console.log("body", req.body);
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { daily_exercises, target } = req.body;
    if (daily_exercises === undefined || target === undefined) {
      res.status(400).json({ error: "parameters missing" });
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const result = calculateExercises(daily_exercises, target);
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: "malformatted parameters" });
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

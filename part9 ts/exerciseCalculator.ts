interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

type exerciseInput = {
  target: number;
  days: number[];
};

const parseExerciseArguments = (args: string[]) => {
  if (args.length < 4) throw new Error("Not enough arguments");

  return args.reduce(
    (prev, curr, idx) => {
      if (idx < 2) return prev;
      if (isNaN(Number(curr)))
        throw new Error("Provided values were not numbers!");
      if (idx === 2) prev.target = curr;
      if (idx > 2) prev.days = prev.days.concat(curr);
      return prev;
    },
    { target: null, days: [] }
  );
};

const calculateExercises = (exerciseDone: number[], target: number): Result => {
  const periodLength = exerciseDone.length;
  const trainingDays = exerciseDone.reduce((days, current) => {
    if (current > 0) return days + 1;
    return days;
  }, 0);
  const totalExercise = exerciseDone.reduce((acc, curr) => {
    return acc + Number(curr);
  }, 0);
  console.log("total:", totalExercise);
  const average = totalExercise / periodLength;

  const success = average >= target;

  const ratingNumber = average / target;

  let rating = 0;
  if (ratingNumber < 0.5) rating = 1;
  else if (ratingNumber < 1) rating = 2;
  else rating = 3;

  let ratingDescription = "";
  if (rating === 1) ratingDescription = "not good";
  if (rating === 2) ratingDescription = "not too bad but could be better";
  if (rating === 3) ratingDescription = "very good";

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

const input = parseExerciseArguments(process.argv);
console.log("input:", input);
console.log(calculateExercises(input.days, input.target));

interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const calculateExercises = (exerciseDone: number[], target: number): Result => {
  const periodLength = exerciseDone.length;
  const trainingDays = exerciseDone.reduce((days, current) => {
    if (current > 0) return days + 1;
    return days;
  }, 0);
  const totalExercise = exerciseDone.reduce((acc, curr) => {
    return acc + curr;
  }, 0);
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

console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2));

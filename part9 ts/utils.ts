export const isNumber = (input: unknown): boolean => {
  if (input instanceof Array) {
    for (const item of input) {
      if (!checkNumber(item)) return false;
    }
    return true;
  }
  return checkNumber(input);
};

const checkNumber = (input: unknown) => {
  return input !== "" && !isNaN(Number(input));
};

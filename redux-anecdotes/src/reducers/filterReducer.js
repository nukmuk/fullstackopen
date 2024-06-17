const reducer = (state = "", action) => {
  switch (action.type) {
    case "SET_FILTER":
      return action.payload;
  }
  return state;
};

export const filterChange = (filter) => {
  return {
    type: "SET_FILTER",
    payload: filter,
  };
};

export default reducer;

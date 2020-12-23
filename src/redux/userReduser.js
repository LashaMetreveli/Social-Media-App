import { FETCH_USER } from "./actions";

const initialState = {
  user: ".",
};

function userReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_USER:
      return { user: action.payload };
    default:
      return state;
  }
}

export default userReducer;

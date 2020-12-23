export const FETCH_USER = "FETCH_USER";

export const fetchUser = (user) => ({
  type: FETCH_USER,
  payload: user,
});

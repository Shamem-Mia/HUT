export const isGuestUser = () => {
  return localStorage.getItem("guestKey") !== null;
};

export const getGuestKey = () => {
  return localStorage.getItem("guestKey");
};

export const clearGuestSession = () => {
  localStorage.removeItem("guestKey");
};

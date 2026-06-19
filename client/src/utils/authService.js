let logoutFn;

export const setLogout = (fn) => {
  logoutFn = fn;
};

export const triggerLogout = (reason) => {
  logoutFn?.(reason);
};
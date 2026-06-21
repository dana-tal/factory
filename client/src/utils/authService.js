let logoutFn;
let updateRemainingActionsFunc;

export const setLogout = (fn) => {
  logoutFn = fn;
};

export const triggerLogout = (reason) => {
  logoutFn?.(reason);
};

export const setRemainingActionsFunc = (fn) =>{
    updateRemainingActionsFunc = fn;
}

export const updateRemainingActions = (remaining)=>{
     updateRemainingActionsFunc(remaining);
}
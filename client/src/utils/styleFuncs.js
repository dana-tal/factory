
const getButtonFontSize = () => {
  let size = "11px";

  if (window.matchMedia("(min-width: 401px)").matches) size = "12px";
  if (window.matchMedia("(min-width: 768px)").matches) size = "17px";
  if (window.matchMedia( "(min-width: 912px)").matches) size = "17px";
  if (window.matchMedia("(min-width: 1280px)").matches) size = "19px";

  return size;
};


export {
    getButtonFontSize,
   
}
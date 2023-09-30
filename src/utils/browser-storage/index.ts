 export const setItemLocalStorage = (key: string, value: string): void => {
   return  localStorage.setItem(key, value);
 };

 export const getItemLocalStorage = (key: string): string|null => {
   return  localStorage.getItem(key);
 };

 export const removeItemLocalStorage = (key: string): void => {
    localStorage.removeItem(key);
 };

 export const clearLocalStorage = () => {
  localStorage.clear();
 };









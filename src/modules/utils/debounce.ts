export const debounce = (fn: Function, delay: number) => {
  var timeout: any;
  return (...args: any[]) => {
    var later = () => {
      fn(...args);
    }
    clearTimeout(timeout);
    timeout = setTimeout(later, delay);
  }
}
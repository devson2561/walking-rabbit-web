export function removeItemByIndex(arr: any, index: number) {
  if (index > -1 && index < arr.length) {
    arr.splice(index, 1);
    return arr;
  }
}

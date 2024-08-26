export const objectFilter = (obj: any, predicate: any) =>
  Object.keys(obj).filter(key => predicate(obj[key])).reduce((res: any, key) => (res[key] = obj[key], res), {});


export const genRandomNum = () => {
  return Math.floor(Math.random() * (9999999999 - 1000000000 + 1)) + 1000000000;
}


export const getOrdinal = (n: number) => {
  let ord = 'th';
  if (n % 10 == 1 && n % 100 != 11) ord = 'st';
  else if (n % 10 == 2 && n % 100 != 12) ord = 'nd';
  else if (n % 10 == 3 && n % 100 != 13) ord = 'rd';
  return ord;
}

export const randomRange = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
}
export const randomFloat = (min: number, max: number) => Math.random() * (max - min) + min;
export const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

export const randomElement = <T>(array: T[]): T => array[randomInt(0, array.length - 1)];

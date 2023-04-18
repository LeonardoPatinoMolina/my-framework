import { Counter } from "./counter.js";
import { Result } from "./result";

export const PAGES = new Map([
  [ "/", Counter],
  ["/result/:result", Result],
]);
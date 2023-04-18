import { Counter } from "./counter.js";
import { Prueva } from "./prueva";
import { Result } from "./result";

export const PAGES = new Map([
  [ "/", Prueva],
  ["/result/:result", Result],
]);
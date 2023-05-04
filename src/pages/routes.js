import { Counter } from "./counter.js";
import { Pruevas } from "./pruevas.js";
import { Result } from "./result.js";

export const PAGES = new Map([
  [ "/", Counter],
  [ "/pruevas", Pruevas],
  ["/result/:result", Result],
]);
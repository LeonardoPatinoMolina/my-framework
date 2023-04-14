import { Counter } from "./counter.js";
import { NotFound } from "../components/notFound";
import { Result } from "./result";

export const PAGES = new Map([
  [ "/", Counter],
  ["/otra", NotFound],
  ["/resultado/:result", Result],
]);
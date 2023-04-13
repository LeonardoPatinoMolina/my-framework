import { Counter } from "./counter.js";
import { NotFound } from "../components/notFound";

export const PAGES = 
  {
    "/": Counter,
    "/otra": NotFound
  };
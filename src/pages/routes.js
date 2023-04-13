import { Counter } from "./home.js";
import { Header } from "../components/header.js";
import { NotFound } from "../components/notFound";

export const PAGES = 
  {
    "/": Counter,
    "/header": NotFound
  };
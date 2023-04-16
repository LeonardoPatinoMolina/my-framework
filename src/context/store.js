import { MyGlobalStore } from "../lib/my_framework/globalStore.js";
import { userShef } from "./feature/user.js";

export const store = MyGlobalStore.configStore({
  reducers: {
    [userShef.name]: userShef.shelf
  }
});
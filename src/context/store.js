import { MyGlobalStore } from "../lib/my_framework/GlobalStore.js";
import { userShef } from "./feature/user.js";

export const store = MyGlobalStore.configStore({
  reducers: {
    [userShef.name]: userShef
  }
});
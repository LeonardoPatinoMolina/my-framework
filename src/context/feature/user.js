import { createShelf } from "../../lib/my_framework/GlobalStore.js";

export const userShef = createShelf({
  name: 'user',
  initialData: [],
  reducer: {
    setUser: (data, payload)=>{
      data.push(payload);
    }
  }
});

export const { setUser } = userShef.reducers;
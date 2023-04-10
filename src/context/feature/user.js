import { createShelf } from "../../lib/my_framework/GlobalStore.js";

export const userShef = createShelf({
  name: 'user',
  initialData: ['homerpo', 'epa'],
  reducer: {
    setUser: (data, payload)=>{
      data.push(payload);
    }
  }
});

export const { setUser } = userShef.reducers;
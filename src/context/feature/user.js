import { createShelf } from "../../lib/my_framework/GlobalStore.js";

export const userShef = createShelf({
  name: 'user',
  initialData: ['homerpo', 'epa'],
  reducers: {
    setUser: (data, payload)=>{
      data.push(payload);
    }
  }
});

export const { setUserDispatch } = userShef.actions;
import { createShelf } from "../../lib/my_framework/globalStore.js";

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
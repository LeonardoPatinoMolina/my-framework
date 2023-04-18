import { MyComponent } from "../lib/my_framework/component.js";

export class Nieto extends MyComponent{

  ready(){
    this.$.effect(()=>{
      return ()=>{
        console.log('epa si funciona');
      }
    },[]);
  }

  build(){
    return super.template(()=>`
      <div>Lorem nieto
      </div>
    `)
  }
}
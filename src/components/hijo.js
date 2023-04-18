import { MyComponent } from "../lib/my_framework/component.js";
import { Nieto } from "./nieto";

export class Hijo extends MyComponent{
  
  build(){
    return super.template(()=>`
      <div>Lorem hijo
        ${new Nieto('nieto').attach(this)}
      </div>
    `)
  }
}
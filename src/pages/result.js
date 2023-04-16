import { MyComponent } from "../lib/my_framework/component.js";
import { MyRouter } from "../lib/my_framework/router";

export class Result extends MyComponent{
  constructor(){
    super('result-page');
  }

  init(){
    const { result } = MyRouter.params(); 
    this.state = {
      result 
    };
  }

  build(){
    return super.template((_)=>`
    <main>
      <h2>resultado</h2>
      <p>El resultado es ${this.state.result}</p>
      <button ${_.on('click', ()=>{MyRouter.back()})}>Go back</button>
    </main>
    `);
  }
}
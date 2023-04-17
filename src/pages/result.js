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
      <h1>Mi Resultado</h1>
      <p class="number">${this.state.result}</p>
      <p align="center">
        <img 
          draggable="false" 
          class="image_2" 
          src="https://i.postimg.cc/sgBh0yHV/my-frame-icon.png" 
          width="auto" 
          height="200px" 
          alt="my framework logo" 
          title="my framework logo"
        >
      </p>
      <p class="info">todo lo que debes saber en este <a href="https://github.com/LeonardoPatinoMolina/my-framework" target="_blank">enlace</a></p>
      <button class="btn_neumorfus" ${_.on('click', ()=>{MyRouter.back()})}>Volver</button>
    </main>
    `);
  }
}
import { MyComponent } from "../lib/my_framework/component.js";

export class Pruevas extends MyComponent{
  constructor(){
    super("pruevas-page");
  }

  init(){
    this.state = {
      epa: 'hola',
      datos:{
        telefono: '2323'
      }
    }
  }

  build(){

    const r = ()=>{
      this.update(()=>{
        this.state.epa = 'hola mundo'
      })
    }
    const g = ()=>{
      this.update(()=>{
        this.state.epa = 'hola'
      })
    }
    return super.template((_)=>`
    <main class="container">
      <input
        type="text"
        ${_.inputController('datos','telefono')}
      >
      <p ${_.on('click',r)}
      >${this.state.epa}</p>
      <button ${_.on('click',r)}>si</button>
      <button ${_.on('click',g)}>no</button>
    </main>
    `);
  }
}
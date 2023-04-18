import { MyComponent } from "../lib/my_framework/component.js";
import { Hijo } from "../components/hijo";

export class Prueva extends MyComponent{
  constructor(){
    super('prueva-page')
  }

  init(){
    this.state = {
      isOpen: false
    }
  }
  build(){
    return super.template((_)=>`
      <div>Lorem home
        ${this.state.isOpen && new Hijo('hijo').attach(this)}
        <button ${_.on('click',()=>{
          this.update(()=>{
            this.state.isOpen = !this.state.isOpen
          })
        })}>click</button>
      </div>
    `)
  }
}
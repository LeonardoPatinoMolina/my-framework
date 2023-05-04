import { MyComponent } from "../lib/my_framework/component.js";
import { MyRouter } from "../lib/my_framework/router.js";

export class NotFound extends MyComponent{
  constructor(){
    super('nor-found')
  }
  build(){
    return super.template((_)=>`
      <div>
        <h2>404</h2>
        <p>no se pudo encontrar el contenido</p>
        <button ${_.on('click',()=>{MyRouter.params()})}>Back</button>
      </div>
    `)
  }
}
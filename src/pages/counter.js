import { MyComponent } from "../lib/my_framework/component.js";
import { MyRouter } from "../lib/my_framework/router";

export class Counter extends MyComponent{
  constructor(){
    super('counter-page');
  }

  init(){
    this.state = {
      count: 0,
      text: '',
    };
    
  }

  build(){
    const addCount = ()=>{
      this.update(()=>{
        this.state.count += 1;
      })
    }

    const upd = (e)=>{
      this.update(()=>{
        this.state.text = e.target.value
      })
    }

    return super.template((_)=>`
    <main id="con" class="container container2" >
      <h2 class="titulo">Mi Contador</h2>
      <img class="imagen-jopo" src="https://i.pravatar.cc/150?u=jopo">
      <p>${this.state.count} + 10</p>
      <button class="botonA" style="margin-bottom: 1rem;" ${_.on('click', addCount)}>add</button>
      <button class="botonB" ${_.on('click', ()=>{MyRouter.go(`/resultado/{${this.state.count + 10}}`)})}>Watch de result</button>
      <br>
      <input type="text" ${_.inputController(upd)} value="${this.state.text}">
    </main>
    `);
  }
}

    // fetch('https://jsonplaceholder.typicode.com/users')
    //   .then(r=>r.json())
    //   .then((res)=>{
    //     this.update(()=>{
    //       this.props.data = res;
    //     });
    //   });

      //  fetchCacheInterceptor('https://jsonplaceholder.typicode.com/users',{cacheName: 'users',revalidate: 60})
  //     .then((res)=>{
  //       this.props.data = res;
  //     })
  //     .finally(()=>{
  //       this.update(()=>{
  //         this.props.isReady = true;
  //       })
  //     })
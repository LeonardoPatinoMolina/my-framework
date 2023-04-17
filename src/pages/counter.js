import { MyComponent } from "../lib/my_framework/component.js";
import { MyRouter } from "../lib/my_framework/router";

export class Counter extends MyComponent{
  constructor(){
    super('counter-page');//key
  }

  init(){
    this.state = {
      count: 0,
    };
    
  }

  build(){
    const addCount = ()=>{
      this.update(()=>{
        this.state.count += 1;
      });
    }

    return super.template((_)=>`
    <main id="con" class="container" >
      <h1 class="titulo">Mi Contador</h2>
      <p align="center">
      <img 
        draggable="false" 
        class="image" 
        src="https://i.postimg.cc/sgBh0yHV/my-frame-icon.png" 
        width="auto" 
        height="200px" 
        alt="my framework logo" 
        title="my framework logo"
      >
    </p>
      <p class="number">${this.state.count} <span>+ 10</span></p>
      <button
        class="btn_neumorfus" 
        style="margin-bottom: 1rem;" 
        ${_.on('click', addCount)}
      >Añadir</button>
      <button 
        class="btn_neumorfus" 
        ${_.on('click', ()=>{MyRouter.go(`/result/{${this.state.count + 10}}`)})}
      >Ver resultado</button>
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
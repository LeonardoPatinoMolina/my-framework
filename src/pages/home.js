import { Component } from "../lib/my_framework/component.js";

export class Counter extends Component{
  constructor(){
    super('home-page');
  }

  init(){
    this.state = {
      count: 0
    };
  }

  build(){
    const addCount = ()=>{
      this.update(()=>{
        this.state.count += 1;
      })
    }

    return super.template((_)=>`
    <main>
      <h2>Mi Contador</h2>
      <p>${this.state.count}</p>
      <button ${_.on('click', addCount)}>add</button>
    </main>
    `);
  }
}
// import { Header } from "../components/header.js";
// import { MyGlobalStore } from "../lib/my_framework/GlobalStore.js";
// import { Router } from "../lib/my_framework/router.js";
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
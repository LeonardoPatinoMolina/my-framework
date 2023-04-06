import { Component } from "./lib/my_framework/component.js";
import { Card } from "./components/card/index.js";

export class App extends Component{
  static name = 'app'
  
  constructor(){
    super({
      props: {
        title: 'App',
        data: []
      },
      key: 'component-app'
    });
  }

  init(){
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(r=>r.json())
      .then((res)=>{
        this.update(()=>{
          this.props.data = res;
        });
      });
  }

  template(){
    return super.template(`
    <main>
    App
    ${(()=>{
        let articles = '';
        if(this.props.data.length > 0){
          this.props.data.forEach(d=>{
            articles += new Card({
              props: {
                name: d.name,
                email: d.email,
                user: d.username
              },
              key: `card-component-${d.id}`
            }).link(this)
          })
          return articles
        }else return articles;
      })()}
    </main>
    `);
  }
}


import { Component } from "../lib/my_framework/component.js";

export class Header extends Component{
  static name = 'header';
  constructor(){
    super({
      key: 'header-component',
      props:{
        title: 'header'
      }
    })
  }

  template(){
    return super.template(`
      <header >${this.props.title}</header>
    `)
  }
}
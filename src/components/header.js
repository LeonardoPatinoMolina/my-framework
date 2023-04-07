import { Component } from "../lib/my_framework/component.js";

export class Header extends Component{
  constructor(args){
    super({...args, props:{title: 'header'}})
  }

  build({title}){
    return super.template(`
      <header >${title}</header>
    `)
  }
}
import { setUser } from "../context/feature/user.js";
import { Component } from "../lib/my_framework/component.js";
import { Router } from "../lib/my_framework/router.js";

/**
 * 
 * @param {Component} owner 
 */
export const RuleHome = (owner)=>{
  owner.$.effect(()=>{
    console.log(owner.gloProps);
    owner.body.querySelector('.link').addEventListener('click',()=>{
      // new Router().go('/header')
      setUser(64)
    })//end eventlistener

    owner.body.querySelector('.r').addEventListener('click',()=>{
      owner.update(()=>{
        owner.props.isReady = !owner.props.isReady
      });
    })//end 2
    
    return ()=>{
      owner.body.querySelector('.link').removeEventListener('click',()=>{
        new Router().go('/header')
      })//end eventlistener

      owner.body.querySelector('.r').removeEventListener('click',()=>{
        owner.update(()=>{
          owner.props.isReady = !owner.props.isReady
        });
      })//end 2
    }
  })
}
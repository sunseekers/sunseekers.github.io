 定义接口
 ```$xslt
 type IUserInfoFunc = (user:IUser)=>string
 // 定义一个接口
interface IUser{
  name:string;
  age:number
}
//定义一个函数
const getUserInfo:IUserInfoFunc = (user)=>{
  return `name: ${user.name}, age: ${user.age}`;
}

定义函数
type Func = (x:number,y:number,desc?:string)=>void
const sum:Func = (x,y,desc="")=>{
  console.log(desc,x+y)
  }
```

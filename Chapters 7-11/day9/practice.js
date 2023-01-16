
console.log("part1------------------------");

let src = {
    msg: 'lucky'
}

let handler = {
    //get()捕获器，拦截get()操作
    get(trapTargrt, property, recevier){ //会固定收到代理源,属性键,代理对象三个参数，自行选择接收
        let add = '';
        if(property === 'msg'){
            add = " !";
        }
        console.log(`Getting ${property}`); //跟踪属性访问
        return Reflect.get(...arguments) + add;
    }
}

let pro = new Proxy(src, handler);
console.log(pro.msg);


const wm = new WeakMap();
const userList = [];

class User {
    constructor(userId){
        this.setId(userId);
    }
    setId(num){
        wm.set(this, num);
    }
    getId(){
        return wm.get(this);
    }
}
//先代理User类，使传给wm的this统一指向代理实例
let pUser = new Proxy(User, {
    construct(target, argumentsList, newTerget){
        if(argumentsList[0] === undefined){
            throw new Error('必须传给构造函数一个参数');
        }
        if(typeof argumentsList[0] !== 'number'){
            throw new Error('传给构造函数的参数必须是数字');
        }
        let newUser = Reflect.construct(...arguments);
        userList.push(newUser); //对一个与类无直接联系的对象进行操作
        return newUser;
    }
});

let u1 = new pUser(123);
console.log(u1.getId()); //123
console.log(userList);

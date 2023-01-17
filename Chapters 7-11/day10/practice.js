
console.log("part1------------------------");

let n1 = x => { return 2*x }; //仅一个参数(且无默认值)时可省略括号
let n2 = (a, b) => a + b; //省略大括号默认返回代码的值

console.log(function bar(){}.name); //bar
console.log(function (){}.name); //空串
console.log((()=>{}).name); //空串
console.log(new Function().name); //anonymous

function f1(){ //ES的函数不需要命名参数，也不需要进行签名匹配，仅且接收一个数组
    let res = 0;
    for(let i = 0; i < arguments.length; ++i){
        res += arguments[i];
    }
    return res;
}

console.log(f1(1,2,3)); //6

function f2(aa = 'Blover', bb = (()=>console.log('HELLO!'))(), cc = disappear){
    console.log(aa, cc);
}

f2(undefined, 1, 2); //Blover 2。传undefined表示使用默认值(仍算作有传参)
f2(1, undefined, 2); //HELLO! 1 2。用到默认值时，才会对表达式求值
//f4(1, 2); //Error。cc求值错误，disappear未定义

f3(1,2,3,4); //[2,3,4]
//函数声明会被提升(函数表达式则不会，无论let还是var修饰)
function f3(other, ...argAr){ //收集参数为数组
    console.log(argAr);
}

function f4(num){ //求阶乘
    if(num <= 1)
        return 1;
    return num * arguments.callee(num - 1); //使函数逻辑与函数名解耦
}

let tf = f4;
console.log(tf(5)); //120
console.log(tf.length); //1。表示有1个命名参数

f4 = function f(num){ //严格模式下不能用arguments.callee，可用命名函数表达式实现递归
    return num <= 1 ? 1 : num * f(num - 1);
}


color = 'red';

function f5(){console.log(this.color);} //标准函数的this引用执行此函数的上下文对象
let o2 = {
    color: 'blue',
    f5
}
f5(); //red
o2.f5(); //blue

let f6 = ()=>console.log(this.color); //箭头函数引用定义箭头函数时的所在的对象
o2.f6 = f6;
//这里的实际运行结果都是undefined，疑惑
f6(); //red
o2.f6(); //blue

f5.call(o2); //blue
let f7 = f5.bind(o2); //复制新函数，并绑定this的值
f7(); //blue

console.log(f5.toString()); //function f5(){console.log(this.color);}。得到函数代码

console.log("part2------------------------");

function cmpCreator(property){
    return function(obj1, obj2){ //定义闭包，并作为返回值
        if(obj1[property] > obj2[property])
            return 1;
        if(obj1[property] < obj2[property])
            return -1;
        return 0;
    }
}

let cmp1 = cmpCreator("name"); //cmpCreator执行完后，其活动对象仍在内存中，以待提供给cmp1的原型链
let cmp2 = cmpCreator("age");
let ar = [
    {name:"b", age:1},
    {name:"a", age:2}
]
ar.sort(cmp1);
console.log(ar); //[ { name: 'a', age: 2 }, { name: 'b', age: 1 } ]
ar.sort(cmp2);
console.log(ar); //[ { name: 'b', age: 1 }, { name: 'a', age: 2 } ]

let o3 = {
    nick: 'Blover',
    f8(){
        return function(){
            this.nick;
        }
    },
    f9(){
        let that = this;
        return function(){
            return that.nick;
        }
    }
}

console.log(o3.f8()()); //undefined。调用闭包时其this就在当前上下文中确定，Global上没有nick变量
console.log(o3.f9()()); //Blover。闭包在调用时会去f9的活动对象上取得that的值


(function(){ //立即调用的函数表达式(IIFE)，约束具有函数作用域的变量
    let privateVariable = 10; //静态私有变量
    function privateMethod(){ //静态私有方法
        //...
    }
    
    Person = function(name){ //构造函数
        let cnt = 0; //name和cnt为私有变量，实例间不共享
        //2个独立的公有特权方法(每个实例会重新创建新方法)，访问普通私有变量
        this.getName = function(){
            return name;
        }
        this.setName = function(str){
            name = str;
            return ++cnt;
        }
    };
    //3个共享的公有特权方法，访问静态私有变量
    Person.prototype.setPrivateVar = function(val){
        privateVariable = val;
    };
    Person.prototype.getPrivateVar = function(){
        return privateVariable;
        //return this.name; //undefined。实例上其实没有name这个属性！
    };
    Person.prototype.getPrivateMet = function(){
        return privateMethod;
    };
    //此种方式下，不能用共享公开的方法来访问实例的普通私有变量
})();

let p1 = new Person('AA');
p1.setPrivateVar(20);

let p2 = new Person('BB');
p2.setName('CC');

console.log(p1.getName()); //AA
console.log(p2.getName()); //CC
console.log(p1.getPrivateVar()); //20
console.log(p2.getPrivateVar()); //20

//模块模式
let signleton = function(){
    //私有变量和方法
    let components = [];
    //返回单例对象，其中包含公共接口
    return {
        count(){
            return components.length;
        },
        addComponent(com){
            if(typeof com === 'object')
                components.push(com);
        }
    }
}(); //立即执行

signleton.addComponent({});
console.log(signleton.count()); //1
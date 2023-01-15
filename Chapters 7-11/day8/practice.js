
console.log("part1------------------------");

let v1 = {name:'Jack'}; //简单定义

let v2 = {}; //复杂定义
Object.defineProperty(v2, "name", {
    value: 'Alex', //当前值
    configurable: true, //可配置
    //其他特性(enumerable, writable)默认false (不可枚举，不可修改)
});

//定义多个属性
Object.defineProperties(v2, {
    _year: {
        //数据属性
        value: 30,
        writable: true,
        configurable: true,
        enumerable: true,
    },
    age: { //属性键age
        //访问器属性(get()或set()设置其中一个，都不能再同时设置value和writable)
        get(){ //定义获取函数
            if(this._year == 0)
                ++this._year; //每次访问age会使_year++
            return this._year; //不加this，会去外作用域寻找
        },
        //在age中使用this.age会引发递归
        set(val){ //定义设置函数
            this._year = val;
            if(val < 0)
                this._year = 0;
        },
        configurable: true,
        enumerable: true,
    },
});

console.log(v2.age); //30
v2.age = -10;
console.log(v2.age); //1


console.log(Object.getOwnPropertyDescriptors(v2));
/*
{
  name: {
    value: 'Alex',
    writable: false,
    enumerable: false,
    configurable: true
  },
  _year: { value: 1, writable: true, enumerable: true, configurable: true },
  age: {
    get: [Function: get],
    set: [Function: set],
    enumerable: true,
    configurable: true
  }
}
 */

/*
详细讲解：
https://juejin.cn/post/7092357405006102565
*/

let dest = {};
Object.assign(dest, v1, { id: 2023 }); //将若干对象的可枚举实例属性合并至目标对象(*浅复制*)
console.log(dest); //{ name: 'Jack', id: 2023 }
Object.assign(dest, v2); //注意v2的name属性的[[enumerable]]为false
console.log(dest); //{ name: 'Jack', id: 2023, _year: 1, age: 1 }。name未变化
dest.age = -10;
console.log(dest.age); //-10。获取函数和设置函数无法被转移

console.log("part2------------------------");

let name = 'Blover';
let o1 = {
    //属性值简写。会在作用域中寻找变量name
    name,
    [name]: 1, //中括号表示属性键由[]中的表达式求值得来
    
    sayHi(msg){
        console.log('Hi',msg);
    },//定义方法属性的简写，等价于 sayHi: function(msg){...}
    //合用版
    ['say' + name](msg){
        console.log(msg);
    },
    get atten(){ //可以简写获取函数和设置函数
        return 'Attention';
    }
};
console.log(o1.name); //Blover
console.log(o1.Blover); //1
console.log(o1.atten); //Attention
o1.sayHi('Blover'); //Hi Blover
o1.sayBlover('Hi'); //Hi

let o2 = {
    nick: 'Ice',
    age: 19
}

let { nick: ax, age: bx} = o2; //对象解构。声明变量并赋予对应属性值
console.log(ax, bx); //Ice 19
let {nick, cx} = o2; //直接赋值给与属性键同名的变量
console.log(nick, cx); //Ice undefined
let {age, dx = 20} = o2; //设置默认值
console.log(age, dx); //19 20
let { length: len } = 'abcde'; //解构时，等号右侧会被转为对象
console.log(len); //5。获得String包装对象的length属性
// let { _ } = null; //error。null和undefined不能被解构
let ex, fx;
({nick: ex, age: fx} = o2); //给事先声明的变量赋值，则整个解构表达式必须被括号包含

let o3 = {
    son: {
        num: 10
    }
}

let o4= {}, o5 = {};
({ son: o4, son: { num: o5.num } } = o3); //解构嵌套解构，把o3.son.num赋值给o5.num
console.log(o4 === o3.son); //true
console.log(o5); //{ num:10 }
let { son: { num } } = o3;
console.log(num); //10

console.log("part3------------------------");

function Person1(str){ //按惯例，构造函数首字母大写
    this.name = str,
    this.id = 1
}

let p1 = new Person1('sifang'); //new操作符是普通函数与构造函数的唯一区别
console.log(p1.name); //sifang
p1 = Person1('sifang'); //没有new，this绑定调用它的对象(即Global)，p1被赋予函数的返回值undefined


function Person2(){}
let p2 = new Person2();
let p3 = new Person2();

console.log(Person2.prototype.constructor === Person2); //true
//console.log(p2.__proto__ === Person2.prototype); //true。此属性在FireFox,Chrome上暴露
console.log(Person2.prototype.isPrototypeOf(p2)); //true。检查指定实例的原型对象是否为自身

Person2.prototype.nick = 'Tag';
console.log(p2.nick); //Tag。可以基于原型层级查找调取原型属性(此时p2自身无属性)
p2.nick = 'Uag'; //*遮蔽*。这里不是修改原型属性nick，而是增加实例属性
console.log(p2.nick, p3.nick); //Uag Tag
console.log(p3.hasOwnProperty("nick")); //false。判断nick是否为p3的实例属性
console.log("nick" in p3); //true。检查是否可以通过p3访问到nick属性键，无论是实例还是原型
delete p2.nick; //删除属性键
console.log(p2.nick); //Tag。解除遮蔽

p3.age = 99;
p3[Symbol('sym')] = 1111;
for(const pro in p3){ //枚举所有可由p3访问到的可枚举属性键
    console.log(pro); //nick age
}
//返回可枚举的*实例属性键*的*字符串数组*
console.log(Object.keys(p3)); //[ 'age' ]
//返回可枚举的*实例属性值*的*字符串数组*
console.log(Object.values(p3)); //[ 99 ]
//键值对。字返回符串二元组的数组
console.log(Object.entries(p3)); //[ [ 'age', 99 ] ]
//以上均会忽略符号属性键

console.log(Object.getPrototypeOf(p2) === Person2.prototype); //true。获取实例的原型对象
let o6 = Object.create(p2); //创建对象，并指定原型(这里以实例p2为原型对象)
console.log(o6.nick); //Tag

//*重写原型*
Person1.prototype = {
    name: 'Bee',
    age: '100',
}
//恢复constructor属性(指回构造函数的指针)
Object.defineProperty(Person1.prototype, "constructor", {
    enumerable: false, //设置constructor的[[enumerable]]为false(不可枚举)
    value: Person1
})

//实现组合继承
function TheSuper(name){
    //定义自己的实例属性
    this.name = name;
    this.ar = [1,2,3];
}

TheSuper.prototype.sayHello = function(){ //定义自己的原型属性(比如共享的方法)
    console.log('hello');
}

function TheSub(name, age){
    TheSuper.call(this, name); //继承实例属性(会遮蔽原型上的同名属性)
    this.age = age; //定义自己的实例属性
}

TheSub.prototype = new TheSub(); //继承原型属性(这里仅为得到实例，不必传参)
TheSuper.prototype.sayAge = function(){ //定义自己的原型属性
    console.log(this.age);
}

let sub1 = new TheSub();
let sub2 = new TheSub();
console.log(sub1.sayHello === sub2.sayHello); //true。共享的原型属性
console.log(sub1.ar === sub2.ar); //false。独立的实例属性

console.log("part4------------------------");

class Person {
    constructor(name) {
        this.name = name;
    }
    //在类块中定义的内容(除了静态方法)都会定义在类的原型上
    //son: {} //错误。不能在类块中给原型添加非方法的对象或原始值成员
    msg(){
        console.log('原型上的方法');
    }
    static sayName(){
        console.log('类本身的方法', this.name);
    }
}

//类本身具有普通函数的行为
console.log(Person === Person.prototype.constructor); //true
console.log(typeof Person); //*function*
let funarr = [Person, class{}];

let ps1 = new Person('Blover'); //在被new调用时，会被当作构造函数
console.log(ps1 instanceof Person); //true
let ps2 = new ps1.constructor('Tom'); //可以在实例上通过constructor方法引用类
//等价于new Person.prototype.constructor('Tom')
console.log(ps2 instanceof Person); //true
ps2 = new Person.constructor('DD');
console.log(ps2 instanceof Person); //false。类定义的constructor方法不能拿来实例化类

ps1.msg(); //原型上的方法
Person.sayName(); //类本身的方法

//可在类的外部添加类块内不能添加的数据成员
Person.job = 'er'; //在类上定义数据成员
Person.prototype.zoom = 'SZ'; //在原型上定义数据成员

class Color{
    constructor(sarr){
        this.arr = Array.from(sarr);
        this.cnt = 0;
    }
    //在原型上实现iterable接口，使得类的实例可被迭代
    next(){
        if(this.cnt < this.arr.length){
            return {done: false, value: this.arr[this.cnt++]};
        }
        else{
            this.cnt = 0;
            return {done: true, value: 'end'};
        }
        //感觉颇为完备，缺点是每次只能同时迭代一个实例
    }
    [Symbol.iterator](){ 
        return this; //返回调用这个接口的实例(因为具有next方法)
    }
    
    *geneColor(){ //在原型上定义生成器
        yield* this.arr;
    }
}

let c1 = new Color(['red','green','blue']);
for(const x of c1){
    console.log(x);
// red
// green
// blue
}
for(const x of c1.geneColor()){
    console.log(x);
//同上
}

console.log("part5------------------------");

class Person_ extends Person1 {} //继承一个普通构造函数

let ps3 = new Person_('Der'); //派生类没有构造函数，则调用super()
console.log(ps3); //{ name: 'Der', id: 1 }

class Individual extends Person {
    constructor(){
        //要使用this，就必须先初始化父类部分
        super('Kel'); //调用父类构造函数
        //super()返回的实例被赋值给this
        this.age = 40;
    }
}

let ind1 = new Individual();
console.log(ind1 instanceof Person); //true
console.log(ind1); //{ name: 'Kel', age: 40 }
ind1.msg(); //调用父类的原型成员

class Abstract { //模拟抽象基类的行为
    constructor(){
        if(new.target === Abstract) //new.target保存当前new的目标类型
            throw new Error('Cannot create inshance of Abstract');
        if(!this.foo){ //要求派生类必须定义某个方法
            throw new Error('Inheriting class must define foo()');
        }
    }
}
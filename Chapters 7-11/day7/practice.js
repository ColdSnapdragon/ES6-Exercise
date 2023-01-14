
console.log("part1------------------------");

let n1 = 1;
let o1 = {};

//没有iterable接口(可迭代协议)
console.log(n1[Symbol.iterator]);//undefined
console.log(o1[Symbol.iterator]);//undefined

let ar1 = [1,2,3], ar2;

//数组解构
let [a, b] = [1,2,3];
console.log(a, b); //1 2
//拓展操作符
ar2 = [...ar1, 4, 5];
console.log(ar2); //[ 1, 2, 3, 4, 5 ]
console.log(...ar2); //1 2 3 4 5。'...'把ar2转化作逗号分隔的参数表，console.log()对逗号作空格
//Array.from()
ar2 = Array.from(ar1);
console.log(ar2); //[ 1, 2, 3 ]

let it1 = ar1[Symbol.iterator](); //获取迭代器工厂函数，加()表示执行，返回一个新迭代器
console.log(it1); //Object [Array Iterator] {}
console.log(it1.next()); //{ value: 1, done: false } 。返回一个带有两个属性的对象
console.log(it1.next()); //{ value: 2, done: false }
console.log(it1.next()); //{ value: 3, done: false }
ar1.push(4); //迭代期间插入值
console.log(it1.next()); //{ value: 4, done: false }
console.log(it1.next()); //{ value: undefined, done: true }

let it2 = it1[Symbol.iterator](); //迭代器也有iterable接口，调用后得到自身引用
console.log(it2 === it1); //true

//自定义迭代器

console.log("part2------------------------");

let gene1 = function * () {} //定义生成器函数
let geneobj1 = gene1(); //获取生成器对象
console.log(geneobj1.next()); //开始执行。{ value: undefined, done: true }

console.log(geneobj1 === geneobj1[Symbol.iterator]()); //true。生成器对象也有iterable接口，返回自身的引用

function * gene2(cnt){
    for(let i=1; i<=cnt; ++i)
        yield i;
    return 'end';
}
let geneobj2 = gene2(3);
console.log(geneobj2.next()); //{ value: 1, done: false }
console.log(geneobj2.next()); //{ value: 2, done: false }
console.log(geneobj2.next()); //{ value: 3, done: false }
console.log(geneobj2.next()); //{ value: 'end', done: true }

function * range(left, right){
    while(left <= right){
        yield left++;
    }
}
/* "for-of循环会按可迭代对象的next()产生值顺序迭代元素" */
console.log(Array.from(range(3,5))); //[ 3, 4, 5 ]
//生成器对象是一个可迭代对象

function * gene3(){
    //yield*从一个可迭代对象中取值
    console.log('The own value of gene3\'s yield* is :', yield* [1,2]);
    //yield*结束后，额外打印其自身的值。这个值是其所接迭代器的最后的value属性值(通常是undefined)
    return 'end'; //用next()才会在最后看到'end'
}
for(const x of gene3()){
    console.log('value :', x);
}
// value : 1
// value : 2
// The own value of gene3's yield* is : undefined

function * gene4(){
    //生成器对象也有iterable接口，得到自身引用，也就是自身可作迭代器
    console.log('The own value of gene4\'s yield* is :', yield* gene3()); 
    return 'finish';
}
for(const x of gene4()){
    console.log('value :', x);
}
// value : 1
// value : 2
// The own value of gene3's yield* is : undefined
// The own value of gene4's yield* is : end

function * gene5(){
    return yield 'yes';
}
let geneobj4 = gene5();
//第一次调用next()只是为了启动生成器，传入的参数没实际用途
console.log(geneobj4.next(1)); //{ value: 'yes', done: false }
console.log(geneobj4.next(2)); //{ value: 2, done: true }

function * gene6(n){ //生成器结合递归
    if(n > 0){
        yield* gene6(n - 1);
        yield n;
    }
}

console.log(Array.from(gene6(3))); //[ 1, 2, 3 ]

console.log("part3------------------------");

function * gene7(){
    for(const x of [1,2,3]){
        yield x;
    }
}
let go = gene7();
console.log(go.next()); //{ value: 1, done: false }
console.log(go.return(4)); //{ value: 4, done: true } 。提前中止，以传入的参数作value
console.log(go.next()); //{ value: undefined, done: true }

go = gene7();
console.log(go.next()); //{ value: 1, done: false }
try{
    go.throw('err'); //向生成器对象注入错误，由yield抛出
}catch(e){
    console.log(e); //'err'
}
console.log(go.next()); //{ value: undefined, done: true }


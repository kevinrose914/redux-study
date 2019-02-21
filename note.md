# redux主要方法
1. isPlainObject: 检查对象是不是简单的对象（没有去继承过其他属性）
    入参：object
    输出：boolean

2. createStore：返回一个对象，该对象包含dispatch，subscribe，getState，replaceReducer方法
    在该方法执行过程中，如果遇到有enhancer（中间件），会先去applyMiddleware方法，然后在这个方法中，再次执行createStore
    入参：reducer, preloadedState, enhancer
    输出：object{dispatch，subscribe，getState，replaceReducer}

3. applyMiddleware：调用createStore,生成store，并将每个中间件加载到store的dispatch函数上，返回一个全新的store
    入参：无
    输出：一个函数，该函数入参为createStore，函数执行后，返回新的store

4. _objectSpread：合并对象
    入参：第一个为合并后的对象，之后为需要合并的对象
    输出：合并后的对象

5. compose：利用reduce，将函数按右到左顺序，先执行右边的，执行后的结果作为第二个函数的入参
    eg： compose(func1, func2, func3, func4) => func1(func2(func3(func4(...args))))
    入参：函数
    输出：组装好的函数

6. combineReducers: 检查传入的reducer函数是否合法，合并reducer函数，返回新的reducer函数，该reducer函数在createStore函数中传入
    入参：reducers，各个reducer函数
    输出：合并后的新的reducer函数
    合并后的reducer函数：传入state，action，该变state后，输出新的state
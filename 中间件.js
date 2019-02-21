const thunkMiddleware = () => ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
        return action(dispatch, getState, extraArgument)
    }
    return next(action)
}

const fetchProxy = ({ uri, options, type, dispatch }) => {
    dispatch({ type: `${type}_REQUEST` });
    return fetch(uri, options, type)
        .then(response => {
            dispatch({
                type: `${type}_SUCCESS`,
                data: response
            });
        })
        .catch(error => {
            dispatch({
                type: `${type}_FAILURE`,
                reason: error
            });
        });    
}

const dispatchMiddleware = () => ({ dispatch }) => next => action => {
    if (!action || !action.fetchConfig) {
        return next(action)
    }
    const { fetchConfig, type } = action;
    const config = Object.assign({}, fetchConfig);
    const { uri, options } = config;
    return fetchProxy({ uri, options, type, dispatch });
}


const createStore = () => {
    const middlewares = [thunkMiddleware, dispatchMiddleware]
    compose(applyMiddleware(...middlewares))
}


/**
 * 分析applyMiddleware(...middlewares)
 */
function applyMiddleware() {
    for (var _len = arguments.length, middlewares = new Array(_len), _key = 0; _key < _len; _key++) {
      middlewares[_key] = arguments[_key];
    }
  
    return function (createStore) {
      return function () {
        // 此时arguments为reducer，repayloadState， 再次执行createStore函数
        var store = createStore.apply(void 0, arguments);
        /**
         * 此时store为一个对象
         * store = { dispatch, subscribe, getState, replaceReducer }
         */
  
        var _dispatch = function dispatch() {
          throw new Error("Dispatching while constructing your middleware is not allowed. " + "Other middleware would not be applied to this dispatch.");
        };
  
        var middlewareAPI = {
          getState: store.getState, // 返回当前currentState
          dispatch: function dispatch() {
            return _dispatch.apply(void 0, arguments);
          }
        };
        // 执行中间件，返回一组函数数组
        var chain = middlewares.map(function (middleware) {
          return middleware(middlewareAPI);
        });
        // 关键的地方，整合中间件函数
        // 此时chain数组为
        // var chain = [
        //     next => action => {xxx}, // thunkMiddleware
        //     next => action => {xxx}  // dispatchMiddleware
        // ]
        // 下面传入store.diapatch后，dispatchMiddleware执行后返回 action => {xxxx}函数
        // 这个函数作为thunkMiddleware得next参数传入thunkMiddleware函数
        // 所以当出发了dispatch时，先调用的thunkMiddleware，在thunkMiddleware中如果走到了next(action),
        // 就会调用dispatchMiddleware的action => {xxxx}函数
        _dispatch = compose.apply(void 0, chain)(store.dispatch);
        // 下面这个方法相当于把store与{dispatch: _dispatch}整合到一起，替换store之前的dispatch方法
        return _objectSpread({}, store, {
          dispatch: _dispatch
        });
        // 中间件其实就是在dispatch的时候起了作用
        // 返回一个全新的store
      };
    };
}
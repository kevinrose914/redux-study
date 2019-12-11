'use strict';

/**
 * 支持异步更新state
 */

exports.__esModule = true;
function createThunkMiddleware(extraArgument) {
  return function (_ref) {
    // 1.备份dispatch和getState函数
    var dispatch = _ref.dispatch, // 这儿是处理异常的dispatch
        getState = _ref.getState; // 这儿是原有的getState
    // 2.返回一个函数，该函数运行后，可以返回一个？
    return function (next) { // next为disptach函数
      // 返回的这个函数，将作为一个新的dispatch函数传入另一个中间件中
      return function (action) {
        if (typeof action === 'function') {
          return action(dispatch, getState, extraArgument);
        }

        // 将action作为参数，传入到下一个中间件，或者直接就是原dispatch函数
        return next(action);
      };
    };
  };
}

// eg:
var dispatch_0 = dispatch
var dispatch_1 = function (action) {
  if (typeof action === 'function') {
    return action(dispatch, getState, extraArgument);
  }

  return dispatch(action);
};
var dispatch_2 = function (action) {
  if (!action || !action.fetchConfig) {
    return dispatch_1(action);
  }
  const { fetchConfig, type } = action;
  const config = Object.assign({}, fetchConfig);
  const { uri, options } = config;
  return dispatch_1(action);
};





var thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

exports['default'] = thunk;
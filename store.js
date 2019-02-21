import { createStore, applyMiddleware, compose } from './redux.js'
import thunkMiddleware from './redux-thunk.js'

// import rootReducer from '../reducers'
console.log('ok2')
const configStore = () => {
    const middlewares = [thunkMiddleware]
    const enhancers = [applyMiddleware(...middlewares)]

    const composeEnhancers = process.env.NODE_ENV !== 'production' && typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose 

    const store = createStore(rootReducer={}, composeEnhancers(...enhancers))

    if (module.hot) {
        module.hot.accept('../reducers', () => {
            const nextRootReducer = require('../reducers').default
            store.replaceReducer(nextRootReducer)
        })
    }
    return store
}

// configStore()

export default configStore
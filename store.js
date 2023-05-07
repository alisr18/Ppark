//import { Provider } from 'react-redux'

import { configureStore } from '@reduxjs/toolkit'
import navReducer from './Slice/navSlice'




const store = configureStore({
reducer:
    {
        nav: navReducer,

    }});
export  default store;
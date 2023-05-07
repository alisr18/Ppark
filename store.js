//import { Provider } from 'react-redux'

import { configureStore } from '@reduxjs/toolkit'
import navReducer from './slice/navSlice'




const store = configureStore({
reducer:
    {
        nav: navReducer,

    }});

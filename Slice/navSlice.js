import { createSlice } from '@reduxjs/toolkit'
import {stat} from "@babel/core/lib/gensync-utils/fs";

const initialState = {
    Origin: null,
    Destination: null,
    TravelTimeInformation: null

}

export const navSlice = createSlice({
    name: 'nav',
    initialState,
    reducer: {
      setOrigin : (state, action) =>{

          state.origin = action.payload;
    },

        setDestination : (state, action) =>{

            state.destination = action.payload;
        },

        setTraveltimeInformatin  : (state, action) =>{

            state.travelTimeInformation = action.payload;
        }

        },
    },
)

// Action creators are generated for each case reducer function
export const { setOrigin, setDestination, setTraveltimeInformatin } = navSlice.actions

export const selectOrigin = (state) => state.nav.origin;
export const selectDestination = (state) => state.nav.origin;
export const selectTravelTimeInformation = (state) => state.nav.origin;

export default navSlice.reducer
import { createSlice } from '@reduxjs/toolkit';
import { CalendarModes, TodayDate } from 'constants'

const initialState = {
    selectedDate: TodayDate,
    mode: CalendarModes[0]?.id
};

// ==============================|| SLICE - APP ||============================== //

const app = createSlice({
    name: 'app',
    initialState,
    reducers: {

        setSelectedDate(state, action) {
            state.selectedDate = action.payload;
        },

        setMode(state, action) {
            state.mode = action.payload;
        }

    },

});

export default app.reducer;

export const { setSelectedDate, setMode } = app.actions;

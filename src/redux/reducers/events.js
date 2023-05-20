import { createSlice } from '@reduxjs/toolkit';
import { addMinutes } from 'date-fns';

const initialState = {
    list: [
        {
            id: 19383213,
            title: 'Test Event',
            description: 'The Event Description goes here.',
            allDay: false,
            startDate: new Date(),
            endDate: addMinutes(new Date(), 30),
            color: '#06A3FB'
        }
    ],
    modalOpen: null,
};

// ==============================|| SLICE - EVENTS ||============================== //

const events = createSlice({
    name: 'events',
    initialState,
    reducers: {

        addEvents(state, action) {
            state.list = [...state.list, action.payload];
        },

        updateEvents(state, action) {
            const itemIndex = state.list?.findIndex(o => o.id === action.payload.id);
            state.list = state.list?.splice(itemIndex, 1, action.payload) || [];
        },

        deleteEvents(state, action) {
            state.list = state.list?.filter(o => o.id === action.payload.id) || [];
        },

        setModalOpen(state, action) {
            state.modalOpen = action.payload
        }

    },

});

export default events.reducer;

export const { addEvents, updateEvents, deleteEvents, setModalOpen } = events.actions;

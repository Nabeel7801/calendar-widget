import React, { useMemo, useState, useEffect } from 'react';
import { CalendarModes, TodayDate } from 'constants'
import DatePicker from 'components/date-picker';
import Dropdown from 'components/dropdown';

import { setMode, setSelectedDate } from 'redux/reducers/app';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'components/modal';
import ColorPicker from 'components/color-picker';
import { addEvents, setModalOpen } from 'redux/reducers/events';
import { XMarkIcon } from "@heroicons/react/24/outline";
import { addMinutes, format } from 'date-fns';

const Dashboard = () => {

    const dispatch = useDispatch()

    const { mode } = useSelector((state) => state.app);
    const { modalOpen } = useSelector((state) => state.events);

    const [modalData, setModalData] = useState(null)

    const selectedMode =  useMemo(() => CalendarModes.find(o => o.id === mode), [mode])

    useEffect(() => {
        if (modalOpen) {
            setModalData({
                id: Date.now(),
                title: '',
                description: '',
                allDay: false,
                startDate: new Date(modalOpen.time),
                endDate: addMinutes(new Date(modalOpen.time), 30),
                color: '#21FF2A'
            })

        }else {
            setModalData(null)
        }
    }, [modalOpen])

    const setTodayDate = () => {
        dispatch(
            setSelectedDate(TodayDate)
        )
    }

    const setCalendarMode = (data) => {
        dispatch(
            setMode(data?.id)
        )
    }

    const changeHandler = (e) => {
        setModalData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const submitForm = (e) => {
        e.preventDefault();
        dispatch(addEvents(modalData));
        dispatch(setModalOpen(null))
    }

    return (
        
        <>
            <div className='flex justify-between items-center py-4 px-8 border-b'>
                <Dropdown 
                    value={selectedMode}
                    onChange={setCalendarMode}
                    options={CalendarModes} 
                />

                <DatePicker />

                <button onClick={setTodayDate} className='text-sm text-white bg-[#FC3D3D] px-6 py-2 rounded-[8px]' >
                    Today
                </button>
            </div>


            {selectedMode.view}

            {modalOpen &&
                <Modal isModalOpen={Boolean(modalOpen)} setModalOpen={() => dispatch(setModalOpen(null))}>
                    <div className='bg-white text-left text-gray-900 w-[492px] rounded-lg'>
                        <div className="border-b flex justify-between items-center px-6 py-4">
                            <h4 className="text-base font-semibold">Add Event</h4>
                            <XMarkIcon onClick={() => dispatch(setModalOpen(null))} className="w-5 h-5 text-gray-600 cursor-pointer" />
                        </div>

                        <form id="add-event-form" onSubmit={submitForm} className="p-6 flex flex-col gap-y-4">
                            <input
                                required
                                minLength="0"
                                maxLength="50"
                                type="text"
                                name="title"
                                value={modalData?.title || ''}
                                onChange={changeHandler}
                                placeholder="Title *"
                                className=" bg-[#F9FAFB] block w-full appearance-none rounded-lg border lg:h-[40px]< border-gray-300 p-2 placeholder-gray-400 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                            />

                            <textarea
                                rows={3}
                                minLength="0"
                                maxLength="50"
                                type="text"
                                name="description"
                                value={modalData?.description || ''}
                                onChange={changeHandler}
                                placeholder="Description"
                                className=" bg-[#F9FAFB] block w-full appearance-none rounded-lg border lg:h-[40px]< border-gray-300 p-2 placeholder-gray-400 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                            />

                            <div>
                                <label className="block mb-1 text-sm font-medium text-[#111928]">
                                    Pick a color
                                </label>
                                <ColorPicker
                                    defaultColor="#1C64F2"
                                    color={modalData?.color || ''}
                                    onChange={(color) => setModalData(prev => ({ ...prev, color: color.hex }))}
                                    list={['#21FF2A', '#06A3FB', '#FB0606', '#FF6B00', '#9E00FF', '#7ED321', '#417505', '#BD10E0', '#9013FE', '#B8E986']}
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-[#111928]">
                                    Start Date <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    required
                                    readOnly
                                    minLength="0"
                                    maxLength="50"
                                    type="text"
                                    value={modalData?.startDate ? format(modalData?.startDate, 'dd/MM/yyyy - p') : ''}
                                    placeholder="Start Date*"
                                    className="bg-[#F9FAFB] block w-full appearance-none rounded-lg border lg:h-[40px]< border-gray-300 p-2 placeholder-gray-400 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-[#111928]">
                                    End Date <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    required
                                    readOnly
                                    minLength="0"
                                    maxLength="50"
                                    type="text"
                                    value={modalData?.endDate ? format(modalData?.endDate, 'dd/MM/yyyy - p') : ''}
                                    placeholder="End Date*"
                                    className="bg-[#F9FAFB] block w-full appearance-none rounded-lg border lg:h-[40px]< border-gray-300 p-2 placeholder-gray-400 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                                />
                            </div>

                            {modalData?.error &&
                                <p className='text-red-600 font-medium text-xs mt-2'>{modalData.error}</p>
                            }

                        </form>

                        <div className="border-t flex justify-end px-6 py-4">
                            <button
                                type="submit"
                                form="add-event-form"
                                className={`relative inline-flex items-center justify-center px-4 h-[37px] rounded-lg bg-blue-600 border border-[#D1D5DB] text-white`}
                            >
                                <div className="whitespace-nowrap text-sm font-medium">Create Event</div>
                            </button>
                        </div>
                    </div>

                </Modal>
            }

        </>

    )

}

export default Dashboard
import { addMinutes, format, getMilliseconds } from 'date-fns'
import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as _ from 'lodash'
import { setModalOpen } from 'redux/reducers/events';

function DayView() {
    
    const dispatch = useDispatch();

    const { selectedDate } = useSelector((state) => state.app)
    const { list } = useSelector((state) => state.events)

    const groupedList = useMemo(() => {
        const targetDate = format(new Date(selectedDate), 'dd/MM/yyyy')
        const filteredByDate = list.filter(o => format(new Date(o.startDate), 'dd/MM/yyyy') === targetDate)

        const [dd, mm, yyyy] = targetDate.split('/');
        const date = new Date(yyyy, String(parseInt(mm)-1), dd, 0, 0);

        return _.range(48).reduce((result, x) => {
            const tempDate = addMinutes(date, x*30);

            return [...result, {
                id: format(tempDate, 'p'),
                time: tempDate,
                events: list.filter(o => new Date(o.startDate).getTime() >= tempDate.getTime() && new Date(o.startDate).getTime() < addMinutes(tempDate, 30).getTime())
            }]
        }, [])
    }, [list, selectedDate])

    const handleInsertClick = (o) => {
        dispatch(
            setModalOpen(o)
        )
    }

    return (
        <>
            <p className='text-base p-4 text-center font-medium'>
                {format(new Date(selectedDate), 'EEEE')}
            </p>

            <div className='w-full border-t grid grid-cols-12'>
                <div className='col-span-1 h-[48px] border flex items-center justify-center'>
                    all-day
                </div>

                <div className='col-span-11 h-[48px] border'>

                </div>

                {groupedList.map((o, i) => (
                    <>
                        <div className='col-span-1 h-[24px] border text-center'>
                            {i%2 ? '' :  o.id}
                        </div>

                        <div onClick={() => handleInsertClick(o)} className='cursor-pointer col-span-11 h-[24px] border text-center flex items-center gap-x-4 px-2'>
                            {o.events?.map(e => (
                                <div style={{ backgroundColor: e.color }} className='h-[20px] leading-[20px] px-4 rounded-[4px] bg-pink-600 text-xs '>
                                    {o.id} - {e.title}
                                </div>
                            ))}
                        </div>
                    </>
                ))}
            </div>

        </>
    )
}

export default DayView
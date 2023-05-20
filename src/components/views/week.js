import { addMinutes, format, startOfWeek, addDays } from 'date-fns'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import * as _ from 'lodash'

function WeekView() {
    
    const { selectedDate } = useSelector((state) => state.app)
    const { list } = useSelector((state) => state.events)

    const firstDayOfWeek = useMemo(() => startOfWeek(new Date(selectedDate)), [selectedDate])

    const groupedList = useMemo(() => {
        const targetDate = format(new Date(selectedDate), 'dd/MM/yyyy')
        const filteredByDate = list.filter(o => format(new Date(o.startDate), 'dd/MM/yyyy') === targetDate)

        const [dd, mm, yyyy] = targetDate.split('/');
        const date = new Date(yyyy, String(parseInt(mm)-1), dd, 0, 0);

        return _.range(48).reduce((result, x) => {
            const tempDate = addMinutes(date, x*30);

            return [...result, {
                id: format(tempDate, 'p'),
                events: list.filter(o => new Date(o.startDate).getTime() >= tempDate.getTime() && new Date(o.startDate).getTime() <= addMinutes(tempDate, 30).getTime())
            }]
        }, [])
    }, [list, selectedDate])

    return (
        <>
            <div className='grid grid-cols-12'>
                <div/>
                <div className='col-span-11 grid grid-cols-7'>
                    {_.range(7).map(o => 
                        <div className='border text-base p-4 text-center font-medium'>
                            {format(addDays(firstDayOfWeek, o), 'dd/MM')}
                        </div>
                    )}
                </div>
            </div>

            <div className='w-full grid grid-cols-12'>
                <div className='col-span-1 h-[48px] border flex items-center justify-center'>
                    all-day
                </div>

                <div className='col-span-11 h-[48px] grid grid-cols-7'>
                    {_.range(7).map(() => <div className='border'></div>)}
                </div>

                {groupedList.map((o, i) => (
                    <>
                        <div className='col-span-1 h-[24px] border text-center'>
                            {i%2 ? '' :  o.id}
                        </div>

                        <div className='col-span-11 h-[24px] grid grid-cols-7'>
                            {_.range(7).map(() => <div className='border'></div>)}
                        </div>
                        {/* <div className='col-span-11 h-[24px] border text-center flex items-center gap-x-4 px-2'>
                            {o.events?.map(e => (
                                <div style={{ backgroundColor: e.color }} className='h-[20px] leading-[20px] px-4 rounded-[4px] bg-pink-600 text-xs '>
                                    {o.id} - {e.title}
                                </div>
                            ))}
                        </div> */}
                    </>
                ))}
            </div>

        </>
    )
}

export default WeekView
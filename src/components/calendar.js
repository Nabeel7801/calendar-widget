import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/react/20/solid';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { JsonCalendar } from 'json-calendar';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import TimezoneSelect from 'react-timezone-select';
import { differenceInDays, addDays } from 'date-fns';
import { format } from 'date-fns-tz';
import toastWrapper from '../../../utils/toastWrapper';
import { getPublicEventDates, getTimeslots } from '../../../redux/ai-scheduler/action';
import TimeslotLoader from './timeslots-loader';
import HoverButton from '../../common/hover-button';
import { AddContact } from '../../../redux/contacts/action/action';
import { enUS, fr } from 'date-fns/locale'; // Example locale
import useDidUpdateEffect from '../../../utils/useDidUpdateEffect';
import { timeZoneList } from '../../../utils/timezone-list';

const Calendar = ({
    state,
    placeholder,
    selectedDay,
    handleSubmit,
    confirmLoading,
    selectedDate,
    selectedTime,
    selectedTimezone,
    setSelectedDay,
    setSelectedDate,
    setSelectedTime,
    setSelectedTimezone,
    selectedCloser,
    priorityUsers,
    setPriorityUsers,
}) => {

    const dispatch = useDispatch()
    const { t: translate } = useTranslation();
    const { errors: createEventCallError } = useSelector((state) => state.eventCallsReducer);
    const { publicEvent: event, publicEventDates, isTimeslotsLoading, timeslots, dateLoading } = useSelector((state) => state.eventsReducer);
    const disablePriorityUsers = publicEventDates?.disablePriorityUsers
    const timeslotRef = useRef(null)
    const isFrenchLang = event?.language === "FRENCH"
    const availability = publicEventDates?.availabilities.map(x => { let d = new Date(x); d.setHours(0, 0, 0, 0); return d.getTime() });
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    let disableNext = false;
    let disablePrevious = false;

    const [calendar, setCalendar] = useState(new JsonCalendar({ today: availability?.length ? new Date(availability[0]) : new Date(), languageCode: event?.language === "FRENCH" ? "fr" : "en", firstDayOfWeek: 1 }));
    const [currentCalendarDate, setCurrentCalendarDate] = useState(availability?.length ? new Date(availability[0]) : new Date())
    const [useTimeZone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone)
    const handleTimeZoneChange = (x) => {
        setSelectedTimezone(x)
        setTimezone(x.value)
    }
    const [isTimeZoneOpen, setIsTimeZoneOpen] = useState(false)

    useEffect(() => {
        timeslotRef?.current?.scrollIntoView({ behavior: 'smooth' });
    }, [isTimeslotsLoading])

    const disqualified = useMemo(() => {
        if (!placeholder && window.location.pathname != '/reschedulings') {
            let name = ''
            let email = ''
            let phoneNumber = ''
            let isDisQualified = event?.eventConditionalLogics?.length > 0 && event?.eventConditionalLogics[0].operator === 'AND';
            event?.eventConditionalLogics?.forEach(logic => {
                state && Object.entries(state).forEach(([key, value]) => {
                    const id = key?.split("-")[1] || '';
                    const question = event.inviteeQuestions && event.inviteeQuestions.find(o => String(o.id) === String(id));
                    if (question && question.statement == 'Email Address') {
                        email = value
                    }
                    if (question && question.statement == 'Phone Number') {
                        phoneNumber = value
                    }
                    if (question && question.statement == 'Full Name') {
                        name = value
                    }
                    if (question && logic.statement === question.statement) {
                        let valueMatched = true;
                        if (logic.condition === 'IS') {
                            valueMatched = logic.value?.split(", ").reduce((result, val) =>
                                (result || (Array.isArray(value) ? value.reduce((a, v) => (a || v === val), false) : value === val))
                                , false)
                        } else if (logic.condition === 'LESS_THAN') {
                            valueMatched = logic.value?.split(", ").reduce((result, val) =>
                                (result || (Array.isArray(value) ? value.reduce((a, v) => (a || v < val), false) : value < val))
                                , false)
                        } else if (logic.condition === 'GREATER_THAN') {
                            valueMatched = logic.value?.split(", ").reduce((result, val) =>
                                (result || (Array.isArray(value) ? value.reduce((a, v) => (a || v > val), false) : value > val))
                                , false)
                        }
                        isDisQualified = logic.operator === 'AND' ? isDisQualified && valueMatched : isDisQualified || valueMatched;

                    }
                })
            })

            let isPrioritized = event?.eventLogics?.length > 0 && event?.eventLogics[0].operator === 'AND';
            if (event?.eventLogics?.length) {
                event?.eventLogics?.forEach(logic => {
                    state && Object.entries(state).forEach(([key, value]) => {
                        const id = key?.split("-")[1] || '';
                        const question = event.inviteeQuestions && event.inviteeQuestions.find(o => String(o.id) === String(id));
                        console.log('question', question)
                        console.log('logic.value', logic)
                        console.log('logic.statement', logic.statement)
                        if (question && logic.inviteeQuestion.statement == question.statement) {
                            let valueMatched = true;
                            if (logic.condition === 'IS') {
                                valueMatched = logic.value?.split(", ").reduce((result, val) =>
                                    (result || (Array.isArray(value) ? value.reduce((a, v) => (a || v === val), false) : value === val))
                                    , false)

                                console.log(valueMatched, 'valueMatched')
                            } else if (logic.condition === 'LESS_THAN') {
                                valueMatched = logic.value?.split(", ").reduce((result, val) =>
                                    (result || (Array.isArray(value) ? value.reduce((a, v) => (a || v < val), false) : value < val))
                                    , false)
                            } else if (logic.condition === 'GREATER_THAN') {
                                valueMatched = logic.value?.split(", ").reduce((result, val) =>
                                    (result || (Array.isArray(value) ? value.reduce((a, v) => (a || v > val), false) : value > val))
                                    , false)
                            }
                            isPrioritized = logic.operator === 'AND' ? isPrioritized && valueMatched : isPrioritized || valueMatched;

                        }
                    })
                })
                if (isPrioritized) {
                    setPriorityUsers(event?.eventLogics[0].eventLogicUsers.map(user => user.user.id))
                } else {
                    setPriorityUsers([])
                }
            }

            isDisQualified = !placeholder && isDisQualified;
            if (isDisQualified) {
                dispatch(AddContact({
                    firstName: name || email?.split('@')[0] || '',
                    lastName: '',
                    accountId: event.accountId,
                    userId: event.userId,
                    email: email,
                    phoneNumber: event.phonePreferred ? `${phoneNumber}` : '',
                    status: "DISQUALIFIED"
                }, {}, true))
                // toastWrapper('error', 'No More Slots Available');
            }
            return isDisQualified;
        }
    }, [state, placeholder, event?.inviteeQuestions, event?.eventConditionalLogics])

    function handleOnClick(x) {
        if ((!disableNext || x < 0) && (!disablePrevious || x >= 0)) {
            const monthIndex = calendar.options.monthIndex;
            const year = calendar.options.year;
            const newYear = monthIndex + x > 11 || monthIndex + x < 0 ? year + x : year;
            const newMonth = monthIndex + x >= 0 ? (monthIndex + x) % 12 : 11;
            dispatch(getPublicEventDates({
                linkPrefix: event.linkPrefix,
                timeZone: selectedTimezone?.value || Intl.DateTimeFormat().resolvedOptions().timeZone || '',
                currentDate: `${newMonth + 1}/1/${newYear}`,
                ...(priorityUsers?.length && { priorityUsers }),
                ...(selectedCloser && { closerId: selectedCloser })
            }))
            const newCal = new JsonCalendar({ today: new Date(newYear, newMonth, 15), languageCode: event?.language === "FRENCH" ? "fr" : "en", firstDayOfWeek: 1 });
            setCalendar(newCal);
            setSelectedDay();
            setSelectedTime();
            setSelectedDate();
            setCurrentCalendarDate(new Date(newYear, newMonth, 15))
        } else {
            // toastWrapper('error', 'No More Slots Available');
        }
    }
    useEffect(() => {
        dispatch(getPublicEventDates({
            linkPrefix: event.linkPrefix,
            timeZone: selectedTimezone?.value || Intl.DateTimeFormat().resolvedOptions().timeZone || '',
            currentDate: `${currentCalendarDate?.getMonth() + 1}/1/${currentCalendarDate?.getFullYear()}`,
            ...(priorityUsers?.length && { priorityUsers }),
            ...(selectedCloser && { closerId: selectedCloser })
        }))
    }, [selectedTimezone, priorityUsers])

    const getNextDate = () => {

        const startDate = new Date(selectedDate.getTime())
        const available = availability.sort((a, b) => a - b).filter(x => x > startDate.getTime())

        if (!available.length) {
            return ''
        }
        let newDate = new Date(available[0])

        if (newDate.getMonth() != selectedDate.getMonth()) {
            handleOnClick(+1)
        }
        setSelectedDate(newDate);
        setSelectedDay(newDate.getDate());
        setSelectedTime();
        dispatch(getTimeslots({
            id: event?.id,
            timezone: selectedTimezone.value,
            date: newDate?.toDateString(),
            ...(selectedCloser && { closerId: selectedCloser }),
            ...(priorityUsers?.length && !disablePriorityUsers && { priorityUsers }),
        }))
    }
    return (
        <>
            <div className={`w-full ${selectedDate ? "max-w-[412px] @md:w-[412px]" : "max-w-[388px] @md:w-[388px]"} pb-4 @md:pb-0 pt-4 @md:pt-[24px]`}>
                <div className="flex items-center justify-center ">
                    <div className="w-full max-w-[500px] mx-auto">
                        <div className={`${selectedDate ? "@md:px-[24px]" : ""}`}>
                            <p style={{ color: event?.['fontColor'] || '#111928' }} className={`${placeholder ? 'text-center text-sm font-medium' : 'text-sm @sm:text-base font-semibold'} text-gray-900 mb-[18px]`}>  
                                {translate(placeholder ? "Select a day" : "Select date and time")}
                            </p>
                            <div className="@md:px-4 flex items-center justify-between h-6">
                                <div>
                                    <button
                                        disabled={placeholder}
                                        aria-label="calendar backward"
                                        className="p-2 hover:bg-[rgba(200,200,200,0.2)] rounded-full"
                                        onClick={() => handleOnClick(-1)}
                                    >
                                        <ArrowLongLeftIcon style={{ color: event?.['fontColor'] || '#111928' }} className="w-5 h-5 text-gray-900" />
                                    </button>
                                </div>
                                <div>
                                    <span style={{ color: event?.['fontColor'] || '#111928' }} tabindex="0" className="focus:outline-none  text-sm font-medium text-gray-900">
                                        {translate(calendar.monthNames[calendar.options.monthIndex])} {calendar.options.year}
                                    </span>
                                </div>
                                <div>
                                    <button
                                        disabled={placeholder}
                                        aria-label="calendar forward "
                                        className="p-2 hover:bg-[rgba(200,200,200,0.2)] rounded-full"
                                        onClick={() => handleOnClick(+1)}
                                    >
                                        <ArrowLongRightIcon style={{ color: event?.['fontColor'] || '#111928' }} className="w-5 h-5 text-gray-900" />
                                    </button>
                                </div>
                            </div>

                            <div className="relative flex items-center justify-between pt-[17px] @md:pt-6 @md:px-0 overflow-x-auto">
                                <table className="w-full ">
                                    <thead>
                                        <tr className='flex'>
                                            {[...calendar.dayNames?.slice(1), calendar.dayNames?.[0]].map((x) => (
                                                <th className='flex-1'>
                                                    <div className="w-full flex justify-center cursor-pointer focus:bg-gray-800">
                                                        <p style={{ color: `${event?.['fontColor'] || '#111928'}BB` }} className="text-sm font-semibold text-gray-500 text-center">
                                                            {x.name.slice(0, 3)}
                                                        </p>
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {calendar.weeks.map((week, ind) => (
                                            <>
                                                {week.filter((x) => x.monthIndex == calendar.options.monthIndex).length > 0 && (
                                                    <tr className='flex'>
                                                        {week.map((day, index) => {
                                                            let hide = false;
                                                            const isSameMonth = calendar.options.monthIndex === day.date.getMonth();
                                                            if (!isSameMonth) {
                                                                const dateAfterTwoDays = addDays(day.date, 2);
                                                                const dateBeforeTwoDays = addDays(day.date, -2);
                                                                if (calendar.options.monthIndex !== dateAfterTwoDays.getMonth() && calendar.options.monthIndex !== dateBeforeTwoDays.getMonth()) {
                                                                    hide = true
                                                                }
                                                            }
                                                            const isMonth = day.monthIndex === calendar.options.monthIndex;
                                                            const available = availability?.filter(
                                                                (x) => x == day.date.getTime()
                                                            );
                                                            const isAvailable = available?.length > 0;
                                                            const isSelected = selectedDay == day.day;
                                                            day.date.setHours(0, 0, 0, 0);
                                                            const isToday = todayDate.getDate() === day.day && todayDate.getMonth() === day.monthIndex;
                                                            const datePrevious = todayDate.getTime() > day.date.getTime();
                                                            const { dateRangeType, dateRangeDays, createdAt } = event;
                                                            let isLimited = false;
                                                            let isPresent = true;
                                                            if (dateRangeType == 'DEFINITE') {
                                                                let newCreatedAt = new Date()
                                                                newCreatedAt.setHours(0, 0, 0, 0);
                                                                isLimited =
                                                                    differenceInDays(day.date, newCreatedAt) >= dateRangeDays;
                                                                disableNext =
                                                                    differenceInDays(day.date, newCreatedAt) >= dateRangeDays;
                                                                if (ind === 0) {
                                                                    disablePrevious = differenceInDays(day.date, newCreatedAt) <= 0;
                                                                }
                                                            }

                                                            return (
                                                                dateLoading ? 
                                                                    <td className='flex-1 animate-pulse py-[2px] @md:py-1 @md:m-1'>
                                                                        <button className='animate-pulse bg-gray-500 opacity-[0.2] flex flex-col rounded-lg flex w-full h-10 max-w-11 max-h-11 justify-center items-center'>
                                                                            <p className="animate-pulse text-base"></p>
                                                                        </button>
                                                                    </td>
                                                                : 
                                                                    <td className='flex-1 px-[1.5px] py-[2px] @md:px-[4px] @md:py-1'>
                                                                        <HoverButton
                                                                            noHover={isSelected}
                                                                            style={{ backgroundColor: isMonth && !datePrevious && !isLimited && !disqualified && isPresent && isAvailable && (isSelected ? event['widgetColor'] || '#1C64F2' : event['widgetColor'] + '2A') }}
                                                                            className={`flex flex-col rounded-lg flex w-full py-4 max-w-11 max-h-11 justify-center items-center
                                                                                ${isMonth && !datePrevious && !isLimited && !disqualified && isPresent &&
                                                                                isAvailable && `cursor-pointer font-medium ${isSelected && 'text-white'}`}
                                                                            `}
                                                                            disabled={!isMonth || !isAvailable || datePrevious || isLimited || !isPresent || disqualified}
                                                                            onClick={() => {
                                                                                setSelectedDate(day.date);
                                                                                setSelectedDay(day.day);
                                                                                setSelectedTime();
                                                                                dispatch(getTimeslots({
                                                                                    id: event?.id,
                                                                                    timezone: selectedTimezone.value,
                                                                                    date: day.date?.toDateString(),
                                                                                    ...(priorityUsers?.length && !disablePriorityUsers && { priorityUsers: priorityUsers }),
                                                                                    ...(selectedCloser && { closerId: selectedCloser }),
                                                                                }))
                                                                            }}
                                                                        >
                                                                            <p style={!isSelected ? { color: event['fontColor'] || '#111928' } : {}} className="text-sm @sm:text-base">{!hide && isMonth && day.day}</p>
                                                                            {isToday && isMonth &&
                                                                                <svg className='shrink-0' xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none">
                                                                                    <circle cx="3" cy="3" r="3" fill={event['widgetColor']} />
                                                                                </svg>
                                                                            }
                                                                        </HoverButton>
                                                                    </td>
                                                            );
                                                        })}
                                                    </tr>
                                                )}
                                            </>
                                        ))}
                                    </tbody>
                                </table>

                                {(disqualified || createEventCallError || !availability?.length) && !dateLoading && 
                                    <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: `${event['backgroundColor']}7A` || '#FFFFFF7A' }} className="absolute inset-0 flex items-center justify-center">
                                        <p className="max-w-[240px] border p-4 drop-shadow-md text-xs font-medium bg-white rounded-lg leading-5 text-center cursor-default">
                                            {translate("There are no time slots available for the month of")}&nbsp;
                                            {translate(calendar.monthNames[calendar.options.monthIndex])}.
                                        </p>
                                    </div>
                                }
                                
                                {placeholder &&
                                    <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: `${event['backgroundColor']}7A` || '#FFFFFF7A' }} className="absolute inset-0 flex items-center justify-center">
                                        <p className="max-w-[240px] border p-4 drop-shadow-md text-xs font-medium bg-white rounded-lg leading-5 text-center cursor-default">
                                            {translate("Please fill out the form before choosing your time slot.")}
                                        </p>
                                    </div>
                                }
                            </div>
                        </div>

                        {!placeholder &&
                            <div className={`${selectedDate ? "@md:px-6" : "@md:pl-6"} pt-8 @md:pt-[82px] @md:pb-[10px]`}>
                                <span style={{ color: event['fontColor'] || '#111928' }} className='text-sm font-medium text-gray-900'>{translate("Time Zone")}</span>

                                <div style={{ backgroundColor: `${event['backgroundColor']}BB` || 'white', color: event['fontColor'] || '#111928' }} className={`flex items-center text-sm font-medium bg-white ${!isTimeZoneOpen ? "hover:bg-gray-100 timezone-icon" : "border border-blue-500"} max-w-[364px] rounded-lg px-2`}>
                                    {/* <GlobeAltIcon className="w-4 h-4" /> */}
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="m4.171 2.155.453.69a.45.45 0 0 0 .378.205A1.95 1.95 0 0 1 6.952 5v.4a.85.85 0 0 0 1.7 0l-4.48-3.245Zm0 0-.644.517m.644-.517-.644.517m0 0A5.56 5.56 0 0 0 1.76 5.174l-.293.84.877.147A.85.85 0 0 1 3.052 7a2.35 2.35 0 0 0 2.35 2.35.85.85 0 0 1 .85.85v2.349L7 12.55a5.529 5.529 0 0 0 2.777-.743l.375-.217V9.4a.85.85 0 0 1 .85-.85h1.367l.106-.625a5.55 5.55 0 0 0 .077-.924M3.527 2.672l7.357.337m0 0 .3.343a5.532 5.532 0 0 1 1.368 3.65m-1.668-3.993-.443.108m.443-.108-.443.108m2.11 3.884h-.75.75Zm-2.11-3.884A2.35 2.35 0 0 0 8.651 5.4l1.79-2.283Zm.556 7.878a5.65 5.65 0 1 1-7.99-7.99 5.65 5.65 0 0 1 7.99 7.99Z" fill={event['fontColor'] || '#111928'} stroke={event['fontColor'] || '#111928'} stroke-width="1.5" />
                                    </svg>

                                    <TimezoneSelect
                                        disabled={true}
                                        className={`calendar-timezone ${!isTimeZoneOpen && "calendar-timezone-hover"}  w-full text-sm font-medium !m-0 !p-0 !hover:cursor-pointer !hover:bg-red-50`}
                                        style={{ backgroundColor: `${event['backgroundColor']}BB` || 'white' }}
                                        value={useTimeZone}
                                        onChange={handleTimeZoneChange}
                                        timezones={timeZoneList}
                                        onMenuOpen={() => setIsTimeZoneOpen(true)}
                                        onMenuClose={() => setIsTimeZoneOpen(false)}
                                        ArrowLongRightIcon
                                    />
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>

            {(selectedDate && !createEventCallError) &&
                <div className="left @md:w-[240px] @md:pl-[24px] py-4 @md:py-[24px] border-t border-gray-300 @md:border-t-0 @md:border-l @md:border-gray-300">
                    <div className="mb-4 flex justify-between items-center">
                        <h1 style={{ color: event['fontColor'] || '#111928' }} className="text-sm font-semibold text-gray-900">
                            {format(selectedDate, "EEE LLL d yyyy", { locale: isFrenchLang ? fr : enUS }) || selectedDate?.toDateString() || translate('Please Select a Date')}
                        </h1>
                    </div>

                    <div className="no-scrollbar space-y-[12px] mt-[15px]  max-h-[460px] overflow-y-auto">

                        {isTimeslotsLoading
                            ? <TimeslotLoader />
                            : timeslots?.slots?.length === 0 ?
                                <p style={{ color: event['fontColor'] || '#111928' }} className='text-sm font-medium'>Timeslots for  {selectedDate?.toDateString() || 'this day'} is already reserved, loading next date...
                                    <p className='hidden'> {setTimeout(() => {
                                        getNextDate()
                                    }, 1500)}</p>
                                </p>
                                :
                                timeslots?.slots?.map((val, index) => (
                                    <div className="flex w-full overflow-x-hidden">
                                        <HoverButton
                                            noHover={selectedTime === val}
                                            disabled={selectedTime === val}
                                            hoverColor={`${event['widgetColor']}32`}
                                            ref={index === 0 ? timeslotRef : null}
                                            onClick={() => setSelectedTime(val)}
                                            fontColor={event['fontColor'] || '#111928'}
                                            className={`h-12 w-full border py-2 mr-2 border-gray-300 rounded-lg text-base font-medium text-center focus:ring-offset-2`}
                                        >
                                            {val}
                                        </HoverButton>

                                        <button
                                            onClick={handleSubmit}
                                            disabled={confirmLoading}
                                            style={{ transition: '0.20s all linear', backgroundColor: event['widgetColor'] || '#1C64F2' }}
                                            className={`flex items-center justify-center h-12 py-2 rounded-lg text-base font-medium text-center ${confirmLoading ? 'cursor-default' : 'cursor-pointer'} ${selectedTime === val ? 'text-white w-full' : 'w-0 invisible'} hover:shadow-md focus:ring-offset-2`}
                                        >
                                            {confirmLoading &&
                                                <svg aria-hidden="true" class="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                                </svg>
                                            }
                                            {translate("Confirm")}
                                        </button>
                                    </div>
                                ))
                        }
                    </div>
                </div>
            }
        </>
    );
};

export default Calendar;

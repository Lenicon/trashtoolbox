// import {useState} from 'react'
import { differenceInDays, endOfMonth, startOfMonth, sub, add, format, setDate } from 'date-fns';
import './calendar.css';
import Cell from '../Cell';
import clsx from 'clsx';

const daynames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface Props {
    value: Date|undefined;
    onChange: (value: Date) => void;
    className: string
    // setNum:(value:Array<number>)=>void;
}

export default function Calendar({ className='', value = new Date(), onChange }: Props) {
    const startDate = startOfMonth(value);
    const endDate = endOfMonth(value);
    const numDays = differenceInDays(endDate, startDate) + 1;

    const prefixDays = startDate.getDay();
    const suffixDays = 6 - endDate.getDay();

    const prevMonth = () => onChange && onChange(sub(value, {months: 1}));
    const nextMonth = () => onChange && onChange(add(value, {months: 1}));

    const prevYear = () => onChange && onChange(sub(value, {years: 1}));
    const nextYear = () => onChange && onChange(add(value, {years: 1}));

    const handleClickDate = (index: number) => {
        const date = setDate(value, index);
        onChange && onChange(date);
    }

    const handleClickToday = () => onChange(new Date())    

    return (
        <div className={clsx(`calendar`,className)}>
            <div className='wrapper'>
                {/* <Cell/> */}
                <Cell className='col-span-whole datenow'>Selected Date:&nbsp;<strong>{format(value, 'dd LLLL yyyy')}</strong></Cell>
                

                <Cell className='clickable hover:bg-calendar-hover' onClick={prevYear}>{"<<"}</Cell>
                <Cell className='clickable hover:bg-calendar-hover' onClick={prevMonth}>{"<"}</Cell>
                <Cell className='col-span clickable hover:bg-calendar-hover' onClick={handleClickToday} >Select Today</Cell>
                <Cell className='clickable hover:bg-calendar-hover' onClick={nextMonth}>{">"}</Cell>
                <Cell className='clickable hover:bg-calendar-hover' onClick={nextYear}>{">>"}</Cell>

                {daynames.map((day, i) => (<Cell className='dayname' key={i}>{day}</Cell>))}

                {Array.from({ length: prefixDays }).map((_, index) => (<Cell className='empty' key={index} />))}

                {/* SHOW DAY NUMBERS */
                    Array.from({ length: numDays }).map((_, index) => {
                        const date = index + 1;
                        return <Cell onClick={()=>handleClickDate(date)} className={`clickable ${date.toString()==format(value, 'd') ? 'bg-yellow-200 text-black':'hover:text-black hover:bg-calendar-hover'}`} key={date}>{date}</Cell>
                    })
                }

                {Array.from({ length: suffixDays }).map((_, index) => (<Cell className='empty' key={index} />))}
            </div>
        </div >
    )
}

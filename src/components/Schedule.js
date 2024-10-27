import { useMemo  } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import { useState, useEffect } from "react";
import axios from 'axios'

const localizer = momentLocalizer(moment)

const Schedule = () => {
    const [shifts, setShifts] = useState([]);
    useEffect(() => {
        const fetchAllShifts = async ()=>{
            try {
                let res = await axios.get(`${REACT_APP_API_URL}/api/shifts`)
                let shifts = res.data.shifts;
                let new_shifts = []
                for(let shift of shifts){
                    res = await axios.get(`${REACT_APP_API_URL}/api/employees/${shift.employee_id}`)
                    let name = `${res.data.employee.first_name} ${res.data.employee.last_name}`

                    new_shifts.push({
                        id: shift.shift_id,
                        title: `${name}`,
                        start: new Date(shift.shift_start_time),
                        end: new Date(shift.shift_end_time)
                    })
                }
                console.log(new_shifts)
                setShifts(new_shifts);
            } catch (err) {
                console.log("Error fetching shifts")
            }
        }
        fetchAllShifts()
    }, [])
    const { defaultDate, views } = useMemo(
        () => ({
          defaultDate: new Date(),
          views: ['week'],
        }),
        []
      )

    return ( 
        <div>
        <Calendar
          localizer={localizer}
          events={shifts}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          views={views}
          defaultDate={defaultDate}
          defaultView={Views.WEEK}
        />
      </div>
    );
}

export default Schedule;

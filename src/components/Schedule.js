import { useMemo  } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import { useState, useEffect } from "react";
import axios from 'axios'

const localizer = momentLocalizer(moment)

const Schedule = () => {
    const [schedules, setSchedules] = useState([]);
    useEffect(() => {
        const fetchAllSchedules = async ()=>{
            try {
                let res = await axios.get("http://localhost:3001/api/schedule")
                let schedules = res.data.schedule;
                let new_schedules = []
                for(let schedule of schedules){
                    res = await axios.get(`http://localhost:3001/api/employees/${schedule.employee_id}`)
                    let name = `${res.data.employee.first_name} ${res.data.employee.last_name}`
                    res = await axios.get(`http://localhost:3001/api/shifts/${schedule.shift_id}`)
                    let shift = res.data.shift;

                    let start_time = new Date(shift.shift_date)
                    let start = shift.shift_start_time.split(":")
                    start_time.setHours(parseInt(start[0]))
                    start_time.setMinutes(parseInt(start[1]))

                    let end_time = new Date(shift.shift_date)
                    let end = shift.shift_end_time.split(":")
                    end_time.setHours(parseInt(end[0]))
                    end_time.setMinutes(parseInt(end[1]))
                    new_schedules.push({
                        id: schedule.schedule_id,
                        title: `${name} - ${shift.shift_name}`,
                        start: start_time,
                        end: end_time
                    })
                }
                console.log(new_schedules)
                setSchedules(new_schedules);
            } catch (err) {
                console.log("Error fetching schedules")
            }
        }
        fetchAllSchedules()
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
          events={schedules}
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

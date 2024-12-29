import {useEffect, useRef, useState} from "react";
// could not use react-chartjs due to lack of support for time series
import {
    CategoryScale,
    Chart,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    TimeScale,
    Title,
    Tooltip
} from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import {Box, Button, FormControlLabel, MenuItem, Radio, RadioGroup, Select, Stack, TextField} from "@mui/material";
import "@sentisso/react-modern-calendar-datepicker/lib/DatePicker.css";
import DatePicker from "@sentisso/react-modern-calendar-datepicker";
import {MobileTimePicker} from '@mui/x-date-pickers/MobileTimePicker';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {convertShamsiToGregorian} from "@/app/utils.js";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import io from "socket.io-client";
import tokenManager from "@/app/TokenManager";

let socket;
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

const chartDataAdapter = function (data) {
    // adapter for chartjs data. converts {value, timestamp} to chart data format
    return {
        labels: data.map((x) => x.timestamp),
        datasets: [
            {
                label: 'Heart Rate',
                data: data.map((x) => ({x: x.timestamp, y: x.value})),
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
            },
        ],
    };
}

export const ParameterMonitor = (props) => {
    // value that API uses
    const [selectedDay, setSelectedDay] = useState(null);
    // value that calendar shows. {year, month, day}
    const [selectedCalendarDay, setSelectedCalendarDay] = useState(null);
    const [data, setData] = useState([]);
    // for how long should the data be shown
    const [rangeLength, setRangeLength] = useState(30);
    const [showLiveData, setShowLiveData] = useState('live');
    const {getToken} = tokenManager;

    const handleRadioChange = (event) => {
        console.log(event.target.value)
        setShowLiveData(event.target.value);
    };

    const handleSettingDateRange = function (value) {
        const rangeStart = convertShamsiToGregorian(`${value.year}/${value.month}/${value.day}`)
        setSelectedCalendarDay(value);
        setSelectedDay(rangeStart);
    }

    const renderCustomInput = function ({ref}) {
        return <TextField placeholder={'یک تاریخ انتخاب کنید.'} aria-readonly={true}
                          value={selectedCalendarDay ? `${selectedCalendarDay.year}/${selectedCalendarDay.month}/${selectedCalendarDay.day}` : ''}
                          ref={ref}/>
    }

    useEffect(() => {
        console.log(selectedDay)
    }, [selectedDay]);

    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);



    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            chartInstanceRef.current = new Chart(ctx, {
                type: 'line',
                data: chartDataAdapter(data),
                options: {
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        x: {
                            type: 'time',
                            time: {
                                unit: 'second',
                                displayFormats: {
                                    minute: 'HH:mm:ss'
                                }
                            }
                        },
                    },
                    elements: {
                        line: {
                            tension: 0.2 // This makes the line smooth
                        }
                    },
                    animation: {
                        duration: 0
                    },
                    maintainAspectRatio: false,
                }
            });
        }
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, [data]);
    const [timeRange, setTimeRange] = useState(1);

    const handleDropdownChange = (event) => {
        setTimeRange(event.target.value);
        setRangeLength(event.target.value);
    };

    return (
        <Stack className="heart-rate-monitor ltr-direction">
            <RadioGroup row value={showLiveData} onChange={handleRadioChange}>
                <FormControlLabel value={'live'} control={<Radio/>} label="نمایش زنده"/>
                <FormControlLabel value={'specific'} control={<Radio/>} label="نمایش تاریخ مشخص"/>
            </RadioGroup>
            {(showLiveData === 'specific') && <Stack>
                <Stack direction={'row'}>
                    <Box justifyItems={'center'}>
                        <DatePicker
                            value={selectedCalendarDay}
                            onChange={handleSettingDateRange}
                            inputPlaceholder="تاریخ"
                            renderInput={renderCustomInput}
                            locale="fa"
                        />
                    </Box>
                    <Box>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            {/*the rtl direction on the clock looks horrible*/}
                            <MobileTimePicker slotProps={{layout: {sx: {direction: 'ltr'}}}}
                                              defaultValue={dayjs('2022-04-17T15:30')}
                                              format={"HH:mm"}
                            />
                        </LocalizationProvider>
                    </Box>
                </Stack>
            </Stack>}
            <div style={{backgroundColor: 'white', margin: 20, maxWidth: "800px"}}>
                <canvas ref={chartRef} height={"400"}></canvas>
            </div>
            <Button onClick={() => setData(currentData => [...currentData, {
                timestamp: Date.now(),
                value: Math.floor(Math.random() * (50)) + 40
            }])}>add data</Button>
        </Stack>
    );
};

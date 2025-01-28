import {useEffect, useRef, useState} from "react";
// could not use react-chartjs due to lack of support for time series
import 'chartjs-adapter-date-fns';
import Chart, {
    CategoryScale,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    TimeScale,
    Title,
    Tooltip
} from 'chart.js/auto';
import {
    Box,
    Button,
    FormControlLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import "@sentisso/react-modern-calendar-datepicker/lib/DatePicker.css";
import DatePicker from "@sentisso/react-modern-calendar-datepicker";
import {MobileTimePicker} from '@mui/x-date-pickers/MobileTimePicker';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
// todo: import {convertShamsiToGregorian} from "@/app/utils.js";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import styles from "../styles/Home.module.css";
import {useRouter} from "next/router";
import {useQuery} from "react-query";
import {getAPI} from "../utils";

/*import { registerables } from 'chart.js/auto';  // Register all necessary chart types, including TimeScale
import 'chartjs-adapter-date-fns';          // Ensure the adapter is loaded

Chart.register(...registerables);*/

let socket;
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);


console.log('Chart.js Version:', Chart.version);
console.log('chartjs-adapter-date-fns Available:', !!Chart.adapters);

const INITIAL_MOCKED_DATA = [
    [1401, 1733059103075768],
    [1143, 1733059102563171],
    [1805, 1733059102027011],
    [3041, 1733059101566374],
    [1649, 1733059101026397],
    [1135, 1733059100546113],
    [2379, 1733059100019410],
    [3071, 1733059099484612],
    [1343, 1733059098989936],
    [1203, 1733059098567263],
    [766, 1733059098054980],
    [2240, 1733059097543017],
    [2425, 1733059096954834],
    [1952, 1733059096462889],
    [1467, 1733059095941945],
    [1477, 1733059095434229],
    [1745, 1733059094929400],
    [2458, 1733059094424618],
    [1417, 1733059093919258],
    [1829, 1733059093409309]
]


const convertShamsiToGregorian = (i) => i;

const chartDataAdapter = function (data) {
    console.log('data', data);
    // adapter for chartjs data. converts {value, timestamp} to chart data format
    return {
        labels: (data || []).map((x) => x.timestamp),
        datasets: [
            {
                label: 'Heart Rate',
                data: (data || []).map((x) => ({x: x.timestamp, y: x.value})),
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
            },
        ],
    };
}

export const ParameterMonitor = (props) => {
    const router = useRouter();
    // value that API uses
    const [selectedDay, setSelectedDay] = useState(null);
    // value that calendar shows. {year, month, day}
    const [selectedCalendarDay, setSelectedCalendarDay] = useState(null);
    // const [data, setData] = useState([]);
    // for how long should the data be shown
    const [rangeLength, setRangeLength] = useState(30);
    const [showLiveData, setShowLiveData] = useState('live');

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

    const {data, isLoading, isError} = useQuery({
        queryFn: () => getAPI('http://5.34.206.236:8000/ecg/', {
            method: 'GET',
        }),
        // todo: remove (enabled: false) to activate api calls
        refetchInterval: 2000,
        initialData: INITIAL_MOCKED_DATA,
        select: (d) => d.map(item => ({value: item[0], timestamp: item[1]}))
    })

    const getChartConfig = (inputData) => ({
        type: 'line',
            data: chartDataAdapter(inputData),
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
    })

    useEffect(() => {
        if (chartRef.current && Chart) {
            const ctx = chartRef.current.getContext('2d');
            chartInstanceRef.current = new Chart(ctx, getChartConfig(data));
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

    if(isLoading) {
        return (<div className={styles.container}>is loading...</div>);
    }

    if(isError) {
        return (<div className={styles.container}><Typography color={"error"}>ERROR</Typography></div>);
    }

    return (
        <div className={styles.container}>
        <Stack className="heart-rate-monitor ltr-direction" width={"99%"}>
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
            {/*<Button onClick={() => setData(currentData => [...currentData, {
                timestamp: Date.now(),
                value: Math.floor(Math.random() * (50)) + 40
            }])}>add random data</Button>*/}
            <Button variant={"text"} color={"error"} onClick={() => router.push('/home')}>
                Return To Home
            </Button>
        </Stack>

        </div>
    );
};

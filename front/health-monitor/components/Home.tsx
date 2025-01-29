import dynamic from "next/dynamic";
import styles from '../styles/Home.module.css';
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import { Box, Divider, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { getAPI } from "../utils";

// Dynamically import the Map component
const Map = dynamic(() => import('./Map').then(mod => mod.default), { ssr: false });

const Home = () => {
    const router = useRouter();

    // Use react-query to fetch the raw GPS data
    const { data, isLoading, isError } = useQuery({
        queryFn: () => getAPI('http://5.34.206.236:8000/ecg/gps/', {
            method: 'GET',
        }),
        enabled: true,  // Activate API calls
        refetchInterval: 2000,
        onError: () => alert('Error in Fetching GPS Data'),
        initialData: [35.7575556, 51.3357222]  // Initial data as an array
    });

    // Function to safely extract latitude and longitude
    const getCenterCoordinates = (data) => {
        if (Array.isArray(data) && data.length === 2) {
            return {
                longitude: data[1],
                latitude: data[0],
            };
        }
        return { latitude: 35.7575556, longitude: 51.3357222 };  // Fallback to initial data
    };

    // Extract the latitude and longitude
    const { latitude, longitude } = getCenterCoordinates(data);

    // Render the map
    const renderMap = () => (
        <Suspense fallback={null}>
            <Map center={[longitude, latitude]} />
        </Suspense>
    );

    // Handle loading state
    if (isLoading) {
        return <div className={styles.container}>Loading...</div>;
    }

    // Handle error state
    if (isError) {
        return <div className={styles.container}><Typography color={"error"}>ERROR: Could not fetch data</Typography></div>;
    }

    return (
        <div className={styles.container}>
            <Box width={'500px'} marginBottom={'20px'}>
                <Box flexDirection="row" display={'flex'} justifyContent={'center'} gap={1}>
                    <Typography>Name:</Typography>
                    <Typography>{data?.name || 'Mohammad Esteki'}</Typography>
                </Box>
                <Box flexDirection="row" display={'flex'} justifyContent={'center'} gap={1} marginBottom={'10px'}>
                    <Typography>Age:</Typography>
                    <Typography>{data?.age || 20}</Typography>
                </Box>
                <Divider />
                <Box flexDirection="row" display={'flex'} justifyContent={'center'} gap={1} marginTop={'10px'}>
                    <Typography>Blood Pressure:</Typography>
                    <Typography>{data?.bloodPressure || 12}</Typography>
                </Box>
                <Box flexDirection="row" display={'flex'} justifyContent={'center'} gap={1}>
                    <Typography>Heartbeat Rate:</Typography>
                    <Typography>{data?.heartBeatRate || 75}</Typography>
                </Box>
                <Box flexDirection="row" display={'flex'} justifyContent={'center'} gap={1}>
                    <Button variant={"outlined"} onClick={() => router.push('/heart')}>View More</Button>
                </Box>
            </Box>

            {renderMap()}
        </div>
    );
};

export default Home;

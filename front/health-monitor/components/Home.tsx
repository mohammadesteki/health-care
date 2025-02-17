import dynamic from "next/dynamic";
import styles from '../styles/Home.module.css';
import { useQuery} from "react-query";
import {Suspense, useCallback, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {getAPI} from "../utils";
import {Box, Divider, Typography} from "@mui/material";
import Button from "@mui/material/Button";

const coordinate = {
    latitude: 35.7575556,
    longitude: 51.3357222,
};


const Map = dynamic(() => import('./Map').then(mod => mod.default), { ssr: false });
// {MapContainer, TileLayer, Marker, Popup}

const Home = () => {
    const router = useRouter();

    type GPSData = [number, number] | undefined;

    const { data, isLoading, isError } = useQuery<GPSData>({
        queryFn: () => getAPI('http://5.34.206.236:8000/ecg/gps/', {
            method: 'GET',
        }),
        enabled: true,  // Activate API calls
        refetchInterval: 2000,
        onError: () => alert('Error in Fetching GPS Data'),
        initialData: [35.7575556, 51.3357222]  // Initial data as a fallback
    });

    const getCenterCoordinates = (data: [number, number] | undefined) => {
        if (!data) {
            return { latitude: 35.7575556, longitude: 51.3357222 };  // Fallback when data is undefined
        }
        const [latitude, longitude] = data;
        return { latitude, longitude };
    };


// Safely handle undefined data
    const { latitude, longitude } = data ? getCenterCoordinates(data) : { latitude: 35.7575556, longitude: 51.3357222 };




    // const { latitude, longitude } = getCenterCoordinates(data);


    if(isLoading) {
        return (<div className={styles.container}>is loading...</div>);
    }

    if(isError) {
        return (<div className={styles.container}><Typography color={"error"}>ERROR</Typography></div>);
    }

    return (
        <div className={styles.container}>
            <Box width={'500px'} marginBottom={'20px'}>
                <Box flexDirection="row" display={'flex'} justifyContent={'center'} gap={1}>
                    <Typography>Name:</Typography>
                    <Typography>{'Mohammad'}</Typography>
                </Box>
                <Box flexDirection="row" display={'flex'} justifyContent={'center'} gap={1}  marginBottom={'10px'}>
                    <Typography>Age:</Typography>
                    <Typography>{'23'}</Typography>
                </Box>
                <Box flexDirection="row" display={'flex'}  justifyContent={'center'} gap={1}>
                    <Button variant={"outlined"} onClick={() => router.push('/heart')}>View More</Button>
                </Box>
                <Divider/>
                <Box marginTop={2} textAlign="center">
                    <Typography>Click below to view the location on Google Maps:</Typography>
                    <a
                        href={`https://www.google.com/maps?q=${latitude},${longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'blue', textDecoration: 'underline' }}
                    >
                        Open Location in Google Maps
                    </a>
                </Box>
            </Box>
        </div>
    );
}

export default Home;
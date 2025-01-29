// @ts-nocheck
import dynamic from "next/dynamic";
import styles from '../styles/Home.module.css';
import { useQuery} from "react-query";
import {Suspense, useCallback, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {getAPI} from "../utils";
import {Box, Divider, Typography} from "@mui/material";
import Button from "@mui/material/Button";

const coordinate = {
    latitude: 35.699927,
    longitude: 51.337762,
};


const Map = dynamic(() => import('./Map').then(mod => mod.default), { ssr: false });
// {MapContainer, TileLayer, Marker, Popup}

const Home = () => {
    const router = useRouter();

    // const {data, isLoading, isError} = useQuery({
    //     queryFn: () => getAPI('//', {
    //         method: 'GET',
    //     }),
    //     // todo: remove (enabled: false) to activate api calls
    //     enabled: false,
    //     refetchInterval: 2000,
    //     // onError: () => alert('Error in Fetching Health Data'),
    //     initialData: {
    //         bloodPressure: 12,
    //         heartBeatRate: 75,
    //         name: 'Mohammad Esteki',
    //         age: 20,
    //     }
    // })

    // const {data: centerData, isLoading: isCenLoading} = useQuery<{center: { latitude: number; longitude: number; }}>({
    //     queryFn: () => getAPI('http://5.34.206.236:8000/gps/', {
    //         method: 'GET',
    //     }),
    //     // todo: remove (enabled: false) to activate api calls
    //     enabled: false,
    //     refetchInterval: 20000,
    //     onError: () => alert('Error in Fetching Center Data'),
    //     initialData: {
    //         center: {
    //             latitude: 35.7575556,
    //             longitude: 51.3357222,
    //         },
    //     }
    // })
    //
    // const renderMap = () => isCenLoading ? 'loading...' : (
    //     <Suspense fallback={null}>
    //         <Map center={[centerData?.center?.longitude, centerData?.center?.latitude]}/>
    //     </Suspense>
    // );

    const { data: centerData, isLoading, isError } = useQuery({
        queryFn: () => getAPI('http://5.34.206.236:8000/gps/', {
            method: 'GET',
        }),
        enabled: true,  // Enable the API call
        refetchInterval: 20000,
        onError: () => alert('Error in Fetching Center Data'),
        initialData: [35.7575556, 51.3357222],  // Initial data structure as an array
    });

    const renderMap = () => isLoading ? 'loading...' : (
        <Suspense fallback={null}>
            <Map center={[centerData[0], centerData[1]]}/>  // Correctly pass latitude and longitude
        </Suspense>
    );

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
                    <Typography>{data?.name || '?'}</Typography>
                </Box>
                <Box flexDirection="row" display={'flex'} justifyContent={'center'} gap={1}  marginBottom={'10px'}>
                    <Typography>Age:</Typography>
                    <Typography>{data?.age || '?'}</Typography>
                </Box>
                <Divider/>
                <Box flexDirection="row" display={'flex'} justifyContent={'center'} gap={1}  marginTop={'10px'}>
                    <Typography>Blood Pressure:</Typography>
                    <Typography>{data?.bloodPressure || '?'}</Typography>
                </Box>
                <Box flexDirection="row" display={'flex'}  justifyContent={'center'} gap={1}>
                    <Typography>Heartbeat Rate:</Typography>
                    <Typography>{data?.heartBeatRate || '?'}</Typography>
                </Box>
                <Box flexDirection="row" display={'flex'}  justifyContent={'center'} gap={1}>
                    <Button variant={"outlined"} onClick={() => router.push('/heart')}>View More</Button>
                </Box>
            </Box>
            {renderMap()}
        </div>
    );
}

export default Home;
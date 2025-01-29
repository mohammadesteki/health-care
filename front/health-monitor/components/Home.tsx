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

    const {data, isLoading, isError} = useQuery({
        queryFn: () => getAPI('//', {
            method: 'GET',
        }),
        // todo: remove (enabled: false) to activate api calls
        enabled: false,
        refetchInterval: 2000,
        // onError: () => alert('Error in Fetching Health Data'),
        initialData: {
            bloodPressure: 12,
            heartBeatRate: 75,
            center: {
                latitude: 35.7575556,
                longitude: 51.3357222,
            },
            name: 'Mohammad Esteki',
            age: 20,
        }
    })

    const renderMap = () => (
        <Suspense fallback={null}>
            <Map center={[data?.center?.longitude, data?.center?.latitude]}/>
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
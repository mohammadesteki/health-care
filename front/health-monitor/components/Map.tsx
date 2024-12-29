import React, {useRef} from "react";
import ReactMapboxGl, { Marker } from "react-mapbox-gl";

const Mapbox = ReactMapboxGl({
    accessToken: 'TOKEN',
    attributionControl: false,
    dragRotate: false,
    touchZoomRotate: true,
    pitchWithRotate: false,
    keyboard: false,
    doubleClickZoom: true,
    renderWorldCopies: true,
});

const defaultCenter = {
    latitude: 35.699927,
    longitude: 51.337762,
};


const Map = ({center}: {center: [number, number]}) => {

    const getCenter = () => {
        if (!center?.[0] || !center?.[1]) {
            return center;
        }
        return undefined;
    }

    return (
        <Mapbox
            // style="mapbox://styles/mapbox/streets-v11" // Map style
            // style="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            style={{
                version: 8,
                sources: {
                    "raster-tiles": {
                        type: "raster",
                        tiles: [
                            "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png", // OpenStreetMap tiles
                            "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
                            "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
                        ],
                        tileSize: 256,
                    },
                },
                layers: [
                    {
                        id: "osm-tiles",
                        type: "raster",
                        source: "raster-tiles",
                        minzoom: 0,
                        maxzoom: 19,
                    },
                ],
            }}
            containerStyle={{
                height: "500px",
                width: "500px",
                border: "1px solid black",
                position: "relative",
            }}
            center={getCenter() || [defaultCenter.longitude, defaultCenter.latitude]} // Map center
            zoom={[15]} // Zoom level

        >
            <div className="map-center-marker">
                <img
                    src="https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png"
                    alt="Marker"
                    style={{width: "40px", height: "40px"}}
                />
            </div>
            <div className={'map-disabled-black-shadow'}/>
        </Mapbox>
    );
};

export default Map;

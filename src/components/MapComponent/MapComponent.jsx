import React, { useState, useEffect } from 'react';
import Modal from "react-modal";
import "./mapcomponent.css";
import mapboxgl from "mapbox-gl";
import { point, distance, along, lineString } from "@turf/turf";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
    "pk.eyJ1IjoiYS1yYXRyZSIsImEiOiJjbDlyeDFpaXcwc2ltM3BvOWswaDAyMnRnIn0.-X7h5K9lok_Z4Hn8TXgSVA";

const MapComponent = () => {
    const initialFormData = {
        startLatitude: "",
        startLongitude: "",
        destLatitude: "",
        destLongitude: "",
        time: ""
    };

    const [formData, setFormData] = useState(initialFormData);
    const [map, setMap] = useState(null);
    const [startMarker, setStartMarker] = useState(null);
    const [destMarker, setDestMarker] = useState(null);
    const [line, setLine] = useState(null); // Store the line instance
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [droneMarker, setDroneMarker] = useState(null);
    const [error, setError] = useState("");

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    }

    useEffect(() => {
        const initializeMap = () => {
            const map = new mapboxgl.Map({
                container: "map",
                style: "mapbox://styles/mapbox/streets-v11",
                center: [formData.startLongitude, formData.startLatitude],
                zoom: 1
            });

            setMap(map); // Store the map reference in the state

            return () => map.remove();
        };

        initializeMap();
    }, [])
    useEffect(() => {
        if (
            map &&
            droneMarker &&
            formData.startLongitude !== "-" &&
            formData.startLatitude !== "-"
        ) {
            droneMarker.setLngLat([formData.startLongitude, formData.startLatitude]);
        }
    }, [droneMarker, map, formData.startLongitude, formData.startLatitude]);

    // const createLine = () => {
    //     // Remove existing line if it exists
    //     if (line) {
    //         map.removeLayer("line");
    //         map.removeSource("line");
    //         map.removeLayer("trajectory");
    //         map.removeSource("trajectory");
    //         setLine(null);
    //     }

    //     // Remove existing drone marker if it exists
    //     if (droneMarker) {
    //         droneMarker.remove();
    //         setDroneMarker(null);
    //     }

    //     // Create a line feature between the starting and destination points
    //     const lineCoordinates = [
    //         [formData.startLongitude, formData.startLatitude],
    //         [formData.destLongitude, formData.destLatitude]
    //     ];

    //     const lineFeature = lineString(lineCoordinates);

    //     map.addSource("line", {
    //         type: "geojson",
    //         data: lineFeature
    //     });

    //     map.addLayer({
    //         id: "line",
    //         type: "line",
    //         source: "line",
    //         paint: {
    //             "line-color": "grey",
    //             "line-width": 2
    //         }
    //     });

    //     setLine(lineFeature);

    //     const startCoord = point([formData.startLatitude, formData.startLongitude]);
    //     const destCoord = point([formData.destLatitude, formData.destLongitude]);
    //     const totalDistance = distance(startCoord, destCoord, {
    //         units: "kilometers"
    //     });

    //     const duration = formData.time * 1000; // Convert time to milliseconds
    //     const steps = 100; // Number of steps for animation
    //     const stepDistance = totalDistance / steps;
    //     const stepDuration = duration / steps;
    //     let currentStep = 0;

    //     // Add the drone marker at the start position
    //     const newDroneMarker = new mapboxgl.Marker({
    //         element: createDroneElement()
    //     })
    //         .setLngLat([formData.startLongitude, formData.startLatitude])
    //         .addTo(map);
    //     setDroneMarker(newDroneMarker);

    //     // Create an empty trajectory line source
    //     map.addSource("trajectory", {
    //         type: "geojson",
    //         data: {
    //             type: "Feature",
    //             geometry: {
    //                 type: "LineString",
    //                 coordinates: []
    //             }
    //         }
    //     });

    //     // Create the trajectory line layer
    //     map.addLayer({
    //         id: "trajectory",
    //         type: "line",
    //         source: "trajectory",
    //         paint: {
    //             "line-color": "blue",
    //             "line-width": 2,
    //             "line-dasharray": [2, 2]
    //         }
    //     });

    //     const animateMarker = () => {
    //         const currentPosition = along(lineFeature, currentStep * stepDistance, {
    //             units: "kilometers"
    //         });

    //         newDroneMarker.setLngLat(currentPosition.geometry.coordinates);

    //         // Add the current position to the trajectory line source
    //         const trajectorySource = map.getSource("trajectory");
    //         const trajectoryCoordinates = trajectorySource._data.geometry.coordinates;
    //         trajectoryCoordinates.push(currentPosition.geometry.coordinates);
    //         trajectorySource.setData(trajectorySource._data);

    //         currentStep++;

    //         if (currentStep <= steps) {
    //             setTimeout(animateMarker, stepDuration);
    //         }
    //     };

    //     animateMarker();
    // };
    // form data
    const handleSubmit = (e) => {
        e.preventDefault();

        // Form validation
        if (
            !formData.startLatitude ||
            !formData.startLongitude ||
            !formData.destLatitude ||
            !formData.destLongitude ||
            !formData.time
        ) {
            setError("All fields are necessary");
            return;
        }

        const startLat = parseFloat(formData.startLatitude);
        const startLng = parseFloat(formData.startLongitude);
        const destLat = parseFloat(formData.destLatitude);
        const destLng = parseFloat(formData.destLongitude);
        const time = parseFloat(formData.time);

        if (
            isNaN(startLat) ||
            isNaN(startLng) ||
            isNaN(destLat) ||
            isNaN(destLng) ||
            isNaN(time)
        ) {
            setError("All fields must be numeric values");
            return;
        }

        if (startLat < -90 || startLat > 90 || startLng < -90 || startLng > 90) {
            setError("Latitude and longitude must be in the range -90 to 90");
            return;
        }

        if (time <= 0) {
            setError("Value for time must be greater than 0");
            return;
        }

        setError(""); // Clear any previous error
        closeModal();
        if (map) {
            // Remove existing markers if they exist
            if (startMarker) {
                startMarker.remove();
            }
            if (destMarker) {
                destMarker.remove();
            }

            // Add the start marker
            const newStartMarker = new mapboxgl.Marker()
                .setLngLat([formData.startLongitude, formData.startLatitude])
                .addTo(map);

            // Add the destination marker with a green color
            const newDestMarker = new mapboxgl.Marker({ color: "green" })
                .setLngLat([formData.destLongitude, formData.destLatitude])
                .addTo(map);

            setStartMarker(newStartMarker);
            setDestMarker(newDestMarker);

            // createLine();
        }

        setFormData(initialFormData);
    };

    const createDroneElement = () => {
        const element = document.createElement("div");
        element.className = "drone-marker";
        element.style.backgroundImage = `url("https://pngimg.com/uploads/drone/drone_PNG35.png")`;
        return element;
    };
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        const updatedValue =
            name === "startLatitude" || name === "startLongitude"
                ? value.replace(/[^0-9.-]/g, "")
                : value;

        setFormData((prevData) => ({
            ...prevData,
            [name]: updatedValue
        }));
    };
    return (
        <div className="map-container">
            <button onClick={openModal} className="openModal">
                Simulate
            </button>
            <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
                <div>Hello Modal</div>
            </Modal>
            <div className="map-wrapper">
                <div id="map" style={{ height: "100vh" }}></div>
            </div>
        </div>
    );
};

export default MapComponent;
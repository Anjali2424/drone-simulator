import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, Polyline } from "react-google-maps";

const DroneSimulator = () => {
  const [startLatitude, setStartLatitude] = useState(0);
  const [startLongitude, setStartLongitude] = useState(0);
  const [destinationLatitude, setDestinationLatitude] = useState(0);
  const [destinationLongitude, setDestinationLongitude] = useState(0);
  const [timeToTravel, setTimeToTravel] = useState(0);

  const [dronePosition, setDronePosition] = useState({
    latitude: startLatitude,
    longitude: startLongitude
  });

  const [path, setPath] = useState([]);

  useEffect(() => {
    // Create a Google Maps API client.
    const googleMaps = new google.maps.Map();

    // Create a marker for the start position.
    const startMarker = new google.maps.Marker({
      position: {
        latitude: startLatitude,
        longitude: startLongitude
      },
      title: "Start Position"
    });

    // Create a marker for the destination.
    const destinationMarker = new google.maps.Marker({
      position: {
        latitude: destinationLatitude,
        longitude: destinationLongitude
      },
      title: "Destination"
    });

    // Draw the expected path between the start position and the destination.
    const path = new google.maps.Polyline({
      path: [
        {
          latitude: startLatitude,
          longitude: startLongitude
        },
        {
          latitude: destinationLatitude,
          longitude: destinationLongitude
        }
      ]
    });

    // Start the drone flight.
    setDronePosition({
      latitude: startLatitude,
      longitude: startLongitude
    });

    setPath(path.getPath().toJSON());

    // Update the drone position every second.
    const updateDronePosition = () => {
      const currentPosition = dronePosition;
      const newPosition =
        currentPosition +
        ((destinationMarker.position - currentPosition) *
          (timeToTravel - current_time)) /
          timeToTravel;
      setDronePosition(newPosition);
      path.getPath().setAt(path.getPath().length - 1, newPosition);
    };

    setInterval(updateDronePosition, 1000);
  }, [
    startLatitude,
    startLongitude,
    destinationLatitude,
    destinationLongitude,
    timeToTravel
  ]);

  return (
    <div>
      <GoogleMap center={dronePosition} zoom={10}>
        <Marker position={startMarker.position} />
        <Marker position={destinationMarker.position} />
        <Polyline path={path} />
      </GoogleMap>
    </div>
  );
};

export default DroneSimulator;

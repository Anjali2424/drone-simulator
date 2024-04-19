import React, { useState } from 'react';
import Modal from "react-modal";
import "./mapcomponent.css";

const MapComponent = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
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
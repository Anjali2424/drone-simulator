import React from "react";
import "./FormComponent.css";

const FormComponent = ({ formData, handleFormChange, handleSubmit, error }) => {
  const {
    startLatitude,
    startLongitude,
    destLatitude,
    destLongitude,
    time
  } = formData;

  return (
    <>
      <div className="form-box">
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="startLatitude">Start Latitude:</label>
            <input
              type="text"
              id="startLatitude"
              name="startLatitude"
              value={startLatitude}
              onChange={handleFormChange}
            />
          </div>
          <div className="form-field">
            <label htmlFor="startLongitude">Start Longitude:</label>
            <input
              type="text"
              id="startLongitude"
              name="startLongitude"
              value={startLongitude}
              onChange={handleFormChange}
            />
          </div>
          <div className="form-field">
            <label htmlFor="destLatitude">Destination Latitude:</label>
            <input
              type="text"
              id="destLatitude"
              name="destLatitude"
              value={destLatitude}
              onChange={handleFormChange}
            />
          </div>
          <div className="form-field">
            <label htmlFor="destLongitude">Destination Longitude:</label>
            <input
              type="text"
              id="destLongitude"
              name="destLongitude"
              value={destLongitude}
              onChange={handleFormChange}
            />
          </div>
          <div className="form-field">
            <label htmlFor="time">Time (in seconds):</label>
            <input
              type="number"
              id="time"
              name="time"
              value={time}
              onChange={handleFormChange}
            />
          </div>
          <button type="submit" className="simulate">
            Simulate
          </button>
          <p className="error-msg">{error}</p>
        </form>
      </div>
    </>
  );
};

export default FormComponent;

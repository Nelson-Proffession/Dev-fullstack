import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CarManagement = () => {
  const [cars, setCars] = useState([]);
  const [formData, setFormData] = useState({
    PlateNumber: '',
    type: '',
    Model: '',
    ManufacturingYear: '',
    DriverPhone: '',
    MechanicName: '',
  });
  const [updateMode, setUpdateMode] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch all cars
  const fetchCars = async () => {
    try {
      const response = await axios.get('http://localhost:3000/cars');
      setCars(response.data);
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Add or update a car
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (updateMode) {
        await axios.put(`http://localhost:3000/updatecar/${formData.PlateNumber}`, formData);
        alert('Car updated successfully!');
        fetchCars();
      } else {
        await axios.post('http://localhost:3000/addcar', formData);
        alert('Car added successfully!');
        fetchCars();
      }
      setFormData({
        PlateNumber: '',
        type: '',
        Model: '',
        ManufacturingYear: '',
        DriverPhone: '',
        MechanicName: '',
      });
      setUpdateMode(false);
      fetchCars();
    } catch (error) {
      console.error('Error saving car:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  // Delete a car
  const handleDelete = async (PlateNumber) => {
    try {
      await axios.delete(`http://localhost:3000/deletecar/${PlateNumber}`);
      alert('Car deleted successfully!');
      fetchCars();
    } catch (error) {
      console.error('Error deleting car:', error);
    }
  };

  // Populate form for updating a car
  const handleEdit = (car) => {
    setFormData(car);
    setUpdateMode(true);
  };

  // Fetch cars on component mount
  useEffect(() => {
    fetchCars();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Car Management</h1>

      {/* Form for adding/updating cars */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Plate Number:</label>
          <input
            type="text"
            name="PlateNumber"
            value={formData.PlateNumber}
            onChange={handleInputChange}
            required
            disabled={updateMode} // Disable PlateNumber input in update mode
          />
        </div>
        <div>
          <label>Type:</label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Model:</label>
          <input
            type="text"
            name="Model"
            value={formData.Model}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Manufacturing Year:</label>
          <input
            type="number"
            name="ManufacturingYear"
            value={formData.ManufacturingYear}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Driver Phone:</label>
          <input
            type="text"
            name="DriverPhone"
            value={formData.DriverPhone}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Mechanic Name:</label>
          <input
            type="text"
            name="MechanicName"
            value={formData.MechanicName}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">{updateMode ? 'Update Car' : 'Add Car'}</button>
        {updateMode && <button onClick={() => setUpdateMode(false)}>Cancel</button>}
      </form>

      {message && <p style={{ color: 'red' }}>{message}</p>}

      {/* Table to display cars */}
      <table border="1" style={{ width: '100%', textAlign: 'left', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Plate Number</th>
            <th>Type</th>
            <th>Model</th>
            <th>Manufacturing Year</th>
            <th>Driver Phone</th>
            <th>Mechanic Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr key={car.PlateNumber}>
              <td>{car.PlateNumber}</td>
              <td>{car.type}</td>
              <td>{car.Model}</td>
              <td>{car.ManufacturingYear}</td>
              <td>{car.DriverPhone}</td>
              <td>{car.MechanicName}</td>
              <td>
                <button onClick={() => handleEdit(car)}>Edit</button>
                <button onClick={() => handleDelete(car.PlateNumber)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CarManagement;
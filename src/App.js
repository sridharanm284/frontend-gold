import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        customerId: '',
        address: '',
        interest: 12,
        phoneNumber: '',
        sonOf: '',
        particulars: '',
        weightGram: '',
        weightMiliGram: ''
    });

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchGoldEntries();
    }, []);

    const fetchGoldEntries = async () => {
        const response = await fetch('http://localhost:5000/api/gold-entries');
        const entries = await response.json();
        // Sort entries by datetime in descending order
        const sortedEntries = entries.sort(
            (a, b) => new Date(b.datetime) - new Date(a.datetime)
        );
        setData(sortedEntries);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this entry?");
        if (confirmDelete) {
            await fetch(`http://localhost:5000/api/gold-entries/${id}`, {
                method: 'DELETE',
            });
            fetchGoldEntries(); // Refresh data after deletion
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const datetime = new Date().toISOString(); // Ensure consistent ISO format
        const newEntry = { ...formData, datetime };

        await fetch('http://localhost:5000/api/gold-entries', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newEntry),
        });

        // Add new entry to the top of the data array
        setData((prevData) => [newEntry, ...prevData]);
        closeModal();
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const filteredData = data.filter(item =>
        Object.values(item).some(val =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="container">
            <h1>Padma Vilas Gold Shop</h1>
            <p>M. Amutha, Banker 49, Sudharsanam Street, Manjakuppam, Cuddalore</p>

            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <button onClick={openModal}>Add Data</button>

            <table>
                <thead>
                    <tr>
                        <th>Date & Time</th>
                        <th>Name</th>
                        <th>Customer ID</th>
                        <th>Address</th>
                        <th>Interest (%)</th>
                        <th>Phone Number</th>
                        <th>Son/Of</th>
                        <th>Particulars</th>
                        <th>Weight (g/mg)</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((item, index) => (
                        <tr key={index}>
                            <td>{new Date(item.datetime).toLocaleString()}</td>
                            <td>{item.name}</td>
                            <td>{item.customerId}</td>
                            <td>{item.address}</td>
                            <td>{item.interest}</td>
                            <td>{item.phoneNumber}</td>
                            <td>{item.sonOf}</td>
                            <td>{item.particulars}</td>
                            <td>{item.weightGram}g, {item.weightMiliGram}mg</td>
                            <td>
                                <button onClick={() => handleDelete(item._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h2>Add New Entry</h2>
                        <form onSubmit={handleSubmit}>
                            <input type="datetime-local" value={new Date().toISOString().slice(0, 16)} readOnly />
                            <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                            <input type="text" name="customerId" placeholder="Unique Customer ID" value={formData.customerId} onChange={handleChange} required />
                            <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
                            <input type="number" name="interest" value={formData.interest} min="0" step="0.01" onChange={handleChange} />
                            <input type="tel" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} required />
                            <input type="text" name="sonOf" placeholder="Son/Of" value={formData.sonOf} onChange={handleChange} />
                            <input type="text" name="particulars" placeholder="Particulars" value={formData.particulars} onChange={handleChange} />
                            <input type="number" name="weightGram" placeholder="Weight (grams)" value={formData.weightGram} onChange={handleChange} required step="0.01" />
                            <input type="number" name="weightMiliGram" placeholder="Weight (milligrams)" value={formData.weightMiliGram} onChange={handleChange} required step=".001" />

                            <button type="submit">Save</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;

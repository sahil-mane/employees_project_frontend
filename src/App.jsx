
import { useState, useEffect } from "react";

import {
  useDeleteEmloyee,
  useGetEmployees
} from "./api/employeesApi";

import EmployeeForm from "./components/employeeForm/EmployeeForm";
import "./App.css";

function App() {
  const [employeesData, setEmployeesData] = useState([]);
  const [search, setSearch] = useState("");

  const [isEdit, setIsEdit] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEmployees = async (searchValue = search) => {
    try {
      const data = await useGetEmployees(searchValue);
      setEmployeesData(data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete?"
    );

    if (!confirmDelete) return;

    try {
      await useDeleteEmloyee(id);
      await fetchEmployees();
    } catch (error) {
      console.log(error);
    }
  };

  // Open modal for editing
  const handleUpdate = (employee) => {
    setIsEdit(true);
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  // Open modal for adding
  const handleAdd = () => {
    setIsEdit(false);
    setSelectedEmployee(null);
    setIsModalOpen(true);
  };

  // Close modal
  const handleCancel = () => {
    setIsModalOpen(false);
    setIsEdit(false);
    setSelectedEmployee(null);
  };

  // After successful add/update
  const handleSuccess = async () => {
    setIsModalOpen(false);
    setIsEdit(false);
    setSelectedEmployee(null);

    await fetchEmployees();
  };

  return (
    <div className="layout">

      <div className="page-header">
        <h2>Employees</h2>

        <button className="add-btn" onClick={handleAdd}>
          + Add Employee
        </button>
      </div>

      <div className="search-container" style={{display:"flex", alignItems:"center"}}>
        <input
          className="search-input"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
        />

        <button
          className="search-btn"
          onClick={() => fetchEmployees(search)}
          style={{marginBottom:"18px"}}
          type="button"
        >
          Search
        </button>

        {search.length > 0 && (
          <button
            className="search-btn"
            onClick={() => {
              setSearch("");
              fetchEmployees("");
            }}
            type="button"
            style={{marginBottom:"18px"}}
          >
            Clear
          </button>
        )}
      </div>

      <div className="table-wrapper">
        <table className="employee-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {employeesData.map((data) => (
              <tr key={data.id}>
                <td>{data.id}</td>
                <td>{data.name}</td>
                <td>{data.role}</td>

                <td className="action-buttons">
                  <button
                    className="edit-btn"
                    onClick={() => handleUpdate(data)}
                  >
                    Update
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(data.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {employeesData.length === 0 && (
              <tr>
                <td colSpan="4" className="empty-state">
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={handleCancel}
              aria-label="Close modal"
            >
              &times;
            </button>

            <EmployeeForm
              isEdit={isEdit}
              employeesdata={selectedEmployee}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}

    </div>
  );
}

export default App;

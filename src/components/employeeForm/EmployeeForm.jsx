
import { useState, useEffect } from "react";
import {
  useAddEmployee,
  useUpdateEmployee
} from "../../api/employeesApi";
import "./employeesForm.css";

const EmployeeForm = ({
  isEdit,
  employeesdata,
  onSuccess,
  onCancel
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const [employees, setEmployees] = useState({
    name: "",
    email: "",
    role: "employee"
  });

  useEffect(() => {
    if (isEdit && employeesdata) {
      setEmployees({
        name: employeesdata.name || "",
        email: employeesdata.email || "",
        role: employeesdata.role || "employee"
      });
    } else {
      setEmployees({
        name: "",
        email: "",
        role: "employee"
      });
    }
  }, [isEdit, employeesdata]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEmployees((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    try {
      setIsLoading(true);

      let response;

      if (isEdit) {
        response = await useUpdateEmployee(
          employeesdata.id,
          employees
        );
      } else {
        response = await useAddEmployee(employees);
      }

      console.log(response);

      alert(
        isEdit
          ? "Employee updated successfully"
          : "Employee added successfully"
      );

      setEmployees({
        name: "",
        email: "",
        role: "employee"
      });

      if (onSuccess) {
        onSuccess();
      }

    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="employee-form" onSubmit={handleSubmit}>
      <h2>{isEdit ? "Update Employee" : "Add Employee"}</h2>

      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={employees.name}
          onChange={handleChange}
          placeholder="Enter employee name"
          required
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={employees.email}
          onChange={handleChange}
          placeholder="Enter email"
          required
        />
      </div>

      <div className="form-group">
        <label>Role</label>
        <select
          name="role"
          value={employees.role}
          onChange={handleChange}
        >
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="form-buttons">
        <button
          type="submit"
          className="submit-btn"
          disabled={isLoading}
        >
          {isLoading
            ? "Saving..."
            : isEdit
              ? "Update Employee"
              : "Add Employee"}
        </button>

        {isEdit && (
          <button
            type="button"
            className="cancel-btn"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default EmployeeForm;

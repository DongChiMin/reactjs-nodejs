import React, { useState, useEffect } from "react";

const CustomForm = ({ fields, onSubmit, buttonText = "Place order", initialValues = {} }) => {
  // Initialize form data with initialValues or default values
  const initialState = fields.reduce((acc, field) => {
    acc[field.name] =
      initialValues[field.name] !== undefined
        ? initialValues[field.name]
        : field.type === "checkbox"
        ? false
        : field.type === "select"
        ? field.options[0].value
        : "";
    return acc;
  }, {});
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Update form data when initialValues change
    setFormData((prev) => ({
      ...prev,
      ...initialValues,
      customerName: formData.customerName,
      phoneNumber: formData.phoneNumber,
      emailAddress: formData.emailAddress,
      address: formData.address,
    }));
  }, [initialValues]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear errors when user changes value
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate required fields
    const newErrors = {};
    fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Do not submit if there are errors
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="border rounded p-4 bg-white">
      {fields.map((field) => {
        switch (field.type) {
          case "text":
            return (
              <div className="mb-5" key={field.name}>
                <label
                  htmlFor={field.name}
                  className="form-label"
                  style={{ fontSize: "15px", fontWeight: "bold" }}
                >
                  {field.label}
                  {field.required && <span style={{ color: "red" }}>*</span>}
                </label>
                <input
                  type="text"
                  className="form-control"
                  id={field.name}
                  value={formData[field.name]}
                  placeholder={field.placeholder || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  style={{
                    fontSize: "15px",
                    padding: "10px",
                  }}
                  required={field.required}
                />
                {errors[field.name] && (
                  <div className="text-danger">{errors[field.name]}</div>
                )}
              </div>
            );

          case "checkbox":
            return (
              <div className="form-check mb-5" key={field.name}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={field.name}
                  checked={formData[field.name]}
                  onChange={(e) => handleChange(field.name, e.target.checked)}
                  style={{ transform: "scale(1.5)" }}
                  required={field.required}
                />
                <label
                  className="form-check-label"
                  htmlFor={field.name}
                  style={{
                    fontSize: "15px",
                  }}
                >
                  {field.label}
                  {field.required && <span style={{ color: "red" }}>*</span>}
                </label>
                {errors[field.name] && (
                  <div className="text-danger">{errors[field.name]}</div>
                )}
              </div>
            );

          case "select":
            return (
              <div className="mb-5" key={field.name}>
                <label
                  htmlFor={field.name}
                  className="form-label"
                  style={{ fontSize: "15px", fontWeight: "bold" }}
                >
                  {field.label}
                  {field.required && <span style={{ color: "red" }}>*</span>}
                </label>
                <select
                  className="form-select"
                  id={field.name}
                  value={formData[field.name]}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  style={{
                    fontSize: "15px",
                    padding: "10px",
                  }}
                  required={field.required}
                >
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors[field.name] && (
                  <div className="text-danger">{errors[field.name]}</div>
                )}
              </div>
            );

          default:
            return null;
        }
      })}

      <button
        type="submit"
        style={{
          fontSize: "15px",
        }}
      >
        {buttonText}
      </button>
    </form>
  );
};

export default CustomForm;

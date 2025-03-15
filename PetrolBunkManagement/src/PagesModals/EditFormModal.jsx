import React from "react";

const EditModalForm = ({ show, onClose, entity, fields, onChange, onSubmit }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit {entity}</h2>
        <form onSubmit={onSubmit}>
          {fields.map((field) => (
            <div key={field.name} className="form-group">
              <label>{field.label}:</label>
              <input
                type={field.type || "text"}
                name={field.name}
                value={field.value}
                onChange={onChange}
                required
              />
            </div>
          ))}
          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModalForm;

import React, { useState, useEffect } from "react";
import { createUser } from "@/services/userService";
import { getAllPocs } from "@/services/pocService"; // Assure-toi que ce service existe
import { v4 as uuidv4 } from "uuid";

type PocType = {
  id: string;
  name: string;
};

const UserCreateForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [formData, setFormData] = useState({
    userId: uuidv4(),
    firstName: "",
    lastName: "",
    mail: "",
    role: "user",
    active: true,
    creation_date: new Date().toISOString().split("T")[0],
  });

  const [pocs, setPocs] = useState<PocType[]>([]);
  const [selectedPocs, setSelectedPocs] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPocs = async () => {
      try {
        const res = await getAllPocs();
        setPocs(res.data);
      } catch (err) {
        setError("Failed to load POCs.");
      }
    };
    fetchPocs();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePocSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setSelectedPocs((prev) =>
      checked ? [...prev, value] : prev.filter((id) => id !== value)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      pocs: selectedPocs,
    };

    try {
      await createUser(payload);
      onSuccess?.();
    } catch (err) {
      setError("Failed to create user.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <h2 className="text-xl font-bold">Create New User</h2>

      <input name="userId" value={formData.userId} readOnly hidden />

      <div>
        <label>First Name</label>
        <input
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className="input"
          required
        />
      </div>

      <div>
        <label>Last Name</label>
        <input
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className="input"
          required
        />
      </div>

      <div>
        <label>Email</label>
        <input
          name="mail"
          value={formData.mail}
          onChange={handleChange}
          className="input"
          type="email"
          required
        />
      </div>

      <div>
        <label>Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="input"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div>
        <label>Creation Date</label>
        <input
          type="date"
          name="creation_date"
          value={formData.creation_date}
          onChange={handleChange}
          className="input"
        />
      </div>

      <div>
        <label className="font-semibold">Associate POCs</label>
        <div className="grid grid-cols-2 gap-2">
          {pocs.map((poc) => (
            <label key={poc.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={poc.id}
                onChange={handlePocSelection}
              />
              {poc.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="active"
            checked={formData.active}
            onChange={handleChange}
          />
          Active
        </label>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <button type="submit" className="btn btn-primary">
        Create User
      </button>
    </form>
  );
};

export default UserCreateForm;

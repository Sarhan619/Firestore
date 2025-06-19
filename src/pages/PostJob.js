import { useState } from "react";
import { db, auth } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function PostJob() {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    logoURL: "",
    workplaceType: "On-site",
    location: "",
    jobType: "Full-time",
    employmentType: "Full-time",
    industry: "",
    function: "",
    level: "Entry level",
    description: "",
    skills: "",
    salary: "",
    benefits: "",
    easyApply: false,
    datePosted: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
      alert("You must be logged in to post a job.");
      return;
    }

    try {
      await addDoc(collection(db, "jobs"), {
        ...formData,
        skills: formData.skills
          ? formData.skills.split(",").map((s) => s.trim())
          : [],
        benefits: formData.benefits
          ? formData.benefits.split(",").map((b) => b.trim())
          : [],
        postedBy: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });

      alert("✅ Job posted successfully!");
      navigate("/"); // navigate to job list ("/")
    } catch (err) {
      console.error("Error posting job:", err);
      alert("❌ Error posting job: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf6f2] to-[#ded1bd] px-6 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-[#a59574] mb-6 text-center">
          Post a Job
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-2 gap-4">
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Job Title"
              className="input"
            />
            <input
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              placeholder="Company Name"
              className="input"
            />
            <input
              name="logoURL"
              value={formData.logoURL}
              onChange={handleChange}
              placeholder="Company Logo URL"
              className="input"
            />
            <select
              name="workplaceType"
              value={formData.workplaceType}
              onChange={handleChange}
              className="input"
            >
              <option>On-site</option>
              <option>Remote</option>
              <option>Hybrid</option>
            </select>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="Job Location"
              className="input"
            />
            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              className="input"
            >
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
              <option>Temporary</option>
            </select>
            <select
              name="employmentType"
              value={formData.employmentType}
              onChange={handleChange}
              className="input"
            >
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
              <option>Temporary</option>
            </select>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="input"
            >
              <option>Entry level</option>
              <option>Associate</option>
              <option>Mid-Senior</option>
              <option>Director</option>
              <option>Executive</option>
            </select>
            <input
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              placeholder="Industry (e.g. Tech, Finance)"
              className="input"
            />
            <input
              name="function"
              value={formData.function}
              onChange={handleChange}
              placeholder="Job Function (e.g. Engineering)"
              className="input"
            />
          </div>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Job Description"
            rows="4"
            className="input"
          />
          <input
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="Skills (comma-separated)"
            className="input"
          />
          <input
            name="benefits"
            value={formData.benefits}
            onChange={handleChange}
            placeholder="Benefits (comma-separated)"
            className="input"
          />
          <input
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            placeholder="Salary (e.g. $100,000/year)"
            className="input"
          />
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="easyApply"
              checked={formData.easyApply}
              onChange={handleChange}
              className="accent-[#a59574]"
            />
            Easy Apply
          </label>
          <input
            type="text"
            name="datePosted"
            value={formData.datePosted}
            onChange={handleChange}
            placeholder="Date Posted (e.g. 12/06/2025)"
            className="input"
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#a59574] to-[#ded1bd] text-white font-semibold py-3 rounded-lg hover:brightness-110 transition"
          >
            Post Job
          </button>
        </form>
      </div>
    </div>
  );
}

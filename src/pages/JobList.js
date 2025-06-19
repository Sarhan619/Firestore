import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

export default function JobList() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const querySnapshot = await getDocs(collection(db, "jobs"));
      const jobsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJobs(jobsData);
    };
    fetchJobs();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-12 px-4">
      <h2 className="text-3xl font-bold text-[#a59574] mb-8 text-center">
        Browse Jobs
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white border border-gray-200 rounded-xl shadow p-6 hover:shadow-lg transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  {job.title || "Untitled Job"}
                </h3>
                <p className="text-sm text-gray-500">{job.company?.trim()}</p>
                <p className="text-sm text-gray-500">
                  {job.location?.trim()} · {job.workplaceType?.trim()}
                </p>
              </div>
              {job.logoURL && (
                <img
                  src={job.logoURL.trim()}
                  alt={`${job.company} logo`}
                  className="h-12 w-12 object-contain rounded-full"
                />
              )}
            </div>

            <div className="mt-3 text-sm text-gray-600 space-y-1">
              <p>
                <strong>Type:</strong>{" "}
                {job.employmentType?.trim() || job.jobType?.trim()}
              </p>
              <p>
                <strong>Seniority:</strong>{" "}
                {job.seniorityLevel?.trim() || "N/A"}
              </p>
              {job.industry && (
                <p>
                  <strong>Industry:</strong> {job.industry.trim()}
                </p>
              )}
              {job.salary && (
                <p className="text-green-700 font-medium">
                  Salary: {job.salary.trim()}
                </p>
              )}
            </div>

            <div className="mt-4 flex justify-between items-center">
              <p className="text-xs text-gray-400">
                Posted on:{" "}
                {job.datePosted && typeof job.datePosted === "string"
                  ? job.datePosted
                  : job.datePosted?.seconds
                  ? new Date(job.datePosted.seconds * 1000).toLocaleDateString()
                  : "N/A"}
              </p>
              <Link
                to={`/jobs/${job.id}`}
                className="inline-block px-5 py-2 bg-gradient-to-r from-[#a59574] to-[#ded1bd] text-white rounded-lg shadow hover:brightness-110"
              >
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

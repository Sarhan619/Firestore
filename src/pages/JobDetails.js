import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [user, setUser] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [applicant, setApplicant] = useState({
    name: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) await checkIfJobIsSaved(firebaseUser.uid);
    });
    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    const fetchJob = async () => {
      const jobRef = doc(db, "jobs", id);
      const jobSnap = await getDoc(jobRef);
      if (jobSnap.exists()) {
        setJob({ ...jobSnap.data(), id: jobSnap.id });
      }
    };
    fetchJob();
  }, [id]);

  const checkIfJobIsSaved = async (uid) => {
    const savedJobRef = doc(db, `users/${uid}/savedJobs/${id}`);
    const savedJobSnap = await getDoc(savedJobRef);
    if (savedJobSnap.exists()) setIsSaved(true);
  };

  const handleSaveJob = async () => {
    if (!user) return alert("Please log in to save this job.");
    try {
      const savedJobRef = doc(db, `users/${user.uid}/savedJobs/${id}`);
      await setDoc(savedJobRef, {
        jobId: id,
        title: job.title,
        company: job.company,
        savedAt: serverTimestamp(),
      });
      setIsSaved(true);
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please log in to apply.");
    try {
      await addDoc(collection(db, "applications"), {
        jobId: id,
        applicantId: user.uid,
        ...applicant,
        submittedAt: serverTimestamp(),
      });

      // Notify applicant
      await addDoc(collection(db, "notifications"), {
        userId: user.uid,
        message: `You successfully applied for "${job.title}" at ${job.company}`,
        createdAt: serverTimestamp(),
        read: false,
      });

      // Notify job poster
      if (job.postedBy) {
        await addDoc(collection(db, "notifications"), {
          userId: job.postedBy,
          message: `${user.email} applied to your job "${job.title}"`,
          createdAt: serverTimestamp(),
          read: false,
        });
      }

      setSubmitted(true);
      setApplicant({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Apply failed:", error);
    }
  };

  if (!job)
    return (
      <div className="text-center mt-20 text-lg">Loading job details...</div>
    );

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-10 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#a59574]">{job.title}</h1>
        {user && (
          <button
            onClick={handleSaveJob}
            disabled={isSaved}
            className={`px-4 py-2 text-sm rounded-lg shadow transition ${
              isSaved
                ? "bg-green-600 text-white cursor-default"
                : "bg-gradient-to-r from-[#a59574] to-[#ded1bd] text-white hover:brightness-110"
            }`}
          >
            {isSaved ? "Saved" : "Save Job"}
          </button>
        )}
      </div>

      <div className="space-y-2 text-gray-700">
        <p>
          <strong>Company:</strong> {job.company}
        </p>
        <p>
          <strong>Location:</strong> {job.location} · {job.workplaceType}
        </p>
        <p>
          <strong>Employment Type:</strong> {job.employmentType}
        </p>
        <p>
          <strong>Seniority Level:</strong> {job.level}
        </p>
        <p>
          <strong>Job Type:</strong> {job.jobType}
        </p>
        <p>
          <strong>Industry:</strong> {job.industry}
        </p>
        {job.salary && (
          <p className="text-green-700 font-semibold">Salary: {job.salary}</p>
        )}
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Job Description</h2>
        <p className="whitespace-pre-line text-gray-800">{job.description}</p>
      </div>

      {job.skills?.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold">Skills:</h3>
          <ul className="list-disc list-inside text-gray-600">
            {job.skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>
      )}

      {job.benefits?.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold">Benefits:</h3>
          <ul className="list-disc list-inside text-gray-600">
            {job.benefits.map((b, index) => (
              <li key={index}>{b}</li>
            ))}
          </ul>
        </div>
      )}

      <hr className="my-8" />
      <h2 className="text-2xl font-semibold text-[#a59574] mb-4">Apply Now</h2>

      {submitted ? (
        <div className="text-green-600 text-lg">
          ✅ Your application was submitted!
        </div>
      ) : (
        <form onSubmit={handleApply} className="space-y-4">
          <input
            type="text"
            value={applicant.name}
            onChange={(e) =>
              setApplicant({ ...applicant, name: e.target.value })
            }
            placeholder="Your Name"
            required
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="email"
            value={applicant.email}
            onChange={(e) =>
              setApplicant({ ...applicant, email: e.target.value })
            }
            placeholder="Your Email"
            required
            className="w-full border px-3 py-2 rounded"
          />
          <textarea
            value={applicant.message}
            onChange={(e) =>
              setApplicant({ ...applicant, message: e.target.value })
            }
            placeholder="Message or Cover Letter"
            required
            className="w-full border px-3 py-2 rounded h-28"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-[#a59574] to-[#ded1bd] text-white rounded-lg hover:brightness-110"
          >
            Submit Application
          </button>
        </form>
      )}
    </div>
  );
}

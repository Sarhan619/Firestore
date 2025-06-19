import { useEffect, useState } from "react";
import { auth, db, storage } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const docRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setForm(docSnap.data());
        }
      }
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value.split(",").map((s) => s.trim()),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    let profilePictureUrl = form.profilePicture;
    if (profilePicFile) {
      const picRef = ref(storage, `users/${user.uid}/profile.jpg`);
      await uploadBytes(picRef, profilePicFile);
      profilePictureUrl = await getDownloadURL(picRef);
    }

    let resumeUrl = form.resume;
    if (resumeFile) {
      const resumeRef = ref(storage, `users/${user.uid}/resume.pdf`);
      await uploadBytes(resumeRef, resumeFile);
      resumeUrl = await getDownloadURL(resumeRef);
    }

    // await setDoc(doc(db, "users", user.uid), {
    //   ...form,
    //   profilePicture: profilePictureUrl,
    //   resume: resumeUrl,
    // });

    navigate("/profile");
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-[#a59574]">
        Edit Your Profile
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="fullName"
          value={form.fullName || ""}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full border p-2 rounded"
        />
        <input
          name="headline"
          value={form.headline || ""}
          onChange={handleChange}
          placeholder="Headline"
          className="w-full border p-2 rounded"
        />
        <textarea
          name="bio"
          value={form.bio || ""}
          onChange={handleChange}
          placeholder="Bio"
          className="w-full border p-2 rounded"
        />
        <input
          name="location"
          value={form.location || ""}
          onChange={handleChange}
          placeholder="Location"
          className="w-full border p-2 rounded"
        />
        <input
          name="phone"
          value={form.phone || ""}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full border p-2 rounded"
        />
        <input
          name="github"
          value={form.github || ""}
          onChange={handleChange}
          placeholder="GitHub URL"
          className="w-full border p-2 rounded"
        />
        <input
          name="linkedin"
          value={form.linkedin || ""}
          onChange={handleChange}
          placeholder="LinkedIn URL"
          className="w-full border p-2 rounded"
        />
        <input
          name="website"
          value={form.website || ""}
          onChange={handleChange}
          placeholder="Portfolio Website"
          className="w-full border p-2 rounded"
        />
        <input
          name="skills"
          value={form.skills ? form.skills.join(", ") : ""}
          onChange={handleArrayChange}
          placeholder="Skills (comma-separated)"
          className="w-full border p-2 rounded"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            name="education.degree"
            value={form.education?.degree || ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                education: { ...prev.education, degree: e.target.value },
              }))
            }
            placeholder="Degree"
            className="border p-2 rounded"
          />
          <input
            name="education.institution"
            value={form.education?.institution || ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                education: { ...prev.education, institution: e.target.value },
              }))
            }
            placeholder="Institution"
            className="border p-2 rounded"
          />
          <input
            name="education.startDate"
            value={form.education?.startDate || ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                education: { ...prev.education, startDate: e.target.value },
              }))
            }
            placeholder="Start Date"
            className="border p-2 rounded"
          />
          <input
            name="education.endDate"
            value={form.education?.endDate || ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                education: { ...prev.education, endDate: e.target.value },
              }))
            }
            placeholder="End Date"
            className="border p-2 rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            name="experience.role"
            value={form.experience?.role || ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                experience: { ...prev.experience, role: e.target.value },
              }))
            }
            placeholder="Role"
            className="border p-2 rounded"
          />
          <input
            name="experience.company"
            value={form.experience?.company || ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                experience: { ...prev.experience, company: e.target.value },
              }))
            }
            placeholder="Company"
            className="border p-2 rounded"
          />
          <input
            name="experience.startDate"
            value={form.experience?.startDate || ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                experience: { ...prev.experience, startDate: e.target.value },
              }))
            }
            placeholder="Start Date"
            className="border p-2 rounded"
          />
          <input
            name="experience.endDate"
            value={form.experience?.endDate || ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                experience: { ...prev.experience, endDate: e.target.value },
              }))
            }
            placeholder="End Date"
            className="border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Profile Picture:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePicFile(e.target.files[0])}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Resume (PDF):</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setResumeFile(e.target.files[0])}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#a59574] text-white py-2 rounded hover:bg-[#8c7a5f]"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

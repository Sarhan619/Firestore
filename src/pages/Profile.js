import { useEffect, useState } from "react";
import { auth, db, storage } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const profileRef = doc(db, "users", firebaseUser.uid);
        const profileSnap = await getDoc(profileRef);
        if (profileSnap.exists()) {
          const profileData = profileSnap.data();

          // If profile picture is set, try fetching from Firebase Storage
          if (profileData.profilePicture) {
            try {
              const profilePicUrl = await getDownloadURL(
                ref(storage, profileData.profilePicture)
              );
              profileData.profilePictureURL = profilePicUrl;
            } catch (err) {
              console.error("Failed to fetch profile picture URL", err);
            }
          }

          setProfile(profileData);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-20 text-xl text-gray-600">Loading...</div>
    );
  }

  if (!user) {
    return (
      <div className="text-center mt-20 text-xl text-red-500">
        You must be logged in to view this page.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-12 p-8 bg-white shadow-xl rounded-2xl text-left">
      <div className="flex items-center space-x-6 mb-6">
        <img
          src={
            profile?.profilePictureURL ||
            `https://ui-avatars.com/api/?name=${user.email}&background=ded1bd&color=000`
          }
          alt="Profile"
          className="w-28 h-28 rounded-full border-4 border-[#ded1bd] object-cover"
        />
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {profile?.fullName || "Your Name"}
          </h1>
          <p className="text-lg text-gray-500">
            {profile?.headline || "Your Headline"}
          </p>
          <button
            onClick={() => navigate("/edit-profile")}
            className="mt-2 px-4 py-2 bg-[#a59574] text-white rounded-md hover:bg-[#8c7a5f]"
          >
            Edit Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Contact Info
          </h2>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Phone:</strong> {profile?.phone || "Not set"}
          </p>
          <p>
            <strong>Location:</strong> {profile?.location || "Not set"}
          </p>
          <p>
            <strong>GitHub:</strong>{" "}
            <a
              href={profile?.github}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              {profile?.github}
            </a>
          </p>
          <p>
            <strong>LinkedIn:</strong>{" "}
            <a
              href={profile?.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              {profile?.linkedin}
            </a>
          </p>
          <p>
            <strong>Website:</strong>{" "}
            <a
              href={profile?.website}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              {profile?.website}
            </a>
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">About</h2>
          <p>{profile?.bio || "No bio provided yet."}</p>

          <h2 className="text-xl font-semibold text-gray-700 mt-4 mb-2">
            Skills
          </h2>
          <ul className="flex flex-wrap gap-2">
            {(profile?.skills || []).map((skill, i) => (
              <li
                key={i}
                className="bg-[#ded1bd] text-sm px-3 py-1 rounded-full"
              >
                {skill}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Education</h2>
        <p>
          <strong>{profile?.education?.degree || "Not set"}</strong> at{" "}
          {profile?.education?.institution || "Institution"}
        </p>
        <p>
          {profile?.education?.startDate || "--/--"} -{" "}
          {profile?.education?.endDate || "--/--"}
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Experience</h2>
        {(profile?.experience?.company || []).map((company, idx) => (
          <div key={idx} className="mb-4">
            <p className="font-semibold text-lg">{company}</p>
            <p>{profile.experience.role}</p>
            <p>
              {profile.experience.startDate} - {profile.experience.endDate}
            </p>
          </div>
        ))}
      </div>

      {profile?.resume && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Resume</h2>
          <a
            href={profile.resume}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline"
          >
            View Resume
          </a>
        </div>
      )}
    </div>
  );
}

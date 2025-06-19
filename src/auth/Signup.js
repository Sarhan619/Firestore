import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore"; // 🔥 Firestore

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // 🔧 Create a user profile in Firestore after signup
  const createUserProfile = async (user) => {
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      email: user.email,
      name: "",
      phone: "",
      bio: "",
      skills: [],
      createdAt: new Date(),
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      await createUserProfile(userCredential.user); // ✅ Create profile
      navigate("/profile/edit");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#faf6f2] to-[#ded1bd]">
      <form
        onSubmit={handleSignup}
        className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create Account
        </h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ded1bd]"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-6 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ded1bd]"
        />
        <button
          type="submit"
          className="w-full py-2 bg-gradient-to-r from-[#ded1bd] to-[#faf6f2] text-gray-900 font-semibold rounded-md hover:brightness-105"
        >
          Sign Up
        </button>
        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 underline">
            Log In
          </a>
        </p>
      </form>
    </div>
  );
}
export default Signup;

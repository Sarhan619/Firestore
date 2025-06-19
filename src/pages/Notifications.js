import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  where,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let unsubscribeFirestore = () => {};
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const q = query(
          collection(db, "notifications"),
          where("userId", "==", user.uid),
          orderBy("timestamp", "desc")
        );

        unsubscribeFirestore = onSnapshot(q, (snapshot) => {
          const notes = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setNotifications(notes);
          console.log("📨 Notifications fetched:", notes);
        });
      } else {
        setNotifications([]);
      }
    });

    // Cleanup both listeners
    return () => {
      unsubscribeAuth();
      unsubscribeFirestore();
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-xl font-semibold mb-4">Notifications</h1>

      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications yet.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((note) => (
            <li key={note.id} className="p-4 bg-gray-100 rounded">
              <p>{note.message}</p>
              <p className="text-sm text-gray-500">
                {note.timestamp?.toDate
                  ? new Date(note.timestamp.toDate()).toLocaleString()
                  : ""}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

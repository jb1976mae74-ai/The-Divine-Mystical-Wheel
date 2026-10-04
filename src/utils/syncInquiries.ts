import { db, auth } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

export const syncInquiriesToFirebase = async () => {
  const user = auth.currentUser;
  if (!user) return;

  const savedInquiries = localStorage.getItem("oracle-past-inquiries");
  if (!savedInquiries) return;

  try {
    const inquiries = JSON.parse(savedInquiries);
    await setDoc(doc(db, "users", user.uid, "data", "inquiries"), {
      pastInquiries: inquiries,
      lastUpdated: new Date().toISOString()
    });
    console.log("Synchronized inquiries to Firestore");
  } catch (error) {
    console.error("Failed to sync inquiries:", error);
  }
};

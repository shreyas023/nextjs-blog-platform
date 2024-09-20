"use client";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Profile() {
  const [userData, setUserData] = useState({
    profilePic: "/default-profile.png", // Placeholder if no profile pic
    username: "",
    email: "",
    blogs: [],
    favoriteBlogs: [],
  });

  const [showModal, setShowModal] = useState(false); // Modal state
  const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Fetch user data
  useEffect(() => {
    const token = localStorage.getItem("token"); // Get token from localStorage or context

    if (token) {
      fetch("/api/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            console.error("Error fetching user data:", data.error);
            return;
          }
          setUserData({
            profilePic: data.profilePic || "/default-profile.png", // Use default if no pic
            username: data.username,
            email: data.email,
            blogs: data.createdBlogs || [],
            favoriteBlogs: data.favoriteBlogs || [],
          });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      window.location.href = "/login"; // Redirect if no token
    }
  }, []);

  const handleEditProfile = () => {
    setName(userData.username); // Pre-fill the username in modal
    setShowModal(true);
  };

  const validateForm = () => {
    const nameRegex = /^[a-zA-Z\s]*$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!nameRegex.test(name)) {
      toast.error("Name must only contain letters and spaces.", { position: "top-right" });
      return false;
    }

    if (newPassword !== "" && !passwordRegex.test(newPassword)) {
      toast.error(
        "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.",
        { position: "top-right" }
      );
      return false;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.", { position: "top-right" });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const response = await fetch("/api/users/updateProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          username: name,
          newPassword: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Profile updated successfully!", { position: "top-right" });
        setUserData((prevData) => ({
          ...prevData,
          username: name,
        }));
        setShowModal(false);
      } else {
        toast.error(data.error || "Failed to update profile.", { position: "top-right" });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.", { position: "top-right" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token
    window.location.href = "/login"; // Redirect to login page
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      {/* Profile Section */}
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          <img
            src={userData.profilePic}
            alt="Profile Picture"
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold">{userData.username}</h2>
            <p className="text-gray-600">{userData.email}</p>
          </div>
        </div>

        {/* Edit Profile Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleEditProfile}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Uploaded Blogs Section */}
      <div className="w-full max-w-4xl mt-6 bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Uploaded Blogs</h3>
        {userData.blogs.length === 0 ? (
          <p className="text-gray-600">No blogs uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {userData.blogs.map((blog, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded shadow-sm">
                <h4 className="font-bold">{blog.title}</h4>
                <p className="text-gray-600">{blog.excerpt}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Favorite Blogs Section */}
      <div className="w-full max-w-4xl mt-6 bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Favorite Blogs</h3>
        {userData.favoriteBlogs.length === 0 ? (
          <p className="text-gray-600">No favorite blogs yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {userData.favoriteBlogs.map((blog, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded shadow-sm">
                <h4 className="font-bold">{blog.title}</h4>
                <p className="text-gray-600">{blog.excerpt}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Logout Button */}
      <div className="w-full max-w-4xl mt-6">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-3 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Modal for Editing Profile */}
      {showModal && (
        <div className="fixed z-10 inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter your new name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter new password"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Confirm new password"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleSubmit}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
        </div>
      )}

      {/* Toast Notification */}
      <ToastContainer />
    </div>
  );
}

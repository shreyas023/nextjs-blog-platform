"use client";
import { useState, useEffect } from "react";

export default function Profile() {
  const [userData, setUserData] = useState({
    profilePic: "/default-profile.png", // Placeholder if no profile pic
    name: "John Doe",
    email: "john.doe@example.com",
    blogs: [],
    favoriteBlogs: [],
  });

  const handleEditProfile = () => {
    // Logic for editing profile (can be a form modal or separate page)
    console.log("Edit profile");
  };

  const handleLogout = () => {
    // Clear localStorage or any stored tokens
    localStorage.removeItem("token");
    // Redirect to login page
    window.location.href = "/login";
  };

  useEffect(() => {
    // Fetch user data here (name, email, profile pic, blogs, favorite blogs)
    // Example API call to fetch data
    // fetch("/api/user/profile").then((res) => res.json()).then(data => setUserData(data));
  }, []);

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
            <h2 className="text-2xl font-bold">{userData.name}</h2>
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
    </div>
  );
}

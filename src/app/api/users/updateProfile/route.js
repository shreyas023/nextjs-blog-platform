export async function POST(req){
  const { username, newPassword } = req.body;
  const userId = req.user.id; // Assuming user is authenticated

  try {
    // Find user and update name
    const updatedUser = await User.findByIdAndUpdate(userId, {
      username,
      ...(newPassword && { password: hashPassword(newPassword) }), // Only update password if provided
    }, { new: true });

    res.json({
      username: updatedUser.username,
      email: updatedUser.email,
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating profile" });
  }
}
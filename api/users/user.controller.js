import User from "./user.model";

export const add = async (req, res) => {
  try {
    const { discord_id, urt_auth, name, country } = req.body;
    const user = await User.create({
      discord_id,
      urt_auth,
      name,
      country,
    });
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

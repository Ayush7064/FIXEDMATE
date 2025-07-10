exports.getUserProfile = async (req, res) => {
  try {
    res.status(200).json({
      message: "User profile fetched",
      user: req.user,
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};

exports.getProviderProfile = async (req, res) => {
  try {
    res.status(200).json({
      message: "Provider profile fetched",
      provider: req.user,
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};

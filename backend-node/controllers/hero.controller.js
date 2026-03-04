exports.getHero = (req, res) => {
  res.json({
    name: "Vaibhav Kale",
    role: "Frontend Developer",
    tagline: "Building calm, premium web experiences"
  });
};

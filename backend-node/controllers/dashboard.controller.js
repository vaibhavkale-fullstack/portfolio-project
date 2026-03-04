const dashboardService = require('../services/dashboard.service');

exports.getProfileStrength = async (req, res) => {
  try {

    const userId = req.user.id; 
    // or const userId = req.params.userId;
    // depending on your auth setup

    const result = await dashboardService.calculateProfileStrength(userId);
//console.log(result);

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};

//---------------------------------------Get Profile Views ----------------------------------------------------

exports.getProfileViews = async (req, res) => {
  try {

    const userId = req.user.id;
//console.log(userId);

    const result = await dashboardService.getProfileViewsStats(userId);
//console.log(result);

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};

//------------------------------ Insert profile visitors---------------------------------------------
exports.getPublicProfile = async (req, res) => {
  try {

    const username = req.params.username;

    // 1️⃣ Get user by username
    const user = await dashboardService.getUserByUsername(username);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2️⃣ Record view
    await dashboardService.recordProfileView(
      user.id,
      req.ip,
      req.headers['user-agent']
    );

    // 3️⃣ Return profile data
    const profile = await dashboardService.getProfileByUserId(user.id);

    res.json(profile);

  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

//---------------------------------------------------------------------

exports.getRecruiterMessagesStats = async (req, res) => {
  try {

    const userId = req.user.id;

    const result = await dashboardService.getRecruiterMessageStats(userId);

    res.status(200).json(result);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};

//-----------------------------------------------------------

exports.markSingleMessageRead = async (req, res) => {
  try {
    const messageId = req.params.id;

    await dashboardService.markMessageAsRead(messageId);

    res.json({ message: "Message marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Error updating message" });
  }
};
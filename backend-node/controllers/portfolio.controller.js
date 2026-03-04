const recruiterService = require("../services/portfolio.service");


exports.receiveMessages = async(req, res, next)=>{
    
    try {

        const data = {...req.body, user_id: req.user.id}
 console.log("controller",data);
     const receiveMessages = await recruiterService.recruiterMessages(data);
     res.status(200).json(receiveMessages);
        
    } catch (err) {
        next(err);
    }
}

//--------------------------------------

exports.getPortfolioByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;

    const user = await recruiterService.getPortfolioByUsername(username);

    if (!user) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    res.status(200).json(user);

  } catch (err) {
    next(err);
  }
};

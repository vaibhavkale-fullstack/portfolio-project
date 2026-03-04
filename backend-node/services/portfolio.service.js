const recruiterModel = require("../models/portfolio.model");



exports.recruiterMessages = async(data)=>{
console.log("service",data);

    const recruiterMessages = await recruiterModel.recruiterMessages(data);
    return (recruiterMessages);
}

//----------------------------------------------

exports.getPortfolioByUsername = async (username) => {
  return await recruiterModel.getPortfolioByUsername(username);
};
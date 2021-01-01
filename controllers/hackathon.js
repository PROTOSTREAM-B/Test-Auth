const Hackathons = require("../models/hackathon");
const User = require("../models/user");

exports.getHackYear=(req, res, next, id) => {
  // get selected year
  next();
}

exports.findAllHackathons = (req, res, next, id) => {
    let year=req.body.year;

    // static years
    switch (year) {
        case "2018":
            Hackathons.find(year, (err, hackathonproject) => {
                if (err) {
                  return res.json(404).json({
                    error: err,
                  });
                }
                res.status(200).json(hackathonproject);
              });
            break;
        case "2019":
            Hackathons.find(year, (err, hackathonproject) => {
                if (err) {
                  return res.json(404).json({
                    error: err,
                  });
                }
                res.status(200).json(hackathonproject);
              });
            break;
        case "2020":
            Hackathons.find(year, (err, hackathonproject) => {
                if (err) {
                  return res.json(404).json({
                    error: err,
                  });
                }
                res.status(200).json(hackathonproject);
              });
            break;
    }
    next();
};






exports.createNewHackathon =(req, res) => {
    let currentyear=new Date().getFullYear();
    let hackmembers=req.body.hackathonprojectmembercount;
    const hackthon = new Hackathon({
        CurrentYear:currentyear,
        Hackname:req.params.hackathonprojectname,
        Teamname:req.params.hackathonprojectteamname,
        Leadername:req.params.hackathonprojectleadername,
        Leaderroll:req.params.hackathonprojectleaderrollno,
        Leaderbranch:req.params.hackathonprojectleaderbranch,
        Projectdomain:req.params.hackathonprojectprojectdomain,
        Projectsummary:req.params.hackathonprojectsummary,
        Leaderemailid:req.params.hackathonprojectleaderemailid,
        Leadermobile:req.params.hackathonprojectleadermobile,
        // todo- make array dynamic using map function or forEach loop,
        // to store Hackmember Data in array and keep in single object
        
        //current state- static array of hackathon members
        Hackmembers:[
            {
                MemberName:req.params.hackathonprojectmembername,
                MemberRoll:req.params.hackathonprojectmemberroll,
                MemberBranch:req.params.hackathonprojectmemberbranch,
                MemberEmail:req.params.hackathonprojectmemberemail,
            },
            {
                MemberName:req.params.hackathonprojectmembername,
                MemberRoll:req.params.hackathonprojectmemberroll,
                MemberBranch:req.params.hackathonprojectmemberbranch,
                MemberEmail:req.params.hackathonprojectmemberemail,
            },
            {
                MemberName:req.params.hackathonprojectmembername,
                MemberRoll:req.params.hackathonprojectmemberroll,
                MemberBranch:req.params.hackathonprojectmemberbranch,
                MemberEmail:req.params.hackathonprojectmemberemail,
            }]
    });
};
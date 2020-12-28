const Projects = require("../models/project");
const User = require("../models/user");

exports.findAllProjects = (req, res) => {
  Projects.find()
    .populate("user")
    .exec((err, allProjects) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      }

      res.status(200).json(allProjects);
    });
  // Projects.find({}, );
};

//TODO maybe not complete have a look at it...

exports.findProject = (req, res) => {
  const { category } = req.body;
  console.log(category);

  Projects.find({ category }, (err, projects) => {
    if (err) {
      return res.json(404).json({
        error: err,
      });
    }

    res.status(200).json(projects);
  });
};

//! Not complete..
exports.pushProjectInUser = (req, res, next) => {
  console.log("in pushProjectInUser ");
  // console.log(req.profile);
  let project = [];
  // req.profile.projects.forEach((project) => {
  project.push({
    ProjectTitle: req.body.ProjectTitle,
    ProjectArea: req.body.ProjectArea,
    SubmissionDate: req.body.SubmissionDate,
    Technology: req.body.Technology,
    TeamMembers: req.body.TeamMembers,
    RollNumber: req.body.RollNumber,
    Section: req.body.Section,
    GuideName: req.body.GuideName,
  });
  // });
  // console.log(project.toArray());

  //! User not updating idk what is the error....
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { projects: project } },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.log("in findoneandupadte error");
        return res.status(500).json({
          error: err,
        });
      }
      // res.json(updatedUser);
      console.log(updatedUser);
    }
  );
  console.log("after user got updated");
  next();
};

//! error!!!
exports.createProject = (req, res) => {
  console.log("In createProject ");
  // console.log("req.profile:: ", req.profile);
  const project = new Projects(req.body);
  // project.user.projects = undefined;
  req.profile.projects = undefined;
  project.user = req.profile;
  // console.log(project);
  project.save((err, project) => {
    if (err) {
      console.log("In project save error");
      res.json({
        error: err,
      });
    }
    console.log("after project got saved");
    res.status(200).json(project);
  });
};

exports.getProjetByUserId = (req, res) => {
  user.findById();
};

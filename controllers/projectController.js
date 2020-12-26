const Projects = require("../models/project");

exports.findAllProjects = (req, res) => {
  Projects.find({}, (err, allProjects) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    }

    res.status(200).json(allProjects);
  });
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

exports.createProject = (req, res) => {
  const project = new Projects(req.body);
  project.save((err, project) => {
    if (err) {
      return res.json({
        error: err,
      });
    }

    res.status(200).json(project);
  });
};

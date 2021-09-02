const interview = require('../models/interview');
const User = require('../models/user');

const router = require('express').Router();

router.get('/', async (req, res, next) => {
  try {
    let { type } = req.query;
    let interviews;
    if (!req.isAuthenticated()) throw Error('You must be logged in');
    switch (type) {
      case 'upcoming':
        const { upcomingInterviews } = await req.user.populate(
          'upcomingInterviews'
        );
        interviews = upcomingInterviews;
        break;
      case 'past':
        const { pastInterviews } = await req.user.populate('pastInterviews');
        interviews = pastInterviews;
        break;

      default:
        throw Error('Provide type of interviews');
        break;
    }

    return res.json({
      type: 'success',
      msg: 'Fetched upcoming interviews',
      interviews,
    });
  } catch (error) {
    res.status(500).json({ type: 'failure', msg: error.message });
  }
});

router.post('/create', async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) throw Error('You must be logged in');

    if (
      req.user.pastInterviews.length + req.user.upcomingInterviews.length >=
      20
    )
      throw Error(
        'Max interview limit (20) reached! Please delete some interviews'
      );

    const { title, candidateName, interviewerName } = req.body;
    if (!title || !candidateName || !interviewerName)
      throw Error('Some fields are empty');

    const newInterview = await interview.create({
      owner: req.user._id,
      title: title.trim(),
      candidateName: candidateName.trim(),
      interviewerName: interviewerName.trim(),
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        upcomingInterviews: newInterview._id,
      },
    });

    return res.json({
      type: 'success',
      msg: 'Created interview',
      interview: newInterview,
    });
  } catch (error) {
    res.status(500).json({ type: 'failure', msg: error.message });
  }
});

module.exports = router;

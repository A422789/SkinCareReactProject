const demoGuard = (req, res, next) => {
  // If the logged-in user is the demo account, intercept state-modifying requests
  if (req.user && req.user.email === 'demo@skincareproject.com') {
    const isWriteRequest = ['POST', 'PUT', 'DELETE'].includes(req.method);
    
    // We allow demo to submit contact messages to test the form flow, 
    // but we block actual modifications to products, settings, payment types, and order actions.
    const isContactSubmission = req.originalUrl.includes('/messages') && req.method === 'POST';
    const isVisitLog = req.originalUrl.includes('/analytics/visit') && req.method === 'POST';

    if (isWriteRequest && !isContactSubmission && !isVisitLog) {
      return res.status(200).json({
        success: true,
        message: "Demo Mode: Action simulated successfully. Database writes are disabled in sandbox mode.",
        // Return dummy IDs if creating new objects to prevent dashboard failures
        _id: "603dcf9e1081a94248a31a99", 
        id: "demo-simulated-id"
      });
    }
  }
  next();
};

module.exports = { demoGuard };

import AuditLog from '../models/AuditLog.js';

// @desc    Get all audit logs (paginated)
// @route   GET /api/v1/admin/audit-logs
// @access  Private/Admin
export const getAuditLogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const { action, resourceType, search } = req.query;
    let query = {};

    if (action) query.action = action;
    if (resourceType) query.resourceType = resourceType;

    // Fuzzy search for actor name or ip address or metadata
    if (search) {
      query.$or = [
        { action: { $regex: search, $options: 'i' } },
        { resourceType: { $regex: search, $options: 'i' } },
        { ipAddress: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await AuditLog.countDocuments(query);
    const logs = await AuditLog.find(query)
      .populate('actor', 'name email role')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: logs.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: logs
    });
  } catch (error) {
    next(error);
  }
};

import AuditLog from '../models/AuditLog.js';

/**
 * Log an action to the audit log database
 * @param {string} actorId - User ID of the actor
 * @param {string} role - Role of the actor
 * @param {string} action - Action performed (e.g. 'LOGIN', 'CREATE', 'UPDATE', 'DELETE')
 * @param {string} resourceType - Type of resource affected (e.g. 'MedicalRecord', 'Prescription', 'LabReport', 'User')
 * @param {string} [resourceId] - ID of the resource
 * @param {string} [ipAddress] - IP address of the client
 * @param {string} [userAgent] - User agent of the client
 * @param {object} [metadata] - Additional safe details
 */
export const logAction = async (actorId, role, action, resourceType, resourceId, ipAddress, userAgent, metadata = {}) => {
  try {
    await AuditLog.create({
      actor: actorId,
      actorRole: role,
      action,
      resourceType,
      resourceId: resourceId || null,
      ipAddress: ipAddress || '127.0.0.1',
      userAgent: userAgent || 'System',
      metadata
    });
  } catch (error) {
    console.error('Audit Log failed to write:', error.message);
  }
};

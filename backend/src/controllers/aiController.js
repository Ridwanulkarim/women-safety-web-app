import { firestoreAdminService } from '../services/firestoreAdminService.js';
import { runSafeHavenLangGraphAgent, getAgentMetadata } from '../services/langgraphAgentService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * Merge Firestore records with client-provided records without duplicating IDs
 */
const mergeByKey = (primary = [], secondary = [], keyField = 'id') => {
  const map = new Map();
  (Array.isArray(secondary) ? secondary : []).forEach((item) => {
    if (item && item[keyField]) map.set(item[keyField], item);
  });
  (Array.isArray(primary) ? primary : []).forEach((item) => {
    if (item && item[keyField]) map.set(item[keyField], { ...(map.get(item[keyField]) || {}), ...item });
  });
  return Array.from(map.values());
};

export const handleAIChat = async (req, res, next) => {
  try {
    const { query, mode = 'SOS_REPORTS', language = 'en', clientAlerts = [], clientUsers = [] } = req.body || {};

    if (!query || !String(query).trim()) {
      return errorResponse(res, 400, 'Query text is required for the LangGraph AI agent.');
    }

    // Retrieve live records from Firebase Cloud Firestore
    const [dbAlerts, dbUsers] = await Promise.all([
      firestoreAdminService.getAllSOS().catch(() => []),
      firestoreAdminService.getAllUsers().catch(() => []),
    ]);

    const mergedAlerts = mergeByKey(dbAlerts, clientAlerts, 'id').sort(
      (a, b) => new Date(b.timestamp || b.createdAt || 0) - new Date(a.timestamp || a.createdAt || 0)
    );
    const mergedUsers = mergeByKey(dbUsers, clientUsers, 'uid');

    const agentResult = await runSafeHavenLangGraphAgent({
      query: String(query).trim(),
      mode,
      language,
      alerts: mergedAlerts,
      users: mergedUsers,
    });

    return successResponse(res, 200, 'LangGraph AI agent completed execution', agentResult);
  } catch (error) {
    next(error);
  }
};

export const getAIStatus = async (req, res) => {
  return successResponse(res, 200, 'SafeHaven AI Service Online', getAgentMetadata());
};

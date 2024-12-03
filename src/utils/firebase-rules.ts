export const firestoreRules = `
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isValidAgent() {
      return request.resource.data.keys().hasAll([
        'name', 'language', 'firstMessage', 'systemPrompt', 
        'voiceSettings', 'responseStyle', 'interactionMode', 
        'behaviorRules', 'llmProvider', 'model', 'widgetSettings'
      ]);
    }

    function isValidInteraction() {
      return request.resource.data.keys().hasAll([
        'agentId', 'query', 'response', 'responseTime', 'successful'
      ]);
    }

    // Allow read/write access for authenticated users
    match /{document=**} {
      allow read, write: if isAuthenticated();
    }

    // Specific collection rules
    match /agents/{agentId} {
      allow read: if isAuthenticated();
      allow create, update: if isAuthenticated() && isValidAgent();
      allow delete: if isAuthenticated();
    }

    match /interactions/{interactionId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && isValidInteraction();
    }
  }
}
`;
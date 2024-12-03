import { FirestoreDataConverter, Timestamp } from 'firebase/firestore';
import { Agent } from '../../types/agent';

export const agentConverter: FirestoreDataConverter<Agent> = {
  toFirestore: (agent: Agent) => {
    // Clean up the data before sending to Firestore
    const data = {
      ...agent,
      analytics: {
        interactions: agent.analytics.interactions.map(int => ({
          ...int,
          timestamp: int.timestamp instanceof Date 
            ? Timestamp.fromDate(int.timestamp) 
            : Timestamp.fromDate(new Date(int.timestamp))
        }))
      },
      // Add server timestamp fields
      updatedAt: Timestamp.now(),
      createdAt: agent.createdAt || Timestamp.now()
    };

    // Remove the id field as it's stored in the document reference
    const { id, ...cleanData } = data;
    
    // Ensure all date fields are Timestamps
    return cleanData;
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return {
      ...data,
      id: snapshot.id,
      analytics: {
        interactions: (data.analytics?.interactions || []).map((int: any) => ({
          ...int,
          timestamp: int.timestamp instanceof Timestamp 
            ? int.timestamp.toDate() 
            : new Date(int.timestamp)
        }))
      },
      // Convert Timestamp fields back to Date objects
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate()
    } as Agent;
  }
};
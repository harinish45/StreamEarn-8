export type Lead = {
  id: string;
  ownerId: string;
  name: string;
  email: string;
  property: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Closed' | 'Lost' | 'Dead';
  priority: 'Hot' | 'Warm' | 'Cold';
  isFraudulent: boolean;
  lastContacted: string; // YYYY-MM-DD
  leadData: string;
};

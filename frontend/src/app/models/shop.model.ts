export interface Shop {
  id: string;
  name: string;
  ownerId: string;
  category: string;
  location: string;
  description: string;
  status: 'pending' | 'active' | 'suspended';
  createdAt: Date;
}

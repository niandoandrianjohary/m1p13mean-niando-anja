export interface Shop {
  _id: string; // MongoDB utilise _id
  name: string;
  category: string;
  location: string;
  description: string;
  status: 'pending' | 'active' | 'suspended';
  createdAt: Date;
  ownerId: {
    _id: string;
    email: string;
    name: string;
    phone: string;
  };
  // Propriété ajoutée par le front pour le formulaire de validation
  assignedLocation?: string; 
}
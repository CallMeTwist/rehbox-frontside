// Mock data for ReHboX frontend development

export const mockPT = {
  id: 'pt-001',
  name: 'Dr. Adaeze Nwosu',
  email: 'adaeze@rehbox.ng',
  role: 'physiotherapist' as const,
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=adaeze',
  vettingStatus: 'approved' as const,
  coins: 2450,
  specialization: 'Orthopedic & Sports Physiotherapy',
  licenseNumber: 'MRTB/PT/2019/04521',
  location: 'Lagos, Nigeria',
  clientCount: 12,
  activationCode: 'REHBOX-PT-ADZ01',
};

export const mockClient = {
  id: 'client-001',
  name: 'Chidi Okafor',
  email: 'chidi@example.com',
  role: 'client' as const,
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chidi',
  isSubscribed: true,
  coins: 850,
};

export const mockClients = [
  { id: 'c1', name: 'Amara Okonkwo', age: 34, condition: 'Lower Back Pain', compliance: 87, lastSession: '2 hours ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amara', status: 'active' },
  { id: 'c2', name: 'Bola Adeyemi', age: 28, condition: 'Shoulder Rehabilitation', compliance: 62, lastSession: '1 day ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bola', status: 'active' },
  { id: 'c3', name: 'Fatima Musa', age: 45, condition: 'Knee Osteoarthritis', compliance: 91, lastSession: '30 min ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fatima', status: 'active' },
  { id: 'c4', name: 'Emeka Eze', age: 52, condition: 'Post-stroke Recovery', compliance: 74, lastSession: '3 days ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emeka', status: 'inactive' },
  { id: 'c5', name: 'Ngozi Dike', age: 31, condition: 'Ankle Sprain', compliance: 95, lastSession: '1 hour ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ngozi', status: 'active' },
  { id: 'c6', name: 'Taiwo Bakare', age: 40, condition: 'Cervical Spondylosis', compliance: 58, lastSession: '5 days ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=taiwo', status: 'inactive' },
];

export const mockExercises = [
  { id: 'ex1', name: 'Standing Calf Raise', category: 'Lower Body', difficulty: 'Beginner', duration: 10, reps: 15, sets: 3, thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop', description: 'Strengthens calf muscles and improves ankle stability', equipment: 'None', bodyPart: 'Calves', videoUrl: '#' },
  { id: 'ex2', name: 'Shoulder Pendulum', category: 'Upper Body', difficulty: 'Beginner', duration: 8, reps: 20, sets: 2, thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=250&fit=crop', description: 'Gentle shoulder mobility exercise for early rehabilitation', equipment: 'None', bodyPart: 'Shoulders', videoUrl: '#' },
  { id: 'ex3', name: 'Knee Extension', category: 'Lower Body', difficulty: 'Intermediate', duration: 12, reps: 12, sets: 3, thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=250&fit=crop', description: 'Quadriceps strengthening for knee rehabilitation', equipment: 'Resistance band', bodyPart: 'Knees', videoUrl: '#' },
  { id: 'ex4', name: 'Bird Dog', category: 'Core', difficulty: 'Intermediate', duration: 10, reps: 10, sets: 3, thumbnail: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=400&h=250&fit=crop', description: 'Core stability and lumbar spine stabilization', equipment: 'Mat', bodyPart: 'Core', videoUrl: '#' },
  { id: 'ex5', name: 'Wall Angels', category: 'Upper Body', difficulty: 'Beginner', duration: 8, reps: 12, sets: 2, thumbnail: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400&h=250&fit=crop', description: 'Improves thoracic mobility and scapular control', equipment: 'Wall', bodyPart: 'Back/Shoulders', videoUrl: '#' },
  { id: 'ex6', name: 'Hip Abduction', category: 'Lower Body', difficulty: 'Beginner', duration: 10, reps: 15, sets: 3, thumbnail: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=400&h=250&fit=crop', description: 'Strengthens hip abductors and improves stability', equipment: 'Resistance band', bodyPart: 'Hips', videoUrl: '#' },
];

export const mockPlan = {
  id: 'plan-001',
  name: 'Knee Rehabilitation Phase 1',
  ptName: 'Dr. Adaeze Nwosu',
  startDate: '2025-01-15',
  endDate: '2025-02-28',
  progress: 68,
  exercises: [
    { ...mockExercises[2], completed: true, scheduledDays: ['Mon', 'Wed', 'Fri'] },
    { ...mockExercises[0], completed: true, scheduledDays: ['Tue', 'Thu', 'Sat'] },
    { ...mockExercises[3], completed: false, scheduledDays: ['Mon', 'Wed', 'Fri'] },
  ],
};

export const mockProgressData = [
  { week: 'W1', compliance: 60, pain: 7, sessions: 3 },
  { week: 'W2', compliance: 72, pain: 6, sessions: 4 },
  { week: 'W3', compliance: 68, pain: 5, sessions: 4 },
  { week: 'W4', compliance: 85, pain: 4, sessions: 5 },
  { week: 'W5', compliance: 80, pain: 3, sessions: 5 },
  { week: 'W6', compliance: 90, pain: 2, sessions: 6 },
];

export const mockRewards = [
  { id: 'r1', name: 'First Session', description: 'Complete your first exercise session', coins: 50, earned: true, icon: '🏆' },
  { id: 'r2', name: '7-Day Streak', description: 'Exercise for 7 consecutive days', coins: 150, earned: true, icon: '🔥' },
  { id: 'r3', name: 'Perfect Week', description: 'Complete all planned sessions in a week', coins: 200, earned: false, icon: '⭐' },
  { id: 'r4', name: 'Pain Reducer', description: 'Reduce pain score by 3 points', coins: 300, earned: false, icon: '💪' },
  { id: 'r5', name: 'Milestone 30', description: 'Complete 30 sessions total', coins: 500, earned: false, icon: '🎯' },
];

export const mockShopItems = [
  { id: 's1', name: 'Resistance Band Set', price: 4500, coinDiscount: 200, category: 'Equipment', image: 'https://images.unsplash.com/photo-1598575468023-85f0d9c85f41?w=300&h=200&fit=crop', rating: 4.8, reviews: 234, inStock: true },
  { id: 's2', name: 'Foam Roller Pro', price: 8900, coinDiscount: 350, category: 'Recovery', image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=300&h=200&fit=crop', rating: 4.9, reviews: 189, inStock: true },
  { id: 's3', name: 'Physiotherapy Guide Book', price: 3500, coinDiscount: 150, category: 'Education', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=200&fit=crop', rating: 4.6, reviews: 87, inStock: true },
  { id: 's4', name: 'Yoga Mat Premium', price: 12000, coinDiscount: 500, category: 'Equipment', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&h=200&fit=crop', rating: 4.7, reviews: 312, inStock: false },
  { id: 's5', name: 'Heat Therapy Pack', price: 6500, coinDiscount: 250, category: 'Recovery', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=200&fit=crop', rating: 4.5, reviews: 156, inStock: true },
  { id: 's6', name: 'Digital Pain Diary', price: 2000, coinDiscount: 100, category: 'Digital', image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=300&h=200&fit=crop', rating: 4.3, reviews: 67, inStock: true },
];

export const mockChatMessages = [
  { id: 'm1', senderId: 'pt-001', senderName: 'Dr. Adaeze', content: 'Good morning! How are you feeling after yesterday\'s session?', timestamp: '09:15', isOwn: false },
  { id: 'm2', senderId: 'client-001', senderName: 'Chidi', content: 'Morning Dr. Adaeze! I felt a bit sore but much better than last week.', timestamp: '09:22', isOwn: true },
  { id: 'm3', senderId: 'pt-001', senderName: 'Dr. Adaeze', content: 'That\'s great progress! The soreness is normal. Make sure to do the stretches I showed you.', timestamp: '09:25', isOwn: false },
  { id: 'm4', senderId: 'client-001', senderName: 'Chidi', content: 'Yes, I did them this morning. The knee extension feels easier now!', timestamp: '09:30', isOwn: true },
  { id: 'm5', senderId: 'pt-001', senderName: 'Dr. Adaeze', content: 'Excellent! Keep it up. Today\'s session is scheduled for 5pm. Don\'t forget 🙌', timestamp: '09:31', isOwn: false },
];

export const mockPTStats = {
  totalClients: 12,
  activeClients: 8,
  avgCompliance: 78,
  totalSessions: 234,
  monthlyEarnings: 85000,
  commissionsEarned: 12400,
  plansCreated: 18,
};

export const mockComplianceData = [
  { month: 'Oct', compliance: 72 },
  { month: 'Nov', compliance: 78 },
  { month: 'Dec', compliance: 65 },
  { month: 'Jan', compliance: 82 },
  { month: 'Feb', compliance: 88 },
];

export const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'pid', label: 'Pidgin', flag: '🇳🇬' },
  { code: 'yo', label: 'Yoruba', flag: '🇳🇬' },
  { code: 'ig', label: 'Igbo', flag: '🇳🇬' },
  { code: 'ha', label: 'Hausa', flag: '🇳🇬' },
];

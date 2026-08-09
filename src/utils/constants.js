// Emergency Numbers Specification (National Hotlines)
export const EMERGENCY_NUMBERS = [
  {
    id: '999',
    name: 'National Emergency Service',
    number: '999',
    category: 'National Hotline',
    icon: 'FiAlertTriangle',
    color: 'bg-red-500',
    description: 'Police, Fire Service, and Ambulance combined dispatch service.'
  },
  {
    id: 'police',
    name: 'Police Emergency Helpline',
    number: '999',
    category: 'Law Enforcement',
    icon: 'FiShield',
    color: 'bg-blue-600',
    description: 'Immediate police intervention and crime reporting.'
  },
  {
    id: 'women-helpline',
    name: 'National Women & Child Helpline',
    number: '109',
    altNumber: '10921',
    category: 'Specialized Hotline',
    icon: 'FiHeart',
    color: 'bg-pink-600',
    description: 'Direct support against violence, harassment, and domestic abuse.'
  },
  {
    id: 'shasthyo-batayon',
    name: 'Shasthyo Batayon',
    number: '16263',
    category: 'Medical Advice',
    icon: 'FiActivity',
    color: 'bg-emerald-600',
    description: '24/7 government health helpline for medical advice from registered doctors, hospital info, and ambulance listings.'
  }
];

export const TIP_CATEGORIES = [
  'All',
  'Self Defense',
  'Digital Safety',
  'Travel Safety',
  'Workplace Safety',
  'Home Safety',
  'Legal Rights'
];

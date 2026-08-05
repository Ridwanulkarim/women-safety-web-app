// Emergency Numbers Specification (Bangladesh Default + Universal)
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
    id: 'fire',
    name: 'Fire Service & Rescue',
    number: '16163',
    altNumber: '999',
    category: 'Rescue',
    icon: 'FiFlame',
    color: 'bg-amber-600',
    description: 'Emergency fire response and disaster search & rescue.'
  },
  {
    id: 'ambulance',
    name: 'Ambulance Emergency Dispatch',
    number: '199',
    altNumber: '999',
    category: 'Medical',
    icon: 'FiActivity',
    color: 'bg-emerald-600',
    description: '24/7 Paramedic and urgent ambulance transport.'
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

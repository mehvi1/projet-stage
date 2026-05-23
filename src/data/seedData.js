export const statusOptions = ['Pending', 'Seen', 'In Progress', 'Resolved', 'Closed']

export const users = [
  {
    id: 'u-client-001',
    name: 'Nadia El Amrani',
    email: 'client@pbxcom.ma',
    password: 'client123',
    role: 'client',
    company: 'Atlas Retail',
  },
  {
    id: 'u-admin-001',
    name: 'Yassine Bennis',
    email: 'admin@pbxcom.ma',
    password: 'admin123',
    role: 'admin',
    company: 'PBxcom',
  },
]

export const tickets = [
  {
    id: 'PBX-24051',
    userId: 'u-client-001',
    createdAt: '2026-05-21T10:20:00.000Z',
    status: 'In Progress',
    priority: 'High',
    subject: 'VPN access is unstable for finance users',
    description:
      'The VPN disconnects every few minutes for the finance department and blocks access to accounting tools.',
    client: {
      nom: 'El Amrani',
      prenom: 'Nadia',
      societes: 'Atlas Retail',
      nMarche: 'MR-2026-031',
      nFacture: 'FAC-90214',
      telephone: '+212612345678',
      mail: 'client@pbxcom.ma',
      ville: 'Casablanca',
    },
    history: [
      { date: '2026-05-21T10:20:00.000Z', label: 'Ticket created', actor: 'Client' },
      { date: '2026-05-21T11:10:00.000Z', label: 'Seen by support', actor: 'PBxcom' },
      { date: '2026-05-21T14:35:00.000Z', label: 'Network engineer assigned', actor: 'PBxcom' },
    ],
    notes: ['Check firewall lease time and VPN gateway logs.'],
  },
  {
    id: 'PBX-24052',
    userId: 'u-client-001',
    createdAt: '2026-05-22T08:15:00.000Z',
    status: 'Pending',
    priority: 'Medium',
    subject: 'New workstation cannot reach shared printer',
    description:
      'A new laptop for the sales desk cannot discover the shared printer on the office network.',
    client: {
      nom: 'El Amrani',
      prenom: 'Nadia',
      societes: 'Atlas Retail',
      nMarche: 'MR-2026-032',
      nFacture: 'FAC-90244',
      telephone: '+212612345678',
      mail: 'client@pbxcom.ma',
      ville: 'Rabat',
    },
    history: [{ date: '2026-05-22T08:15:00.000Z', label: 'Ticket created', actor: 'Client' }],
    notes: [],
  },
  {
    id: 'PBX-24049',
    userId: 'u-client-001',
    createdAt: '2026-05-18T16:05:00.000Z',
    status: 'Resolved',
    priority: 'Low',
    subject: 'Microsoft 365 password reset request',
    description: 'Reset access for a new temporary employee account.',
    client: {
      nom: 'El Amrani',
      prenom: 'Nadia',
      societes: 'Atlas Retail',
      nMarche: 'MR-2026-027',
      nFacture: 'FAC-90177',
      telephone: '+212612345678',
      mail: 'client@pbxcom.ma',
      ville: 'Casablanca',
    },
    history: [
      { date: '2026-05-18T16:05:00.000Z', label: 'Ticket created', actor: 'Client' },
      { date: '2026-05-18T16:40:00.000Z', label: 'Password reset completed', actor: 'PBxcom' },
    ],
    notes: ['Resolved through Microsoft admin center.'],
  },
]

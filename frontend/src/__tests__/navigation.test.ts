import { NAVIGATION_CONFIG, NavItem } from '../lib/navigation';
import { UserRole, hasPermission } from '../lib/permissions';

const expectedItemsPerRole: Record<UserRole, string[]> = {
  'Admin': [
    'Overview', 'Employees', 'Attendance', 'Payroll', 'Overview', 'Ledger', 
    'Receivables', 'Payables', 'Reports', 'Stock', 'Issue', 'Returns', 
    'Active Programs', 'My Attendance', 'System Admin', 
    'Go to Website Home', 'Edit Profile', 'Account Settings', 'Support'
  ],
  'Director': [
    'Overview', 'Overview', 'Receivables', 'Payables', 'Reports', 'Stock', 
    'Active Programs', 'Go to Website Home', 'Edit Profile', 'Account Settings', 'Support'
  ],
  'HR Officer': [
    'Overview', 'Employees', 'Attendance', 'Payroll', 'My Attendance',
    'Go to Website Home', 'Edit Profile', 'Account Settings', 'Support'
  ],
  'Finance Officer': [
    'Overview', 'Payroll', 'Overview', 'Ledger', 'Receivables', 'Payables', 'Reports', 
    'Stock', 'Go to Website Home', 'Edit Profile', 'Account Settings', 'Support'
  ],
  'Staff': [
    'Overview', 'Issue', 'Returns', 'Active Programs', 'My Attendance',
    'Go to Website Home', 'Edit Profile', 'Account Settings', 'Support'
  ]
};

function runTest() {
  let passed = true;
  
  for (const [roleStr, expected] of Object.entries(expectedItemsPerRole)) {
    const role = roleStr as UserRole;
    
    // Mock user matching frontend User type
    const user = { id: 'test', email: 'test@vff', roles: { role_name: role } };
    
    // Filter navigation
    const allowedLabels: string[] = [];
    for (const section of NAVIGATION_CONFIG) {
      for (const item of section.items) {
        if (!item.requiredPermission || hasPermission(role, item.requiredPermission)) {
          allowedLabels.push(item.label);
        }
      }
    }
    
    // Compare
    const missing = expected.filter(l => !allowedLabels.includes(l));
    const extra = allowedLabels.filter(l => !expected.includes(l));
    
    if (missing.length > 0 || extra.length > 0) {
      console.error(`❌ [FAIL] ${role}`);
      if (missing.length > 0) console.error(`   Missing: ${missing.join(', ')}`);
      if (extra.length > 0) console.error(`   Extra: ${extra.join(', ')}`);
      passed = false;
    } else {
      console.log(`✅ [PASS] ${role}`);
    }
  }
  
  if (!passed) {
    console.error('\nTests failed!');
    process.exit(1);
  } else {
    console.log('\nAll navigation tests passed!');
  }
}

runTest();

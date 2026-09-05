/* Test vendor registration and admin approval flow.
Run after server is started (default localhost:5000). Adjust BASE if needed.
*/
const jwt = require('jsonwebtoken');
const fetch = globalThis.fetch;
require('dotenv').config({ path: './backend/.env' });

const BASE = process.env.TEST_API_URL || `http://localhost:${process.env.PORT||5000}/api`;

async function run() {
  try {
    console.log('Registering vendor account...');
    const vendor = { name: 'Test Vendor', email: 'testvendor+flow@example.com', password: 'Password123!', role: 'vendor' };
    const regRes = await fetch(`${BASE}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(vendor) });
    const reg = await regRes.json();
    console.log('Register response:', reg);

    // Create an admin token (no need for admin user in DB for auth middleware)
    const adminPayload = { user: { id: '000000000000000000000000', role: 'admin' } };
    const token = jwt.sign(adminPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log('\nListing vendors via admin API...');
    const vRes = await fetch(`${BASE}/admin/vendors`, { headers: { Authorization: `Bearer ${token}` } });
    const vList = await vRes.json();
    console.log('Vendors count:', vList.length);
    const created = vList.find(v => v.email === vendor.email);
    if (!created) {
      console.error('Vendor not found in admin list. Flow failed.');
      return process.exit(1);
    }
    console.log('Found vendor:', created._id, 'isApproved:', created.isApproved);

    console.log('\nApproving vendor via admin API...');
    const approveRes = await fetch(`${BASE}/admin/vendors/${created._id}/approve`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } });
    const approve = await approveRes.json();
    console.log('Approve response isApproved=', approve.isApproved);

    console.log('\nAttempting vendor login...');
    const loginRes = await fetch(`${BASE}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: vendor.email, password: vendor.password }) });
    const login = await loginRes.json();
    console.log('Login token received:', !!login.token);

    console.log('\nVendor flow test completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error in flow test:', err.response ? err.response.data : err.message);
    process.exit(1);
  }
}

run();

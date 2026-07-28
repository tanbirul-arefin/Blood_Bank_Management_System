import { useState } from 'react';

const donorData = [
  {
    id: 1,
    name: 'Nadia Rahman',
    blood: 'A+',
    district: 'Dhaka',
    city: 'Mohammadpur',
    mobile: '+8801712345678',
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    comment: 'Willing to donate this week. Available in morning.'
  },
  {
    id: 2,
    name: 'Sajid Hossain',
    blood: 'A+',
    district: 'Dhaka',
    city: 'Uttara',
    mobile: '+8801812345678',
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    comment: 'Healthy and ready for emergency donation.'
  },
  {
    id: 3,
    name: 'Mim Akter',
    blood: 'O+',
    district: 'Chittagong',
    city: 'GEC Circle',
    mobile: '+8801512345678',
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    comment: 'Can donate anytime this month.'
  },
  {
    id: 4,
    name: 'Rafiq Islam',
    blood: 'A+',
    district: 'Chittagong',
    city: 'Agrabad',
    mobile: '+8801612345678',
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    comment: 'Available for urgent cases.'
  },
  {
    id: 5,
    name: 'Farhana Ali',
    blood: 'B+',
    district: 'Sylhet',
    city: 'Zindabazar',
    mobile: '+8801912345678',
    status: 'Ready',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    comment: 'Can donate after medical checkup.'
  },
];

const requestData = [
  { id: 101, patient: 'Amina Begum', blood: 'AB-', hospital: 'Square Hospital', priority: 'High' },
  { id: 102, patient: 'Rahim Uddin', blood: 'O+', hospital: 'Apollo Hospital', priority: 'Medium' },
];

const stockData = [
  { group: 'A+', units: 50, status: 'Healthy', availableDonors: 50 },
  { group: 'A-', units: 12, status: 'Low', availableDonors: 12 },
  { group: 'B+', units: 28, status: 'Healthy', availableDonors: 28 },
  { group: 'B-', units: 9, status: 'Critical', availableDonors: 9 },
  { group: 'AB+', units: 15, status: 'Moderate', availableDonors: 15 },
  { group: 'AB-', units: 7, status: 'Critical', availableDonors: 7 },
  { group: 'O+', units: 41, status: 'Healthy', availableDonors: 41 },
  { group: 'O-', units: 6, status: 'Critical', availableDonors: 6 },
];

const districtDonorData = [
  { district: 'Dhaka', donors: 28 },
  { district: 'Chittagong', donors: 19 },
  { district: 'Khulna', donors: 14 },
  { district: 'Rajshahi', donors: 11 },
  { district: 'Sylhet', donors: 16 },
  { district: 'Rangpur', donors: 10 },
  { district: 'Barisal', donors: 8 },
  { district: 'Cumilla', donors: 12 },
];

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('A+');
  const [selectedDistrict, setSelectedDistrict] = useState('Dhaka');

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      setLoggedIn(true);
      setMessage('Welcome back! Your blood bank dashboard is ready.');
    } else {
      setMessage('Please enter your email and password.');
    }
  };

  const activeStock = stockData.find((item) => item.group === selectedGroup) || stockData[0];
  const districtDonors = donorData.filter(
    (donor) => donor.district === selectedDistrict && donor.blood === selectedGroup
  );

  return (
    <div className="page-shell">
      {!loggedIn ? (
        <section className="login-wrapper">
          <div className="hero-card">
            <p className="eyebrow">LifeLink Blood Bank</p>
            <h1>Save lives with fast coordination and transparent donor management.</h1>
            <p>
              Monitor blood inventory, connect donors, and prioritize urgent requests from one beautiful dashboard.
            </p>
            <ul>
              <li>Real-time blood stock tracking</li>
              <li>Donor and request management</li>
              <li>Instant emergency coordination</li>
            </ul>
          </div>

          <form className="login-card" onSubmit={handleLogin}>
            <h2>Staff Login</h2>
            <p>Access the blood bank control center</p>
            <label>
              Email
              <input
                type="email"
                placeholder="admin@lifelink.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label>
              Password
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <button type="submit">Login</button>
            {message ? <small>{message}</small> : null}
          </form>
        </section>
      ) : (
        <main className="dashboard">
          <header className="topbar">
            <div>
              <p className="eyebrow">Blood Bank Management</p>
              <h2>Welcome, Admin</h2>
            </div>
            <button className="ghost-btn" onClick={() => setLoggedIn(false)}>
              Logout
            </button>
          </header>

          <section className="stats-grid">
            <article className="stat-card">
              <h3>Blood Units</h3>
              <strong>182</strong>
              <span>Available in stock</span>
            </article>
            <article className="stat-card">
              <h3>Donors</h3>
              <strong>94</strong>
              <span>Active contributors</span>
            </article>
            <article className="stat-card">
              <h3>Urgent Requests</h3>
              <strong>7</strong>
              <span>Need immediate action</span>
            </article>
          </section>

          <section className="stock-section">
            <div className="panel">
              <div className="panel-header">
                <h3>Blood Stock by Group</h3>
                <button>Update</button>
              </div>

              <div className="district-overview">
                <h4>Select District</h4>
                <div className="district-grid">
                  {districtDonorData.map((item) => (
                    <button
                      type="button"
                      className={`district-card ${selectedDistrict === item.district ? 'active' : ''}`}
                      key={item.district}
                      onClick={() => setSelectedDistrict(item.district)}
                    >
                      <strong>{item.district}</strong>
                      <p>{item.donors} donors</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="stock-grid">
                {bloodGroups.map((group) => (
                  <button
                    type="button"
                    className={`stock-card ${selectedGroup === group ? 'active' : ''}`}
                    key={group}
                    onClick={() => setSelectedGroup(group)}
                  >
                    <span className="stock-badge">{group}</span>
                    <strong>{stockData.find((item) => item.group === group)?.units || 0} units</strong>
                    <p>{stockData.find((item) => item.group === group)?.status || 'N/A'}</p>
                  </button>
                ))}
              </div>

              <div className="selection-panel">
                <h4>{selectedDistrict} • {selectedGroup}</h4>
                <p>{districtDonors.length} donor(s) found in {selectedDistrict} for {selectedGroup}.</p>
              </div>
            </div>
          </section>

          <section className="content-grid">
            <div className="panel">
              <div className="panel-header">
                <h3>Donors in {selectedDistrict}</h3>
                <button>Add Donor</button>
              </div>
              <div className="donor-list">
                {districtDonors.length > 0 ? (
                  districtDonors.map((donor) => (
                    <article className="donor-card" key={donor.id}>
                      <img src={donor.image} alt={donor.name} />
                      <div className="donor-info">
                        <h4>{donor.name}</h4>
                        <p><strong>Blood:</strong> {donor.blood}</p>
                        <p><strong>Location:</strong> {donor.city}, {donor.district}</p>
                        <p><strong>Mobile:</strong> {donor.mobile}</p>
                        <p><strong>Status:</strong> {donor.status}</p>
                        <p className="comment-box">{donor.comment}</p>
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="empty-state">No donors found for this district and blood group.</p>
                )}
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <h3>Pending Requests</h3>
                <button>View All</button>
              </div>
              <ul className="request-list">
                {requestData.map((request) => (
                  <li key={request.id}>
                    <div>
                      <strong>{request.patient}</strong>
                      <p>{request.hospital}</p>
                    </div>
                    <span>{request.blood}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </main>
      )}
    </div>
  );
}

export default App;

import { useState } from 'react';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const districtOptions = [
  'Dhaka',
  'Faridpur',
  'Gazipur',
  'Gopalganj',
  'Jamalpur',
  'Kishoreganj',
  'Madaripur',
  'Manikganj',
  'Munshiganj',
  'Narayanganj',
  'Narsingdi',
  'Rajbari',
  'Shariatpur',
  'Tangail',
  'Bogura',
  'Joypurhat',
  'Naogaon',
  'Natore',
  'Pabna',
  'Rajshahi',
  'Sirajganj',
  'Dinajpur',
  'Gaibandha',
  'Kurigram',
  'Lalmonirhat',
  'Nilphamari',
  'Panchagarh',
  'Rangpur',
  'Thakurgaon',
  'Habiganj',
  'Moulvibazar',
  'Sunamganj',
  'Sylhet',
  'Brahmanbaria',
  'Chandpur',
  'Chittagong',
  'Cumilla',
  "Cox's Bazar",
  'Feni',
  'Khagrachhari',
  'Lakshmipur',
  'Noakhali',
  'Rangamati',
  'Bandarban',
  'Bhola',
  'Jhalokathi',
  'Patuakhali',
  'Pirojpur',
  'Barisal',
  'Barguna',
  'Jashore',
  'Jhenaidah',
  'Khulna',
  'Kushtia',
  'Magura',
  'Meherpur',
  'Narail',
  'Satkhira',
  'Chuadanga',
  'Bagerhat',
  'Mymensingh',
  'Netrokona',
  'Sherpur',
];

const districtInventory = Object.fromEntries(
  districtOptions.map((district, index) => {
    if (district === 'Dhaka') {
      return [district, { 'A+': 24, 'A-': 10, 'B+': 18, 'B-': 7, 'AB+': 12, 'AB-': 6, 'O+': 24, 'O-': 9 }];
    }

    const base = [20, 8, 24, 7, 12, 5, 28, 6];
    const boost = district === 'Sylhet' ? 10 : district === 'Joypurhat' ? 8 : 0;

    const availability = {};
    bloodGroups.forEach((group, groupIndex) => {
      const value = base[groupIndex] + (index % 5) * 2 + boost + (group.includes('-') ? 1 : 0);
      availability[group] = Math.max(3, value);
    });

    return [district, availability];
  })
);

const donorProfiles = [
  { id: 1, name: 'Nadia Rahman', blood: 'A+', district: 'Sylhet', city: 'Zindabazar', address: 'House 12, Road 3, Zindabazar', mobile: '+8801712345678', status: 'Available', availableTime: 'Morning 8 AM - 12 PM', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80' },
  { id: 2, name: 'Sajid Hossain', blood: 'A+', district: 'Sylhet', city: 'Tilagor', address: 'Flat 4B, Tilagor Housing', mobile: '+8801812345678', status: 'Ready', availableTime: 'Evening 6 PM - 9 PM', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
  { id: 3, name: 'Farhana Ali', blood: 'B+', district: 'Sylhet', city: 'Amberkhana', address: 'Road 5, Amberkhana', mobile: '+8801912345678', status: 'Active', availableTime: 'Any time this week', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80' },
  { id: 4, name: 'Rafiq Islam', blood: 'O+', district: 'Dhaka', city: 'Mohammadpur', address: 'House 4, Block C, Mohammadpur', mobile: '+8801612345678', status: 'Available', availableTime: 'Afternoon 2 PM - 5 PM', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
  { id: 17, name: 'Arman Hossain', blood: 'A+', district: 'Dhaka', city: 'Dhanmondi', address: 'House 22, Road 5, Dhanmondi', mobile: '+8801712348899', status: 'Ready', availableTime: 'Morning 9 AM - 12 PM', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
  { id: 18, name: 'Nabila Chowdhury', blood: 'A+', district: 'Dhaka', city: 'Uttara', address: 'Sector 7, Uttara', mobile: '+8801912347788', status: 'Available', availableTime: 'Evening 6 PM - 8 PM', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80' },
  { id: 5, name: 'Mim Akter', blood: 'O+', district: 'Chittagong', city: 'GEC', address: 'GEC Circle, Chittagong', mobile: '+8801512345678', status: 'Available', availableTime: 'Morning 9 AM - 1 PM', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80' },
  { id: 6, name: 'Tamim Rahman', blood: 'B+', district: 'Joypurhat', city: 'Sadar', address: 'Sadar Road, Joypurhat', mobile: '+8801712341234', status: 'Ready', availableTime: 'Evening after 6 PM', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
  { id: 7, name: 'Shila Das', blood: 'A+', district: 'Joypurhat', city: 'Pouroshova', address: 'Pouroshova, Joypurhat', mobile: '+8801812341234', status: 'Available', availableTime: 'Morning only', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80' },
  { id: 8, name: 'Arif Hossain', blood: 'O-', district: 'Rangpur', city: 'City Gate', address: 'City Gate, Rangpur', mobile: '+8801712349999', status: 'Available', availableTime: 'Any time', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
  { id: 9, name: 'Sadia Noor', blood: 'AB+', district: 'Rangpur', city: 'Lalbagh', address: 'Lalbagh, Rangpur', mobile: '+8801912341244', status: 'Ready', availableTime: 'Sunday morning', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80' },
  { id: 10, name: 'Rahim Uddin', blood: 'B-', district: 'Khulna', city: 'Khalishpur', address: 'House 11, Khalishpur', mobile: '+8801312341111', status: 'Available', availableTime: 'Night 8 PM - 10 PM', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
  { id: 11, name: 'Mariya Begum', blood: 'A-', district: 'Barisal', city: 'Nawabpura', address: 'Nawabpura, Barisal', mobile: '+8801711112222', status: 'Ready', availableTime: 'Sunday afternoon', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80' },
  { id: 12, name: 'Anik Chowdhury', blood: 'O+', district: 'Cumilla', city: 'Town Hall', address: 'Town Hall Road, Cumilla', mobile: '+8801911113333', status: 'Available', availableTime: 'Morning 10 AM - 2 PM', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
  { id: 13, name: 'Liza Haque', blood: 'B+', district: 'Mymensingh', city: 'Kachari', address: 'Kachari Road, Mymensingh', mobile: '+8801811114444', status: 'Available', availableTime: 'Today 3 PM - 6 PM', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80' },
  { id: 14, name: 'Rony Islam', blood: 'AB-', district: 'Dhaka', city: 'Uttara', address: 'Uttara Sector 10', mobile: '+8801511115555', status: 'Ready', availableTime: 'Weekend', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
  { id: 15, name: 'Nusrat Jahan', blood: 'A+', district: 'Chittagong', city: 'Agrabad', address: 'Agrabad, Chittagong', mobile: '+8801711116666', status: 'Available', availableTime: 'Any time', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80' },
  { id: 16, name: 'Ayon Sarker', blood: 'O+', district: 'Sylhet', city: 'Shahjalal Upashahar', address: 'Shahjalal Upashahar, Sylhet', mobile: '+8801911117777', status: 'Ready', availableTime: 'Evening', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
];

const requestData = [
  { id: 101, name: 'Rina Akter', district: 'Mymensingh', blood: 'O+', hospital: 'Mymensingh Medical College', contact: '+8801710001001' },
  { id: 102, name: 'Hamidul Islam', district: 'Mymensingh', blood: 'A+', hospital: 'Sadar Hospital', contact: '+8801710001002' },
  { id: 103, name: 'Sabbir Rahman', district: 'Sylhet', blood: 'B+', hospital: 'Osmani Medical College', contact: '+8801710001003' },
  { id: 104, name: 'Tania Begum', district: 'Joypurhat', blood: 'AB+', hospital: 'Joypurhat General Hospital', contact: '+8801710001004' },
  { id: 105, name: 'Faruk Hossain', district: 'Dhaka', blood: 'A-', hospital: 'Square Hospital', contact: '+8801710001005' },
];

function App() {
  const [selectedDistrict, setSelectedDistrict] = useState('Dhaka');
  const [selectedGroup, setSelectedGroup] = useState('A+');
  const [pinnedDonors, setPinnedDonors] = useState([17]);
  const [activeChat, setActiveChat] = useState(null);
  const [chatMessage, setChatMessage] = useState('Hi, I need urgent support. Can you help?');

  const inventoryForDistrict = districtInventory[selectedDistrict];
  const districtDonors = donorProfiles.filter((donor) => donor.district === selectedDistrict);
  const groupDonors = donorProfiles.filter(
    (donor) => donor.district === selectedDistrict && donor.blood === selectedGroup
  );
  const districtRequests = requestData.filter((request) => request.district === selectedDistrict).slice(0, 3);
  const totalUnits = Object.values(inventoryForDistrict).reduce((sum, value) => sum + value, 0);

  const togglePin = (donorId) => {
    setPinnedDonors((current) =>
      current.includes(donorId) ? current.filter((item) => item !== donorId) : [...current, donorId]
    );
  };

  const pinnedList = donorProfiles.filter((donor) => pinnedDonors.includes(donor.id));
  const activeDonorInfo =
    (activeChat && activeChat.district === selectedDistrict && activeChat.blood === selectedGroup)
      ? activeChat
      : groupDonors[0] || null;

  return (
    <div className="page-shell">
      <main className="dashboard">
        <header className="hero-panel">
          <div>
            <p className="eyebrow">Blood Donation Network</p>
            <h1>Select a district and find blood donors in a few clicks.</h1>
            <p>
              Choose a district, see available units, review matching donors, and contact them quickly.
            </p>
          </div>
          <div className="hero-summary">
            <div>
              <strong>{districtOptions.length}</strong>
              <span>Districts</span>
            </div>
            <div>
              <strong>{donorProfiles.length}</strong>
              <span>Donor Profiles</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>Emergency Support</span>
            </div>
          </div>
        </header>

        <section className="section-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Step 1</p>
              <h2>Select District</h2>
            </div>
            <p>Click any district to view its blood units and donor availability.</p>
          </div>

          <div className="district-grid">
            {districtOptions.map((district) => (
              <button
                type="button"
                key={district}
                className={`district-card ${selectedDistrict === district ? 'active' : ''}`}
                onClick={() => {
                  setSelectedDistrict(district);
                  setSelectedGroup('A+');
                  setActiveChat(null);
                }}
              >
                <strong>{district}</strong>
                <span>{districtInventory[district]['A+']} A+ units</span>
              </button>
            ))}
          </div>
        </section>

        <section className="stats-grid">
          <article className="stat-card">
            <h3>Blood Donation Units</h3>
            <strong>{totalUnits}</strong>
            <span>{selectedDistrict} has active units</span>
          </article>
          <article className="stat-card">
            <h3>Available Donors</h3>
            <strong>{districtDonors.length}</strong>
            <span>registered in this district</span>
          </article>
          <article className="stat-card">
            <h3>Urgent Requests</h3>
            <strong>{districtRequests.length}</strong>
            <span>recent requests</span>
          </article>
        </section>

        <section className="section-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Step 2</p>
              <h2>Available Blood Units in {selectedDistrict}</h2>
            </div>
            <p>All blood groups for this district are shown below, and each one can be opened to view donors.</p>
          </div>

          <div className="inventory-list">
            {bloodGroups.map((group) => {
              const units = inventoryForDistrict[group];
              const donors = districtDonors.filter((donor) => donor.blood === group).length;

              return (
                <button
                  type="button"
                  key={group}
                  className={`inventory-row ${selectedGroup === group ? 'active' : ''}`}
                  onClick={() => setSelectedGroup(group)}
                >
                  <div>
                    <strong>{group}</strong>
                    <span>{units} units available</span>
                  </div>
                  <div>
                    <strong>{donors}</strong>
                    <span>donors</span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="section-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Requests</p>
              <h2>Recent Requests in {selectedDistrict}</h2>
            </div>
            <p>These are current requests linked to this district.</p>
          </div>

          <div className="request-list">
            {districtRequests.length > 0 ? (
              districtRequests.map((request) => (
                <article className="request-card" key={request.id}>
                  <div>
                    <h3>{request.name}</h3>
                    <p><strong>Blood:</strong> {request.blood}</p>
                    <p><strong>Hospital:</strong> {request.hospital}</p>
                  </div>
                  <span>{request.contact}</span>
                </article>
              ))
            ) : (
              <p className="empty-state">No recent requests for this district.</p>
            )}
          </div>
        </section>

        <section className="content-grid">
          <div className="section-card donor-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Step 3</p>
                <h2>Donors for {selectedGroup}</h2>
              </div>
              <p>Each donor below includes their name, number, address, and availability time.</p>
            </div>

            {pinnedList.length > 0 ? (
              <div className="pinned-box">
                <h3>Pinned Donors</h3>
                <div className="pinned-list">
                  {pinnedList.map((donor) => (
                    <div key={donor.id} className="pinned-item">
                      <span>{donor.name}</span>
                      <button type="button" onClick={() => setActiveChat(donor)}>
                        Chat
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="donor-list">
              {groupDonors.length > 0 ? (
                groupDonors.map((donor) => {
                  const isPinned = pinnedDonors.includes(donor.id);

                  return (
                    <article className="donor-card" key={donor.id}>
                      <img src={donor.image} alt={donor.name} />
                      <div className="donor-info">
                        <div className="donor-topline">
                          <h3>{donor.name}</h3>
                          <span className="status-pill">{donor.status}</span>
                        </div>
                        <p><strong>Blood:</strong> {donor.blood}</p>
                        <p><strong>Area:</strong> {donor.city}, {donor.district}</p>
                        <p><strong>Address:</strong> {donor.address}</p>
                        <p><strong>Phone:</strong> {donor.mobile}</p>
                        <p><strong>Available Time:</strong> {donor.availableTime}</p>
                        <div className="action-row">
                          <button type="button" className="ghost-btn" onClick={() => togglePin(donor.id)}>
                            {isPinned ? 'Unpin' : 'Pin'}
                          </button>
                          <button type="button" className="primary-btn" onClick={() => setActiveChat(donor)}>
                            Chat
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })
              ) : (
                <p className="empty-state">No donors found for this district and blood group yet.</p>
              )}
            </div>
          </div>

          <aside className="section-card sidebar-card">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Quick Contact</p>
                <h2>Open Chat</h2>
              </div>
            </div>

            {activeDonorInfo ? (
              <div className="chat-box">
                <img src={activeDonorInfo.image} alt={activeDonorInfo.name} className="chat-avatar" />
                <h3>{activeDonorInfo.name}</h3>
                <p><strong>Blood Group:</strong> {activeDonorInfo.blood}</p>
                <p><strong>Phone:</strong> {activeDonorInfo.mobile}</p>
                <p><strong>Address:</strong> {activeDonorInfo.address}</p>
                <p><strong>Available Time:</strong> {activeDonorInfo.availableTime}</p>
                <label className="chat-label" htmlFor="messageBox">Message</label>
                <textarea
                  id="messageBox"
                  className="chat-textarea"
                  value={chatMessage}
                  onChange={(event) => setChatMessage(event.target.value)}
                />
                <button type="button" className="primary-btn" onClick={() => setActiveChat(activeDonorInfo)}>
                  Send Request
                </button>
                <button type="button" className="ghost-btn" onClick={() => setActiveChat(null)}>
                  Close
                </button>
              </div>
            ) : (
              <div className="chat-box">
                <p>Select a donor and press Chat to open their contact details and message panel.</p>
              </div>
            )}

            <div className="sidebar-note">
              <h3>How it works</h3>
              <ul>
                <li>Choose a district</li>
                <li>Select a blood group</li>
                <li>Review donor details</li>
                <li>Pin and contact quickly</li>
              </ul>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default App;

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
    const base = [20, 8, 24, 7, 12, 5, 28, 6];
    const boost = district === 'Sylhet' ? 10 : district === 'Joypurhat' ? 8 : district === 'Dhaka' ? 12 : 0;

    const availability = {};
    bloodGroups.forEach((group, groupIndex) => {
      const value = base[groupIndex] + (index % 5) * 2 + boost + (group.includes('-') ? 1 : 0);
      availability[group] = Math.max(3, value);
    });

    return [district, availability];
  })
);

const donorProfiles = [
  { id: 1, name: 'Nadia Rahman', blood: 'A+', district: 'Sylhet', city: 'Zindabazar', mobile: '+8801712345678', status: 'Available', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80' },
  { id: 2, name: 'Sajid Hossain', blood: 'A+', district: 'Sylhet', city: 'Tilagor', mobile: '+8801812345678', status: 'Ready', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
  { id: 3, name: 'Farhana Ali', blood: 'B+', district: 'Sylhet', city: 'Amberkhana', mobile: '+8801912345678', status: 'Active', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80' },
  { id: 4, name: 'Rafiq Islam', blood: 'O+', district: 'Dhaka', city: 'Mohammadpur', mobile: '+8801612345678', status: 'Available', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
  { id: 5, name: 'Mim Akter', blood: 'O+', district: 'Chittagong', city: 'GEC', mobile: '+8801512345678', status: 'Available', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80' },
  { id: 6, name: 'Tamim Rahman', blood: 'B+', district: 'Joypurhat', city: 'Sadar', mobile: '+8801712341234', status: 'Ready', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
  { id: 7, name: 'Shila Das', blood: 'A+', district: 'Joypurhat', city: 'Pouroshova', mobile: '+8801812341234', status: 'Available', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80' },
  { id: 8, name: 'Arif Hossain', blood: 'O-', district: 'Rangpur', city: 'City Gate', mobile: '+8801712349999', status: 'Available', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
  { id: 9, name: 'Sadia Noor', blood: 'AB+', district: 'Rangpur', city: 'Lalbagh', mobile: '+8801912341244', status: 'Ready', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80' },
  { id: 10, name: 'Rahim Uddin', blood: 'B-', district: 'Khulna', city: 'Khalishpur', mobile: '+8801312341111', status: 'Available', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
  { id: 11, name: 'Mariya Begum', blood: 'A-', district: 'Barisal', city: 'Nawabpura', mobile: '+8801711112222', status: 'Ready', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80' },
  { id: 12, name: 'Anik Chowdhury', blood: 'O+', district: 'Cumilla', city: 'Town Hall', mobile: '+8801911113333', status: 'Available', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
  { id: 13, name: 'Liza Haque', blood: 'B+', district: 'Mymensingh', city: 'Kachari', mobile: '+8801811114444', status: 'Available', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80' },
  { id: 14, name: 'Rony Islam', blood: 'AB-', district: 'Dhaka', city: 'Uttara', mobile: '+8801511115555', status: 'Ready', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
  { id: 15, name: 'Nusrat Jahan', blood: 'A+', district: 'Chittagong', city: 'Agrabad', mobile: '+8801711116666', status: 'Available', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80' },
  { id: 16, name: 'Ayon Sarker', blood: 'O+', district: 'Sylhet', city: 'Shahjalal Upashahar', mobile: '+8801911117777', status: 'Ready', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
];

function App() {
  const [selectedDistrict, setSelectedDistrict] = useState('Sylhet');
  const [selectedGroup, setSelectedGroup] = useState('A+');
  const [pinnedDonors, setPinnedDonors] = useState([1, 3]);
  const [activeChat, setActiveChat] = useState(null);

  const inventoryForDistrict = districtInventory[selectedDistrict];
  const districtDonors = donorProfiles.filter((donor) => donor.district === selectedDistrict);
  const groupDonors = donorProfiles.filter(
    (donor) => donor.district === selectedDistrict && donor.blood === selectedGroup
  );
  const totalUnits = Object.values(inventoryForDistrict).reduce((sum, value) => sum + value, 0);

  const togglePin = (donorId) => {
    setPinnedDonors((current) =>
      current.includes(donorId) ? current.filter((item) => item !== donorId) : [...current, donorId]
    );
  };

  const pinnedList = donorProfiles.filter((donor) => pinnedDonors.includes(donor.id));

  return (
    <div className="page-shell">
      <main className="dashboard">
        <header className="hero-panel">
          <div>
            <p className="eyebrow">Blood Donation Network</p>
            <h1>Select a district and find blood donors in a few clicks.</h1>
            <p>
              Choose a district, review available blood groups, and contact nearby donors with an easy pin-and-chat workflow.
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
            <p>Click any district to see blood availability and donor reach.</p>
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
            <span>available in {selectedDistrict}</span>
          </article>
          <article className="stat-card">
            <h3>Donors</h3>
            <strong>{districtDonors.length}</strong>
            <span>registered in this district</span>
          </article>
          <article className="stat-card">
            <h3>Urgent Requests</h3>
            <strong>7</strong>
            <span>priority needs</span>
          </article>
        </section>

        <section className="section-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Step 2</p>
              <h2>Available Blood Groups</h2>
            </div>
            <p>{selectedDistrict} currently has multiple blood groups ready for pickup.</p>
          </div>

          <div className="blood-group-grid">
            {bloodGroups.map((group) => {
              const units = inventoryForDistrict[group];
              const donors = districtDonors.filter((donor) => donor.blood === group).length;

              return (
                <button
                  type="button"
                  key={group}
                  className={`group-card ${selectedGroup === group ? 'active' : ''}`}
                  onClick={() => setSelectedGroup(group)}
                >
                  <span className="group-badge">{group}</span>
                  <strong>{units} units</strong>
                  <small>{donors} donors</small>
                </button>
              );
            })}
          </div>
        </section>

        <section className="content-grid">
          <div className="section-card donor-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Step 3</p>
                <h2>Donors for {selectedGroup}</h2>
              </div>
              <p>Pin the most helpful donors and chat with them instantly.</p>
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
                        <p><strong>Phone:</strong> {donor.mobile}</p>
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

            {activeChat ? (
              <div className="chat-box">
                <h3>{activeChat.name}</h3>
                <p>{activeChat.mobile}</p>
                <p>Chat is ready for this donor. You can pin them for faster follow-up.</p>
                <button type="button" className="primary-btn" onClick={() => setActiveChat(null)}>
                  Close Chat
                </button>
              </div>
            ) : (
              <div className="chat-box">
                <p>Select a donor and press Chat to start a contact window.</p>
              </div>
            )}

            <div className="sidebar-note">
              <h3>How it works</h3>
              <ul>
                <li>Choose a district</li>
                <li>Select a blood group</li>
                <li>Pin trusted donors</li>
                <li>Start contact quickly</li>
              </ul>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default App;

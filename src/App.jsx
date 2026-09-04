import { useEffect, useMemo, useState } from 'react';

const bloodGroups = ['সব গ্রুপ', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const districts = ['ঢাকা', 'চট্টগ্রাম', 'সিলেট', 'রাজশাহী', 'খুলনা', 'ময়মনসিংহ', 'রংপুর', 'বরিশাল', 'কুমিল্লা', 'জয়পুরহাট'];
const districtEnglish = { 'ঢাকা': 'Dhaka', 'চট্টগ্রাম': 'Chittagong', 'সিলেট': 'Sylhet', 'রাজশাহী': 'Rajshahi', 'খুলনা': 'Khulna', 'ময়মনসিংহ': 'Mymensingh', 'রংপুর': 'Rangpur', 'বরিশাল': 'Barisal', 'কুমিল্লা': 'Cumilla', 'জয়পুরহাট': 'Joypurhat' };
const districtAliases = { dhaka: 'ঢাকা', chittagong: 'চট্টগ্রাম', chattogram: 'চট্টগ্রাম', sylhet: 'সিলেট', rajshahi: 'রাজশাহী', khulna: 'খুলনা', mymensingh: 'ময়মনসিংহ', rangpur: 'রংপুর', barisal: 'বরিশাল', barishal: 'বরিশাল', cumilla: 'কুমিল্লা', comilla: 'কুমিল্লা', joypurhat: 'জয়পুরহাট' };
const stockData = { 'A+': 8, 'A-': 3, 'B+': 6, 'B-': 2, 'AB+': 4, 'AB-': 1, 'O+': 10, 'O-': 2 };
const getDonationHistory = (donor) => [...new Set([...(donor.donationHistory || []), donor.lastDonation].filter(Boolean))].sort((first, second) => second.localeCompare(first));
const formatDonationDate = (date) => date ? new Intl.DateTimeFormat('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${date}T00:00:00`)) : 'এখনও রক্ত দেননি';
const starterDonors = [
  { id: 1, name: 'Nadia Rahman', nameBn: 'নাদিয়া রহমান', blood: 'A+', district: 'সিলেট', area: 'Zindabazar', areaBn: 'জিন্দাবাজার', phone: '01712-345678', availability: 'সকাল ৮টা - দুপুর ১২টা', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80', note: 'জরুরি প্রয়োজনে পাশে আছি।', rating: 5, reviews: 18, verified: true, password: '1234', lastDonation: '2025-11-18', donationHistory: ['2025-11-18', '2025-07-10', '2025-03-02'] },
  { id: 2, name: 'Sajid Hossain', nameBn: 'সাজিদ হোসেন', blood: 'A+', district: 'ঢাকা', area: 'Dhanmondi', areaBn: 'ধানমন্ডি', phone: '01812-345678', availability: 'সন্ধ্যা ৬টা - রাত ৯টা', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80', note: 'রক্ত দিতে নিয়মিত প্রস্তুত আছি।', rating: 4.9, reviews: 12, verified: true, password: '1234', lastDonation: '2025-12-22', donationHistory: ['2025-12-22', '2025-08-15', '2025-04-05', '2024-12-20'] },
  { id: 3, name: 'Farhana Ali', nameBn: 'ফারহানা আলী', blood: 'B+', district: 'চট্টগ্রাম', area: 'GEC Circle', areaBn: 'জিইসি মোড়', phone: '01912-345678', availability: 'এই সপ্তাহে যেকোনো সময়', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80', note: 'প্রয়োজন হলে দ্রুত যোগাযোগ করুন।', rating: 5, reviews: 9, verified: true, password: '1234' },
  { id: 4, name: 'Arif Hossain', nameBn: 'আরিফ হোসেন', blood: 'O-', district: 'রংপুর', area: 'City Gate', areaBn: 'সিটি গেট', phone: '01612-345678', availability: 'যেকোনো সময়', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80', note: 'জরুরি donor হিসেবে যুক্ত আছি।', rating: 4.8, reviews: 21, verified: true, password: '1234' },
  { id: 5, name: 'Mim Akter', nameBn: 'মিম আক্তার', blood: 'O+', district: 'সিলেট', area: 'Amberkhana', areaBn: 'আম্বরখানা', phone: '01512-345678', availability: 'সকাল ৯টা - দুপুর ১টা', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80', note: 'রক্তের জন্য আমাকে জানাতে পারেন।', rating: 4.9, reviews: 15, verified: false, password: '1234' },
  { id: 6, name: 'Tamim Rahman', nameBn: 'তামিম রহমান', blood: 'B+', district: 'জয়পুরহাট', area: 'Sadar', areaBn: 'সদর', phone: '01711-241234', availability: 'সন্ধ্যা ৬টার পর', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80', note: 'সদা মানুষের পাশে আছি।', rating: 4.7, reviews: 7, verified: true, password: '1234' },
];

function App() {
  const [donors, setDonors] = useState(() => {
    const savedDonors = localStorage.getItem('donors');
    return savedDonors ? JSON.parse(savedDonors) : starterDonors;
  });
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  // Login form state
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [query, setQuery] = useState('');
  const [districtQuery, setDistrictQuery] = useState('');
  const [blood, setBlood] = useState('সব গ্রুপ');
  const [district, setDistrict] = useState('সব এলাকা');
  const [activeTab, setActiveTab] = useState('find');
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [editingDonor, setEditingDonor] = useState(null);
  const [notice, setNotice] = useState('');
  
  const [registration, setRegistration] = useState({ name: '', blood: 'A+', district: 'ঢাকা', area: '', phone: '', age: '', lastDonation: '', availability: 'যেকোনো সময়', status: 'Available', image: '', note: '', password: '' });
  const [request, setRequest] = useState({ name: '', patient: '', blood: 'A+', bags: 1, location: '', phone: '' });

  useEffect(() => {
    localStorage.setItem('donors', JSON.stringify(donors));
  }, [donors]);

  const filteredDonors = useMemo(() => donors.filter((donor) => {
    const districtText = `${donor.district} ${districtEnglish[donor.district] || ''}`.toLowerCase();
    const typedDistrict = districtAliases[districtQuery.trim().toLowerCase()] || districtQuery.trim().toLowerCase();
    const nameText = (donor.name || '').toLowerCase() + (donor.nameBn || '').toLowerCase();
    const areaText = (donor.area || '').toLowerCase() + (donor.areaBn || '').toLowerCase();
    const matchesQuery = nameText.includes(query.trim().toLowerCase()) || areaText.includes(query.trim().toLowerCase());
    return (blood === 'সব গ্রুপ' || donor.blood === blood) && districtText.includes(typedDistrict) && matchesQuery;
  }), [donors, districtQuery, blood, query]);

  const updateRegistration = (field, value) => {
    setRegistration((current) => ({ ...current, [field]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => updateRegistration('image', reader.result);
    reader.readAsDataURL(file);
  };

  const handleLogin = (event) => {
    event.preventDefault();
    const cleanLoginPhone = loginPhone.replace(/\D/g, '');
    const user = donors.find((d) => d.phone.replace(/\D/g, '') === cleanLoginPhone && d.password === loginPassword);
    
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      setLoginError('');
      setLoginPhone('');
      setLoginPassword('');
      setActiveTab('find');
    } else {
      setLoginError('মোবাইল নম্বর বা পাসওয়ার্ড ভুল হয়েছে।');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setActiveTab('find');
  };

  const handleRegistration = (event) => {
    event.preventDefault();
    const newId = donors.length ? Math.max(...donors.map((d) => d.id)) + 1 : 1;
    const newDonor = {
      ...registration,
      id: newId,
      rating: 5.0,
      reviews: 1,
      verified: false,
      donationHistory: registration.lastDonation ? [registration.lastDonation] : [],
      nameBn: registration.name,
      areaBn: registration.area
    };
    
    setDonors((current) => [...current, newDonor]);
    
    // Auto login if not already logged in
    if (!currentUser) {
      setCurrentUser(newDonor);
      localStorage.setItem('currentUser', JSON.stringify(newDonor));
      setNotice('আপনার donor profile সফলভাবে তৈরি হয়েছে এবং আপনি লগ-ইন আছেন।');
    } else {
      setNotice('নতুন donor profile সফলভাবে যুক্ত হয়েছে।');
    }

    setActiveTab('find');
    setRegistration({ name: '', blood: 'A+', district: 'ঢাকা', area: '', phone: '', age: '', lastDonation: '', availability: 'যেকোনো সময়', status: 'Available', image: '', note: '', password: '' });
  };

  const handleRequest = (event) => {
    event.preventDefault();
    setNotice('আপনার জরুরি রক্তের অনুরোধটি সফলভাবে পাঠানো হয়েছে।');
    setActiveTab('find');
    setRequest({ name: '', patient: '', blood: 'A+', bags: 1, location: '', phone: '' });
  };

  const handleReview = (event) => {
    event.preventDefault();
    const rating = Number(new FormData(event.currentTarget).get('rating'));
    setDonors((current) => current.map((donor) => donor.id === selectedDonor.id ? { ...donor, rating: donor.reviews ? ((donor.rating * donor.reviews) + rating) / (donor.reviews + 1) : rating, reviews: donor.reviews + 1 } : donor));
    setSelectedDonor(null);
    setNotice('আপনার review যুক্ত হয়েছে। ধন্যবাদ।');
  };

  const handleSaveEdit = (updatedDonor) => {
    const donorWithHistory = { ...updatedDonor, donationHistory: getDonationHistory(updatedDonor) };
    setDonors((current) => current.map((donor) => donor.id === donorWithHistory.id ? donorWithHistory : donor));
    if (currentUser && currentUser.id === donorWithHistory.id) {
      setCurrentUser(donorWithHistory);
      localStorage.setItem('currentUser', JSON.stringify(donorWithHistory));
    }
    setEditingDonor(null);
    setNotice('আপনার প্রোফাইল তথ্য সফলভাবে আপডেট করা হয়েছে।');
  };

  const handleAddDonation = (donorId, donationDate) => {
    const donor = donors.find((item) => item.id === donorId);
    if (!donor) return;
    const donationHistory = getDonationHistory({ ...donor, donationHistory: [...(donor.donationHistory || []), donationDate] });
    const updatedDonor = { ...donor, donationHistory, lastDonation: donationHistory[0] };
    setDonors((current) => current.map((item) => item.id === donorId ? updatedDonor : item));
    setSelectedDonor((current) => current && current.id === donorId ? updatedDonor : current);

    if (currentUser && currentUser.id === donorId) {
      const donationHistory = getDonationHistory({ ...currentUser, donationHistory: [...(currentUser.donationHistory || []), donationDate] });
      const updatedUser = { ...currentUser, donationHistory, lastDonation: donationHistory[0] };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
    setNotice('আপনার রক্তদানের history-তে নতুন entry যুক্ত হয়েছে।');
  };

  const handleDelete = (id, reason) => {
    const donor = donors.find((d) => d.id === id);
    const name = donor ? (donor.nameBn || donor.name) : 'ডোনার';
    setDonors((current) => current.filter((d) => d.id !== id));
    setSelectedDonor(null);
    
    if (currentUser && currentUser.id === id) {
      handleLogout();
    }
    setNotice(`${name} এর ডোনার প্রোফাইল সফলভাবে ডিলিট করা হয়েছে। কারণ: ${reason}`);
  };

  if (!currentUser && activeTab !== 'register') {
    return (
      <div className="app-shell" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifycontent: 'space-between' }}>
        <header className="topbar">
          <a className="brand" href="#top">
            <span className="brand-mark">+</span>
            <span>রক্তবন্ধু<small>BloodBond Bangladesh</small></span>
          </a>
        </header>

        <main className="register-page" style={{ display: 'grid', gridTemplateColumns: '1fr', placeItems: 'center', padding: '40px 20px' }}>
          <form className="register-form" onSubmit={handleLogin} style={{ width: 'min(450px, 100%)', margin: '0 auto', boxShadow: '0 10px 30px rgba(32, 16, 12, 0.08)', borderRadius: '8px' }}>
            <div className="form-head" style={{ textAlign: 'center', marginBottom: '25px' }}>
              <span style={{ color: '#d94740', fontWeight: 'bold', fontSize: '0.9rem' }}>স্বাগতম</span>
              <h2 style={{ fontSize: '1.8rem', margin: '5px 0 0', color: '#3e3530' }}>রক্তবন্ধু একাউন্টে লগইন করুন</h2>
            </div>
            
            {loginError && (
              <div className="error-message" style={{ background: '#fdf2f2', border: '1px solid #f8b4b4', color: '#b91c1c', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '0.85rem', fontWeight: 'bold', textAlign: 'center' }}>
                {loginError}
              </div>
            )}
            {notice && (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '0.85rem', fontWeight: 'bold', textAlign: 'center' }}>
                {notice}
              </div>
            )}

            <label style={{ display: 'block', marginBottom: '15px' }}>মোবাইল নম্বর
              <input type="text" value={loginPhone} onChange={(e) => setLoginPhone(e.target.value)} required placeholder="যেমন: 01712345678" style={{ width: '100%', padding: '12px', border: '1px solid #e5dcd5', borderRadius: '6px', marginTop: '5px', outline: 'none', fontSize: '0.9rem', boxSizing: 'border-box' }} />
            </label>
            <label style={{ display: 'block', marginBottom: '25px' }}>পাসওয়ার্ড
              <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required placeholder="আপনার পাসওয়ার্ড লিখুন" style={{ width: '100%', padding: '12px', border: '1px solid #e5dcd5', borderRadius: '6px', marginTop: '5px', outline: 'none', fontSize: '0.9rem', boxSizing: 'border-box' }} />
            </label>
            
            <button className="primary-btn submit-btn" type="submit" style={{ width: '100%', padding: '14px', fontWeight: 'bold', fontSize: '1rem', borderRadius: '6px', border: 0, background: '#e34841', color: 'white', cursor: 'pointer' }}>লগইন করুন <span>→</span></button>
            
            <div style={{ textAlign: 'center', marginTop: '25px', fontSize: '0.85rem', color: '#766a62' }}>
              নতুন ডোনার? 
              <button type="button" onClick={() => { setNotice(''); setActiveTab('register'); }} style={{ color: '#e34841', fontWeight: 'bold', textDecoration: 'none', marginLeft: '5px', background: 'transparent', border: 0, cursor: 'pointer' }}>ডোনার হিসেবে রেজিস্ট্রেশন করুন</button>
            </div>
          </form>
        </main>
        
        <footer style={{ padding: '24px 20px', borderTop: '1px solid #eee5dd', display: 'flex', justifyContent: 'space-between', color: '#92877e', fontSize: '0.8rem' }}>
          <span className="brand"><span className="brand-mark">+</span> রক্তবন্ধু</span>
          <span>মানুষ মানুষের জন্য।</span>
          <span>© ২০২৪ BloodBond Bangladesh</span>
        </footer>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" onClick={() => setActiveTab('find')}>
          <span className="brand-mark">+</span>
          <span>রক্তবন্ধু<small>BloodBond Bangladesh</small></span>
        </a>
        <nav>
          <button className={activeTab === 'find' ? 'nav-active' : ''} onClick={() => setActiveTab('find')}>ডোনার খুঁজুন</button>
          <button className={activeTab === 'register' ? 'nav-active' : ''} onClick={() => setActiveTab('register')}>ডোনার হোন</button>
          <button className={activeTab === 'request' ? 'nav-active' : ''} onClick={() => setActiveTab('request')}>রক্তের অনুরোধ</button>
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {currentUser && (
            <>
              <span style={{ fontSize: '0.82rem', color: '#766a62', fontWeight: 'bold', background: '#fdf2f2', padding: '6px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }} onClick={() => { const fullUser = donors.find(d => d.id === currentUser.id); if (fullUser) setSelectedDonor(fullUser); }}>
                👤 {currentUser.name}
              </span>
              <button onClick={handleLogout} style={{ color: '#766a62', fontSize: '0.8rem', fontWeight: 'bold', padding: '6px 12px', border: '1px solid #eee5dd', borderRadius: '4px', background: 'transparent', cursor: 'pointer' }}>লগআউট</button>
            </>
          )}
          <button className="emergency-btn" onClick={() => { setNotice(''); setActiveTab('request'); }}>জরুরি সহায়তা <span>↗</span></button>
        </div>
      </header>
      
      {activeTab === 'find' ? <main id="top"><section className="hero"><div className="hero-content"><p className="overline">বাংলাদেশের trusted blood donor network</p><h1>আজ আপনার রক্তে<br /><em>বাঁচুক একটি জীবন।</em></h1><p className="hero-subtitle">আপনার কাছাকাছি verified donor খুঁজুন। রক্তের গ্রুপ, এলাকা এবং availability অনুযায়ী সহজেই যোগাযোগ করুন।</p><div className="hero-actions"><button className="primary-btn" onClick={() => document.getElementById('directory').scrollIntoView({ behavior: 'smooth' })}>ডোনার খুঁজুন <span>↓</span></button><button className="text-btn" onClick={() => setActiveTab('register')}>আমি donor হতে চাই <span>→</span></button></div></div><div className="hero-visual"><div className="blood-drop">+</div><div className="hero-stat"><strong>{donors.length + 1247}</strong><span>registered donors</span></div><div className="hero-note">“একটি ছোট্ট সাহায্য<br />কারও পুরো পৃথিবী।”</div></div></section><section className="trust-strip"><div><strong>২৪/৭</strong><span>জরুরি সাপোর্ট</span></div><div><strong>৬৪</strong><span>জেলায় donor</span></div><div><strong>১,২৫৩+</strong><span>সক্রিয় সদস্য</span></div><div><strong>১০০%</strong><span>মানবিক উদ্যোগ</span></div></section><section className="directory-section" id="directory"><div className="section-intro"><div><p className="overline">আপনার প্রয়োজনের মানুষটি</p><h2>Donor directory</h2></div><p>রক্তের গ্রুপ ও এলাকা বেছে নিয়ে<br />কাছাকাছি donor খুঁজে নিন।</p></div><div className="filter-bar"><div className="search-box"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="নাম বা এলাকার নাম লিখুন..." /></div><div className="search-box district-search"><span>⌖</span><input value={districtQuery} onChange={(event) => setDistrictQuery(event.target.value)} placeholder="জেলা লিখে search করুন..." /></div><select value={blood} onChange={(event) => setBlood(event.target.value)}>{bloodGroups.map((group) => <option key={group}>{group}</option>)}</select><select value={district} onChange={(event) => setDistrict(event.target.value)}><option>সব এলাকা</option>{districts.map((item) => <option key={item}>{item}</option>)}</select></div><div className="result-line"><span><strong>{filteredDonors.length}</strong> জন donor পাওয়া গেছে</span><span className="available-key"><i /> এখন available</span></div><div className="donor-grid">{filteredDonors.map((donor) => <DonorCard key={donor.id} donor={donor} onOpen={() => setSelectedDonor(donor)} />)}</div>{filteredDonors.length === 0 && <div className="empty">এই filter-এ কোনো donor পাওয়া যায়নি। অন্য এলাকা বা blood group চেষ্টা করুন।</div>}</section><section className="impact-section" id="how-it-works"><div><p className="overline">একসাথে আমরা পারি</p><h2>রক্তের সম্পর্ক<br /><em>মানবতার সম্পর্ক।</em></h2></div><div className="impact-copy"><p>রক্তবন্ধু এমন একটি community যেখানে donor ও receiver সরাসরি একে অপরের কাছে পৌঁছাতে পারে। আপনার এক ব্যাগ রক্ত কারও পরিবারের জন্য নতুন আশার শুরু হতে পারে।</p><button className="text-btn" onClick={() => setActiveTab('register')}>community-তে যোগ দিন <span>→</span></button></div></section></main> : activeTab === 'register' ? <RegisterForm registration={registration} updateRegistration={updateRegistration} onImageChange={handleImageChange} onSubmit={handleRegistration} onBack={() => { if (currentUser) { setActiveTab('find'); } else { setActiveTab('login'); } }} /> : activeTab === 'stock' ? <StockPanel onRequest={() => setActiveTab('request')} /> : <RequestForm request={request} updateRequest={(field, value) => setRequest((current) => ({ ...current, [field]: value }))} onSubmit={handleRequest} onBack={() => setActiveTab('find')} />}
      <footer><span className="brand"><span className="brand-mark">+</span> রক্তবন্ধু</span><span>মানুষ মানুষের জন্য।</span><span>© ২০২৪ BloodBond Bangladesh</span></footer>
      {notice && <button className="notice" onClick={() => setNotice('')}>{notice} <span>×</span></button>}
      {selectedDonor && (
        <DonorModal
          donor={selectedDonor}
          onClose={() => setSelectedDonor(null)}
          onReview={handleReview}
          onAddDonation={handleAddDonation}
          currentUser={currentUser}
          onEditClick={() => {
            setEditingDonor(selectedDonor);
            setSelectedDonor(null);
          }}
          onDeleteClick={(reason) => {
            handleDelete(selectedDonor.id, reason);
          }}
        />
      )}
      {editingDonor && (
        <EditProfileModal
          donor={editingDonor}
          onClose={() => setEditingDonor(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}

function DonorCard({ donor, onOpen }) {
  const eligible = (!donor.age || donor.age >= 18) && (!donor.lastDonation || (Date.now() - new Date(donor.lastDonation).getTime()) >= 90 * 24 * 60 * 60 * 1000);
  const status = donor.status || 'Available';
  return (
    <article className="donor-card">
      <div className="card-image-wrap">
        <img src={donor.image} alt={donor.name} />
        <span className={`online-dot ${status.toLowerCase()}`} />
      </div>
      <div className="card-body">
        <div className="card-heading">
          <div>
            <h3>{donor.name}</h3>
            <p>{donor.areaBn || donor.area}, {donor.district}</p>
          </div>
          <span className="blood-badge">{donor.blood}</span>
        </div>
        <p className="donor-note"><strong>{donor.blood} {donor.name}</strong> — {donor.note}</p>
        <div className="card-meta">
          <span className={status === 'Available' && eligible ? 'eligible-status' : 'ineligible-status'}>● {status === 'Available' && eligible ? 'এখন দিতে পারবেন' : status === 'Busy' ? 'এই মুহূর্তে ব্যস্ত' : 'এখন available নন'}</span>
          <span className="rating">★ {donor.rating ? donor.rating.toFixed(1) : 'নতুন'} <small>({donor.reviews})</small></span>
        </div>
        <button className="outline-btn" onClick={onOpen}>Profile দেখুন <span>→</span></button>
      </div>
    </article>
  );
}

function DonorModal({ donor, onClose, onReview, onAddDonation, currentUser, onEditClick, onDeleteClick }) {
  const eligible = (!donor.age || donor.age >= 18) && (!donor.lastDonation || (Date.now() - new Date(donor.lastDonation).getTime()) >= 90 * 24 * 60 * 60 * 1000);
  const donationHistory = getDonationHistory(donor);
  const [showDonationHistory, setShowDonationHistory] = useState(false);
  const [donationDate, setDonationDate] = useState('');
  const [historyError, setHistoryError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteReason, setDeleteReason] = useState('কেন চলে যেতে চাচ্ছেন আমাদের ছেড়ে আমাদের কে একটু উপকার করলে কি এমন হতো');

  const isOwner = currentUser && currentUser.id === donor.id;

  const handleDeleteSubmit = (e) => {
    e.preventDefault();
    onDeleteClick(deleteReason);
    setShowDeleteConfirm(false);
  };

  const handleDonationSubmit = (event) => {
    event.preventDefault();
    if (!donationDate) return;
    if (donationHistory.includes(donationDate)) {
      setHistoryError('এই তারিখটি আগেই history-তে আছে।');
      return;
    }
    if (donationDate > new Date().toISOString().slice(0, 10)) {
      setHistoryError('ভবিষ্যতের তারিখ যোগ করা যাবে না।');
      return;
    }
    onAddDonation(donor.id, donationDate);
    setDonationDate('');
    setHistoryError('');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-top-actions" style={{ position: 'absolute', top: '25px', right: '25px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          {isOwner && (
            <>
              <button className="action-btn edit-btn" onClick={onEditClick} title="এডিট প্রোফাইল" style={{ background: 'transparent', border: 0, cursor: 'pointer', padding: '4px', color: '#4f46e5', display: 'flex', alignItems: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </button>
              <button className="action-btn delete-btn" onClick={() => setShowDeleteConfirm(true)} title="ডিলিট প্রোফাইল" style={{ background: 'transparent', border: 0, cursor: 'pointer', padding: '4px', color: '#e34841', display: 'flex', alignItems: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </button>
            </>
          )}
          <button className="close-btn" onClick={onClose} style={{ position: 'static', fontSize: '1.8rem', color: '#92877e', lineHeight: 1, border: 0, background: 'transparent', cursor: 'pointer' }}>×</button>
        </div>
        
        <div className="modal-profile">
          <img src={donor.image} alt={donor.name} />
          <div>
            <span className="blood-badge">{donor.blood}</span>
            <h2>{donor.name}</h2>
            <p>{donor.area}, {donor.district} · {donor.verified ? '✓ Verified profile' : 'New member'}</p>
          </div>
        </div>
        <div className="profile-details">
          <div><span>Phone</span><strong>{donor.phone}</strong></div>
          <div><span>Eligibility</span><strong className={eligible ? 'eligible-status' : 'ineligible-status'}>{eligible ? 'Eligible now' : 'Wait required'}</strong></div>
          <div><span>Availability</span><strong>{donor.availability}</strong></div>
          <button type="button" className="donation-summary" onClick={() => setShowDonationHistory((visible) => !visible)} aria-expanded={showDonationHistory}>
            <span>Last donation <small>{showDonationHistory ? 'বন্ধ করুন' : 'History দেখুন'}</small></span>
            <strong>{formatDonationDate(donationHistory[0])}</strong>
          </button>
        </div>
        {showDonationHistory && (
          <section className="donation-history" aria-label="Donation history">
            <div className="history-heading">
              <div><strong>{donationHistory.length}</strong><span>বার রক্ত দিয়েছেন</span></div>
              <span>প্রতি donation-এর মাঝে অন্তত ৩ মাস</span>
            </div>
            {donationHistory.length ? (
              <ol>{donationHistory.map((date, index) => <li key={date}><span>{index + 1}</span><strong>{formatDonationDate(date)}</strong>{index === 0 && <em>সর্বশেষ</em>}</li>)}</ol>
            ) : <p className="empty-history">এই donor এখনও রক্ত দান করেননি।</p>}
            {isOwner && (
              <form className="add-donation-form" onSubmit={handleDonationSubmit}>
                <label>আপনি কবে রক্ত দিয়েছেন?
                  <input type="date" value={donationDate} max={new Date().toISOString().slice(0, 10)} onChange={(event) => { setDonationDate(event.target.value); setHistoryError(''); }} required />
                </label>
                <button className="primary-btn" type="submit">+ History-তে যোগ করুন</button>
                {historyError && <p className="history-error">{historyError}</p>}
              </form>
            )}
          </section>
        )}
        <p className="profile-note">“{donor.note}”</p>
        <a className="call-btn" href={`tel:${donor.phone}`}>☎ কল করুন</a>
        
        {isOwner && (
          <button type="button" className="outline-btn" onClick={() => setShowDeleteConfirm(true)} style={{ width: '100%', marginTop: '15px', borderColor: '#e34841', color: '#e34841', background: 'transparent', fontWeight: 'bold', cursor: 'pointer', padding: '12px', transition: 'all 0.3s ease' }}>
            ✕ প্রোফাইল ডিলিট করুন
          </button>
        )}

        <form className="review-form" onSubmit={onReview}>
          <h3>এই donor সম্পর্কে আপনার অভিজ্ঞতা</h3>
          <div className="review-fields">
            <select name="rating" defaultValue="5">
              <option value="5">★★★★★ চমৎকার</option>
              <option value="4">★★★★ ভালো</option>
              <option value="3">★★★ মোটামুটি</option>
              <option value="2">★★ প্রয়োজন উন্নতি</option>
              <option value="1">★ খারাপ</option>
            </select>
            <button className="primary-btn" type="submit">Review দিন</button>
          </div>
        </form>
      </div>

      {showDeleteConfirm && (
        <div className="modal-backdrop" style={{ zIndex: 30, background: 'rgba(227, 72, 65, 0.15)', backdropFilter: 'blur(12px)' }} onClick={(e) => e.stopPropagation()}>
          <div className="modal" style={{ borderRadius: '12px', borderTop: '5px solid #e34841', boxShadow: '0 20px 40px rgba(227, 72, 65, 0.15)' }} onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowDeleteConfirm(false)}>×</button>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ background: '#fdf2f2', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
                <span style={{ color: '#e34841', fontSize: '2rem', fontWeight: 'bold' }}>!</span>
              </div>
              <h2 style={{ color: '#302825', fontSize: '1.4rem', margin: '0 0 8px' }}>প্রোফাইল ডিলিট করতে চান?</h2>
              <p style={{ color: '#6c625c', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>প্রোফাইল মুছে ফেলার আগে দয়া করে একটি কারণ লিখে দিন।</p>
            </div>
            
            <form onSubmit={handleDeleteSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#766a62', fontSize: '0.75rem', fontWeight: 'bold', margin: '0 0 8px', textAlign: 'left' }}>ডিলিট করার কারণ (Note)</label>
                <textarea
                  required
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  style={{ width: '100%', minHeight: '90px', padding: '12px', border: '1px solid #e5dcd5', borderRadius: '6px', fontSize: '0.85rem', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => setShowDeleteConfirm(false)} style={{ flex: 1, padding: '12px', background: '#eee5dd', color: '#50443d', border: 0, borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                  বাতিল করুন
                </button>
                <button type="submit" style={{ flex: 1, padding: '12px', background: '#e34841', color: 'white', border: 0, borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                  নিশ্চিত ও ডিলিট
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function RegisterForm({ registration, updateRegistration, onImageChange, onSubmit, onBack }) {
  return (
    <main className="register-page">
      <div className="register-intro">
        <button className="back-btn" onClick={onBack}>← ফিরে যান</button>
        <p className="overline">মানবতার পাশে দাঁড়ান</p>
        <h1>আপনার রক্ত,<br /><em>কারও নতুন সকাল।</em></h1>
        <p>আপনার profile যুক্ত করুন। কেউ আপনার এলাকার রক্ত খুঁজলে আপনার তথ্য দেখে সরাসরি যোগাযোগ করতে পারবে।</p>
        <div className="register-benefits">
          <span>✓ আপনার এলাকার মানুষের পাশে থাকুন</span>
          <span>✓ প্রয়োজনের সময় সহজে যোগাযোগ</span>
          <span>✓ নিজের donor পরিচয় তৈরি করুন</span>
        </div>
      </div>
      <form className="register-form" onSubmit={onSubmit}>
        <div className="form-head">
          <span>01 — আপনার পরিচয়</span>
          <h2>Donor profile তৈরি করুন</h2>
        </div>
        <label>পুরো নাম
          <input required value={registration.name} onChange={(event) => updateRegistration('name', event.target.value)} placeholder="যেমন: আরিফ হোসেন" />
        </label>
        <div className="form-row">
          <label>Blood group
            <select value={registration.blood} onChange={(event) => updateRegistration('blood', event.target.value)}>
              {bloodGroups.slice(1).map((group) => <option key={group}>{group}</option>)}
            </select>
          </label>
          <label>মোবাইল নম্বর
            <input required id="phone" value={registration.phone} onChange={(event) => updateRegistration('phone', event.target.value)} placeholder="01XXXXXXXXX" />
          </label>
        </div>
        <div className="form-row">
          <label>বয়স
            <input type="number" min="1" max="120" required value={registration.age} onChange={(event) => updateRegistration('age', event.target.value)} placeholder="১৮+" />
          </label>
          <label>শেষবার রক্ত দিয়েছেন
            <input type="date" value={registration.lastDonation} onChange={(event) => updateRegistration('lastDonation', event.target.value)} />
          </label>
        </div>
        <div className="form-row">
          <label>জেলা
            <select value={registration.district} onChange={(event) => updateRegistration('district', event.target.value)}>
              {districts.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label>এলাকা
            <input required value={registration.area} onChange={(event) => updateRegistration('area', event.target.value)} placeholder="যেমন: ধানমন্ডি" />
          </label>
        </div>
        <label>কখন available থাকেন?
          <select value={registration.availability} onChange={(event) => updateRegistration('availability', event.target.value)}>
            <option>যেকোনো সময়</option>
            <option>সকাল ৮টা - দুপুর ১২টা</option>
            <option>দুপুর ১২টা - বিকেল ৫টা</option>
            <option>সন্ধ্যা ৬টা - রাত ১০টা</option>
          </select>
        </label>
        <label>পাসওয়ার্ড
          <input type="password" required value={registration.password || ''} onChange={(event) => updateRegistration('password', event.target.value)} placeholder="আপনার পাসওয়ার্ড লিখুন" />
        </label>
        <label>আপনার সম্পর্কে ছোট্ট note
          <textarea value={registration.note} onChange={(event) => updateRegistration('note', event.target.value)} placeholder="কেন donor হতে চান?" />
        </label>
        <label>Profile picture <span className="optional">(ঐচ্ছিক)</span>
          <input type="file" accept="image/*" onChange={onImageChange} />
        </label>
        {registration.image && <img className="profile-preview" src={registration.image} alt="Profile preview" />}
        <button className="primary-btn submit-btn" type="submit">আমার profile যুক্ত করুন <span>→</span></button>
        <p className="privacy-note">ছবি আপনার device থেকেই নেওয়া হবে।</p>
      </form>
    </main>
  );
}

function EditProfileModal({ donor, onClose, onSave }) {
  const [formData, setFormData] = useState({ ...donor });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => handleChange('image', reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 25 }}>
      <div className="modal register-page" onClick={(e) => e.stopPropagation()} style={{ borderRadius: '12px', width: 'min(600px, 100%)', maxHeight: '90vh', overflowY: 'auto', padding: '30px' }}>
        <button className="close-btn" onClick={onClose} style={{ top: '25px', right: '25px' }}>×</button>
        <form className="register-form" onSubmit={handleSubmit} style={{ boxShadow: 'none', padding: 0, width: '100%' }}>
          <div className="form-head">
            <span>এডিট প্রোফাইল</span>
            <h2>আপনার তথ্য আপডেট করুন</h2>
          </div>
          <label>পুরো নাম
            <input required value={formData.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="যেমন: আরিফ হোসেন" />
          </label>
          <div className="form-row">
            <label>Blood group
              <select value={formData.blood} onChange={(e) => handleChange('blood', e.target.value)}>
                {bloodGroups.slice(1).map((group) => <option key={group}>{group}</option>)}
              </select>
            </label>
            <label>মোবাইল নম্বর
              <input required value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="01XXXXXXXXX" />
            </label>
          </div>
          <div className="form-row">
            <label>বয়স
              <input type="number" min="1" max="120" required value={formData.age || ''} onChange={(e) => handleChange('age', e.target.value)} placeholder="১৮+" />
            </label>
            <label>শেষবার রক্ত দিয়েছেন
              <input type="date" value={formData.lastDonation || ''} onChange={(e) => handleChange('lastDonation', e.target.value)} />
            </label>
          </div>
          <div className="form-row">
            <label>জেলা
              <select value={formData.district} onChange={(e) => handleChange('district', e.target.value)}>
                {districts.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label>এলাকা
              <input required value={formData.area} onChange={(e) => handleChange('area', e.target.value)} placeholder="যেমন: ধানমন্ডি" />
            </label>
          </div>
          <label>কখন available থাকেন?
            <select value={formData.availability} onChange={(e) => handleChange('availability', e.target.value)}>
              <option>যেকোনো সময়</option>
              <option>সকাল ৮টা - দুপুর ১২টা</option>
              <option>দুপুর ১২টা - বিকেল ৫টা</option>
              <option>সন্ধ্যা ৬টা - রাত ১০টা</option>
            </select>
          </label>
          <label>Status (স্ট্যাটাস)
            <select value={formData.status || 'Available'} onChange={(e) => handleChange('status', e.target.value)}>
              <option value="Available">Available (এখন দিতে পারবেন)</option>
              <option value="Busy">Busy (এই মুহূর্তে ব্যস্ত)</option>
              <option value="Unavailable">Unavailable (এখন available নন)</option>
            </select>
          </label>
          <label>পাসওয়ার্ড
            <input type="password" required value={formData.password || ''} onChange={(e) => handleChange('password', e.target.value)} placeholder="আপনার পাসওয়ার্ড লিখুন" />
          </label>
          <label>আপনার সম্পর্কে ছোট্ট note
            <textarea value={formData.note} onChange={(e) => handleChange('note', e.target.value)} placeholder="কেন donor হতে চান?" />
          </label>
          <label>Profile picture <span className="optional">(ঐচ্ছিক)</span>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>
          {formData.image && <img className="profile-preview" src={formData.image} alt="Profile preview" style={{ display: 'block', margin: '15px 0', width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} />}
          <button className="primary-btn submit-btn" type="submit" style={{ marginTop: '20px' }}>তথ্য সংরক্ষণ করুন <span>→</span></button>
        </form>
      </div>
    </div>
  );
}

function StockPanel({ onRequest }) {
  const total = Object.values(stockData).reduce((sum, units) => sum + units, 0);
  return (
    <main className="system-page">
      <div className="system-heading">
        <div>
          <p className="overline">BloodBankManager · BloodStock</p>
          <h1>Blood stock overview</h1>
          <p>Java system-এর current inventory snapshot। Stock কম থাকলে emergency donor request পাঠান।</p>
        </div>
        <button className="primary-btn" onClick={onRequest}>রক্তের অনুরোধ করুন <span>→</span></button>
      </div>
      <div className="stock-total"><strong>{total}</strong><span>মোট blood units available</span></div>
      <div className="stock-grid">
        {Object.entries(stockData).map(([group, units]) => (
          <div className={`stock-card ${units <= 2 ? 'stock-low' : ''}`} key={group}>
            <span className="blood-badge">{group}</span>
            <strong>{units}</strong>
            <small>{units <= 2 ? 'Low stock' : 'units available'}</small>
          </div>
        ))}
      </div>
      <div className="java-note"><strong>Java logic:</strong> BloodStock.removeUnits() পর্যাপ্ত stock না থাকলে false দেয়; তখন BloodRequest তৈরি করে eligible donor খোঁজা হয়।</div>
    </main>
  );
}

function RequestForm({ request, updateRequest, onSubmit, onBack }) {
  return (
    <main className="system-page request-page">
      <button className="back-btn" onClick={onBack}>← donor directory-তে ফিরে যান</button>
      <div className="system-heading">
        <div>
          <p className="overline">Customer · BloodRequest</p>
          <h1>Emergency blood request</h1>
          <p>Stock-এ প্রয়োজনীয় blood না থাকলে আপনার location-এর eligible donor-দের কাছে request যাবে।</p>
        </div>
      </div>
      <form className="request-form" onSubmit={onSubmit}>
        <label>আপনার নাম
          <input required value={request.name} onChange={(event) => updateRequest('name', event.target.value)} placeholder="যিনি request করছেন" />
        </label>
        <label>Patient-এর নাম
          <input required value={request.patient} onChange={(event) => updateRequest('patient', event.target.value)} placeholder="রোগীর নাম" />
        </label>
        <div className="form-row">
          <label>Blood group
            <select value={request.blood} onChange={(event) => updateRequest('blood', event.target.value)}>
              {bloodGroups.slice(1).map((group) => <option key={group}>{group}</option>)}
            </select>
          </label>
          <label>কত bag প্রয়োজন?
            <input type="number" min="1" max="10" required value={request.bags} onChange={(event) => updateRequest('bags', event.target.value)} />
          </label>
        </div>
        <div className="form-row">
          <label>কোথায় প্রয়োজন?
            <input required value={request.location} onChange={(event) => updateRequest('location', event.target.value)} placeholder="হাসপাতাল / এলাকা" />
          </label>
          <label>মোবাইল নম্বর
            <input required value={request.phone} onChange={(event) => updateRequest('phone', event.target.value)} placeholder="01XXXXXXXXX" />
          </label>
        </div>
        <button className="primary-btn submit-btn" type="submit">Emergency request পাঠান <span>→</span></button>
      </form>
    </main>
  );
}

export default App;

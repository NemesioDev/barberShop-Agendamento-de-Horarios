import React, { useState, useEffect, useCallback } from 'react';
import { 
  Scissors, Calendar, CreditCard, User, LogOut, CheckCircle, 
  AlertCircle, X, QrCode, LayoutDashboard, Lock, Copy, 
  ExternalLink, Wallet, RefreshCw, Phone, Settings, Save, 
  Users, Plus, Trash2, Image as ImageIcon, Search, MapPin, 
  Link as LinkIcon, DollarSign, Clock, Globe, Filter, Key, Loader,
  Smartphone, Zap, TrendingUp, Rocket
} from 'lucide-react';

// --- CONFIGURAÇÃO ---
const SUPABASE_CONFIG = {
  url: 'https://eugefklgajncyxewlohh.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1Z2Vma2xnYWpuY3l4ZXdsb2hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MDk2MzAsImV4cCI6MjA3OTI4NTYzMH0.6p55JQ_7dcSKW2BTsgbhhUOzuaw4Kf23jOLNHeF_DNs'
};

const BUSINESS_CONFIG = {
  whatsapp: '5511999999999'
};

const BOOKING_FEE = 10;
const DEFAULT_PAYMENT_LINK = 'https://mpago.la/21ug7xs';

// --- Componentes UI ---

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }) => {
  const baseStyle = "px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 touch-manipulation whitespace-nowrap";
  const variants = {
    primary: "bg-amber-600 hover:bg-amber-700 text-white disabled:bg-amber-800 disabled:opacity-50",
    secondary: "bg-gray-700 hover:bg-gray-600 text-white disabled:bg-gray-800",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    outline: "border border-amber-600 text-amber-500 hover:bg-amber-600/10",
    whatsapp: "bg-green-600 hover:bg-green-700 text-white",
    mercadopago: "bg-[#009EE3] hover:bg-[#0082BA] text-white"
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant] || variants.primary} ${className}`}>
      {children}
    </button>
  );
};

const Card = ({ children, className = '' }) => (
  <div className={`bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-4 md:p-6 ${className}`}>
    {children}
  </div>
);

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-gray-800 rounded-2xl w-full max-w-md border border-gray-700 shadow-2xl p-5 animate-in fade-in zoom-in duration-200 my-auto relative">
        <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3 sticky top-0 bg-gray-800 z-10">
          <h3 className="text-lg md:text-xl font-bold text-white truncate pr-2">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1"><X size={24} /></button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto custom-scrollbar">
            {children}
        </div>
      </div>
    </div>
  );
};

const Avatar = ({ src, alt, size = "md" }) => {
    const sizeClasses = { sm: "w-8 h-8", md: "w-12 h-12", lg: "w-16 h-16", xl: "w-24 h-24" };
    return (
        <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-gray-600 bg-gray-700 shrink-0`}>
            <img src={src || "https://via.placeholder.com/150"} alt={alt} className="w-full h-full object-cover" />
        </div>
    );
};

// --- LANDING PAGE ---
const LandingPage = ({ onLogin, supabase }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  
  const [regData, setRegData] = useState({ name: '', phone: '', password: '' });
  const [registering, setRegistering] = useState(false);

  const handleRegister = async () => {
      if (!regData.name || !regData.phone || !regData.password) return alert("Preencha todos os campos.");
      setRegistering(true);
      
      const randomSuffix = Math.floor(Math.random() * 1000);
      const slug = regData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + randomSuffix;
      const cleanPhone = regData.phone.replace(/\D/g, '');

      try {
          const { error } = await supabase.from('barbershops').insert([{
              name: regData.name,
              slug: slug,
              owner_phone: cleanPhone,
              password: regData.password,
              barber_limit: 3
          }]);

          if (error) {
              if (error.code === '23505') alert("Este telefone já possui uma barbearia cadastrada.");
              else throw error;
          } else {
              alert(`Barbearia criada com sucesso!\n\nSeu link: app.com/?shop=${slug}\n\nFaça login agora.`);
              setShowRegisterModal(false);
              setShowLoginModal(true);
              setRegData({ name: '', phone: '', password: '' });
          }
      } catch (err) {
          alert("Erro ao criar: " + err.message);
      } finally {
          setRegistering(false);
      }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans flex flex-col">
      {/* Navbar Mobile-First */}
      <nav className="border-b border-gray-800 bg-gray-900/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-xl md:text-2xl">
            <Scissors size={24} />
            <span className="text-white">BARBER<span className="text-amber-500">SHOP</span></span>
          </div>
          <div>
            <Button onClick={() => setShowLoginModal(true)} className="text-xs md:text-sm px-3 py-2 md:px-4 md:py-2 whitespace-nowrap">Área Profissional</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section Responsiva */}
      <header className="flex-1 py-16 md:py-24 px-4 md:px-6 text-center relative overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-amber-500/10 rounded-full blur-3xl -z-10"></div>
        <h1 className="text-4xl md:text-7xl font-extrabold mb-4 md:mb-6 leading-tight">
          A Evolução da sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">Barbearia</span>
        </h1>
        <p className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto mb-8 md:mb-12 px-2">
          Sistema completo de agendamento, gestão financeira e pagamentos automáticos.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-3 w-full max-w-md sm:max-w-lg">
           <Button 
             className="text-base md:text-lg w-full bg-green-600 hover:bg-green-700 shadow-lg shadow-green-900/20 py-4" 
             onClick={() => setShowRegisterModal(true)}
           >
             <Rocket size={20} className="mr-2" /> Quero Testar Grátis
           </Button>
           
           <button 
             onClick={() => setShowLoginModal(true)} 
             className="w-full px-8 py-4 rounded-lg border border-gray-700 hover:bg-gray-800 transition font-medium flex items-center justify-center gap-2 text-base md:text-lg"
           >
             <Lock size={18} /> Já tenho conta
           </button>
        </div>
      </header>

      {/* Features Grid Responsiva */}
      <section className="py-12 md:py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-500 mb-4"><Smartphone size={24} /></div>
              <h3 className="text-xl font-bold mb-2">Link Próprio</h3>
              <p className="text-gray-400 text-sm">Link exclusivo para sua barbearia.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center text-green-500 mb-4"><Zap size={24} /></div>
              <h3 className="text-xl font-bold mb-2">Pagamento PIX</h3>
              <p className="text-gray-400 text-sm">Cobrança automática da taxa via PIX.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-500 mb-4"><TrendingUp size={24} /></div>
              <h3 className="text-xl font-bold mb-2">Gestão Total</h3>
              <p className="text-gray-400 text-sm">Painel completo para donos e equipe.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-gray-600 text-xs md:text-sm border-t border-gray-800 bg-gray-950">
        <p>© 2024 BarberShop. Todos os direitos reservados.</p>
      </footer>

      {/* MODAIS */}
      <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} title="Acesso Restrito">
          <div className="space-y-4">
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 text-center">
                  <div className="flex justify-center mb-4 text-amber-500"><Lock size={32} /></div>
                  <h4 className="text-lg font-bold text-white mb-2">Login Profissional</h4>
                  <p className="text-xs text-gray-400 mb-6">Acesse sua conta de dono ou barbeiro.</p>
                  <LoginScreen onLogin={onLogin} supabase={supabase} isGlobalLogin={true} />
              </div>
          </div>
      </Modal>

      <Modal isOpen={showRegisterModal} onClose={() => setShowRegisterModal(false)} title="Criar Minha Barbearia">
          <div className="space-y-4">
              <div className="bg-green-900/20 p-3 rounded border border-green-800 mb-4 flex items-start gap-3">
                  <Rocket className="text-green-400 shrink-0 mt-1" size={20}/> 
                  <div>
                    <h4 className="font-bold text-green-400 text-sm">Comece Grátis</h4>
                    <p className="text-xs text-gray-300">Crie sua conta e use agora.</p>
                  </div>
              </div>
              
              <div><label className="text-sm text-gray-400 block mb-1">Nome da Barbearia</label><input className="w-full bg-gray-800 p-3 rounded text-white border border-gray-600 outline-none" placeholder="Ex: Barbearia do Zé" value={regData.name} onChange={e => setRegData({...regData, name: e.target.value})} /></div>
              <div><label className="text-sm text-gray-400 block mb-1">Seu Celular (Login)</label><input className="w-full bg-gray-800 p-3 rounded text-white border border-gray-600 outline-none" placeholder="11999999999" value={regData.phone} onChange={e => setRegData({...regData, phone: e.target.value})} /></div>
              <div><label className="text-sm text-gray-400 block mb-1">Senha</label><input type="password" className="w-full bg-gray-800 p-3 rounded text-white border border-gray-600 outline-none" placeholder="******" value={regData.password} onChange={e => setRegData({...regData, password: e.target.value})} /></div>

              <Button onClick={handleRegister} className="w-full mt-2 bg-green-600 hover:bg-green-700" disabled={registering}>
                  {registering ? 'Criando...' : 'Criar Conta'}
              </Button>
          </div>
      </Modal>
    </div>
  );
};

// --- App Principal ---

export default function BarberApp() {
  const [user, setUser] = useState(() => {
    try {
        const saved = localStorage.getItem('barber_user');
        return saved ? JSON.parse(saved) : null;
    } catch (e) { return null; }
  });

  const [view, setView] = useState(() => {
    try {
        const savedUser = localStorage.getItem('barber_user');
        const pendingBooking = localStorage.getItem('barber_pending_booking');
        
        if (savedUser) {
            if (pendingBooking) return 'client-booking';
            const u = JSON.parse(savedUser);
            return u.role === 'client' ? 'client-home' : 'barber-dashboard';
        }
        return 'login';
    } catch (e) { return 'login'; }
  });

  const [currentBarberId, setCurrentBarberId] = useState(() => {
      try {
          const saved = localStorage.getItem('barber_user');
          return saved ? JSON.parse(saved).barberId : null;
      } catch (e) { return null; }
  });

  const [appointments, setAppointments] = useState([]);
  const [barbers, setBarbers] = useState([]); 
  const [services, setServices] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const [currentShop, setCurrentShop] = useState(null); 
  const [shopLoading, setShopLoading] = useState(true);
  const [shopSearch, setShopSearch] = useState(''); 
  
  const [supabase, setSupabase] = useState(null);

  // Inicializar Supabase
  useEffect(() => {
    if (window.supabase) { initSupabase(); } 
    else {
      const script = document.createElement('script');
      script.src = "https://unpkg.com/@supabase/supabase-js@2";
      script.onload = initSupabase;
      document.body.appendChild(script);
    }
    function initSupabase() {
      const client = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
      setSupabase(client);
    }
  }, []);

  // Identificar Loja
  useEffect(() => {
    if (!supabase) return;

    const identifyShop = async () => {
        const params = new URLSearchParams(window.location.search);
        let shopSlug = params.get('shop');

        if (params.get('collection_status') || !shopSlug) {
            shopSlug = localStorage.getItem('barber_shop_slug');
        }

        if (!shopSlug) {
            const savedUser = JSON.parse(localStorage.getItem('barber_user') || 'null');
            if (savedUser && savedUser.role === 'owner' && savedUser.shopId) {
                const { data } = await supabase.from('barbershops').select('*').eq('id', savedUser.shopId).single();
                if (data) {
                    setCurrentShop(data);
                    localStorage.setItem('barber_shop_slug', data.slug);
                }
            }
            setShopLoading(false);
            return;
        }

        const { data, error } = await supabase.from('barbershops').select('*').eq('slug', shopSlug).single();
        if (data) {
            setCurrentShop(data);
            localStorage.setItem('barber_shop_slug', data.slug);
        }
        setShopLoading(false);
    };

    identifyShop();
  }, [supabase]);

  // 3. Carregar Usuário e Estado
  useEffect(() => {
    const savedUser = localStorage.getItem('barber_user');
    if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        
        const pendingBooking = localStorage.getItem('barber_pending_booking');
        if (pendingBooking) {
            setView('client-booking');
        } else {
            setView(parsedUser.role === 'client' ? 'client-home' : 'barber-dashboard');
        }
        setCurrentBarberId(parsedUser.barberId);
    }
  }, []);

  // 4. Função Central de Busca de Dados
  const refreshData = useCallback(async () => {
      if (!supabase || !currentShop) return;
      
      const { data: shopData } = await supabase.from('barbershops').select('*').eq('id', currentShop.id).single();
      if (shopData) setCurrentShop(shopData);

      const { data: barbersData } = await supabase.from('barbers').select('id, name, specialty, image').eq('barbershop_id', currentShop.id);
      if (barbersData) setBarbers(barbersData);

      const { data: servicesData } = await supabase.from('services').select('*').eq('barbershop_id', currentShop.id).order('price', { ascending: true });
      if (servicesData) setServices(servicesData);

      const { data: appsData } = await supabase.from('appointments').select('*').eq('barbershop_id', currentShop.id);
      if (appsData) setAppointments(appsData);

      setLoading(false);
  }, [supabase, currentShop]);

  // 5. Realtime
  useEffect(() => {
    if (!supabase || !currentShop) {
        if (!shopLoading) setLoading(false);
        return;
    }

    refreshData();

    const channel = supabase
      .channel(`shop_${currentShop.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments', filter: `barbershop_id=eq.${currentShop.id}` }, () => refreshData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'barbers', filter: `barbershop_id=eq.${currentShop.id}` }, () => refreshData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services', filter: `barbershop_id=eq.${currentShop.id}` }, () => refreshData())
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'barbershops', filter: `id=eq.${currentShop.id}` }, async (payload) => {
           setCurrentShop(payload.new);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [supabase, currentShop, refreshData]);

  const handleLogin = (loginData) => {
    let uid = loginData.role === 'client' ? loginData.phone.replace(/\D/g, '') : loginData.uid;
    const userData = { 
      uid, displayName: loginData.name, role: loginData.role, phone: loginData.phone, shopId: loginData.shopId, photo: loginData.photo, barberId: loginData.barberId
    };
    localStorage.setItem('barber_user', JSON.stringify(userData));
    setUser(userData);
    setCurrentBarberId(loginData.barberId);
    if (loginData.role === 'owner' && !currentShop) window.location.reload();
    else setView(loginData.role === 'client' ? 'client-home' : 'barber-dashboard');
  };
  
  const refreshUserSession = (newData) => {
      const updatedUser = { ...user, ...newData };
      localStorage.setItem('barber_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('barber_user');
    localStorage.removeItem('barber_pending_booking');
    
    // Limpa contexto da loja
    localStorage.removeItem('barber_shop_slug'); 
    setCurrentShop(null);
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.replaceState({path:newUrl},'',newUrl);

    setUser(null);
    setView('login');
    setCurrentBarberId(null);
  };

  const handleSearchShop = () => {
      if (shopSearch.trim()) {
          window.location.href = `?shop=${shopSearch.toLowerCase().replace(/\s+/g, '-')}`;
      }
  };

  if (shopLoading || (loading && currentShop)) return <div className="h-screen flex items-center justify-center text-amber-500 gap-2 bg-gray-900"><RefreshCw className="animate-spin"/> Carregando...</div>;

  // TELA INICIAL GLOBAL (LANDING PAGE)
  if (!currentShop && !user) {
      return <LandingPage onLogin={handleLogin} supabase={supabase} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <nav className="bg-gray-950 border-b border-gray-800 p-4 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-xl truncate">
            <Scissors size={24} />
            <span>{currentShop ? currentShop.name.toUpperCase() : 'BARBERSHOP'}</span>
          </div>
          {user && view !== 'login' && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                 {user.photo && <Avatar src={user.photo} size="sm" />}
                 <span className="hidden md:block text-sm text-gray-400 truncate max-w-[100px]">{user.displayName}</span>
              </div>
              <Button variant="outline" onClick={handleLogout} className="px-3 py-1 text-xs"><LogOut size={14} /> Sair</Button>
            </div>
          )}
        </div>
      </nav>
      <main className="max-w-5xl mx-auto p-4 md:p-6">
        {view === 'login' && <LoginScreen onLogin={handleLogin} supabase={supabase} currentShop={currentShop} />}
        {view === 'client-home' && <ClientView user={user} appointments={appointments} setView={setView} barbers={barbers} supabase={supabase} currentShop={currentShop} onRefresh={refreshData} />}
        {view === 'client-booking' && <BookingFlow user={user} appointments={appointments} onCancel={() => setView('client-home')} barbers={barbers} supabase={supabase} currentShop={currentShop} services={services} onRefresh={refreshData} />}
        {view === 'barber-dashboard' && <BarberDashboard appointments={appointments} currentBarberId={currentBarberId} barbers={barbers} user={user} supabase={supabase} currentShop={currentShop} services={services} onRefresh={refreshData} onUpdateUser={refreshUserSession} />}
      </main>
    </div>
  );
}

// --- Login Screen ---

const LoginScreen = ({ onLogin, supabase, currentShop, isGlobalLogin = false }) => {
  const [mode, setMode] = useState('client');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);

  useEffect(() => { if (isGlobalLogin) setMode('barber'); }, [isGlobalLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'client') {
      if (!name.trim()) return setError('Digite seu nome.');
      if (!phone.trim() || phone.length < 8) return setError('Digite um celular válido.');
      onLogin({ name, phone, role: 'client' });
    } else {
      if (!phone.trim()) return setError('Digite seu celular cadastrado.');
      if (!password) return setError('Digite sua senha.');
      
      setVerifying(true);
      const cleanPhone = phone.replace(/\D/g, '');

      try {
          // 1. Tenta Barbeiro
          let { data: barber } = await supabase.from('barbers').select('id, name, password, barbershop_id, image').eq('phone', cleanPhone).maybeSingle();
          if (barber && barber.password === password) {
              if (currentShop && barber.barbershop_id !== currentShop.id) throw new Error('Este profissional não pertence a esta barbearia.');
              onLogin({ name: barber.name, role: 'barber', barberId: barber.id, shopId: barber.barbershop_id, phone: phone, uid: barber.id, photo: barber.image });
              return;
          }

          // 2. Tenta Dono
          let { data: shop } = await supabase.from('barbershops').select('id, name, password, owner_phone, owner_image').eq('owner_phone', cleanPhone).maybeSingle();
          if (shop && shop.password === password) {
              onLogin({ name: "Dono", role: 'owner', barberId: null, shopId: shop.id, phone: phone, uid: shop.id, photo: shop.owner_image });
              return;
          }
          throw new Error('Credenciais inválidas');
      } catch (err) { setError(err.message || 'Erro ao entrar.'); } 
      finally { setVerifying(false); }
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center ${isGlobalLogin ? '' : 'pt-10'}`}>
      {!isGlobalLogin && (
        <div className="w-full max-w-md text-center mb-8">
            {currentShop?.logo_url ? (
                <div className="mb-6 flex justify-center">
                    <img 
                        src={currentShop.logo_url} 
                        alt="Logo Barbearia" 
                        className="w-[350px] h-[350px] object-cover rounded-2xl shadow-2xl border border-gray-700 bg-gray-800"
                        onError={(e) => e.target.style.display = 'none'} 
                    />
                </div>
            ) : (
                <div className="mb-6 flex justify-center">
                    <div className="w-[150px] h-[150px] bg-gray-800 rounded-full flex items-center justify-center border border-gray-700">
                        <Scissors size={64} className="text-gray-600" />
                    </div>
                </div>
            )}

            <h1 className="text-4xl font-bold text-white mb-2">Bem-vindo</h1>
            <p className="text-gray-400">{currentShop ? currentShop.name : 'Acesse sua conta'}</p>
        </div>
      )}
      
      <Card className="w-full max-w-md">
        {!isGlobalLogin && (
            <div className="grid grid-cols-2 gap-2 mb-6 bg-gray-900/50 p-1 rounded-lg">
                <button onClick={() => {setMode('client'); setError('')}} className={`py-2 px-4 rounded-md text-sm font-medium transition-all ${mode === 'client' ? 'bg-amber-600 text-white' : 'text-gray-400'}`}>Sou Cliente</button>
                <button onClick={() => {setMode('barber'); setError('')}} className={`py-2 px-4 rounded-md text-sm font-medium transition-all ${mode === 'barber' ? 'bg-amber-600 text-white' : 'text-gray-400'}`}>Profissional</button>
            </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'client' ? (
            <div className="space-y-4 animate-in fade-in">
              <div><label className="block text-sm font-medium text-gray-400 mb-1">Seu Nome</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white outline-none focus:border-amber-500" placeholder="Ex: João Silva" /></div>
              <div><label className="block text-sm font-medium text-gray-400 mb-1">Seu Celular</label><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white outline-none focus:border-amber-500" placeholder="Ex: 11999999999" /></div>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in">
              {!isGlobalLogin && <div className="bg-amber-900/20 p-3 rounded border border-amber-900/50 mb-4"><p className="text-xs text-amber-500 flex gap-2"><Lock size={14}/> Área Restrita</p></div>}
              <div><label className="block text-sm font-medium text-gray-400 mb-1">Celular Cadastrado</label><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white outline-none focus:border-amber-500" placeholder="Seu número" /></div>
              <div><label className="block text-sm font-medium text-gray-400 mb-1">Senha</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white outline-none focus:border-amber-500" placeholder="Sua Senha" /></div>
            </div>
          )}
          {error && <p className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded border border-red-900/50">{error}</p>}
          <Button type="submit" disabled={verifying} className="w-full py-3 text-lg">{verifying ? 'Verificando...' : (isGlobalLogin ? 'Acessar Painel' : 'Entrar')}</Button>
        </form>
      </Card>
    </div>
  );
};

// --- Client View ---

const ClientView = ({ user, appointments, setView, barbers, supabase, onRefresh }) => {
  const myApps = appointments
    .filter(app => app.client_id === user.uid)
    .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

  const handleNewBooking = () => {
      localStorage.removeItem('barber_pending_booking');
      setView('client-booking');
  };

  // FUNÇÃO PARA RETOMAR PAGAMENTO
  const handleResumePayment = (appointment) => {
      const resumeData = {
          step: 4, // Vai direto pro passo de pagamento
          formData: {
              barber: { id: appointment.barber_id, name: appointment.barber_name },
              service: { name: appointment.service, price: appointment.price },
              date: appointment.date,
              time: appointment.time,
              paymentMethod: 'mercadopago'
          },
          paymentLinkOpened: false,
          pendingAppointmentId: appointment.id,
          shopId: appointment.barbershop_id
      };
      
      localStorage.setItem('barber_pending_booking', JSON.stringify(resumeData));
      setView('client-booking');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white">Meus Agendamentos</h2>
          <p className="text-gray-400 text-sm">Gerencie seus cortes.</p>
        </div>
        <Button onClick={handleNewBooking}><Scissors size={18} /> Novo</Button>
      </div>
      {myApps.length === 0 ? (
        <div className="text-center py-16 bg-gray-800/50 rounded-xl border border-gray-800 border-dashed text-gray-400">
            Você não tem cortes agendados.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {myApps.map(app => (
              <AppointmentCard 
                  key={app.id} 
                  appointment={app} 
                  isClient={true} 
                  barbers={barbers} 
                  supabase={supabase} 
                  onRefresh={onRefresh}
                  onPay={() => handleResumePayment(app)} 
              />
          ))}
        </div>
      )}
    </div>
  );
};

// --- Booking Flow ---

const BookingFlow = ({ user, appointments, onCancel, barbers, supabase, currentShop, services, onRefresh }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ barber: null, service: null, date: '', time: '', paymentMethod: null });
  const [processing, setProcessing] = useState(false);
  const [paymentLinkOpened, setPaymentLinkOpened] = useState(false);
  const [pendingAppointmentId, setPendingAppointmentId] = useState(null);

  // Recupera estado (PERSISTÊNCIA DE REFRESH)
  useEffect(() => {
      const saved = localStorage.getItem('barber_pending_booking');
      if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.shopId === currentShop?.id) {
              setStep(parsed.step);
              setFormData(parsed.formData);
              setPaymentLinkOpened(parsed.paymentLinkOpened);
              setPendingAppointmentId(parsed.pendingAppointmentId);
          }
      }
  }, [currentShop]);

  // Salva estado no localStorage
  useEffect(() => {
      if (currentShop) {
          localStorage.setItem('barber_pending_booking', JSON.stringify({ 
              step, formData, paymentLinkOpened, pendingAppointmentId, shopId: currentShop.id 
          }));
      }
  }, [step, formData, paymentLinkOpened, pendingAppointmentId, currentShop]);

  // LÓGICA DE VERIFICAÇÃO DE PAGAMENTO (RETORNO MP)
  useEffect(() => {
    if (!currentShop) return;
    const params = new URLSearchParams(window.location.search);
    const status = params.get('collection_status'); 
    const externalRef = params.get('external_reference');
    
    if (status === 'approved') {
        // Limpa URL
        const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?shop=" + currentShop.slug;
        window.history.replaceState({path:newUrl},'',newUrl);
        
        if (pendingAppointmentId || externalRef) {
             finalizeBooking(pendingAppointmentId || externalRef);
        }
    }
  }, [currentShop, pendingAppointmentId]);

  const generateTimeSlots = (dateStr, barberId) => {
    if (!dateStr || !currentShop || !currentShop.working_hours) return [];
    const dateObj = new Date(dateStr + 'T00:00:00'); 
    const dayOfWeek = dateObj.getDay(); 
    const dayConfig = currentShop.working_hours[dayOfWeek] || { isOpen: true, start1: '09:00', end1: '12:00', start2: '13:00', end2: '20:00' };

    if (!dayConfig.isOpen) return []; 
    const slots = [];
    
    const addSlots = (start, end) => {
        if (!start || !end) return;
        const startH = parseInt(start.split(':')[0]);
        const endH = parseInt(end.split(':')[0]);
        
        for (let h = startH; h < endH; h++) {
            ['00', '30'].forEach(m => {
                const time = `${h.toString().padStart(2, '0')}:${m}`;
                const isTaken = appointments.some(app => 
                    app.date === dateStr && 
                    app.time === time && 
                    app.barber_id === barberId && 
                    app.status !== 'cancelled'
                );
                const now = new Date();
                const slotDate = new Date(`${dateStr}T${time}`);
                const isPast = slotDate < now;

                slots.push({ time, available: !isTaken && !isPast });
            });
        }
    };
    addSlots(dayConfig.start1, dayConfig.end1);
    addSlots(dayConfig.start2, dayConfig.end2);
    return slots;
  };

  // --- GERAÇÃO DE PAGAMENTO MERCADO PAGO (API) ---
  const handleGeneratePayment = async () => {
    if (!currentShop.mp_access_token) {
       // FALLBACK: Link Manual
       const paymentUrl = currentShop.payment_link || DEFAULT_PAYMENT_LINK;
       window.open(paymentUrl, '_blank');
       setPaymentLinkOpened(true);
       return;
    }

    setProcessing(true);
    
    try {
        let tempId = pendingAppointmentId;
        if (!tempId) {
            // Garante que o banco gere o ID
            const { data: newApp, error: dbError } = await supabase.from('appointments').insert([{
                // Removido ID manual para usar default do banco (bigint ou uuid)
                client_id: user.uid,
                client_name: user.displayName,
                client_phone: user.phone, 
                barbershop_id: currentShop.id, 
                barber_id: formData.barber.id,
                barber_name: formData.barber.name,
                service: formData.service.name,
                price: formData.service.price,
                date: formData.date,
                time: formData.time,
                payment_method: 'mercadopago',
                fee_paid: BOOKING_FEE,
                status: 'pending_payment' 
            }]).select().single();

            if (dbError) throw dbError;
            setPendingAppointmentId(newApp.id);
            tempId = newApp.id;
        }

        // Chama API MP
        const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${currentShop.mp_access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                items: [{
                    title: 'Taxa de Agendamento',
                    quantity: 1,
                    currency_id: 'BRL',
                    unit_price: BOOKING_FEE
                }],
                external_reference: tempId.toString(),
                notification_url: `${window.location.origin}/webhook?shop_id=${currentShop.id}`,
                back_urls: {
                    success: window.location.href, 
                    failure: window.location.href,
                    pending: window.location.href
                },
                auto_return: "approved"
            })
        });

        const data = await response.json();
        if (data.init_point) {
            window.open(data.init_point, '_blank');
            setPaymentLinkOpened(true);
        } else {
            alert("Erro ao gerar pagamento. Verifique as chaves da loja.");
        }
    } catch (error) {
        console.error("Erro MP:", error);
        // Fallback se API falhar (CORS, etc)
        const paymentUrl = currentShop.payment_link || DEFAULT_PAYMENT_LINK;
        window.open(paymentUrl, '_blank');
        setPaymentLinkOpened(true);
    }
    setProcessing(false);
  };

  // FINALIZA O AGENDAMENTO
  const finalizeBooking = async (idToConfirm) => {
      setProcessing(true);
      try {
          if (idToConfirm) {
            const { error } = await supabase
                .from('appointments')
                .update({ status: 'confirmed' })
                .eq('id', idToConfirm);

            if (error) throw error;
          }

          localStorage.removeItem('barber_pending_booking');
          setPendingAppointmentId(null);
          if (onRefresh) onRefresh();
          onCancel();
          alert("Agendamento Confirmado com Sucesso! ✅");
      } catch (error) {
          console.error(error);
          alert("Erro ao finalizar: " + error.message);
      } finally {
          setProcessing(false);
      }
  };

  // VERIFICAÇÃO MANUAL
  const checkPaymentStatus = async () => {
      // Se não tem integração API, confirma direto (confiança)
      if (!currentShop.mp_access_token) {
          if (pendingAppointmentId) {
             finalizeBooking(pendingAppointmentId);
          } else {
             // Caso extremo: cria novo confirmado
             const { error } = await supabase.from('appointments').insert([{
                client_id: user.uid,
                client_name: user.displayName,
                client_phone: user.phone, 
                barbershop_id: currentShop.id, 
                barber_id: formData.barber.id,
                barber_name: formData.barber.name,
                service: formData.service.name,
                price: formData.service.price,
                date: formData.date,
                time: formData.time,
                payment_method: 'mercadopago',
                fee_paid: BOOKING_FEE,
                status: 'confirmed'
             }]);
             if (!error) {
                 localStorage.removeItem('barber_pending_booking');
                 if (onRefresh) onRefresh(); 
                 onCancel();
                 alert("Agendamento Confirmado!");
             }
          }
          return;
      }

      // Com API
      if (!pendingAppointmentId) return alert("Nenhum pagamento pendente encontrado.");
      
      setProcessing(true);
      try {
          // 1. Verifica Banco
          const { data: appointment } = await supabase.from('appointments').select('status').eq('id', pendingAppointmentId).single();
          if (appointment && appointment.status === 'confirmed') {
              finalizeBooking(pendingAppointmentId);
              return;
          }

          // 2. Consulta API MP Direto (Tentativa Frontend)
          try {
              const response = await fetch(`https://api.mercadopago.com/v1/payments/search?external_reference=${pendingAppointmentId}`, {
                  headers: { 'Authorization': `Bearer ${currentShop.mp_access_token}` }
              });
              const data = await response.json();
              if (data.results && data.results.some(p => p.status === 'approved')) {
                  finalizeBooking(pendingAppointmentId);
                  return;
              }
          } catch(e) { console.warn("CORS bloqueou API direta"); }

          alert("Pagamento ainda não confirmado. Se já pagou, aguarde um instante e tente novamente.");

      } catch (error) {
          alert("Erro ao verificar.");
      } finally {
          setProcessing(false);
      }
  };
  
  const handleCancelFlow = () => {
      localStorage.removeItem('barber_pending_booking');
      onCancel();
  };

  const isDayClosed = () => {
      if(!formData.date || !currentShop.working_hours) return false;
      const dayOfWeek = new Date(formData.date + 'T00:00:00').getDay();
      return !currentShop.working_hours[dayOfWeek]?.isOpen;
  };

  return (
    <div className="max-w-2xl mx-auto">
       <div className="mb-4"><button onClick={handleCancelFlow} className="text-gray-400 hover:text-white">Voltar</button></div>
       <Card>
         {step === 1 && (
            <div className="space-y-3">
                <h3 className="text-xl font-bold text-white">Escolha o Profissional</h3>
                {barbers.length === 0 ? <p className="text-gray-400">Nenhum barbeiro disponível.</p> : barbers.map(b => (
                    <button key={b.id} onClick={() => { setFormData({...formData, barber: b}); setStep(2); }} className="w-full flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition gap-4">
                        <Avatar src={b.image} size="lg" />
                        <div className="text-left"><p className="font-bold text-white">{b.name}</p><p className="text-sm text-gray-400">{b.specialty}</p></div>
                    </button>
                ))}
            </div>
         )}
         {step === 2 && (
             <div className="space-y-3">
                 <h3 className="text-xl font-bold text-white">Escolha o Serviço</h3>
                 {services.length === 0 ? <p className="text-gray-400">Nenhum serviço cadastrado nesta loja.</p> : services.map(s => (
                     <button key={s.id} onClick={() => { setFormData({...formData, service: s}); setStep(3); }} className="w-full flex justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 text-white">
                         <span>{s.name}</span><span className="font-bold text-amber-500">R$ {s.price}</span>
                     </button>
                 ))}
                 <Button variant="secondary" onClick={() => setStep(1)} className="w-full">Voltar</Button>
             </div>
         )}
         {step === 3 && (
             <div className="space-y-4">
                 <h3 className="text-xl font-bold text-white">Data e Hora</h3>
                 <input type="date" min={new Date().toISOString().split('T')[0]} value={formData.date} onChange={e => setFormData({...formData, date: e.target.value, time: ''})} className="w-full bg-gray-700 p-3 rounded text-white" />
                 
                 {isDayClosed() && (
                     <div className="bg-red-900/20 text-red-400 p-3 rounded border border-red-900/50 text-center">
                         <AlertCircle className="inline-block mr-2 mb-1" size={16}/>
                         Fechado neste dia da semana.
                     </div>
                 )}

                 {formData.date && !isDayClosed() && (
                     <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-60 overflow-y-auto">
                         {generateTimeSlots(formData.date, formData.barber.id).map(({time, available}) => (
                             <button key={time} disabled={!available} onClick={() => setFormData({...formData, time})} className={`p-2 rounded text-sm ${formData.time === time ? 'bg-amber-600 text-white' : available ? 'bg-gray-700 text-gray-200' : 'bg-gray-800 text-gray-600 line-through'}`}>{time}</button>
                         ))}
                     </div>
                 )}
                 <div className="flex gap-2">
                     <Button variant="secondary" onClick={() => setStep(2)} className="flex-1">Voltar</Button>
                     <Button disabled={!formData.time} onClick={() => setStep(4)} className="flex-1">Ir para Pagamento</Button>
                 </div>
             </div>
         )}
         {step === 4 && (
             <div className="space-y-6 text-center">
                 <h3 className="text-xl font-bold text-white">Taxa de Agendamento (R$ {BOOKING_FEE})</h3>
                 {!formData.paymentMethod ? (
                     <div className="space-y-3">
                         <button onClick={() => setFormData({...formData, paymentMethod: 'pix'})} className="w-full p-4 bg-gray-700 rounded hover:bg-[#009EE3] text-white font-bold flex items-center justify-center gap-2"><QrCode /> Pagar com PIX</button>
                     </div>
                 ) : (
                     <div className="p-4 bg-blue-900/20 rounded border border-blue-500/30 space-y-4">
                         <p className="text-gray-300">
                             {paymentLinkOpened ? "Pagamento iniciado! Aguardando confirmação..." : "Clique abaixo para abrir o pagamento seguro."}
                         </p>
                         
                         {/* BOTÃO 1: ABRIR PAGAMENTO */}
                         <Button variant="mercadopago" onClick={handleGeneratePayment} className="w-full" disabled={paymentLinkOpened}>
                             <ExternalLink size={18} /> 1. Pagar no Mercado Pago
                         </Button>

                         {/* BOTÃO 2: VERIFICAR (SEMPRE VISÍVEL APÓS CLIQUE) */}
                         {paymentLinkOpened && (
                             <div className="animate-in fade-in slide-in-from-bottom-2 pt-4 border-t border-gray-600 mt-2">
                                 <p className="text-xs text-amber-400 mb-2">Já pagou? Clique para confirmar:</p>
                                 <Button disabled={processing} onClick={checkPaymentStatus} className="w-full bg-green-600 hover:bg-green-700">
                                     <CheckCircle size={18} /> 2. Já realizei o pagamento
                                 </Button>
                                 <p className="text-[10px] text-gray-500 mt-2 text-center">
                                    O link não abriu? <button className="underline text-blue-400" onClick={() => {setPaymentLinkOpened(false)}}>Tentar novamente</button>
                                 </p>
                             </div>
                         )}
                     </div>
                 )}
             </div>
         )}
       </Card>
    </div>
  );
};

// --- Barber/Owner Dashboard ---

const BarberDashboard = ({ appointments, currentBarberId, barbers, user, supabase, currentShop, services, onRefresh, onUpdateUser }) => {
  const [filter, setFilter] = useState(currentBarberId || 'all');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [showSettings, setShowSettings] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showShopModal, setShowShopModal] = useState(false);
  
  // Estados
  const [newPassword, setNewPassword] = useState('');
  const [newProfilePhoto, setNewProfilePhoto] = useState(user.photo || '');
  const [newBarber, setNewBarber] = useState({ name: '', phone: '', password: '', specialty: '', image: '' });
  
  // Configs Loja
  const [shopLogoUrl, setShopLogoUrl] = useState(currentShop?.logo_url || '');
  const [mpAccessToken, setMpAccessToken] = useState(currentShop?.mp_access_token || '');
  const [mpPublicKey, setMpPublicKey] = useState(currentShop?.mp_public_key || '');
  const [shopPaymentLink, setShopPaymentLink] = useState(currentShop?.payment_link || '');
  const [workingHours, setWorkingHours] = useState(currentShop?.working_hours || {});
  
  const [newService, setNewService] = useState({ name: '', price: '' });
  const [myTeam, setMyTeam] = useState([]);
  const [activeTab, setActiveTab] = useState('general'); 

  const isOwner = user.role === 'owner';
  const canChangePassword = !!currentBarberId; 

  // Atualiza estados quando a loja muda
  useEffect(() => {
      if (showShopModal && currentShop) {
          setShopLogoUrl(currentShop.logo_url || '');
          setShopPaymentLink(currentShop.payment_link || '');
          setMpAccessToken(currentShop.mp_access_token || '');
          setMpPublicKey(currentShop.mp_public_key || '');
          setWorkingHours(currentShop.working_hours || {});
      }
      if (showSettings) {
          setNewProfilePhoto(user.photo || '');
          setNewPassword('');
      }
  }, [showShopModal, showSettings, currentShop?.id, user.photo]);

  // Busca equipe
  useEffect(() => { if (isOwner && user.shopId) fetchMyTeam(); }, [isOwner, user.shopId, showTeamModal, supabase]);

  const fetchMyTeam = async () => {
      if (!isOwner || !user.shopId) return;
      const { data } = await supabase.from('barbers').select('*').eq('barbershop_id', user.shopId);
      if (data) setMyTeam(data);
  };

  // FILTROS
  const filtered = appointments.filter(a => {
      const barberMatch = isOwner ? (filter === 'all' || a.barber_id === filter) : (a.barber_id === currentBarberId);
      const monthMatch = a.date.startsWith(selectedMonth);
      return barberMatch && monthMatch;
  }).sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
  
  const today = new Date().toISOString().split('T')[0];
  const todayApps = appointments.filter(a => a.date === today && a.status !== 'cancelled' && (isOwner ? true : a.barber_id === currentBarberId));

  // AÇÕES BARBEIRO
  const handleAddBarber = async () => {
      if (!newBarber.name || !newBarber.phone || !newBarber.password) return alert("Preencha os campos obrigatórios");
      
      const { data: shopData } = await supabase.from('barbershops').select('barber_limit').eq('id', user.shopId).single();
      const limit = shopData?.barber_limit || 3;
      
      const { count } = await supabase.from('barbers').select('*', { count: 'exact', head: true }).eq('barbershop_id', user.shopId);
      if (count >= limit) return alert(`Seu plano permite apenas ${limit} barbeiros.`);

      const cleanPhone = newBarber.phone.replace(/\D/g, '');
      const { error } = await supabase.from('barbers').insert([{ id: crypto.randomUUID(), name: newBarber.name, phone: cleanPhone, password: newBarber.password, specialty: newBarber.specialty || 'Geral', image: newBarber.image || 'https://via.placeholder.com/150', barbershop_id: user.shopId }]);
      
      if (error) {
          if (error.code === '23505') alert("Erro: Telefone já cadastrado.");
          else alert("Erro: " + error.message);
      } else {
          alert("Barbeiro criado!");
          setNewBarber({ name: '', phone: '', password: '', specialty: '', image: '' });
          fetchMyTeam();
          if(onRefresh) onRefresh();
      }
  };

  const handleDeleteBarber = async (id) => {
      if (!confirm("Tem certeza?")) return;
      await supabase.from('barbers').delete().eq('id', id);
      fetchMyTeam(); if(onRefresh) onRefresh();
  };

  // AÇÕES SETTINGS
  const handleUpdateShopSettings = async () => {
      const updates = { 
          logo_url: shopLogoUrl, 
          mp_access_token: mpAccessToken, 
          mp_public_key: mpPublicKey, 
          payment_link: shopPaymentLink, 
          working_hours: workingHours 
      };
      const { error } = await supabase.from('barbershops').update(updates).eq('id', user.shopId);
      if (error) alert("Erro: " + error.message);
      else { alert("Salvo!"); setShowShopModal(false); if(onRefresh) onRefresh(); }
  };

  const handleAddService = async () => {
      if (!user.shopId) return alert("Erro de sessão.");
      if (!newService.name || !newService.price) return alert("Preencha nome e preço.");
      const { error } = await supabase.from('services').insert([{ barbershop_id: user.shopId, name: newService.name, price: parseFloat(newService.price) }]);
      if (error) alert("Erro: " + error.message);
      else { setNewService({ name: '', price: '' }); if(onRefresh) onRefresh(); }
  };

  const handleDeleteService = async (id) => {
      if (!confirm("Excluir?")) return;
      const { error } = await supabase.from('services').delete().eq('id', id);
      if(error) alert("Erro: " + error.message); else if(onRefresh) onRefresh();
  };

  const handleUpdateProfile = async () => {
      const updates = {};
      if (newPassword.trim()) updates.password = newPassword;
      if (newProfilePhoto.trim()) updates.image = newProfilePhoto; 
      if (isOwner) {
          if (newProfilePhoto.trim()) updates.owner_image = newProfilePhoto;
          delete updates.image; 
      }
      if (Object.keys(updates).length === 0) return alert("Nada para atualizar.");
      
      const table = isOwner ? 'barbershops' : 'barbers';
      const id = isOwner ? user.shopId : currentBarberId;
      
      const { error } = await supabase.from(table).update(updates).eq('id', id);
      if (error) alert("Erro: " + error.message);
      else { alert("Perfil atualizado!"); setShowSettings(false); if (newProfilePhoto && onUpdateUser) onUpdateUser({ photo: newProfilePhoto }); }
  };

  const handleChangePassword = async () => {
      if(!newPassword.trim()) return alert("Digite uma nova senha.");
      const { error } = await supabase.from('barbers').update({ password: newPassword }).eq('id', currentBarberId);
      if(error) alert("Erro ao atualizar senha.");
      else { alert("Senha atualizada!"); setShowSettings(false); setNewPassword(''); }
  };

  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const filterOptions = isOwner && myTeam.length > 0 ? myTeam : barbers;
  const copyShopLink = () => { const link = `${window.location.origin}/?shop=${currentShop?.slug}`; navigator.clipboard.writeText(link); alert("Link copiado!"); };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div><h2 className="text-3xl font-bold text-white">Painel {isOwner ? 'Administrativo' : 'do Barbeiro'}</h2><p className="text-gray-400 text-sm">{todayApps.length} agendamentos hoje em {currentShop ? currentShop.name : ''}</p></div>
        <div className="flex gap-2">
            {isOwner && (
                <div className="flex flex-wrap gap-2 justify-end">
                  <button onClick={() => setShowTeamModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold transition text-xs sm:text-sm whitespace-nowrap"><Users size={18} /> Equipe</button>
                  <button onClick={() => setShowShopModal(true)} className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded font-bold transition text-xs sm:text-sm whitespace-nowrap"><Settings size={18} /> Configurar Loja</button>
                </div>
            )}
            {canChangePassword && <button onClick={() => setShowSettings(true)} className="p-2 bg-gray-800 rounded hover:bg-gray-700 text-amber-500" title="Configurações"><Settings size={20} /></button>}
            <button onClick={() => setShowSettings(true)} className="p-2 bg-gray-800 rounded hover:bg-gray-700 text-amber-500" title="Meu Perfil"><User size={20} /></button>
        </div>
      </div>

      {isOwner && currentShop && (
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-4"><label className="text-xs text-gray-400 uppercase font-bold mb-2 block">Link da Sua Barbearia</label><div className="flex gap-2"><div className="relative flex-1 bg-gray-900 rounded-lg border border-gray-600 flex items-center px-3"><Globe size={16} className="text-gray-500 mr-2" /><span className="text-white font-mono text-sm truncate py-3">{window.location.origin}/?shop={currentShop?.slug}</span></div><button onClick={copyShopLink} className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-lg font-medium transition flex items-center gap-2"><Copy size={18} /> Copiar</button></div></div>
      )}

      <div className="flex gap-4 bg-gray-800 p-3 rounded-lg items-center flex-wrap">
          <div className="flex items-center gap-2"><Filter size={18} className="text-gray-400"/><span className="text-sm text-gray-400">Filtrar:</span></div>
          <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="bg-gray-700 text-white p-2 rounded text-sm border border-gray-600 outline-none" />
          {isOwner && (<select value={filter} onChange={e => setFilter(e.target.value)} className="bg-gray-700 text-white p-2 rounded w-full md:w-auto text-sm border border-gray-600 outline-none"><option value="all">Todos os Barbeiros</option>{filterOptions.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</select>)}
      </div>

      <Card className="overflow-x-auto"><table className="w-full text-left text-sm text-gray-400"><thead className="text-gray-200 border-b border-gray-700"><tr><th className="p-2">Data</th><th className="p-2">Hora</th><th className="p-2">Cliente</th><th className="p-2">Contato</th>{isOwner && <th className="p-2">Barbeiro</th>}<th className="p-2">Serviço</th><th className="p-2">Status</th></tr></thead><tbody>{filtered.length === 0 ? (<tr><td colSpan="7" className="p-4 text-center text-gray-500">Nenhum agendamento neste período.</td></tr>) : filtered.map(app => (<tr key={app.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition"><td className="p-2 text-white">{app.date.split('-').reverse().join('/')}</td><td className="p-2 text-amber-500 font-bold">{app.time}</td><td className="p-2 font-medium text-white">{app.client_name}</td><td className="p-2 text-xs">{app.client_phone ? (<a href={`https://wa.me/55${app.client_phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-amber-500 hover:text-green-400 font-mono flex items-center gap-1">{app.client_phone} <ExternalLink size={10} /></a>) : '-'}</td>{isOwner && <td className="p-2 text-blue-400">{app.barber_name}</td>}<td className="p-2">{app.service}</td><td className="p-2">{app.status === 'cancelled' ? <span className="text-red-400 bg-red-900/20 px-2 py-1 rounded text-xs">Cancelado</span> : (app.status === 'pending_payment' ? <span className="text-yellow-400 bg-yellow-900/20 px-2 py-1 rounded text-xs">Pendente</span> : <span className="text-green-400 bg-green-900/20 px-2 py-1 rounded text-xs">Confirmado</span>)}</td></tr>))}</tbody></table></Card>
      
      {/* Modal de Configurações PESSOAIS */}
      <Modal isOpen={showSettings} onClose={() => setShowSettings(false)} title="Meu Perfil"><div className="space-y-4"><div><label className="text-sm text-gray-400 block mb-1">Sua Foto (URL)</label><input className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white" placeholder="https://..." value={newProfilePhoto} onChange={(e) => setNewProfilePhoto(e.target.value)} />{newProfilePhoto && <img src={newProfilePhoto} className="w-16 h-16 rounded-full mt-2 object-cover border border-gray-600" alt="Preview" onError={(e) => e.target.style.display='none'} />}</div><div><label className="text-sm text-gray-400 block mb-1">Alterar Senha (Opcional)</label><input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white" placeholder="Nova Senha" /></div><Button onClick={handleUpdateProfile} className="w-full"><Save size={18} /> Salvar Alterações</Button></div></Modal>
      
      <Modal isOpen={showTeamModal} onClose={() => setShowTeamModal(false)} title="Gerenciar Equipe"><div className="space-y-6"><div className="bg-gray-700/50 p-4 rounded border border-gray-600 space-y-3"><h4 className="font-bold text-white flex items-center gap-2"><Plus size={16} className="text-green-400"/> Novo Barbeiro</h4><p className="text-xs text-gray-400">Seu plano permite: {currentShop?.barber_limit || 3} barbeiros. (Atual: {myTeam.length})</p><input className="w-full bg-gray-800 p-2 rounded text-white border border-gray-600" placeholder="Nome Completo" value={newBarber.name} onChange={e => setNewBarber({...newBarber, name: e.target.value})} /><div className="grid grid-cols-2 gap-2"><input className="bg-gray-800 p-2 rounded text-white border border-gray-600" placeholder="Celular (Login)" value={newBarber.phone} onChange={e => setNewBarber({...newBarber, phone: e.target.value})} /><input className="bg-gray-800 p-2 rounded text-white border border-gray-600" placeholder="Senha Inicial" value={newBarber.password} onChange={e => setNewBarber({...newBarber, password: e.target.value})} /></div><input className="w-full bg-gray-800 p-2 rounded text-white border border-gray-600" placeholder="Especialidade (Ex: Degradê)" value={newBarber.specialty} onChange={e => setNewBarber({...newBarber, specialty: e.target.value})} /><Button onClick={handleAddBarber} className="w-full bg-green-600 hover:bg-green-700">Cadastrar Profissional</Button></div><div><h4 className="font-bold text-white mb-2">Equipe Atual</h4><div className="space-y-2 max-h-60 overflow-y-auto">{myTeam.length === 0 ? <p className="text-gray-500 text-sm">Nenhum barbeiro cadastrado.</p> : myTeam.map(b => (<div key={b.id} className="flex justify-between items-center bg-gray-700 p-3 rounded border border-gray-600"><div><p className="font-bold text-white">{b.name}</p><p className="text-xs text-gray-400">{b.phone} • Senha: {b.password}</p></div><button onClick={() => handleDeleteBarber(b.id)} className="text-red-400 hover:text-red-300"><Trash2 size={18} /></button></div>))}</div></div></div></Modal>
      
      {/* Modal de Configurações da Loja */}
      <Modal isOpen={showShopModal} onClose={() => setShowShopModal(false)} title="Configurações da Loja">
          <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
              <div className="flex border-b border-gray-700 mb-4">
                  <button onClick={() => setActiveTab('general')} className={`px-4 py-2 ${activeTab === 'general' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-gray-400'}`}>Geral</button>
                  <button onClick={() => setActiveTab('services')} className={`px-4 py-2 ${activeTab === 'services' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-gray-400'}`}>Serviços</button>
                  <button onClick={() => setActiveTab('hours')} className={`px-4 py-2 ${activeTab === 'hours' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-gray-400'}`}>Horários</button>
              </div>

              {activeTab === 'general' && (<div className="space-y-4"><div><label className="text-sm text-gray-400 mb-1 block">Logo da Barbearia (URL)</label><input className="w-full bg-gray-700 p-3 rounded text-white border border-gray-600 outline-none" placeholder="https://imgur.com/..." value={shopLogoUrl} onChange={e => setShopLogoUrl(e.target.value)} /></div><div className="border-t border-gray-700 pt-4"><h5 className="text-white font-bold mb-2 flex items-center gap-2"><Key size={16}/> Integração Mercado Pago</h5><p className="text-xs text-gray-500 mb-3">Preencha para gerar cobranças automáticas.</p><div className="space-y-2"><input className="w-full bg-gray-800 p-3 rounded text-white border border-gray-600 text-xs font-mono" placeholder="Access Token (APP_USR-...)" value={mpAccessToken} onChange={e => setMpAccessToken(e.target.value)} /><input className="w-full bg-gray-800 p-3 rounded text-white border border-gray-600 text-xs font-mono" placeholder="Public Key (TEST-...)" value={mpPublicKey} onChange={e => setMpPublicKey(e.target.value)} /></div></div><div><label className="text-sm text-gray-400 mb-1 block mt-3">Link de Pagamento (Opcional/Backup)</label><input className="w-full bg-gray-700 p-3 rounded text-white border border-gray-600 outline-none" placeholder="https://mpago.la/..." value={shopPaymentLink} onChange={e => setShopPaymentLink(e.target.value)} /></div></div>)}
              {activeTab === 'services' && (<div className="space-y-4"><div className="bg-gray-700/30 p-3 rounded flex gap-2 items-end"><div className="flex-1"><label className="text-xs text-gray-400">Nome</label><input className="w-full bg-gray-800 p-2 rounded text-white border border-gray-600" placeholder="Ex: Corte" value={newService.name} onChange={e => setNewService({...newService, name: e.target.value})} /></div><div className="w-24"><label className="text-xs text-gray-400">Preço</label><input type="number" className="w-full bg-gray-800 p-2 rounded text-white border border-gray-600" placeholder="0.00" value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})} /></div><button onClick={handleAddService} className="bg-green-600 p-2 rounded text-white hover:bg-green-700 h-[42px] w-[42px] flex items-center justify-center"><Plus size={20}/></button></div><div className="space-y-2">{services.length === 0 ? <p className="text-gray-500 text-sm text-center">Nenhum serviço cadastrado.</p> : services.map(s => (<div key={s.id} className="flex justify-between items-center bg-gray-800 p-3 rounded border border-gray-700"><span className="text-white font-medium">{s.name}</span><div className="flex items-center gap-3"><span className="text-green-400 font-bold">R$ {s.price}</span><button onClick={() => handleDeleteService(s.id)} className="text-red-500 hover:text-red-300"><Trash2 size={16}/></button></div></div>))}</div></div>)}
              {activeTab === 'hours' && (<div className="space-y-3"><p className="text-xs text-gray-400 mb-2">Aberto/Fechado e Turnos (Manhã/Tarde)</p>{daysOfWeek.map((day, index) => { const config = workingHours[index] || { isOpen: true, start1: '09:00', end1: '12:00', start2: '13:00', end2: '19:00' }; return (<div key={index} className={`p-3 rounded border ${config.isOpen ? 'bg-gray-800 border-gray-600' : 'bg-gray-800/50 border-gray-700 opacity-60'}`}><div className="flex items-center gap-3 mb-2"><input type="checkbox" checked={config.isOpen} onChange={(e) => setWorkingHours({ ...workingHours, [index]: { ...config, isOpen: e.target.checked } })} className="w-5 h-5 accent-amber-600 rounded" /><span className={config.isOpen ? "text-white font-medium" : "text-gray-500"}>{day}</span>{!config.isOpen && <span className="text-xs text-red-400 font-bold ml-auto">FECHADO</span>}</div>{config.isOpen && (<div className="grid grid-cols-2 gap-4 pl-8"><div><label className="text-[10px] text-gray-400 block mb-1">Turno 1</label><div className="flex items-center gap-1"><input type="time" value={config.start1} onChange={(e) => setWorkingHours({ ...workingHours, [index]: { ...config, start1: e.target.value } })} className="bg-gray-700 rounded p-1 text-xs text-white w-16" /><span className="text-gray-500">-</span><input type="time" value={config.end1} onChange={(e) => setWorkingHours({ ...workingHours, [index]: { ...config, end1: e.target.value } })} className="bg-gray-700 rounded p-1 text-xs text-white w-16" /></div></div><div><label className="text-[10px] text-gray-400 block mb-1">Turno 2</label><div className="flex items-center gap-1"><input type="time" value={config.start2} onChange={(e) => setWorkingHours({ ...workingHours, [index]: { ...config, start2: e.target.value } })} className="bg-gray-700 rounded p-1 text-xs text-white w-16" /><span className="text-gray-500">-</span><input type="time" value={config.end2} onChange={(e) => setWorkingHours({ ...workingHours, [index]: { ...config, end2: e.target.value } })} className="bg-gray-700 rounded p-1 text-xs text-white w-16" /></div></div></div>)}</div>); })}</div>)}

              <div className="pt-4 mt-4 border-t border-gray-700"><Button onClick={handleUpdateShopSettings} className="w-full bg-blue-600 hover:bg-blue-700">Salvar Todas Alterações</Button></div>
          </div>
      </Modal>
    </div>
  );
};

const AppointmentCard = ({ appointment, isClient, barbers, supabase, onRefresh, onPay }) => {
  const appDate = new Date(`${appointment.date}T${appointment.time}`);
  const canCancel = ((appDate - new Date()) / 36e5) >= 2 && appointment.status !== 'cancelled';
  const barberImage = barbers?.find(b => b.id === appointment.barber_id)?.image;
  const cancelBooking = async () => { if (!confirm('Cancelar agendamento?')) return; const { error } = await supabase.from('appointments').update({ status: 'cancelled' }).eq('id', appointment.id); if (error) alert('Erro ao cancelar'); else if(onRefresh) onRefresh(); };
  return (<Card className={`relative ${appointment.status === 'cancelled' ? 'opacity-50' : 'border-l-4 border-l-amber-500'}`}><div className="flex justify-between mb-2"><span className="bg-gray-700 text-white px-2 py-1 rounded text-xs">{appointment.date.split('-').reverse().join('/')} - {appointment.time}</span>{appointment.status === 'cancelled' && <span className="text-red-400 font-bold text-xs">CANCELADO</span>}{appointment.status === 'pending_payment' && <span className="text-yellow-400 font-bold text-xs">AGUARDANDO PGTO</span>}{appointment.status === 'confirmed' && <span className="text-green-400 font-bold text-xs">CONFIRMADO</span>}</div><h3 className="text-white font-bold">{appointment.service}</h3><div className="flex items-center gap-2 mt-2 mb-3">{barberImage && <Avatar src={barberImage} size="sm" />}<p className="text-gray-400 text-sm">{appointment.barber_name}</p></div>{isClient && appointment.status !== 'cancelled' && (<div className="flex flex-col gap-2">{appointment.status === 'pending_payment' && <Button onClick={onPay} className="w-full bg-green-600 hover:bg-green-700 text-xs py-2"><Wallet size={14}/> Pagar Agora</Button>}{canCancel ? <Button variant="danger" onClick={cancelBooking} className="w-full text-xs py-1 bg-red-900/50 hover:bg-red-900 border border-red-800">Cancelar</Button> : <div className="text-xs text-gray-500 text-center">Cancelamento indisponível</div>}</div>)}</Card>);
};
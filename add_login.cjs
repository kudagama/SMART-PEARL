const fs = require('fs');
const path = 'd:/PROJECTS/SLT-Smart-Directory-Assistant-/src/app/admin/page.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace('CheckCircle2 } from', 'CheckCircle2, Lock, Shield } from');

const stateInsert = `  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-[#0F172A] text-slate-200 min-h-screen w-full">
        <div className="w-full max-w-md bg-[#1E293B] rounded-2xl p-8 border border-slate-700/50 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 border border-blue-500/20">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
            <p className="text-sm text-slate-400">Please sign in to continue</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-4 py-3 bg-[#0F172A] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all" placeholder="Enter username" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 bg-[#0F172A] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all" placeholder="Enter password" />
            </div>
            {loginError && <p className="text-rose-400 text-sm font-medium">Invalid credentials. Please try again.</p>}
            <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center gap-2">
              <Lock className="w-5 h-5" /> Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

`;

content = content.replace("const [serviceId, setServiceId] = useState('');", stateInsert + "  const [serviceId, setServiceId] = useState('');");
fs.writeFileSync(path, content);
console.log('Added login screen successfully');

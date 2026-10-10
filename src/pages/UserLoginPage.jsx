import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  User,
  Phone,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';
import { usePatientAuth } from '../context/PatientAuthContext';
import { useClinic } from '../context/ClinicContext';

const UserLoginPage = () => {
  const { clinic } = useClinic();
  const { loginPatient, registerPatient } = usePatientAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/my-appointments';

  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'

  // Login form state
  const [loginInput, setLoginInput] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!loginInput.trim() || !loginPassword) {
      setErrorMsg('Please enter your email/phone and password.');
      return;
    }

    try {
      setSubmitting(true);
      await loginPatient(loginInput.trim(), loginPassword);
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Invalid credentials. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!regName.trim() || !regPhone.trim() || !regPassword) {
      setErrorMsg('Please fill out all required fields (Name, Phone, Password).');
      return;
    }

    const cleanPhone = regPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit phone number.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    try {
      setSubmitting(true);
      await registerPatient({
        name: regName.trim(),
        phone: regPhone.trim(),
        email: regEmail.trim(),
        password: regPassword,
      });
      setSuccessMsg('Account created successfully! Redirecting...');
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to create account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-navy-900 to-sky-700 text-white flex items-center justify-center shadow-md">
            <Stethoscope className="w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold text-navy-950 tracking-tight">
            {clinic?.name || 'SmileCare Dental'}
          </span>
        </Link>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
          Patient Portal Access
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">
          Log in or create an account to view your appointment history & status.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-slate-100 space-y-6">
          
          {/* Tab Selection */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'login'
                  ? 'bg-white text-navy-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Patient Login
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'register'
                  ? 'bg-white text-navy-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              New Patient Signup
            </button>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
              <div>
                <p className="font-semibold">Authentication Error</p>
                <p className="mt-0.5">{errorMsg}</p>
              </div>
            </div>
          )}

          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-500" />
              <div>
                <p className="font-semibold">Success</p>
                <p className="mt-0.5">{successMsg}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Email or Phone Number</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. rahul@example.com or 9876543210"
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-navy-900 focus:outline-none focus:border-navy-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Password</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-navy-900 focus:outline-none focus:border-navy-900"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-4 rounded-xl bg-navy-900 hover:bg-navy-800 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-2"
              >
                {submitting ? (
                  <span>Logging in...</span>
                ) : (
                  <>
                    <span>Log In to Patient Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Full Name *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Verma"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-navy-900 focus:outline-none focus:border-navy-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Phone Number (10 digits) *</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-navy-900 focus:outline-none focus:border-navy-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Email Address (Optional)</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. rahul@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-navy-900 focus:outline-none focus:border-navy-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Password (min 6 characters) *</span>
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-navy-900 focus:outline-none focus:border-navy-900"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-4 rounded-xl bg-navy-900 hover:bg-navy-800 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-2"
              >
                {submitting ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Create Patient Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-slate-100 text-center">
            <Link
              to="/"
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 inline-flex items-center gap-1"
            >
              <span>← Back to Clinic Website</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLoginPage;

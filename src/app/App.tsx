import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { HomePage } from './components/HomePage';
import { DiagnosisPage } from './components/DiagnosisPage';
import { ResultsPage } from './components/ResultsPage';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';
import { getKBRelations, getComponents, saveHistory, KBRelation, Component, DiagnosisHistory } from './data/adminStore';

type Page = 'home' | 'diagnosis' | 'results' | 'admin-login' | 'admin';

interface DiagnosisResult {
  component: string;
  cfValue: number;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [diagnosisResults, setDiagnosisResults] = useState<DiagnosisResult[]>([]);
  const [mainDiagnosis, setMainDiagnosis] = useState('');
  const [confidence, setConfidence] = useState(0);

  // Load KB and Components dynamically
  const [kb, setKB] = useState<KBRelation[]>([]);
  const [components, setComponents] = useState<Component[]>([]);

  useEffect(() => {
    async function load() {
      const [k, c] = await Promise.all([getKBRelations(), getComponents()]);
      setKB(k);
      setComponents(c);
    }
    load();
  }, [currentPage]); // Reload when switching pages to stay updated

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleStart = () => { setCurrentPage('diagnosis'); scrollTop(); };

  // Strict CF Calculation as per PDF
  const calculateCF = (selected: { code: string; certainty: number }[]): DiagnosisResult[] => {
    const results: DiagnosisResult[] = [];

    components.forEach(comp => {
      // 1. Get rules for this component that match selected symptoms
      const rules = kb.filter(r => r.componentName === comp.name && selected.some(s => s.code === r.symptomCode));

      if (rules.length === 0) {
        results.push({ component: comp.name, cfValue: 0 });
        return;
      }

      // 2. Calculate CF for each rule: CF(H,e) = CF(E,e) * CF(H,E)
      // CF(E,e) is user certainty, CF(H,E) is pakar certainty (MB - MD)
      const cfRules = rules.map(rule => {
        const userCert = selected.find(s => s.code === rule.symptomCode)?.certainty || 0;
        const pakarCert = rule.mbValue - rule.md_value;
        return userCert * pakarCert;
      });

      // 3. Combine CFs: CF_combine = CF_old + CF_new * (1 - CF_old)
      let combinedCF = cfRules[0];
      for (let i = 1; i < cfRules.length; i++) {
        combinedCF = combinedCF + cfRules[i] * (1 - combinedCF);
      }

      results.push({
        component: comp.name,
        cfValue: Math.round(combinedCF * 100)
      });
    });

    return results.sort((a, b) => b.cfValue - a.cfValue);
  };

  const handleDiagnose = async (selectedSymptoms: { code: string; certainty: number }[]) => {
    const results = calculateCF(selectedSymptoms);
    setDiagnosisResults(results);

    const top = results[0];
    setMainDiagnosis(top.component);
    setConfidence(top.cfValue);

    // Save to history in Supabase
    try {
      await saveHistory({
        symptoms: selectedSymptoms,
        mainDiagnosis: top.component,
        confidence: top.cfValue,
        allResults: results
      });
    } catch (err) {
      console.error('Failed to save history:', err);
    }

    setCurrentPage('results');
    scrollTop();
  };

  const handleBack = () => {
    if (currentPage === 'results') setCurrentPage('diagnosis');
    else if (currentPage === 'diagnosis') setCurrentPage('home');
    scrollTop();
  };

  const handleReset = () => {
    setCurrentPage('home');
    setDiagnosisResults([]);
    setMainDiagnosis('');
    setConfidence(0);
    scrollTop();
  };

  const handleGoAdmin = () => {
    const isLoggedIn = localStorage.getItem('admin_logged_in') === 'true';
    setCurrentPage(isLoggedIn ? 'admin' : 'admin-login');
    scrollTop();
  };

  const handleAdminLogin = () => {
    setCurrentPage('admin');
    scrollTop();
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('admin_logged_in');
    setCurrentPage('home');
    scrollTop();
  };

  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      {currentPage === 'home' && (
        <HomePage onStart={handleStart} onGoAdmin={handleGoAdmin} />
      )}
      {currentPage === 'diagnosis' && (
        <DiagnosisPage onBack={handleBack} onDiagnose={handleDiagnose} />
      )}
      {currentPage === 'results' && (
        <ResultsPage
          results={diagnosisResults}
          mainDiagnosis={mainDiagnosis}
          confidence={confidence}
          onBack={handleBack}
          onReset={handleReset}
        />
      )}
      {currentPage === 'admin-login' && (
        <AdminLogin onLogin={handleAdminLogin} onBackToHome={() => setCurrentPage('home')} />
      )}
      {currentPage === 'admin' && (
        <AdminLayout
          onLogout={handleAdminLogout}
          onGoToMain={() => { setCurrentPage('home'); scrollTop(); }}
        />
      )}
    </>
  );
}

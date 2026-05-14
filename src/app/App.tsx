import { useState } from 'react';
import { HomePage } from './components/HomePage';
import { DiagnosisPage } from './components/DiagnosisPage';
import { ResultsPage } from './components/ResultsPage';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';

type Page = 'home' | 'diagnosis' | 'results' | 'admin-login' | 'admin';

interface DiagnosisResult {
  component: string;
  cfValue: number;
}

// Knowledge base: mapping symptoms to components with certainty factors
const knowledgeBase: Record<string, Record<string, number>> = {
  'VGA Card': {
    'E01': 0.8, 'E14': 0.9, 'E15': 1.0, 'E16': 0.7, 'E22': 0.6, 'E23': 0.7, 'E24': 0.5
  },
  'Power Supply': {
    'E02': 0.6, 'E04': 0.9, 'E06': 0.7, 'E25': 0.8, 'E26': 0.6
  },
  'RAM': {
    'E03': 0.8, 'E07': 0.7, 'E11': 0.9, 'E12': 0.8, 'E17': 0.6, 'E26': 0.5
  },
  'Harddisk': {
    'E08': 0.8, 'E13': 0.6, 'E18': 0.9, 'E19': 1.0, 'E20': 0.9, 'E21': 0.8, 'E27': 0.7
  },
  'Motherboard': {
    'E04': 0.7, 'E05': 0.8, 'E10': 0.7, 'E12': 0.6
  },
  'Processor': {
    'E06': 0.8, 'E09': 0.7, 'E28': 0.9
  },
  'Monitor': {
    'E22': 0.8, 'E23': 0.9, 'E24': 0.9
  },
  'Overheat': {
    'E25': 0.7, 'E26': 0.8, 'E28': 1.0
  }
};

// Calculate Certainty Factor using combine formula
function calculateCF(symptoms: string[]): DiagnosisResult[] {
  const results: DiagnosisResult[] = [];

  for (const [component, symptomMap] of Object.entries(knowledgeBase)) {
    let combinedCF = 0;

    const relevantSymptoms = symptoms.filter(s => symptomMap[s]);

    if (relevantSymptoms.length === 0) {
      results.push({ component, cfValue: 0 });
      continue;
    }

    // Combine multiple CFs using the formula: CF(combined) = CF1 + CF2 * (1 - CF1)
    combinedCF = symptomMap[relevantSymptoms[0]] || 0;

    for (let i = 1; i < relevantSymptoms.length; i++) {
      const cf2 = symptomMap[relevantSymptoms[i]] || 0;
      combinedCF = combinedCF + cf2 * (1 - combinedCF);
    }

    results.push({
      component,
      cfValue: Math.round(combinedCF * 100)
    });
  }

  return results.sort((a, b) => b.cfValue - a.cfValue);
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [diagnosisResults, setDiagnosisResults] = useState<DiagnosisResult[]>([]);
  const [mainDiagnosis, setMainDiagnosis] = useState('');
  const [confidence, setConfidence] = useState(0);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleStart = () => { setCurrentPage('diagnosis'); scrollTop(); };

  const handleDiagnose = (selectedSymptoms: string[]) => {
    const results = calculateCF(selectedSymptoms);
    setDiagnosisResults(results);
    const top = results[0];
    setMainDiagnosis(top.component);
    setConfidence(top.cfValue);
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

/**
 * exportTypes.ts
 * Centralized type definitions for the CF diagnosis export system.
 * Decoupled from adminStore to allow the export layer to evolve independently.
 */

import type { DiagnosisHistory, Symptom, KBRelation } from '../data/adminStore';

// Re-export base types for convenience
export type { DiagnosisHistory, Symptom, KBRelation };

/**
 * Represents one row in the CF calculation breakdown for a single gejala–komponen pair.
 */
export interface CFCalculationRow {
  symptomCode: string;
  symptomName: string;
  mb: number;
  md: number;
  cfPakar: number;       // CF(H,E) = MB - MD
  cfUser: number;        // CF(E,e) = user certainty level
  cfHasil: number;       // CF(H,e) = cfUser * cfPakar
}

/**
 * Represents the step-by-step combination process for a component.
 */
export interface CFCombineStep {
  step: number;
  symptomCode: string;
  cfNew: number;
  cfOld: number;
  cfCombined: number;    // CF_old + CF_new * (1 - CF_old)
}

/**
 * Full breakdown of CF computation for one component (kerusakan).
 */
export interface CFComponentBreakdown {
  componentName: string;
  rows: CFCalculationRow[];
  combineSteps: CFCombineStep[];
  finalCF: number;       // As decimal 0–1
  finalPercent: number;  // As integer percentage
}

/**
 * A diagnosis result entry with its rank for Sheet 4.
 */
export interface RankedResult {
  rank: number;
  component: string;
  percent: number;
  status: 'Tinggi' | 'Sedang' | 'Rendah';
}

/**
 * Solution mapping per component for Sheet 5.
 */
export interface ComponentSolution {
  component: string;
  solution: string;
  advice: string;
}

/**
 * All computed data needed to generate the single-history Excel workbook.
 */
export interface SingleExportPayload {
  history: DiagnosisHistory;
  symptoms: Symptom[];
  kbRelations: KBRelation[];
}

/**
 * Context passed to the export-all function.
 */
export interface AllExportPayload {
  history: DiagnosisHistory[];
  symptoms: Symptom[];
}

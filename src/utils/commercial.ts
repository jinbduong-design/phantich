import {
  DataBasis,
  MarketProfile,
  OperationsProfile,
  UnitEconomics,
} from '../types/product';

export const EMPTY_MARKET_PROFILE: MarketProfile = {
  basis: 'unknown',
  customerSegment: 'Chưa xác định',
  marketScope: 'Chưa xác định',
  targetMarkets: [],
  channels: [],
  notes: '',
};

export const EMPTY_ECONOMICS: UnitEconomics = {
  currency: 'VND',
  basis: 'unknown',
};

export const EMPTY_OPERATIONS: OperationsProfile = {
  basis: 'unknown',
  productionModel: 'Chưa xác định',
  fulfillmentModel: 'Chưa xác định',
  supplierCountry: '',
  stockPolicy: '',
  steps: [],
  notes: '',
};

const toOptionalNumber = (value: unknown, max?: number) => {
  if (value === '' || value === undefined || value === null) return undefined;
  const number = Number(value);
  if (!Number.isFinite(number)) return undefined;
  const normalized = Math.max(0, number);
  return max === undefined ? normalized : Math.min(max, normalized);
};

const normalizeBasis = (value: unknown): DataBasis =>
  value === 'hypothesis' || value === 'quote' || value === 'actual'
    ? value
    : 'unknown';

const cleanStrings = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : typeof value === 'string'
      ? value.split(',').map((item) => item.trim()).filter(Boolean)
      : [];

export const normalizeMarketProfile = (input?: Partial<MarketProfile>): MarketProfile => ({
  ...EMPTY_MARKET_PROFILE,
  ...(input || {}),
  basis: normalizeBasis(input?.basis),
  ageMin: toOptionalNumber(input?.ageMin, 100),
  ageMax: toOptionalNumber(input?.ageMax, 100),
  targetMarkets: cleanStrings(input?.targetMarkets),
  channels: cleanStrings(input?.channels),
  notes: typeof input?.notes === 'string' ? input.notes : '',
});

export const normalizeEconomics = (input?: Partial<UnitEconomics>): UnitEconomics => ({
  ...EMPTY_ECONOMICS,
  ...(input || {}),
  currency: input?.currency === 'USD' ? 'USD' : 'VND',
  basis: normalizeBasis(input?.basis),
  importUnitCost: toOptionalNumber(input?.importUnitCost),
  materialCost: toOptionalNumber(input?.materialCost),
  laborCost: toOptionalNumber(input?.laborCost),
  packagingCost: toOptionalNumber(input?.packagingCost),
  otherUnitCost: toOptionalNumber(input?.otherUnitCost),
  platformFeePct: toOptionalNumber(input?.platformFeePct, 100),
  targetSellingPrice: toOptionalNumber(input?.targetSellingPrice),
});

export const normalizeOperations = (input?: Partial<OperationsProfile>): OperationsProfile => ({
  ...EMPTY_OPERATIONS,
  ...(input || {}),
  basis: normalizeBasis(input?.basis),
  supplierCountry: typeof input?.supplierCountry === 'string' ? input.supplierCountry : '',
  moq: toOptionalNumber(input?.moq),
  supplierLeadTimeDays: toOptionalNumber(input?.supplierLeadTimeDays),
  completionTimeHours: toOptionalNumber(input?.completionTimeHours),
  qcTimeMinutes: toOptionalNumber(input?.qcTimeMinutes),
  stockPolicy: typeof input?.stockPolicy === 'string' ? input.stockPolicy : '',
  notes: typeof input?.notes === 'string' ? input.notes : '',
  steps: Array.isArray(input?.steps)
    ? input.steps
        .filter((step) => step && typeof step.name === 'string' && step.name.trim())
        .map((step, index) => ({
          id: step.id || `step-${index + 1}`,
          name: step.name.trim(),
          owner: typeof step.owner === 'string' ? step.owner.trim() : '',
          durationMinutes: toOptionalNumber(step.durationMinutes),
          note: typeof step.note === 'string' ? step.note.trim() : '',
        }))
    : [],
});

export const calculateUnitEconomics = (input?: Partial<UnitEconomics>) => {
  const economics = normalizeEconomics(input);
  const baseUnitCost =
    (economics.importUnitCost || 0) +
    (economics.materialCost || 0) +
    (economics.laborCost || 0) +
    (economics.packagingCost || 0) +
    (economics.otherUnitCost || 0);

  const sellingPrice = economics.targetSellingPrice || 0;
  const platformFee = sellingPrice * ((economics.platformFeePct || 0) / 100);
  const contribution = sellingPrice > 0 ? sellingPrice - baseUnitCost - platformFee : undefined;
  const contributionMarginPct =
    contribution !== undefined && sellingPrice > 0
      ? (contribution / sellingPrice) * 100
      : undefined;
  const markup =
    baseUnitCost > 0 && sellingPrice > 0 ? sellingPrice / baseUnitCost : undefined;

  return {
    economics,
    baseUnitCost,
    platformFee,
    contribution,
    contributionMarginPct,
    markup,
  };
};

export const basisLabel: Record<DataBasis, string> = {
  unknown: 'Chưa xác định',
  hypothesis: 'Giả thuyết',
  quote: 'Báo giá',
  actual: 'Thực tế',
};

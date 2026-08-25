import type {
  DisqualificationReason,
  LeadQualification,
} from "@/prisma/generated/client"

export const QUALIFICATION_SCORE = {
  propertyCount: {
    "under-5": 0,
    "5-15": 20,
    "16-25": 30,
    "25+": 35,
  },
  revenueRange: {
    "under-10m": 0,
    "10m-20m": 20,
    "21m-50m": 30,
    "50m+": 35,
  },
  isTodero: {
    yes: 15,
    no: 0,
  },
  wantsToScale: {
    yes: 10,
    no: 0,
  },
  usesAi: {
    yes: 5,
    no: 0,
  },
} as const

export const QUALIFICATION_THRESHOLDS = {
  sqlMin: 70,
  mqlMin: 40,
} as const

export type QualifyLeadInput = {
  propertyCount?: string
  revenueRange?: string
  isTodero?: string
  usesAi?: string
  wantsToScale?: string
}

const SCORING_FIELDS = ["propertyCount", "revenueRange", "isTodero", "usesAi", "wantsToScale"] as const

export function canClassifyLead(input: QualifyLeadInput) {
  if (input.revenueRange === "under-10m") return true
  return SCORING_FIELDS.every((field) => Boolean(input[field]))
}

export type QualificationScoreBreakdown = {
  propertyCount: number
  revenueRange: number
  isTodero: number
  wantsToScale: number
  usesAi: number
  total: number
}

export type LeadClassification = {
  qualification: LeadQualification
  qualificationScore: number | null
  disqualificationReason: DisqualificationReason | null
  scoreBreakdown: QualificationScoreBreakdown | null
}

function scoreOf(table: Record<string, number>, value: string | undefined) {
  if (!value) return 0
  return table[value] ?? 0
}

export function classifyLead(input: QualifyLeadInput): LeadClassification {
  if (input.revenueRange === "under-10m") {
    return {
      qualification: "DISQUALIFIED",
      qualificationScore: null,
      disqualificationReason: "REVENUE_VETO",
      scoreBreakdown: null,
    }
  }

  const scoreBreakdown: QualificationScoreBreakdown = {
    propertyCount: scoreOf(QUALIFICATION_SCORE.propertyCount, input.propertyCount),
    revenueRange: scoreOf(QUALIFICATION_SCORE.revenueRange, input.revenueRange),
    isTodero: scoreOf(QUALIFICATION_SCORE.isTodero, input.isTodero),
    wantsToScale: scoreOf(QUALIFICATION_SCORE.wantsToScale, input.wantsToScale),
    usesAi: scoreOf(QUALIFICATION_SCORE.usesAi, input.usesAi),
    total: 0,
  }
  scoreBreakdown.total =
    scoreBreakdown.propertyCount +
    scoreBreakdown.revenueRange +
    scoreBreakdown.isTodero +
    scoreBreakdown.wantsToScale +
    scoreBreakdown.usesAi

  if (scoreBreakdown.total >= QUALIFICATION_THRESHOLDS.sqlMin) {
    return {
      qualification: "SQL",
      qualificationScore: scoreBreakdown.total,
      disqualificationReason: null,
      scoreBreakdown,
    }
  }

  if (scoreBreakdown.total >= QUALIFICATION_THRESHOLDS.mqlMin) {
    return {
      qualification: "MQL",
      qualificationScore: scoreBreakdown.total,
      disqualificationReason: null,
      scoreBreakdown,
    }
  }

  return {
    qualification: "DISQUALIFIED",
    qualificationScore: scoreBreakdown.total,
    disqualificationReason: "LOW_SCORE",
    scoreBreakdown,
  }
}

export function getLeadPostSubmitPath(qualification: LeadQualification, token: string) {
  const lead = encodeURIComponent(token)
  if (qualification === "SQL") return `/diagnostico?lead=${lead}`
  return `/gracias?lead=${lead}`
}

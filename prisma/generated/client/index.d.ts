
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Contact
 * 
 */
export type Contact = $Result.DefaultSelection<Prisma.$ContactPayload>
/**
 * Model FormSubmission
 * 
 */
export type FormSubmission = $Result.DefaultSelection<Prisma.$FormSubmissionPayload>
/**
 * Model LeadEvent
 * 
 */
export type LeadEvent = $Result.DefaultSelection<Prisma.$LeadEventPayload>
/**
 * Model VideoWatchSession
 * 
 */
export type VideoWatchSession = $Result.DefaultSelection<Prisma.$VideoWatchSessionPayload>
/**
 * Model LeadPipeline
 * 
 */
export type LeadPipeline = $Result.DefaultSelection<Prisma.$LeadPipelinePayload>
/**
 * Model Conversation
 * 
 */
export type Conversation = $Result.DefaultSelection<Prisma.$ConversationPayload>
/**
 * Model ConversationMessage
 * 
 */
export type ConversationMessage = $Result.DefaultSelection<Prisma.$ConversationMessagePayload>
/**
 * Model PipelineJob
 * 
 */
export type PipelineJob = $Result.DefaultSelection<Prisma.$PipelineJobPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const PmsUsage: {
  YES: 'YES',
  NO: 'NO',
  EVALUATING: 'EVALUATING'
};

export type PmsUsage = (typeof PmsUsage)[keyof typeof PmsUsage]


export const PropertyCount: {
  UNDER_5: 'UNDER_5',
  FIVE_TO_FIFTEEN: 'FIVE_TO_FIFTEEN',
  SIXTEEN_TO_TWENTY_FIVE: 'SIXTEEN_TO_TWENTY_FIVE',
  OVER_25: 'OVER_25'
};

export type PropertyCount = (typeof PropertyCount)[keyof typeof PropertyCount]


export const RevenueRange: {
  UNDER_10M: 'UNDER_10M',
  TEN_TO_TWENTY_M: 'TEN_TO_TWENTY_M',
  TWENTY_ONE_TO_FIFTY_M: 'TWENTY_ONE_TO_FIFTY_M',
  OVER_50M: 'OVER_50M'
};

export type RevenueRange = (typeof RevenueRange)[keyof typeof RevenueRange]


export const YesNo: {
  YES: 'YES',
  NO: 'NO'
};

export type YesNo = (typeof YesNo)[keyof typeof YesNo]


export const IndustryTime: {
  UNDER_5: 'UNDER_5',
  FIVE_TO_TEN: 'FIVE_TO_TEN',
  OVER_10: 'OVER_10'
};

export type IndustryTime = (typeof IndustryTime)[keyof typeof IndustryTime]


export const SubmissionStatus: {
  PARTIAL: 'PARTIAL',
  NEW: 'NEW',
  REVIEWING: 'REVIEWING',
  CONTACTED: 'CONTACTED',
  MEETING_SCHEDULED: 'MEETING_SCHEDULED',
  PROPOSAL_SENT: 'PROPOSAL_SENT',
  CLOSED_WON: 'CLOSED_WON',
  CLOSED_LOST: 'CLOSED_LOST'
};

export type SubmissionStatus = (typeof SubmissionStatus)[keyof typeof SubmissionStatus]


export const LeadQualification: {
  SQL: 'SQL',
  MQL: 'MQL',
  DISQUALIFIED: 'DISQUALIFIED'
};

export type LeadQualification = (typeof LeadQualification)[keyof typeof LeadQualification]


export const DisqualificationReason: {
  REVENUE_VETO: 'REVENUE_VETO',
  LOW_SCORE: 'LOW_SCORE'
};

export type DisqualificationReason = (typeof DisqualificationReason)[keyof typeof DisqualificationReason]


export const LeadEntrySource: {
  EBOOK: 'EBOOK',
  DIAGNOSIS: 'DIAGNOSIS',
  DIRECT_BOOKING: 'DIRECT_BOOKING'
};

export type LeadEntrySource = (typeof LeadEntrySource)[keyof typeof LeadEntrySource]


export const BookingFlow: {
  EBOOK_SQL: 'EBOOK_SQL',
  EBOOK_PDF: 'EBOOK_PDF',
  DIAGNOSIS_PUBLIC: 'DIAGNOSIS_PUBLIC',
  DIRECT_BOOKING: 'DIRECT_BOOKING'
};

export type BookingFlow = (typeof BookingFlow)[keyof typeof BookingFlow]


export const FunnelOrigin: {
  SQL: 'SQL',
  MQL: 'MQL',
  DIRECT_BOOKING: 'DIRECT_BOOKING'
};

export type FunnelOrigin = (typeof FunnelOrigin)[keyof typeof FunnelOrigin]


export const PipelineStage: {
  NURTURING: 'NURTURING',
  PRE_MEETING: 'PRE_MEETING',
  PRE_DEMO: 'PRE_DEMO',
  POST_DEMO: 'POST_DEMO'
};

export type PipelineStage = (typeof PipelineStage)[keyof typeof PipelineStage]


export const PipelineState: {
  LEAD_MAGNET_DOWNLOADED: 'LEAD_MAGNET_DOWNLOADED',
  AWAITING_CONFIRMATION: 'AWAITING_CONFIRMATION',
  QUALIFICATION_OFFERED: 'QUALIFICATION_OFFERED',
  QUALIFYING_Q1: 'QUALIFYING_Q1',
  QUALIFYING_Q2: 'QUALIFYING_Q2',
  QUALIFYING_Q3: 'QUALIFYING_Q3',
  FIT_CONFIRMED: 'FIT_CONFIRMED',
  DISQUALIFIED: 'DISQUALIFIED',
  VIDEO_SENT: 'VIDEO_SENT',
  CTA_SENT_SAW_VIDEO: 'CTA_SENT_SAW_VIDEO',
  CTA_SENT_NO_VIDEO: 'CTA_SENT_NO_VIDEO',
  LAST_NURTURE_SENT: 'LAST_NURTURE_SENT',
  COLD_CALL_QUEUED: 'COLD_CALL_QUEUED',
  SCHEDULED: 'SCHEDULED',
  LOST: 'LOST',
  LONG_TERM_NURTURE: 'LONG_TERM_NURTURE',
  MEETING_SCHEDULED: 'MEETING_SCHEDULED',
  CONFIRMATION_SENT: 'CONFIRMATION_SENT',
  REMINDER_48H: 'REMINDER_48H',
  REMINDER_24H: 'REMINDER_24H',
  REMINDER_8AM_DAY_OF: 'REMINDER_8AM_DAY_OF',
  REMINDER_30MIN: 'REMINDER_30MIN',
  ATTENDED: 'ATTENDED',
  NO_SHOW: 'NO_SHOW',
  RESCHEDULE_OFFERED: 'RESCHEDULE_OFFERED',
  DISCOVERY_COMPLETED: 'DISCOVERY_COMPLETED',
  DISCOVERY_SUMMARY_SENT: 'DISCOVERY_SUMMARY_SENT',
  DEMO_CONFIRMATION_SENT: 'DEMO_CONFIRMATION_SENT',
  DEMO_REMINDER_48H: 'DEMO_REMINDER_48H',
  DEMO_REMINDER_24H: 'DEMO_REMINDER_24H',
  DEMO_REMINDER_8AM: 'DEMO_REMINDER_8AM',
  DEMO_REMINDER_30MIN: 'DEMO_REMINDER_30MIN',
  QUOTE_PRESENTED: 'QUOTE_PRESENTED',
  WON: 'WON',
  FORMAL_PROPOSAL_SENT: 'FORMAL_PROPOSAL_SENT',
  FOLLOWUP_48H: 'FOLLOWUP_48H',
  FOLLOWUP_5_7_DAYS: 'FOLLOWUP_5_7_DAYS',
  CUTOFF_20_DAYS: 'CUTOFF_20_DAYS'
};

export type PipelineState = (typeof PipelineState)[keyof typeof PipelineState]


export const ConversationChannel: {
  WHATSAPP: 'WHATSAPP'
};

export type ConversationChannel = (typeof ConversationChannel)[keyof typeof ConversationChannel]


export const MessageDirection: {
  INBOUND: 'INBOUND',
  OUTBOUND: 'OUTBOUND'
};

export type MessageDirection = (typeof MessageDirection)[keyof typeof MessageDirection]


export const MessageType: {
  TEXT: 'TEXT',
  TEMPLATE: 'TEMPLATE',
  BUTTON: 'BUTTON',
  INTERACTIVE: 'INTERACTIVE',
  STATUS: 'STATUS',
  AUDIO: 'AUDIO',
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  DOCUMENT: 'DOCUMENT',
  STICKER: 'STICKER',
  LOCATION: 'LOCATION'
};

export type MessageType = (typeof MessageType)[keyof typeof MessageType]


export const MessageStatus: {
  PENDING: 'PENDING',
  SENT: 'SENT',
  DELIVERED: 'DELIVERED',
  READ: 'READ',
  FAILED: 'FAILED'
};

export type MessageStatus = (typeof MessageStatus)[keyof typeof MessageStatus]


export const PipelineJobStatus: {
  PENDING: 'PENDING',
  EXECUTED: 'EXECUTED',
  STALE: 'STALE',
  CANCELLED: 'CANCELLED'
};

export type PipelineJobStatus = (typeof PipelineJobStatus)[keyof typeof PipelineJobStatus]


export const MarketingFunnelStage: {
  LEAD_MAGNET_SENT: 'LEAD_MAGNET_SENT',
  VIDEO_SENT: 'VIDEO_SENT',
  SCHEDULED: 'SCHEDULED',
  SHOWED_UP: 'SHOWED_UP',
  NO_SHOW: 'NO_SHOW',
  PURCHASED: 'PURCHASED'
};

export type MarketingFunnelStage = (typeof MarketingFunnelStage)[keyof typeof MarketingFunnelStage]


export const MarketingEventName: {
  VIEW_CONTENT: 'VIEW_CONTENT',
  LEAD: 'LEAD',
  SCHEDULE: 'SCHEDULE',
  SHOW_UP: 'SHOW_UP',
  PURCHASE: 'PURCHASE'
};

export type MarketingEventName = (typeof MarketingEventName)[keyof typeof MarketingEventName]


export const ContractPlan: {
  THREE_MONTH: 'THREE_MONTH',
  FIVE_MONTH: 'FIVE_MONTH',
  OTHER: 'OTHER'
};

export type ContractPlan = (typeof ContractPlan)[keyof typeof ContractPlan]


export const VideoDropReason: {
  PAUSE: 'PAUSE',
  TAB_HIDDEN: 'TAB_HIDDEN',
  PAGE_LEAVE: 'PAGE_LEAVE',
  SCROLL: 'SCROLL',
  ENDED: 'ENDED'
};

export type VideoDropReason = (typeof VideoDropReason)[keyof typeof VideoDropReason]

}

export type PmsUsage = $Enums.PmsUsage

export const PmsUsage: typeof $Enums.PmsUsage

export type PropertyCount = $Enums.PropertyCount

export const PropertyCount: typeof $Enums.PropertyCount

export type RevenueRange = $Enums.RevenueRange

export const RevenueRange: typeof $Enums.RevenueRange

export type YesNo = $Enums.YesNo

export const YesNo: typeof $Enums.YesNo

export type IndustryTime = $Enums.IndustryTime

export const IndustryTime: typeof $Enums.IndustryTime

export type SubmissionStatus = $Enums.SubmissionStatus

export const SubmissionStatus: typeof $Enums.SubmissionStatus

export type LeadQualification = $Enums.LeadQualification

export const LeadQualification: typeof $Enums.LeadQualification

export type DisqualificationReason = $Enums.DisqualificationReason

export const DisqualificationReason: typeof $Enums.DisqualificationReason

export type LeadEntrySource = $Enums.LeadEntrySource

export const LeadEntrySource: typeof $Enums.LeadEntrySource

export type BookingFlow = $Enums.BookingFlow

export const BookingFlow: typeof $Enums.BookingFlow

export type FunnelOrigin = $Enums.FunnelOrigin

export const FunnelOrigin: typeof $Enums.FunnelOrigin

export type PipelineStage = $Enums.PipelineStage

export const PipelineStage: typeof $Enums.PipelineStage

export type PipelineState = $Enums.PipelineState

export const PipelineState: typeof $Enums.PipelineState

export type ConversationChannel = $Enums.ConversationChannel

export const ConversationChannel: typeof $Enums.ConversationChannel

export type MessageDirection = $Enums.MessageDirection

export const MessageDirection: typeof $Enums.MessageDirection

export type MessageType = $Enums.MessageType

export const MessageType: typeof $Enums.MessageType

export type MessageStatus = $Enums.MessageStatus

export const MessageStatus: typeof $Enums.MessageStatus

export type PipelineJobStatus = $Enums.PipelineJobStatus

export const PipelineJobStatus: typeof $Enums.PipelineJobStatus

export type MarketingFunnelStage = $Enums.MarketingFunnelStage

export const MarketingFunnelStage: typeof $Enums.MarketingFunnelStage

export type MarketingEventName = $Enums.MarketingEventName

export const MarketingEventName: typeof $Enums.MarketingEventName

export type ContractPlan = $Enums.ContractPlan

export const ContractPlan: typeof $Enums.ContractPlan

export type VideoDropReason = $Enums.VideoDropReason

export const VideoDropReason: typeof $Enums.VideoDropReason

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Contacts
 * const contacts = await prisma.contact.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Contacts
   * const contacts = await prisma.contact.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.contact`: Exposes CRUD operations for the **Contact** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Contacts
    * const contacts = await prisma.contact.findMany()
    * ```
    */
  get contact(): Prisma.ContactDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.formSubmission`: Exposes CRUD operations for the **FormSubmission** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FormSubmissions
    * const formSubmissions = await prisma.formSubmission.findMany()
    * ```
    */
  get formSubmission(): Prisma.FormSubmissionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.leadEvent`: Exposes CRUD operations for the **LeadEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LeadEvents
    * const leadEvents = await prisma.leadEvent.findMany()
    * ```
    */
  get leadEvent(): Prisma.LeadEventDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.videoWatchSession`: Exposes CRUD operations for the **VideoWatchSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VideoWatchSessions
    * const videoWatchSessions = await prisma.videoWatchSession.findMany()
    * ```
    */
  get videoWatchSession(): Prisma.VideoWatchSessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.leadPipeline`: Exposes CRUD operations for the **LeadPipeline** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LeadPipelines
    * const leadPipelines = await prisma.leadPipeline.findMany()
    * ```
    */
  get leadPipeline(): Prisma.LeadPipelineDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.conversation`: Exposes CRUD operations for the **Conversation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Conversations
    * const conversations = await prisma.conversation.findMany()
    * ```
    */
  get conversation(): Prisma.ConversationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.conversationMessage`: Exposes CRUD operations for the **ConversationMessage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ConversationMessages
    * const conversationMessages = await prisma.conversationMessage.findMany()
    * ```
    */
  get conversationMessage(): Prisma.ConversationMessageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.pipelineJob`: Exposes CRUD operations for the **PipelineJob** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PipelineJobs
    * const pipelineJobs = await prisma.pipelineJob.findMany()
    * ```
    */
  get pipelineJob(): Prisma.PipelineJobDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.3
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Contact: 'Contact',
    FormSubmission: 'FormSubmission',
    LeadEvent: 'LeadEvent',
    VideoWatchSession: 'VideoWatchSession',
    LeadPipeline: 'LeadPipeline',
    Conversation: 'Conversation',
    ConversationMessage: 'ConversationMessage',
    PipelineJob: 'PipelineJob'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "contact" | "formSubmission" | "leadEvent" | "videoWatchSession" | "leadPipeline" | "conversation" | "conversationMessage" | "pipelineJob"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Contact: {
        payload: Prisma.$ContactPayload<ExtArgs>
        fields: Prisma.ContactFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ContactFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ContactFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactPayload>
          }
          findFirst: {
            args: Prisma.ContactFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ContactFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactPayload>
          }
          findMany: {
            args: Prisma.ContactFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactPayload>[]
          }
          create: {
            args: Prisma.ContactCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactPayload>
          }
          createMany: {
            args: Prisma.ContactCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ContactCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactPayload>[]
          }
          delete: {
            args: Prisma.ContactDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactPayload>
          }
          update: {
            args: Prisma.ContactUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactPayload>
          }
          deleteMany: {
            args: Prisma.ContactDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ContactUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ContactUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactPayload>[]
          }
          upsert: {
            args: Prisma.ContactUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactPayload>
          }
          aggregate: {
            args: Prisma.ContactAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateContact>
          }
          groupBy: {
            args: Prisma.ContactGroupByArgs<ExtArgs>
            result: $Utils.Optional<ContactGroupByOutputType>[]
          }
          count: {
            args: Prisma.ContactCountArgs<ExtArgs>
            result: $Utils.Optional<ContactCountAggregateOutputType> | number
          }
        }
      }
      FormSubmission: {
        payload: Prisma.$FormSubmissionPayload<ExtArgs>
        fields: Prisma.FormSubmissionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FormSubmissionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FormSubmissionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FormSubmissionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FormSubmissionPayload>
          }
          findFirst: {
            args: Prisma.FormSubmissionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FormSubmissionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FormSubmissionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FormSubmissionPayload>
          }
          findMany: {
            args: Prisma.FormSubmissionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FormSubmissionPayload>[]
          }
          create: {
            args: Prisma.FormSubmissionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FormSubmissionPayload>
          }
          createMany: {
            args: Prisma.FormSubmissionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FormSubmissionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FormSubmissionPayload>[]
          }
          delete: {
            args: Prisma.FormSubmissionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FormSubmissionPayload>
          }
          update: {
            args: Prisma.FormSubmissionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FormSubmissionPayload>
          }
          deleteMany: {
            args: Prisma.FormSubmissionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FormSubmissionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FormSubmissionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FormSubmissionPayload>[]
          }
          upsert: {
            args: Prisma.FormSubmissionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FormSubmissionPayload>
          }
          aggregate: {
            args: Prisma.FormSubmissionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFormSubmission>
          }
          groupBy: {
            args: Prisma.FormSubmissionGroupByArgs<ExtArgs>
            result: $Utils.Optional<FormSubmissionGroupByOutputType>[]
          }
          count: {
            args: Prisma.FormSubmissionCountArgs<ExtArgs>
            result: $Utils.Optional<FormSubmissionCountAggregateOutputType> | number
          }
        }
      }
      LeadEvent: {
        payload: Prisma.$LeadEventPayload<ExtArgs>
        fields: Prisma.LeadEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LeadEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LeadEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadEventPayload>
          }
          findFirst: {
            args: Prisma.LeadEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LeadEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadEventPayload>
          }
          findMany: {
            args: Prisma.LeadEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadEventPayload>[]
          }
          create: {
            args: Prisma.LeadEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadEventPayload>
          }
          createMany: {
            args: Prisma.LeadEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LeadEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadEventPayload>[]
          }
          delete: {
            args: Prisma.LeadEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadEventPayload>
          }
          update: {
            args: Prisma.LeadEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadEventPayload>
          }
          deleteMany: {
            args: Prisma.LeadEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LeadEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LeadEventUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadEventPayload>[]
          }
          upsert: {
            args: Prisma.LeadEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadEventPayload>
          }
          aggregate: {
            args: Prisma.LeadEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLeadEvent>
          }
          groupBy: {
            args: Prisma.LeadEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<LeadEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.LeadEventCountArgs<ExtArgs>
            result: $Utils.Optional<LeadEventCountAggregateOutputType> | number
          }
        }
      }
      VideoWatchSession: {
        payload: Prisma.$VideoWatchSessionPayload<ExtArgs>
        fields: Prisma.VideoWatchSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VideoWatchSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VideoWatchSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VideoWatchSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VideoWatchSessionPayload>
          }
          findFirst: {
            args: Prisma.VideoWatchSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VideoWatchSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VideoWatchSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VideoWatchSessionPayload>
          }
          findMany: {
            args: Prisma.VideoWatchSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VideoWatchSessionPayload>[]
          }
          create: {
            args: Prisma.VideoWatchSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VideoWatchSessionPayload>
          }
          createMany: {
            args: Prisma.VideoWatchSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VideoWatchSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VideoWatchSessionPayload>[]
          }
          delete: {
            args: Prisma.VideoWatchSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VideoWatchSessionPayload>
          }
          update: {
            args: Prisma.VideoWatchSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VideoWatchSessionPayload>
          }
          deleteMany: {
            args: Prisma.VideoWatchSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VideoWatchSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VideoWatchSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VideoWatchSessionPayload>[]
          }
          upsert: {
            args: Prisma.VideoWatchSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VideoWatchSessionPayload>
          }
          aggregate: {
            args: Prisma.VideoWatchSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVideoWatchSession>
          }
          groupBy: {
            args: Prisma.VideoWatchSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<VideoWatchSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.VideoWatchSessionCountArgs<ExtArgs>
            result: $Utils.Optional<VideoWatchSessionCountAggregateOutputType> | number
          }
        }
      }
      LeadPipeline: {
        payload: Prisma.$LeadPipelinePayload<ExtArgs>
        fields: Prisma.LeadPipelineFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LeadPipelineFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPipelinePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LeadPipelineFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPipelinePayload>
          }
          findFirst: {
            args: Prisma.LeadPipelineFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPipelinePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LeadPipelineFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPipelinePayload>
          }
          findMany: {
            args: Prisma.LeadPipelineFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPipelinePayload>[]
          }
          create: {
            args: Prisma.LeadPipelineCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPipelinePayload>
          }
          createMany: {
            args: Prisma.LeadPipelineCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LeadPipelineCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPipelinePayload>[]
          }
          delete: {
            args: Prisma.LeadPipelineDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPipelinePayload>
          }
          update: {
            args: Prisma.LeadPipelineUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPipelinePayload>
          }
          deleteMany: {
            args: Prisma.LeadPipelineDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LeadPipelineUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LeadPipelineUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPipelinePayload>[]
          }
          upsert: {
            args: Prisma.LeadPipelineUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPipelinePayload>
          }
          aggregate: {
            args: Prisma.LeadPipelineAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLeadPipeline>
          }
          groupBy: {
            args: Prisma.LeadPipelineGroupByArgs<ExtArgs>
            result: $Utils.Optional<LeadPipelineGroupByOutputType>[]
          }
          count: {
            args: Prisma.LeadPipelineCountArgs<ExtArgs>
            result: $Utils.Optional<LeadPipelineCountAggregateOutputType> | number
          }
        }
      }
      Conversation: {
        payload: Prisma.$ConversationPayload<ExtArgs>
        fields: Prisma.ConversationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ConversationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ConversationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>
          }
          findFirst: {
            args: Prisma.ConversationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ConversationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>
          }
          findMany: {
            args: Prisma.ConversationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>[]
          }
          create: {
            args: Prisma.ConversationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>
          }
          createMany: {
            args: Prisma.ConversationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ConversationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>[]
          }
          delete: {
            args: Prisma.ConversationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>
          }
          update: {
            args: Prisma.ConversationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>
          }
          deleteMany: {
            args: Prisma.ConversationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ConversationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ConversationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>[]
          }
          upsert: {
            args: Prisma.ConversationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>
          }
          aggregate: {
            args: Prisma.ConversationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateConversation>
          }
          groupBy: {
            args: Prisma.ConversationGroupByArgs<ExtArgs>
            result: $Utils.Optional<ConversationGroupByOutputType>[]
          }
          count: {
            args: Prisma.ConversationCountArgs<ExtArgs>
            result: $Utils.Optional<ConversationCountAggregateOutputType> | number
          }
        }
      }
      ConversationMessage: {
        payload: Prisma.$ConversationMessagePayload<ExtArgs>
        fields: Prisma.ConversationMessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ConversationMessageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationMessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ConversationMessageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationMessagePayload>
          }
          findFirst: {
            args: Prisma.ConversationMessageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationMessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ConversationMessageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationMessagePayload>
          }
          findMany: {
            args: Prisma.ConversationMessageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationMessagePayload>[]
          }
          create: {
            args: Prisma.ConversationMessageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationMessagePayload>
          }
          createMany: {
            args: Prisma.ConversationMessageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ConversationMessageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationMessagePayload>[]
          }
          delete: {
            args: Prisma.ConversationMessageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationMessagePayload>
          }
          update: {
            args: Prisma.ConversationMessageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationMessagePayload>
          }
          deleteMany: {
            args: Prisma.ConversationMessageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ConversationMessageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ConversationMessageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationMessagePayload>[]
          }
          upsert: {
            args: Prisma.ConversationMessageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationMessagePayload>
          }
          aggregate: {
            args: Prisma.ConversationMessageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateConversationMessage>
          }
          groupBy: {
            args: Prisma.ConversationMessageGroupByArgs<ExtArgs>
            result: $Utils.Optional<ConversationMessageGroupByOutputType>[]
          }
          count: {
            args: Prisma.ConversationMessageCountArgs<ExtArgs>
            result: $Utils.Optional<ConversationMessageCountAggregateOutputType> | number
          }
        }
      }
      PipelineJob: {
        payload: Prisma.$PipelineJobPayload<ExtArgs>
        fields: Prisma.PipelineJobFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PipelineJobFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PipelineJobPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PipelineJobFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PipelineJobPayload>
          }
          findFirst: {
            args: Prisma.PipelineJobFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PipelineJobPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PipelineJobFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PipelineJobPayload>
          }
          findMany: {
            args: Prisma.PipelineJobFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PipelineJobPayload>[]
          }
          create: {
            args: Prisma.PipelineJobCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PipelineJobPayload>
          }
          createMany: {
            args: Prisma.PipelineJobCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PipelineJobCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PipelineJobPayload>[]
          }
          delete: {
            args: Prisma.PipelineJobDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PipelineJobPayload>
          }
          update: {
            args: Prisma.PipelineJobUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PipelineJobPayload>
          }
          deleteMany: {
            args: Prisma.PipelineJobDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PipelineJobUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PipelineJobUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PipelineJobPayload>[]
          }
          upsert: {
            args: Prisma.PipelineJobUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PipelineJobPayload>
          }
          aggregate: {
            args: Prisma.PipelineJobAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePipelineJob>
          }
          groupBy: {
            args: Prisma.PipelineJobGroupByArgs<ExtArgs>
            result: $Utils.Optional<PipelineJobGroupByOutputType>[]
          }
          count: {
            args: Prisma.PipelineJobCountArgs<ExtArgs>
            result: $Utils.Optional<PipelineJobCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    contact?: ContactOmit
    formSubmission?: FormSubmissionOmit
    leadEvent?: LeadEventOmit
    videoWatchSession?: VideoWatchSessionOmit
    leadPipeline?: LeadPipelineOmit
    conversation?: ConversationOmit
    conversationMessage?: ConversationMessageOmit
    pipelineJob?: PipelineJobOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ContactCountOutputType
   */

  export type ContactCountOutputType = {
    submissions: number
    conversations: number
  }

  export type ContactCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    submissions?: boolean | ContactCountOutputTypeCountSubmissionsArgs
    conversations?: boolean | ContactCountOutputTypeCountConversationsArgs
  }

  // Custom InputTypes
  /**
   * ContactCountOutputType without action
   */
  export type ContactCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactCountOutputType
     */
    select?: ContactCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ContactCountOutputType without action
   */
  export type ContactCountOutputTypeCountSubmissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FormSubmissionWhereInput
  }

  /**
   * ContactCountOutputType without action
   */
  export type ContactCountOutputTypeCountConversationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConversationWhereInput
  }


  /**
   * Count Type FormSubmissionCountOutputType
   */

  export type FormSubmissionCountOutputType = {
    events: number
  }

  export type FormSubmissionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    events?: boolean | FormSubmissionCountOutputTypeCountEventsArgs
  }

  // Custom InputTypes
  /**
   * FormSubmissionCountOutputType without action
   */
  export type FormSubmissionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FormSubmissionCountOutputType
     */
    select?: FormSubmissionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * FormSubmissionCountOutputType without action
   */
  export type FormSubmissionCountOutputTypeCountEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LeadEventWhereInput
  }


  /**
   * Count Type LeadPipelineCountOutputType
   */

  export type LeadPipelineCountOutputType = {
    jobs: number
  }

  export type LeadPipelineCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    jobs?: boolean | LeadPipelineCountOutputTypeCountJobsArgs
  }

  // Custom InputTypes
  /**
   * LeadPipelineCountOutputType without action
   */
  export type LeadPipelineCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeadPipelineCountOutputType
     */
    select?: LeadPipelineCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LeadPipelineCountOutputType without action
   */
  export type LeadPipelineCountOutputTypeCountJobsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PipelineJobWhereInput
  }


  /**
   * Count Type ConversationCountOutputType
   */

  export type ConversationCountOutputType = {
    messages: number
  }

  export type ConversationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    messages?: boolean | ConversationCountOutputTypeCountMessagesArgs
  }

  // Custom InputTypes
  /**
   * ConversationCountOutputType without action
   */
  export type ConversationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationCountOutputType
     */
    select?: ConversationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ConversationCountOutputType without action
   */
  export type ConversationCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConversationMessageWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Contact
   */

  export type AggregateContact = {
    _count: ContactCountAggregateOutputType | null
    _min: ContactMinAggregateOutputType | null
    _max: ContactMaxAggregateOutputType | null
  }

  export type ContactMinAggregateOutputType = {
    id: string | null
    fullName: string | null
    email: string | null
    phoneE164: string | null
    waId: string | null
    phoneCountryCode: string | null
    phoneNumber: string | null
    companyName: string | null
    websiteUrl: string | null
    instagramUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ContactMaxAggregateOutputType = {
    id: string | null
    fullName: string | null
    email: string | null
    phoneE164: string | null
    waId: string | null
    phoneCountryCode: string | null
    phoneNumber: string | null
    companyName: string | null
    websiteUrl: string | null
    instagramUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ContactCountAggregateOutputType = {
    id: number
    fullName: number
    email: number
    phoneE164: number
    waId: number
    phoneCountryCode: number
    phoneNumber: number
    companyName: number
    websiteUrl: number
    instagramUrl: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ContactMinAggregateInputType = {
    id?: true
    fullName?: true
    email?: true
    phoneE164?: true
    waId?: true
    phoneCountryCode?: true
    phoneNumber?: true
    companyName?: true
    websiteUrl?: true
    instagramUrl?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ContactMaxAggregateInputType = {
    id?: true
    fullName?: true
    email?: true
    phoneE164?: true
    waId?: true
    phoneCountryCode?: true
    phoneNumber?: true
    companyName?: true
    websiteUrl?: true
    instagramUrl?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ContactCountAggregateInputType = {
    id?: true
    fullName?: true
    email?: true
    phoneE164?: true
    waId?: true
    phoneCountryCode?: true
    phoneNumber?: true
    companyName?: true
    websiteUrl?: true
    instagramUrl?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ContactAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Contact to aggregate.
     */
    where?: ContactWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Contacts to fetch.
     */
    orderBy?: ContactOrderByWithRelationInput | ContactOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ContactWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Contacts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Contacts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Contacts
    **/
    _count?: true | ContactCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ContactMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ContactMaxAggregateInputType
  }

  export type GetContactAggregateType<T extends ContactAggregateArgs> = {
        [P in keyof T & keyof AggregateContact]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateContact[P]>
      : GetScalarType<T[P], AggregateContact[P]>
  }




  export type ContactGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ContactWhereInput
    orderBy?: ContactOrderByWithAggregationInput | ContactOrderByWithAggregationInput[]
    by: ContactScalarFieldEnum[] | ContactScalarFieldEnum
    having?: ContactScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ContactCountAggregateInputType | true
    _min?: ContactMinAggregateInputType
    _max?: ContactMaxAggregateInputType
  }

  export type ContactGroupByOutputType = {
    id: string
    fullName: string
    email: string | null
    phoneE164: string
    waId: string | null
    phoneCountryCode: string
    phoneNumber: string
    companyName: string | null
    websiteUrl: string | null
    instagramUrl: string | null
    createdAt: Date
    updatedAt: Date
    _count: ContactCountAggregateOutputType | null
    _min: ContactMinAggregateOutputType | null
    _max: ContactMaxAggregateOutputType | null
  }

  type GetContactGroupByPayload<T extends ContactGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ContactGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ContactGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ContactGroupByOutputType[P]>
            : GetScalarType<T[P], ContactGroupByOutputType[P]>
        }
      >
    >


  export type ContactSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fullName?: boolean
    email?: boolean
    phoneE164?: boolean
    waId?: boolean
    phoneCountryCode?: boolean
    phoneNumber?: boolean
    companyName?: boolean
    websiteUrl?: boolean
    instagramUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    submissions?: boolean | Contact$submissionsArgs<ExtArgs>
    pipeline?: boolean | Contact$pipelineArgs<ExtArgs>
    conversations?: boolean | Contact$conversationsArgs<ExtArgs>
    _count?: boolean | ContactCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["contact"]>

  export type ContactSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fullName?: boolean
    email?: boolean
    phoneE164?: boolean
    waId?: boolean
    phoneCountryCode?: boolean
    phoneNumber?: boolean
    companyName?: boolean
    websiteUrl?: boolean
    instagramUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["contact"]>

  export type ContactSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fullName?: boolean
    email?: boolean
    phoneE164?: boolean
    waId?: boolean
    phoneCountryCode?: boolean
    phoneNumber?: boolean
    companyName?: boolean
    websiteUrl?: boolean
    instagramUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["contact"]>

  export type ContactSelectScalar = {
    id?: boolean
    fullName?: boolean
    email?: boolean
    phoneE164?: boolean
    waId?: boolean
    phoneCountryCode?: boolean
    phoneNumber?: boolean
    companyName?: boolean
    websiteUrl?: boolean
    instagramUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ContactOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "fullName" | "email" | "phoneE164" | "waId" | "phoneCountryCode" | "phoneNumber" | "companyName" | "websiteUrl" | "instagramUrl" | "createdAt" | "updatedAt", ExtArgs["result"]["contact"]>
  export type ContactInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    submissions?: boolean | Contact$submissionsArgs<ExtArgs>
    pipeline?: boolean | Contact$pipelineArgs<ExtArgs>
    conversations?: boolean | Contact$conversationsArgs<ExtArgs>
    _count?: boolean | ContactCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ContactIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ContactIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ContactPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Contact"
    objects: {
      submissions: Prisma.$FormSubmissionPayload<ExtArgs>[]
      pipeline: Prisma.$LeadPipelinePayload<ExtArgs> | null
      conversations: Prisma.$ConversationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      fullName: string
      email: string | null
      phoneE164: string
      waId: string | null
      phoneCountryCode: string
      phoneNumber: string
      companyName: string | null
      websiteUrl: string | null
      instagramUrl: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["contact"]>
    composites: {}
  }

  type ContactGetPayload<S extends boolean | null | undefined | ContactDefaultArgs> = $Result.GetResult<Prisma.$ContactPayload, S>

  type ContactCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ContactFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ContactCountAggregateInputType | true
    }

  export interface ContactDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Contact'], meta: { name: 'Contact' } }
    /**
     * Find zero or one Contact that matches the filter.
     * @param {ContactFindUniqueArgs} args - Arguments to find a Contact
     * @example
     * // Get one Contact
     * const contact = await prisma.contact.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ContactFindUniqueArgs>(args: SelectSubset<T, ContactFindUniqueArgs<ExtArgs>>): Prisma__ContactClient<$Result.GetResult<Prisma.$ContactPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Contact that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ContactFindUniqueOrThrowArgs} args - Arguments to find a Contact
     * @example
     * // Get one Contact
     * const contact = await prisma.contact.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ContactFindUniqueOrThrowArgs>(args: SelectSubset<T, ContactFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ContactClient<$Result.GetResult<Prisma.$ContactPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Contact that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactFindFirstArgs} args - Arguments to find a Contact
     * @example
     * // Get one Contact
     * const contact = await prisma.contact.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ContactFindFirstArgs>(args?: SelectSubset<T, ContactFindFirstArgs<ExtArgs>>): Prisma__ContactClient<$Result.GetResult<Prisma.$ContactPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Contact that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactFindFirstOrThrowArgs} args - Arguments to find a Contact
     * @example
     * // Get one Contact
     * const contact = await prisma.contact.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ContactFindFirstOrThrowArgs>(args?: SelectSubset<T, ContactFindFirstOrThrowArgs<ExtArgs>>): Prisma__ContactClient<$Result.GetResult<Prisma.$ContactPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Contacts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Contacts
     * const contacts = await prisma.contact.findMany()
     * 
     * // Get first 10 Contacts
     * const contacts = await prisma.contact.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const contactWithIdOnly = await prisma.contact.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ContactFindManyArgs>(args?: SelectSubset<T, ContactFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContactPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Contact.
     * @param {ContactCreateArgs} args - Arguments to create a Contact.
     * @example
     * // Create one Contact
     * const Contact = await prisma.contact.create({
     *   data: {
     *     // ... data to create a Contact
     *   }
     * })
     * 
     */
    create<T extends ContactCreateArgs>(args: SelectSubset<T, ContactCreateArgs<ExtArgs>>): Prisma__ContactClient<$Result.GetResult<Prisma.$ContactPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Contacts.
     * @param {ContactCreateManyArgs} args - Arguments to create many Contacts.
     * @example
     * // Create many Contacts
     * const contact = await prisma.contact.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ContactCreateManyArgs>(args?: SelectSubset<T, ContactCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Contacts and returns the data saved in the database.
     * @param {ContactCreateManyAndReturnArgs} args - Arguments to create many Contacts.
     * @example
     * // Create many Contacts
     * const contact = await prisma.contact.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Contacts and only return the `id`
     * const contactWithIdOnly = await prisma.contact.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ContactCreateManyAndReturnArgs>(args?: SelectSubset<T, ContactCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContactPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Contact.
     * @param {ContactDeleteArgs} args - Arguments to delete one Contact.
     * @example
     * // Delete one Contact
     * const Contact = await prisma.contact.delete({
     *   where: {
     *     // ... filter to delete one Contact
     *   }
     * })
     * 
     */
    delete<T extends ContactDeleteArgs>(args: SelectSubset<T, ContactDeleteArgs<ExtArgs>>): Prisma__ContactClient<$Result.GetResult<Prisma.$ContactPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Contact.
     * @param {ContactUpdateArgs} args - Arguments to update one Contact.
     * @example
     * // Update one Contact
     * const contact = await prisma.contact.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ContactUpdateArgs>(args: SelectSubset<T, ContactUpdateArgs<ExtArgs>>): Prisma__ContactClient<$Result.GetResult<Prisma.$ContactPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Contacts.
     * @param {ContactDeleteManyArgs} args - Arguments to filter Contacts to delete.
     * @example
     * // Delete a few Contacts
     * const { count } = await prisma.contact.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ContactDeleteManyArgs>(args?: SelectSubset<T, ContactDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Contacts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Contacts
     * const contact = await prisma.contact.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ContactUpdateManyArgs>(args: SelectSubset<T, ContactUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Contacts and returns the data updated in the database.
     * @param {ContactUpdateManyAndReturnArgs} args - Arguments to update many Contacts.
     * @example
     * // Update many Contacts
     * const contact = await prisma.contact.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Contacts and only return the `id`
     * const contactWithIdOnly = await prisma.contact.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ContactUpdateManyAndReturnArgs>(args: SelectSubset<T, ContactUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContactPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Contact.
     * @param {ContactUpsertArgs} args - Arguments to update or create a Contact.
     * @example
     * // Update or create a Contact
     * const contact = await prisma.contact.upsert({
     *   create: {
     *     // ... data to create a Contact
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Contact we want to update
     *   }
     * })
     */
    upsert<T extends ContactUpsertArgs>(args: SelectSubset<T, ContactUpsertArgs<ExtArgs>>): Prisma__ContactClient<$Result.GetResult<Prisma.$ContactPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Contacts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactCountArgs} args - Arguments to filter Contacts to count.
     * @example
     * // Count the number of Contacts
     * const count = await prisma.contact.count({
     *   where: {
     *     // ... the filter for the Contacts we want to count
     *   }
     * })
    **/
    count<T extends ContactCountArgs>(
      args?: Subset<T, ContactCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ContactCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Contact.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ContactAggregateArgs>(args: Subset<T, ContactAggregateArgs>): Prisma.PrismaPromise<GetContactAggregateType<T>>

    /**
     * Group by Contact.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ContactGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ContactGroupByArgs['orderBy'] }
        : { orderBy?: ContactGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ContactGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetContactGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Contact model
   */
  readonly fields: ContactFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Contact.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ContactClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    submissions<T extends Contact$submissionsArgs<ExtArgs> = {}>(args?: Subset<T, Contact$submissionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FormSubmissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    pipeline<T extends Contact$pipelineArgs<ExtArgs> = {}>(args?: Subset<T, Contact$pipelineArgs<ExtArgs>>): Prisma__LeadPipelineClient<$Result.GetResult<Prisma.$LeadPipelinePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    conversations<T extends Contact$conversationsArgs<ExtArgs> = {}>(args?: Subset<T, Contact$conversationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Contact model
   */
  interface ContactFieldRefs {
    readonly id: FieldRef<"Contact", 'String'>
    readonly fullName: FieldRef<"Contact", 'String'>
    readonly email: FieldRef<"Contact", 'String'>
    readonly phoneE164: FieldRef<"Contact", 'String'>
    readonly waId: FieldRef<"Contact", 'String'>
    readonly phoneCountryCode: FieldRef<"Contact", 'String'>
    readonly phoneNumber: FieldRef<"Contact", 'String'>
    readonly companyName: FieldRef<"Contact", 'String'>
    readonly websiteUrl: FieldRef<"Contact", 'String'>
    readonly instagramUrl: FieldRef<"Contact", 'String'>
    readonly createdAt: FieldRef<"Contact", 'DateTime'>
    readonly updatedAt: FieldRef<"Contact", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Contact findUnique
   */
  export type ContactFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contact
     */
    select?: ContactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Contact
     */
    omit?: ContactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInclude<ExtArgs> | null
    /**
     * Filter, which Contact to fetch.
     */
    where: ContactWhereUniqueInput
  }

  /**
   * Contact findUniqueOrThrow
   */
  export type ContactFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contact
     */
    select?: ContactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Contact
     */
    omit?: ContactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInclude<ExtArgs> | null
    /**
     * Filter, which Contact to fetch.
     */
    where: ContactWhereUniqueInput
  }

  /**
   * Contact findFirst
   */
  export type ContactFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contact
     */
    select?: ContactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Contact
     */
    omit?: ContactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInclude<ExtArgs> | null
    /**
     * Filter, which Contact to fetch.
     */
    where?: ContactWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Contacts to fetch.
     */
    orderBy?: ContactOrderByWithRelationInput | ContactOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Contacts.
     */
    cursor?: ContactWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Contacts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Contacts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Contacts.
     */
    distinct?: ContactScalarFieldEnum | ContactScalarFieldEnum[]
  }

  /**
   * Contact findFirstOrThrow
   */
  export type ContactFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contact
     */
    select?: ContactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Contact
     */
    omit?: ContactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInclude<ExtArgs> | null
    /**
     * Filter, which Contact to fetch.
     */
    where?: ContactWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Contacts to fetch.
     */
    orderBy?: ContactOrderByWithRelationInput | ContactOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Contacts.
     */
    cursor?: ContactWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Contacts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Contacts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Contacts.
     */
    distinct?: ContactScalarFieldEnum | ContactScalarFieldEnum[]
  }

  /**
   * Contact findMany
   */
  export type ContactFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contact
     */
    select?: ContactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Contact
     */
    omit?: ContactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInclude<ExtArgs> | null
    /**
     * Filter, which Contacts to fetch.
     */
    where?: ContactWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Contacts to fetch.
     */
    orderBy?: ContactOrderByWithRelationInput | ContactOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Contacts.
     */
    cursor?: ContactWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Contacts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Contacts.
     */
    skip?: number
    distinct?: ContactScalarFieldEnum | ContactScalarFieldEnum[]
  }

  /**
   * Contact create
   */
  export type ContactCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contact
     */
    select?: ContactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Contact
     */
    omit?: ContactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInclude<ExtArgs> | null
    /**
     * The data needed to create a Contact.
     */
    data: XOR<ContactCreateInput, ContactUncheckedCreateInput>
  }

  /**
   * Contact createMany
   */
  export type ContactCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Contacts.
     */
    data: ContactCreateManyInput | ContactCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Contact createManyAndReturn
   */
  export type ContactCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contact
     */
    select?: ContactSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Contact
     */
    omit?: ContactOmit<ExtArgs> | null
    /**
     * The data used to create many Contacts.
     */
    data: ContactCreateManyInput | ContactCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Contact update
   */
  export type ContactUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contact
     */
    select?: ContactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Contact
     */
    omit?: ContactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInclude<ExtArgs> | null
    /**
     * The data needed to update a Contact.
     */
    data: XOR<ContactUpdateInput, ContactUncheckedUpdateInput>
    /**
     * Choose, which Contact to update.
     */
    where: ContactWhereUniqueInput
  }

  /**
   * Contact updateMany
   */
  export type ContactUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Contacts.
     */
    data: XOR<ContactUpdateManyMutationInput, ContactUncheckedUpdateManyInput>
    /**
     * Filter which Contacts to update
     */
    where?: ContactWhereInput
    /**
     * Limit how many Contacts to update.
     */
    limit?: number
  }

  /**
   * Contact updateManyAndReturn
   */
  export type ContactUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contact
     */
    select?: ContactSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Contact
     */
    omit?: ContactOmit<ExtArgs> | null
    /**
     * The data used to update Contacts.
     */
    data: XOR<ContactUpdateManyMutationInput, ContactUncheckedUpdateManyInput>
    /**
     * Filter which Contacts to update
     */
    where?: ContactWhereInput
    /**
     * Limit how many Contacts to update.
     */
    limit?: number
  }

  /**
   * Contact upsert
   */
  export type ContactUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contact
     */
    select?: ContactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Contact
     */
    omit?: ContactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInclude<ExtArgs> | null
    /**
     * The filter to search for the Contact to update in case it exists.
     */
    where: ContactWhereUniqueInput
    /**
     * In case the Contact found by the `where` argument doesn't exist, create a new Contact with this data.
     */
    create: XOR<ContactCreateInput, ContactUncheckedCreateInput>
    /**
     * In case the Contact was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ContactUpdateInput, ContactUncheckedUpdateInput>
  }

  /**
   * Contact delete
   */
  export type ContactDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contact
     */
    select?: ContactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Contact
     */
    omit?: ContactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInclude<ExtArgs> | null
    /**
     * Filter which Contact to delete.
     */
    where: ContactWhereUniqueInput
  }

  /**
   * Contact deleteMany
   */
  export type ContactDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Contacts to delete
     */
    where?: ContactWhereInput
    /**
     * Limit how many Contacts to delete.
     */
    limit?: number
  }

  /**
   * Contact.submissions
   */
  export type Contact$submissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FormSubmission
     */
    select?: FormSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FormSubmission
     */
    omit?: FormSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FormSubmissionInclude<ExtArgs> | null
    where?: FormSubmissionWhereInput
    orderBy?: FormSubmissionOrderByWithRelationInput | FormSubmissionOrderByWithRelationInput[]
    cursor?: FormSubmissionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FormSubmissionScalarFieldEnum | FormSubmissionScalarFieldEnum[]
  }

  /**
   * Contact.pipeline
   */
  export type Contact$pipelineArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeadPipeline
     */
    select?: LeadPipelineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeadPipeline
     */
    omit?: LeadPipelineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadPipelineInclude<ExtArgs> | null
    where?: LeadPipelineWhereInput
  }

  /**
   * Contact.conversations
   */
  export type Contact$conversationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    where?: ConversationWhereInput
    orderBy?: ConversationOrderByWithRelationInput | ConversationOrderByWithRelationInput[]
    cursor?: ConversationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ConversationScalarFieldEnum | ConversationScalarFieldEnum[]
  }

  /**
   * Contact without action
   */
  export type ContactDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contact
     */
    select?: ContactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Contact
     */
    omit?: ContactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInclude<ExtArgs> | null
  }


  /**
   * Model FormSubmission
   */

  export type AggregateFormSubmission = {
    _count: FormSubmissionCountAggregateOutputType | null
    _avg: FormSubmissionAvgAggregateOutputType | null
    _sum: FormSubmissionSumAggregateOutputType | null
    _min: FormSubmissionMinAggregateOutputType | null
    _max: FormSubmissionMaxAggregateOutputType | null
  }

  export type FormSubmissionAvgAggregateOutputType = {
    qualificationScore: number | null
    contractValueUsd: Decimal | null
  }

  export type FormSubmissionSumAggregateOutputType = {
    qualificationScore: number | null
    contractValueUsd: Decimal | null
  }

  export type FormSubmissionMinAggregateOutputType = {
    id: string | null
    fullName: string | null
    email: string | null
    companyName: string | null
    phoneCountryCode: string | null
    phoneNumber: string | null
    instagramUrl: string | null
    websiteUrl: string | null
    usesPms: $Enums.PmsUsage | null
    propertyCount: $Enums.PropertyCount | null
    revenueRange: $Enums.RevenueRange | null
    isTodero: $Enums.YesNo | null
    usesAi: $Enums.YesNo | null
    wantsToScale: $Enums.YesNo | null
    industryTime: $Enums.IndustryTime | null
    pdfToken: string | null
    qualification: $Enums.LeadQualification | null
    qualificationScore: number | null
    disqualificationReason: $Enums.DisqualificationReason | null
    entrySource: $Enums.LeadEntrySource | null
    bookingFlow: $Enums.BookingFlow | null
    bookedAt: Date | null
    status: $Enums.SubmissionStatus | null
    fbclid: string | null
    fbp: string | null
    fbc: string | null
    utmSource: string | null
    utmMedium: string | null
    utmCampaign: string | null
    utmContent: string | null
    utmTerm: string | null
    landingPath: string | null
    referrer: string | null
    marketingFunnelStage: $Enums.MarketingFunnelStage | null
    contractValueUsd: Decimal | null
    contractPlan: $Enums.ContractPlan | null
    createdAt: Date | null
    updatedAt: Date | null
    contactId: string | null
  }

  export type FormSubmissionMaxAggregateOutputType = {
    id: string | null
    fullName: string | null
    email: string | null
    companyName: string | null
    phoneCountryCode: string | null
    phoneNumber: string | null
    instagramUrl: string | null
    websiteUrl: string | null
    usesPms: $Enums.PmsUsage | null
    propertyCount: $Enums.PropertyCount | null
    revenueRange: $Enums.RevenueRange | null
    isTodero: $Enums.YesNo | null
    usesAi: $Enums.YesNo | null
    wantsToScale: $Enums.YesNo | null
    industryTime: $Enums.IndustryTime | null
    pdfToken: string | null
    qualification: $Enums.LeadQualification | null
    qualificationScore: number | null
    disqualificationReason: $Enums.DisqualificationReason | null
    entrySource: $Enums.LeadEntrySource | null
    bookingFlow: $Enums.BookingFlow | null
    bookedAt: Date | null
    status: $Enums.SubmissionStatus | null
    fbclid: string | null
    fbp: string | null
    fbc: string | null
    utmSource: string | null
    utmMedium: string | null
    utmCampaign: string | null
    utmContent: string | null
    utmTerm: string | null
    landingPath: string | null
    referrer: string | null
    marketingFunnelStage: $Enums.MarketingFunnelStage | null
    contractValueUsd: Decimal | null
    contractPlan: $Enums.ContractPlan | null
    createdAt: Date | null
    updatedAt: Date | null
    contactId: string | null
  }

  export type FormSubmissionCountAggregateOutputType = {
    id: number
    fullName: number
    email: number
    companyName: number
    phoneCountryCode: number
    phoneNumber: number
    instagramUrl: number
    websiteUrl: number
    usesPms: number
    propertyCount: number
    revenueRange: number
    isTodero: number
    usesAi: number
    wantsToScale: number
    industryTime: number
    pdfToken: number
    qualification: number
    qualificationScore: number
    disqualificationReason: number
    scoreBreakdown: number
    entrySource: number
    bookingFlow: number
    bookedAt: number
    status: number
    fbclid: number
    fbp: number
    fbc: number
    utmSource: number
    utmMedium: number
    utmCampaign: number
    utmContent: number
    utmTerm: number
    landingPath: number
    referrer: number
    marketingFunnelStage: number
    contractValueUsd: number
    contractPlan: number
    createdAt: number
    updatedAt: number
    contactId: number
    _all: number
  }


  export type FormSubmissionAvgAggregateInputType = {
    qualificationScore?: true
    contractValueUsd?: true
  }

  export type FormSubmissionSumAggregateInputType = {
    qualificationScore?: true
    contractValueUsd?: true
  }

  export type FormSubmissionMinAggregateInputType = {
    id?: true
    fullName?: true
    email?: true
    companyName?: true
    phoneCountryCode?: true
    phoneNumber?: true
    instagramUrl?: true
    websiteUrl?: true
    usesPms?: true
    propertyCount?: true
    revenueRange?: true
    isTodero?: true
    usesAi?: true
    wantsToScale?: true
    industryTime?: true
    pdfToken?: true
    qualification?: true
    qualificationScore?: true
    disqualificationReason?: true
    entrySource?: true
    bookingFlow?: true
    bookedAt?: true
    status?: true
    fbclid?: true
    fbp?: true
    fbc?: true
    utmSource?: true
    utmMedium?: true
    utmCampaign?: true
    utmContent?: true
    utmTerm?: true
    landingPath?: true
    referrer?: true
    marketingFunnelStage?: true
    contractValueUsd?: true
    contractPlan?: true
    createdAt?: true
    updatedAt?: true
    contactId?: true
  }

  export type FormSubmissionMaxAggregateInputType = {
    id?: true
    fullName?: true
    email?: true
    companyName?: true
    phoneCountryCode?: true
    phoneNumber?: true
    instagramUrl?: true
    websiteUrl?: true
    usesPms?: true
    propertyCount?: true
    revenueRange?: true
    isTodero?: true
    usesAi?: true
    wantsToScale?: true
    industryTime?: true
    pdfToken?: true
    qualification?: true
    qualificationScore?: true
    disqualificationReason?: true
    entrySource?: true
    bookingFlow?: true
    bookedAt?: true
    status?: true
    fbclid?: true
    fbp?: true
    fbc?: true
    utmSource?: true
    utmMedium?: true
    utmCampaign?: true
    utmContent?: true
    utmTerm?: true
    landingPath?: true
    referrer?: true
    marketingFunnelStage?: true
    contractValueUsd?: true
    contractPlan?: true
    createdAt?: true
    updatedAt?: true
    contactId?: true
  }

  export type FormSubmissionCountAggregateInputType = {
    id?: true
    fullName?: true
    email?: true
    companyName?: true
    phoneCountryCode?: true
    phoneNumber?: true
    instagramUrl?: true
    websiteUrl?: true
    usesPms?: true
    propertyCount?: true
    revenueRange?: true
    isTodero?: true
    usesAi?: true
    wantsToScale?: true
    industryTime?: true
    pdfToken?: true
    qualification?: true
    qualificationScore?: true
    disqualificationReason?: true
    scoreBreakdown?: true
    entrySource?: true
    bookingFlow?: true
    bookedAt?: true
    status?: true
    fbclid?: true
    fbp?: true
    fbc?: true
    utmSource?: true
    utmMedium?: true
    utmCampaign?: true
    utmContent?: true
    utmTerm?: true
    landingPath?: true
    referrer?: true
    marketingFunnelStage?: true
    contractValueUsd?: true
    contractPlan?: true
    createdAt?: true
    updatedAt?: true
    contactId?: true
    _all?: true
  }

  export type FormSubmissionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FormSubmission to aggregate.
     */
    where?: FormSubmissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FormSubmissions to fetch.
     */
    orderBy?: FormSubmissionOrderByWithRelationInput | FormSubmissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FormSubmissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FormSubmissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FormSubmissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FormSubmissions
    **/
    _count?: true | FormSubmissionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FormSubmissionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FormSubmissionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FormSubmissionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FormSubmissionMaxAggregateInputType
  }

  export type GetFormSubmissionAggregateType<T extends FormSubmissionAggregateArgs> = {
        [P in keyof T & keyof AggregateFormSubmission]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFormSubmission[P]>
      : GetScalarType<T[P], AggregateFormSubmission[P]>
  }




  export type FormSubmissionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FormSubmissionWhereInput
    orderBy?: FormSubmissionOrderByWithAggregationInput | FormSubmissionOrderByWithAggregationInput[]
    by: FormSubmissionScalarFieldEnum[] | FormSubmissionScalarFieldEnum
    having?: FormSubmissionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FormSubmissionCountAggregateInputType | true
    _avg?: FormSubmissionAvgAggregateInputType
    _sum?: FormSubmissionSumAggregateInputType
    _min?: FormSubmissionMinAggregateInputType
    _max?: FormSubmissionMaxAggregateInputType
  }

  export type FormSubmissionGroupByOutputType = {
    id: string
    fullName: string | null
    email: string | null
    companyName: string | null
    phoneCountryCode: string | null
    phoneNumber: string | null
    instagramUrl: string | null
    websiteUrl: string | null
    usesPms: $Enums.PmsUsage | null
    propertyCount: $Enums.PropertyCount | null
    revenueRange: $Enums.RevenueRange | null
    isTodero: $Enums.YesNo | null
    usesAi: $Enums.YesNo | null
    wantsToScale: $Enums.YesNo | null
    industryTime: $Enums.IndustryTime | null
    pdfToken: string
    qualification: $Enums.LeadQualification | null
    qualificationScore: number | null
    disqualificationReason: $Enums.DisqualificationReason | null
    scoreBreakdown: JsonValue | null
    entrySource: $Enums.LeadEntrySource
    bookingFlow: $Enums.BookingFlow | null
    bookedAt: Date | null
    status: $Enums.SubmissionStatus
    fbclid: string | null
    fbp: string | null
    fbc: string | null
    utmSource: string | null
    utmMedium: string | null
    utmCampaign: string | null
    utmContent: string | null
    utmTerm: string | null
    landingPath: string | null
    referrer: string | null
    marketingFunnelStage: $Enums.MarketingFunnelStage | null
    contractValueUsd: Decimal | null
    contractPlan: $Enums.ContractPlan | null
    createdAt: Date
    updatedAt: Date
    contactId: string | null
    _count: FormSubmissionCountAggregateOutputType | null
    _avg: FormSubmissionAvgAggregateOutputType | null
    _sum: FormSubmissionSumAggregateOutputType | null
    _min: FormSubmissionMinAggregateOutputType | null
    _max: FormSubmissionMaxAggregateOutputType | null
  }

  type GetFormSubmissionGroupByPayload<T extends FormSubmissionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FormSubmissionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FormSubmissionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FormSubmissionGroupByOutputType[P]>
            : GetScalarType<T[P], FormSubmissionGroupByOutputType[P]>
        }
      >
    >


  export type FormSubmissionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fullName?: boolean
    email?: boolean
    companyName?: boolean
    phoneCountryCode?: boolean
    phoneNumber?: boolean
    instagramUrl?: boolean
    websiteUrl?: boolean
    usesPms?: boolean
    propertyCount?: boolean
    revenueRange?: boolean
    isTodero?: boolean
    usesAi?: boolean
    wantsToScale?: boolean
    industryTime?: boolean
    pdfToken?: boolean
    qualification?: boolean
    qualificationScore?: boolean
    disqualificationReason?: boolean
    scoreBreakdown?: boolean
    entrySource?: boolean
    bookingFlow?: boolean
    bookedAt?: boolean
    status?: boolean
    fbclid?: boolean
    fbp?: boolean
    fbc?: boolean
    utmSource?: boolean
    utmMedium?: boolean
    utmCampaign?: boolean
    utmContent?: boolean
    utmTerm?: boolean
    landingPath?: boolean
    referrer?: boolean
    marketingFunnelStage?: boolean
    contractValueUsd?: boolean
    contractPlan?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    contactId?: boolean
    contact?: boolean | FormSubmission$contactArgs<ExtArgs>
    events?: boolean | FormSubmission$eventsArgs<ExtArgs>
    _count?: boolean | FormSubmissionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["formSubmission"]>

  export type FormSubmissionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fullName?: boolean
    email?: boolean
    companyName?: boolean
    phoneCountryCode?: boolean
    phoneNumber?: boolean
    instagramUrl?: boolean
    websiteUrl?: boolean
    usesPms?: boolean
    propertyCount?: boolean
    revenueRange?: boolean
    isTodero?: boolean
    usesAi?: boolean
    wantsToScale?: boolean
    industryTime?: boolean
    pdfToken?: boolean
    qualification?: boolean
    qualificationScore?: boolean
    disqualificationReason?: boolean
    scoreBreakdown?: boolean
    entrySource?: boolean
    bookingFlow?: boolean
    bookedAt?: boolean
    status?: boolean
    fbclid?: boolean
    fbp?: boolean
    fbc?: boolean
    utmSource?: boolean
    utmMedium?: boolean
    utmCampaign?: boolean
    utmContent?: boolean
    utmTerm?: boolean
    landingPath?: boolean
    referrer?: boolean
    marketingFunnelStage?: boolean
    contractValueUsd?: boolean
    contractPlan?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    contactId?: boolean
    contact?: boolean | FormSubmission$contactArgs<ExtArgs>
  }, ExtArgs["result"]["formSubmission"]>

  export type FormSubmissionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fullName?: boolean
    email?: boolean
    companyName?: boolean
    phoneCountryCode?: boolean
    phoneNumber?: boolean
    instagramUrl?: boolean
    websiteUrl?: boolean
    usesPms?: boolean
    propertyCount?: boolean
    revenueRange?: boolean
    isTodero?: boolean
    usesAi?: boolean
    wantsToScale?: boolean
    industryTime?: boolean
    pdfToken?: boolean
    qualification?: boolean
    qualificationScore?: boolean
    disqualificationReason?: boolean
    scoreBreakdown?: boolean
    entrySource?: boolean
    bookingFlow?: boolean
    bookedAt?: boolean
    status?: boolean
    fbclid?: boolean
    fbp?: boolean
    fbc?: boolean
    utmSource?: boolean
    utmMedium?: boolean
    utmCampaign?: boolean
    utmContent?: boolean
    utmTerm?: boolean
    landingPath?: boolean
    referrer?: boolean
    marketingFunnelStage?: boolean
    contractValueUsd?: boolean
    contractPlan?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    contactId?: boolean
    contact?: boolean | FormSubmission$contactArgs<ExtArgs>
  }, ExtArgs["result"]["formSubmission"]>

  export type FormSubmissionSelectScalar = {
    id?: boolean
    fullName?: boolean
    email?: boolean
    companyName?: boolean
    phoneCountryCode?: boolean
    phoneNumber?: boolean
    instagramUrl?: boolean
    websiteUrl?: boolean
    usesPms?: boolean
    propertyCount?: boolean
    revenueRange?: boolean
    isTodero?: boolean
    usesAi?: boolean
    wantsToScale?: boolean
    industryTime?: boolean
    pdfToken?: boolean
    qualification?: boolean
    qualificationScore?: boolean
    disqualificationReason?: boolean
    scoreBreakdown?: boolean
    entrySource?: boolean
    bookingFlow?: boolean
    bookedAt?: boolean
    status?: boolean
    fbclid?: boolean
    fbp?: boolean
    fbc?: boolean
    utmSource?: boolean
    utmMedium?: boolean
    utmCampaign?: boolean
    utmContent?: boolean
    utmTerm?: boolean
    landingPath?: boolean
    referrer?: boolean
    marketingFunnelStage?: boolean
    contractValueUsd?: boolean
    contractPlan?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    contactId?: boolean
  }

  export type FormSubmissionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "fullName" | "email" | "companyName" | "phoneCountryCode" | "phoneNumber" | "instagramUrl" | "websiteUrl" | "usesPms" | "propertyCount" | "revenueRange" | "isTodero" | "usesAi" | "wantsToScale" | "industryTime" | "pdfToken" | "qualification" | "qualificationScore" | "disqualificationReason" | "scoreBreakdown" | "entrySource" | "bookingFlow" | "bookedAt" | "status" | "fbclid" | "fbp" | "fbc" | "utmSource" | "utmMedium" | "utmCampaign" | "utmContent" | "utmTerm" | "landingPath" | "referrer" | "marketingFunnelStage" | "contractValueUsd" | "contractPlan" | "createdAt" | "updatedAt" | "contactId", ExtArgs["result"]["formSubmission"]>
  export type FormSubmissionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    contact?: boolean | FormSubmission$contactArgs<ExtArgs>
    events?: boolean | FormSubmission$eventsArgs<ExtArgs>
    _count?: boolean | FormSubmissionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type FormSubmissionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    contact?: boolean | FormSubmission$contactArgs<ExtArgs>
  }
  export type FormSubmissionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    contact?: boolean | FormSubmission$contactArgs<ExtArgs>
  }

  export type $FormSubmissionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FormSubmission"
    objects: {
      contact: Prisma.$ContactPayload<ExtArgs> | null
      events: Prisma.$LeadEventPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      fullName: string | null
      email: string | null
      companyName: string | null
      phoneCountryCode: string | null
      phoneNumber: string | null
      instagramUrl: string | null
      websiteUrl: string | null
      usesPms: $Enums.PmsUsage | null
      propertyCount: $Enums.PropertyCount | null
      revenueRange: $Enums.RevenueRange | null
      isTodero: $Enums.YesNo | null
      usesAi: $Enums.YesNo | null
      wantsToScale: $Enums.YesNo | null
      industryTime: $Enums.IndustryTime | null
      pdfToken: string
      qualification: $Enums.LeadQualification | null
      qualificationScore: number | null
      disqualificationReason: $Enums.DisqualificationReason | null
      scoreBreakdown: Prisma.JsonValue | null
      entrySource: $Enums.LeadEntrySource
      bookingFlow: $Enums.BookingFlow | null
      bookedAt: Date | null
      status: $Enums.SubmissionStatus
      fbclid: string | null
      fbp: string | null
      fbc: string | null
      utmSource: string | null
      utmMedium: string | null
      utmCampaign: string | null
      utmContent: string | null
      utmTerm: string | null
      landingPath: string | null
      referrer: string | null
      marketingFunnelStage: $Enums.MarketingFunnelStage | null
      contractValueUsd: Prisma.Decimal | null
      contractPlan: $Enums.ContractPlan | null
      createdAt: Date
      updatedAt: Date
      contactId: string | null
    }, ExtArgs["result"]["formSubmission"]>
    composites: {}
  }

  type FormSubmissionGetPayload<S extends boolean | null | undefined | FormSubmissionDefaultArgs> = $Result.GetResult<Prisma.$FormSubmissionPayload, S>

  type FormSubmissionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FormSubmissionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FormSubmissionCountAggregateInputType | true
    }

  export interface FormSubmissionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FormSubmission'], meta: { name: 'FormSubmission' } }
    /**
     * Find zero or one FormSubmission that matches the filter.
     * @param {FormSubmissionFindUniqueArgs} args - Arguments to find a FormSubmission
     * @example
     * // Get one FormSubmission
     * const formSubmission = await prisma.formSubmission.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FormSubmissionFindUniqueArgs>(args: SelectSubset<T, FormSubmissionFindUniqueArgs<ExtArgs>>): Prisma__FormSubmissionClient<$Result.GetResult<Prisma.$FormSubmissionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one FormSubmission that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FormSubmissionFindUniqueOrThrowArgs} args - Arguments to find a FormSubmission
     * @example
     * // Get one FormSubmission
     * const formSubmission = await prisma.formSubmission.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FormSubmissionFindUniqueOrThrowArgs>(args: SelectSubset<T, FormSubmissionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FormSubmissionClient<$Result.GetResult<Prisma.$FormSubmissionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FormSubmission that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FormSubmissionFindFirstArgs} args - Arguments to find a FormSubmission
     * @example
     * // Get one FormSubmission
     * const formSubmission = await prisma.formSubmission.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FormSubmissionFindFirstArgs>(args?: SelectSubset<T, FormSubmissionFindFirstArgs<ExtArgs>>): Prisma__FormSubmissionClient<$Result.GetResult<Prisma.$FormSubmissionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FormSubmission that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FormSubmissionFindFirstOrThrowArgs} args - Arguments to find a FormSubmission
     * @example
     * // Get one FormSubmission
     * const formSubmission = await prisma.formSubmission.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FormSubmissionFindFirstOrThrowArgs>(args?: SelectSubset<T, FormSubmissionFindFirstOrThrowArgs<ExtArgs>>): Prisma__FormSubmissionClient<$Result.GetResult<Prisma.$FormSubmissionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more FormSubmissions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FormSubmissionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FormSubmissions
     * const formSubmissions = await prisma.formSubmission.findMany()
     * 
     * // Get first 10 FormSubmissions
     * const formSubmissions = await prisma.formSubmission.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const formSubmissionWithIdOnly = await prisma.formSubmission.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FormSubmissionFindManyArgs>(args?: SelectSubset<T, FormSubmissionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FormSubmissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a FormSubmission.
     * @param {FormSubmissionCreateArgs} args - Arguments to create a FormSubmission.
     * @example
     * // Create one FormSubmission
     * const FormSubmission = await prisma.formSubmission.create({
     *   data: {
     *     // ... data to create a FormSubmission
     *   }
     * })
     * 
     */
    create<T extends FormSubmissionCreateArgs>(args: SelectSubset<T, FormSubmissionCreateArgs<ExtArgs>>): Prisma__FormSubmissionClient<$Result.GetResult<Prisma.$FormSubmissionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many FormSubmissions.
     * @param {FormSubmissionCreateManyArgs} args - Arguments to create many FormSubmissions.
     * @example
     * // Create many FormSubmissions
     * const formSubmission = await prisma.formSubmission.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FormSubmissionCreateManyArgs>(args?: SelectSubset<T, FormSubmissionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FormSubmissions and returns the data saved in the database.
     * @param {FormSubmissionCreateManyAndReturnArgs} args - Arguments to create many FormSubmissions.
     * @example
     * // Create many FormSubmissions
     * const formSubmission = await prisma.formSubmission.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FormSubmissions and only return the `id`
     * const formSubmissionWithIdOnly = await prisma.formSubmission.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FormSubmissionCreateManyAndReturnArgs>(args?: SelectSubset<T, FormSubmissionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FormSubmissionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a FormSubmission.
     * @param {FormSubmissionDeleteArgs} args - Arguments to delete one FormSubmission.
     * @example
     * // Delete one FormSubmission
     * const FormSubmission = await prisma.formSubmission.delete({
     *   where: {
     *     // ... filter to delete one FormSubmission
     *   }
     * })
     * 
     */
    delete<T extends FormSubmissionDeleteArgs>(args: SelectSubset<T, FormSubmissionDeleteArgs<ExtArgs>>): Prisma__FormSubmissionClient<$Result.GetResult<Prisma.$FormSubmissionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one FormSubmission.
     * @param {FormSubmissionUpdateArgs} args - Arguments to update one FormSubmission.
     * @example
     * // Update one FormSubmission
     * const formSubmission = await prisma.formSubmission.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FormSubmissionUpdateArgs>(args: SelectSubset<T, FormSubmissionUpdateArgs<ExtArgs>>): Prisma__FormSubmissionClient<$Result.GetResult<Prisma.$FormSubmissionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more FormSubmissions.
     * @param {FormSubmissionDeleteManyArgs} args - Arguments to filter FormSubmissions to delete.
     * @example
     * // Delete a few FormSubmissions
     * const { count } = await prisma.formSubmission.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FormSubmissionDeleteManyArgs>(args?: SelectSubset<T, FormSubmissionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FormSubmissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FormSubmissionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FormSubmissions
     * const formSubmission = await prisma.formSubmission.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FormSubmissionUpdateManyArgs>(args: SelectSubset<T, FormSubmissionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FormSubmissions and returns the data updated in the database.
     * @param {FormSubmissionUpdateManyAndReturnArgs} args - Arguments to update many FormSubmissions.
     * @example
     * // Update many FormSubmissions
     * const formSubmission = await prisma.formSubmission.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more FormSubmissions and only return the `id`
     * const formSubmissionWithIdOnly = await prisma.formSubmission.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FormSubmissionUpdateManyAndReturnArgs>(args: SelectSubset<T, FormSubmissionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FormSubmissionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one FormSubmission.
     * @param {FormSubmissionUpsertArgs} args - Arguments to update or create a FormSubmission.
     * @example
     * // Update or create a FormSubmission
     * const formSubmission = await prisma.formSubmission.upsert({
     *   create: {
     *     // ... data to create a FormSubmission
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FormSubmission we want to update
     *   }
     * })
     */
    upsert<T extends FormSubmissionUpsertArgs>(args: SelectSubset<T, FormSubmissionUpsertArgs<ExtArgs>>): Prisma__FormSubmissionClient<$Result.GetResult<Prisma.$FormSubmissionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of FormSubmissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FormSubmissionCountArgs} args - Arguments to filter FormSubmissions to count.
     * @example
     * // Count the number of FormSubmissions
     * const count = await prisma.formSubmission.count({
     *   where: {
     *     // ... the filter for the FormSubmissions we want to count
     *   }
     * })
    **/
    count<T extends FormSubmissionCountArgs>(
      args?: Subset<T, FormSubmissionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FormSubmissionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FormSubmission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FormSubmissionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FormSubmissionAggregateArgs>(args: Subset<T, FormSubmissionAggregateArgs>): Prisma.PrismaPromise<GetFormSubmissionAggregateType<T>>

    /**
     * Group by FormSubmission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FormSubmissionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FormSubmissionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FormSubmissionGroupByArgs['orderBy'] }
        : { orderBy?: FormSubmissionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FormSubmissionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFormSubmissionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FormSubmission model
   */
  readonly fields: FormSubmissionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FormSubmission.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FormSubmissionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    contact<T extends FormSubmission$contactArgs<ExtArgs> = {}>(args?: Subset<T, FormSubmission$contactArgs<ExtArgs>>): Prisma__ContactClient<$Result.GetResult<Prisma.$ContactPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    events<T extends FormSubmission$eventsArgs<ExtArgs> = {}>(args?: Subset<T, FormSubmission$eventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeadEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FormSubmission model
   */
  interface FormSubmissionFieldRefs {
    readonly id: FieldRef<"FormSubmission", 'String'>
    readonly fullName: FieldRef<"FormSubmission", 'String'>
    readonly email: FieldRef<"FormSubmission", 'String'>
    readonly companyName: FieldRef<"FormSubmission", 'String'>
    readonly phoneCountryCode: FieldRef<"FormSubmission", 'String'>
    readonly phoneNumber: FieldRef<"FormSubmission", 'String'>
    readonly instagramUrl: FieldRef<"FormSubmission", 'String'>
    readonly websiteUrl: FieldRef<"FormSubmission", 'String'>
    readonly usesPms: FieldRef<"FormSubmission", 'PmsUsage'>
    readonly propertyCount: FieldRef<"FormSubmission", 'PropertyCount'>
    readonly revenueRange: FieldRef<"FormSubmission", 'RevenueRange'>
    readonly isTodero: FieldRef<"FormSubmission", 'YesNo'>
    readonly usesAi: FieldRef<"FormSubmission", 'YesNo'>
    readonly wantsToScale: FieldRef<"FormSubmission", 'YesNo'>
    readonly industryTime: FieldRef<"FormSubmission", 'IndustryTime'>
    readonly pdfToken: FieldRef<"FormSubmission", 'String'>
    readonly qualification: FieldRef<"FormSubmission", 'LeadQualification'>
    readonly qualificationScore: FieldRef<"FormSubmission", 'Int'>
    readonly disqualificationReason: FieldRef<"FormSubmission", 'DisqualificationReason'>
    readonly scoreBreakdown: FieldRef<"FormSubmission", 'Json'>
    readonly entrySource: FieldRef<"FormSubmission", 'LeadEntrySource'>
    readonly bookingFlow: FieldRef<"FormSubmission", 'BookingFlow'>
    readonly bookedAt: FieldRef<"FormSubmission", 'DateTime'>
    readonly status: FieldRef<"FormSubmission", 'SubmissionStatus'>
    readonly fbclid: FieldRef<"FormSubmission", 'String'>
    readonly fbp: FieldRef<"FormSubmission", 'String'>
    readonly fbc: FieldRef<"FormSubmission", 'String'>
    readonly utmSource: FieldRef<"FormSubmission", 'String'>
    readonly utmMedium: FieldRef<"FormSubmission", 'String'>
    readonly utmCampaign: FieldRef<"FormSubmission", 'String'>
    readonly utmContent: FieldRef<"FormSubmission", 'String'>
    readonly utmTerm: FieldRef<"FormSubmission", 'String'>
    readonly landingPath: FieldRef<"FormSubmission", 'String'>
    readonly referrer: FieldRef<"FormSubmission", 'String'>
    readonly marketingFunnelStage: FieldRef<"FormSubmission", 'MarketingFunnelStage'>
    readonly contractValueUsd: FieldRef<"FormSubmission", 'Decimal'>
    readonly contractPlan: FieldRef<"FormSubmission", 'ContractPlan'>
    readonly createdAt: FieldRef<"FormSubmission", 'DateTime'>
    readonly updatedAt: FieldRef<"FormSubmission", 'DateTime'>
    readonly contactId: FieldRef<"FormSubmission", 'String'>
  }
    

  // Custom InputTypes
  /**
   * FormSubmission findUnique
   */
  export type FormSubmissionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FormSubmission
     */
    select?: FormSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FormSubmission
     */
    omit?: FormSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FormSubmissionInclude<ExtArgs> | null
    /**
     * Filter, which FormSubmission to fetch.
     */
    where: FormSubmissionWhereUniqueInput
  }

  /**
   * FormSubmission findUniqueOrThrow
   */
  export type FormSubmissionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FormSubmission
     */
    select?: FormSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FormSubmission
     */
    omit?: FormSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FormSubmissionInclude<ExtArgs> | null
    /**
     * Filter, which FormSubmission to fetch.
     */
    where: FormSubmissionWhereUniqueInput
  }

  /**
   * FormSubmission findFirst
   */
  export type FormSubmissionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FormSubmission
     */
    select?: FormSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FormSubmission
     */
    omit?: FormSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FormSubmissionInclude<ExtArgs> | null
    /**
     * Filter, which FormSubmission to fetch.
     */
    where?: FormSubmissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FormSubmissions to fetch.
     */
    orderBy?: FormSubmissionOrderByWithRelationInput | FormSubmissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FormSubmissions.
     */
    cursor?: FormSubmissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FormSubmissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FormSubmissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FormSubmissions.
     */
    distinct?: FormSubmissionScalarFieldEnum | FormSubmissionScalarFieldEnum[]
  }

  /**
   * FormSubmission findFirstOrThrow
   */
  export type FormSubmissionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FormSubmission
     */
    select?: FormSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FormSubmission
     */
    omit?: FormSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FormSubmissionInclude<ExtArgs> | null
    /**
     * Filter, which FormSubmission to fetch.
     */
    where?: FormSubmissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FormSubmissions to fetch.
     */
    orderBy?: FormSubmissionOrderByWithRelationInput | FormSubmissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FormSubmissions.
     */
    cursor?: FormSubmissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FormSubmissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FormSubmissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FormSubmissions.
     */
    distinct?: FormSubmissionScalarFieldEnum | FormSubmissionScalarFieldEnum[]
  }

  /**
   * FormSubmission findMany
   */
  export type FormSubmissionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FormSubmission
     */
    select?: FormSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FormSubmission
     */
    omit?: FormSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FormSubmissionInclude<ExtArgs> | null
    /**
     * Filter, which FormSubmissions to fetch.
     */
    where?: FormSubmissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FormSubmissions to fetch.
     */
    orderBy?: FormSubmissionOrderByWithRelationInput | FormSubmissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FormSubmissions.
     */
    cursor?: FormSubmissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FormSubmissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FormSubmissions.
     */
    skip?: number
    distinct?: FormSubmissionScalarFieldEnum | FormSubmissionScalarFieldEnum[]
  }

  /**
   * FormSubmission create
   */
  export type FormSubmissionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FormSubmission
     */
    select?: FormSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FormSubmission
     */
    omit?: FormSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FormSubmissionInclude<ExtArgs> | null
    /**
     * The data needed to create a FormSubmission.
     */
    data: XOR<FormSubmissionCreateInput, FormSubmissionUncheckedCreateInput>
  }

  /**
   * FormSubmission createMany
   */
  export type FormSubmissionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FormSubmissions.
     */
    data: FormSubmissionCreateManyInput | FormSubmissionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FormSubmission createManyAndReturn
   */
  export type FormSubmissionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FormSubmission
     */
    select?: FormSubmissionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FormSubmission
     */
    omit?: FormSubmissionOmit<ExtArgs> | null
    /**
     * The data used to create many FormSubmissions.
     */
    data: FormSubmissionCreateManyInput | FormSubmissionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FormSubmissionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * FormSubmission update
   */
  export type FormSubmissionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FormSubmission
     */
    select?: FormSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FormSubmission
     */
    omit?: FormSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FormSubmissionInclude<ExtArgs> | null
    /**
     * The data needed to update a FormSubmission.
     */
    data: XOR<FormSubmissionUpdateInput, FormSubmissionUncheckedUpdateInput>
    /**
     * Choose, which FormSubmission to update.
     */
    where: FormSubmissionWhereUniqueInput
  }

  /**
   * FormSubmission updateMany
   */
  export type FormSubmissionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FormSubmissions.
     */
    data: XOR<FormSubmissionUpdateManyMutationInput, FormSubmissionUncheckedUpdateManyInput>
    /**
     * Filter which FormSubmissions to update
     */
    where?: FormSubmissionWhereInput
    /**
     * Limit how many FormSubmissions to update.
     */
    limit?: number
  }

  /**
   * FormSubmission updateManyAndReturn
   */
  export type FormSubmissionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FormSubmission
     */
    select?: FormSubmissionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FormSubmission
     */
    omit?: FormSubmissionOmit<ExtArgs> | null
    /**
     * The data used to update FormSubmissions.
     */
    data: XOR<FormSubmissionUpdateManyMutationInput, FormSubmissionUncheckedUpdateManyInput>
    /**
     * Filter which FormSubmissions to update
     */
    where?: FormSubmissionWhereInput
    /**
     * Limit how many FormSubmissions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FormSubmissionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * FormSubmission upsert
   */
  export type FormSubmissionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FormSubmission
     */
    select?: FormSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FormSubmission
     */
    omit?: FormSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FormSubmissionInclude<ExtArgs> | null
    /**
     * The filter to search for the FormSubmission to update in case it exists.
     */
    where: FormSubmissionWhereUniqueInput
    /**
     * In case the FormSubmission found by the `where` argument doesn't exist, create a new FormSubmission with this data.
     */
    create: XOR<FormSubmissionCreateInput, FormSubmissionUncheckedCreateInput>
    /**
     * In case the FormSubmission was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FormSubmissionUpdateInput, FormSubmissionUncheckedUpdateInput>
  }

  /**
   * FormSubmission delete
   */
  export type FormSubmissionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FormSubmission
     */
    select?: FormSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FormSubmission
     */
    omit?: FormSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FormSubmissionInclude<ExtArgs> | null
    /**
     * Filter which FormSubmission to delete.
     */
    where: FormSubmissionWhereUniqueInput
  }

  /**
   * FormSubmission deleteMany
   */
  export type FormSubmissionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FormSubmissions to delete
     */
    where?: FormSubmissionWhereInput
    /**
     * Limit how many FormSubmissions to delete.
     */
    limit?: number
  }

  /**
   * FormSubmission.contact
   */
  export type FormSubmission$contactArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contact
     */
    select?: ContactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Contact
     */
    omit?: ContactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInclude<ExtArgs> | null
    where?: ContactWhereInput
  }

  /**
   * FormSubmission.events
   */
  export type FormSubmission$eventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeadEvent
     */
    select?: LeadEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeadEvent
     */
    omit?: LeadEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadEventInclude<ExtArgs> | null
    where?: LeadEventWhereInput
    orderBy?: LeadEventOrderByWithRelationInput | LeadEventOrderByWithRelationInput[]
    cursor?: LeadEventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LeadEventScalarFieldEnum | LeadEventScalarFieldEnum[]
  }

  /**
   * FormSubmission without action
   */
  export type FormSubmissionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FormSubmission
     */
    select?: FormSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FormSubmission
     */
    omit?: FormSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FormSubmissionInclude<ExtArgs> | null
  }


  /**
   * Model LeadEvent
   */

  export type AggregateLeadEvent = {
    _count: LeadEventCountAggregateOutputType | null
    _avg: LeadEventAvgAggregateOutputType | null
    _sum: LeadEventSumAggregateOutputType | null
    _min: LeadEventMinAggregateOutputType | null
    _max: LeadEventMaxAggregateOutputType | null
  }

  export type LeadEventAvgAggregateOutputType = {
    value: Decimal | null
    attemptCount: number | null
  }

  export type LeadEventSumAggregateOutputType = {
    value: Decimal | null
    attemptCount: number | null
  }

  export type LeadEventMinAggregateOutputType = {
    id: string | null
    submissionId: string | null
    eventName: $Enums.MarketingEventName | null
    eventTime: Date | null
    eventSourceUrl: string | null
    value: Decimal | null
    currency: string | null
    sentToMeta: boolean | null
    attemptCount: number | null
    lastAttemptAt: Date | null
    triggeredBy: string | null
    clientIp: string | null
    clientUserAgent: string | null
    createdAt: Date | null
  }

  export type LeadEventMaxAggregateOutputType = {
    id: string | null
    submissionId: string | null
    eventName: $Enums.MarketingEventName | null
    eventTime: Date | null
    eventSourceUrl: string | null
    value: Decimal | null
    currency: string | null
    sentToMeta: boolean | null
    attemptCount: number | null
    lastAttemptAt: Date | null
    triggeredBy: string | null
    clientIp: string | null
    clientUserAgent: string | null
    createdAt: Date | null
  }

  export type LeadEventCountAggregateOutputType = {
    id: number
    submissionId: number
    eventName: number
    eventTime: number
    eventSourceUrl: number
    value: number
    currency: number
    sentToMeta: number
    metaResponse: number
    attemptCount: number
    lastAttemptAt: number
    triggeredBy: number
    clientIp: number
    clientUserAgent: number
    createdAt: number
    _all: number
  }


  export type LeadEventAvgAggregateInputType = {
    value?: true
    attemptCount?: true
  }

  export type LeadEventSumAggregateInputType = {
    value?: true
    attemptCount?: true
  }

  export type LeadEventMinAggregateInputType = {
    id?: true
    submissionId?: true
    eventName?: true
    eventTime?: true
    eventSourceUrl?: true
    value?: true
    currency?: true
    sentToMeta?: true
    attemptCount?: true
    lastAttemptAt?: true
    triggeredBy?: true
    clientIp?: true
    clientUserAgent?: true
    createdAt?: true
  }

  export type LeadEventMaxAggregateInputType = {
    id?: true
    submissionId?: true
    eventName?: true
    eventTime?: true
    eventSourceUrl?: true
    value?: true
    currency?: true
    sentToMeta?: true
    attemptCount?: true
    lastAttemptAt?: true
    triggeredBy?: true
    clientIp?: true
    clientUserAgent?: true
    createdAt?: true
  }

  export type LeadEventCountAggregateInputType = {
    id?: true
    submissionId?: true
    eventName?: true
    eventTime?: true
    eventSourceUrl?: true
    value?: true
    currency?: true
    sentToMeta?: true
    metaResponse?: true
    attemptCount?: true
    lastAttemptAt?: true
    triggeredBy?: true
    clientIp?: true
    clientUserAgent?: true
    createdAt?: true
    _all?: true
  }

  export type LeadEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LeadEvent to aggregate.
     */
    where?: LeadEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LeadEvents to fetch.
     */
    orderBy?: LeadEventOrderByWithRelationInput | LeadEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LeadEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LeadEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LeadEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LeadEvents
    **/
    _count?: true | LeadEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LeadEventAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LeadEventSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LeadEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LeadEventMaxAggregateInputType
  }

  export type GetLeadEventAggregateType<T extends LeadEventAggregateArgs> = {
        [P in keyof T & keyof AggregateLeadEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLeadEvent[P]>
      : GetScalarType<T[P], AggregateLeadEvent[P]>
  }




  export type LeadEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LeadEventWhereInput
    orderBy?: LeadEventOrderByWithAggregationInput | LeadEventOrderByWithAggregationInput[]
    by: LeadEventScalarFieldEnum[] | LeadEventScalarFieldEnum
    having?: LeadEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LeadEventCountAggregateInputType | true
    _avg?: LeadEventAvgAggregateInputType
    _sum?: LeadEventSumAggregateInputType
    _min?: LeadEventMinAggregateInputType
    _max?: LeadEventMaxAggregateInputType
  }

  export type LeadEventGroupByOutputType = {
    id: string
    submissionId: string
    eventName: $Enums.MarketingEventName
    eventTime: Date
    eventSourceUrl: string | null
    value: Decimal
    currency: string
    sentToMeta: boolean
    metaResponse: JsonValue | null
    attemptCount: number
    lastAttemptAt: Date | null
    triggeredBy: string
    clientIp: string | null
    clientUserAgent: string | null
    createdAt: Date
    _count: LeadEventCountAggregateOutputType | null
    _avg: LeadEventAvgAggregateOutputType | null
    _sum: LeadEventSumAggregateOutputType | null
    _min: LeadEventMinAggregateOutputType | null
    _max: LeadEventMaxAggregateOutputType | null
  }

  type GetLeadEventGroupByPayload<T extends LeadEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LeadEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LeadEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LeadEventGroupByOutputType[P]>
            : GetScalarType<T[P], LeadEventGroupByOutputType[P]>
        }
      >
    >


  export type LeadEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    submissionId?: boolean
    eventName?: boolean
    eventTime?: boolean
    eventSourceUrl?: boolean
    value?: boolean
    currency?: boolean
    sentToMeta?: boolean
    metaResponse?: boolean
    attemptCount?: boolean
    lastAttemptAt?: boolean
    triggeredBy?: boolean
    clientIp?: boolean
    clientUserAgent?: boolean
    createdAt?: boolean
    submission?: boolean | FormSubmissionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["leadEvent"]>

  export type LeadEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    submissionId?: boolean
    eventName?: boolean
    eventTime?: boolean
    eventSourceUrl?: boolean
    value?: boolean
    currency?: boolean
    sentToMeta?: boolean
    metaResponse?: boolean
    attemptCount?: boolean
    lastAttemptAt?: boolean
    triggeredBy?: boolean
    clientIp?: boolean
    clientUserAgent?: boolean
    createdAt?: boolean
    submission?: boolean | FormSubmissionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["leadEvent"]>

  export type LeadEventSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    submissionId?: boolean
    eventName?: boolean
    eventTime?: boolean
    eventSourceUrl?: boolean
    value?: boolean
    currency?: boolean
    sentToMeta?: boolean
    metaResponse?: boolean
    attemptCount?: boolean
    lastAttemptAt?: boolean
    triggeredBy?: boolean
    clientIp?: boolean
    clientUserAgent?: boolean
    createdAt?: boolean
    submission?: boolean | FormSubmissionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["leadEvent"]>

  export type LeadEventSelectScalar = {
    id?: boolean
    submissionId?: boolean
    eventName?: boolean
    eventTime?: boolean
    eventSourceUrl?: boolean
    value?: boolean
    currency?: boolean
    sentToMeta?: boolean
    metaResponse?: boolean
    attemptCount?: boolean
    lastAttemptAt?: boolean
    triggeredBy?: boolean
    clientIp?: boolean
    clientUserAgent?: boolean
    createdAt?: boolean
  }

  export type LeadEventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "submissionId" | "eventName" | "eventTime" | "eventSourceUrl" | "value" | "currency" | "sentToMeta" | "metaResponse" | "attemptCount" | "lastAttemptAt" | "triggeredBy" | "clientIp" | "clientUserAgent" | "createdAt", ExtArgs["result"]["leadEvent"]>
  export type LeadEventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    submission?: boolean | FormSubmissionDefaultArgs<ExtArgs>
  }
  export type LeadEventIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    submission?: boolean | FormSubmissionDefaultArgs<ExtArgs>
  }
  export type LeadEventIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    submission?: boolean | FormSubmissionDefaultArgs<ExtArgs>
  }

  export type $LeadEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LeadEvent"
    objects: {
      submission: Prisma.$FormSubmissionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      submissionId: string
      eventName: $Enums.MarketingEventName
      eventTime: Date
      eventSourceUrl: string | null
      value: Prisma.Decimal
      currency: string
      sentToMeta: boolean
      metaResponse: Prisma.JsonValue | null
      attemptCount: number
      lastAttemptAt: Date | null
      triggeredBy: string
      clientIp: string | null
      clientUserAgent: string | null
      createdAt: Date
    }, ExtArgs["result"]["leadEvent"]>
    composites: {}
  }

  type LeadEventGetPayload<S extends boolean | null | undefined | LeadEventDefaultArgs> = $Result.GetResult<Prisma.$LeadEventPayload, S>

  type LeadEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LeadEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LeadEventCountAggregateInputType | true
    }

  export interface LeadEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LeadEvent'], meta: { name: 'LeadEvent' } }
    /**
     * Find zero or one LeadEvent that matches the filter.
     * @param {LeadEventFindUniqueArgs} args - Arguments to find a LeadEvent
     * @example
     * // Get one LeadEvent
     * const leadEvent = await prisma.leadEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LeadEventFindUniqueArgs>(args: SelectSubset<T, LeadEventFindUniqueArgs<ExtArgs>>): Prisma__LeadEventClient<$Result.GetResult<Prisma.$LeadEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LeadEvent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LeadEventFindUniqueOrThrowArgs} args - Arguments to find a LeadEvent
     * @example
     * // Get one LeadEvent
     * const leadEvent = await prisma.leadEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LeadEventFindUniqueOrThrowArgs>(args: SelectSubset<T, LeadEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LeadEventClient<$Result.GetResult<Prisma.$LeadEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LeadEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadEventFindFirstArgs} args - Arguments to find a LeadEvent
     * @example
     * // Get one LeadEvent
     * const leadEvent = await prisma.leadEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LeadEventFindFirstArgs>(args?: SelectSubset<T, LeadEventFindFirstArgs<ExtArgs>>): Prisma__LeadEventClient<$Result.GetResult<Prisma.$LeadEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LeadEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadEventFindFirstOrThrowArgs} args - Arguments to find a LeadEvent
     * @example
     * // Get one LeadEvent
     * const leadEvent = await prisma.leadEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LeadEventFindFirstOrThrowArgs>(args?: SelectSubset<T, LeadEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__LeadEventClient<$Result.GetResult<Prisma.$LeadEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LeadEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LeadEvents
     * const leadEvents = await prisma.leadEvent.findMany()
     * 
     * // Get first 10 LeadEvents
     * const leadEvents = await prisma.leadEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const leadEventWithIdOnly = await prisma.leadEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LeadEventFindManyArgs>(args?: SelectSubset<T, LeadEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeadEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LeadEvent.
     * @param {LeadEventCreateArgs} args - Arguments to create a LeadEvent.
     * @example
     * // Create one LeadEvent
     * const LeadEvent = await prisma.leadEvent.create({
     *   data: {
     *     // ... data to create a LeadEvent
     *   }
     * })
     * 
     */
    create<T extends LeadEventCreateArgs>(args: SelectSubset<T, LeadEventCreateArgs<ExtArgs>>): Prisma__LeadEventClient<$Result.GetResult<Prisma.$LeadEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LeadEvents.
     * @param {LeadEventCreateManyArgs} args - Arguments to create many LeadEvents.
     * @example
     * // Create many LeadEvents
     * const leadEvent = await prisma.leadEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LeadEventCreateManyArgs>(args?: SelectSubset<T, LeadEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LeadEvents and returns the data saved in the database.
     * @param {LeadEventCreateManyAndReturnArgs} args - Arguments to create many LeadEvents.
     * @example
     * // Create many LeadEvents
     * const leadEvent = await prisma.leadEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LeadEvents and only return the `id`
     * const leadEventWithIdOnly = await prisma.leadEvent.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LeadEventCreateManyAndReturnArgs>(args?: SelectSubset<T, LeadEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeadEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LeadEvent.
     * @param {LeadEventDeleteArgs} args - Arguments to delete one LeadEvent.
     * @example
     * // Delete one LeadEvent
     * const LeadEvent = await prisma.leadEvent.delete({
     *   where: {
     *     // ... filter to delete one LeadEvent
     *   }
     * })
     * 
     */
    delete<T extends LeadEventDeleteArgs>(args: SelectSubset<T, LeadEventDeleteArgs<ExtArgs>>): Prisma__LeadEventClient<$Result.GetResult<Prisma.$LeadEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LeadEvent.
     * @param {LeadEventUpdateArgs} args - Arguments to update one LeadEvent.
     * @example
     * // Update one LeadEvent
     * const leadEvent = await prisma.leadEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LeadEventUpdateArgs>(args: SelectSubset<T, LeadEventUpdateArgs<ExtArgs>>): Prisma__LeadEventClient<$Result.GetResult<Prisma.$LeadEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LeadEvents.
     * @param {LeadEventDeleteManyArgs} args - Arguments to filter LeadEvents to delete.
     * @example
     * // Delete a few LeadEvents
     * const { count } = await prisma.leadEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LeadEventDeleteManyArgs>(args?: SelectSubset<T, LeadEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LeadEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LeadEvents
     * const leadEvent = await prisma.leadEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LeadEventUpdateManyArgs>(args: SelectSubset<T, LeadEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LeadEvents and returns the data updated in the database.
     * @param {LeadEventUpdateManyAndReturnArgs} args - Arguments to update many LeadEvents.
     * @example
     * // Update many LeadEvents
     * const leadEvent = await prisma.leadEvent.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LeadEvents and only return the `id`
     * const leadEventWithIdOnly = await prisma.leadEvent.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LeadEventUpdateManyAndReturnArgs>(args: SelectSubset<T, LeadEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeadEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LeadEvent.
     * @param {LeadEventUpsertArgs} args - Arguments to update or create a LeadEvent.
     * @example
     * // Update or create a LeadEvent
     * const leadEvent = await prisma.leadEvent.upsert({
     *   create: {
     *     // ... data to create a LeadEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LeadEvent we want to update
     *   }
     * })
     */
    upsert<T extends LeadEventUpsertArgs>(args: SelectSubset<T, LeadEventUpsertArgs<ExtArgs>>): Prisma__LeadEventClient<$Result.GetResult<Prisma.$LeadEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LeadEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadEventCountArgs} args - Arguments to filter LeadEvents to count.
     * @example
     * // Count the number of LeadEvents
     * const count = await prisma.leadEvent.count({
     *   where: {
     *     // ... the filter for the LeadEvents we want to count
     *   }
     * })
    **/
    count<T extends LeadEventCountArgs>(
      args?: Subset<T, LeadEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LeadEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LeadEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LeadEventAggregateArgs>(args: Subset<T, LeadEventAggregateArgs>): Prisma.PrismaPromise<GetLeadEventAggregateType<T>>

    /**
     * Group by LeadEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LeadEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LeadEventGroupByArgs['orderBy'] }
        : { orderBy?: LeadEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LeadEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLeadEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LeadEvent model
   */
  readonly fields: LeadEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LeadEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LeadEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    submission<T extends FormSubmissionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, FormSubmissionDefaultArgs<ExtArgs>>): Prisma__FormSubmissionClient<$Result.GetResult<Prisma.$FormSubmissionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LeadEvent model
   */
  interface LeadEventFieldRefs {
    readonly id: FieldRef<"LeadEvent", 'String'>
    readonly submissionId: FieldRef<"LeadEvent", 'String'>
    readonly eventName: FieldRef<"LeadEvent", 'MarketingEventName'>
    readonly eventTime: FieldRef<"LeadEvent", 'DateTime'>
    readonly eventSourceUrl: FieldRef<"LeadEvent", 'String'>
    readonly value: FieldRef<"LeadEvent", 'Decimal'>
    readonly currency: FieldRef<"LeadEvent", 'String'>
    readonly sentToMeta: FieldRef<"LeadEvent", 'Boolean'>
    readonly metaResponse: FieldRef<"LeadEvent", 'Json'>
    readonly attemptCount: FieldRef<"LeadEvent", 'Int'>
    readonly lastAttemptAt: FieldRef<"LeadEvent", 'DateTime'>
    readonly triggeredBy: FieldRef<"LeadEvent", 'String'>
    readonly clientIp: FieldRef<"LeadEvent", 'String'>
    readonly clientUserAgent: FieldRef<"LeadEvent", 'String'>
    readonly createdAt: FieldRef<"LeadEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LeadEvent findUnique
   */
  export type LeadEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeadEvent
     */
    select?: LeadEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeadEvent
     */
    omit?: LeadEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadEventInclude<ExtArgs> | null
    /**
     * Filter, which LeadEvent to fetch.
     */
    where: LeadEventWhereUniqueInput
  }

  /**
   * LeadEvent findUniqueOrThrow
   */
  export type LeadEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeadEvent
     */
    select?: LeadEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeadEvent
     */
    omit?: LeadEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadEventInclude<ExtArgs> | null
    /**
     * Filter, which LeadEvent to fetch.
     */
    where: LeadEventWhereUniqueInput
  }

  /**
   * LeadEvent findFirst
   */
  export type LeadEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeadEvent
     */
    select?: LeadEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeadEvent
     */
    omit?: LeadEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadEventInclude<ExtArgs> | null
    /**
     * Filter, which LeadEvent to fetch.
     */
    where?: LeadEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LeadEvents to fetch.
     */
    orderBy?: LeadEventOrderByWithRelationInput | LeadEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LeadEvents.
     */
    cursor?: LeadEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LeadEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LeadEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LeadEvents.
     */
    distinct?: LeadEventScalarFieldEnum | LeadEventScalarFieldEnum[]
  }

  /**
   * LeadEvent findFirstOrThrow
   */
  export type LeadEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeadEvent
     */
    select?: LeadEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeadEvent
     */
    omit?: LeadEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadEventInclude<ExtArgs> | null
    /**
     * Filter, which LeadEvent to fetch.
     */
    where?: LeadEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LeadEvents to fetch.
     */
    orderBy?: LeadEventOrderByWithRelationInput | LeadEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LeadEvents.
     */
    cursor?: LeadEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LeadEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LeadEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LeadEvents.
     */
    distinct?: LeadEventScalarFieldEnum | LeadEventScalarFieldEnum[]
  }

  /**
   * LeadEvent findMany
   */
  export type LeadEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeadEvent
     */
    select?: LeadEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeadEvent
     */
    omit?: LeadEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadEventInclude<ExtArgs> | null
    /**
     * Filter, which LeadEvents to fetch.
     */
    where?: LeadEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LeadEvents to fetch.
     */
    orderBy?: LeadEventOrderByWithRelationInput | LeadEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LeadEvents.
     */
    cursor?: LeadEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LeadEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LeadEvents.
     */
    skip?: number
    distinct?: LeadEventScalarFieldEnum | LeadEventScalarFieldEnum[]
  }

  /**
   * LeadEvent create
   */
  export type LeadEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeadEvent
     */
    select?: LeadEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeadEvent
     */
    omit?: LeadEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadEventInclude<ExtArgs> | null
    /**
     * The data needed to create a LeadEvent.
     */
    data: XOR<LeadEventCreateInput, LeadEventUncheckedCreateInput>
  }

  /**
   * LeadEvent createMany
   */
  export type LeadEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LeadEvents.
     */
    data: LeadEventCreateManyInput | LeadEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LeadEvent createManyAndReturn
   */
  export type LeadEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeadEvent
     */
    select?: LeadEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LeadEvent
     */
    omit?: LeadEventOmit<ExtArgs> | null
    /**
     * The data used to create many LeadEvents.
     */
    data: LeadEventCreateManyInput | LeadEventCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadEventIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LeadEvent update
   */
  export type LeadEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeadEvent
     */
    select?: LeadEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeadEvent
     */
    omit?: LeadEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadEventInclude<ExtArgs> | null
    /**
     * The data needed to update a LeadEvent.
     */
    data: XOR<LeadEventUpdateInput, LeadEventUncheckedUpdateInput>
    /**
     * Choose, which LeadEvent to update.
     */
    where: LeadEventWhereUniqueInput
  }

  /**
   * LeadEvent updateMany
   */
  export type LeadEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LeadEvents.
     */
    data: XOR<LeadEventUpdateManyMutationInput, LeadEventUncheckedUpdateManyInput>
    /**
     * Filter which LeadEvents to update
     */
    where?: LeadEventWhereInput
    /**
     * Limit how many LeadEvents to update.
     */
    limit?: number
  }

  /**
   * LeadEvent updateManyAndReturn
   */
  export type LeadEventUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeadEvent
     */
    select?: LeadEventSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LeadEvent
     */
    omit?: LeadEventOmit<ExtArgs> | null
    /**
     * The data used to update LeadEvents.
     */
    data: XOR<LeadEventUpdateManyMutationInput, LeadEventUncheckedUpdateManyInput>
    /**
     * Filter which LeadEvents to update
     */
    where?: LeadEventWhereInput
    /**
     * Limit how many LeadEvents to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadEventIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * LeadEvent upsert
   */
  export type LeadEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeadEvent
     */
    select?: LeadEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeadEvent
     */
    omit?: LeadEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadEventInclude<ExtArgs> | null
    /**
     * The filter to search for the LeadEvent to update in case it exists.
     */
    where: LeadEventWhereUniqueInput
    /**
     * In case the LeadEvent found by the `where` argument doesn't exist, create a new LeadEvent with this data.
     */
    create: XOR<LeadEventCreateInput, LeadEventUncheckedCreateInput>
    /**
     * In case the LeadEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LeadEventUpdateInput, LeadEventUncheckedUpdateInput>
  }

  /**
   * LeadEvent delete
   */
  export type LeadEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeadEvent
     */
    select?: LeadEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeadEvent
     */
    omit?: LeadEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadEventInclude<ExtArgs> | null
    /**
     * Filter which LeadEvent to delete.
     */
    where: LeadEventWhereUniqueInput
  }

  /**
   * LeadEvent deleteMany
   */
  export type LeadEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LeadEvents to delete
     */
    where?: LeadEventWhereInput
    /**
     * Limit how many LeadEvents to delete.
     */
    limit?: number
  }

  /**
   * LeadEvent without action
   */
  export type LeadEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeadEvent
     */
    select?: LeadEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeadEvent
     */
    omit?: LeadEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadEventInclude<ExtArgs> | null
  }


  /**
   * Model VideoWatchSession
   */

  export type AggregateVideoWatchSession = {
    _count: VideoWatchSessionCountAggregateOutputType | null
    _avg: VideoWatchSessionAvgAggregateOutputType | null
    _sum: VideoWatchSessionSumAggregateOutputType | null
    _min: VideoWatchSessionMinAggregateOutputType | null
    _max: VideoWatchSessionMaxAggregateOutputType | null
  }

  export type VideoWatchSessionAvgAggregateOutputType = {
    maxSecond: number | null
    durationSeconds: number | null
    droppedAtSecond: number | null
  }

  export type VideoWatchSessionSumAggregateOutputType = {
    maxSecond: number | null
    durationSeconds: number | null
    droppedAtSecond: number | null
  }

  export type VideoWatchSessionMinAggregateOutputType = {
    id: string | null
    visitorId: string | null
    videoId: string | null
    startedAt: Date | null
    lastHeartbeatAt: Date | null
    maxSecond: number | null
    durationSeconds: number | null
    unlocked: boolean | null
    completed: boolean | null
    droppedAtSecond: number | null
    dropReason: $Enums.VideoDropReason | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VideoWatchSessionMaxAggregateOutputType = {
    id: string | null
    visitorId: string | null
    videoId: string | null
    startedAt: Date | null
    lastHeartbeatAt: Date | null
    maxSecond: number | null
    durationSeconds: number | null
    unlocked: boolean | null
    completed: boolean | null
    droppedAtSecond: number | null
    dropReason: $Enums.VideoDropReason | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VideoWatchSessionCountAggregateOutputType = {
    id: number
    visitorId: number
    videoId: number
    startedAt: number
    lastHeartbeatAt: number
    maxSecond: number
    durationSeconds: number
    unlocked: number
    completed: number
    droppedAtSecond: number
    dropReason: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type VideoWatchSessionAvgAggregateInputType = {
    maxSecond?: true
    durationSeconds?: true
    droppedAtSecond?: true
  }

  export type VideoWatchSessionSumAggregateInputType = {
    maxSecond?: true
    durationSeconds?: true
    droppedAtSecond?: true
  }

  export type VideoWatchSessionMinAggregateInputType = {
    id?: true
    visitorId?: true
    videoId?: true
    startedAt?: true
    lastHeartbeatAt?: true
    maxSecond?: true
    durationSeconds?: true
    unlocked?: true
    completed?: true
    droppedAtSecond?: true
    dropReason?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VideoWatchSessionMaxAggregateInputType = {
    id?: true
    visitorId?: true
    videoId?: true
    startedAt?: true
    lastHeartbeatAt?: true
    maxSecond?: true
    durationSeconds?: true
    unlocked?: true
    completed?: true
    droppedAtSecond?: true
    dropReason?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VideoWatchSessionCountAggregateInputType = {
    id?: true
    visitorId?: true
    videoId?: true
    startedAt?: true
    lastHeartbeatAt?: true
    maxSecond?: true
    durationSeconds?: true
    unlocked?: true
    completed?: true
    droppedAtSecond?: true
    dropReason?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type VideoWatchSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VideoWatchSession to aggregate.
     */
    where?: VideoWatchSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VideoWatchSessions to fetch.
     */
    orderBy?: VideoWatchSessionOrderByWithRelationInput | VideoWatchSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VideoWatchSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VideoWatchSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VideoWatchSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VideoWatchSessions
    **/
    _count?: true | VideoWatchSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: VideoWatchSessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: VideoWatchSessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VideoWatchSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VideoWatchSessionMaxAggregateInputType
  }

  export type GetVideoWatchSessionAggregateType<T extends VideoWatchSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateVideoWatchSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVideoWatchSession[P]>
      : GetScalarType<T[P], AggregateVideoWatchSession[P]>
  }




  export type VideoWatchSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VideoWatchSessionWhereInput
    orderBy?: VideoWatchSessionOrderByWithAggregationInput | VideoWatchSessionOrderByWithAggregationInput[]
    by: VideoWatchSessionScalarFieldEnum[] | VideoWatchSessionScalarFieldEnum
    having?: VideoWatchSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VideoWatchSessionCountAggregateInputType | true
    _avg?: VideoWatchSessionAvgAggregateInputType
    _sum?: VideoWatchSessionSumAggregateInputType
    _min?: VideoWatchSessionMinAggregateInputType
    _max?: VideoWatchSessionMaxAggregateInputType
  }

  export type VideoWatchSessionGroupByOutputType = {
    id: string
    visitorId: string
    videoId: string
    startedAt: Date
    lastHeartbeatAt: Date
    maxSecond: number
    durationSeconds: number
    unlocked: boolean
    completed: boolean
    droppedAtSecond: number | null
    dropReason: $Enums.VideoDropReason | null
    createdAt: Date
    updatedAt: Date
    _count: VideoWatchSessionCountAggregateOutputType | null
    _avg: VideoWatchSessionAvgAggregateOutputType | null
    _sum: VideoWatchSessionSumAggregateOutputType | null
    _min: VideoWatchSessionMinAggregateOutputType | null
    _max: VideoWatchSessionMaxAggregateOutputType | null
  }

  type GetVideoWatchSessionGroupByPayload<T extends VideoWatchSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VideoWatchSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VideoWatchSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VideoWatchSessionGroupByOutputType[P]>
            : GetScalarType<T[P], VideoWatchSessionGroupByOutputType[P]>
        }
      >
    >


  export type VideoWatchSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    visitorId?: boolean
    videoId?: boolean
    startedAt?: boolean
    lastHeartbeatAt?: boolean
    maxSecond?: boolean
    durationSeconds?: boolean
    unlocked?: boolean
    completed?: boolean
    droppedAtSecond?: boolean
    dropReason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["videoWatchSession"]>

  export type VideoWatchSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    visitorId?: boolean
    videoId?: boolean
    startedAt?: boolean
    lastHeartbeatAt?: boolean
    maxSecond?: boolean
    durationSeconds?: boolean
    unlocked?: boolean
    completed?: boolean
    droppedAtSecond?: boolean
    dropReason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["videoWatchSession"]>

  export type VideoWatchSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    visitorId?: boolean
    videoId?: boolean
    startedAt?: boolean
    lastHeartbeatAt?: boolean
    maxSecond?: boolean
    durationSeconds?: boolean
    unlocked?: boolean
    completed?: boolean
    droppedAtSecond?: boolean
    dropReason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["videoWatchSession"]>

  export type VideoWatchSessionSelectScalar = {
    id?: boolean
    visitorId?: boolean
    videoId?: boolean
    startedAt?: boolean
    lastHeartbeatAt?: boolean
    maxSecond?: boolean
    durationSeconds?: boolean
    unlocked?: boolean
    completed?: boolean
    droppedAtSecond?: boolean
    dropReason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type VideoWatchSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "visitorId" | "videoId" | "startedAt" | "lastHeartbeatAt" | "maxSecond" | "durationSeconds" | "unlocked" | "completed" | "droppedAtSecond" | "dropReason" | "createdAt" | "updatedAt", ExtArgs["result"]["videoWatchSession"]>

  export type $VideoWatchSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "VideoWatchSession"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      visitorId: string
      videoId: string
      startedAt: Date
      lastHeartbeatAt: Date
      maxSecond: number
      durationSeconds: number
      unlocked: boolean
      completed: boolean
      droppedAtSecond: number | null
      dropReason: $Enums.VideoDropReason | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["videoWatchSession"]>
    composites: {}
  }

  type VideoWatchSessionGetPayload<S extends boolean | null | undefined | VideoWatchSessionDefaultArgs> = $Result.GetResult<Prisma.$VideoWatchSessionPayload, S>

  type VideoWatchSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VideoWatchSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VideoWatchSessionCountAggregateInputType | true
    }

  export interface VideoWatchSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['VideoWatchSession'], meta: { name: 'VideoWatchSession' } }
    /**
     * Find zero or one VideoWatchSession that matches the filter.
     * @param {VideoWatchSessionFindUniqueArgs} args - Arguments to find a VideoWatchSession
     * @example
     * // Get one VideoWatchSession
     * const videoWatchSession = await prisma.videoWatchSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VideoWatchSessionFindUniqueArgs>(args: SelectSubset<T, VideoWatchSessionFindUniqueArgs<ExtArgs>>): Prisma__VideoWatchSessionClient<$Result.GetResult<Prisma.$VideoWatchSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one VideoWatchSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VideoWatchSessionFindUniqueOrThrowArgs} args - Arguments to find a VideoWatchSession
     * @example
     * // Get one VideoWatchSession
     * const videoWatchSession = await prisma.videoWatchSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VideoWatchSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, VideoWatchSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VideoWatchSessionClient<$Result.GetResult<Prisma.$VideoWatchSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VideoWatchSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VideoWatchSessionFindFirstArgs} args - Arguments to find a VideoWatchSession
     * @example
     * // Get one VideoWatchSession
     * const videoWatchSession = await prisma.videoWatchSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VideoWatchSessionFindFirstArgs>(args?: SelectSubset<T, VideoWatchSessionFindFirstArgs<ExtArgs>>): Prisma__VideoWatchSessionClient<$Result.GetResult<Prisma.$VideoWatchSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VideoWatchSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VideoWatchSessionFindFirstOrThrowArgs} args - Arguments to find a VideoWatchSession
     * @example
     * // Get one VideoWatchSession
     * const videoWatchSession = await prisma.videoWatchSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VideoWatchSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, VideoWatchSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__VideoWatchSessionClient<$Result.GetResult<Prisma.$VideoWatchSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more VideoWatchSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VideoWatchSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VideoWatchSessions
     * const videoWatchSessions = await prisma.videoWatchSession.findMany()
     * 
     * // Get first 10 VideoWatchSessions
     * const videoWatchSessions = await prisma.videoWatchSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const videoWatchSessionWithIdOnly = await prisma.videoWatchSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VideoWatchSessionFindManyArgs>(args?: SelectSubset<T, VideoWatchSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VideoWatchSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a VideoWatchSession.
     * @param {VideoWatchSessionCreateArgs} args - Arguments to create a VideoWatchSession.
     * @example
     * // Create one VideoWatchSession
     * const VideoWatchSession = await prisma.videoWatchSession.create({
     *   data: {
     *     // ... data to create a VideoWatchSession
     *   }
     * })
     * 
     */
    create<T extends VideoWatchSessionCreateArgs>(args: SelectSubset<T, VideoWatchSessionCreateArgs<ExtArgs>>): Prisma__VideoWatchSessionClient<$Result.GetResult<Prisma.$VideoWatchSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many VideoWatchSessions.
     * @param {VideoWatchSessionCreateManyArgs} args - Arguments to create many VideoWatchSessions.
     * @example
     * // Create many VideoWatchSessions
     * const videoWatchSession = await prisma.videoWatchSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VideoWatchSessionCreateManyArgs>(args?: SelectSubset<T, VideoWatchSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many VideoWatchSessions and returns the data saved in the database.
     * @param {VideoWatchSessionCreateManyAndReturnArgs} args - Arguments to create many VideoWatchSessions.
     * @example
     * // Create many VideoWatchSessions
     * const videoWatchSession = await prisma.videoWatchSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many VideoWatchSessions and only return the `id`
     * const videoWatchSessionWithIdOnly = await prisma.videoWatchSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VideoWatchSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, VideoWatchSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VideoWatchSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a VideoWatchSession.
     * @param {VideoWatchSessionDeleteArgs} args - Arguments to delete one VideoWatchSession.
     * @example
     * // Delete one VideoWatchSession
     * const VideoWatchSession = await prisma.videoWatchSession.delete({
     *   where: {
     *     // ... filter to delete one VideoWatchSession
     *   }
     * })
     * 
     */
    delete<T extends VideoWatchSessionDeleteArgs>(args: SelectSubset<T, VideoWatchSessionDeleteArgs<ExtArgs>>): Prisma__VideoWatchSessionClient<$Result.GetResult<Prisma.$VideoWatchSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one VideoWatchSession.
     * @param {VideoWatchSessionUpdateArgs} args - Arguments to update one VideoWatchSession.
     * @example
     * // Update one VideoWatchSession
     * const videoWatchSession = await prisma.videoWatchSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VideoWatchSessionUpdateArgs>(args: SelectSubset<T, VideoWatchSessionUpdateArgs<ExtArgs>>): Prisma__VideoWatchSessionClient<$Result.GetResult<Prisma.$VideoWatchSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more VideoWatchSessions.
     * @param {VideoWatchSessionDeleteManyArgs} args - Arguments to filter VideoWatchSessions to delete.
     * @example
     * // Delete a few VideoWatchSessions
     * const { count } = await prisma.videoWatchSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VideoWatchSessionDeleteManyArgs>(args?: SelectSubset<T, VideoWatchSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VideoWatchSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VideoWatchSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VideoWatchSessions
     * const videoWatchSession = await prisma.videoWatchSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VideoWatchSessionUpdateManyArgs>(args: SelectSubset<T, VideoWatchSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VideoWatchSessions and returns the data updated in the database.
     * @param {VideoWatchSessionUpdateManyAndReturnArgs} args - Arguments to update many VideoWatchSessions.
     * @example
     * // Update many VideoWatchSessions
     * const videoWatchSession = await prisma.videoWatchSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more VideoWatchSessions and only return the `id`
     * const videoWatchSessionWithIdOnly = await prisma.videoWatchSession.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VideoWatchSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, VideoWatchSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VideoWatchSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one VideoWatchSession.
     * @param {VideoWatchSessionUpsertArgs} args - Arguments to update or create a VideoWatchSession.
     * @example
     * // Update or create a VideoWatchSession
     * const videoWatchSession = await prisma.videoWatchSession.upsert({
     *   create: {
     *     // ... data to create a VideoWatchSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VideoWatchSession we want to update
     *   }
     * })
     */
    upsert<T extends VideoWatchSessionUpsertArgs>(args: SelectSubset<T, VideoWatchSessionUpsertArgs<ExtArgs>>): Prisma__VideoWatchSessionClient<$Result.GetResult<Prisma.$VideoWatchSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of VideoWatchSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VideoWatchSessionCountArgs} args - Arguments to filter VideoWatchSessions to count.
     * @example
     * // Count the number of VideoWatchSessions
     * const count = await prisma.videoWatchSession.count({
     *   where: {
     *     // ... the filter for the VideoWatchSessions we want to count
     *   }
     * })
    **/
    count<T extends VideoWatchSessionCountArgs>(
      args?: Subset<T, VideoWatchSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VideoWatchSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VideoWatchSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VideoWatchSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VideoWatchSessionAggregateArgs>(args: Subset<T, VideoWatchSessionAggregateArgs>): Prisma.PrismaPromise<GetVideoWatchSessionAggregateType<T>>

    /**
     * Group by VideoWatchSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VideoWatchSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VideoWatchSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VideoWatchSessionGroupByArgs['orderBy'] }
        : { orderBy?: VideoWatchSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VideoWatchSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVideoWatchSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the VideoWatchSession model
   */
  readonly fields: VideoWatchSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VideoWatchSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VideoWatchSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the VideoWatchSession model
   */
  interface VideoWatchSessionFieldRefs {
    readonly id: FieldRef<"VideoWatchSession", 'String'>
    readonly visitorId: FieldRef<"VideoWatchSession", 'String'>
    readonly videoId: FieldRef<"VideoWatchSession", 'String'>
    readonly startedAt: FieldRef<"VideoWatchSession", 'DateTime'>
    readonly lastHeartbeatAt: FieldRef<"VideoWatchSession", 'DateTime'>
    readonly maxSecond: FieldRef<"VideoWatchSession", 'Int'>
    readonly durationSeconds: FieldRef<"VideoWatchSession", 'Int'>
    readonly unlocked: FieldRef<"VideoWatchSession", 'Boolean'>
    readonly completed: FieldRef<"VideoWatchSession", 'Boolean'>
    readonly droppedAtSecond: FieldRef<"VideoWatchSession", 'Int'>
    readonly dropReason: FieldRef<"VideoWatchSession", 'VideoDropReason'>
    readonly createdAt: FieldRef<"VideoWatchSession", 'DateTime'>
    readonly updatedAt: FieldRef<"VideoWatchSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * VideoWatchSession findUnique
   */
  export type VideoWatchSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VideoWatchSession
     */
    select?: VideoWatchSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VideoWatchSession
     */
    omit?: VideoWatchSessionOmit<ExtArgs> | null
    /**
     * Filter, which VideoWatchSession to fetch.
     */
    where: VideoWatchSessionWhereUniqueInput
  }

  /**
   * VideoWatchSession findUniqueOrThrow
   */
  export type VideoWatchSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VideoWatchSession
     */
    select?: VideoWatchSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VideoWatchSession
     */
    omit?: VideoWatchSessionOmit<ExtArgs> | null
    /**
     * Filter, which VideoWatchSession to fetch.
     */
    where: VideoWatchSessionWhereUniqueInput
  }

  /**
   * VideoWatchSession findFirst
   */
  export type VideoWatchSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VideoWatchSession
     */
    select?: VideoWatchSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VideoWatchSession
     */
    omit?: VideoWatchSessionOmit<ExtArgs> | null
    /**
     * Filter, which VideoWatchSession to fetch.
     */
    where?: VideoWatchSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VideoWatchSessions to fetch.
     */
    orderBy?: VideoWatchSessionOrderByWithRelationInput | VideoWatchSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VideoWatchSessions.
     */
    cursor?: VideoWatchSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VideoWatchSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VideoWatchSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VideoWatchSessions.
     */
    distinct?: VideoWatchSessionScalarFieldEnum | VideoWatchSessionScalarFieldEnum[]
  }

  /**
   * VideoWatchSession findFirstOrThrow
   */
  export type VideoWatchSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VideoWatchSession
     */
    select?: VideoWatchSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VideoWatchSession
     */
    omit?: VideoWatchSessionOmit<ExtArgs> | null
    /**
     * Filter, which VideoWatchSession to fetch.
     */
    where?: VideoWatchSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VideoWatchSessions to fetch.
     */
    orderBy?: VideoWatchSessionOrderByWithRelationInput | VideoWatchSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VideoWatchSessions.
     */
    cursor?: VideoWatchSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VideoWatchSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VideoWatchSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VideoWatchSessions.
     */
    distinct?: VideoWatchSessionScalarFieldEnum | VideoWatchSessionScalarFieldEnum[]
  }

  /**
   * VideoWatchSession findMany
   */
  export type VideoWatchSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VideoWatchSession
     */
    select?: VideoWatchSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VideoWatchSession
     */
    omit?: VideoWatchSessionOmit<ExtArgs> | null
    /**
     * Filter, which VideoWatchSessions to fetch.
     */
    where?: VideoWatchSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VideoWatchSessions to fetch.
     */
    orderBy?: VideoWatchSessionOrderByWithRelationInput | VideoWatchSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VideoWatchSessions.
     */
    cursor?: VideoWatchSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VideoWatchSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VideoWatchSessions.
     */
    skip?: number
    distinct?: VideoWatchSessionScalarFieldEnum | VideoWatchSessionScalarFieldEnum[]
  }

  /**
   * VideoWatchSession create
   */
  export type VideoWatchSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VideoWatchSession
     */
    select?: VideoWatchSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VideoWatchSession
     */
    omit?: VideoWatchSessionOmit<ExtArgs> | null
    /**
     * The data needed to create a VideoWatchSession.
     */
    data: XOR<VideoWatchSessionCreateInput, VideoWatchSessionUncheckedCreateInput>
  }

  /**
   * VideoWatchSession createMany
   */
  export type VideoWatchSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many VideoWatchSessions.
     */
    data: VideoWatchSessionCreateManyInput | VideoWatchSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VideoWatchSession createManyAndReturn
   */
  export type VideoWatchSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VideoWatchSession
     */
    select?: VideoWatchSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VideoWatchSession
     */
    omit?: VideoWatchSessionOmit<ExtArgs> | null
    /**
     * The data used to create many VideoWatchSessions.
     */
    data: VideoWatchSessionCreateManyInput | VideoWatchSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VideoWatchSession update
   */
  export type VideoWatchSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VideoWatchSession
     */
    select?: VideoWatchSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VideoWatchSession
     */
    omit?: VideoWatchSessionOmit<ExtArgs> | null
    /**
     * The data needed to update a VideoWatchSession.
     */
    data: XOR<VideoWatchSessionUpdateInput, VideoWatchSessionUncheckedUpdateInput>
    /**
     * Choose, which VideoWatchSession to update.
     */
    where: VideoWatchSessionWhereUniqueInput
  }

  /**
   * VideoWatchSession updateMany
   */
  export type VideoWatchSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update VideoWatchSessions.
     */
    data: XOR<VideoWatchSessionUpdateManyMutationInput, VideoWatchSessionUncheckedUpdateManyInput>
    /**
     * Filter which VideoWatchSessions to update
     */
    where?: VideoWatchSessionWhereInput
    /**
     * Limit how many VideoWatchSessions to update.
     */
    limit?: number
  }

  /**
   * VideoWatchSession updateManyAndReturn
   */
  export type VideoWatchSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VideoWatchSession
     */
    select?: VideoWatchSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VideoWatchSession
     */
    omit?: VideoWatchSessionOmit<ExtArgs> | null
    /**
     * The data used to update VideoWatchSessions.
     */
    data: XOR<VideoWatchSessionUpdateManyMutationInput, VideoWatchSessionUncheckedUpdateManyInput>
    /**
     * Filter which VideoWatchSessions to update
     */
    where?: VideoWatchSessionWhereInput
    /**
     * Limit how many VideoWatchSessions to update.
     */
    limit?: number
  }

  /**
   * VideoWatchSession upsert
   */
  export type VideoWatchSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VideoWatchSession
     */
    select?: VideoWatchSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VideoWatchSession
     */
    omit?: VideoWatchSessionOmit<ExtArgs> | null
    /**
     * The filter to search for the VideoWatchSession to update in case it exists.
     */
    where: VideoWatchSessionWhereUniqueInput
    /**
     * In case the VideoWatchSession found by the `where` argument doesn't exist, create a new VideoWatchSession with this data.
     */
    create: XOR<VideoWatchSessionCreateInput, VideoWatchSessionUncheckedCreateInput>
    /**
     * In case the VideoWatchSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VideoWatchSessionUpdateInput, VideoWatchSessionUncheckedUpdateInput>
  }

  /**
   * VideoWatchSession delete
   */
  export type VideoWatchSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VideoWatchSession
     */
    select?: VideoWatchSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VideoWatchSession
     */
    omit?: VideoWatchSessionOmit<ExtArgs> | null
    /**
     * Filter which VideoWatchSession to delete.
     */
    where: VideoWatchSessionWhereUniqueInput
  }

  /**
   * VideoWatchSession deleteMany
   */
  export type VideoWatchSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VideoWatchSessions to delete
     */
    where?: VideoWatchSessionWhereInput
    /**
     * Limit how many VideoWatchSessions to delete.
     */
    limit?: number
  }

  /**
   * VideoWatchSession without action
   */
  export type VideoWatchSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VideoWatchSession
     */
    select?: VideoWatchSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VideoWatchSession
     */
    omit?: VideoWatchSessionOmit<ExtArgs> | null
  }


  /**
   * Model LeadPipeline
   */

  export type AggregateLeadPipeline = {
    _count: LeadPipelineCountAggregateOutputType | null
    _min: LeadPipelineMinAggregateOutputType | null
    _max: LeadPipelineMaxAggregateOutputType | null
  }

  export type LeadPipelineMinAggregateOutputType = {
    id: string | null
    contactId: string | null
    funnelOrigin: $Enums.FunnelOrigin | null
    currentStage: $Enums.PipelineStage | null
    currentState: $Enums.PipelineState | null
    scheduledJobId: string | null
    scheduledJobDedupKey: string | null
    videoWatched: boolean | null
    utmSource: string | null
    pixelFiredAt: Date | null
    painPoint: string | null
    meetingId: string | null
    meetingTime: Date | null
    meetLink: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LeadPipelineMaxAggregateOutputType = {
    id: string | null
    contactId: string | null
    funnelOrigin: $Enums.FunnelOrigin | null
    currentStage: $Enums.PipelineStage | null
    currentState: $Enums.PipelineState | null
    scheduledJobId: string | null
    scheduledJobDedupKey: string | null
    videoWatched: boolean | null
    utmSource: string | null
    pixelFiredAt: Date | null
    painPoint: string | null
    meetingId: string | null
    meetingTime: Date | null
    meetLink: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LeadPipelineCountAggregateOutputType = {
    id: number
    contactId: number
    funnelOrigin: number
    currentStage: number
    currentState: number
    scheduledJobId: number
    scheduledJobDedupKey: number
    videoWatched: number
    utmSource: number
    pixelFiredAt: number
    painPoint: number
    qualificationAnswers: number
    meetingId: number
    meetingTime: number
    meetLink: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type LeadPipelineMinAggregateInputType = {
    id?: true
    contactId?: true
    funnelOrigin?: true
    currentStage?: true
    currentState?: true
    scheduledJobId?: true
    scheduledJobDedupKey?: true
    videoWatched?: true
    utmSource?: true
    pixelFiredAt?: true
    painPoint?: true
    meetingId?: true
    meetingTime?: true
    meetLink?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LeadPipelineMaxAggregateInputType = {
    id?: true
    contactId?: true
    funnelOrigin?: true
    currentStage?: true
    currentState?: true
    scheduledJobId?: true
    scheduledJobDedupKey?: true
    videoWatched?: true
    utmSource?: true
    pixelFiredAt?: true
    painPoint?: true
    meetingId?: true
    meetingTime?: true
    meetLink?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LeadPipelineCountAggregateInputType = {
    id?: true
    contactId?: true
    funnelOrigin?: true
    currentStage?: true
    currentState?: true
    scheduledJobId?: true
    scheduledJobDedupKey?: true
    videoWatched?: true
    utmSource?: true
    pixelFiredAt?: true
    painPoint?: true
    qualificationAnswers?: true
    meetingId?: true
    meetingTime?: true
    meetLink?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type LeadPipelineAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LeadPipeline to aggregate.
     */
    where?: LeadPipelineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LeadPipelines to fetch.
     */
    orderBy?: LeadPipelineOrderByWithRelationInput | LeadPipelineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LeadPipelineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LeadPipelines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LeadPipelines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LeadPipelines
    **/
    _count?: true | LeadPipelineCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LeadPipelineMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LeadPipelineMaxAggregateInputType
  }

  export type GetLeadPipelineAggregateType<T extends LeadPipelineAggregateArgs> = {
        [P in keyof T & keyof AggregateLeadPipeline]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLeadPipeline[P]>
      : GetScalarType<T[P], AggregateLeadPipeline[P]>
  }




  export type LeadPipelineGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LeadPipelineWhereInput
    orderBy?: LeadPipelineOrderByWithAggregationInput | LeadPipelineOrderByWithAggregationInput[]
    by: LeadPipelineScalarFieldEnum[] | LeadPipelineScalarFieldEnum
    having?: LeadPipelineScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LeadPipelineCountAggregateInputType | true
    _min?: LeadPipelineMinAggregateInputType
    _max?: LeadPipelineMaxAggregateInputType
  }

  export type LeadPipelineGroupByOutputType = {
    id: string
    contactId: string
    funnelOrigin: $Enums.FunnelOrigin
    currentStage: $Enums.PipelineStage
    currentState: $Enums.PipelineState
    scheduledJobId: string | null
    scheduledJobDedupKey: string | null
    videoWatched: boolean
    utmSource: string | null
    pixelFiredAt: Date | null
    painPoint: string | null
    qualificationAnswers: JsonValue | null
    meetingId: string | null
    meetingTime: Date | null
    meetLink: string | null
    createdAt: Date
    updatedAt: Date
    _count: LeadPipelineCountAggregateOutputType | null
    _min: LeadPipelineMinAggregateOutputType | null
    _max: LeadPipelineMaxAggregateOutputType | null
  }

  type GetLeadPipelineGroupByPayload<T extends LeadPipelineGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LeadPipelineGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LeadPipelineGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LeadPipelineGroupByOutputType[P]>
            : GetScalarType<T[P], LeadPipelineGroupByOutputType[P]>
        }
      >
    >


  export type LeadPipelineSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    contactId?: boolean
    funnelOrigin?: boolean
    currentStage?: boolean
    currentState?: boolean
    scheduledJobId?: boolean
    scheduledJobDedupKey?: boolean
    videoWatched?: boolean
    utmSource?: boolean
    pixelFiredAt?: boolean
    painPoint?: boolean
    qualificationAnswers?: boolean
    meetingId?: boolean
    meetingTime?: boolean
    meetLink?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    contact?: boolean | ContactDefaultArgs<ExtArgs>
    jobs?: boolean | LeadPipeline$jobsArgs<ExtArgs>
    _count?: boolean | LeadPipelineCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["leadPipeline"]>

  export type LeadPipelineSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    contactId?: boolean
    funnelOrigin?: boolean
    currentStage?: boolean
    currentState?: boolean
    scheduledJobId?: boolean
    scheduledJobDedupKey?: boolean
    videoWatched?: boolean
    utmSource?: boolean
    pixelFiredAt?: boolean
    painPoint?: boolean
    qualificationAnswers?: boolean
    meetingId?: boolean
    meetingTime?: boolean
    meetLink?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    contact?: boolean | ContactDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["leadPipeline"]>

  export type LeadPipelineSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    contactId?: boolean
    funnelOrigin?: boolean
    currentStage?: boolean
    currentState?: boolean
    scheduledJobId?: boolean
    scheduledJobDedupKey?: boolean
    videoWatched?: boolean
    utmSource?: boolean
    pixelFiredAt?: boolean
    painPoint?: boolean
    qualificationAnswers?: boolean
    meetingId?: boolean
    meetingTime?: boolean
    meetLink?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    contact?: boolean | ContactDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["leadPipeline"]>

  export type LeadPipelineSelectScalar = {
    id?: boolean
    contactId?: boolean
    funnelOrigin?: boolean
    currentStage?: boolean
    currentState?: boolean
    scheduledJobId?: boolean
    scheduledJobDedupKey?: boolean
    videoWatched?: boolean
    utmSource?: boolean
    pixelFiredAt?: boolean
    painPoint?: boolean
    qualificationAnswers?: boolean
    meetingId?: boolean
    meetingTime?: boolean
    meetLink?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type LeadPipelineOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "contactId" | "funnelOrigin" | "currentStage" | "currentState" | "scheduledJobId" | "scheduledJobDedupKey" | "videoWatched" | "utmSource" | "pixelFiredAt" | "painPoint" | "qualificationAnswers" | "meetingId" | "meetingTime" | "meetLink" | "createdAt" | "updatedAt", ExtArgs["result"]["leadPipeline"]>
  export type LeadPipelineInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    contact?: boolean | ContactDefaultArgs<ExtArgs>
    jobs?: boolean | LeadPipeline$jobsArgs<ExtArgs>
    _count?: boolean | LeadPipelineCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type LeadPipelineIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    contact?: boolean | ContactDefaultArgs<ExtArgs>
  }
  export type LeadPipelineIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    contact?: boolean | ContactDefaultArgs<ExtArgs>
  }

  export type $LeadPipelinePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LeadPipeline"
    objects: {
      contact: Prisma.$ContactPayload<ExtArgs>
      jobs: Prisma.$PipelineJobPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      contactId: string
      funnelOrigin: $Enums.FunnelOrigin
      currentStage: $Enums.PipelineStage
      currentState: $Enums.PipelineState
      scheduledJobId: string | null
      scheduledJobDedupKey: string | null
      videoWatched: boolean
      utmSource: string | null
      pixelFiredAt: Date | null
      painPoint: string | null
      qualificationAnswers: Prisma.JsonValue | null
      meetingId: string | null
      meetingTime: Date | null
      meetLink: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["leadPipeline"]>
    composites: {}
  }

  type LeadPipelineGetPayload<S extends boolean | null | undefined | LeadPipelineDefaultArgs> = $Result.GetResult<Prisma.$LeadPipelinePayload, S>

  type LeadPipelineCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LeadPipelineFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LeadPipelineCountAggregateInputType | true
    }

  export interface LeadPipelineDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LeadPipeline'], meta: { name: 'LeadPipeline' } }
    /**
     * Find zero or one LeadPipeline that matches the filter.
     * @param {LeadPipelineFindUniqueArgs} args - Arguments to find a LeadPipeline
     * @example
     * // Get one LeadPipeline
     * const leadPipeline = await prisma.leadPipeline.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LeadPipelineFindUniqueArgs>(args: SelectSubset<T, LeadPipelineFindUniqueArgs<ExtArgs>>): Prisma__LeadPipelineClient<$Result.GetResult<Prisma.$LeadPipelinePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LeadPipeline that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LeadPipelineFindUniqueOrThrowArgs} args - Arguments to find a LeadPipeline
     * @example
     * // Get one LeadPipeline
     * const leadPipeline = await prisma.leadPipeline.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LeadPipelineFindUniqueOrThrowArgs>(args: SelectSubset<T, LeadPipelineFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LeadPipelineClient<$Result.GetResult<Prisma.$LeadPipelinePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LeadPipeline that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadPipelineFindFirstArgs} args - Arguments to find a LeadPipeline
     * @example
     * // Get one LeadPipeline
     * const leadPipeline = await prisma.leadPipeline.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LeadPipelineFindFirstArgs>(args?: SelectSubset<T, LeadPipelineFindFirstArgs<ExtArgs>>): Prisma__LeadPipelineClient<$Result.GetResult<Prisma.$LeadPipelinePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LeadPipeline that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadPipelineFindFirstOrThrowArgs} args - Arguments to find a LeadPipeline
     * @example
     * // Get one LeadPipeline
     * const leadPipeline = await prisma.leadPipeline.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LeadPipelineFindFirstOrThrowArgs>(args?: SelectSubset<T, LeadPipelineFindFirstOrThrowArgs<ExtArgs>>): Prisma__LeadPipelineClient<$Result.GetResult<Prisma.$LeadPipelinePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LeadPipelines that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadPipelineFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LeadPipelines
     * const leadPipelines = await prisma.leadPipeline.findMany()
     * 
     * // Get first 10 LeadPipelines
     * const leadPipelines = await prisma.leadPipeline.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const leadPipelineWithIdOnly = await prisma.leadPipeline.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LeadPipelineFindManyArgs>(args?: SelectSubset<T, LeadPipelineFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeadPipelinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LeadPipeline.
     * @param {LeadPipelineCreateArgs} args - Arguments to create a LeadPipeline.
     * @example
     * // Create one LeadPipeline
     * const LeadPipeline = await prisma.leadPipeline.create({
     *   data: {
     *     // ... data to create a LeadPipeline
     *   }
     * })
     * 
     */
    create<T extends LeadPipelineCreateArgs>(args: SelectSubset<T, LeadPipelineCreateArgs<ExtArgs>>): Prisma__LeadPipelineClient<$Result.GetResult<Prisma.$LeadPipelinePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LeadPipelines.
     * @param {LeadPipelineCreateManyArgs} args - Arguments to create many LeadPipelines.
     * @example
     * // Create many LeadPipelines
     * const leadPipeline = await prisma.leadPipeline.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LeadPipelineCreateManyArgs>(args?: SelectSubset<T, LeadPipelineCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LeadPipelines and returns the data saved in the database.
     * @param {LeadPipelineCreateManyAndReturnArgs} args - Arguments to create many LeadPipelines.
     * @example
     * // Create many LeadPipelines
     * const leadPipeline = await prisma.leadPipeline.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LeadPipelines and only return the `id`
     * const leadPipelineWithIdOnly = await prisma.leadPipeline.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LeadPipelineCreateManyAndReturnArgs>(args?: SelectSubset<T, LeadPipelineCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeadPipelinePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LeadPipeline.
     * @param {LeadPipelineDeleteArgs} args - Arguments to delete one LeadPipeline.
     * @example
     * // Delete one LeadPipeline
     * const LeadPipeline = await prisma.leadPipeline.delete({
     *   where: {
     *     // ... filter to delete one LeadPipeline
     *   }
     * })
     * 
     */
    delete<T extends LeadPipelineDeleteArgs>(args: SelectSubset<T, LeadPipelineDeleteArgs<ExtArgs>>): Prisma__LeadPipelineClient<$Result.GetResult<Prisma.$LeadPipelinePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LeadPipeline.
     * @param {LeadPipelineUpdateArgs} args - Arguments to update one LeadPipeline.
     * @example
     * // Update one LeadPipeline
     * const leadPipeline = await prisma.leadPipeline.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LeadPipelineUpdateArgs>(args: SelectSubset<T, LeadPipelineUpdateArgs<ExtArgs>>): Prisma__LeadPipelineClient<$Result.GetResult<Prisma.$LeadPipelinePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LeadPipelines.
     * @param {LeadPipelineDeleteManyArgs} args - Arguments to filter LeadPipelines to delete.
     * @example
     * // Delete a few LeadPipelines
     * const { count } = await prisma.leadPipeline.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LeadPipelineDeleteManyArgs>(args?: SelectSubset<T, LeadPipelineDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LeadPipelines.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadPipelineUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LeadPipelines
     * const leadPipeline = await prisma.leadPipeline.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LeadPipelineUpdateManyArgs>(args: SelectSubset<T, LeadPipelineUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LeadPipelines and returns the data updated in the database.
     * @param {LeadPipelineUpdateManyAndReturnArgs} args - Arguments to update many LeadPipelines.
     * @example
     * // Update many LeadPipelines
     * const leadPipeline = await prisma.leadPipeline.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LeadPipelines and only return the `id`
     * const leadPipelineWithIdOnly = await prisma.leadPipeline.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LeadPipelineUpdateManyAndReturnArgs>(args: SelectSubset<T, LeadPipelineUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeadPipelinePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LeadPipeline.
     * @param {LeadPipelineUpsertArgs} args - Arguments to update or create a LeadPipeline.
     * @example
     * // Update or create a LeadPipeline
     * const leadPipeline = await prisma.leadPipeline.upsert({
     *   create: {
     *     // ... data to create a LeadPipeline
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LeadPipeline we want to update
     *   }
     * })
     */
    upsert<T extends LeadPipelineUpsertArgs>(args: SelectSubset<T, LeadPipelineUpsertArgs<ExtArgs>>): Prisma__LeadPipelineClient<$Result.GetResult<Prisma.$LeadPipelinePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LeadPipelines.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadPipelineCountArgs} args - Arguments to filter LeadPipelines to count.
     * @example
     * // Count the number of LeadPipelines
     * const count = await prisma.leadPipeline.count({
     *   where: {
     *     // ... the filter for the LeadPipelines we want to count
     *   }
     * })
    **/
    count<T extends LeadPipelineCountArgs>(
      args?: Subset<T, LeadPipelineCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LeadPipelineCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LeadPipeline.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadPipelineAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LeadPipelineAggregateArgs>(args: Subset<T, LeadPipelineAggregateArgs>): Prisma.PrismaPromise<GetLeadPipelineAggregateType<T>>

    /**
     * Group by LeadPipeline.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadPipelineGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LeadPipelineGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LeadPipelineGroupByArgs['orderBy'] }
        : { orderBy?: LeadPipelineGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LeadPipelineGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLeadPipelineGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LeadPipeline model
   */
  readonly fields: LeadPipelineFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LeadPipeline.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LeadPipelineClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    contact<T extends ContactDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ContactDefaultArgs<ExtArgs>>): Prisma__ContactClient<$Result.GetResult<Prisma.$ContactPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    jobs<T extends LeadPipeline$jobsArgs<ExtArgs> = {}>(args?: Subset<T, LeadPipeline$jobsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PipelineJobPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LeadPipeline model
   */
  interface LeadPipelineFieldRefs {
    readonly id: FieldRef<"LeadPipeline", 'String'>
    readonly contactId: FieldRef<"LeadPipeline", 'String'>
    readonly funnelOrigin: FieldRef<"LeadPipeline", 'FunnelOrigin'>
    readonly currentStage: FieldRef<"LeadPipeline", 'PipelineStage'>
    readonly currentState: FieldRef<"LeadPipeline", 'PipelineState'>
    readonly scheduledJobId: FieldRef<"LeadPipeline", 'String'>
    readonly scheduledJobDedupKey: FieldRef<"LeadPipeline", 'String'>
    readonly videoWatched: FieldRef<"LeadPipeline", 'Boolean'>
    readonly utmSource: FieldRef<"LeadPipeline", 'String'>
    readonly pixelFiredAt: FieldRef<"LeadPipeline", 'DateTime'>
    readonly painPoint: FieldRef<"LeadPipeline", 'String'>
    readonly qualificationAnswers: FieldRef<"LeadPipeline", 'Json'>
    readonly meetingId: FieldRef<"LeadPipeline", 'String'>
    readonly meetingTime: FieldRef<"LeadPipeline", 'DateTime'>
    readonly meetLink: FieldRef<"LeadPipeline", 'String'>
    readonly createdAt: FieldRef<"LeadPipeline", 'DateTime'>
    readonly updatedAt: FieldRef<"LeadPipeline", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LeadPipeline findUnique
   */
  export type LeadPipelineFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeadPipeline
     */
    select?: LeadPipelineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeadPipeline
     */
    omit?: LeadPipelineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadPipelineInclude<ExtArgs> | null
    /**
     * Filter, which LeadPipeline to fetch.
     */
    where: LeadPipelineWhereUniqueInput
  }

  /**
   * LeadPipeline findUniqueOrThrow
   */
  export type LeadPipelineFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeadPipeline
     */
    select?: LeadPipelineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeadPipeline
     */
    omit?: LeadPipelineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadPipelineInclude<ExtArgs> | null
    /**
     * Filter, which LeadPipeline to fetch.
     */
    where: LeadPipelineWhereUniqueInput
  }

  /**
   * LeadPipeline findFirst
   */
  export type LeadPipelineFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeadPipeline
     */
    select?: LeadPipelineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeadPipeline
     */
    omit?: LeadPipelineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadPipelineInclude<ExtArgs> | null
    /**
     * Filter, which LeadPipeline to fetch.
     */
    where?: LeadPipelineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LeadPipelines to fetch.
     */
    orderBy?: LeadPipelineOrderByWithRelationInput | LeadPipelineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LeadPipelines.
     */
    cursor?: LeadPipelineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LeadPipelines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LeadPipelines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LeadPipelines.
     */
    distinct?: LeadPipelineScalarFieldEnum | LeadPipelineScalarFieldEnum[]
  }

  /**
   * LeadPipeline findFirstOrThrow
   */
  export type LeadPipelineFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeadPipeline
     */
    select?: LeadPipelineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeadPipeline
     */
    omit?: LeadPipelineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadPipelineInclude<ExtArgs> | null
    /**
     * Filter, which LeadPipeline to fetch.
     */
    where?: LeadPipelineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LeadPipelines to fetch.
     */
    orderBy?: LeadPipelineOrderByWithRelationInput | LeadPipelineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LeadPipelines.
     */
    cursor?: LeadPipelineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LeadPipelines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LeadPipelines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LeadPipelines.
     */
    distinct?: LeadPipelineScalarFieldEnum | LeadPipelineScalarFieldEnum[]
  }

  /**
   * LeadPipeline findMany
   */
  export type LeadPipelineFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeadPipeline
     */
    select?: LeadPipelineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeadPipeline
     */
    omit?: LeadPipelineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadPipelineInclude<ExtArgs> | null
    /**
     * Filter, which LeadPipelines to fetch.
     */
    where?: LeadPipelineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LeadPipelines to fetch.
     */
    orderBy?: LeadPipelineOrderByWithRelationInput | LeadPipelineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LeadPipelines.
     */
    cursor?: LeadPipelineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LeadPipelines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LeadPipelines.
     */
    skip?: number
    distinct?: LeadPipelineScalarFieldEnum | LeadPipelineScalarFieldEnum[]
  }

  /**
   * LeadPipeline create
   */
  export type LeadPipelineCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeadPipeline
     */
    select?: LeadPipelineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeadPipeline
     */
    omit?: LeadPipelineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadPipelineInclude<ExtArgs> | null
    /**
     * The data needed to create a LeadPipeline.
     */
    data: XOR<LeadPipelineCreateInput, LeadPipelineUncheckedCreateInput>
  }

  /**
   * LeadPipeline createMany
   */
  export type LeadPipelineCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LeadPipelines.
     */
    data: LeadPipelineCreateManyInput | LeadPipelineCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LeadPipeline createManyAndReturn
   */
  export type LeadPipelineCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeadPipeline
     */
    select?: LeadPipelineSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LeadPipeline
     */
    omit?: LeadPipelineOmit<ExtArgs> | null
    /**
     * The data used to create many LeadPipelines.
     */
    data: LeadPipelineCreateManyInput | LeadPipelineCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadPipelineIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LeadPipeline update
   */
  export type LeadPipelineUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeadPipeline
     */
    select?: LeadPipelineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeadPipeline
     */
    omit?: LeadPipelineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadPipelineInclude<ExtArgs> | null
    /**
     * The data needed to update a LeadPipeline.
     */
    data: XOR<LeadPipelineUpdateInput, LeadPipelineUncheckedUpdateInput>
    /**
     * Choose, which LeadPipeline to update.
     */
    where: LeadPipelineWhereUniqueInput
  }

  /**
   * LeadPipeline updateMany
   */
  export type LeadPipelineUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LeadPipelines.
     */
    data: XOR<LeadPipelineUpdateManyMutationInput, LeadPipelineUncheckedUpdateManyInput>
    /**
     * Filter which LeadPipelines to update
     */
    where?: LeadPipelineWhereInput
    /**
     * Limit how many LeadPipelines to update.
     */
    limit?: number
  }

  /**
   * LeadPipeline updateManyAndReturn
   */
  export type LeadPipelineUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeadPipeline
     */
    select?: LeadPipelineSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LeadPipeline
     */
    omit?: LeadPipelineOmit<ExtArgs> | null
    /**
     * The data used to update LeadPipelines.
     */
    data: XOR<LeadPipelineUpdateManyMutationInput, LeadPipelineUncheckedUpdateManyInput>
    /**
     * Filter which LeadPipelines to update
     */
    where?: LeadPipelineWhereInput
    /**
     * Limit how many LeadPipelines to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadPipelineIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * LeadPipeline upsert
   */
  export type LeadPipelineUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeadPipeline
     */
    select?: LeadPipelineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeadPipeline
     */
    omit?: LeadPipelineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadPipelineInclude<ExtArgs> | null
    /**
     * The filter to search for the LeadPipeline to update in case it exists.
     */
    where: LeadPipelineWhereUniqueInput
    /**
     * In case the LeadPipeline found by the `where` argument doesn't exist, create a new LeadPipeline with this data.
     */
    create: XOR<LeadPipelineCreateInput, LeadPipelineUncheckedCreateInput>
    /**
     * In case the LeadPipeline was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LeadPipelineUpdateInput, LeadPipelineUncheckedUpdateInput>
  }

  /**
   * LeadPipeline delete
   */
  export type LeadPipelineDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeadPipeline
     */
    select?: LeadPipelineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeadPipeline
     */
    omit?: LeadPipelineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadPipelineInclude<ExtArgs> | null
    /**
     * Filter which LeadPipeline to delete.
     */
    where: LeadPipelineWhereUniqueInput
  }

  /**
   * LeadPipeline deleteMany
   */
  export type LeadPipelineDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LeadPipelines to delete
     */
    where?: LeadPipelineWhereInput
    /**
     * Limit how many LeadPipelines to delete.
     */
    limit?: number
  }

  /**
   * LeadPipeline.jobs
   */
  export type LeadPipeline$jobsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PipelineJob
     */
    select?: PipelineJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PipelineJob
     */
    omit?: PipelineJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PipelineJobInclude<ExtArgs> | null
    where?: PipelineJobWhereInput
    orderBy?: PipelineJobOrderByWithRelationInput | PipelineJobOrderByWithRelationInput[]
    cursor?: PipelineJobWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PipelineJobScalarFieldEnum | PipelineJobScalarFieldEnum[]
  }

  /**
   * LeadPipeline without action
   */
  export type LeadPipelineDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeadPipeline
     */
    select?: LeadPipelineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeadPipeline
     */
    omit?: LeadPipelineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadPipelineInclude<ExtArgs> | null
  }


  /**
   * Model Conversation
   */

  export type AggregateConversation = {
    _count: ConversationCountAggregateOutputType | null
    _min: ConversationMinAggregateOutputType | null
    _max: ConversationMaxAggregateOutputType | null
  }

  export type ConversationMinAggregateOutputType = {
    id: string | null
    contactId: string | null
    channel: $Enums.ConversationChannel | null
    waPhoneNumberId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ConversationMaxAggregateOutputType = {
    id: string | null
    contactId: string | null
    channel: $Enums.ConversationChannel | null
    waPhoneNumberId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ConversationCountAggregateOutputType = {
    id: number
    contactId: number
    channel: number
    waPhoneNumberId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ConversationMinAggregateInputType = {
    id?: true
    contactId?: true
    channel?: true
    waPhoneNumberId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ConversationMaxAggregateInputType = {
    id?: true
    contactId?: true
    channel?: true
    waPhoneNumberId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ConversationCountAggregateInputType = {
    id?: true
    contactId?: true
    channel?: true
    waPhoneNumberId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ConversationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Conversation to aggregate.
     */
    where?: ConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Conversations to fetch.
     */
    orderBy?: ConversationOrderByWithRelationInput | ConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Conversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Conversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Conversations
    **/
    _count?: true | ConversationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ConversationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ConversationMaxAggregateInputType
  }

  export type GetConversationAggregateType<T extends ConversationAggregateArgs> = {
        [P in keyof T & keyof AggregateConversation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateConversation[P]>
      : GetScalarType<T[P], AggregateConversation[P]>
  }




  export type ConversationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConversationWhereInput
    orderBy?: ConversationOrderByWithAggregationInput | ConversationOrderByWithAggregationInput[]
    by: ConversationScalarFieldEnum[] | ConversationScalarFieldEnum
    having?: ConversationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ConversationCountAggregateInputType | true
    _min?: ConversationMinAggregateInputType
    _max?: ConversationMaxAggregateInputType
  }

  export type ConversationGroupByOutputType = {
    id: string
    contactId: string
    channel: $Enums.ConversationChannel
    waPhoneNumberId: string | null
    createdAt: Date
    updatedAt: Date
    _count: ConversationCountAggregateOutputType | null
    _min: ConversationMinAggregateOutputType | null
    _max: ConversationMaxAggregateOutputType | null
  }

  type GetConversationGroupByPayload<T extends ConversationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ConversationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ConversationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ConversationGroupByOutputType[P]>
            : GetScalarType<T[P], ConversationGroupByOutputType[P]>
        }
      >
    >


  export type ConversationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    contactId?: boolean
    channel?: boolean
    waPhoneNumberId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    contact?: boolean | ContactDefaultArgs<ExtArgs>
    messages?: boolean | Conversation$messagesArgs<ExtArgs>
    _count?: boolean | ConversationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["conversation"]>

  export type ConversationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    contactId?: boolean
    channel?: boolean
    waPhoneNumberId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    contact?: boolean | ContactDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["conversation"]>

  export type ConversationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    contactId?: boolean
    channel?: boolean
    waPhoneNumberId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    contact?: boolean | ContactDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["conversation"]>

  export type ConversationSelectScalar = {
    id?: boolean
    contactId?: boolean
    channel?: boolean
    waPhoneNumberId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ConversationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "contactId" | "channel" | "waPhoneNumberId" | "createdAt" | "updatedAt", ExtArgs["result"]["conversation"]>
  export type ConversationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    contact?: boolean | ContactDefaultArgs<ExtArgs>
    messages?: boolean | Conversation$messagesArgs<ExtArgs>
    _count?: boolean | ConversationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ConversationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    contact?: boolean | ContactDefaultArgs<ExtArgs>
  }
  export type ConversationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    contact?: boolean | ContactDefaultArgs<ExtArgs>
  }

  export type $ConversationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Conversation"
    objects: {
      contact: Prisma.$ContactPayload<ExtArgs>
      messages: Prisma.$ConversationMessagePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      contactId: string
      channel: $Enums.ConversationChannel
      waPhoneNumberId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["conversation"]>
    composites: {}
  }

  type ConversationGetPayload<S extends boolean | null | undefined | ConversationDefaultArgs> = $Result.GetResult<Prisma.$ConversationPayload, S>

  type ConversationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ConversationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ConversationCountAggregateInputType | true
    }

  export interface ConversationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Conversation'], meta: { name: 'Conversation' } }
    /**
     * Find zero or one Conversation that matches the filter.
     * @param {ConversationFindUniqueArgs} args - Arguments to find a Conversation
     * @example
     * // Get one Conversation
     * const conversation = await prisma.conversation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ConversationFindUniqueArgs>(args: SelectSubset<T, ConversationFindUniqueArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Conversation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ConversationFindUniqueOrThrowArgs} args - Arguments to find a Conversation
     * @example
     * // Get one Conversation
     * const conversation = await prisma.conversation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ConversationFindUniqueOrThrowArgs>(args: SelectSubset<T, ConversationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Conversation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationFindFirstArgs} args - Arguments to find a Conversation
     * @example
     * // Get one Conversation
     * const conversation = await prisma.conversation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ConversationFindFirstArgs>(args?: SelectSubset<T, ConversationFindFirstArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Conversation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationFindFirstOrThrowArgs} args - Arguments to find a Conversation
     * @example
     * // Get one Conversation
     * const conversation = await prisma.conversation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ConversationFindFirstOrThrowArgs>(args?: SelectSubset<T, ConversationFindFirstOrThrowArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Conversations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Conversations
     * const conversations = await prisma.conversation.findMany()
     * 
     * // Get first 10 Conversations
     * const conversations = await prisma.conversation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const conversationWithIdOnly = await prisma.conversation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ConversationFindManyArgs>(args?: SelectSubset<T, ConversationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Conversation.
     * @param {ConversationCreateArgs} args - Arguments to create a Conversation.
     * @example
     * // Create one Conversation
     * const Conversation = await prisma.conversation.create({
     *   data: {
     *     // ... data to create a Conversation
     *   }
     * })
     * 
     */
    create<T extends ConversationCreateArgs>(args: SelectSubset<T, ConversationCreateArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Conversations.
     * @param {ConversationCreateManyArgs} args - Arguments to create many Conversations.
     * @example
     * // Create many Conversations
     * const conversation = await prisma.conversation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ConversationCreateManyArgs>(args?: SelectSubset<T, ConversationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Conversations and returns the data saved in the database.
     * @param {ConversationCreateManyAndReturnArgs} args - Arguments to create many Conversations.
     * @example
     * // Create many Conversations
     * const conversation = await prisma.conversation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Conversations and only return the `id`
     * const conversationWithIdOnly = await prisma.conversation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ConversationCreateManyAndReturnArgs>(args?: SelectSubset<T, ConversationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Conversation.
     * @param {ConversationDeleteArgs} args - Arguments to delete one Conversation.
     * @example
     * // Delete one Conversation
     * const Conversation = await prisma.conversation.delete({
     *   where: {
     *     // ... filter to delete one Conversation
     *   }
     * })
     * 
     */
    delete<T extends ConversationDeleteArgs>(args: SelectSubset<T, ConversationDeleteArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Conversation.
     * @param {ConversationUpdateArgs} args - Arguments to update one Conversation.
     * @example
     * // Update one Conversation
     * const conversation = await prisma.conversation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ConversationUpdateArgs>(args: SelectSubset<T, ConversationUpdateArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Conversations.
     * @param {ConversationDeleteManyArgs} args - Arguments to filter Conversations to delete.
     * @example
     * // Delete a few Conversations
     * const { count } = await prisma.conversation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ConversationDeleteManyArgs>(args?: SelectSubset<T, ConversationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Conversations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Conversations
     * const conversation = await prisma.conversation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ConversationUpdateManyArgs>(args: SelectSubset<T, ConversationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Conversations and returns the data updated in the database.
     * @param {ConversationUpdateManyAndReturnArgs} args - Arguments to update many Conversations.
     * @example
     * // Update many Conversations
     * const conversation = await prisma.conversation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Conversations and only return the `id`
     * const conversationWithIdOnly = await prisma.conversation.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ConversationUpdateManyAndReturnArgs>(args: SelectSubset<T, ConversationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Conversation.
     * @param {ConversationUpsertArgs} args - Arguments to update or create a Conversation.
     * @example
     * // Update or create a Conversation
     * const conversation = await prisma.conversation.upsert({
     *   create: {
     *     // ... data to create a Conversation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Conversation we want to update
     *   }
     * })
     */
    upsert<T extends ConversationUpsertArgs>(args: SelectSubset<T, ConversationUpsertArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Conversations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationCountArgs} args - Arguments to filter Conversations to count.
     * @example
     * // Count the number of Conversations
     * const count = await prisma.conversation.count({
     *   where: {
     *     // ... the filter for the Conversations we want to count
     *   }
     * })
    **/
    count<T extends ConversationCountArgs>(
      args?: Subset<T, ConversationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ConversationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Conversation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ConversationAggregateArgs>(args: Subset<T, ConversationAggregateArgs>): Prisma.PrismaPromise<GetConversationAggregateType<T>>

    /**
     * Group by Conversation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ConversationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ConversationGroupByArgs['orderBy'] }
        : { orderBy?: ConversationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ConversationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetConversationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Conversation model
   */
  readonly fields: ConversationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Conversation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ConversationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    contact<T extends ContactDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ContactDefaultArgs<ExtArgs>>): Prisma__ContactClient<$Result.GetResult<Prisma.$ContactPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    messages<T extends Conversation$messagesArgs<ExtArgs> = {}>(args?: Subset<T, Conversation$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConversationMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Conversation model
   */
  interface ConversationFieldRefs {
    readonly id: FieldRef<"Conversation", 'String'>
    readonly contactId: FieldRef<"Conversation", 'String'>
    readonly channel: FieldRef<"Conversation", 'ConversationChannel'>
    readonly waPhoneNumberId: FieldRef<"Conversation", 'String'>
    readonly createdAt: FieldRef<"Conversation", 'DateTime'>
    readonly updatedAt: FieldRef<"Conversation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Conversation findUnique
   */
  export type ConversationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * Filter, which Conversation to fetch.
     */
    where: ConversationWhereUniqueInput
  }

  /**
   * Conversation findUniqueOrThrow
   */
  export type ConversationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * Filter, which Conversation to fetch.
     */
    where: ConversationWhereUniqueInput
  }

  /**
   * Conversation findFirst
   */
  export type ConversationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * Filter, which Conversation to fetch.
     */
    where?: ConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Conversations to fetch.
     */
    orderBy?: ConversationOrderByWithRelationInput | ConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Conversations.
     */
    cursor?: ConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Conversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Conversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Conversations.
     */
    distinct?: ConversationScalarFieldEnum | ConversationScalarFieldEnum[]
  }

  /**
   * Conversation findFirstOrThrow
   */
  export type ConversationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * Filter, which Conversation to fetch.
     */
    where?: ConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Conversations to fetch.
     */
    orderBy?: ConversationOrderByWithRelationInput | ConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Conversations.
     */
    cursor?: ConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Conversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Conversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Conversations.
     */
    distinct?: ConversationScalarFieldEnum | ConversationScalarFieldEnum[]
  }

  /**
   * Conversation findMany
   */
  export type ConversationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * Filter, which Conversations to fetch.
     */
    where?: ConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Conversations to fetch.
     */
    orderBy?: ConversationOrderByWithRelationInput | ConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Conversations.
     */
    cursor?: ConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Conversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Conversations.
     */
    skip?: number
    distinct?: ConversationScalarFieldEnum | ConversationScalarFieldEnum[]
  }

  /**
   * Conversation create
   */
  export type ConversationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * The data needed to create a Conversation.
     */
    data: XOR<ConversationCreateInput, ConversationUncheckedCreateInput>
  }

  /**
   * Conversation createMany
   */
  export type ConversationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Conversations.
     */
    data: ConversationCreateManyInput | ConversationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Conversation createManyAndReturn
   */
  export type ConversationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * The data used to create many Conversations.
     */
    data: ConversationCreateManyInput | ConversationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Conversation update
   */
  export type ConversationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * The data needed to update a Conversation.
     */
    data: XOR<ConversationUpdateInput, ConversationUncheckedUpdateInput>
    /**
     * Choose, which Conversation to update.
     */
    where: ConversationWhereUniqueInput
  }

  /**
   * Conversation updateMany
   */
  export type ConversationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Conversations.
     */
    data: XOR<ConversationUpdateManyMutationInput, ConversationUncheckedUpdateManyInput>
    /**
     * Filter which Conversations to update
     */
    where?: ConversationWhereInput
    /**
     * Limit how many Conversations to update.
     */
    limit?: number
  }

  /**
   * Conversation updateManyAndReturn
   */
  export type ConversationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * The data used to update Conversations.
     */
    data: XOR<ConversationUpdateManyMutationInput, ConversationUncheckedUpdateManyInput>
    /**
     * Filter which Conversations to update
     */
    where?: ConversationWhereInput
    /**
     * Limit how many Conversations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Conversation upsert
   */
  export type ConversationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * The filter to search for the Conversation to update in case it exists.
     */
    where: ConversationWhereUniqueInput
    /**
     * In case the Conversation found by the `where` argument doesn't exist, create a new Conversation with this data.
     */
    create: XOR<ConversationCreateInput, ConversationUncheckedCreateInput>
    /**
     * In case the Conversation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ConversationUpdateInput, ConversationUncheckedUpdateInput>
  }

  /**
   * Conversation delete
   */
  export type ConversationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * Filter which Conversation to delete.
     */
    where: ConversationWhereUniqueInput
  }

  /**
   * Conversation deleteMany
   */
  export type ConversationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Conversations to delete
     */
    where?: ConversationWhereInput
    /**
     * Limit how many Conversations to delete.
     */
    limit?: number
  }

  /**
   * Conversation.messages
   */
  export type Conversation$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationMessage
     */
    select?: ConversationMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationMessage
     */
    omit?: ConversationMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationMessageInclude<ExtArgs> | null
    where?: ConversationMessageWhereInput
    orderBy?: ConversationMessageOrderByWithRelationInput | ConversationMessageOrderByWithRelationInput[]
    cursor?: ConversationMessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ConversationMessageScalarFieldEnum | ConversationMessageScalarFieldEnum[]
  }

  /**
   * Conversation without action
   */
  export type ConversationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
  }


  /**
   * Model ConversationMessage
   */

  export type AggregateConversationMessage = {
    _count: ConversationMessageCountAggregateOutputType | null
    _min: ConversationMessageMinAggregateOutputType | null
    _max: ConversationMessageMaxAggregateOutputType | null
  }

  export type ConversationMessageMinAggregateOutputType = {
    id: string | null
    conversationId: string | null
    direction: $Enums.MessageDirection | null
    waMessageId: string | null
    type: $Enums.MessageType | null
    body: string | null
    templateName: string | null
    buttonId: string | null
    pipelineState: $Enums.PipelineState | null
    status: $Enums.MessageStatus | null
    mediaId: string | null
    mimeType: string | null
    mediaFilename: string | null
    mediaUrl: string | null
    caption: string | null
    createdAt: Date | null
  }

  export type ConversationMessageMaxAggregateOutputType = {
    id: string | null
    conversationId: string | null
    direction: $Enums.MessageDirection | null
    waMessageId: string | null
    type: $Enums.MessageType | null
    body: string | null
    templateName: string | null
    buttonId: string | null
    pipelineState: $Enums.PipelineState | null
    status: $Enums.MessageStatus | null
    mediaId: string | null
    mimeType: string | null
    mediaFilename: string | null
    mediaUrl: string | null
    caption: string | null
    createdAt: Date | null
  }

  export type ConversationMessageCountAggregateOutputType = {
    id: number
    conversationId: number
    direction: number
    waMessageId: number
    type: number
    body: number
    templateName: number
    buttonId: number
    rawPayload: number
    pipelineState: number
    status: number
    mediaId: number
    mimeType: number
    mediaFilename: number
    mediaUrl: number
    caption: number
    createdAt: number
    _all: number
  }


  export type ConversationMessageMinAggregateInputType = {
    id?: true
    conversationId?: true
    direction?: true
    waMessageId?: true
    type?: true
    body?: true
    templateName?: true
    buttonId?: true
    pipelineState?: true
    status?: true
    mediaId?: true
    mimeType?: true
    mediaFilename?: true
    mediaUrl?: true
    caption?: true
    createdAt?: true
  }

  export type ConversationMessageMaxAggregateInputType = {
    id?: true
    conversationId?: true
    direction?: true
    waMessageId?: true
    type?: true
    body?: true
    templateName?: true
    buttonId?: true
    pipelineState?: true
    status?: true
    mediaId?: true
    mimeType?: true
    mediaFilename?: true
    mediaUrl?: true
    caption?: true
    createdAt?: true
  }

  export type ConversationMessageCountAggregateInputType = {
    id?: true
    conversationId?: true
    direction?: true
    waMessageId?: true
    type?: true
    body?: true
    templateName?: true
    buttonId?: true
    rawPayload?: true
    pipelineState?: true
    status?: true
    mediaId?: true
    mimeType?: true
    mediaFilename?: true
    mediaUrl?: true
    caption?: true
    createdAt?: true
    _all?: true
  }

  export type ConversationMessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConversationMessage to aggregate.
     */
    where?: ConversationMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConversationMessages to fetch.
     */
    orderBy?: ConversationMessageOrderByWithRelationInput | ConversationMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ConversationMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConversationMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConversationMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ConversationMessages
    **/
    _count?: true | ConversationMessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ConversationMessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ConversationMessageMaxAggregateInputType
  }

  export type GetConversationMessageAggregateType<T extends ConversationMessageAggregateArgs> = {
        [P in keyof T & keyof AggregateConversationMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateConversationMessage[P]>
      : GetScalarType<T[P], AggregateConversationMessage[P]>
  }




  export type ConversationMessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConversationMessageWhereInput
    orderBy?: ConversationMessageOrderByWithAggregationInput | ConversationMessageOrderByWithAggregationInput[]
    by: ConversationMessageScalarFieldEnum[] | ConversationMessageScalarFieldEnum
    having?: ConversationMessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ConversationMessageCountAggregateInputType | true
    _min?: ConversationMessageMinAggregateInputType
    _max?: ConversationMessageMaxAggregateInputType
  }

  export type ConversationMessageGroupByOutputType = {
    id: string
    conversationId: string
    direction: $Enums.MessageDirection
    waMessageId: string | null
    type: $Enums.MessageType
    body: string | null
    templateName: string | null
    buttonId: string | null
    rawPayload: JsonValue | null
    pipelineState: $Enums.PipelineState | null
    status: $Enums.MessageStatus
    mediaId: string | null
    mimeType: string | null
    mediaFilename: string | null
    mediaUrl: string | null
    caption: string | null
    createdAt: Date
    _count: ConversationMessageCountAggregateOutputType | null
    _min: ConversationMessageMinAggregateOutputType | null
    _max: ConversationMessageMaxAggregateOutputType | null
  }

  type GetConversationMessageGroupByPayload<T extends ConversationMessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ConversationMessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ConversationMessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ConversationMessageGroupByOutputType[P]>
            : GetScalarType<T[P], ConversationMessageGroupByOutputType[P]>
        }
      >
    >


  export type ConversationMessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    conversationId?: boolean
    direction?: boolean
    waMessageId?: boolean
    type?: boolean
    body?: boolean
    templateName?: boolean
    buttonId?: boolean
    rawPayload?: boolean
    pipelineState?: boolean
    status?: boolean
    mediaId?: boolean
    mimeType?: boolean
    mediaFilename?: boolean
    mediaUrl?: boolean
    caption?: boolean
    createdAt?: boolean
    conversation?: boolean | ConversationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["conversationMessage"]>

  export type ConversationMessageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    conversationId?: boolean
    direction?: boolean
    waMessageId?: boolean
    type?: boolean
    body?: boolean
    templateName?: boolean
    buttonId?: boolean
    rawPayload?: boolean
    pipelineState?: boolean
    status?: boolean
    mediaId?: boolean
    mimeType?: boolean
    mediaFilename?: boolean
    mediaUrl?: boolean
    caption?: boolean
    createdAt?: boolean
    conversation?: boolean | ConversationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["conversationMessage"]>

  export type ConversationMessageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    conversationId?: boolean
    direction?: boolean
    waMessageId?: boolean
    type?: boolean
    body?: boolean
    templateName?: boolean
    buttonId?: boolean
    rawPayload?: boolean
    pipelineState?: boolean
    status?: boolean
    mediaId?: boolean
    mimeType?: boolean
    mediaFilename?: boolean
    mediaUrl?: boolean
    caption?: boolean
    createdAt?: boolean
    conversation?: boolean | ConversationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["conversationMessage"]>

  export type ConversationMessageSelectScalar = {
    id?: boolean
    conversationId?: boolean
    direction?: boolean
    waMessageId?: boolean
    type?: boolean
    body?: boolean
    templateName?: boolean
    buttonId?: boolean
    rawPayload?: boolean
    pipelineState?: boolean
    status?: boolean
    mediaId?: boolean
    mimeType?: boolean
    mediaFilename?: boolean
    mediaUrl?: boolean
    caption?: boolean
    createdAt?: boolean
  }

  export type ConversationMessageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "conversationId" | "direction" | "waMessageId" | "type" | "body" | "templateName" | "buttonId" | "rawPayload" | "pipelineState" | "status" | "mediaId" | "mimeType" | "mediaFilename" | "mediaUrl" | "caption" | "createdAt", ExtArgs["result"]["conversationMessage"]>
  export type ConversationMessageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    conversation?: boolean | ConversationDefaultArgs<ExtArgs>
  }
  export type ConversationMessageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    conversation?: boolean | ConversationDefaultArgs<ExtArgs>
  }
  export type ConversationMessageIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    conversation?: boolean | ConversationDefaultArgs<ExtArgs>
  }

  export type $ConversationMessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ConversationMessage"
    objects: {
      conversation: Prisma.$ConversationPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      conversationId: string
      direction: $Enums.MessageDirection
      waMessageId: string | null
      type: $Enums.MessageType
      body: string | null
      templateName: string | null
      buttonId: string | null
      rawPayload: Prisma.JsonValue | null
      pipelineState: $Enums.PipelineState | null
      status: $Enums.MessageStatus
      mediaId: string | null
      mimeType: string | null
      mediaFilename: string | null
      mediaUrl: string | null
      caption: string | null
      createdAt: Date
    }, ExtArgs["result"]["conversationMessage"]>
    composites: {}
  }

  type ConversationMessageGetPayload<S extends boolean | null | undefined | ConversationMessageDefaultArgs> = $Result.GetResult<Prisma.$ConversationMessagePayload, S>

  type ConversationMessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ConversationMessageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ConversationMessageCountAggregateInputType | true
    }

  export interface ConversationMessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ConversationMessage'], meta: { name: 'ConversationMessage' } }
    /**
     * Find zero or one ConversationMessage that matches the filter.
     * @param {ConversationMessageFindUniqueArgs} args - Arguments to find a ConversationMessage
     * @example
     * // Get one ConversationMessage
     * const conversationMessage = await prisma.conversationMessage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ConversationMessageFindUniqueArgs>(args: SelectSubset<T, ConversationMessageFindUniqueArgs<ExtArgs>>): Prisma__ConversationMessageClient<$Result.GetResult<Prisma.$ConversationMessagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ConversationMessage that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ConversationMessageFindUniqueOrThrowArgs} args - Arguments to find a ConversationMessage
     * @example
     * // Get one ConversationMessage
     * const conversationMessage = await prisma.conversationMessage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ConversationMessageFindUniqueOrThrowArgs>(args: SelectSubset<T, ConversationMessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ConversationMessageClient<$Result.GetResult<Prisma.$ConversationMessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ConversationMessage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationMessageFindFirstArgs} args - Arguments to find a ConversationMessage
     * @example
     * // Get one ConversationMessage
     * const conversationMessage = await prisma.conversationMessage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ConversationMessageFindFirstArgs>(args?: SelectSubset<T, ConversationMessageFindFirstArgs<ExtArgs>>): Prisma__ConversationMessageClient<$Result.GetResult<Prisma.$ConversationMessagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ConversationMessage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationMessageFindFirstOrThrowArgs} args - Arguments to find a ConversationMessage
     * @example
     * // Get one ConversationMessage
     * const conversationMessage = await prisma.conversationMessage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ConversationMessageFindFirstOrThrowArgs>(args?: SelectSubset<T, ConversationMessageFindFirstOrThrowArgs<ExtArgs>>): Prisma__ConversationMessageClient<$Result.GetResult<Prisma.$ConversationMessagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ConversationMessages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationMessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ConversationMessages
     * const conversationMessages = await prisma.conversationMessage.findMany()
     * 
     * // Get first 10 ConversationMessages
     * const conversationMessages = await prisma.conversationMessage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const conversationMessageWithIdOnly = await prisma.conversationMessage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ConversationMessageFindManyArgs>(args?: SelectSubset<T, ConversationMessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConversationMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ConversationMessage.
     * @param {ConversationMessageCreateArgs} args - Arguments to create a ConversationMessage.
     * @example
     * // Create one ConversationMessage
     * const ConversationMessage = await prisma.conversationMessage.create({
     *   data: {
     *     // ... data to create a ConversationMessage
     *   }
     * })
     * 
     */
    create<T extends ConversationMessageCreateArgs>(args: SelectSubset<T, ConversationMessageCreateArgs<ExtArgs>>): Prisma__ConversationMessageClient<$Result.GetResult<Prisma.$ConversationMessagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ConversationMessages.
     * @param {ConversationMessageCreateManyArgs} args - Arguments to create many ConversationMessages.
     * @example
     * // Create many ConversationMessages
     * const conversationMessage = await prisma.conversationMessage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ConversationMessageCreateManyArgs>(args?: SelectSubset<T, ConversationMessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ConversationMessages and returns the data saved in the database.
     * @param {ConversationMessageCreateManyAndReturnArgs} args - Arguments to create many ConversationMessages.
     * @example
     * // Create many ConversationMessages
     * const conversationMessage = await prisma.conversationMessage.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ConversationMessages and only return the `id`
     * const conversationMessageWithIdOnly = await prisma.conversationMessage.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ConversationMessageCreateManyAndReturnArgs>(args?: SelectSubset<T, ConversationMessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConversationMessagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ConversationMessage.
     * @param {ConversationMessageDeleteArgs} args - Arguments to delete one ConversationMessage.
     * @example
     * // Delete one ConversationMessage
     * const ConversationMessage = await prisma.conversationMessage.delete({
     *   where: {
     *     // ... filter to delete one ConversationMessage
     *   }
     * })
     * 
     */
    delete<T extends ConversationMessageDeleteArgs>(args: SelectSubset<T, ConversationMessageDeleteArgs<ExtArgs>>): Prisma__ConversationMessageClient<$Result.GetResult<Prisma.$ConversationMessagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ConversationMessage.
     * @param {ConversationMessageUpdateArgs} args - Arguments to update one ConversationMessage.
     * @example
     * // Update one ConversationMessage
     * const conversationMessage = await prisma.conversationMessage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ConversationMessageUpdateArgs>(args: SelectSubset<T, ConversationMessageUpdateArgs<ExtArgs>>): Prisma__ConversationMessageClient<$Result.GetResult<Prisma.$ConversationMessagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ConversationMessages.
     * @param {ConversationMessageDeleteManyArgs} args - Arguments to filter ConversationMessages to delete.
     * @example
     * // Delete a few ConversationMessages
     * const { count } = await prisma.conversationMessage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ConversationMessageDeleteManyArgs>(args?: SelectSubset<T, ConversationMessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ConversationMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationMessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ConversationMessages
     * const conversationMessage = await prisma.conversationMessage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ConversationMessageUpdateManyArgs>(args: SelectSubset<T, ConversationMessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ConversationMessages and returns the data updated in the database.
     * @param {ConversationMessageUpdateManyAndReturnArgs} args - Arguments to update many ConversationMessages.
     * @example
     * // Update many ConversationMessages
     * const conversationMessage = await prisma.conversationMessage.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ConversationMessages and only return the `id`
     * const conversationMessageWithIdOnly = await prisma.conversationMessage.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ConversationMessageUpdateManyAndReturnArgs>(args: SelectSubset<T, ConversationMessageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConversationMessagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ConversationMessage.
     * @param {ConversationMessageUpsertArgs} args - Arguments to update or create a ConversationMessage.
     * @example
     * // Update or create a ConversationMessage
     * const conversationMessage = await prisma.conversationMessage.upsert({
     *   create: {
     *     // ... data to create a ConversationMessage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ConversationMessage we want to update
     *   }
     * })
     */
    upsert<T extends ConversationMessageUpsertArgs>(args: SelectSubset<T, ConversationMessageUpsertArgs<ExtArgs>>): Prisma__ConversationMessageClient<$Result.GetResult<Prisma.$ConversationMessagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ConversationMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationMessageCountArgs} args - Arguments to filter ConversationMessages to count.
     * @example
     * // Count the number of ConversationMessages
     * const count = await prisma.conversationMessage.count({
     *   where: {
     *     // ... the filter for the ConversationMessages we want to count
     *   }
     * })
    **/
    count<T extends ConversationMessageCountArgs>(
      args?: Subset<T, ConversationMessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ConversationMessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ConversationMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationMessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ConversationMessageAggregateArgs>(args: Subset<T, ConversationMessageAggregateArgs>): Prisma.PrismaPromise<GetConversationMessageAggregateType<T>>

    /**
     * Group by ConversationMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationMessageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ConversationMessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ConversationMessageGroupByArgs['orderBy'] }
        : { orderBy?: ConversationMessageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ConversationMessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetConversationMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ConversationMessage model
   */
  readonly fields: ConversationMessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ConversationMessage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ConversationMessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    conversation<T extends ConversationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ConversationDefaultArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ConversationMessage model
   */
  interface ConversationMessageFieldRefs {
    readonly id: FieldRef<"ConversationMessage", 'String'>
    readonly conversationId: FieldRef<"ConversationMessage", 'String'>
    readonly direction: FieldRef<"ConversationMessage", 'MessageDirection'>
    readonly waMessageId: FieldRef<"ConversationMessage", 'String'>
    readonly type: FieldRef<"ConversationMessage", 'MessageType'>
    readonly body: FieldRef<"ConversationMessage", 'String'>
    readonly templateName: FieldRef<"ConversationMessage", 'String'>
    readonly buttonId: FieldRef<"ConversationMessage", 'String'>
    readonly rawPayload: FieldRef<"ConversationMessage", 'Json'>
    readonly pipelineState: FieldRef<"ConversationMessage", 'PipelineState'>
    readonly status: FieldRef<"ConversationMessage", 'MessageStatus'>
    readonly mediaId: FieldRef<"ConversationMessage", 'String'>
    readonly mimeType: FieldRef<"ConversationMessage", 'String'>
    readonly mediaFilename: FieldRef<"ConversationMessage", 'String'>
    readonly mediaUrl: FieldRef<"ConversationMessage", 'String'>
    readonly caption: FieldRef<"ConversationMessage", 'String'>
    readonly createdAt: FieldRef<"ConversationMessage", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ConversationMessage findUnique
   */
  export type ConversationMessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationMessage
     */
    select?: ConversationMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationMessage
     */
    omit?: ConversationMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationMessageInclude<ExtArgs> | null
    /**
     * Filter, which ConversationMessage to fetch.
     */
    where: ConversationMessageWhereUniqueInput
  }

  /**
   * ConversationMessage findUniqueOrThrow
   */
  export type ConversationMessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationMessage
     */
    select?: ConversationMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationMessage
     */
    omit?: ConversationMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationMessageInclude<ExtArgs> | null
    /**
     * Filter, which ConversationMessage to fetch.
     */
    where: ConversationMessageWhereUniqueInput
  }

  /**
   * ConversationMessage findFirst
   */
  export type ConversationMessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationMessage
     */
    select?: ConversationMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationMessage
     */
    omit?: ConversationMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationMessageInclude<ExtArgs> | null
    /**
     * Filter, which ConversationMessage to fetch.
     */
    where?: ConversationMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConversationMessages to fetch.
     */
    orderBy?: ConversationMessageOrderByWithRelationInput | ConversationMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConversationMessages.
     */
    cursor?: ConversationMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConversationMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConversationMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConversationMessages.
     */
    distinct?: ConversationMessageScalarFieldEnum | ConversationMessageScalarFieldEnum[]
  }

  /**
   * ConversationMessage findFirstOrThrow
   */
  export type ConversationMessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationMessage
     */
    select?: ConversationMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationMessage
     */
    omit?: ConversationMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationMessageInclude<ExtArgs> | null
    /**
     * Filter, which ConversationMessage to fetch.
     */
    where?: ConversationMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConversationMessages to fetch.
     */
    orderBy?: ConversationMessageOrderByWithRelationInput | ConversationMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConversationMessages.
     */
    cursor?: ConversationMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConversationMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConversationMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConversationMessages.
     */
    distinct?: ConversationMessageScalarFieldEnum | ConversationMessageScalarFieldEnum[]
  }

  /**
   * ConversationMessage findMany
   */
  export type ConversationMessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationMessage
     */
    select?: ConversationMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationMessage
     */
    omit?: ConversationMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationMessageInclude<ExtArgs> | null
    /**
     * Filter, which ConversationMessages to fetch.
     */
    where?: ConversationMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConversationMessages to fetch.
     */
    orderBy?: ConversationMessageOrderByWithRelationInput | ConversationMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ConversationMessages.
     */
    cursor?: ConversationMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConversationMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConversationMessages.
     */
    skip?: number
    distinct?: ConversationMessageScalarFieldEnum | ConversationMessageScalarFieldEnum[]
  }

  /**
   * ConversationMessage create
   */
  export type ConversationMessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationMessage
     */
    select?: ConversationMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationMessage
     */
    omit?: ConversationMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationMessageInclude<ExtArgs> | null
    /**
     * The data needed to create a ConversationMessage.
     */
    data: XOR<ConversationMessageCreateInput, ConversationMessageUncheckedCreateInput>
  }

  /**
   * ConversationMessage createMany
   */
  export type ConversationMessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ConversationMessages.
     */
    data: ConversationMessageCreateManyInput | ConversationMessageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ConversationMessage createManyAndReturn
   */
  export type ConversationMessageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationMessage
     */
    select?: ConversationMessageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationMessage
     */
    omit?: ConversationMessageOmit<ExtArgs> | null
    /**
     * The data used to create many ConversationMessages.
     */
    data: ConversationMessageCreateManyInput | ConversationMessageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationMessageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ConversationMessage update
   */
  export type ConversationMessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationMessage
     */
    select?: ConversationMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationMessage
     */
    omit?: ConversationMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationMessageInclude<ExtArgs> | null
    /**
     * The data needed to update a ConversationMessage.
     */
    data: XOR<ConversationMessageUpdateInput, ConversationMessageUncheckedUpdateInput>
    /**
     * Choose, which ConversationMessage to update.
     */
    where: ConversationMessageWhereUniqueInput
  }

  /**
   * ConversationMessage updateMany
   */
  export type ConversationMessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ConversationMessages.
     */
    data: XOR<ConversationMessageUpdateManyMutationInput, ConversationMessageUncheckedUpdateManyInput>
    /**
     * Filter which ConversationMessages to update
     */
    where?: ConversationMessageWhereInput
    /**
     * Limit how many ConversationMessages to update.
     */
    limit?: number
  }

  /**
   * ConversationMessage updateManyAndReturn
   */
  export type ConversationMessageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationMessage
     */
    select?: ConversationMessageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationMessage
     */
    omit?: ConversationMessageOmit<ExtArgs> | null
    /**
     * The data used to update ConversationMessages.
     */
    data: XOR<ConversationMessageUpdateManyMutationInput, ConversationMessageUncheckedUpdateManyInput>
    /**
     * Filter which ConversationMessages to update
     */
    where?: ConversationMessageWhereInput
    /**
     * Limit how many ConversationMessages to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationMessageIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ConversationMessage upsert
   */
  export type ConversationMessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationMessage
     */
    select?: ConversationMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationMessage
     */
    omit?: ConversationMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationMessageInclude<ExtArgs> | null
    /**
     * The filter to search for the ConversationMessage to update in case it exists.
     */
    where: ConversationMessageWhereUniqueInput
    /**
     * In case the ConversationMessage found by the `where` argument doesn't exist, create a new ConversationMessage with this data.
     */
    create: XOR<ConversationMessageCreateInput, ConversationMessageUncheckedCreateInput>
    /**
     * In case the ConversationMessage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ConversationMessageUpdateInput, ConversationMessageUncheckedUpdateInput>
  }

  /**
   * ConversationMessage delete
   */
  export type ConversationMessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationMessage
     */
    select?: ConversationMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationMessage
     */
    omit?: ConversationMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationMessageInclude<ExtArgs> | null
    /**
     * Filter which ConversationMessage to delete.
     */
    where: ConversationMessageWhereUniqueInput
  }

  /**
   * ConversationMessage deleteMany
   */
  export type ConversationMessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConversationMessages to delete
     */
    where?: ConversationMessageWhereInput
    /**
     * Limit how many ConversationMessages to delete.
     */
    limit?: number
  }

  /**
   * ConversationMessage without action
   */
  export type ConversationMessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationMessage
     */
    select?: ConversationMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationMessage
     */
    omit?: ConversationMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationMessageInclude<ExtArgs> | null
  }


  /**
   * Model PipelineJob
   */

  export type AggregatePipelineJob = {
    _count: PipelineJobCountAggregateOutputType | null
    _min: PipelineJobMinAggregateOutputType | null
    _max: PipelineJobMaxAggregateOutputType | null
  }

  export type PipelineJobMinAggregateOutputType = {
    id: string | null
    pipelineId: string | null
    dedupKey: string | null
    expectedState: $Enums.PipelineState | null
    qstashMessageId: string | null
    status: $Enums.PipelineJobStatus | null
    createdAt: Date | null
    executedAt: Date | null
  }

  export type PipelineJobMaxAggregateOutputType = {
    id: string | null
    pipelineId: string | null
    dedupKey: string | null
    expectedState: $Enums.PipelineState | null
    qstashMessageId: string | null
    status: $Enums.PipelineJobStatus | null
    createdAt: Date | null
    executedAt: Date | null
  }

  export type PipelineJobCountAggregateOutputType = {
    id: number
    pipelineId: number
    dedupKey: number
    expectedState: number
    qstashMessageId: number
    status: number
    createdAt: number
    executedAt: number
    _all: number
  }


  export type PipelineJobMinAggregateInputType = {
    id?: true
    pipelineId?: true
    dedupKey?: true
    expectedState?: true
    qstashMessageId?: true
    status?: true
    createdAt?: true
    executedAt?: true
  }

  export type PipelineJobMaxAggregateInputType = {
    id?: true
    pipelineId?: true
    dedupKey?: true
    expectedState?: true
    qstashMessageId?: true
    status?: true
    createdAt?: true
    executedAt?: true
  }

  export type PipelineJobCountAggregateInputType = {
    id?: true
    pipelineId?: true
    dedupKey?: true
    expectedState?: true
    qstashMessageId?: true
    status?: true
    createdAt?: true
    executedAt?: true
    _all?: true
  }

  export type PipelineJobAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PipelineJob to aggregate.
     */
    where?: PipelineJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PipelineJobs to fetch.
     */
    orderBy?: PipelineJobOrderByWithRelationInput | PipelineJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PipelineJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PipelineJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PipelineJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PipelineJobs
    **/
    _count?: true | PipelineJobCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PipelineJobMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PipelineJobMaxAggregateInputType
  }

  export type GetPipelineJobAggregateType<T extends PipelineJobAggregateArgs> = {
        [P in keyof T & keyof AggregatePipelineJob]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePipelineJob[P]>
      : GetScalarType<T[P], AggregatePipelineJob[P]>
  }




  export type PipelineJobGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PipelineJobWhereInput
    orderBy?: PipelineJobOrderByWithAggregationInput | PipelineJobOrderByWithAggregationInput[]
    by: PipelineJobScalarFieldEnum[] | PipelineJobScalarFieldEnum
    having?: PipelineJobScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PipelineJobCountAggregateInputType | true
    _min?: PipelineJobMinAggregateInputType
    _max?: PipelineJobMaxAggregateInputType
  }

  export type PipelineJobGroupByOutputType = {
    id: string
    pipelineId: string
    dedupKey: string
    expectedState: $Enums.PipelineState
    qstashMessageId: string | null
    status: $Enums.PipelineJobStatus
    createdAt: Date
    executedAt: Date | null
    _count: PipelineJobCountAggregateOutputType | null
    _min: PipelineJobMinAggregateOutputType | null
    _max: PipelineJobMaxAggregateOutputType | null
  }

  type GetPipelineJobGroupByPayload<T extends PipelineJobGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PipelineJobGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PipelineJobGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PipelineJobGroupByOutputType[P]>
            : GetScalarType<T[P], PipelineJobGroupByOutputType[P]>
        }
      >
    >


  export type PipelineJobSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    pipelineId?: boolean
    dedupKey?: boolean
    expectedState?: boolean
    qstashMessageId?: boolean
    status?: boolean
    createdAt?: boolean
    executedAt?: boolean
    pipeline?: boolean | LeadPipelineDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pipelineJob"]>

  export type PipelineJobSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    pipelineId?: boolean
    dedupKey?: boolean
    expectedState?: boolean
    qstashMessageId?: boolean
    status?: boolean
    createdAt?: boolean
    executedAt?: boolean
    pipeline?: boolean | LeadPipelineDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pipelineJob"]>

  export type PipelineJobSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    pipelineId?: boolean
    dedupKey?: boolean
    expectedState?: boolean
    qstashMessageId?: boolean
    status?: boolean
    createdAt?: boolean
    executedAt?: boolean
    pipeline?: boolean | LeadPipelineDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pipelineJob"]>

  export type PipelineJobSelectScalar = {
    id?: boolean
    pipelineId?: boolean
    dedupKey?: boolean
    expectedState?: boolean
    qstashMessageId?: boolean
    status?: boolean
    createdAt?: boolean
    executedAt?: boolean
  }

  export type PipelineJobOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "pipelineId" | "dedupKey" | "expectedState" | "qstashMessageId" | "status" | "createdAt" | "executedAt", ExtArgs["result"]["pipelineJob"]>
  export type PipelineJobInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pipeline?: boolean | LeadPipelineDefaultArgs<ExtArgs>
  }
  export type PipelineJobIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pipeline?: boolean | LeadPipelineDefaultArgs<ExtArgs>
  }
  export type PipelineJobIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pipeline?: boolean | LeadPipelineDefaultArgs<ExtArgs>
  }

  export type $PipelineJobPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PipelineJob"
    objects: {
      pipeline: Prisma.$LeadPipelinePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      pipelineId: string
      dedupKey: string
      expectedState: $Enums.PipelineState
      qstashMessageId: string | null
      status: $Enums.PipelineJobStatus
      createdAt: Date
      executedAt: Date | null
    }, ExtArgs["result"]["pipelineJob"]>
    composites: {}
  }

  type PipelineJobGetPayload<S extends boolean | null | undefined | PipelineJobDefaultArgs> = $Result.GetResult<Prisma.$PipelineJobPayload, S>

  type PipelineJobCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PipelineJobFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PipelineJobCountAggregateInputType | true
    }

  export interface PipelineJobDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PipelineJob'], meta: { name: 'PipelineJob' } }
    /**
     * Find zero or one PipelineJob that matches the filter.
     * @param {PipelineJobFindUniqueArgs} args - Arguments to find a PipelineJob
     * @example
     * // Get one PipelineJob
     * const pipelineJob = await prisma.pipelineJob.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PipelineJobFindUniqueArgs>(args: SelectSubset<T, PipelineJobFindUniqueArgs<ExtArgs>>): Prisma__PipelineJobClient<$Result.GetResult<Prisma.$PipelineJobPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PipelineJob that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PipelineJobFindUniqueOrThrowArgs} args - Arguments to find a PipelineJob
     * @example
     * // Get one PipelineJob
     * const pipelineJob = await prisma.pipelineJob.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PipelineJobFindUniqueOrThrowArgs>(args: SelectSubset<T, PipelineJobFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PipelineJobClient<$Result.GetResult<Prisma.$PipelineJobPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PipelineJob that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PipelineJobFindFirstArgs} args - Arguments to find a PipelineJob
     * @example
     * // Get one PipelineJob
     * const pipelineJob = await prisma.pipelineJob.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PipelineJobFindFirstArgs>(args?: SelectSubset<T, PipelineJobFindFirstArgs<ExtArgs>>): Prisma__PipelineJobClient<$Result.GetResult<Prisma.$PipelineJobPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PipelineJob that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PipelineJobFindFirstOrThrowArgs} args - Arguments to find a PipelineJob
     * @example
     * // Get one PipelineJob
     * const pipelineJob = await prisma.pipelineJob.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PipelineJobFindFirstOrThrowArgs>(args?: SelectSubset<T, PipelineJobFindFirstOrThrowArgs<ExtArgs>>): Prisma__PipelineJobClient<$Result.GetResult<Prisma.$PipelineJobPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PipelineJobs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PipelineJobFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PipelineJobs
     * const pipelineJobs = await prisma.pipelineJob.findMany()
     * 
     * // Get first 10 PipelineJobs
     * const pipelineJobs = await prisma.pipelineJob.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pipelineJobWithIdOnly = await prisma.pipelineJob.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PipelineJobFindManyArgs>(args?: SelectSubset<T, PipelineJobFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PipelineJobPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PipelineJob.
     * @param {PipelineJobCreateArgs} args - Arguments to create a PipelineJob.
     * @example
     * // Create one PipelineJob
     * const PipelineJob = await prisma.pipelineJob.create({
     *   data: {
     *     // ... data to create a PipelineJob
     *   }
     * })
     * 
     */
    create<T extends PipelineJobCreateArgs>(args: SelectSubset<T, PipelineJobCreateArgs<ExtArgs>>): Prisma__PipelineJobClient<$Result.GetResult<Prisma.$PipelineJobPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PipelineJobs.
     * @param {PipelineJobCreateManyArgs} args - Arguments to create many PipelineJobs.
     * @example
     * // Create many PipelineJobs
     * const pipelineJob = await prisma.pipelineJob.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PipelineJobCreateManyArgs>(args?: SelectSubset<T, PipelineJobCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PipelineJobs and returns the data saved in the database.
     * @param {PipelineJobCreateManyAndReturnArgs} args - Arguments to create many PipelineJobs.
     * @example
     * // Create many PipelineJobs
     * const pipelineJob = await prisma.pipelineJob.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PipelineJobs and only return the `id`
     * const pipelineJobWithIdOnly = await prisma.pipelineJob.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PipelineJobCreateManyAndReturnArgs>(args?: SelectSubset<T, PipelineJobCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PipelineJobPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PipelineJob.
     * @param {PipelineJobDeleteArgs} args - Arguments to delete one PipelineJob.
     * @example
     * // Delete one PipelineJob
     * const PipelineJob = await prisma.pipelineJob.delete({
     *   where: {
     *     // ... filter to delete one PipelineJob
     *   }
     * })
     * 
     */
    delete<T extends PipelineJobDeleteArgs>(args: SelectSubset<T, PipelineJobDeleteArgs<ExtArgs>>): Prisma__PipelineJobClient<$Result.GetResult<Prisma.$PipelineJobPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PipelineJob.
     * @param {PipelineJobUpdateArgs} args - Arguments to update one PipelineJob.
     * @example
     * // Update one PipelineJob
     * const pipelineJob = await prisma.pipelineJob.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PipelineJobUpdateArgs>(args: SelectSubset<T, PipelineJobUpdateArgs<ExtArgs>>): Prisma__PipelineJobClient<$Result.GetResult<Prisma.$PipelineJobPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PipelineJobs.
     * @param {PipelineJobDeleteManyArgs} args - Arguments to filter PipelineJobs to delete.
     * @example
     * // Delete a few PipelineJobs
     * const { count } = await prisma.pipelineJob.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PipelineJobDeleteManyArgs>(args?: SelectSubset<T, PipelineJobDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PipelineJobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PipelineJobUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PipelineJobs
     * const pipelineJob = await prisma.pipelineJob.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PipelineJobUpdateManyArgs>(args: SelectSubset<T, PipelineJobUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PipelineJobs and returns the data updated in the database.
     * @param {PipelineJobUpdateManyAndReturnArgs} args - Arguments to update many PipelineJobs.
     * @example
     * // Update many PipelineJobs
     * const pipelineJob = await prisma.pipelineJob.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PipelineJobs and only return the `id`
     * const pipelineJobWithIdOnly = await prisma.pipelineJob.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PipelineJobUpdateManyAndReturnArgs>(args: SelectSubset<T, PipelineJobUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PipelineJobPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PipelineJob.
     * @param {PipelineJobUpsertArgs} args - Arguments to update or create a PipelineJob.
     * @example
     * // Update or create a PipelineJob
     * const pipelineJob = await prisma.pipelineJob.upsert({
     *   create: {
     *     // ... data to create a PipelineJob
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PipelineJob we want to update
     *   }
     * })
     */
    upsert<T extends PipelineJobUpsertArgs>(args: SelectSubset<T, PipelineJobUpsertArgs<ExtArgs>>): Prisma__PipelineJobClient<$Result.GetResult<Prisma.$PipelineJobPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PipelineJobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PipelineJobCountArgs} args - Arguments to filter PipelineJobs to count.
     * @example
     * // Count the number of PipelineJobs
     * const count = await prisma.pipelineJob.count({
     *   where: {
     *     // ... the filter for the PipelineJobs we want to count
     *   }
     * })
    **/
    count<T extends PipelineJobCountArgs>(
      args?: Subset<T, PipelineJobCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PipelineJobCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PipelineJob.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PipelineJobAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PipelineJobAggregateArgs>(args: Subset<T, PipelineJobAggregateArgs>): Prisma.PrismaPromise<GetPipelineJobAggregateType<T>>

    /**
     * Group by PipelineJob.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PipelineJobGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PipelineJobGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PipelineJobGroupByArgs['orderBy'] }
        : { orderBy?: PipelineJobGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PipelineJobGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPipelineJobGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PipelineJob model
   */
  readonly fields: PipelineJobFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PipelineJob.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PipelineJobClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    pipeline<T extends LeadPipelineDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LeadPipelineDefaultArgs<ExtArgs>>): Prisma__LeadPipelineClient<$Result.GetResult<Prisma.$LeadPipelinePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PipelineJob model
   */
  interface PipelineJobFieldRefs {
    readonly id: FieldRef<"PipelineJob", 'String'>
    readonly pipelineId: FieldRef<"PipelineJob", 'String'>
    readonly dedupKey: FieldRef<"PipelineJob", 'String'>
    readonly expectedState: FieldRef<"PipelineJob", 'PipelineState'>
    readonly qstashMessageId: FieldRef<"PipelineJob", 'String'>
    readonly status: FieldRef<"PipelineJob", 'PipelineJobStatus'>
    readonly createdAt: FieldRef<"PipelineJob", 'DateTime'>
    readonly executedAt: FieldRef<"PipelineJob", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PipelineJob findUnique
   */
  export type PipelineJobFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PipelineJob
     */
    select?: PipelineJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PipelineJob
     */
    omit?: PipelineJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PipelineJobInclude<ExtArgs> | null
    /**
     * Filter, which PipelineJob to fetch.
     */
    where: PipelineJobWhereUniqueInput
  }

  /**
   * PipelineJob findUniqueOrThrow
   */
  export type PipelineJobFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PipelineJob
     */
    select?: PipelineJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PipelineJob
     */
    omit?: PipelineJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PipelineJobInclude<ExtArgs> | null
    /**
     * Filter, which PipelineJob to fetch.
     */
    where: PipelineJobWhereUniqueInput
  }

  /**
   * PipelineJob findFirst
   */
  export type PipelineJobFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PipelineJob
     */
    select?: PipelineJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PipelineJob
     */
    omit?: PipelineJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PipelineJobInclude<ExtArgs> | null
    /**
     * Filter, which PipelineJob to fetch.
     */
    where?: PipelineJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PipelineJobs to fetch.
     */
    orderBy?: PipelineJobOrderByWithRelationInput | PipelineJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PipelineJobs.
     */
    cursor?: PipelineJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PipelineJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PipelineJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PipelineJobs.
     */
    distinct?: PipelineJobScalarFieldEnum | PipelineJobScalarFieldEnum[]
  }

  /**
   * PipelineJob findFirstOrThrow
   */
  export type PipelineJobFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PipelineJob
     */
    select?: PipelineJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PipelineJob
     */
    omit?: PipelineJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PipelineJobInclude<ExtArgs> | null
    /**
     * Filter, which PipelineJob to fetch.
     */
    where?: PipelineJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PipelineJobs to fetch.
     */
    orderBy?: PipelineJobOrderByWithRelationInput | PipelineJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PipelineJobs.
     */
    cursor?: PipelineJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PipelineJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PipelineJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PipelineJobs.
     */
    distinct?: PipelineJobScalarFieldEnum | PipelineJobScalarFieldEnum[]
  }

  /**
   * PipelineJob findMany
   */
  export type PipelineJobFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PipelineJob
     */
    select?: PipelineJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PipelineJob
     */
    omit?: PipelineJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PipelineJobInclude<ExtArgs> | null
    /**
     * Filter, which PipelineJobs to fetch.
     */
    where?: PipelineJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PipelineJobs to fetch.
     */
    orderBy?: PipelineJobOrderByWithRelationInput | PipelineJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PipelineJobs.
     */
    cursor?: PipelineJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PipelineJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PipelineJobs.
     */
    skip?: number
    distinct?: PipelineJobScalarFieldEnum | PipelineJobScalarFieldEnum[]
  }

  /**
   * PipelineJob create
   */
  export type PipelineJobCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PipelineJob
     */
    select?: PipelineJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PipelineJob
     */
    omit?: PipelineJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PipelineJobInclude<ExtArgs> | null
    /**
     * The data needed to create a PipelineJob.
     */
    data: XOR<PipelineJobCreateInput, PipelineJobUncheckedCreateInput>
  }

  /**
   * PipelineJob createMany
   */
  export type PipelineJobCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PipelineJobs.
     */
    data: PipelineJobCreateManyInput | PipelineJobCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PipelineJob createManyAndReturn
   */
  export type PipelineJobCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PipelineJob
     */
    select?: PipelineJobSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PipelineJob
     */
    omit?: PipelineJobOmit<ExtArgs> | null
    /**
     * The data used to create many PipelineJobs.
     */
    data: PipelineJobCreateManyInput | PipelineJobCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PipelineJobIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PipelineJob update
   */
  export type PipelineJobUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PipelineJob
     */
    select?: PipelineJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PipelineJob
     */
    omit?: PipelineJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PipelineJobInclude<ExtArgs> | null
    /**
     * The data needed to update a PipelineJob.
     */
    data: XOR<PipelineJobUpdateInput, PipelineJobUncheckedUpdateInput>
    /**
     * Choose, which PipelineJob to update.
     */
    where: PipelineJobWhereUniqueInput
  }

  /**
   * PipelineJob updateMany
   */
  export type PipelineJobUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PipelineJobs.
     */
    data: XOR<PipelineJobUpdateManyMutationInput, PipelineJobUncheckedUpdateManyInput>
    /**
     * Filter which PipelineJobs to update
     */
    where?: PipelineJobWhereInput
    /**
     * Limit how many PipelineJobs to update.
     */
    limit?: number
  }

  /**
   * PipelineJob updateManyAndReturn
   */
  export type PipelineJobUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PipelineJob
     */
    select?: PipelineJobSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PipelineJob
     */
    omit?: PipelineJobOmit<ExtArgs> | null
    /**
     * The data used to update PipelineJobs.
     */
    data: XOR<PipelineJobUpdateManyMutationInput, PipelineJobUncheckedUpdateManyInput>
    /**
     * Filter which PipelineJobs to update
     */
    where?: PipelineJobWhereInput
    /**
     * Limit how many PipelineJobs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PipelineJobIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PipelineJob upsert
   */
  export type PipelineJobUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PipelineJob
     */
    select?: PipelineJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PipelineJob
     */
    omit?: PipelineJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PipelineJobInclude<ExtArgs> | null
    /**
     * The filter to search for the PipelineJob to update in case it exists.
     */
    where: PipelineJobWhereUniqueInput
    /**
     * In case the PipelineJob found by the `where` argument doesn't exist, create a new PipelineJob with this data.
     */
    create: XOR<PipelineJobCreateInput, PipelineJobUncheckedCreateInput>
    /**
     * In case the PipelineJob was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PipelineJobUpdateInput, PipelineJobUncheckedUpdateInput>
  }

  /**
   * PipelineJob delete
   */
  export type PipelineJobDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PipelineJob
     */
    select?: PipelineJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PipelineJob
     */
    omit?: PipelineJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PipelineJobInclude<ExtArgs> | null
    /**
     * Filter which PipelineJob to delete.
     */
    where: PipelineJobWhereUniqueInput
  }

  /**
   * PipelineJob deleteMany
   */
  export type PipelineJobDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PipelineJobs to delete
     */
    where?: PipelineJobWhereInput
    /**
     * Limit how many PipelineJobs to delete.
     */
    limit?: number
  }

  /**
   * PipelineJob without action
   */
  export type PipelineJobDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PipelineJob
     */
    select?: PipelineJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PipelineJob
     */
    omit?: PipelineJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PipelineJobInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const ContactScalarFieldEnum: {
    id: 'id',
    fullName: 'fullName',
    email: 'email',
    phoneE164: 'phoneE164',
    waId: 'waId',
    phoneCountryCode: 'phoneCountryCode',
    phoneNumber: 'phoneNumber',
    companyName: 'companyName',
    websiteUrl: 'websiteUrl',
    instagramUrl: 'instagramUrl',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ContactScalarFieldEnum = (typeof ContactScalarFieldEnum)[keyof typeof ContactScalarFieldEnum]


  export const FormSubmissionScalarFieldEnum: {
    id: 'id',
    fullName: 'fullName',
    email: 'email',
    companyName: 'companyName',
    phoneCountryCode: 'phoneCountryCode',
    phoneNumber: 'phoneNumber',
    instagramUrl: 'instagramUrl',
    websiteUrl: 'websiteUrl',
    usesPms: 'usesPms',
    propertyCount: 'propertyCount',
    revenueRange: 'revenueRange',
    isTodero: 'isTodero',
    usesAi: 'usesAi',
    wantsToScale: 'wantsToScale',
    industryTime: 'industryTime',
    pdfToken: 'pdfToken',
    qualification: 'qualification',
    qualificationScore: 'qualificationScore',
    disqualificationReason: 'disqualificationReason',
    scoreBreakdown: 'scoreBreakdown',
    entrySource: 'entrySource',
    bookingFlow: 'bookingFlow',
    bookedAt: 'bookedAt',
    status: 'status',
    fbclid: 'fbclid',
    fbp: 'fbp',
    fbc: 'fbc',
    utmSource: 'utmSource',
    utmMedium: 'utmMedium',
    utmCampaign: 'utmCampaign',
    utmContent: 'utmContent',
    utmTerm: 'utmTerm',
    landingPath: 'landingPath',
    referrer: 'referrer',
    marketingFunnelStage: 'marketingFunnelStage',
    contractValueUsd: 'contractValueUsd',
    contractPlan: 'contractPlan',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    contactId: 'contactId'
  };

  export type FormSubmissionScalarFieldEnum = (typeof FormSubmissionScalarFieldEnum)[keyof typeof FormSubmissionScalarFieldEnum]


  export const LeadEventScalarFieldEnum: {
    id: 'id',
    submissionId: 'submissionId',
    eventName: 'eventName',
    eventTime: 'eventTime',
    eventSourceUrl: 'eventSourceUrl',
    value: 'value',
    currency: 'currency',
    sentToMeta: 'sentToMeta',
    metaResponse: 'metaResponse',
    attemptCount: 'attemptCount',
    lastAttemptAt: 'lastAttemptAt',
    triggeredBy: 'triggeredBy',
    clientIp: 'clientIp',
    clientUserAgent: 'clientUserAgent',
    createdAt: 'createdAt'
  };

  export type LeadEventScalarFieldEnum = (typeof LeadEventScalarFieldEnum)[keyof typeof LeadEventScalarFieldEnum]


  export const VideoWatchSessionScalarFieldEnum: {
    id: 'id',
    visitorId: 'visitorId',
    videoId: 'videoId',
    startedAt: 'startedAt',
    lastHeartbeatAt: 'lastHeartbeatAt',
    maxSecond: 'maxSecond',
    durationSeconds: 'durationSeconds',
    unlocked: 'unlocked',
    completed: 'completed',
    droppedAtSecond: 'droppedAtSecond',
    dropReason: 'dropReason',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type VideoWatchSessionScalarFieldEnum = (typeof VideoWatchSessionScalarFieldEnum)[keyof typeof VideoWatchSessionScalarFieldEnum]


  export const LeadPipelineScalarFieldEnum: {
    id: 'id',
    contactId: 'contactId',
    funnelOrigin: 'funnelOrigin',
    currentStage: 'currentStage',
    currentState: 'currentState',
    scheduledJobId: 'scheduledJobId',
    scheduledJobDedupKey: 'scheduledJobDedupKey',
    videoWatched: 'videoWatched',
    utmSource: 'utmSource',
    pixelFiredAt: 'pixelFiredAt',
    painPoint: 'painPoint',
    qualificationAnswers: 'qualificationAnswers',
    meetingId: 'meetingId',
    meetingTime: 'meetingTime',
    meetLink: 'meetLink',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type LeadPipelineScalarFieldEnum = (typeof LeadPipelineScalarFieldEnum)[keyof typeof LeadPipelineScalarFieldEnum]


  export const ConversationScalarFieldEnum: {
    id: 'id',
    contactId: 'contactId',
    channel: 'channel',
    waPhoneNumberId: 'waPhoneNumberId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ConversationScalarFieldEnum = (typeof ConversationScalarFieldEnum)[keyof typeof ConversationScalarFieldEnum]


  export const ConversationMessageScalarFieldEnum: {
    id: 'id',
    conversationId: 'conversationId',
    direction: 'direction',
    waMessageId: 'waMessageId',
    type: 'type',
    body: 'body',
    templateName: 'templateName',
    buttonId: 'buttonId',
    rawPayload: 'rawPayload',
    pipelineState: 'pipelineState',
    status: 'status',
    mediaId: 'mediaId',
    mimeType: 'mimeType',
    mediaFilename: 'mediaFilename',
    mediaUrl: 'mediaUrl',
    caption: 'caption',
    createdAt: 'createdAt'
  };

  export type ConversationMessageScalarFieldEnum = (typeof ConversationMessageScalarFieldEnum)[keyof typeof ConversationMessageScalarFieldEnum]


  export const PipelineJobScalarFieldEnum: {
    id: 'id',
    pipelineId: 'pipelineId',
    dedupKey: 'dedupKey',
    expectedState: 'expectedState',
    qstashMessageId: 'qstashMessageId',
    status: 'status',
    createdAt: 'createdAt',
    executedAt: 'executedAt'
  };

  export type PipelineJobScalarFieldEnum = (typeof PipelineJobScalarFieldEnum)[keyof typeof PipelineJobScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'PmsUsage'
   */
  export type EnumPmsUsageFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PmsUsage'>
    


  /**
   * Reference to a field of type 'PmsUsage[]'
   */
  export type ListEnumPmsUsageFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PmsUsage[]'>
    


  /**
   * Reference to a field of type 'PropertyCount'
   */
  export type EnumPropertyCountFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PropertyCount'>
    


  /**
   * Reference to a field of type 'PropertyCount[]'
   */
  export type ListEnumPropertyCountFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PropertyCount[]'>
    


  /**
   * Reference to a field of type 'RevenueRange'
   */
  export type EnumRevenueRangeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RevenueRange'>
    


  /**
   * Reference to a field of type 'RevenueRange[]'
   */
  export type ListEnumRevenueRangeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RevenueRange[]'>
    


  /**
   * Reference to a field of type 'YesNo'
   */
  export type EnumYesNoFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'YesNo'>
    


  /**
   * Reference to a field of type 'YesNo[]'
   */
  export type ListEnumYesNoFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'YesNo[]'>
    


  /**
   * Reference to a field of type 'IndustryTime'
   */
  export type EnumIndustryTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'IndustryTime'>
    


  /**
   * Reference to a field of type 'IndustryTime[]'
   */
  export type ListEnumIndustryTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'IndustryTime[]'>
    


  /**
   * Reference to a field of type 'LeadQualification'
   */
  export type EnumLeadQualificationFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LeadQualification'>
    


  /**
   * Reference to a field of type 'LeadQualification[]'
   */
  export type ListEnumLeadQualificationFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LeadQualification[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DisqualificationReason'
   */
  export type EnumDisqualificationReasonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DisqualificationReason'>
    


  /**
   * Reference to a field of type 'DisqualificationReason[]'
   */
  export type ListEnumDisqualificationReasonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DisqualificationReason[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'LeadEntrySource'
   */
  export type EnumLeadEntrySourceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LeadEntrySource'>
    


  /**
   * Reference to a field of type 'LeadEntrySource[]'
   */
  export type ListEnumLeadEntrySourceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LeadEntrySource[]'>
    


  /**
   * Reference to a field of type 'BookingFlow'
   */
  export type EnumBookingFlowFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BookingFlow'>
    


  /**
   * Reference to a field of type 'BookingFlow[]'
   */
  export type ListEnumBookingFlowFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BookingFlow[]'>
    


  /**
   * Reference to a field of type 'SubmissionStatus'
   */
  export type EnumSubmissionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SubmissionStatus'>
    


  /**
   * Reference to a field of type 'SubmissionStatus[]'
   */
  export type ListEnumSubmissionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SubmissionStatus[]'>
    


  /**
   * Reference to a field of type 'MarketingFunnelStage'
   */
  export type EnumMarketingFunnelStageFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MarketingFunnelStage'>
    


  /**
   * Reference to a field of type 'MarketingFunnelStage[]'
   */
  export type ListEnumMarketingFunnelStageFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MarketingFunnelStage[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'ContractPlan'
   */
  export type EnumContractPlanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ContractPlan'>
    


  /**
   * Reference to a field of type 'ContractPlan[]'
   */
  export type ListEnumContractPlanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ContractPlan[]'>
    


  /**
   * Reference to a field of type 'MarketingEventName'
   */
  export type EnumMarketingEventNameFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MarketingEventName'>
    


  /**
   * Reference to a field of type 'MarketingEventName[]'
   */
  export type ListEnumMarketingEventNameFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MarketingEventName[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'VideoDropReason'
   */
  export type EnumVideoDropReasonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'VideoDropReason'>
    


  /**
   * Reference to a field of type 'VideoDropReason[]'
   */
  export type ListEnumVideoDropReasonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'VideoDropReason[]'>
    


  /**
   * Reference to a field of type 'FunnelOrigin'
   */
  export type EnumFunnelOriginFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FunnelOrigin'>
    


  /**
   * Reference to a field of type 'FunnelOrigin[]'
   */
  export type ListEnumFunnelOriginFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FunnelOrigin[]'>
    


  /**
   * Reference to a field of type 'PipelineStage'
   */
  export type EnumPipelineStageFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PipelineStage'>
    


  /**
   * Reference to a field of type 'PipelineStage[]'
   */
  export type ListEnumPipelineStageFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PipelineStage[]'>
    


  /**
   * Reference to a field of type 'PipelineState'
   */
  export type EnumPipelineStateFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PipelineState'>
    


  /**
   * Reference to a field of type 'PipelineState[]'
   */
  export type ListEnumPipelineStateFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PipelineState[]'>
    


  /**
   * Reference to a field of type 'ConversationChannel'
   */
  export type EnumConversationChannelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ConversationChannel'>
    


  /**
   * Reference to a field of type 'ConversationChannel[]'
   */
  export type ListEnumConversationChannelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ConversationChannel[]'>
    


  /**
   * Reference to a field of type 'MessageDirection'
   */
  export type EnumMessageDirectionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MessageDirection'>
    


  /**
   * Reference to a field of type 'MessageDirection[]'
   */
  export type ListEnumMessageDirectionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MessageDirection[]'>
    


  /**
   * Reference to a field of type 'MessageType'
   */
  export type EnumMessageTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MessageType'>
    


  /**
   * Reference to a field of type 'MessageType[]'
   */
  export type ListEnumMessageTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MessageType[]'>
    


  /**
   * Reference to a field of type 'MessageStatus'
   */
  export type EnumMessageStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MessageStatus'>
    


  /**
   * Reference to a field of type 'MessageStatus[]'
   */
  export type ListEnumMessageStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MessageStatus[]'>
    


  /**
   * Reference to a field of type 'PipelineJobStatus'
   */
  export type EnumPipelineJobStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PipelineJobStatus'>
    


  /**
   * Reference to a field of type 'PipelineJobStatus[]'
   */
  export type ListEnumPipelineJobStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PipelineJobStatus[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type ContactWhereInput = {
    AND?: ContactWhereInput | ContactWhereInput[]
    OR?: ContactWhereInput[]
    NOT?: ContactWhereInput | ContactWhereInput[]
    id?: StringFilter<"Contact"> | string
    fullName?: StringFilter<"Contact"> | string
    email?: StringNullableFilter<"Contact"> | string | null
    phoneE164?: StringFilter<"Contact"> | string
    waId?: StringNullableFilter<"Contact"> | string | null
    phoneCountryCode?: StringFilter<"Contact"> | string
    phoneNumber?: StringFilter<"Contact"> | string
    companyName?: StringNullableFilter<"Contact"> | string | null
    websiteUrl?: StringNullableFilter<"Contact"> | string | null
    instagramUrl?: StringNullableFilter<"Contact"> | string | null
    createdAt?: DateTimeFilter<"Contact"> | Date | string
    updatedAt?: DateTimeFilter<"Contact"> | Date | string
    submissions?: FormSubmissionListRelationFilter
    pipeline?: XOR<LeadPipelineNullableScalarRelationFilter, LeadPipelineWhereInput> | null
    conversations?: ConversationListRelationFilter
  }

  export type ContactOrderByWithRelationInput = {
    id?: SortOrder
    fullName?: SortOrder
    email?: SortOrderInput | SortOrder
    phoneE164?: SortOrder
    waId?: SortOrderInput | SortOrder
    phoneCountryCode?: SortOrder
    phoneNumber?: SortOrder
    companyName?: SortOrderInput | SortOrder
    websiteUrl?: SortOrderInput | SortOrder
    instagramUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    submissions?: FormSubmissionOrderByRelationAggregateInput
    pipeline?: LeadPipelineOrderByWithRelationInput
    conversations?: ConversationOrderByRelationAggregateInput
  }

  export type ContactWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    phoneE164?: string
    waId?: string
    AND?: ContactWhereInput | ContactWhereInput[]
    OR?: ContactWhereInput[]
    NOT?: ContactWhereInput | ContactWhereInput[]
    fullName?: StringFilter<"Contact"> | string
    email?: StringNullableFilter<"Contact"> | string | null
    phoneCountryCode?: StringFilter<"Contact"> | string
    phoneNumber?: StringFilter<"Contact"> | string
    companyName?: StringNullableFilter<"Contact"> | string | null
    websiteUrl?: StringNullableFilter<"Contact"> | string | null
    instagramUrl?: StringNullableFilter<"Contact"> | string | null
    createdAt?: DateTimeFilter<"Contact"> | Date | string
    updatedAt?: DateTimeFilter<"Contact"> | Date | string
    submissions?: FormSubmissionListRelationFilter
    pipeline?: XOR<LeadPipelineNullableScalarRelationFilter, LeadPipelineWhereInput> | null
    conversations?: ConversationListRelationFilter
  }, "id" | "phoneE164" | "waId">

  export type ContactOrderByWithAggregationInput = {
    id?: SortOrder
    fullName?: SortOrder
    email?: SortOrderInput | SortOrder
    phoneE164?: SortOrder
    waId?: SortOrderInput | SortOrder
    phoneCountryCode?: SortOrder
    phoneNumber?: SortOrder
    companyName?: SortOrderInput | SortOrder
    websiteUrl?: SortOrderInput | SortOrder
    instagramUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ContactCountOrderByAggregateInput
    _max?: ContactMaxOrderByAggregateInput
    _min?: ContactMinOrderByAggregateInput
  }

  export type ContactScalarWhereWithAggregatesInput = {
    AND?: ContactScalarWhereWithAggregatesInput | ContactScalarWhereWithAggregatesInput[]
    OR?: ContactScalarWhereWithAggregatesInput[]
    NOT?: ContactScalarWhereWithAggregatesInput | ContactScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Contact"> | string
    fullName?: StringWithAggregatesFilter<"Contact"> | string
    email?: StringNullableWithAggregatesFilter<"Contact"> | string | null
    phoneE164?: StringWithAggregatesFilter<"Contact"> | string
    waId?: StringNullableWithAggregatesFilter<"Contact"> | string | null
    phoneCountryCode?: StringWithAggregatesFilter<"Contact"> | string
    phoneNumber?: StringWithAggregatesFilter<"Contact"> | string
    companyName?: StringNullableWithAggregatesFilter<"Contact"> | string | null
    websiteUrl?: StringNullableWithAggregatesFilter<"Contact"> | string | null
    instagramUrl?: StringNullableWithAggregatesFilter<"Contact"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Contact"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Contact"> | Date | string
  }

  export type FormSubmissionWhereInput = {
    AND?: FormSubmissionWhereInput | FormSubmissionWhereInput[]
    OR?: FormSubmissionWhereInput[]
    NOT?: FormSubmissionWhereInput | FormSubmissionWhereInput[]
    id?: StringFilter<"FormSubmission"> | string
    fullName?: StringNullableFilter<"FormSubmission"> | string | null
    email?: StringNullableFilter<"FormSubmission"> | string | null
    companyName?: StringNullableFilter<"FormSubmission"> | string | null
    phoneCountryCode?: StringNullableFilter<"FormSubmission"> | string | null
    phoneNumber?: StringNullableFilter<"FormSubmission"> | string | null
    instagramUrl?: StringNullableFilter<"FormSubmission"> | string | null
    websiteUrl?: StringNullableFilter<"FormSubmission"> | string | null
    usesPms?: EnumPmsUsageNullableFilter<"FormSubmission"> | $Enums.PmsUsage | null
    propertyCount?: EnumPropertyCountNullableFilter<"FormSubmission"> | $Enums.PropertyCount | null
    revenueRange?: EnumRevenueRangeNullableFilter<"FormSubmission"> | $Enums.RevenueRange | null
    isTodero?: EnumYesNoNullableFilter<"FormSubmission"> | $Enums.YesNo | null
    usesAi?: EnumYesNoNullableFilter<"FormSubmission"> | $Enums.YesNo | null
    wantsToScale?: EnumYesNoNullableFilter<"FormSubmission"> | $Enums.YesNo | null
    industryTime?: EnumIndustryTimeNullableFilter<"FormSubmission"> | $Enums.IndustryTime | null
    pdfToken?: StringFilter<"FormSubmission"> | string
    qualification?: EnumLeadQualificationNullableFilter<"FormSubmission"> | $Enums.LeadQualification | null
    qualificationScore?: IntNullableFilter<"FormSubmission"> | number | null
    disqualificationReason?: EnumDisqualificationReasonNullableFilter<"FormSubmission"> | $Enums.DisqualificationReason | null
    scoreBreakdown?: JsonNullableFilter<"FormSubmission">
    entrySource?: EnumLeadEntrySourceFilter<"FormSubmission"> | $Enums.LeadEntrySource
    bookingFlow?: EnumBookingFlowNullableFilter<"FormSubmission"> | $Enums.BookingFlow | null
    bookedAt?: DateTimeNullableFilter<"FormSubmission"> | Date | string | null
    status?: EnumSubmissionStatusFilter<"FormSubmission"> | $Enums.SubmissionStatus
    fbclid?: StringNullableFilter<"FormSubmission"> | string | null
    fbp?: StringNullableFilter<"FormSubmission"> | string | null
    fbc?: StringNullableFilter<"FormSubmission"> | string | null
    utmSource?: StringNullableFilter<"FormSubmission"> | string | null
    utmMedium?: StringNullableFilter<"FormSubmission"> | string | null
    utmCampaign?: StringNullableFilter<"FormSubmission"> | string | null
    utmContent?: StringNullableFilter<"FormSubmission"> | string | null
    utmTerm?: StringNullableFilter<"FormSubmission"> | string | null
    landingPath?: StringNullableFilter<"FormSubmission"> | string | null
    referrer?: StringNullableFilter<"FormSubmission"> | string | null
    marketingFunnelStage?: EnumMarketingFunnelStageNullableFilter<"FormSubmission"> | $Enums.MarketingFunnelStage | null
    contractValueUsd?: DecimalNullableFilter<"FormSubmission"> | Decimal | DecimalJsLike | number | string | null
    contractPlan?: EnumContractPlanNullableFilter<"FormSubmission"> | $Enums.ContractPlan | null
    createdAt?: DateTimeFilter<"FormSubmission"> | Date | string
    updatedAt?: DateTimeFilter<"FormSubmission"> | Date | string
    contactId?: StringNullableFilter<"FormSubmission"> | string | null
    contact?: XOR<ContactNullableScalarRelationFilter, ContactWhereInput> | null
    events?: LeadEventListRelationFilter
  }

  export type FormSubmissionOrderByWithRelationInput = {
    id?: SortOrder
    fullName?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    companyName?: SortOrderInput | SortOrder
    phoneCountryCode?: SortOrderInput | SortOrder
    phoneNumber?: SortOrderInput | SortOrder
    instagramUrl?: SortOrderInput | SortOrder
    websiteUrl?: SortOrderInput | SortOrder
    usesPms?: SortOrderInput | SortOrder
    propertyCount?: SortOrderInput | SortOrder
    revenueRange?: SortOrderInput | SortOrder
    isTodero?: SortOrderInput | SortOrder
    usesAi?: SortOrderInput | SortOrder
    wantsToScale?: SortOrderInput | SortOrder
    industryTime?: SortOrderInput | SortOrder
    pdfToken?: SortOrder
    qualification?: SortOrderInput | SortOrder
    qualificationScore?: SortOrderInput | SortOrder
    disqualificationReason?: SortOrderInput | SortOrder
    scoreBreakdown?: SortOrderInput | SortOrder
    entrySource?: SortOrder
    bookingFlow?: SortOrderInput | SortOrder
    bookedAt?: SortOrderInput | SortOrder
    status?: SortOrder
    fbclid?: SortOrderInput | SortOrder
    fbp?: SortOrderInput | SortOrder
    fbc?: SortOrderInput | SortOrder
    utmSource?: SortOrderInput | SortOrder
    utmMedium?: SortOrderInput | SortOrder
    utmCampaign?: SortOrderInput | SortOrder
    utmContent?: SortOrderInput | SortOrder
    utmTerm?: SortOrderInput | SortOrder
    landingPath?: SortOrderInput | SortOrder
    referrer?: SortOrderInput | SortOrder
    marketingFunnelStage?: SortOrderInput | SortOrder
    contractValueUsd?: SortOrderInput | SortOrder
    contractPlan?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    contactId?: SortOrderInput | SortOrder
    contact?: ContactOrderByWithRelationInput
    events?: LeadEventOrderByRelationAggregateInput
  }

  export type FormSubmissionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    pdfToken?: string
    AND?: FormSubmissionWhereInput | FormSubmissionWhereInput[]
    OR?: FormSubmissionWhereInput[]
    NOT?: FormSubmissionWhereInput | FormSubmissionWhereInput[]
    fullName?: StringNullableFilter<"FormSubmission"> | string | null
    email?: StringNullableFilter<"FormSubmission"> | string | null
    companyName?: StringNullableFilter<"FormSubmission"> | string | null
    phoneCountryCode?: StringNullableFilter<"FormSubmission"> | string | null
    phoneNumber?: StringNullableFilter<"FormSubmission"> | string | null
    instagramUrl?: StringNullableFilter<"FormSubmission"> | string | null
    websiteUrl?: StringNullableFilter<"FormSubmission"> | string | null
    usesPms?: EnumPmsUsageNullableFilter<"FormSubmission"> | $Enums.PmsUsage | null
    propertyCount?: EnumPropertyCountNullableFilter<"FormSubmission"> | $Enums.PropertyCount | null
    revenueRange?: EnumRevenueRangeNullableFilter<"FormSubmission"> | $Enums.RevenueRange | null
    isTodero?: EnumYesNoNullableFilter<"FormSubmission"> | $Enums.YesNo | null
    usesAi?: EnumYesNoNullableFilter<"FormSubmission"> | $Enums.YesNo | null
    wantsToScale?: EnumYesNoNullableFilter<"FormSubmission"> | $Enums.YesNo | null
    industryTime?: EnumIndustryTimeNullableFilter<"FormSubmission"> | $Enums.IndustryTime | null
    qualification?: EnumLeadQualificationNullableFilter<"FormSubmission"> | $Enums.LeadQualification | null
    qualificationScore?: IntNullableFilter<"FormSubmission"> | number | null
    disqualificationReason?: EnumDisqualificationReasonNullableFilter<"FormSubmission"> | $Enums.DisqualificationReason | null
    scoreBreakdown?: JsonNullableFilter<"FormSubmission">
    entrySource?: EnumLeadEntrySourceFilter<"FormSubmission"> | $Enums.LeadEntrySource
    bookingFlow?: EnumBookingFlowNullableFilter<"FormSubmission"> | $Enums.BookingFlow | null
    bookedAt?: DateTimeNullableFilter<"FormSubmission"> | Date | string | null
    status?: EnumSubmissionStatusFilter<"FormSubmission"> | $Enums.SubmissionStatus
    fbclid?: StringNullableFilter<"FormSubmission"> | string | null
    fbp?: StringNullableFilter<"FormSubmission"> | string | null
    fbc?: StringNullableFilter<"FormSubmission"> | string | null
    utmSource?: StringNullableFilter<"FormSubmission"> | string | null
    utmMedium?: StringNullableFilter<"FormSubmission"> | string | null
    utmCampaign?: StringNullableFilter<"FormSubmission"> | string | null
    utmContent?: StringNullableFilter<"FormSubmission"> | string | null
    utmTerm?: StringNullableFilter<"FormSubmission"> | string | null
    landingPath?: StringNullableFilter<"FormSubmission"> | string | null
    referrer?: StringNullableFilter<"FormSubmission"> | string | null
    marketingFunnelStage?: EnumMarketingFunnelStageNullableFilter<"FormSubmission"> | $Enums.MarketingFunnelStage | null
    contractValueUsd?: DecimalNullableFilter<"FormSubmission"> | Decimal | DecimalJsLike | number | string | null
    contractPlan?: EnumContractPlanNullableFilter<"FormSubmission"> | $Enums.ContractPlan | null
    createdAt?: DateTimeFilter<"FormSubmission"> | Date | string
    updatedAt?: DateTimeFilter<"FormSubmission"> | Date | string
    contactId?: StringNullableFilter<"FormSubmission"> | string | null
    contact?: XOR<ContactNullableScalarRelationFilter, ContactWhereInput> | null
    events?: LeadEventListRelationFilter
  }, "id" | "pdfToken">

  export type FormSubmissionOrderByWithAggregationInput = {
    id?: SortOrder
    fullName?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    companyName?: SortOrderInput | SortOrder
    phoneCountryCode?: SortOrderInput | SortOrder
    phoneNumber?: SortOrderInput | SortOrder
    instagramUrl?: SortOrderInput | SortOrder
    websiteUrl?: SortOrderInput | SortOrder
    usesPms?: SortOrderInput | SortOrder
    propertyCount?: SortOrderInput | SortOrder
    revenueRange?: SortOrderInput | SortOrder
    isTodero?: SortOrderInput | SortOrder
    usesAi?: SortOrderInput | SortOrder
    wantsToScale?: SortOrderInput | SortOrder
    industryTime?: SortOrderInput | SortOrder
    pdfToken?: SortOrder
    qualification?: SortOrderInput | SortOrder
    qualificationScore?: SortOrderInput | SortOrder
    disqualificationReason?: SortOrderInput | SortOrder
    scoreBreakdown?: SortOrderInput | SortOrder
    entrySource?: SortOrder
    bookingFlow?: SortOrderInput | SortOrder
    bookedAt?: SortOrderInput | SortOrder
    status?: SortOrder
    fbclid?: SortOrderInput | SortOrder
    fbp?: SortOrderInput | SortOrder
    fbc?: SortOrderInput | SortOrder
    utmSource?: SortOrderInput | SortOrder
    utmMedium?: SortOrderInput | SortOrder
    utmCampaign?: SortOrderInput | SortOrder
    utmContent?: SortOrderInput | SortOrder
    utmTerm?: SortOrderInput | SortOrder
    landingPath?: SortOrderInput | SortOrder
    referrer?: SortOrderInput | SortOrder
    marketingFunnelStage?: SortOrderInput | SortOrder
    contractValueUsd?: SortOrderInput | SortOrder
    contractPlan?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    contactId?: SortOrderInput | SortOrder
    _count?: FormSubmissionCountOrderByAggregateInput
    _avg?: FormSubmissionAvgOrderByAggregateInput
    _max?: FormSubmissionMaxOrderByAggregateInput
    _min?: FormSubmissionMinOrderByAggregateInput
    _sum?: FormSubmissionSumOrderByAggregateInput
  }

  export type FormSubmissionScalarWhereWithAggregatesInput = {
    AND?: FormSubmissionScalarWhereWithAggregatesInput | FormSubmissionScalarWhereWithAggregatesInput[]
    OR?: FormSubmissionScalarWhereWithAggregatesInput[]
    NOT?: FormSubmissionScalarWhereWithAggregatesInput | FormSubmissionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"FormSubmission"> | string
    fullName?: StringNullableWithAggregatesFilter<"FormSubmission"> | string | null
    email?: StringNullableWithAggregatesFilter<"FormSubmission"> | string | null
    companyName?: StringNullableWithAggregatesFilter<"FormSubmission"> | string | null
    phoneCountryCode?: StringNullableWithAggregatesFilter<"FormSubmission"> | string | null
    phoneNumber?: StringNullableWithAggregatesFilter<"FormSubmission"> | string | null
    instagramUrl?: StringNullableWithAggregatesFilter<"FormSubmission"> | string | null
    websiteUrl?: StringNullableWithAggregatesFilter<"FormSubmission"> | string | null
    usesPms?: EnumPmsUsageNullableWithAggregatesFilter<"FormSubmission"> | $Enums.PmsUsage | null
    propertyCount?: EnumPropertyCountNullableWithAggregatesFilter<"FormSubmission"> | $Enums.PropertyCount | null
    revenueRange?: EnumRevenueRangeNullableWithAggregatesFilter<"FormSubmission"> | $Enums.RevenueRange | null
    isTodero?: EnumYesNoNullableWithAggregatesFilter<"FormSubmission"> | $Enums.YesNo | null
    usesAi?: EnumYesNoNullableWithAggregatesFilter<"FormSubmission"> | $Enums.YesNo | null
    wantsToScale?: EnumYesNoNullableWithAggregatesFilter<"FormSubmission"> | $Enums.YesNo | null
    industryTime?: EnumIndustryTimeNullableWithAggregatesFilter<"FormSubmission"> | $Enums.IndustryTime | null
    pdfToken?: StringWithAggregatesFilter<"FormSubmission"> | string
    qualification?: EnumLeadQualificationNullableWithAggregatesFilter<"FormSubmission"> | $Enums.LeadQualification | null
    qualificationScore?: IntNullableWithAggregatesFilter<"FormSubmission"> | number | null
    disqualificationReason?: EnumDisqualificationReasonNullableWithAggregatesFilter<"FormSubmission"> | $Enums.DisqualificationReason | null
    scoreBreakdown?: JsonNullableWithAggregatesFilter<"FormSubmission">
    entrySource?: EnumLeadEntrySourceWithAggregatesFilter<"FormSubmission"> | $Enums.LeadEntrySource
    bookingFlow?: EnumBookingFlowNullableWithAggregatesFilter<"FormSubmission"> | $Enums.BookingFlow | null
    bookedAt?: DateTimeNullableWithAggregatesFilter<"FormSubmission"> | Date | string | null
    status?: EnumSubmissionStatusWithAggregatesFilter<"FormSubmission"> | $Enums.SubmissionStatus
    fbclid?: StringNullableWithAggregatesFilter<"FormSubmission"> | string | null
    fbp?: StringNullableWithAggregatesFilter<"FormSubmission"> | string | null
    fbc?: StringNullableWithAggregatesFilter<"FormSubmission"> | string | null
    utmSource?: StringNullableWithAggregatesFilter<"FormSubmission"> | string | null
    utmMedium?: StringNullableWithAggregatesFilter<"FormSubmission"> | string | null
    utmCampaign?: StringNullableWithAggregatesFilter<"FormSubmission"> | string | null
    utmContent?: StringNullableWithAggregatesFilter<"FormSubmission"> | string | null
    utmTerm?: StringNullableWithAggregatesFilter<"FormSubmission"> | string | null
    landingPath?: StringNullableWithAggregatesFilter<"FormSubmission"> | string | null
    referrer?: StringNullableWithAggregatesFilter<"FormSubmission"> | string | null
    marketingFunnelStage?: EnumMarketingFunnelStageNullableWithAggregatesFilter<"FormSubmission"> | $Enums.MarketingFunnelStage | null
    contractValueUsd?: DecimalNullableWithAggregatesFilter<"FormSubmission"> | Decimal | DecimalJsLike | number | string | null
    contractPlan?: EnumContractPlanNullableWithAggregatesFilter<"FormSubmission"> | $Enums.ContractPlan | null
    createdAt?: DateTimeWithAggregatesFilter<"FormSubmission"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"FormSubmission"> | Date | string
    contactId?: StringNullableWithAggregatesFilter<"FormSubmission"> | string | null
  }

  export type LeadEventWhereInput = {
    AND?: LeadEventWhereInput | LeadEventWhereInput[]
    OR?: LeadEventWhereInput[]
    NOT?: LeadEventWhereInput | LeadEventWhereInput[]
    id?: StringFilter<"LeadEvent"> | string
    submissionId?: StringFilter<"LeadEvent"> | string
    eventName?: EnumMarketingEventNameFilter<"LeadEvent"> | $Enums.MarketingEventName
    eventTime?: DateTimeFilter<"LeadEvent"> | Date | string
    eventSourceUrl?: StringNullableFilter<"LeadEvent"> | string | null
    value?: DecimalFilter<"LeadEvent"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"LeadEvent"> | string
    sentToMeta?: BoolFilter<"LeadEvent"> | boolean
    metaResponse?: JsonNullableFilter<"LeadEvent">
    attemptCount?: IntFilter<"LeadEvent"> | number
    lastAttemptAt?: DateTimeNullableFilter<"LeadEvent"> | Date | string | null
    triggeredBy?: StringFilter<"LeadEvent"> | string
    clientIp?: StringNullableFilter<"LeadEvent"> | string | null
    clientUserAgent?: StringNullableFilter<"LeadEvent"> | string | null
    createdAt?: DateTimeFilter<"LeadEvent"> | Date | string
    submission?: XOR<FormSubmissionScalarRelationFilter, FormSubmissionWhereInput>
  }

  export type LeadEventOrderByWithRelationInput = {
    id?: SortOrder
    submissionId?: SortOrder
    eventName?: SortOrder
    eventTime?: SortOrder
    eventSourceUrl?: SortOrderInput | SortOrder
    value?: SortOrder
    currency?: SortOrder
    sentToMeta?: SortOrder
    metaResponse?: SortOrderInput | SortOrder
    attemptCount?: SortOrder
    lastAttemptAt?: SortOrderInput | SortOrder
    triggeredBy?: SortOrder
    clientIp?: SortOrderInput | SortOrder
    clientUserAgent?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    submission?: FormSubmissionOrderByWithRelationInput
  }

  export type LeadEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    submissionId_eventName?: LeadEventSubmissionIdEventNameCompoundUniqueInput
    AND?: LeadEventWhereInput | LeadEventWhereInput[]
    OR?: LeadEventWhereInput[]
    NOT?: LeadEventWhereInput | LeadEventWhereInput[]
    submissionId?: StringFilter<"LeadEvent"> | string
    eventName?: EnumMarketingEventNameFilter<"LeadEvent"> | $Enums.MarketingEventName
    eventTime?: DateTimeFilter<"LeadEvent"> | Date | string
    eventSourceUrl?: StringNullableFilter<"LeadEvent"> | string | null
    value?: DecimalFilter<"LeadEvent"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"LeadEvent"> | string
    sentToMeta?: BoolFilter<"LeadEvent"> | boolean
    metaResponse?: JsonNullableFilter<"LeadEvent">
    attemptCount?: IntFilter<"LeadEvent"> | number
    lastAttemptAt?: DateTimeNullableFilter<"LeadEvent"> | Date | string | null
    triggeredBy?: StringFilter<"LeadEvent"> | string
    clientIp?: StringNullableFilter<"LeadEvent"> | string | null
    clientUserAgent?: StringNullableFilter<"LeadEvent"> | string | null
    createdAt?: DateTimeFilter<"LeadEvent"> | Date | string
    submission?: XOR<FormSubmissionScalarRelationFilter, FormSubmissionWhereInput>
  }, "id" | "submissionId_eventName">

  export type LeadEventOrderByWithAggregationInput = {
    id?: SortOrder
    submissionId?: SortOrder
    eventName?: SortOrder
    eventTime?: SortOrder
    eventSourceUrl?: SortOrderInput | SortOrder
    value?: SortOrder
    currency?: SortOrder
    sentToMeta?: SortOrder
    metaResponse?: SortOrderInput | SortOrder
    attemptCount?: SortOrder
    lastAttemptAt?: SortOrderInput | SortOrder
    triggeredBy?: SortOrder
    clientIp?: SortOrderInput | SortOrder
    clientUserAgent?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: LeadEventCountOrderByAggregateInput
    _avg?: LeadEventAvgOrderByAggregateInput
    _max?: LeadEventMaxOrderByAggregateInput
    _min?: LeadEventMinOrderByAggregateInput
    _sum?: LeadEventSumOrderByAggregateInput
  }

  export type LeadEventScalarWhereWithAggregatesInput = {
    AND?: LeadEventScalarWhereWithAggregatesInput | LeadEventScalarWhereWithAggregatesInput[]
    OR?: LeadEventScalarWhereWithAggregatesInput[]
    NOT?: LeadEventScalarWhereWithAggregatesInput | LeadEventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LeadEvent"> | string
    submissionId?: StringWithAggregatesFilter<"LeadEvent"> | string
    eventName?: EnumMarketingEventNameWithAggregatesFilter<"LeadEvent"> | $Enums.MarketingEventName
    eventTime?: DateTimeWithAggregatesFilter<"LeadEvent"> | Date | string
    eventSourceUrl?: StringNullableWithAggregatesFilter<"LeadEvent"> | string | null
    value?: DecimalWithAggregatesFilter<"LeadEvent"> | Decimal | DecimalJsLike | number | string
    currency?: StringWithAggregatesFilter<"LeadEvent"> | string
    sentToMeta?: BoolWithAggregatesFilter<"LeadEvent"> | boolean
    metaResponse?: JsonNullableWithAggregatesFilter<"LeadEvent">
    attemptCount?: IntWithAggregatesFilter<"LeadEvent"> | number
    lastAttemptAt?: DateTimeNullableWithAggregatesFilter<"LeadEvent"> | Date | string | null
    triggeredBy?: StringWithAggregatesFilter<"LeadEvent"> | string
    clientIp?: StringNullableWithAggregatesFilter<"LeadEvent"> | string | null
    clientUserAgent?: StringNullableWithAggregatesFilter<"LeadEvent"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"LeadEvent"> | Date | string
  }

  export type VideoWatchSessionWhereInput = {
    AND?: VideoWatchSessionWhereInput | VideoWatchSessionWhereInput[]
    OR?: VideoWatchSessionWhereInput[]
    NOT?: VideoWatchSessionWhereInput | VideoWatchSessionWhereInput[]
    id?: StringFilter<"VideoWatchSession"> | string
    visitorId?: StringFilter<"VideoWatchSession"> | string
    videoId?: StringFilter<"VideoWatchSession"> | string
    startedAt?: DateTimeFilter<"VideoWatchSession"> | Date | string
    lastHeartbeatAt?: DateTimeFilter<"VideoWatchSession"> | Date | string
    maxSecond?: IntFilter<"VideoWatchSession"> | number
    durationSeconds?: IntFilter<"VideoWatchSession"> | number
    unlocked?: BoolFilter<"VideoWatchSession"> | boolean
    completed?: BoolFilter<"VideoWatchSession"> | boolean
    droppedAtSecond?: IntNullableFilter<"VideoWatchSession"> | number | null
    dropReason?: EnumVideoDropReasonNullableFilter<"VideoWatchSession"> | $Enums.VideoDropReason | null
    createdAt?: DateTimeFilter<"VideoWatchSession"> | Date | string
    updatedAt?: DateTimeFilter<"VideoWatchSession"> | Date | string
  }

  export type VideoWatchSessionOrderByWithRelationInput = {
    id?: SortOrder
    visitorId?: SortOrder
    videoId?: SortOrder
    startedAt?: SortOrder
    lastHeartbeatAt?: SortOrder
    maxSecond?: SortOrder
    durationSeconds?: SortOrder
    unlocked?: SortOrder
    completed?: SortOrder
    droppedAtSecond?: SortOrderInput | SortOrder
    dropReason?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VideoWatchSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: VideoWatchSessionWhereInput | VideoWatchSessionWhereInput[]
    OR?: VideoWatchSessionWhereInput[]
    NOT?: VideoWatchSessionWhereInput | VideoWatchSessionWhereInput[]
    visitorId?: StringFilter<"VideoWatchSession"> | string
    videoId?: StringFilter<"VideoWatchSession"> | string
    startedAt?: DateTimeFilter<"VideoWatchSession"> | Date | string
    lastHeartbeatAt?: DateTimeFilter<"VideoWatchSession"> | Date | string
    maxSecond?: IntFilter<"VideoWatchSession"> | number
    durationSeconds?: IntFilter<"VideoWatchSession"> | number
    unlocked?: BoolFilter<"VideoWatchSession"> | boolean
    completed?: BoolFilter<"VideoWatchSession"> | boolean
    droppedAtSecond?: IntNullableFilter<"VideoWatchSession"> | number | null
    dropReason?: EnumVideoDropReasonNullableFilter<"VideoWatchSession"> | $Enums.VideoDropReason | null
    createdAt?: DateTimeFilter<"VideoWatchSession"> | Date | string
    updatedAt?: DateTimeFilter<"VideoWatchSession"> | Date | string
  }, "id">

  export type VideoWatchSessionOrderByWithAggregationInput = {
    id?: SortOrder
    visitorId?: SortOrder
    videoId?: SortOrder
    startedAt?: SortOrder
    lastHeartbeatAt?: SortOrder
    maxSecond?: SortOrder
    durationSeconds?: SortOrder
    unlocked?: SortOrder
    completed?: SortOrder
    droppedAtSecond?: SortOrderInput | SortOrder
    dropReason?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: VideoWatchSessionCountOrderByAggregateInput
    _avg?: VideoWatchSessionAvgOrderByAggregateInput
    _max?: VideoWatchSessionMaxOrderByAggregateInput
    _min?: VideoWatchSessionMinOrderByAggregateInput
    _sum?: VideoWatchSessionSumOrderByAggregateInput
  }

  export type VideoWatchSessionScalarWhereWithAggregatesInput = {
    AND?: VideoWatchSessionScalarWhereWithAggregatesInput | VideoWatchSessionScalarWhereWithAggregatesInput[]
    OR?: VideoWatchSessionScalarWhereWithAggregatesInput[]
    NOT?: VideoWatchSessionScalarWhereWithAggregatesInput | VideoWatchSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"VideoWatchSession"> | string
    visitorId?: StringWithAggregatesFilter<"VideoWatchSession"> | string
    videoId?: StringWithAggregatesFilter<"VideoWatchSession"> | string
    startedAt?: DateTimeWithAggregatesFilter<"VideoWatchSession"> | Date | string
    lastHeartbeatAt?: DateTimeWithAggregatesFilter<"VideoWatchSession"> | Date | string
    maxSecond?: IntWithAggregatesFilter<"VideoWatchSession"> | number
    durationSeconds?: IntWithAggregatesFilter<"VideoWatchSession"> | number
    unlocked?: BoolWithAggregatesFilter<"VideoWatchSession"> | boolean
    completed?: BoolWithAggregatesFilter<"VideoWatchSession"> | boolean
    droppedAtSecond?: IntNullableWithAggregatesFilter<"VideoWatchSession"> | number | null
    dropReason?: EnumVideoDropReasonNullableWithAggregatesFilter<"VideoWatchSession"> | $Enums.VideoDropReason | null
    createdAt?: DateTimeWithAggregatesFilter<"VideoWatchSession"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"VideoWatchSession"> | Date | string
  }

  export type LeadPipelineWhereInput = {
    AND?: LeadPipelineWhereInput | LeadPipelineWhereInput[]
    OR?: LeadPipelineWhereInput[]
    NOT?: LeadPipelineWhereInput | LeadPipelineWhereInput[]
    id?: StringFilter<"LeadPipeline"> | string
    contactId?: StringFilter<"LeadPipeline"> | string
    funnelOrigin?: EnumFunnelOriginFilter<"LeadPipeline"> | $Enums.FunnelOrigin
    currentStage?: EnumPipelineStageFilter<"LeadPipeline"> | $Enums.PipelineStage
    currentState?: EnumPipelineStateFilter<"LeadPipeline"> | $Enums.PipelineState
    scheduledJobId?: StringNullableFilter<"LeadPipeline"> | string | null
    scheduledJobDedupKey?: StringNullableFilter<"LeadPipeline"> | string | null
    videoWatched?: BoolFilter<"LeadPipeline"> | boolean
    utmSource?: StringNullableFilter<"LeadPipeline"> | string | null
    pixelFiredAt?: DateTimeNullableFilter<"LeadPipeline"> | Date | string | null
    painPoint?: StringNullableFilter<"LeadPipeline"> | string | null
    qualificationAnswers?: JsonNullableFilter<"LeadPipeline">
    meetingId?: StringNullableFilter<"LeadPipeline"> | string | null
    meetingTime?: DateTimeNullableFilter<"LeadPipeline"> | Date | string | null
    meetLink?: StringNullableFilter<"LeadPipeline"> | string | null
    createdAt?: DateTimeFilter<"LeadPipeline"> | Date | string
    updatedAt?: DateTimeFilter<"LeadPipeline"> | Date | string
    contact?: XOR<ContactScalarRelationFilter, ContactWhereInput>
    jobs?: PipelineJobListRelationFilter
  }

  export type LeadPipelineOrderByWithRelationInput = {
    id?: SortOrder
    contactId?: SortOrder
    funnelOrigin?: SortOrder
    currentStage?: SortOrder
    currentState?: SortOrder
    scheduledJobId?: SortOrderInput | SortOrder
    scheduledJobDedupKey?: SortOrderInput | SortOrder
    videoWatched?: SortOrder
    utmSource?: SortOrderInput | SortOrder
    pixelFiredAt?: SortOrderInput | SortOrder
    painPoint?: SortOrderInput | SortOrder
    qualificationAnswers?: SortOrderInput | SortOrder
    meetingId?: SortOrderInput | SortOrder
    meetingTime?: SortOrderInput | SortOrder
    meetLink?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    contact?: ContactOrderByWithRelationInput
    jobs?: PipelineJobOrderByRelationAggregateInput
  }

  export type LeadPipelineWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    contactId?: string
    scheduledJobDedupKey?: string
    AND?: LeadPipelineWhereInput | LeadPipelineWhereInput[]
    OR?: LeadPipelineWhereInput[]
    NOT?: LeadPipelineWhereInput | LeadPipelineWhereInput[]
    funnelOrigin?: EnumFunnelOriginFilter<"LeadPipeline"> | $Enums.FunnelOrigin
    currentStage?: EnumPipelineStageFilter<"LeadPipeline"> | $Enums.PipelineStage
    currentState?: EnumPipelineStateFilter<"LeadPipeline"> | $Enums.PipelineState
    scheduledJobId?: StringNullableFilter<"LeadPipeline"> | string | null
    videoWatched?: BoolFilter<"LeadPipeline"> | boolean
    utmSource?: StringNullableFilter<"LeadPipeline"> | string | null
    pixelFiredAt?: DateTimeNullableFilter<"LeadPipeline"> | Date | string | null
    painPoint?: StringNullableFilter<"LeadPipeline"> | string | null
    qualificationAnswers?: JsonNullableFilter<"LeadPipeline">
    meetingId?: StringNullableFilter<"LeadPipeline"> | string | null
    meetingTime?: DateTimeNullableFilter<"LeadPipeline"> | Date | string | null
    meetLink?: StringNullableFilter<"LeadPipeline"> | string | null
    createdAt?: DateTimeFilter<"LeadPipeline"> | Date | string
    updatedAt?: DateTimeFilter<"LeadPipeline"> | Date | string
    contact?: XOR<ContactScalarRelationFilter, ContactWhereInput>
    jobs?: PipelineJobListRelationFilter
  }, "id" | "contactId" | "scheduledJobDedupKey">

  export type LeadPipelineOrderByWithAggregationInput = {
    id?: SortOrder
    contactId?: SortOrder
    funnelOrigin?: SortOrder
    currentStage?: SortOrder
    currentState?: SortOrder
    scheduledJobId?: SortOrderInput | SortOrder
    scheduledJobDedupKey?: SortOrderInput | SortOrder
    videoWatched?: SortOrder
    utmSource?: SortOrderInput | SortOrder
    pixelFiredAt?: SortOrderInput | SortOrder
    painPoint?: SortOrderInput | SortOrder
    qualificationAnswers?: SortOrderInput | SortOrder
    meetingId?: SortOrderInput | SortOrder
    meetingTime?: SortOrderInput | SortOrder
    meetLink?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: LeadPipelineCountOrderByAggregateInput
    _max?: LeadPipelineMaxOrderByAggregateInput
    _min?: LeadPipelineMinOrderByAggregateInput
  }

  export type LeadPipelineScalarWhereWithAggregatesInput = {
    AND?: LeadPipelineScalarWhereWithAggregatesInput | LeadPipelineScalarWhereWithAggregatesInput[]
    OR?: LeadPipelineScalarWhereWithAggregatesInput[]
    NOT?: LeadPipelineScalarWhereWithAggregatesInput | LeadPipelineScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LeadPipeline"> | string
    contactId?: StringWithAggregatesFilter<"LeadPipeline"> | string
    funnelOrigin?: EnumFunnelOriginWithAggregatesFilter<"LeadPipeline"> | $Enums.FunnelOrigin
    currentStage?: EnumPipelineStageWithAggregatesFilter<"LeadPipeline"> | $Enums.PipelineStage
    currentState?: EnumPipelineStateWithAggregatesFilter<"LeadPipeline"> | $Enums.PipelineState
    scheduledJobId?: StringNullableWithAggregatesFilter<"LeadPipeline"> | string | null
    scheduledJobDedupKey?: StringNullableWithAggregatesFilter<"LeadPipeline"> | string | null
    videoWatched?: BoolWithAggregatesFilter<"LeadPipeline"> | boolean
    utmSource?: StringNullableWithAggregatesFilter<"LeadPipeline"> | string | null
    pixelFiredAt?: DateTimeNullableWithAggregatesFilter<"LeadPipeline"> | Date | string | null
    painPoint?: StringNullableWithAggregatesFilter<"LeadPipeline"> | string | null
    qualificationAnswers?: JsonNullableWithAggregatesFilter<"LeadPipeline">
    meetingId?: StringNullableWithAggregatesFilter<"LeadPipeline"> | string | null
    meetingTime?: DateTimeNullableWithAggregatesFilter<"LeadPipeline"> | Date | string | null
    meetLink?: StringNullableWithAggregatesFilter<"LeadPipeline"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"LeadPipeline"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"LeadPipeline"> | Date | string
  }

  export type ConversationWhereInput = {
    AND?: ConversationWhereInput | ConversationWhereInput[]
    OR?: ConversationWhereInput[]
    NOT?: ConversationWhereInput | ConversationWhereInput[]
    id?: StringFilter<"Conversation"> | string
    contactId?: StringFilter<"Conversation"> | string
    channel?: EnumConversationChannelFilter<"Conversation"> | $Enums.ConversationChannel
    waPhoneNumberId?: StringNullableFilter<"Conversation"> | string | null
    createdAt?: DateTimeFilter<"Conversation"> | Date | string
    updatedAt?: DateTimeFilter<"Conversation"> | Date | string
    contact?: XOR<ContactScalarRelationFilter, ContactWhereInput>
    messages?: ConversationMessageListRelationFilter
  }

  export type ConversationOrderByWithRelationInput = {
    id?: SortOrder
    contactId?: SortOrder
    channel?: SortOrder
    waPhoneNumberId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    contact?: ContactOrderByWithRelationInput
    messages?: ConversationMessageOrderByRelationAggregateInput
  }

  export type ConversationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    contactId_channel?: ConversationContactIdChannelCompoundUniqueInput
    AND?: ConversationWhereInput | ConversationWhereInput[]
    OR?: ConversationWhereInput[]
    NOT?: ConversationWhereInput | ConversationWhereInput[]
    contactId?: StringFilter<"Conversation"> | string
    channel?: EnumConversationChannelFilter<"Conversation"> | $Enums.ConversationChannel
    waPhoneNumberId?: StringNullableFilter<"Conversation"> | string | null
    createdAt?: DateTimeFilter<"Conversation"> | Date | string
    updatedAt?: DateTimeFilter<"Conversation"> | Date | string
    contact?: XOR<ContactScalarRelationFilter, ContactWhereInput>
    messages?: ConversationMessageListRelationFilter
  }, "id" | "contactId_channel">

  export type ConversationOrderByWithAggregationInput = {
    id?: SortOrder
    contactId?: SortOrder
    channel?: SortOrder
    waPhoneNumberId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ConversationCountOrderByAggregateInput
    _max?: ConversationMaxOrderByAggregateInput
    _min?: ConversationMinOrderByAggregateInput
  }

  export type ConversationScalarWhereWithAggregatesInput = {
    AND?: ConversationScalarWhereWithAggregatesInput | ConversationScalarWhereWithAggregatesInput[]
    OR?: ConversationScalarWhereWithAggregatesInput[]
    NOT?: ConversationScalarWhereWithAggregatesInput | ConversationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Conversation"> | string
    contactId?: StringWithAggregatesFilter<"Conversation"> | string
    channel?: EnumConversationChannelWithAggregatesFilter<"Conversation"> | $Enums.ConversationChannel
    waPhoneNumberId?: StringNullableWithAggregatesFilter<"Conversation"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Conversation"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Conversation"> | Date | string
  }

  export type ConversationMessageWhereInput = {
    AND?: ConversationMessageWhereInput | ConversationMessageWhereInput[]
    OR?: ConversationMessageWhereInput[]
    NOT?: ConversationMessageWhereInput | ConversationMessageWhereInput[]
    id?: StringFilter<"ConversationMessage"> | string
    conversationId?: StringFilter<"ConversationMessage"> | string
    direction?: EnumMessageDirectionFilter<"ConversationMessage"> | $Enums.MessageDirection
    waMessageId?: StringNullableFilter<"ConversationMessage"> | string | null
    type?: EnumMessageTypeFilter<"ConversationMessage"> | $Enums.MessageType
    body?: StringNullableFilter<"ConversationMessage"> | string | null
    templateName?: StringNullableFilter<"ConversationMessage"> | string | null
    buttonId?: StringNullableFilter<"ConversationMessage"> | string | null
    rawPayload?: JsonNullableFilter<"ConversationMessage">
    pipelineState?: EnumPipelineStateNullableFilter<"ConversationMessage"> | $Enums.PipelineState | null
    status?: EnumMessageStatusFilter<"ConversationMessage"> | $Enums.MessageStatus
    mediaId?: StringNullableFilter<"ConversationMessage"> | string | null
    mimeType?: StringNullableFilter<"ConversationMessage"> | string | null
    mediaFilename?: StringNullableFilter<"ConversationMessage"> | string | null
    mediaUrl?: StringNullableFilter<"ConversationMessage"> | string | null
    caption?: StringNullableFilter<"ConversationMessage"> | string | null
    createdAt?: DateTimeFilter<"ConversationMessage"> | Date | string
    conversation?: XOR<ConversationScalarRelationFilter, ConversationWhereInput>
  }

  export type ConversationMessageOrderByWithRelationInput = {
    id?: SortOrder
    conversationId?: SortOrder
    direction?: SortOrder
    waMessageId?: SortOrderInput | SortOrder
    type?: SortOrder
    body?: SortOrderInput | SortOrder
    templateName?: SortOrderInput | SortOrder
    buttonId?: SortOrderInput | SortOrder
    rawPayload?: SortOrderInput | SortOrder
    pipelineState?: SortOrderInput | SortOrder
    status?: SortOrder
    mediaId?: SortOrderInput | SortOrder
    mimeType?: SortOrderInput | SortOrder
    mediaFilename?: SortOrderInput | SortOrder
    mediaUrl?: SortOrderInput | SortOrder
    caption?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    conversation?: ConversationOrderByWithRelationInput
  }

  export type ConversationMessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    waMessageId?: string
    AND?: ConversationMessageWhereInput | ConversationMessageWhereInput[]
    OR?: ConversationMessageWhereInput[]
    NOT?: ConversationMessageWhereInput | ConversationMessageWhereInput[]
    conversationId?: StringFilter<"ConversationMessage"> | string
    direction?: EnumMessageDirectionFilter<"ConversationMessage"> | $Enums.MessageDirection
    type?: EnumMessageTypeFilter<"ConversationMessage"> | $Enums.MessageType
    body?: StringNullableFilter<"ConversationMessage"> | string | null
    templateName?: StringNullableFilter<"ConversationMessage"> | string | null
    buttonId?: StringNullableFilter<"ConversationMessage"> | string | null
    rawPayload?: JsonNullableFilter<"ConversationMessage">
    pipelineState?: EnumPipelineStateNullableFilter<"ConversationMessage"> | $Enums.PipelineState | null
    status?: EnumMessageStatusFilter<"ConversationMessage"> | $Enums.MessageStatus
    mediaId?: StringNullableFilter<"ConversationMessage"> | string | null
    mimeType?: StringNullableFilter<"ConversationMessage"> | string | null
    mediaFilename?: StringNullableFilter<"ConversationMessage"> | string | null
    mediaUrl?: StringNullableFilter<"ConversationMessage"> | string | null
    caption?: StringNullableFilter<"ConversationMessage"> | string | null
    createdAt?: DateTimeFilter<"ConversationMessage"> | Date | string
    conversation?: XOR<ConversationScalarRelationFilter, ConversationWhereInput>
  }, "id" | "waMessageId">

  export type ConversationMessageOrderByWithAggregationInput = {
    id?: SortOrder
    conversationId?: SortOrder
    direction?: SortOrder
    waMessageId?: SortOrderInput | SortOrder
    type?: SortOrder
    body?: SortOrderInput | SortOrder
    templateName?: SortOrderInput | SortOrder
    buttonId?: SortOrderInput | SortOrder
    rawPayload?: SortOrderInput | SortOrder
    pipelineState?: SortOrderInput | SortOrder
    status?: SortOrder
    mediaId?: SortOrderInput | SortOrder
    mimeType?: SortOrderInput | SortOrder
    mediaFilename?: SortOrderInput | SortOrder
    mediaUrl?: SortOrderInput | SortOrder
    caption?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: ConversationMessageCountOrderByAggregateInput
    _max?: ConversationMessageMaxOrderByAggregateInput
    _min?: ConversationMessageMinOrderByAggregateInput
  }

  export type ConversationMessageScalarWhereWithAggregatesInput = {
    AND?: ConversationMessageScalarWhereWithAggregatesInput | ConversationMessageScalarWhereWithAggregatesInput[]
    OR?: ConversationMessageScalarWhereWithAggregatesInput[]
    NOT?: ConversationMessageScalarWhereWithAggregatesInput | ConversationMessageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ConversationMessage"> | string
    conversationId?: StringWithAggregatesFilter<"ConversationMessage"> | string
    direction?: EnumMessageDirectionWithAggregatesFilter<"ConversationMessage"> | $Enums.MessageDirection
    waMessageId?: StringNullableWithAggregatesFilter<"ConversationMessage"> | string | null
    type?: EnumMessageTypeWithAggregatesFilter<"ConversationMessage"> | $Enums.MessageType
    body?: StringNullableWithAggregatesFilter<"ConversationMessage"> | string | null
    templateName?: StringNullableWithAggregatesFilter<"ConversationMessage"> | string | null
    buttonId?: StringNullableWithAggregatesFilter<"ConversationMessage"> | string | null
    rawPayload?: JsonNullableWithAggregatesFilter<"ConversationMessage">
    pipelineState?: EnumPipelineStateNullableWithAggregatesFilter<"ConversationMessage"> | $Enums.PipelineState | null
    status?: EnumMessageStatusWithAggregatesFilter<"ConversationMessage"> | $Enums.MessageStatus
    mediaId?: StringNullableWithAggregatesFilter<"ConversationMessage"> | string | null
    mimeType?: StringNullableWithAggregatesFilter<"ConversationMessage"> | string | null
    mediaFilename?: StringNullableWithAggregatesFilter<"ConversationMessage"> | string | null
    mediaUrl?: StringNullableWithAggregatesFilter<"ConversationMessage"> | string | null
    caption?: StringNullableWithAggregatesFilter<"ConversationMessage"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ConversationMessage"> | Date | string
  }

  export type PipelineJobWhereInput = {
    AND?: PipelineJobWhereInput | PipelineJobWhereInput[]
    OR?: PipelineJobWhereInput[]
    NOT?: PipelineJobWhereInput | PipelineJobWhereInput[]
    id?: StringFilter<"PipelineJob"> | string
    pipelineId?: StringFilter<"PipelineJob"> | string
    dedupKey?: StringFilter<"PipelineJob"> | string
    expectedState?: EnumPipelineStateFilter<"PipelineJob"> | $Enums.PipelineState
    qstashMessageId?: StringNullableFilter<"PipelineJob"> | string | null
    status?: EnumPipelineJobStatusFilter<"PipelineJob"> | $Enums.PipelineJobStatus
    createdAt?: DateTimeFilter<"PipelineJob"> | Date | string
    executedAt?: DateTimeNullableFilter<"PipelineJob"> | Date | string | null
    pipeline?: XOR<LeadPipelineScalarRelationFilter, LeadPipelineWhereInput>
  }

  export type PipelineJobOrderByWithRelationInput = {
    id?: SortOrder
    pipelineId?: SortOrder
    dedupKey?: SortOrder
    expectedState?: SortOrder
    qstashMessageId?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    executedAt?: SortOrderInput | SortOrder
    pipeline?: LeadPipelineOrderByWithRelationInput
  }

  export type PipelineJobWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    dedupKey?: string
    AND?: PipelineJobWhereInput | PipelineJobWhereInput[]
    OR?: PipelineJobWhereInput[]
    NOT?: PipelineJobWhereInput | PipelineJobWhereInput[]
    pipelineId?: StringFilter<"PipelineJob"> | string
    expectedState?: EnumPipelineStateFilter<"PipelineJob"> | $Enums.PipelineState
    qstashMessageId?: StringNullableFilter<"PipelineJob"> | string | null
    status?: EnumPipelineJobStatusFilter<"PipelineJob"> | $Enums.PipelineJobStatus
    createdAt?: DateTimeFilter<"PipelineJob"> | Date | string
    executedAt?: DateTimeNullableFilter<"PipelineJob"> | Date | string | null
    pipeline?: XOR<LeadPipelineScalarRelationFilter, LeadPipelineWhereInput>
  }, "id" | "dedupKey">

  export type PipelineJobOrderByWithAggregationInput = {
    id?: SortOrder
    pipelineId?: SortOrder
    dedupKey?: SortOrder
    expectedState?: SortOrder
    qstashMessageId?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    executedAt?: SortOrderInput | SortOrder
    _count?: PipelineJobCountOrderByAggregateInput
    _max?: PipelineJobMaxOrderByAggregateInput
    _min?: PipelineJobMinOrderByAggregateInput
  }

  export type PipelineJobScalarWhereWithAggregatesInput = {
    AND?: PipelineJobScalarWhereWithAggregatesInput | PipelineJobScalarWhereWithAggregatesInput[]
    OR?: PipelineJobScalarWhereWithAggregatesInput[]
    NOT?: PipelineJobScalarWhereWithAggregatesInput | PipelineJobScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PipelineJob"> | string
    pipelineId?: StringWithAggregatesFilter<"PipelineJob"> | string
    dedupKey?: StringWithAggregatesFilter<"PipelineJob"> | string
    expectedState?: EnumPipelineStateWithAggregatesFilter<"PipelineJob"> | $Enums.PipelineState
    qstashMessageId?: StringNullableWithAggregatesFilter<"PipelineJob"> | string | null
    status?: EnumPipelineJobStatusWithAggregatesFilter<"PipelineJob"> | $Enums.PipelineJobStatus
    createdAt?: DateTimeWithAggregatesFilter<"PipelineJob"> | Date | string
    executedAt?: DateTimeNullableWithAggregatesFilter<"PipelineJob"> | Date | string | null
  }

  export type ContactCreateInput = {
    id?: string
    fullName: string
    email?: string | null
    phoneE164: string
    waId?: string | null
    phoneCountryCode: string
    phoneNumber: string
    companyName?: string | null
    websiteUrl?: string | null
    instagramUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    submissions?: FormSubmissionCreateNestedManyWithoutContactInput
    pipeline?: LeadPipelineCreateNestedOneWithoutContactInput
    conversations?: ConversationCreateNestedManyWithoutContactInput
  }

  export type ContactUncheckedCreateInput = {
    id?: string
    fullName: string
    email?: string | null
    phoneE164: string
    waId?: string | null
    phoneCountryCode: string
    phoneNumber: string
    companyName?: string | null
    websiteUrl?: string | null
    instagramUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    submissions?: FormSubmissionUncheckedCreateNestedManyWithoutContactInput
    pipeline?: LeadPipelineUncheckedCreateNestedOneWithoutContactInput
    conversations?: ConversationUncheckedCreateNestedManyWithoutContactInput
  }

  export type ContactUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phoneE164?: StringFieldUpdateOperationsInput | string
    waId?: NullableStringFieldUpdateOperationsInput | string | null
    phoneCountryCode?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    instagramUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submissions?: FormSubmissionUpdateManyWithoutContactNestedInput
    pipeline?: LeadPipelineUpdateOneWithoutContactNestedInput
    conversations?: ConversationUpdateManyWithoutContactNestedInput
  }

  export type ContactUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phoneE164?: StringFieldUpdateOperationsInput | string
    waId?: NullableStringFieldUpdateOperationsInput | string | null
    phoneCountryCode?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    instagramUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submissions?: FormSubmissionUncheckedUpdateManyWithoutContactNestedInput
    pipeline?: LeadPipelineUncheckedUpdateOneWithoutContactNestedInput
    conversations?: ConversationUncheckedUpdateManyWithoutContactNestedInput
  }

  export type ContactCreateManyInput = {
    id?: string
    fullName: string
    email?: string | null
    phoneE164: string
    waId?: string | null
    phoneCountryCode: string
    phoneNumber: string
    companyName?: string | null
    websiteUrl?: string | null
    instagramUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ContactUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phoneE164?: StringFieldUpdateOperationsInput | string
    waId?: NullableStringFieldUpdateOperationsInput | string | null
    phoneCountryCode?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    instagramUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContactUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phoneE164?: StringFieldUpdateOperationsInput | string
    waId?: NullableStringFieldUpdateOperationsInput | string | null
    phoneCountryCode?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    instagramUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FormSubmissionCreateInput = {
    id?: string
    fullName?: string | null
    email?: string | null
    companyName?: string | null
    phoneCountryCode?: string | null
    phoneNumber?: string | null
    instagramUrl?: string | null
    websiteUrl?: string | null
    usesPms?: $Enums.PmsUsage | null
    propertyCount?: $Enums.PropertyCount | null
    revenueRange?: $Enums.RevenueRange | null
    isTodero?: $Enums.YesNo | null
    usesAi?: $Enums.YesNo | null
    wantsToScale?: $Enums.YesNo | null
    industryTime?: $Enums.IndustryTime | null
    pdfToken: string
    qualification?: $Enums.LeadQualification | null
    qualificationScore?: number | null
    disqualificationReason?: $Enums.DisqualificationReason | null
    scoreBreakdown?: NullableJsonNullValueInput | InputJsonValue
    entrySource?: $Enums.LeadEntrySource
    bookingFlow?: $Enums.BookingFlow | null
    bookedAt?: Date | string | null
    status?: $Enums.SubmissionStatus
    fbclid?: string | null
    fbp?: string | null
    fbc?: string | null
    utmSource?: string | null
    utmMedium?: string | null
    utmCampaign?: string | null
    utmContent?: string | null
    utmTerm?: string | null
    landingPath?: string | null
    referrer?: string | null
    marketingFunnelStage?: $Enums.MarketingFunnelStage | null
    contractValueUsd?: Decimal | DecimalJsLike | number | string | null
    contractPlan?: $Enums.ContractPlan | null
    createdAt?: Date | string
    updatedAt?: Date | string
    contact?: ContactCreateNestedOneWithoutSubmissionsInput
    events?: LeadEventCreateNestedManyWithoutSubmissionInput
  }

  export type FormSubmissionUncheckedCreateInput = {
    id?: string
    fullName?: string | null
    email?: string | null
    companyName?: string | null
    phoneCountryCode?: string | null
    phoneNumber?: string | null
    instagramUrl?: string | null
    websiteUrl?: string | null
    usesPms?: $Enums.PmsUsage | null
    propertyCount?: $Enums.PropertyCount | null
    revenueRange?: $Enums.RevenueRange | null
    isTodero?: $Enums.YesNo | null
    usesAi?: $Enums.YesNo | null
    wantsToScale?: $Enums.YesNo | null
    industryTime?: $Enums.IndustryTime | null
    pdfToken: string
    qualification?: $Enums.LeadQualification | null
    qualificationScore?: number | null
    disqualificationReason?: $Enums.DisqualificationReason | null
    scoreBreakdown?: NullableJsonNullValueInput | InputJsonValue
    entrySource?: $Enums.LeadEntrySource
    bookingFlow?: $Enums.BookingFlow | null
    bookedAt?: Date | string | null
    status?: $Enums.SubmissionStatus
    fbclid?: string | null
    fbp?: string | null
    fbc?: string | null
    utmSource?: string | null
    utmMedium?: string | null
    utmCampaign?: string | null
    utmContent?: string | null
    utmTerm?: string | null
    landingPath?: string | null
    referrer?: string | null
    marketingFunnelStage?: $Enums.MarketingFunnelStage | null
    contractValueUsd?: Decimal | DecimalJsLike | number | string | null
    contractPlan?: $Enums.ContractPlan | null
    createdAt?: Date | string
    updatedAt?: Date | string
    contactId?: string | null
    events?: LeadEventUncheckedCreateNestedManyWithoutSubmissionInput
  }

  export type FormSubmissionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    phoneCountryCode?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    instagramUrl?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    usesPms?: NullableEnumPmsUsageFieldUpdateOperationsInput | $Enums.PmsUsage | null
    propertyCount?: NullableEnumPropertyCountFieldUpdateOperationsInput | $Enums.PropertyCount | null
    revenueRange?: NullableEnumRevenueRangeFieldUpdateOperationsInput | $Enums.RevenueRange | null
    isTodero?: NullableEnumYesNoFieldUpdateOperationsInput | $Enums.YesNo | null
    usesAi?: NullableEnumYesNoFieldUpdateOperationsInput | $Enums.YesNo | null
    wantsToScale?: NullableEnumYesNoFieldUpdateOperationsInput | $Enums.YesNo | null
    industryTime?: NullableEnumIndustryTimeFieldUpdateOperationsInput | $Enums.IndustryTime | null
    pdfToken?: StringFieldUpdateOperationsInput | string
    qualification?: NullableEnumLeadQualificationFieldUpdateOperationsInput | $Enums.LeadQualification | null
    qualificationScore?: NullableIntFieldUpdateOperationsInput | number | null
    disqualificationReason?: NullableEnumDisqualificationReasonFieldUpdateOperationsInput | $Enums.DisqualificationReason | null
    scoreBreakdown?: NullableJsonNullValueInput | InputJsonValue
    entrySource?: EnumLeadEntrySourceFieldUpdateOperationsInput | $Enums.LeadEntrySource
    bookingFlow?: NullableEnumBookingFlowFieldUpdateOperationsInput | $Enums.BookingFlow | null
    bookedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumSubmissionStatusFieldUpdateOperationsInput | $Enums.SubmissionStatus
    fbclid?: NullableStringFieldUpdateOperationsInput | string | null
    fbp?: NullableStringFieldUpdateOperationsInput | string | null
    fbc?: NullableStringFieldUpdateOperationsInput | string | null
    utmSource?: NullableStringFieldUpdateOperationsInput | string | null
    utmMedium?: NullableStringFieldUpdateOperationsInput | string | null
    utmCampaign?: NullableStringFieldUpdateOperationsInput | string | null
    utmContent?: NullableStringFieldUpdateOperationsInput | string | null
    utmTerm?: NullableStringFieldUpdateOperationsInput | string | null
    landingPath?: NullableStringFieldUpdateOperationsInput | string | null
    referrer?: NullableStringFieldUpdateOperationsInput | string | null
    marketingFunnelStage?: NullableEnumMarketingFunnelStageFieldUpdateOperationsInput | $Enums.MarketingFunnelStage | null
    contractValueUsd?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    contractPlan?: NullableEnumContractPlanFieldUpdateOperationsInput | $Enums.ContractPlan | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    contact?: ContactUpdateOneWithoutSubmissionsNestedInput
    events?: LeadEventUpdateManyWithoutSubmissionNestedInput
  }

  export type FormSubmissionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    phoneCountryCode?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    instagramUrl?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    usesPms?: NullableEnumPmsUsageFieldUpdateOperationsInput | $Enums.PmsUsage | null
    propertyCount?: NullableEnumPropertyCountFieldUpdateOperationsInput | $Enums.PropertyCount | null
    revenueRange?: NullableEnumRevenueRangeFieldUpdateOperationsInput | $Enums.RevenueRange | null
    isTodero?: NullableEnumYesNoFieldUpdateOperationsInput | $Enums.YesNo | null
    usesAi?: NullableEnumYesNoFieldUpdateOperationsInput | $Enums.YesNo | null
    wantsToScale?: NullableEnumYesNoFieldUpdateOperationsInput | $Enums.YesNo | null
    industryTime?: NullableEnumIndustryTimeFieldUpdateOperationsInput | $Enums.IndustryTime | null
    pdfToken?: StringFieldUpdateOperationsInput | string
    qualification?: NullableEnumLeadQualificationFieldUpdateOperationsInput | $Enums.LeadQualification | null
    qualificationScore?: NullableIntFieldUpdateOperationsInput | number | null
    disqualificationReason?: NullableEnumDisqualificationReasonFieldUpdateOperationsInput | $Enums.DisqualificationReason | null
    scoreBreakdown?: NullableJsonNullValueInput | InputJsonValue
    entrySource?: EnumLeadEntrySourceFieldUpdateOperationsInput | $Enums.LeadEntrySource
    bookingFlow?: NullableEnumBookingFlowFieldUpdateOperationsInput | $Enums.BookingFlow | null
    bookedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumSubmissionStatusFieldUpdateOperationsInput | $Enums.SubmissionStatus
    fbclid?: NullableStringFieldUpdateOperationsInput | string | null
    fbp?: NullableStringFieldUpdateOperationsInput | string | null
    fbc?: NullableStringFieldUpdateOperationsInput | string | null
    utmSource?: NullableStringFieldUpdateOperationsInput | string | null
    utmMedium?: NullableStringFieldUpdateOperationsInput | string | null
    utmCampaign?: NullableStringFieldUpdateOperationsInput | string | null
    utmContent?: NullableStringFieldUpdateOperationsInput | string | null
    utmTerm?: NullableStringFieldUpdateOperationsInput | string | null
    landingPath?: NullableStringFieldUpdateOperationsInput | string | null
    referrer?: NullableStringFieldUpdateOperationsInput | string | null
    marketingFunnelStage?: NullableEnumMarketingFunnelStageFieldUpdateOperationsInput | $Enums.MarketingFunnelStage | null
    contractValueUsd?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    contractPlan?: NullableEnumContractPlanFieldUpdateOperationsInput | $Enums.ContractPlan | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    contactId?: NullableStringFieldUpdateOperationsInput | string | null
    events?: LeadEventUncheckedUpdateManyWithoutSubmissionNestedInput
  }

  export type FormSubmissionCreateManyInput = {
    id?: string
    fullName?: string | null
    email?: string | null
    companyName?: string | null
    phoneCountryCode?: string | null
    phoneNumber?: string | null
    instagramUrl?: string | null
    websiteUrl?: string | null
    usesPms?: $Enums.PmsUsage | null
    propertyCount?: $Enums.PropertyCount | null
    revenueRange?: $Enums.RevenueRange | null
    isTodero?: $Enums.YesNo | null
    usesAi?: $Enums.YesNo | null
    wantsToScale?: $Enums.YesNo | null
    industryTime?: $Enums.IndustryTime | null
    pdfToken: string
    qualification?: $Enums.LeadQualification | null
    qualificationScore?: number | null
    disqualificationReason?: $Enums.DisqualificationReason | null
    scoreBreakdown?: NullableJsonNullValueInput | InputJsonValue
    entrySource?: $Enums.LeadEntrySource
    bookingFlow?: $Enums.BookingFlow | null
    bookedAt?: Date | string | null
    status?: $Enums.SubmissionStatus
    fbclid?: string | null
    fbp?: string | null
    fbc?: string | null
    utmSource?: string | null
    utmMedium?: string | null
    utmCampaign?: string | null
    utmContent?: string | null
    utmTerm?: string | null
    landingPath?: string | null
    referrer?: string | null
    marketingFunnelStage?: $Enums.MarketingFunnelStage | null
    contractValueUsd?: Decimal | DecimalJsLike | number | string | null
    contractPlan?: $Enums.ContractPlan | null
    createdAt?: Date | string
    updatedAt?: Date | string
    contactId?: string | null
  }

  export type FormSubmissionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    phoneCountryCode?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    instagramUrl?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    usesPms?: NullableEnumPmsUsageFieldUpdateOperationsInput | $Enums.PmsUsage | null
    propertyCount?: NullableEnumPropertyCountFieldUpdateOperationsInput | $Enums.PropertyCount | null
    revenueRange?: NullableEnumRevenueRangeFieldUpdateOperationsInput | $Enums.RevenueRange | null
    isTodero?: NullableEnumYesNoFieldUpdateOperationsInput | $Enums.YesNo | null
    usesAi?: NullableEnumYesNoFieldUpdateOperationsInput | $Enums.YesNo | null
    wantsToScale?: NullableEnumYesNoFieldUpdateOperationsInput | $Enums.YesNo | null
    industryTime?: NullableEnumIndustryTimeFieldUpdateOperationsInput | $Enums.IndustryTime | null
    pdfToken?: StringFieldUpdateOperationsInput | string
    qualification?: NullableEnumLeadQualificationFieldUpdateOperationsInput | $Enums.LeadQualification | null
    qualificationScore?: NullableIntFieldUpdateOperationsInput | number | null
    disqualificationReason?: NullableEnumDisqualificationReasonFieldUpdateOperationsInput | $Enums.DisqualificationReason | null
    scoreBreakdown?: NullableJsonNullValueInput | InputJsonValue
    entrySource?: EnumLeadEntrySourceFieldUpdateOperationsInput | $Enums.LeadEntrySource
    bookingFlow?: NullableEnumBookingFlowFieldUpdateOperationsInput | $Enums.BookingFlow | null
    bookedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumSubmissionStatusFieldUpdateOperationsInput | $Enums.SubmissionStatus
    fbclid?: NullableStringFieldUpdateOperationsInput | string | null
    fbp?: NullableStringFieldUpdateOperationsInput | string | null
    fbc?: NullableStringFieldUpdateOperationsInput | string | null
    utmSource?: NullableStringFieldUpdateOperationsInput | string | null
    utmMedium?: NullableStringFieldUpdateOperationsInput | string | null
    utmCampaign?: NullableStringFieldUpdateOperationsInput | string | null
    utmContent?: NullableStringFieldUpdateOperationsInput | string | null
    utmTerm?: NullableStringFieldUpdateOperationsInput | string | null
    landingPath?: NullableStringFieldUpdateOperationsInput | string | null
    referrer?: NullableStringFieldUpdateOperationsInput | string | null
    marketingFunnelStage?: NullableEnumMarketingFunnelStageFieldUpdateOperationsInput | $Enums.MarketingFunnelStage | null
    contractValueUsd?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    contractPlan?: NullableEnumContractPlanFieldUpdateOperationsInput | $Enums.ContractPlan | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FormSubmissionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    phoneCountryCode?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    instagramUrl?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    usesPms?: NullableEnumPmsUsageFieldUpdateOperationsInput | $Enums.PmsUsage | null
    propertyCount?: NullableEnumPropertyCountFieldUpdateOperationsInput | $Enums.PropertyCount | null
    revenueRange?: NullableEnumRevenueRangeFieldUpdateOperationsInput | $Enums.RevenueRange | null
    isTodero?: NullableEnumYesNoFieldUpdateOperationsInput | $Enums.YesNo | null
    usesAi?: NullableEnumYesNoFieldUpdateOperationsInput | $Enums.YesNo | null
    wantsToScale?: NullableEnumYesNoFieldUpdateOperationsInput | $Enums.YesNo | null
    industryTime?: NullableEnumIndustryTimeFieldUpdateOperationsInput | $Enums.IndustryTime | null
    pdfToken?: StringFieldUpdateOperationsInput | string
    qualification?: NullableEnumLeadQualificationFieldUpdateOperationsInput | $Enums.LeadQualification | null
    qualificationScore?: NullableIntFieldUpdateOperationsInput | number | null
    disqualificationReason?: NullableEnumDisqualificationReasonFieldUpdateOperationsInput | $Enums.DisqualificationReason | null
    scoreBreakdown?: NullableJsonNullValueInput | InputJsonValue
    entrySource?: EnumLeadEntrySourceFieldUpdateOperationsInput | $Enums.LeadEntrySource
    bookingFlow?: NullableEnumBookingFlowFieldUpdateOperationsInput | $Enums.BookingFlow | null
    bookedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumSubmissionStatusFieldUpdateOperationsInput | $Enums.SubmissionStatus
    fbclid?: NullableStringFieldUpdateOperationsInput | string | null
    fbp?: NullableStringFieldUpdateOperationsInput | string | null
    fbc?: NullableStringFieldUpdateOperationsInput | string | null
    utmSource?: NullableStringFieldUpdateOperationsInput | string | null
    utmMedium?: NullableStringFieldUpdateOperationsInput | string | null
    utmCampaign?: NullableStringFieldUpdateOperationsInput | string | null
    utmContent?: NullableStringFieldUpdateOperationsInput | string | null
    utmTerm?: NullableStringFieldUpdateOperationsInput | string | null
    landingPath?: NullableStringFieldUpdateOperationsInput | string | null
    referrer?: NullableStringFieldUpdateOperationsInput | string | null
    marketingFunnelStage?: NullableEnumMarketingFunnelStageFieldUpdateOperationsInput | $Enums.MarketingFunnelStage | null
    contractValueUsd?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    contractPlan?: NullableEnumContractPlanFieldUpdateOperationsInput | $Enums.ContractPlan | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    contactId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LeadEventCreateInput = {
    id: string
    eventName: $Enums.MarketingEventName
    eventTime?: Date | string
    eventSourceUrl?: string | null
    value: Decimal | DecimalJsLike | number | string
    currency?: string
    sentToMeta?: boolean
    metaResponse?: NullableJsonNullValueInput | InputJsonValue
    attemptCount?: number
    lastAttemptAt?: Date | string | null
    triggeredBy: string
    clientIp?: string | null
    clientUserAgent?: string | null
    createdAt?: Date | string
    submission: FormSubmissionCreateNestedOneWithoutEventsInput
  }

  export type LeadEventUncheckedCreateInput = {
    id: string
    submissionId: string
    eventName: $Enums.MarketingEventName
    eventTime?: Date | string
    eventSourceUrl?: string | null
    value: Decimal | DecimalJsLike | number | string
    currency?: string
    sentToMeta?: boolean
    metaResponse?: NullableJsonNullValueInput | InputJsonValue
    attemptCount?: number
    lastAttemptAt?: Date | string | null
    triggeredBy: string
    clientIp?: string | null
    clientUserAgent?: string | null
    createdAt?: Date | string
  }

  export type LeadEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventName?: EnumMarketingEventNameFieldUpdateOperationsInput | $Enums.MarketingEventName
    eventTime?: DateTimeFieldUpdateOperationsInput | Date | string
    eventSourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    value?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    sentToMeta?: BoolFieldUpdateOperationsInput | boolean
    metaResponse?: NullableJsonNullValueInput | InputJsonValue
    attemptCount?: IntFieldUpdateOperationsInput | number
    lastAttemptAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    triggeredBy?: StringFieldUpdateOperationsInput | string
    clientIp?: NullableStringFieldUpdateOperationsInput | string | null
    clientUserAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submission?: FormSubmissionUpdateOneRequiredWithoutEventsNestedInput
  }

  export type LeadEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    submissionId?: StringFieldUpdateOperationsInput | string
    eventName?: EnumMarketingEventNameFieldUpdateOperationsInput | $Enums.MarketingEventName
    eventTime?: DateTimeFieldUpdateOperationsInput | Date | string
    eventSourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    value?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    sentToMeta?: BoolFieldUpdateOperationsInput | boolean
    metaResponse?: NullableJsonNullValueInput | InputJsonValue
    attemptCount?: IntFieldUpdateOperationsInput | number
    lastAttemptAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    triggeredBy?: StringFieldUpdateOperationsInput | string
    clientIp?: NullableStringFieldUpdateOperationsInput | string | null
    clientUserAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LeadEventCreateManyInput = {
    id: string
    submissionId: string
    eventName: $Enums.MarketingEventName
    eventTime?: Date | string
    eventSourceUrl?: string | null
    value: Decimal | DecimalJsLike | number | string
    currency?: string
    sentToMeta?: boolean
    metaResponse?: NullableJsonNullValueInput | InputJsonValue
    attemptCount?: number
    lastAttemptAt?: Date | string | null
    triggeredBy: string
    clientIp?: string | null
    clientUserAgent?: string | null
    createdAt?: Date | string
  }

  export type LeadEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventName?: EnumMarketingEventNameFieldUpdateOperationsInput | $Enums.MarketingEventName
    eventTime?: DateTimeFieldUpdateOperationsInput | Date | string
    eventSourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    value?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    sentToMeta?: BoolFieldUpdateOperationsInput | boolean
    metaResponse?: NullableJsonNullValueInput | InputJsonValue
    attemptCount?: IntFieldUpdateOperationsInput | number
    lastAttemptAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    triggeredBy?: StringFieldUpdateOperationsInput | string
    clientIp?: NullableStringFieldUpdateOperationsInput | string | null
    clientUserAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LeadEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    submissionId?: StringFieldUpdateOperationsInput | string
    eventName?: EnumMarketingEventNameFieldUpdateOperationsInput | $Enums.MarketingEventName
    eventTime?: DateTimeFieldUpdateOperationsInput | Date | string
    eventSourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    value?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    sentToMeta?: BoolFieldUpdateOperationsInput | boolean
    metaResponse?: NullableJsonNullValueInput | InputJsonValue
    attemptCount?: IntFieldUpdateOperationsInput | number
    lastAttemptAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    triggeredBy?: StringFieldUpdateOperationsInput | string
    clientIp?: NullableStringFieldUpdateOperationsInput | string | null
    clientUserAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VideoWatchSessionCreateInput = {
    id?: string
    visitorId: string
    videoId: string
    startedAt?: Date | string
    lastHeartbeatAt?: Date | string
    maxSecond?: number
    durationSeconds?: number
    unlocked?: boolean
    completed?: boolean
    droppedAtSecond?: number | null
    dropReason?: $Enums.VideoDropReason | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VideoWatchSessionUncheckedCreateInput = {
    id?: string
    visitorId: string
    videoId: string
    startedAt?: Date | string
    lastHeartbeatAt?: Date | string
    maxSecond?: number
    durationSeconds?: number
    unlocked?: boolean
    completed?: boolean
    droppedAtSecond?: number | null
    dropReason?: $Enums.VideoDropReason | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VideoWatchSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    visitorId?: StringFieldUpdateOperationsInput | string
    videoId?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastHeartbeatAt?: DateTimeFieldUpdateOperationsInput | Date | string
    maxSecond?: IntFieldUpdateOperationsInput | number
    durationSeconds?: IntFieldUpdateOperationsInput | number
    unlocked?: BoolFieldUpdateOperationsInput | boolean
    completed?: BoolFieldUpdateOperationsInput | boolean
    droppedAtSecond?: NullableIntFieldUpdateOperationsInput | number | null
    dropReason?: NullableEnumVideoDropReasonFieldUpdateOperationsInput | $Enums.VideoDropReason | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VideoWatchSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    visitorId?: StringFieldUpdateOperationsInput | string
    videoId?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastHeartbeatAt?: DateTimeFieldUpdateOperationsInput | Date | string
    maxSecond?: IntFieldUpdateOperationsInput | number
    durationSeconds?: IntFieldUpdateOperationsInput | number
    unlocked?: BoolFieldUpdateOperationsInput | boolean
    completed?: BoolFieldUpdateOperationsInput | boolean
    droppedAtSecond?: NullableIntFieldUpdateOperationsInput | number | null
    dropReason?: NullableEnumVideoDropReasonFieldUpdateOperationsInput | $Enums.VideoDropReason | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VideoWatchSessionCreateManyInput = {
    id?: string
    visitorId: string
    videoId: string
    startedAt?: Date | string
    lastHeartbeatAt?: Date | string
    maxSecond?: number
    durationSeconds?: number
    unlocked?: boolean
    completed?: boolean
    droppedAtSecond?: number | null
    dropReason?: $Enums.VideoDropReason | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VideoWatchSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    visitorId?: StringFieldUpdateOperationsInput | string
    videoId?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastHeartbeatAt?: DateTimeFieldUpdateOperationsInput | Date | string
    maxSecond?: IntFieldUpdateOperationsInput | number
    durationSeconds?: IntFieldUpdateOperationsInput | number
    unlocked?: BoolFieldUpdateOperationsInput | boolean
    completed?: BoolFieldUpdateOperationsInput | boolean
    droppedAtSecond?: NullableIntFieldUpdateOperationsInput | number | null
    dropReason?: NullableEnumVideoDropReasonFieldUpdateOperationsInput | $Enums.VideoDropReason | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VideoWatchSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    visitorId?: StringFieldUpdateOperationsInput | string
    videoId?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastHeartbeatAt?: DateTimeFieldUpdateOperationsInput | Date | string
    maxSecond?: IntFieldUpdateOperationsInput | number
    durationSeconds?: IntFieldUpdateOperationsInput | number
    unlocked?: BoolFieldUpdateOperationsInput | boolean
    completed?: BoolFieldUpdateOperationsInput | boolean
    droppedAtSecond?: NullableIntFieldUpdateOperationsInput | number | null
    dropReason?: NullableEnumVideoDropReasonFieldUpdateOperationsInput | $Enums.VideoDropReason | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LeadPipelineCreateInput = {
    id?: string
    funnelOrigin: $Enums.FunnelOrigin
    currentStage: $Enums.PipelineStage
    currentState: $Enums.PipelineState
    scheduledJobId?: string | null
    scheduledJobDedupKey?: string | null
    videoWatched?: boolean
    utmSource?: string | null
    pixelFiredAt?: Date | string | null
    painPoint?: string | null
    qualificationAnswers?: NullableJsonNullValueInput | InputJsonValue
    meetingId?: string | null
    meetingTime?: Date | string | null
    meetLink?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    contact: ContactCreateNestedOneWithoutPipelineInput
    jobs?: PipelineJobCreateNestedManyWithoutPipelineInput
  }

  export type LeadPipelineUncheckedCreateInput = {
    id?: string
    contactId: string
    funnelOrigin: $Enums.FunnelOrigin
    currentStage: $Enums.PipelineStage
    currentState: $Enums.PipelineState
    scheduledJobId?: string | null
    scheduledJobDedupKey?: string | null
    videoWatched?: boolean
    utmSource?: string | null
    pixelFiredAt?: Date | string | null
    painPoint?: string | null
    qualificationAnswers?: NullableJsonNullValueInput | InputJsonValue
    meetingId?: string | null
    meetingTime?: Date | string | null
    meetLink?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    jobs?: PipelineJobUncheckedCreateNestedManyWithoutPipelineInput
  }

  export type LeadPipelineUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    funnelOrigin?: EnumFunnelOriginFieldUpdateOperationsInput | $Enums.FunnelOrigin
    currentStage?: EnumPipelineStageFieldUpdateOperationsInput | $Enums.PipelineStage
    currentState?: EnumPipelineStateFieldUpdateOperationsInput | $Enums.PipelineState
    scheduledJobId?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledJobDedupKey?: NullableStringFieldUpdateOperationsInput | string | null
    videoWatched?: BoolFieldUpdateOperationsInput | boolean
    utmSource?: NullableStringFieldUpdateOperationsInput | string | null
    pixelFiredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    painPoint?: NullableStringFieldUpdateOperationsInput | string | null
    qualificationAnswers?: NullableJsonNullValueInput | InputJsonValue
    meetingId?: NullableStringFieldUpdateOperationsInput | string | null
    meetingTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    meetLink?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    contact?: ContactUpdateOneRequiredWithoutPipelineNestedInput
    jobs?: PipelineJobUpdateManyWithoutPipelineNestedInput
  }

  export type LeadPipelineUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    contactId?: StringFieldUpdateOperationsInput | string
    funnelOrigin?: EnumFunnelOriginFieldUpdateOperationsInput | $Enums.FunnelOrigin
    currentStage?: EnumPipelineStageFieldUpdateOperationsInput | $Enums.PipelineStage
    currentState?: EnumPipelineStateFieldUpdateOperationsInput | $Enums.PipelineState
    scheduledJobId?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledJobDedupKey?: NullableStringFieldUpdateOperationsInput | string | null
    videoWatched?: BoolFieldUpdateOperationsInput | boolean
    utmSource?: NullableStringFieldUpdateOperationsInput | string | null
    pixelFiredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    painPoint?: NullableStringFieldUpdateOperationsInput | string | null
    qualificationAnswers?: NullableJsonNullValueInput | InputJsonValue
    meetingId?: NullableStringFieldUpdateOperationsInput | string | null
    meetingTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    meetLink?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    jobs?: PipelineJobUncheckedUpdateManyWithoutPipelineNestedInput
  }

  export type LeadPipelineCreateManyInput = {
    id?: string
    contactId: string
    funnelOrigin: $Enums.FunnelOrigin
    currentStage: $Enums.PipelineStage
    currentState: $Enums.PipelineState
    scheduledJobId?: string | null
    scheduledJobDedupKey?: string | null
    videoWatched?: boolean
    utmSource?: string | null
    pixelFiredAt?: Date | string | null
    painPoint?: string | null
    qualificationAnswers?: NullableJsonNullValueInput | InputJsonValue
    meetingId?: string | null
    meetingTime?: Date | string | null
    meetLink?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LeadPipelineUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    funnelOrigin?: EnumFunnelOriginFieldUpdateOperationsInput | $Enums.FunnelOrigin
    currentStage?: EnumPipelineStageFieldUpdateOperationsInput | $Enums.PipelineStage
    currentState?: EnumPipelineStateFieldUpdateOperationsInput | $Enums.PipelineState
    scheduledJobId?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledJobDedupKey?: NullableStringFieldUpdateOperationsInput | string | null
    videoWatched?: BoolFieldUpdateOperationsInput | boolean
    utmSource?: NullableStringFieldUpdateOperationsInput | string | null
    pixelFiredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    painPoint?: NullableStringFieldUpdateOperationsInput | string | null
    qualificationAnswers?: NullableJsonNullValueInput | InputJsonValue
    meetingId?: NullableStringFieldUpdateOperationsInput | string | null
    meetingTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    meetLink?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LeadPipelineUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    contactId?: StringFieldUpdateOperationsInput | string
    funnelOrigin?: EnumFunnelOriginFieldUpdateOperationsInput | $Enums.FunnelOrigin
    currentStage?: EnumPipelineStageFieldUpdateOperationsInput | $Enums.PipelineStage
    currentState?: EnumPipelineStateFieldUpdateOperationsInput | $Enums.PipelineState
    scheduledJobId?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledJobDedupKey?: NullableStringFieldUpdateOperationsInput | string | null
    videoWatched?: BoolFieldUpdateOperationsInput | boolean
    utmSource?: NullableStringFieldUpdateOperationsInput | string | null
    pixelFiredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    painPoint?: NullableStringFieldUpdateOperationsInput | string | null
    qualificationAnswers?: NullableJsonNullValueInput | InputJsonValue
    meetingId?: NullableStringFieldUpdateOperationsInput | string | null
    meetingTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    meetLink?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConversationCreateInput = {
    id?: string
    channel?: $Enums.ConversationChannel
    waPhoneNumberId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    contact: ContactCreateNestedOneWithoutConversationsInput
    messages?: ConversationMessageCreateNestedManyWithoutConversationInput
  }

  export type ConversationUncheckedCreateInput = {
    id?: string
    contactId: string
    channel?: $Enums.ConversationChannel
    waPhoneNumberId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: ConversationMessageUncheckedCreateNestedManyWithoutConversationInput
  }

  export type ConversationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    channel?: EnumConversationChannelFieldUpdateOperationsInput | $Enums.ConversationChannel
    waPhoneNumberId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    contact?: ContactUpdateOneRequiredWithoutConversationsNestedInput
    messages?: ConversationMessageUpdateManyWithoutConversationNestedInput
  }

  export type ConversationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    contactId?: StringFieldUpdateOperationsInput | string
    channel?: EnumConversationChannelFieldUpdateOperationsInput | $Enums.ConversationChannel
    waPhoneNumberId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: ConversationMessageUncheckedUpdateManyWithoutConversationNestedInput
  }

  export type ConversationCreateManyInput = {
    id?: string
    contactId: string
    channel?: $Enums.ConversationChannel
    waPhoneNumberId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConversationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    channel?: EnumConversationChannelFieldUpdateOperationsInput | $Enums.ConversationChannel
    waPhoneNumberId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConversationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    contactId?: StringFieldUpdateOperationsInput | string
    channel?: EnumConversationChannelFieldUpdateOperationsInput | $Enums.ConversationChannel
    waPhoneNumberId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConversationMessageCreateInput = {
    id?: string
    direction: $Enums.MessageDirection
    waMessageId?: string | null
    type: $Enums.MessageType
    body?: string | null
    templateName?: string | null
    buttonId?: string | null
    rawPayload?: NullableJsonNullValueInput | InputJsonValue
    pipelineState?: $Enums.PipelineState | null
    status?: $Enums.MessageStatus
    mediaId?: string | null
    mimeType?: string | null
    mediaFilename?: string | null
    mediaUrl?: string | null
    caption?: string | null
    createdAt?: Date | string
    conversation: ConversationCreateNestedOneWithoutMessagesInput
  }

  export type ConversationMessageUncheckedCreateInput = {
    id?: string
    conversationId: string
    direction: $Enums.MessageDirection
    waMessageId?: string | null
    type: $Enums.MessageType
    body?: string | null
    templateName?: string | null
    buttonId?: string | null
    rawPayload?: NullableJsonNullValueInput | InputJsonValue
    pipelineState?: $Enums.PipelineState | null
    status?: $Enums.MessageStatus
    mediaId?: string | null
    mimeType?: string | null
    mediaFilename?: string | null
    mediaUrl?: string | null
    caption?: string | null
    createdAt?: Date | string
  }

  export type ConversationMessageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    direction?: EnumMessageDirectionFieldUpdateOperationsInput | $Enums.MessageDirection
    waMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumMessageTypeFieldUpdateOperationsInput | $Enums.MessageType
    body?: NullableStringFieldUpdateOperationsInput | string | null
    templateName?: NullableStringFieldUpdateOperationsInput | string | null
    buttonId?: NullableStringFieldUpdateOperationsInput | string | null
    rawPayload?: NullableJsonNullValueInput | InputJsonValue
    pipelineState?: NullableEnumPipelineStateFieldUpdateOperationsInput | $Enums.PipelineState | null
    status?: EnumMessageStatusFieldUpdateOperationsInput | $Enums.MessageStatus
    mediaId?: NullableStringFieldUpdateOperationsInput | string | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    mediaFilename?: NullableStringFieldUpdateOperationsInput | string | null
    mediaUrl?: NullableStringFieldUpdateOperationsInput | string | null
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    conversation?: ConversationUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type ConversationMessageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    conversationId?: StringFieldUpdateOperationsInput | string
    direction?: EnumMessageDirectionFieldUpdateOperationsInput | $Enums.MessageDirection
    waMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumMessageTypeFieldUpdateOperationsInput | $Enums.MessageType
    body?: NullableStringFieldUpdateOperationsInput | string | null
    templateName?: NullableStringFieldUpdateOperationsInput | string | null
    buttonId?: NullableStringFieldUpdateOperationsInput | string | null
    rawPayload?: NullableJsonNullValueInput | InputJsonValue
    pipelineState?: NullableEnumPipelineStateFieldUpdateOperationsInput | $Enums.PipelineState | null
    status?: EnumMessageStatusFieldUpdateOperationsInput | $Enums.MessageStatus
    mediaId?: NullableStringFieldUpdateOperationsInput | string | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    mediaFilename?: NullableStringFieldUpdateOperationsInput | string | null
    mediaUrl?: NullableStringFieldUpdateOperationsInput | string | null
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConversationMessageCreateManyInput = {
    id?: string
    conversationId: string
    direction: $Enums.MessageDirection
    waMessageId?: string | null
    type: $Enums.MessageType
    body?: string | null
    templateName?: string | null
    buttonId?: string | null
    rawPayload?: NullableJsonNullValueInput | InputJsonValue
    pipelineState?: $Enums.PipelineState | null
    status?: $Enums.MessageStatus
    mediaId?: string | null
    mimeType?: string | null
    mediaFilename?: string | null
    mediaUrl?: string | null
    caption?: string | null
    createdAt?: Date | string
  }

  export type ConversationMessageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    direction?: EnumMessageDirectionFieldUpdateOperationsInput | $Enums.MessageDirection
    waMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumMessageTypeFieldUpdateOperationsInput | $Enums.MessageType
    body?: NullableStringFieldUpdateOperationsInput | string | null
    templateName?: NullableStringFieldUpdateOperationsInput | string | null
    buttonId?: NullableStringFieldUpdateOperationsInput | string | null
    rawPayload?: NullableJsonNullValueInput | InputJsonValue
    pipelineState?: NullableEnumPipelineStateFieldUpdateOperationsInput | $Enums.PipelineState | null
    status?: EnumMessageStatusFieldUpdateOperationsInput | $Enums.MessageStatus
    mediaId?: NullableStringFieldUpdateOperationsInput | string | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    mediaFilename?: NullableStringFieldUpdateOperationsInput | string | null
    mediaUrl?: NullableStringFieldUpdateOperationsInput | string | null
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConversationMessageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    conversationId?: StringFieldUpdateOperationsInput | string
    direction?: EnumMessageDirectionFieldUpdateOperationsInput | $Enums.MessageDirection
    waMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumMessageTypeFieldUpdateOperationsInput | $Enums.MessageType
    body?: NullableStringFieldUpdateOperationsInput | string | null
    templateName?: NullableStringFieldUpdateOperationsInput | string | null
    buttonId?: NullableStringFieldUpdateOperationsInput | string | null
    rawPayload?: NullableJsonNullValueInput | InputJsonValue
    pipelineState?: NullableEnumPipelineStateFieldUpdateOperationsInput | $Enums.PipelineState | null
    status?: EnumMessageStatusFieldUpdateOperationsInput | $Enums.MessageStatus
    mediaId?: NullableStringFieldUpdateOperationsInput | string | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    mediaFilename?: NullableStringFieldUpdateOperationsInput | string | null
    mediaUrl?: NullableStringFieldUpdateOperationsInput | string | null
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PipelineJobCreateInput = {
    id?: string
    dedupKey: string
    expectedState: $Enums.PipelineState
    qstashMessageId?: string | null
    status?: $Enums.PipelineJobStatus
    createdAt?: Date | string
    executedAt?: Date | string | null
    pipeline: LeadPipelineCreateNestedOneWithoutJobsInput
  }

  export type PipelineJobUncheckedCreateInput = {
    id?: string
    pipelineId: string
    dedupKey: string
    expectedState: $Enums.PipelineState
    qstashMessageId?: string | null
    status?: $Enums.PipelineJobStatus
    createdAt?: Date | string
    executedAt?: Date | string | null
  }

  export type PipelineJobUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    dedupKey?: StringFieldUpdateOperationsInput | string
    expectedState?: EnumPipelineStateFieldUpdateOperationsInput | $Enums.PipelineState
    qstashMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumPipelineJobStatusFieldUpdateOperationsInput | $Enums.PipelineJobStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    executedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pipeline?: LeadPipelineUpdateOneRequiredWithoutJobsNestedInput
  }

  export type PipelineJobUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    pipelineId?: StringFieldUpdateOperationsInput | string
    dedupKey?: StringFieldUpdateOperationsInput | string
    expectedState?: EnumPipelineStateFieldUpdateOperationsInput | $Enums.PipelineState
    qstashMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumPipelineJobStatusFieldUpdateOperationsInput | $Enums.PipelineJobStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    executedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PipelineJobCreateManyInput = {
    id?: string
    pipelineId: string
    dedupKey: string
    expectedState: $Enums.PipelineState
    qstashMessageId?: string | null
    status?: $Enums.PipelineJobStatus
    createdAt?: Date | string
    executedAt?: Date | string | null
  }

  export type PipelineJobUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    dedupKey?: StringFieldUpdateOperationsInput | string
    expectedState?: EnumPipelineStateFieldUpdateOperationsInput | $Enums.PipelineState
    qstashMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumPipelineJobStatusFieldUpdateOperationsInput | $Enums.PipelineJobStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    executedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PipelineJobUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    pipelineId?: StringFieldUpdateOperationsInput | string
    dedupKey?: StringFieldUpdateOperationsInput | string
    expectedState?: EnumPipelineStateFieldUpdateOperationsInput | $Enums.PipelineState
    qstashMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumPipelineJobStatusFieldUpdateOperationsInput | $Enums.PipelineJobStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    executedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type FormSubmissionListRelationFilter = {
    every?: FormSubmissionWhereInput
    some?: FormSubmissionWhereInput
    none?: FormSubmissionWhereInput
  }

  export type LeadPipelineNullableScalarRelationFilter = {
    is?: LeadPipelineWhereInput | null
    isNot?: LeadPipelineWhereInput | null
  }

  export type ConversationListRelationFilter = {
    every?: ConversationWhereInput
    some?: ConversationWhereInput
    none?: ConversationWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type FormSubmissionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ConversationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ContactCountOrderByAggregateInput = {
    id?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    phoneE164?: SortOrder
    waId?: SortOrder
    phoneCountryCode?: SortOrder
    phoneNumber?: SortOrder
    companyName?: SortOrder
    websiteUrl?: SortOrder
    instagramUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ContactMaxOrderByAggregateInput = {
    id?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    phoneE164?: SortOrder
    waId?: SortOrder
    phoneCountryCode?: SortOrder
    phoneNumber?: SortOrder
    companyName?: SortOrder
    websiteUrl?: SortOrder
    instagramUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ContactMinOrderByAggregateInput = {
    id?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    phoneE164?: SortOrder
    waId?: SortOrder
    phoneCountryCode?: SortOrder
    phoneNumber?: SortOrder
    companyName?: SortOrder
    websiteUrl?: SortOrder
    instagramUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumPmsUsageNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.PmsUsage | EnumPmsUsageFieldRefInput<$PrismaModel> | null
    in?: $Enums.PmsUsage[] | ListEnumPmsUsageFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.PmsUsage[] | ListEnumPmsUsageFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPmsUsageNullableFilter<$PrismaModel> | $Enums.PmsUsage | null
  }

  export type EnumPropertyCountNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.PropertyCount | EnumPropertyCountFieldRefInput<$PrismaModel> | null
    in?: $Enums.PropertyCount[] | ListEnumPropertyCountFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.PropertyCount[] | ListEnumPropertyCountFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPropertyCountNullableFilter<$PrismaModel> | $Enums.PropertyCount | null
  }

  export type EnumRevenueRangeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.RevenueRange | EnumRevenueRangeFieldRefInput<$PrismaModel> | null
    in?: $Enums.RevenueRange[] | ListEnumRevenueRangeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.RevenueRange[] | ListEnumRevenueRangeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumRevenueRangeNullableFilter<$PrismaModel> | $Enums.RevenueRange | null
  }

  export type EnumYesNoNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.YesNo | EnumYesNoFieldRefInput<$PrismaModel> | null
    in?: $Enums.YesNo[] | ListEnumYesNoFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.YesNo[] | ListEnumYesNoFieldRefInput<$PrismaModel> | null
    not?: NestedEnumYesNoNullableFilter<$PrismaModel> | $Enums.YesNo | null
  }

  export type EnumIndustryTimeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.IndustryTime | EnumIndustryTimeFieldRefInput<$PrismaModel> | null
    in?: $Enums.IndustryTime[] | ListEnumIndustryTimeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.IndustryTime[] | ListEnumIndustryTimeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumIndustryTimeNullableFilter<$PrismaModel> | $Enums.IndustryTime | null
  }

  export type EnumLeadQualificationNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.LeadQualification | EnumLeadQualificationFieldRefInput<$PrismaModel> | null
    in?: $Enums.LeadQualification[] | ListEnumLeadQualificationFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.LeadQualification[] | ListEnumLeadQualificationFieldRefInput<$PrismaModel> | null
    not?: NestedEnumLeadQualificationNullableFilter<$PrismaModel> | $Enums.LeadQualification | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type EnumDisqualificationReasonNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.DisqualificationReason | EnumDisqualificationReasonFieldRefInput<$PrismaModel> | null
    in?: $Enums.DisqualificationReason[] | ListEnumDisqualificationReasonFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.DisqualificationReason[] | ListEnumDisqualificationReasonFieldRefInput<$PrismaModel> | null
    not?: NestedEnumDisqualificationReasonNullableFilter<$PrismaModel> | $Enums.DisqualificationReason | null
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type EnumLeadEntrySourceFilter<$PrismaModel = never> = {
    equals?: $Enums.LeadEntrySource | EnumLeadEntrySourceFieldRefInput<$PrismaModel>
    in?: $Enums.LeadEntrySource[] | ListEnumLeadEntrySourceFieldRefInput<$PrismaModel>
    notIn?: $Enums.LeadEntrySource[] | ListEnumLeadEntrySourceFieldRefInput<$PrismaModel>
    not?: NestedEnumLeadEntrySourceFilter<$PrismaModel> | $Enums.LeadEntrySource
  }

  export type EnumBookingFlowNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingFlow | EnumBookingFlowFieldRefInput<$PrismaModel> | null
    in?: $Enums.BookingFlow[] | ListEnumBookingFlowFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.BookingFlow[] | ListEnumBookingFlowFieldRefInput<$PrismaModel> | null
    not?: NestedEnumBookingFlowNullableFilter<$PrismaModel> | $Enums.BookingFlow | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type EnumSubmissionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SubmissionStatus | EnumSubmissionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SubmissionStatus[] | ListEnumSubmissionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubmissionStatus[] | ListEnumSubmissionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSubmissionStatusFilter<$PrismaModel> | $Enums.SubmissionStatus
  }

  export type EnumMarketingFunnelStageNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.MarketingFunnelStage | EnumMarketingFunnelStageFieldRefInput<$PrismaModel> | null
    in?: $Enums.MarketingFunnelStage[] | ListEnumMarketingFunnelStageFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.MarketingFunnelStage[] | ListEnumMarketingFunnelStageFieldRefInput<$PrismaModel> | null
    not?: NestedEnumMarketingFunnelStageNullableFilter<$PrismaModel> | $Enums.MarketingFunnelStage | null
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type EnumContractPlanNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.ContractPlan | EnumContractPlanFieldRefInput<$PrismaModel> | null
    in?: $Enums.ContractPlan[] | ListEnumContractPlanFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.ContractPlan[] | ListEnumContractPlanFieldRefInput<$PrismaModel> | null
    not?: NestedEnumContractPlanNullableFilter<$PrismaModel> | $Enums.ContractPlan | null
  }

  export type ContactNullableScalarRelationFilter = {
    is?: ContactWhereInput | null
    isNot?: ContactWhereInput | null
  }

  export type LeadEventListRelationFilter = {
    every?: LeadEventWhereInput
    some?: LeadEventWhereInput
    none?: LeadEventWhereInput
  }

  export type LeadEventOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FormSubmissionCountOrderByAggregateInput = {
    id?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    companyName?: SortOrder
    phoneCountryCode?: SortOrder
    phoneNumber?: SortOrder
    instagramUrl?: SortOrder
    websiteUrl?: SortOrder
    usesPms?: SortOrder
    propertyCount?: SortOrder
    revenueRange?: SortOrder
    isTodero?: SortOrder
    usesAi?: SortOrder
    wantsToScale?: SortOrder
    industryTime?: SortOrder
    pdfToken?: SortOrder
    qualification?: SortOrder
    qualificationScore?: SortOrder
    disqualificationReason?: SortOrder
    scoreBreakdown?: SortOrder
    entrySource?: SortOrder
    bookingFlow?: SortOrder
    bookedAt?: SortOrder
    status?: SortOrder
    fbclid?: SortOrder
    fbp?: SortOrder
    fbc?: SortOrder
    utmSource?: SortOrder
    utmMedium?: SortOrder
    utmCampaign?: SortOrder
    utmContent?: SortOrder
    utmTerm?: SortOrder
    landingPath?: SortOrder
    referrer?: SortOrder
    marketingFunnelStage?: SortOrder
    contractValueUsd?: SortOrder
    contractPlan?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    contactId?: SortOrder
  }

  export type FormSubmissionAvgOrderByAggregateInput = {
    qualificationScore?: SortOrder
    contractValueUsd?: SortOrder
  }

  export type FormSubmissionMaxOrderByAggregateInput = {
    id?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    companyName?: SortOrder
    phoneCountryCode?: SortOrder
    phoneNumber?: SortOrder
    instagramUrl?: SortOrder
    websiteUrl?: SortOrder
    usesPms?: SortOrder
    propertyCount?: SortOrder
    revenueRange?: SortOrder
    isTodero?: SortOrder
    usesAi?: SortOrder
    wantsToScale?: SortOrder
    industryTime?: SortOrder
    pdfToken?: SortOrder
    qualification?: SortOrder
    qualificationScore?: SortOrder
    disqualificationReason?: SortOrder
    entrySource?: SortOrder
    bookingFlow?: SortOrder
    bookedAt?: SortOrder
    status?: SortOrder
    fbclid?: SortOrder
    fbp?: SortOrder
    fbc?: SortOrder
    utmSource?: SortOrder
    utmMedium?: SortOrder
    utmCampaign?: SortOrder
    utmContent?: SortOrder
    utmTerm?: SortOrder
    landingPath?: SortOrder
    referrer?: SortOrder
    marketingFunnelStage?: SortOrder
    contractValueUsd?: SortOrder
    contractPlan?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    contactId?: SortOrder
  }

  export type FormSubmissionMinOrderByAggregateInput = {
    id?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    companyName?: SortOrder
    phoneCountryCode?: SortOrder
    phoneNumber?: SortOrder
    instagramUrl?: SortOrder
    websiteUrl?: SortOrder
    usesPms?: SortOrder
    propertyCount?: SortOrder
    revenueRange?: SortOrder
    isTodero?: SortOrder
    usesAi?: SortOrder
    wantsToScale?: SortOrder
    industryTime?: SortOrder
    pdfToken?: SortOrder
    qualification?: SortOrder
    qualificationScore?: SortOrder
    disqualificationReason?: SortOrder
    entrySource?: SortOrder
    bookingFlow?: SortOrder
    bookedAt?: SortOrder
    status?: SortOrder
    fbclid?: SortOrder
    fbp?: SortOrder
    fbc?: SortOrder
    utmSource?: SortOrder
    utmMedium?: SortOrder
    utmCampaign?: SortOrder
    utmContent?: SortOrder
    utmTerm?: SortOrder
    landingPath?: SortOrder
    referrer?: SortOrder
    marketingFunnelStage?: SortOrder
    contractValueUsd?: SortOrder
    contractPlan?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    contactId?: SortOrder
  }

  export type FormSubmissionSumOrderByAggregateInput = {
    qualificationScore?: SortOrder
    contractValueUsd?: SortOrder
  }

  export type EnumPmsUsageNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PmsUsage | EnumPmsUsageFieldRefInput<$PrismaModel> | null
    in?: $Enums.PmsUsage[] | ListEnumPmsUsageFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.PmsUsage[] | ListEnumPmsUsageFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPmsUsageNullableWithAggregatesFilter<$PrismaModel> | $Enums.PmsUsage | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumPmsUsageNullableFilter<$PrismaModel>
    _max?: NestedEnumPmsUsageNullableFilter<$PrismaModel>
  }

  export type EnumPropertyCountNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PropertyCount | EnumPropertyCountFieldRefInput<$PrismaModel> | null
    in?: $Enums.PropertyCount[] | ListEnumPropertyCountFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.PropertyCount[] | ListEnumPropertyCountFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPropertyCountNullableWithAggregatesFilter<$PrismaModel> | $Enums.PropertyCount | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumPropertyCountNullableFilter<$PrismaModel>
    _max?: NestedEnumPropertyCountNullableFilter<$PrismaModel>
  }

  export type EnumRevenueRangeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RevenueRange | EnumRevenueRangeFieldRefInput<$PrismaModel> | null
    in?: $Enums.RevenueRange[] | ListEnumRevenueRangeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.RevenueRange[] | ListEnumRevenueRangeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumRevenueRangeNullableWithAggregatesFilter<$PrismaModel> | $Enums.RevenueRange | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumRevenueRangeNullableFilter<$PrismaModel>
    _max?: NestedEnumRevenueRangeNullableFilter<$PrismaModel>
  }

  export type EnumYesNoNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.YesNo | EnumYesNoFieldRefInput<$PrismaModel> | null
    in?: $Enums.YesNo[] | ListEnumYesNoFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.YesNo[] | ListEnumYesNoFieldRefInput<$PrismaModel> | null
    not?: NestedEnumYesNoNullableWithAggregatesFilter<$PrismaModel> | $Enums.YesNo | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumYesNoNullableFilter<$PrismaModel>
    _max?: NestedEnumYesNoNullableFilter<$PrismaModel>
  }

  export type EnumIndustryTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.IndustryTime | EnumIndustryTimeFieldRefInput<$PrismaModel> | null
    in?: $Enums.IndustryTime[] | ListEnumIndustryTimeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.IndustryTime[] | ListEnumIndustryTimeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumIndustryTimeNullableWithAggregatesFilter<$PrismaModel> | $Enums.IndustryTime | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumIndustryTimeNullableFilter<$PrismaModel>
    _max?: NestedEnumIndustryTimeNullableFilter<$PrismaModel>
  }

  export type EnumLeadQualificationNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LeadQualification | EnumLeadQualificationFieldRefInput<$PrismaModel> | null
    in?: $Enums.LeadQualification[] | ListEnumLeadQualificationFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.LeadQualification[] | ListEnumLeadQualificationFieldRefInput<$PrismaModel> | null
    not?: NestedEnumLeadQualificationNullableWithAggregatesFilter<$PrismaModel> | $Enums.LeadQualification | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumLeadQualificationNullableFilter<$PrismaModel>
    _max?: NestedEnumLeadQualificationNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type EnumDisqualificationReasonNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DisqualificationReason | EnumDisqualificationReasonFieldRefInput<$PrismaModel> | null
    in?: $Enums.DisqualificationReason[] | ListEnumDisqualificationReasonFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.DisqualificationReason[] | ListEnumDisqualificationReasonFieldRefInput<$PrismaModel> | null
    not?: NestedEnumDisqualificationReasonNullableWithAggregatesFilter<$PrismaModel> | $Enums.DisqualificationReason | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumDisqualificationReasonNullableFilter<$PrismaModel>
    _max?: NestedEnumDisqualificationReasonNullableFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type EnumLeadEntrySourceWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LeadEntrySource | EnumLeadEntrySourceFieldRefInput<$PrismaModel>
    in?: $Enums.LeadEntrySource[] | ListEnumLeadEntrySourceFieldRefInput<$PrismaModel>
    notIn?: $Enums.LeadEntrySource[] | ListEnumLeadEntrySourceFieldRefInput<$PrismaModel>
    not?: NestedEnumLeadEntrySourceWithAggregatesFilter<$PrismaModel> | $Enums.LeadEntrySource
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLeadEntrySourceFilter<$PrismaModel>
    _max?: NestedEnumLeadEntrySourceFilter<$PrismaModel>
  }

  export type EnumBookingFlowNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingFlow | EnumBookingFlowFieldRefInput<$PrismaModel> | null
    in?: $Enums.BookingFlow[] | ListEnumBookingFlowFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.BookingFlow[] | ListEnumBookingFlowFieldRefInput<$PrismaModel> | null
    not?: NestedEnumBookingFlowNullableWithAggregatesFilter<$PrismaModel> | $Enums.BookingFlow | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumBookingFlowNullableFilter<$PrismaModel>
    _max?: NestedEnumBookingFlowNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EnumSubmissionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SubmissionStatus | EnumSubmissionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SubmissionStatus[] | ListEnumSubmissionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubmissionStatus[] | ListEnumSubmissionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSubmissionStatusWithAggregatesFilter<$PrismaModel> | $Enums.SubmissionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSubmissionStatusFilter<$PrismaModel>
    _max?: NestedEnumSubmissionStatusFilter<$PrismaModel>
  }

  export type EnumMarketingFunnelStageNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MarketingFunnelStage | EnumMarketingFunnelStageFieldRefInput<$PrismaModel> | null
    in?: $Enums.MarketingFunnelStage[] | ListEnumMarketingFunnelStageFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.MarketingFunnelStage[] | ListEnumMarketingFunnelStageFieldRefInput<$PrismaModel> | null
    not?: NestedEnumMarketingFunnelStageNullableWithAggregatesFilter<$PrismaModel> | $Enums.MarketingFunnelStage | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumMarketingFunnelStageNullableFilter<$PrismaModel>
    _max?: NestedEnumMarketingFunnelStageNullableFilter<$PrismaModel>
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type EnumContractPlanNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ContractPlan | EnumContractPlanFieldRefInput<$PrismaModel> | null
    in?: $Enums.ContractPlan[] | ListEnumContractPlanFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.ContractPlan[] | ListEnumContractPlanFieldRefInput<$PrismaModel> | null
    not?: NestedEnumContractPlanNullableWithAggregatesFilter<$PrismaModel> | $Enums.ContractPlan | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumContractPlanNullableFilter<$PrismaModel>
    _max?: NestedEnumContractPlanNullableFilter<$PrismaModel>
  }

  export type EnumMarketingEventNameFilter<$PrismaModel = never> = {
    equals?: $Enums.MarketingEventName | EnumMarketingEventNameFieldRefInput<$PrismaModel>
    in?: $Enums.MarketingEventName[] | ListEnumMarketingEventNameFieldRefInput<$PrismaModel>
    notIn?: $Enums.MarketingEventName[] | ListEnumMarketingEventNameFieldRefInput<$PrismaModel>
    not?: NestedEnumMarketingEventNameFilter<$PrismaModel> | $Enums.MarketingEventName
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type FormSubmissionScalarRelationFilter = {
    is?: FormSubmissionWhereInput
    isNot?: FormSubmissionWhereInput
  }

  export type LeadEventSubmissionIdEventNameCompoundUniqueInput = {
    submissionId: string
    eventName: $Enums.MarketingEventName
  }

  export type LeadEventCountOrderByAggregateInput = {
    id?: SortOrder
    submissionId?: SortOrder
    eventName?: SortOrder
    eventTime?: SortOrder
    eventSourceUrl?: SortOrder
    value?: SortOrder
    currency?: SortOrder
    sentToMeta?: SortOrder
    metaResponse?: SortOrder
    attemptCount?: SortOrder
    lastAttemptAt?: SortOrder
    triggeredBy?: SortOrder
    clientIp?: SortOrder
    clientUserAgent?: SortOrder
    createdAt?: SortOrder
  }

  export type LeadEventAvgOrderByAggregateInput = {
    value?: SortOrder
    attemptCount?: SortOrder
  }

  export type LeadEventMaxOrderByAggregateInput = {
    id?: SortOrder
    submissionId?: SortOrder
    eventName?: SortOrder
    eventTime?: SortOrder
    eventSourceUrl?: SortOrder
    value?: SortOrder
    currency?: SortOrder
    sentToMeta?: SortOrder
    attemptCount?: SortOrder
    lastAttemptAt?: SortOrder
    triggeredBy?: SortOrder
    clientIp?: SortOrder
    clientUserAgent?: SortOrder
    createdAt?: SortOrder
  }

  export type LeadEventMinOrderByAggregateInput = {
    id?: SortOrder
    submissionId?: SortOrder
    eventName?: SortOrder
    eventTime?: SortOrder
    eventSourceUrl?: SortOrder
    value?: SortOrder
    currency?: SortOrder
    sentToMeta?: SortOrder
    attemptCount?: SortOrder
    lastAttemptAt?: SortOrder
    triggeredBy?: SortOrder
    clientIp?: SortOrder
    clientUserAgent?: SortOrder
    createdAt?: SortOrder
  }

  export type LeadEventSumOrderByAggregateInput = {
    value?: SortOrder
    attemptCount?: SortOrder
  }

  export type EnumMarketingEventNameWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MarketingEventName | EnumMarketingEventNameFieldRefInput<$PrismaModel>
    in?: $Enums.MarketingEventName[] | ListEnumMarketingEventNameFieldRefInput<$PrismaModel>
    notIn?: $Enums.MarketingEventName[] | ListEnumMarketingEventNameFieldRefInput<$PrismaModel>
    not?: NestedEnumMarketingEventNameWithAggregatesFilter<$PrismaModel> | $Enums.MarketingEventName
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMarketingEventNameFilter<$PrismaModel>
    _max?: NestedEnumMarketingEventNameFilter<$PrismaModel>
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type EnumVideoDropReasonNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.VideoDropReason | EnumVideoDropReasonFieldRefInput<$PrismaModel> | null
    in?: $Enums.VideoDropReason[] | ListEnumVideoDropReasonFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.VideoDropReason[] | ListEnumVideoDropReasonFieldRefInput<$PrismaModel> | null
    not?: NestedEnumVideoDropReasonNullableFilter<$PrismaModel> | $Enums.VideoDropReason | null
  }

  export type VideoWatchSessionCountOrderByAggregateInput = {
    id?: SortOrder
    visitorId?: SortOrder
    videoId?: SortOrder
    startedAt?: SortOrder
    lastHeartbeatAt?: SortOrder
    maxSecond?: SortOrder
    durationSeconds?: SortOrder
    unlocked?: SortOrder
    completed?: SortOrder
    droppedAtSecond?: SortOrder
    dropReason?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VideoWatchSessionAvgOrderByAggregateInput = {
    maxSecond?: SortOrder
    durationSeconds?: SortOrder
    droppedAtSecond?: SortOrder
  }

  export type VideoWatchSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    visitorId?: SortOrder
    videoId?: SortOrder
    startedAt?: SortOrder
    lastHeartbeatAt?: SortOrder
    maxSecond?: SortOrder
    durationSeconds?: SortOrder
    unlocked?: SortOrder
    completed?: SortOrder
    droppedAtSecond?: SortOrder
    dropReason?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VideoWatchSessionMinOrderByAggregateInput = {
    id?: SortOrder
    visitorId?: SortOrder
    videoId?: SortOrder
    startedAt?: SortOrder
    lastHeartbeatAt?: SortOrder
    maxSecond?: SortOrder
    durationSeconds?: SortOrder
    unlocked?: SortOrder
    completed?: SortOrder
    droppedAtSecond?: SortOrder
    dropReason?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VideoWatchSessionSumOrderByAggregateInput = {
    maxSecond?: SortOrder
    durationSeconds?: SortOrder
    droppedAtSecond?: SortOrder
  }

  export type EnumVideoDropReasonNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.VideoDropReason | EnumVideoDropReasonFieldRefInput<$PrismaModel> | null
    in?: $Enums.VideoDropReason[] | ListEnumVideoDropReasonFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.VideoDropReason[] | ListEnumVideoDropReasonFieldRefInput<$PrismaModel> | null
    not?: NestedEnumVideoDropReasonNullableWithAggregatesFilter<$PrismaModel> | $Enums.VideoDropReason | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumVideoDropReasonNullableFilter<$PrismaModel>
    _max?: NestedEnumVideoDropReasonNullableFilter<$PrismaModel>
  }

  export type EnumFunnelOriginFilter<$PrismaModel = never> = {
    equals?: $Enums.FunnelOrigin | EnumFunnelOriginFieldRefInput<$PrismaModel>
    in?: $Enums.FunnelOrigin[] | ListEnumFunnelOriginFieldRefInput<$PrismaModel>
    notIn?: $Enums.FunnelOrigin[] | ListEnumFunnelOriginFieldRefInput<$PrismaModel>
    not?: NestedEnumFunnelOriginFilter<$PrismaModel> | $Enums.FunnelOrigin
  }

  export type EnumPipelineStageFilter<$PrismaModel = never> = {
    equals?: $Enums.PipelineStage | EnumPipelineStageFieldRefInput<$PrismaModel>
    in?: $Enums.PipelineStage[] | ListEnumPipelineStageFieldRefInput<$PrismaModel>
    notIn?: $Enums.PipelineStage[] | ListEnumPipelineStageFieldRefInput<$PrismaModel>
    not?: NestedEnumPipelineStageFilter<$PrismaModel> | $Enums.PipelineStage
  }

  export type EnumPipelineStateFilter<$PrismaModel = never> = {
    equals?: $Enums.PipelineState | EnumPipelineStateFieldRefInput<$PrismaModel>
    in?: $Enums.PipelineState[] | ListEnumPipelineStateFieldRefInput<$PrismaModel>
    notIn?: $Enums.PipelineState[] | ListEnumPipelineStateFieldRefInput<$PrismaModel>
    not?: NestedEnumPipelineStateFilter<$PrismaModel> | $Enums.PipelineState
  }

  export type ContactScalarRelationFilter = {
    is?: ContactWhereInput
    isNot?: ContactWhereInput
  }

  export type PipelineJobListRelationFilter = {
    every?: PipelineJobWhereInput
    some?: PipelineJobWhereInput
    none?: PipelineJobWhereInput
  }

  export type PipelineJobOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LeadPipelineCountOrderByAggregateInput = {
    id?: SortOrder
    contactId?: SortOrder
    funnelOrigin?: SortOrder
    currentStage?: SortOrder
    currentState?: SortOrder
    scheduledJobId?: SortOrder
    scheduledJobDedupKey?: SortOrder
    videoWatched?: SortOrder
    utmSource?: SortOrder
    pixelFiredAt?: SortOrder
    painPoint?: SortOrder
    qualificationAnswers?: SortOrder
    meetingId?: SortOrder
    meetingTime?: SortOrder
    meetLink?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LeadPipelineMaxOrderByAggregateInput = {
    id?: SortOrder
    contactId?: SortOrder
    funnelOrigin?: SortOrder
    currentStage?: SortOrder
    currentState?: SortOrder
    scheduledJobId?: SortOrder
    scheduledJobDedupKey?: SortOrder
    videoWatched?: SortOrder
    utmSource?: SortOrder
    pixelFiredAt?: SortOrder
    painPoint?: SortOrder
    meetingId?: SortOrder
    meetingTime?: SortOrder
    meetLink?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LeadPipelineMinOrderByAggregateInput = {
    id?: SortOrder
    contactId?: SortOrder
    funnelOrigin?: SortOrder
    currentStage?: SortOrder
    currentState?: SortOrder
    scheduledJobId?: SortOrder
    scheduledJobDedupKey?: SortOrder
    videoWatched?: SortOrder
    utmSource?: SortOrder
    pixelFiredAt?: SortOrder
    painPoint?: SortOrder
    meetingId?: SortOrder
    meetingTime?: SortOrder
    meetLink?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumFunnelOriginWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FunnelOrigin | EnumFunnelOriginFieldRefInput<$PrismaModel>
    in?: $Enums.FunnelOrigin[] | ListEnumFunnelOriginFieldRefInput<$PrismaModel>
    notIn?: $Enums.FunnelOrigin[] | ListEnumFunnelOriginFieldRefInput<$PrismaModel>
    not?: NestedEnumFunnelOriginWithAggregatesFilter<$PrismaModel> | $Enums.FunnelOrigin
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFunnelOriginFilter<$PrismaModel>
    _max?: NestedEnumFunnelOriginFilter<$PrismaModel>
  }

  export type EnumPipelineStageWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PipelineStage | EnumPipelineStageFieldRefInput<$PrismaModel>
    in?: $Enums.PipelineStage[] | ListEnumPipelineStageFieldRefInput<$PrismaModel>
    notIn?: $Enums.PipelineStage[] | ListEnumPipelineStageFieldRefInput<$PrismaModel>
    not?: NestedEnumPipelineStageWithAggregatesFilter<$PrismaModel> | $Enums.PipelineStage
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPipelineStageFilter<$PrismaModel>
    _max?: NestedEnumPipelineStageFilter<$PrismaModel>
  }

  export type EnumPipelineStateWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PipelineState | EnumPipelineStateFieldRefInput<$PrismaModel>
    in?: $Enums.PipelineState[] | ListEnumPipelineStateFieldRefInput<$PrismaModel>
    notIn?: $Enums.PipelineState[] | ListEnumPipelineStateFieldRefInput<$PrismaModel>
    not?: NestedEnumPipelineStateWithAggregatesFilter<$PrismaModel> | $Enums.PipelineState
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPipelineStateFilter<$PrismaModel>
    _max?: NestedEnumPipelineStateFilter<$PrismaModel>
  }

  export type EnumConversationChannelFilter<$PrismaModel = never> = {
    equals?: $Enums.ConversationChannel | EnumConversationChannelFieldRefInput<$PrismaModel>
    in?: $Enums.ConversationChannel[] | ListEnumConversationChannelFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConversationChannel[] | ListEnumConversationChannelFieldRefInput<$PrismaModel>
    not?: NestedEnumConversationChannelFilter<$PrismaModel> | $Enums.ConversationChannel
  }

  export type ConversationMessageListRelationFilter = {
    every?: ConversationMessageWhereInput
    some?: ConversationMessageWhereInput
    none?: ConversationMessageWhereInput
  }

  export type ConversationMessageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ConversationContactIdChannelCompoundUniqueInput = {
    contactId: string
    channel: $Enums.ConversationChannel
  }

  export type ConversationCountOrderByAggregateInput = {
    id?: SortOrder
    contactId?: SortOrder
    channel?: SortOrder
    waPhoneNumberId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ConversationMaxOrderByAggregateInput = {
    id?: SortOrder
    contactId?: SortOrder
    channel?: SortOrder
    waPhoneNumberId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ConversationMinOrderByAggregateInput = {
    id?: SortOrder
    contactId?: SortOrder
    channel?: SortOrder
    waPhoneNumberId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumConversationChannelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ConversationChannel | EnumConversationChannelFieldRefInput<$PrismaModel>
    in?: $Enums.ConversationChannel[] | ListEnumConversationChannelFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConversationChannel[] | ListEnumConversationChannelFieldRefInput<$PrismaModel>
    not?: NestedEnumConversationChannelWithAggregatesFilter<$PrismaModel> | $Enums.ConversationChannel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumConversationChannelFilter<$PrismaModel>
    _max?: NestedEnumConversationChannelFilter<$PrismaModel>
  }

  export type EnumMessageDirectionFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageDirection | EnumMessageDirectionFieldRefInput<$PrismaModel>
    in?: $Enums.MessageDirection[] | ListEnumMessageDirectionFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageDirection[] | ListEnumMessageDirectionFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageDirectionFilter<$PrismaModel> | $Enums.MessageDirection
  }

  export type EnumMessageTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageType | EnumMessageTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MessageType[] | ListEnumMessageTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageType[] | ListEnumMessageTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageTypeFilter<$PrismaModel> | $Enums.MessageType
  }

  export type EnumPipelineStateNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.PipelineState | EnumPipelineStateFieldRefInput<$PrismaModel> | null
    in?: $Enums.PipelineState[] | ListEnumPipelineStateFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.PipelineState[] | ListEnumPipelineStateFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPipelineStateNullableFilter<$PrismaModel> | $Enums.PipelineState | null
  }

  export type EnumMessageStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageStatus | EnumMessageStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MessageStatus[] | ListEnumMessageStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageStatus[] | ListEnumMessageStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageStatusFilter<$PrismaModel> | $Enums.MessageStatus
  }

  export type ConversationScalarRelationFilter = {
    is?: ConversationWhereInput
    isNot?: ConversationWhereInput
  }

  export type ConversationMessageCountOrderByAggregateInput = {
    id?: SortOrder
    conversationId?: SortOrder
    direction?: SortOrder
    waMessageId?: SortOrder
    type?: SortOrder
    body?: SortOrder
    templateName?: SortOrder
    buttonId?: SortOrder
    rawPayload?: SortOrder
    pipelineState?: SortOrder
    status?: SortOrder
    mediaId?: SortOrder
    mimeType?: SortOrder
    mediaFilename?: SortOrder
    mediaUrl?: SortOrder
    caption?: SortOrder
    createdAt?: SortOrder
  }

  export type ConversationMessageMaxOrderByAggregateInput = {
    id?: SortOrder
    conversationId?: SortOrder
    direction?: SortOrder
    waMessageId?: SortOrder
    type?: SortOrder
    body?: SortOrder
    templateName?: SortOrder
    buttonId?: SortOrder
    pipelineState?: SortOrder
    status?: SortOrder
    mediaId?: SortOrder
    mimeType?: SortOrder
    mediaFilename?: SortOrder
    mediaUrl?: SortOrder
    caption?: SortOrder
    createdAt?: SortOrder
  }

  export type ConversationMessageMinOrderByAggregateInput = {
    id?: SortOrder
    conversationId?: SortOrder
    direction?: SortOrder
    waMessageId?: SortOrder
    type?: SortOrder
    body?: SortOrder
    templateName?: SortOrder
    buttonId?: SortOrder
    pipelineState?: SortOrder
    status?: SortOrder
    mediaId?: SortOrder
    mimeType?: SortOrder
    mediaFilename?: SortOrder
    mediaUrl?: SortOrder
    caption?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumMessageDirectionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageDirection | EnumMessageDirectionFieldRefInput<$PrismaModel>
    in?: $Enums.MessageDirection[] | ListEnumMessageDirectionFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageDirection[] | ListEnumMessageDirectionFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageDirectionWithAggregatesFilter<$PrismaModel> | $Enums.MessageDirection
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMessageDirectionFilter<$PrismaModel>
    _max?: NestedEnumMessageDirectionFilter<$PrismaModel>
  }

  export type EnumMessageTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageType | EnumMessageTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MessageType[] | ListEnumMessageTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageType[] | ListEnumMessageTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageTypeWithAggregatesFilter<$PrismaModel> | $Enums.MessageType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMessageTypeFilter<$PrismaModel>
    _max?: NestedEnumMessageTypeFilter<$PrismaModel>
  }

  export type EnumPipelineStateNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PipelineState | EnumPipelineStateFieldRefInput<$PrismaModel> | null
    in?: $Enums.PipelineState[] | ListEnumPipelineStateFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.PipelineState[] | ListEnumPipelineStateFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPipelineStateNullableWithAggregatesFilter<$PrismaModel> | $Enums.PipelineState | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumPipelineStateNullableFilter<$PrismaModel>
    _max?: NestedEnumPipelineStateNullableFilter<$PrismaModel>
  }

  export type EnumMessageStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageStatus | EnumMessageStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MessageStatus[] | ListEnumMessageStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageStatus[] | ListEnumMessageStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageStatusWithAggregatesFilter<$PrismaModel> | $Enums.MessageStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMessageStatusFilter<$PrismaModel>
    _max?: NestedEnumMessageStatusFilter<$PrismaModel>
  }

  export type EnumPipelineJobStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PipelineJobStatus | EnumPipelineJobStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PipelineJobStatus[] | ListEnumPipelineJobStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PipelineJobStatus[] | ListEnumPipelineJobStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPipelineJobStatusFilter<$PrismaModel> | $Enums.PipelineJobStatus
  }

  export type LeadPipelineScalarRelationFilter = {
    is?: LeadPipelineWhereInput
    isNot?: LeadPipelineWhereInput
  }

  export type PipelineJobCountOrderByAggregateInput = {
    id?: SortOrder
    pipelineId?: SortOrder
    dedupKey?: SortOrder
    expectedState?: SortOrder
    qstashMessageId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    executedAt?: SortOrder
  }

  export type PipelineJobMaxOrderByAggregateInput = {
    id?: SortOrder
    pipelineId?: SortOrder
    dedupKey?: SortOrder
    expectedState?: SortOrder
    qstashMessageId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    executedAt?: SortOrder
  }

  export type PipelineJobMinOrderByAggregateInput = {
    id?: SortOrder
    pipelineId?: SortOrder
    dedupKey?: SortOrder
    expectedState?: SortOrder
    qstashMessageId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    executedAt?: SortOrder
  }

  export type EnumPipelineJobStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PipelineJobStatus | EnumPipelineJobStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PipelineJobStatus[] | ListEnumPipelineJobStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PipelineJobStatus[] | ListEnumPipelineJobStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPipelineJobStatusWithAggregatesFilter<$PrismaModel> | $Enums.PipelineJobStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPipelineJobStatusFilter<$PrismaModel>
    _max?: NestedEnumPipelineJobStatusFilter<$PrismaModel>
  }

  export type FormSubmissionCreateNestedManyWithoutContactInput = {
    create?: XOR<FormSubmissionCreateWithoutContactInput, FormSubmissionUncheckedCreateWithoutContactInput> | FormSubmissionCreateWithoutContactInput[] | FormSubmissionUncheckedCreateWithoutContactInput[]
    connectOrCreate?: FormSubmissionCreateOrConnectWithoutContactInput | FormSubmissionCreateOrConnectWithoutContactInput[]
    createMany?: FormSubmissionCreateManyContactInputEnvelope
    connect?: FormSubmissionWhereUniqueInput | FormSubmissionWhereUniqueInput[]
  }

  export type LeadPipelineCreateNestedOneWithoutContactInput = {
    create?: XOR<LeadPipelineCreateWithoutContactInput, LeadPipelineUncheckedCreateWithoutContactInput>
    connectOrCreate?: LeadPipelineCreateOrConnectWithoutContactInput
    connect?: LeadPipelineWhereUniqueInput
  }

  export type ConversationCreateNestedManyWithoutContactInput = {
    create?: XOR<ConversationCreateWithoutContactInput, ConversationUncheckedCreateWithoutContactInput> | ConversationCreateWithoutContactInput[] | ConversationUncheckedCreateWithoutContactInput[]
    connectOrCreate?: ConversationCreateOrConnectWithoutContactInput | ConversationCreateOrConnectWithoutContactInput[]
    createMany?: ConversationCreateManyContactInputEnvelope
    connect?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
  }

  export type FormSubmissionUncheckedCreateNestedManyWithoutContactInput = {
    create?: XOR<FormSubmissionCreateWithoutContactInput, FormSubmissionUncheckedCreateWithoutContactInput> | FormSubmissionCreateWithoutContactInput[] | FormSubmissionUncheckedCreateWithoutContactInput[]
    connectOrCreate?: FormSubmissionCreateOrConnectWithoutContactInput | FormSubmissionCreateOrConnectWithoutContactInput[]
    createMany?: FormSubmissionCreateManyContactInputEnvelope
    connect?: FormSubmissionWhereUniqueInput | FormSubmissionWhereUniqueInput[]
  }

  export type LeadPipelineUncheckedCreateNestedOneWithoutContactInput = {
    create?: XOR<LeadPipelineCreateWithoutContactInput, LeadPipelineUncheckedCreateWithoutContactInput>
    connectOrCreate?: LeadPipelineCreateOrConnectWithoutContactInput
    connect?: LeadPipelineWhereUniqueInput
  }

  export type ConversationUncheckedCreateNestedManyWithoutContactInput = {
    create?: XOR<ConversationCreateWithoutContactInput, ConversationUncheckedCreateWithoutContactInput> | ConversationCreateWithoutContactInput[] | ConversationUncheckedCreateWithoutContactInput[]
    connectOrCreate?: ConversationCreateOrConnectWithoutContactInput | ConversationCreateOrConnectWithoutContactInput[]
    createMany?: ConversationCreateManyContactInputEnvelope
    connect?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type FormSubmissionUpdateManyWithoutContactNestedInput = {
    create?: XOR<FormSubmissionCreateWithoutContactInput, FormSubmissionUncheckedCreateWithoutContactInput> | FormSubmissionCreateWithoutContactInput[] | FormSubmissionUncheckedCreateWithoutContactInput[]
    connectOrCreate?: FormSubmissionCreateOrConnectWithoutContactInput | FormSubmissionCreateOrConnectWithoutContactInput[]
    upsert?: FormSubmissionUpsertWithWhereUniqueWithoutContactInput | FormSubmissionUpsertWithWhereUniqueWithoutContactInput[]
    createMany?: FormSubmissionCreateManyContactInputEnvelope
    set?: FormSubmissionWhereUniqueInput | FormSubmissionWhereUniqueInput[]
    disconnect?: FormSubmissionWhereUniqueInput | FormSubmissionWhereUniqueInput[]
    delete?: FormSubmissionWhereUniqueInput | FormSubmissionWhereUniqueInput[]
    connect?: FormSubmissionWhereUniqueInput | FormSubmissionWhereUniqueInput[]
    update?: FormSubmissionUpdateWithWhereUniqueWithoutContactInput | FormSubmissionUpdateWithWhereUniqueWithoutContactInput[]
    updateMany?: FormSubmissionUpdateManyWithWhereWithoutContactInput | FormSubmissionUpdateManyWithWhereWithoutContactInput[]
    deleteMany?: FormSubmissionScalarWhereInput | FormSubmissionScalarWhereInput[]
  }

  export type LeadPipelineUpdateOneWithoutContactNestedInput = {
    create?: XOR<LeadPipelineCreateWithoutContactInput, LeadPipelineUncheckedCreateWithoutContactInput>
    connectOrCreate?: LeadPipelineCreateOrConnectWithoutContactInput
    upsert?: LeadPipelineUpsertWithoutContactInput
    disconnect?: LeadPipelineWhereInput | boolean
    delete?: LeadPipelineWhereInput | boolean
    connect?: LeadPipelineWhereUniqueInput
    update?: XOR<XOR<LeadPipelineUpdateToOneWithWhereWithoutContactInput, LeadPipelineUpdateWithoutContactInput>, LeadPipelineUncheckedUpdateWithoutContactInput>
  }

  export type ConversationUpdateManyWithoutContactNestedInput = {
    create?: XOR<ConversationCreateWithoutContactInput, ConversationUncheckedCreateWithoutContactInput> | ConversationCreateWithoutContactInput[] | ConversationUncheckedCreateWithoutContactInput[]
    connectOrCreate?: ConversationCreateOrConnectWithoutContactInput | ConversationCreateOrConnectWithoutContactInput[]
    upsert?: ConversationUpsertWithWhereUniqueWithoutContactInput | ConversationUpsertWithWhereUniqueWithoutContactInput[]
    createMany?: ConversationCreateManyContactInputEnvelope
    set?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    disconnect?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    delete?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    connect?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    update?: ConversationUpdateWithWhereUniqueWithoutContactInput | ConversationUpdateWithWhereUniqueWithoutContactInput[]
    updateMany?: ConversationUpdateManyWithWhereWithoutContactInput | ConversationUpdateManyWithWhereWithoutContactInput[]
    deleteMany?: ConversationScalarWhereInput | ConversationScalarWhereInput[]
  }

  export type FormSubmissionUncheckedUpdateManyWithoutContactNestedInput = {
    create?: XOR<FormSubmissionCreateWithoutContactInput, FormSubmissionUncheckedCreateWithoutContactInput> | FormSubmissionCreateWithoutContactInput[] | FormSubmissionUncheckedCreateWithoutContactInput[]
    connectOrCreate?: FormSubmissionCreateOrConnectWithoutContactInput | FormSubmissionCreateOrConnectWithoutContactInput[]
    upsert?: FormSubmissionUpsertWithWhereUniqueWithoutContactInput | FormSubmissionUpsertWithWhereUniqueWithoutContactInput[]
    createMany?: FormSubmissionCreateManyContactInputEnvelope
    set?: FormSubmissionWhereUniqueInput | FormSubmissionWhereUniqueInput[]
    disconnect?: FormSubmissionWhereUniqueInput | FormSubmissionWhereUniqueInput[]
    delete?: FormSubmissionWhereUniqueInput | FormSubmissionWhereUniqueInput[]
    connect?: FormSubmissionWhereUniqueInput | FormSubmissionWhereUniqueInput[]
    update?: FormSubmissionUpdateWithWhereUniqueWithoutContactInput | FormSubmissionUpdateWithWhereUniqueWithoutContactInput[]
    updateMany?: FormSubmissionUpdateManyWithWhereWithoutContactInput | FormSubmissionUpdateManyWithWhereWithoutContactInput[]
    deleteMany?: FormSubmissionScalarWhereInput | FormSubmissionScalarWhereInput[]
  }

  export type LeadPipelineUncheckedUpdateOneWithoutContactNestedInput = {
    create?: XOR<LeadPipelineCreateWithoutContactInput, LeadPipelineUncheckedCreateWithoutContactInput>
    connectOrCreate?: LeadPipelineCreateOrConnectWithoutContactInput
    upsert?: LeadPipelineUpsertWithoutContactInput
    disconnect?: LeadPipelineWhereInput | boolean
    delete?: LeadPipelineWhereInput | boolean
    connect?: LeadPipelineWhereUniqueInput
    update?: XOR<XOR<LeadPipelineUpdateToOneWithWhereWithoutContactInput, LeadPipelineUpdateWithoutContactInput>, LeadPipelineUncheckedUpdateWithoutContactInput>
  }

  export type ConversationUncheckedUpdateManyWithoutContactNestedInput = {
    create?: XOR<ConversationCreateWithoutContactInput, ConversationUncheckedCreateWithoutContactInput> | ConversationCreateWithoutContactInput[] | ConversationUncheckedCreateWithoutContactInput[]
    connectOrCreate?: ConversationCreateOrConnectWithoutContactInput | ConversationCreateOrConnectWithoutContactInput[]
    upsert?: ConversationUpsertWithWhereUniqueWithoutContactInput | ConversationUpsertWithWhereUniqueWithoutContactInput[]
    createMany?: ConversationCreateManyContactInputEnvelope
    set?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    disconnect?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    delete?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    connect?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    update?: ConversationUpdateWithWhereUniqueWithoutContactInput | ConversationUpdateWithWhereUniqueWithoutContactInput[]
    updateMany?: ConversationUpdateManyWithWhereWithoutContactInput | ConversationUpdateManyWithWhereWithoutContactInput[]
    deleteMany?: ConversationScalarWhereInput | ConversationScalarWhereInput[]
  }

  export type ContactCreateNestedOneWithoutSubmissionsInput = {
    create?: XOR<ContactCreateWithoutSubmissionsInput, ContactUncheckedCreateWithoutSubmissionsInput>
    connectOrCreate?: ContactCreateOrConnectWithoutSubmissionsInput
    connect?: ContactWhereUniqueInput
  }

  export type LeadEventCreateNestedManyWithoutSubmissionInput = {
    create?: XOR<LeadEventCreateWithoutSubmissionInput, LeadEventUncheckedCreateWithoutSubmissionInput> | LeadEventCreateWithoutSubmissionInput[] | LeadEventUncheckedCreateWithoutSubmissionInput[]
    connectOrCreate?: LeadEventCreateOrConnectWithoutSubmissionInput | LeadEventCreateOrConnectWithoutSubmissionInput[]
    createMany?: LeadEventCreateManySubmissionInputEnvelope
    connect?: LeadEventWhereUniqueInput | LeadEventWhereUniqueInput[]
  }

  export type LeadEventUncheckedCreateNestedManyWithoutSubmissionInput = {
    create?: XOR<LeadEventCreateWithoutSubmissionInput, LeadEventUncheckedCreateWithoutSubmissionInput> | LeadEventCreateWithoutSubmissionInput[] | LeadEventUncheckedCreateWithoutSubmissionInput[]
    connectOrCreate?: LeadEventCreateOrConnectWithoutSubmissionInput | LeadEventCreateOrConnectWithoutSubmissionInput[]
    createMany?: LeadEventCreateManySubmissionInputEnvelope
    connect?: LeadEventWhereUniqueInput | LeadEventWhereUniqueInput[]
  }

  export type NullableEnumPmsUsageFieldUpdateOperationsInput = {
    set?: $Enums.PmsUsage | null
  }

  export type NullableEnumPropertyCountFieldUpdateOperationsInput = {
    set?: $Enums.PropertyCount | null
  }

  export type NullableEnumRevenueRangeFieldUpdateOperationsInput = {
    set?: $Enums.RevenueRange | null
  }

  export type NullableEnumYesNoFieldUpdateOperationsInput = {
    set?: $Enums.YesNo | null
  }

  export type NullableEnumIndustryTimeFieldUpdateOperationsInput = {
    set?: $Enums.IndustryTime | null
  }

  export type NullableEnumLeadQualificationFieldUpdateOperationsInput = {
    set?: $Enums.LeadQualification | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableEnumDisqualificationReasonFieldUpdateOperationsInput = {
    set?: $Enums.DisqualificationReason | null
  }

  export type EnumLeadEntrySourceFieldUpdateOperationsInput = {
    set?: $Enums.LeadEntrySource
  }

  export type NullableEnumBookingFlowFieldUpdateOperationsInput = {
    set?: $Enums.BookingFlow | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type EnumSubmissionStatusFieldUpdateOperationsInput = {
    set?: $Enums.SubmissionStatus
  }

  export type NullableEnumMarketingFunnelStageFieldUpdateOperationsInput = {
    set?: $Enums.MarketingFunnelStage | null
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type NullableEnumContractPlanFieldUpdateOperationsInput = {
    set?: $Enums.ContractPlan | null
  }

  export type ContactUpdateOneWithoutSubmissionsNestedInput = {
    create?: XOR<ContactCreateWithoutSubmissionsInput, ContactUncheckedCreateWithoutSubmissionsInput>
    connectOrCreate?: ContactCreateOrConnectWithoutSubmissionsInput
    upsert?: ContactUpsertWithoutSubmissionsInput
    disconnect?: ContactWhereInput | boolean
    delete?: ContactWhereInput | boolean
    connect?: ContactWhereUniqueInput
    update?: XOR<XOR<ContactUpdateToOneWithWhereWithoutSubmissionsInput, ContactUpdateWithoutSubmissionsInput>, ContactUncheckedUpdateWithoutSubmissionsInput>
  }

  export type LeadEventUpdateManyWithoutSubmissionNestedInput = {
    create?: XOR<LeadEventCreateWithoutSubmissionInput, LeadEventUncheckedCreateWithoutSubmissionInput> | LeadEventCreateWithoutSubmissionInput[] | LeadEventUncheckedCreateWithoutSubmissionInput[]
    connectOrCreate?: LeadEventCreateOrConnectWithoutSubmissionInput | LeadEventCreateOrConnectWithoutSubmissionInput[]
    upsert?: LeadEventUpsertWithWhereUniqueWithoutSubmissionInput | LeadEventUpsertWithWhereUniqueWithoutSubmissionInput[]
    createMany?: LeadEventCreateManySubmissionInputEnvelope
    set?: LeadEventWhereUniqueInput | LeadEventWhereUniqueInput[]
    disconnect?: LeadEventWhereUniqueInput | LeadEventWhereUniqueInput[]
    delete?: LeadEventWhereUniqueInput | LeadEventWhereUniqueInput[]
    connect?: LeadEventWhereUniqueInput | LeadEventWhereUniqueInput[]
    update?: LeadEventUpdateWithWhereUniqueWithoutSubmissionInput | LeadEventUpdateWithWhereUniqueWithoutSubmissionInput[]
    updateMany?: LeadEventUpdateManyWithWhereWithoutSubmissionInput | LeadEventUpdateManyWithWhereWithoutSubmissionInput[]
    deleteMany?: LeadEventScalarWhereInput | LeadEventScalarWhereInput[]
  }

  export type LeadEventUncheckedUpdateManyWithoutSubmissionNestedInput = {
    create?: XOR<LeadEventCreateWithoutSubmissionInput, LeadEventUncheckedCreateWithoutSubmissionInput> | LeadEventCreateWithoutSubmissionInput[] | LeadEventUncheckedCreateWithoutSubmissionInput[]
    connectOrCreate?: LeadEventCreateOrConnectWithoutSubmissionInput | LeadEventCreateOrConnectWithoutSubmissionInput[]
    upsert?: LeadEventUpsertWithWhereUniqueWithoutSubmissionInput | LeadEventUpsertWithWhereUniqueWithoutSubmissionInput[]
    createMany?: LeadEventCreateManySubmissionInputEnvelope
    set?: LeadEventWhereUniqueInput | LeadEventWhereUniqueInput[]
    disconnect?: LeadEventWhereUniqueInput | LeadEventWhereUniqueInput[]
    delete?: LeadEventWhereUniqueInput | LeadEventWhereUniqueInput[]
    connect?: LeadEventWhereUniqueInput | LeadEventWhereUniqueInput[]
    update?: LeadEventUpdateWithWhereUniqueWithoutSubmissionInput | LeadEventUpdateWithWhereUniqueWithoutSubmissionInput[]
    updateMany?: LeadEventUpdateManyWithWhereWithoutSubmissionInput | LeadEventUpdateManyWithWhereWithoutSubmissionInput[]
    deleteMany?: LeadEventScalarWhereInput | LeadEventScalarWhereInput[]
  }

  export type FormSubmissionCreateNestedOneWithoutEventsInput = {
    create?: XOR<FormSubmissionCreateWithoutEventsInput, FormSubmissionUncheckedCreateWithoutEventsInput>
    connectOrCreate?: FormSubmissionCreateOrConnectWithoutEventsInput
    connect?: FormSubmissionWhereUniqueInput
  }

  export type EnumMarketingEventNameFieldUpdateOperationsInput = {
    set?: $Enums.MarketingEventName
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type FormSubmissionUpdateOneRequiredWithoutEventsNestedInput = {
    create?: XOR<FormSubmissionCreateWithoutEventsInput, FormSubmissionUncheckedCreateWithoutEventsInput>
    connectOrCreate?: FormSubmissionCreateOrConnectWithoutEventsInput
    upsert?: FormSubmissionUpsertWithoutEventsInput
    connect?: FormSubmissionWhereUniqueInput
    update?: XOR<XOR<FormSubmissionUpdateToOneWithWhereWithoutEventsInput, FormSubmissionUpdateWithoutEventsInput>, FormSubmissionUncheckedUpdateWithoutEventsInput>
  }

  export type NullableEnumVideoDropReasonFieldUpdateOperationsInput = {
    set?: $Enums.VideoDropReason | null
  }

  export type ContactCreateNestedOneWithoutPipelineInput = {
    create?: XOR<ContactCreateWithoutPipelineInput, ContactUncheckedCreateWithoutPipelineInput>
    connectOrCreate?: ContactCreateOrConnectWithoutPipelineInput
    connect?: ContactWhereUniqueInput
  }

  export type PipelineJobCreateNestedManyWithoutPipelineInput = {
    create?: XOR<PipelineJobCreateWithoutPipelineInput, PipelineJobUncheckedCreateWithoutPipelineInput> | PipelineJobCreateWithoutPipelineInput[] | PipelineJobUncheckedCreateWithoutPipelineInput[]
    connectOrCreate?: PipelineJobCreateOrConnectWithoutPipelineInput | PipelineJobCreateOrConnectWithoutPipelineInput[]
    createMany?: PipelineJobCreateManyPipelineInputEnvelope
    connect?: PipelineJobWhereUniqueInput | PipelineJobWhereUniqueInput[]
  }

  export type PipelineJobUncheckedCreateNestedManyWithoutPipelineInput = {
    create?: XOR<PipelineJobCreateWithoutPipelineInput, PipelineJobUncheckedCreateWithoutPipelineInput> | PipelineJobCreateWithoutPipelineInput[] | PipelineJobUncheckedCreateWithoutPipelineInput[]
    connectOrCreate?: PipelineJobCreateOrConnectWithoutPipelineInput | PipelineJobCreateOrConnectWithoutPipelineInput[]
    createMany?: PipelineJobCreateManyPipelineInputEnvelope
    connect?: PipelineJobWhereUniqueInput | PipelineJobWhereUniqueInput[]
  }

  export type EnumFunnelOriginFieldUpdateOperationsInput = {
    set?: $Enums.FunnelOrigin
  }

  export type EnumPipelineStageFieldUpdateOperationsInput = {
    set?: $Enums.PipelineStage
  }

  export type EnumPipelineStateFieldUpdateOperationsInput = {
    set?: $Enums.PipelineState
  }

  export type ContactUpdateOneRequiredWithoutPipelineNestedInput = {
    create?: XOR<ContactCreateWithoutPipelineInput, ContactUncheckedCreateWithoutPipelineInput>
    connectOrCreate?: ContactCreateOrConnectWithoutPipelineInput
    upsert?: ContactUpsertWithoutPipelineInput
    connect?: ContactWhereUniqueInput
    update?: XOR<XOR<ContactUpdateToOneWithWhereWithoutPipelineInput, ContactUpdateWithoutPipelineInput>, ContactUncheckedUpdateWithoutPipelineInput>
  }

  export type PipelineJobUpdateManyWithoutPipelineNestedInput = {
    create?: XOR<PipelineJobCreateWithoutPipelineInput, PipelineJobUncheckedCreateWithoutPipelineInput> | PipelineJobCreateWithoutPipelineInput[] | PipelineJobUncheckedCreateWithoutPipelineInput[]
    connectOrCreate?: PipelineJobCreateOrConnectWithoutPipelineInput | PipelineJobCreateOrConnectWithoutPipelineInput[]
    upsert?: PipelineJobUpsertWithWhereUniqueWithoutPipelineInput | PipelineJobUpsertWithWhereUniqueWithoutPipelineInput[]
    createMany?: PipelineJobCreateManyPipelineInputEnvelope
    set?: PipelineJobWhereUniqueInput | PipelineJobWhereUniqueInput[]
    disconnect?: PipelineJobWhereUniqueInput | PipelineJobWhereUniqueInput[]
    delete?: PipelineJobWhereUniqueInput | PipelineJobWhereUniqueInput[]
    connect?: PipelineJobWhereUniqueInput | PipelineJobWhereUniqueInput[]
    update?: PipelineJobUpdateWithWhereUniqueWithoutPipelineInput | PipelineJobUpdateWithWhereUniqueWithoutPipelineInput[]
    updateMany?: PipelineJobUpdateManyWithWhereWithoutPipelineInput | PipelineJobUpdateManyWithWhereWithoutPipelineInput[]
    deleteMany?: PipelineJobScalarWhereInput | PipelineJobScalarWhereInput[]
  }

  export type PipelineJobUncheckedUpdateManyWithoutPipelineNestedInput = {
    create?: XOR<PipelineJobCreateWithoutPipelineInput, PipelineJobUncheckedCreateWithoutPipelineInput> | PipelineJobCreateWithoutPipelineInput[] | PipelineJobUncheckedCreateWithoutPipelineInput[]
    connectOrCreate?: PipelineJobCreateOrConnectWithoutPipelineInput | PipelineJobCreateOrConnectWithoutPipelineInput[]
    upsert?: PipelineJobUpsertWithWhereUniqueWithoutPipelineInput | PipelineJobUpsertWithWhereUniqueWithoutPipelineInput[]
    createMany?: PipelineJobCreateManyPipelineInputEnvelope
    set?: PipelineJobWhereUniqueInput | PipelineJobWhereUniqueInput[]
    disconnect?: PipelineJobWhereUniqueInput | PipelineJobWhereUniqueInput[]
    delete?: PipelineJobWhereUniqueInput | PipelineJobWhereUniqueInput[]
    connect?: PipelineJobWhereUniqueInput | PipelineJobWhereUniqueInput[]
    update?: PipelineJobUpdateWithWhereUniqueWithoutPipelineInput | PipelineJobUpdateWithWhereUniqueWithoutPipelineInput[]
    updateMany?: PipelineJobUpdateManyWithWhereWithoutPipelineInput | PipelineJobUpdateManyWithWhereWithoutPipelineInput[]
    deleteMany?: PipelineJobScalarWhereInput | PipelineJobScalarWhereInput[]
  }

  export type ContactCreateNestedOneWithoutConversationsInput = {
    create?: XOR<ContactCreateWithoutConversationsInput, ContactUncheckedCreateWithoutConversationsInput>
    connectOrCreate?: ContactCreateOrConnectWithoutConversationsInput
    connect?: ContactWhereUniqueInput
  }

  export type ConversationMessageCreateNestedManyWithoutConversationInput = {
    create?: XOR<ConversationMessageCreateWithoutConversationInput, ConversationMessageUncheckedCreateWithoutConversationInput> | ConversationMessageCreateWithoutConversationInput[] | ConversationMessageUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: ConversationMessageCreateOrConnectWithoutConversationInput | ConversationMessageCreateOrConnectWithoutConversationInput[]
    createMany?: ConversationMessageCreateManyConversationInputEnvelope
    connect?: ConversationMessageWhereUniqueInput | ConversationMessageWhereUniqueInput[]
  }

  export type ConversationMessageUncheckedCreateNestedManyWithoutConversationInput = {
    create?: XOR<ConversationMessageCreateWithoutConversationInput, ConversationMessageUncheckedCreateWithoutConversationInput> | ConversationMessageCreateWithoutConversationInput[] | ConversationMessageUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: ConversationMessageCreateOrConnectWithoutConversationInput | ConversationMessageCreateOrConnectWithoutConversationInput[]
    createMany?: ConversationMessageCreateManyConversationInputEnvelope
    connect?: ConversationMessageWhereUniqueInput | ConversationMessageWhereUniqueInput[]
  }

  export type EnumConversationChannelFieldUpdateOperationsInput = {
    set?: $Enums.ConversationChannel
  }

  export type ContactUpdateOneRequiredWithoutConversationsNestedInput = {
    create?: XOR<ContactCreateWithoutConversationsInput, ContactUncheckedCreateWithoutConversationsInput>
    connectOrCreate?: ContactCreateOrConnectWithoutConversationsInput
    upsert?: ContactUpsertWithoutConversationsInput
    connect?: ContactWhereUniqueInput
    update?: XOR<XOR<ContactUpdateToOneWithWhereWithoutConversationsInput, ContactUpdateWithoutConversationsInput>, ContactUncheckedUpdateWithoutConversationsInput>
  }

  export type ConversationMessageUpdateManyWithoutConversationNestedInput = {
    create?: XOR<ConversationMessageCreateWithoutConversationInput, ConversationMessageUncheckedCreateWithoutConversationInput> | ConversationMessageCreateWithoutConversationInput[] | ConversationMessageUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: ConversationMessageCreateOrConnectWithoutConversationInput | ConversationMessageCreateOrConnectWithoutConversationInput[]
    upsert?: ConversationMessageUpsertWithWhereUniqueWithoutConversationInput | ConversationMessageUpsertWithWhereUniqueWithoutConversationInput[]
    createMany?: ConversationMessageCreateManyConversationInputEnvelope
    set?: ConversationMessageWhereUniqueInput | ConversationMessageWhereUniqueInput[]
    disconnect?: ConversationMessageWhereUniqueInput | ConversationMessageWhereUniqueInput[]
    delete?: ConversationMessageWhereUniqueInput | ConversationMessageWhereUniqueInput[]
    connect?: ConversationMessageWhereUniqueInput | ConversationMessageWhereUniqueInput[]
    update?: ConversationMessageUpdateWithWhereUniqueWithoutConversationInput | ConversationMessageUpdateWithWhereUniqueWithoutConversationInput[]
    updateMany?: ConversationMessageUpdateManyWithWhereWithoutConversationInput | ConversationMessageUpdateManyWithWhereWithoutConversationInput[]
    deleteMany?: ConversationMessageScalarWhereInput | ConversationMessageScalarWhereInput[]
  }

  export type ConversationMessageUncheckedUpdateManyWithoutConversationNestedInput = {
    create?: XOR<ConversationMessageCreateWithoutConversationInput, ConversationMessageUncheckedCreateWithoutConversationInput> | ConversationMessageCreateWithoutConversationInput[] | ConversationMessageUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: ConversationMessageCreateOrConnectWithoutConversationInput | ConversationMessageCreateOrConnectWithoutConversationInput[]
    upsert?: ConversationMessageUpsertWithWhereUniqueWithoutConversationInput | ConversationMessageUpsertWithWhereUniqueWithoutConversationInput[]
    createMany?: ConversationMessageCreateManyConversationInputEnvelope
    set?: ConversationMessageWhereUniqueInput | ConversationMessageWhereUniqueInput[]
    disconnect?: ConversationMessageWhereUniqueInput | ConversationMessageWhereUniqueInput[]
    delete?: ConversationMessageWhereUniqueInput | ConversationMessageWhereUniqueInput[]
    connect?: ConversationMessageWhereUniqueInput | ConversationMessageWhereUniqueInput[]
    update?: ConversationMessageUpdateWithWhereUniqueWithoutConversationInput | ConversationMessageUpdateWithWhereUniqueWithoutConversationInput[]
    updateMany?: ConversationMessageUpdateManyWithWhereWithoutConversationInput | ConversationMessageUpdateManyWithWhereWithoutConversationInput[]
    deleteMany?: ConversationMessageScalarWhereInput | ConversationMessageScalarWhereInput[]
  }

  export type ConversationCreateNestedOneWithoutMessagesInput = {
    create?: XOR<ConversationCreateWithoutMessagesInput, ConversationUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: ConversationCreateOrConnectWithoutMessagesInput
    connect?: ConversationWhereUniqueInput
  }

  export type EnumMessageDirectionFieldUpdateOperationsInput = {
    set?: $Enums.MessageDirection
  }

  export type EnumMessageTypeFieldUpdateOperationsInput = {
    set?: $Enums.MessageType
  }

  export type NullableEnumPipelineStateFieldUpdateOperationsInput = {
    set?: $Enums.PipelineState | null
  }

  export type EnumMessageStatusFieldUpdateOperationsInput = {
    set?: $Enums.MessageStatus
  }

  export type ConversationUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<ConversationCreateWithoutMessagesInput, ConversationUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: ConversationCreateOrConnectWithoutMessagesInput
    upsert?: ConversationUpsertWithoutMessagesInput
    connect?: ConversationWhereUniqueInput
    update?: XOR<XOR<ConversationUpdateToOneWithWhereWithoutMessagesInput, ConversationUpdateWithoutMessagesInput>, ConversationUncheckedUpdateWithoutMessagesInput>
  }

  export type LeadPipelineCreateNestedOneWithoutJobsInput = {
    create?: XOR<LeadPipelineCreateWithoutJobsInput, LeadPipelineUncheckedCreateWithoutJobsInput>
    connectOrCreate?: LeadPipelineCreateOrConnectWithoutJobsInput
    connect?: LeadPipelineWhereUniqueInput
  }

  export type EnumPipelineJobStatusFieldUpdateOperationsInput = {
    set?: $Enums.PipelineJobStatus
  }

  export type LeadPipelineUpdateOneRequiredWithoutJobsNestedInput = {
    create?: XOR<LeadPipelineCreateWithoutJobsInput, LeadPipelineUncheckedCreateWithoutJobsInput>
    connectOrCreate?: LeadPipelineCreateOrConnectWithoutJobsInput
    upsert?: LeadPipelineUpsertWithoutJobsInput
    connect?: LeadPipelineWhereUniqueInput
    update?: XOR<XOR<LeadPipelineUpdateToOneWithWhereWithoutJobsInput, LeadPipelineUpdateWithoutJobsInput>, LeadPipelineUncheckedUpdateWithoutJobsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumPmsUsageNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.PmsUsage | EnumPmsUsageFieldRefInput<$PrismaModel> | null
    in?: $Enums.PmsUsage[] | ListEnumPmsUsageFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.PmsUsage[] | ListEnumPmsUsageFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPmsUsageNullableFilter<$PrismaModel> | $Enums.PmsUsage | null
  }

  export type NestedEnumPropertyCountNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.PropertyCount | EnumPropertyCountFieldRefInput<$PrismaModel> | null
    in?: $Enums.PropertyCount[] | ListEnumPropertyCountFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.PropertyCount[] | ListEnumPropertyCountFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPropertyCountNullableFilter<$PrismaModel> | $Enums.PropertyCount | null
  }

  export type NestedEnumRevenueRangeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.RevenueRange | EnumRevenueRangeFieldRefInput<$PrismaModel> | null
    in?: $Enums.RevenueRange[] | ListEnumRevenueRangeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.RevenueRange[] | ListEnumRevenueRangeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumRevenueRangeNullableFilter<$PrismaModel> | $Enums.RevenueRange | null
  }

  export type NestedEnumYesNoNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.YesNo | EnumYesNoFieldRefInput<$PrismaModel> | null
    in?: $Enums.YesNo[] | ListEnumYesNoFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.YesNo[] | ListEnumYesNoFieldRefInput<$PrismaModel> | null
    not?: NestedEnumYesNoNullableFilter<$PrismaModel> | $Enums.YesNo | null
  }

  export type NestedEnumIndustryTimeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.IndustryTime | EnumIndustryTimeFieldRefInput<$PrismaModel> | null
    in?: $Enums.IndustryTime[] | ListEnumIndustryTimeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.IndustryTime[] | ListEnumIndustryTimeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumIndustryTimeNullableFilter<$PrismaModel> | $Enums.IndustryTime | null
  }

  export type NestedEnumLeadQualificationNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.LeadQualification | EnumLeadQualificationFieldRefInput<$PrismaModel> | null
    in?: $Enums.LeadQualification[] | ListEnumLeadQualificationFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.LeadQualification[] | ListEnumLeadQualificationFieldRefInput<$PrismaModel> | null
    not?: NestedEnumLeadQualificationNullableFilter<$PrismaModel> | $Enums.LeadQualification | null
  }

  export type NestedEnumDisqualificationReasonNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.DisqualificationReason | EnumDisqualificationReasonFieldRefInput<$PrismaModel> | null
    in?: $Enums.DisqualificationReason[] | ListEnumDisqualificationReasonFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.DisqualificationReason[] | ListEnumDisqualificationReasonFieldRefInput<$PrismaModel> | null
    not?: NestedEnumDisqualificationReasonNullableFilter<$PrismaModel> | $Enums.DisqualificationReason | null
  }

  export type NestedEnumLeadEntrySourceFilter<$PrismaModel = never> = {
    equals?: $Enums.LeadEntrySource | EnumLeadEntrySourceFieldRefInput<$PrismaModel>
    in?: $Enums.LeadEntrySource[] | ListEnumLeadEntrySourceFieldRefInput<$PrismaModel>
    notIn?: $Enums.LeadEntrySource[] | ListEnumLeadEntrySourceFieldRefInput<$PrismaModel>
    not?: NestedEnumLeadEntrySourceFilter<$PrismaModel> | $Enums.LeadEntrySource
  }

  export type NestedEnumBookingFlowNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingFlow | EnumBookingFlowFieldRefInput<$PrismaModel> | null
    in?: $Enums.BookingFlow[] | ListEnumBookingFlowFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.BookingFlow[] | ListEnumBookingFlowFieldRefInput<$PrismaModel> | null
    not?: NestedEnumBookingFlowNullableFilter<$PrismaModel> | $Enums.BookingFlow | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumSubmissionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SubmissionStatus | EnumSubmissionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SubmissionStatus[] | ListEnumSubmissionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubmissionStatus[] | ListEnumSubmissionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSubmissionStatusFilter<$PrismaModel> | $Enums.SubmissionStatus
  }

  export type NestedEnumMarketingFunnelStageNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.MarketingFunnelStage | EnumMarketingFunnelStageFieldRefInput<$PrismaModel> | null
    in?: $Enums.MarketingFunnelStage[] | ListEnumMarketingFunnelStageFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.MarketingFunnelStage[] | ListEnumMarketingFunnelStageFieldRefInput<$PrismaModel> | null
    not?: NestedEnumMarketingFunnelStageNullableFilter<$PrismaModel> | $Enums.MarketingFunnelStage | null
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedEnumContractPlanNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.ContractPlan | EnumContractPlanFieldRefInput<$PrismaModel> | null
    in?: $Enums.ContractPlan[] | ListEnumContractPlanFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.ContractPlan[] | ListEnumContractPlanFieldRefInput<$PrismaModel> | null
    not?: NestedEnumContractPlanNullableFilter<$PrismaModel> | $Enums.ContractPlan | null
  }

  export type NestedEnumPmsUsageNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PmsUsage | EnumPmsUsageFieldRefInput<$PrismaModel> | null
    in?: $Enums.PmsUsage[] | ListEnumPmsUsageFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.PmsUsage[] | ListEnumPmsUsageFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPmsUsageNullableWithAggregatesFilter<$PrismaModel> | $Enums.PmsUsage | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumPmsUsageNullableFilter<$PrismaModel>
    _max?: NestedEnumPmsUsageNullableFilter<$PrismaModel>
  }

  export type NestedEnumPropertyCountNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PropertyCount | EnumPropertyCountFieldRefInput<$PrismaModel> | null
    in?: $Enums.PropertyCount[] | ListEnumPropertyCountFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.PropertyCount[] | ListEnumPropertyCountFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPropertyCountNullableWithAggregatesFilter<$PrismaModel> | $Enums.PropertyCount | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumPropertyCountNullableFilter<$PrismaModel>
    _max?: NestedEnumPropertyCountNullableFilter<$PrismaModel>
  }

  export type NestedEnumRevenueRangeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RevenueRange | EnumRevenueRangeFieldRefInput<$PrismaModel> | null
    in?: $Enums.RevenueRange[] | ListEnumRevenueRangeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.RevenueRange[] | ListEnumRevenueRangeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumRevenueRangeNullableWithAggregatesFilter<$PrismaModel> | $Enums.RevenueRange | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumRevenueRangeNullableFilter<$PrismaModel>
    _max?: NestedEnumRevenueRangeNullableFilter<$PrismaModel>
  }

  export type NestedEnumYesNoNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.YesNo | EnumYesNoFieldRefInput<$PrismaModel> | null
    in?: $Enums.YesNo[] | ListEnumYesNoFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.YesNo[] | ListEnumYesNoFieldRefInput<$PrismaModel> | null
    not?: NestedEnumYesNoNullableWithAggregatesFilter<$PrismaModel> | $Enums.YesNo | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumYesNoNullableFilter<$PrismaModel>
    _max?: NestedEnumYesNoNullableFilter<$PrismaModel>
  }

  export type NestedEnumIndustryTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.IndustryTime | EnumIndustryTimeFieldRefInput<$PrismaModel> | null
    in?: $Enums.IndustryTime[] | ListEnumIndustryTimeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.IndustryTime[] | ListEnumIndustryTimeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumIndustryTimeNullableWithAggregatesFilter<$PrismaModel> | $Enums.IndustryTime | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumIndustryTimeNullableFilter<$PrismaModel>
    _max?: NestedEnumIndustryTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumLeadQualificationNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LeadQualification | EnumLeadQualificationFieldRefInput<$PrismaModel> | null
    in?: $Enums.LeadQualification[] | ListEnumLeadQualificationFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.LeadQualification[] | ListEnumLeadQualificationFieldRefInput<$PrismaModel> | null
    not?: NestedEnumLeadQualificationNullableWithAggregatesFilter<$PrismaModel> | $Enums.LeadQualification | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumLeadQualificationNullableFilter<$PrismaModel>
    _max?: NestedEnumLeadQualificationNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumDisqualificationReasonNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DisqualificationReason | EnumDisqualificationReasonFieldRefInput<$PrismaModel> | null
    in?: $Enums.DisqualificationReason[] | ListEnumDisqualificationReasonFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.DisqualificationReason[] | ListEnumDisqualificationReasonFieldRefInput<$PrismaModel> | null
    not?: NestedEnumDisqualificationReasonNullableWithAggregatesFilter<$PrismaModel> | $Enums.DisqualificationReason | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumDisqualificationReasonNullableFilter<$PrismaModel>
    _max?: NestedEnumDisqualificationReasonNullableFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumLeadEntrySourceWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LeadEntrySource | EnumLeadEntrySourceFieldRefInput<$PrismaModel>
    in?: $Enums.LeadEntrySource[] | ListEnumLeadEntrySourceFieldRefInput<$PrismaModel>
    notIn?: $Enums.LeadEntrySource[] | ListEnumLeadEntrySourceFieldRefInput<$PrismaModel>
    not?: NestedEnumLeadEntrySourceWithAggregatesFilter<$PrismaModel> | $Enums.LeadEntrySource
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLeadEntrySourceFilter<$PrismaModel>
    _max?: NestedEnumLeadEntrySourceFilter<$PrismaModel>
  }

  export type NestedEnumBookingFlowNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingFlow | EnumBookingFlowFieldRefInput<$PrismaModel> | null
    in?: $Enums.BookingFlow[] | ListEnumBookingFlowFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.BookingFlow[] | ListEnumBookingFlowFieldRefInput<$PrismaModel> | null
    not?: NestedEnumBookingFlowNullableWithAggregatesFilter<$PrismaModel> | $Enums.BookingFlow | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumBookingFlowNullableFilter<$PrismaModel>
    _max?: NestedEnumBookingFlowNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumSubmissionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SubmissionStatus | EnumSubmissionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SubmissionStatus[] | ListEnumSubmissionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubmissionStatus[] | ListEnumSubmissionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSubmissionStatusWithAggregatesFilter<$PrismaModel> | $Enums.SubmissionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSubmissionStatusFilter<$PrismaModel>
    _max?: NestedEnumSubmissionStatusFilter<$PrismaModel>
  }

  export type NestedEnumMarketingFunnelStageNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MarketingFunnelStage | EnumMarketingFunnelStageFieldRefInput<$PrismaModel> | null
    in?: $Enums.MarketingFunnelStage[] | ListEnumMarketingFunnelStageFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.MarketingFunnelStage[] | ListEnumMarketingFunnelStageFieldRefInput<$PrismaModel> | null
    not?: NestedEnumMarketingFunnelStageNullableWithAggregatesFilter<$PrismaModel> | $Enums.MarketingFunnelStage | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumMarketingFunnelStageNullableFilter<$PrismaModel>
    _max?: NestedEnumMarketingFunnelStageNullableFilter<$PrismaModel>
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type NestedEnumContractPlanNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ContractPlan | EnumContractPlanFieldRefInput<$PrismaModel> | null
    in?: $Enums.ContractPlan[] | ListEnumContractPlanFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.ContractPlan[] | ListEnumContractPlanFieldRefInput<$PrismaModel> | null
    not?: NestedEnumContractPlanNullableWithAggregatesFilter<$PrismaModel> | $Enums.ContractPlan | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumContractPlanNullableFilter<$PrismaModel>
    _max?: NestedEnumContractPlanNullableFilter<$PrismaModel>
  }

  export type NestedEnumMarketingEventNameFilter<$PrismaModel = never> = {
    equals?: $Enums.MarketingEventName | EnumMarketingEventNameFieldRefInput<$PrismaModel>
    in?: $Enums.MarketingEventName[] | ListEnumMarketingEventNameFieldRefInput<$PrismaModel>
    notIn?: $Enums.MarketingEventName[] | ListEnumMarketingEventNameFieldRefInput<$PrismaModel>
    not?: NestedEnumMarketingEventNameFilter<$PrismaModel> | $Enums.MarketingEventName
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumMarketingEventNameWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MarketingEventName | EnumMarketingEventNameFieldRefInput<$PrismaModel>
    in?: $Enums.MarketingEventName[] | ListEnumMarketingEventNameFieldRefInput<$PrismaModel>
    notIn?: $Enums.MarketingEventName[] | ListEnumMarketingEventNameFieldRefInput<$PrismaModel>
    not?: NestedEnumMarketingEventNameWithAggregatesFilter<$PrismaModel> | $Enums.MarketingEventName
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMarketingEventNameFilter<$PrismaModel>
    _max?: NestedEnumMarketingEventNameFilter<$PrismaModel>
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumVideoDropReasonNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.VideoDropReason | EnumVideoDropReasonFieldRefInput<$PrismaModel> | null
    in?: $Enums.VideoDropReason[] | ListEnumVideoDropReasonFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.VideoDropReason[] | ListEnumVideoDropReasonFieldRefInput<$PrismaModel> | null
    not?: NestedEnumVideoDropReasonNullableFilter<$PrismaModel> | $Enums.VideoDropReason | null
  }

  export type NestedEnumVideoDropReasonNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.VideoDropReason | EnumVideoDropReasonFieldRefInput<$PrismaModel> | null
    in?: $Enums.VideoDropReason[] | ListEnumVideoDropReasonFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.VideoDropReason[] | ListEnumVideoDropReasonFieldRefInput<$PrismaModel> | null
    not?: NestedEnumVideoDropReasonNullableWithAggregatesFilter<$PrismaModel> | $Enums.VideoDropReason | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumVideoDropReasonNullableFilter<$PrismaModel>
    _max?: NestedEnumVideoDropReasonNullableFilter<$PrismaModel>
  }

  export type NestedEnumFunnelOriginFilter<$PrismaModel = never> = {
    equals?: $Enums.FunnelOrigin | EnumFunnelOriginFieldRefInput<$PrismaModel>
    in?: $Enums.FunnelOrigin[] | ListEnumFunnelOriginFieldRefInput<$PrismaModel>
    notIn?: $Enums.FunnelOrigin[] | ListEnumFunnelOriginFieldRefInput<$PrismaModel>
    not?: NestedEnumFunnelOriginFilter<$PrismaModel> | $Enums.FunnelOrigin
  }

  export type NestedEnumPipelineStageFilter<$PrismaModel = never> = {
    equals?: $Enums.PipelineStage | EnumPipelineStageFieldRefInput<$PrismaModel>
    in?: $Enums.PipelineStage[] | ListEnumPipelineStageFieldRefInput<$PrismaModel>
    notIn?: $Enums.PipelineStage[] | ListEnumPipelineStageFieldRefInput<$PrismaModel>
    not?: NestedEnumPipelineStageFilter<$PrismaModel> | $Enums.PipelineStage
  }

  export type NestedEnumPipelineStateFilter<$PrismaModel = never> = {
    equals?: $Enums.PipelineState | EnumPipelineStateFieldRefInput<$PrismaModel>
    in?: $Enums.PipelineState[] | ListEnumPipelineStateFieldRefInput<$PrismaModel>
    notIn?: $Enums.PipelineState[] | ListEnumPipelineStateFieldRefInput<$PrismaModel>
    not?: NestedEnumPipelineStateFilter<$PrismaModel> | $Enums.PipelineState
  }

  export type NestedEnumFunnelOriginWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FunnelOrigin | EnumFunnelOriginFieldRefInput<$PrismaModel>
    in?: $Enums.FunnelOrigin[] | ListEnumFunnelOriginFieldRefInput<$PrismaModel>
    notIn?: $Enums.FunnelOrigin[] | ListEnumFunnelOriginFieldRefInput<$PrismaModel>
    not?: NestedEnumFunnelOriginWithAggregatesFilter<$PrismaModel> | $Enums.FunnelOrigin
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFunnelOriginFilter<$PrismaModel>
    _max?: NestedEnumFunnelOriginFilter<$PrismaModel>
  }

  export type NestedEnumPipelineStageWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PipelineStage | EnumPipelineStageFieldRefInput<$PrismaModel>
    in?: $Enums.PipelineStage[] | ListEnumPipelineStageFieldRefInput<$PrismaModel>
    notIn?: $Enums.PipelineStage[] | ListEnumPipelineStageFieldRefInput<$PrismaModel>
    not?: NestedEnumPipelineStageWithAggregatesFilter<$PrismaModel> | $Enums.PipelineStage
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPipelineStageFilter<$PrismaModel>
    _max?: NestedEnumPipelineStageFilter<$PrismaModel>
  }

  export type NestedEnumPipelineStateWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PipelineState | EnumPipelineStateFieldRefInput<$PrismaModel>
    in?: $Enums.PipelineState[] | ListEnumPipelineStateFieldRefInput<$PrismaModel>
    notIn?: $Enums.PipelineState[] | ListEnumPipelineStateFieldRefInput<$PrismaModel>
    not?: NestedEnumPipelineStateWithAggregatesFilter<$PrismaModel> | $Enums.PipelineState
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPipelineStateFilter<$PrismaModel>
    _max?: NestedEnumPipelineStateFilter<$PrismaModel>
  }

  export type NestedEnumConversationChannelFilter<$PrismaModel = never> = {
    equals?: $Enums.ConversationChannel | EnumConversationChannelFieldRefInput<$PrismaModel>
    in?: $Enums.ConversationChannel[] | ListEnumConversationChannelFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConversationChannel[] | ListEnumConversationChannelFieldRefInput<$PrismaModel>
    not?: NestedEnumConversationChannelFilter<$PrismaModel> | $Enums.ConversationChannel
  }

  export type NestedEnumConversationChannelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ConversationChannel | EnumConversationChannelFieldRefInput<$PrismaModel>
    in?: $Enums.ConversationChannel[] | ListEnumConversationChannelFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConversationChannel[] | ListEnumConversationChannelFieldRefInput<$PrismaModel>
    not?: NestedEnumConversationChannelWithAggregatesFilter<$PrismaModel> | $Enums.ConversationChannel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumConversationChannelFilter<$PrismaModel>
    _max?: NestedEnumConversationChannelFilter<$PrismaModel>
  }

  export type NestedEnumMessageDirectionFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageDirection | EnumMessageDirectionFieldRefInput<$PrismaModel>
    in?: $Enums.MessageDirection[] | ListEnumMessageDirectionFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageDirection[] | ListEnumMessageDirectionFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageDirectionFilter<$PrismaModel> | $Enums.MessageDirection
  }

  export type NestedEnumMessageTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageType | EnumMessageTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MessageType[] | ListEnumMessageTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageType[] | ListEnumMessageTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageTypeFilter<$PrismaModel> | $Enums.MessageType
  }

  export type NestedEnumPipelineStateNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.PipelineState | EnumPipelineStateFieldRefInput<$PrismaModel> | null
    in?: $Enums.PipelineState[] | ListEnumPipelineStateFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.PipelineState[] | ListEnumPipelineStateFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPipelineStateNullableFilter<$PrismaModel> | $Enums.PipelineState | null
  }

  export type NestedEnumMessageStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageStatus | EnumMessageStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MessageStatus[] | ListEnumMessageStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageStatus[] | ListEnumMessageStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageStatusFilter<$PrismaModel> | $Enums.MessageStatus
  }

  export type NestedEnumMessageDirectionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageDirection | EnumMessageDirectionFieldRefInput<$PrismaModel>
    in?: $Enums.MessageDirection[] | ListEnumMessageDirectionFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageDirection[] | ListEnumMessageDirectionFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageDirectionWithAggregatesFilter<$PrismaModel> | $Enums.MessageDirection
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMessageDirectionFilter<$PrismaModel>
    _max?: NestedEnumMessageDirectionFilter<$PrismaModel>
  }

  export type NestedEnumMessageTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageType | EnumMessageTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MessageType[] | ListEnumMessageTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageType[] | ListEnumMessageTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageTypeWithAggregatesFilter<$PrismaModel> | $Enums.MessageType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMessageTypeFilter<$PrismaModel>
    _max?: NestedEnumMessageTypeFilter<$PrismaModel>
  }

  export type NestedEnumPipelineStateNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PipelineState | EnumPipelineStateFieldRefInput<$PrismaModel> | null
    in?: $Enums.PipelineState[] | ListEnumPipelineStateFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.PipelineState[] | ListEnumPipelineStateFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPipelineStateNullableWithAggregatesFilter<$PrismaModel> | $Enums.PipelineState | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumPipelineStateNullableFilter<$PrismaModel>
    _max?: NestedEnumPipelineStateNullableFilter<$PrismaModel>
  }

  export type NestedEnumMessageStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageStatus | EnumMessageStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MessageStatus[] | ListEnumMessageStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageStatus[] | ListEnumMessageStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageStatusWithAggregatesFilter<$PrismaModel> | $Enums.MessageStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMessageStatusFilter<$PrismaModel>
    _max?: NestedEnumMessageStatusFilter<$PrismaModel>
  }

  export type NestedEnumPipelineJobStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PipelineJobStatus | EnumPipelineJobStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PipelineJobStatus[] | ListEnumPipelineJobStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PipelineJobStatus[] | ListEnumPipelineJobStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPipelineJobStatusFilter<$PrismaModel> | $Enums.PipelineJobStatus
  }

  export type NestedEnumPipelineJobStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PipelineJobStatus | EnumPipelineJobStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PipelineJobStatus[] | ListEnumPipelineJobStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PipelineJobStatus[] | ListEnumPipelineJobStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPipelineJobStatusWithAggregatesFilter<$PrismaModel> | $Enums.PipelineJobStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPipelineJobStatusFilter<$PrismaModel>
    _max?: NestedEnumPipelineJobStatusFilter<$PrismaModel>
  }

  export type FormSubmissionCreateWithoutContactInput = {
    id?: string
    fullName?: string | null
    email?: string | null
    companyName?: string | null
    phoneCountryCode?: string | null
    phoneNumber?: string | null
    instagramUrl?: string | null
    websiteUrl?: string | null
    usesPms?: $Enums.PmsUsage | null
    propertyCount?: $Enums.PropertyCount | null
    revenueRange?: $Enums.RevenueRange | null
    isTodero?: $Enums.YesNo | null
    usesAi?: $Enums.YesNo | null
    wantsToScale?: $Enums.YesNo | null
    industryTime?: $Enums.IndustryTime | null
    pdfToken: string
    qualification?: $Enums.LeadQualification | null
    qualificationScore?: number | null
    disqualificationReason?: $Enums.DisqualificationReason | null
    scoreBreakdown?: NullableJsonNullValueInput | InputJsonValue
    entrySource?: $Enums.LeadEntrySource
    bookingFlow?: $Enums.BookingFlow | null
    bookedAt?: Date | string | null
    status?: $Enums.SubmissionStatus
    fbclid?: string | null
    fbp?: string | null
    fbc?: string | null
    utmSource?: string | null
    utmMedium?: string | null
    utmCampaign?: string | null
    utmContent?: string | null
    utmTerm?: string | null
    landingPath?: string | null
    referrer?: string | null
    marketingFunnelStage?: $Enums.MarketingFunnelStage | null
    contractValueUsd?: Decimal | DecimalJsLike | number | string | null
    contractPlan?: $Enums.ContractPlan | null
    createdAt?: Date | string
    updatedAt?: Date | string
    events?: LeadEventCreateNestedManyWithoutSubmissionInput
  }

  export type FormSubmissionUncheckedCreateWithoutContactInput = {
    id?: string
    fullName?: string | null
    email?: string | null
    companyName?: string | null
    phoneCountryCode?: string | null
    phoneNumber?: string | null
    instagramUrl?: string | null
    websiteUrl?: string | null
    usesPms?: $Enums.PmsUsage | null
    propertyCount?: $Enums.PropertyCount | null
    revenueRange?: $Enums.RevenueRange | null
    isTodero?: $Enums.YesNo | null
    usesAi?: $Enums.YesNo | null
    wantsToScale?: $Enums.YesNo | null
    industryTime?: $Enums.IndustryTime | null
    pdfToken: string
    qualification?: $Enums.LeadQualification | null
    qualificationScore?: number | null
    disqualificationReason?: $Enums.DisqualificationReason | null
    scoreBreakdown?: NullableJsonNullValueInput | InputJsonValue
    entrySource?: $Enums.LeadEntrySource
    bookingFlow?: $Enums.BookingFlow | null
    bookedAt?: Date | string | null
    status?: $Enums.SubmissionStatus
    fbclid?: string | null
    fbp?: string | null
    fbc?: string | null
    utmSource?: string | null
    utmMedium?: string | null
    utmCampaign?: string | null
    utmContent?: string | null
    utmTerm?: string | null
    landingPath?: string | null
    referrer?: string | null
    marketingFunnelStage?: $Enums.MarketingFunnelStage | null
    contractValueUsd?: Decimal | DecimalJsLike | number | string | null
    contractPlan?: $Enums.ContractPlan | null
    createdAt?: Date | string
    updatedAt?: Date | string
    events?: LeadEventUncheckedCreateNestedManyWithoutSubmissionInput
  }

  export type FormSubmissionCreateOrConnectWithoutContactInput = {
    where: FormSubmissionWhereUniqueInput
    create: XOR<FormSubmissionCreateWithoutContactInput, FormSubmissionUncheckedCreateWithoutContactInput>
  }

  export type FormSubmissionCreateManyContactInputEnvelope = {
    data: FormSubmissionCreateManyContactInput | FormSubmissionCreateManyContactInput[]
    skipDuplicates?: boolean
  }

  export type LeadPipelineCreateWithoutContactInput = {
    id?: string
    funnelOrigin: $Enums.FunnelOrigin
    currentStage: $Enums.PipelineStage
    currentState: $Enums.PipelineState
    scheduledJobId?: string | null
    scheduledJobDedupKey?: string | null
    videoWatched?: boolean
    utmSource?: string | null
    pixelFiredAt?: Date | string | null
    painPoint?: string | null
    qualificationAnswers?: NullableJsonNullValueInput | InputJsonValue
    meetingId?: string | null
    meetingTime?: Date | string | null
    meetLink?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    jobs?: PipelineJobCreateNestedManyWithoutPipelineInput
  }

  export type LeadPipelineUncheckedCreateWithoutContactInput = {
    id?: string
    funnelOrigin: $Enums.FunnelOrigin
    currentStage: $Enums.PipelineStage
    currentState: $Enums.PipelineState
    scheduledJobId?: string | null
    scheduledJobDedupKey?: string | null
    videoWatched?: boolean
    utmSource?: string | null
    pixelFiredAt?: Date | string | null
    painPoint?: string | null
    qualificationAnswers?: NullableJsonNullValueInput | InputJsonValue
    meetingId?: string | null
    meetingTime?: Date | string | null
    meetLink?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    jobs?: PipelineJobUncheckedCreateNestedManyWithoutPipelineInput
  }

  export type LeadPipelineCreateOrConnectWithoutContactInput = {
    where: LeadPipelineWhereUniqueInput
    create: XOR<LeadPipelineCreateWithoutContactInput, LeadPipelineUncheckedCreateWithoutContactInput>
  }

  export type ConversationCreateWithoutContactInput = {
    id?: string
    channel?: $Enums.ConversationChannel
    waPhoneNumberId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: ConversationMessageCreateNestedManyWithoutConversationInput
  }

  export type ConversationUncheckedCreateWithoutContactInput = {
    id?: string
    channel?: $Enums.ConversationChannel
    waPhoneNumberId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: ConversationMessageUncheckedCreateNestedManyWithoutConversationInput
  }

  export type ConversationCreateOrConnectWithoutContactInput = {
    where: ConversationWhereUniqueInput
    create: XOR<ConversationCreateWithoutContactInput, ConversationUncheckedCreateWithoutContactInput>
  }

  export type ConversationCreateManyContactInputEnvelope = {
    data: ConversationCreateManyContactInput | ConversationCreateManyContactInput[]
    skipDuplicates?: boolean
  }

  export type FormSubmissionUpsertWithWhereUniqueWithoutContactInput = {
    where: FormSubmissionWhereUniqueInput
    update: XOR<FormSubmissionUpdateWithoutContactInput, FormSubmissionUncheckedUpdateWithoutContactInput>
    create: XOR<FormSubmissionCreateWithoutContactInput, FormSubmissionUncheckedCreateWithoutContactInput>
  }

  export type FormSubmissionUpdateWithWhereUniqueWithoutContactInput = {
    where: FormSubmissionWhereUniqueInput
    data: XOR<FormSubmissionUpdateWithoutContactInput, FormSubmissionUncheckedUpdateWithoutContactInput>
  }

  export type FormSubmissionUpdateManyWithWhereWithoutContactInput = {
    where: FormSubmissionScalarWhereInput
    data: XOR<FormSubmissionUpdateManyMutationInput, FormSubmissionUncheckedUpdateManyWithoutContactInput>
  }

  export type FormSubmissionScalarWhereInput = {
    AND?: FormSubmissionScalarWhereInput | FormSubmissionScalarWhereInput[]
    OR?: FormSubmissionScalarWhereInput[]
    NOT?: FormSubmissionScalarWhereInput | FormSubmissionScalarWhereInput[]
    id?: StringFilter<"FormSubmission"> | string
    fullName?: StringNullableFilter<"FormSubmission"> | string | null
    email?: StringNullableFilter<"FormSubmission"> | string | null
    companyName?: StringNullableFilter<"FormSubmission"> | string | null
    phoneCountryCode?: StringNullableFilter<"FormSubmission"> | string | null
    phoneNumber?: StringNullableFilter<"FormSubmission"> | string | null
    instagramUrl?: StringNullableFilter<"FormSubmission"> | string | null
    websiteUrl?: StringNullableFilter<"FormSubmission"> | string | null
    usesPms?: EnumPmsUsageNullableFilter<"FormSubmission"> | $Enums.PmsUsage | null
    propertyCount?: EnumPropertyCountNullableFilter<"FormSubmission"> | $Enums.PropertyCount | null
    revenueRange?: EnumRevenueRangeNullableFilter<"FormSubmission"> | $Enums.RevenueRange | null
    isTodero?: EnumYesNoNullableFilter<"FormSubmission"> | $Enums.YesNo | null
    usesAi?: EnumYesNoNullableFilter<"FormSubmission"> | $Enums.YesNo | null
    wantsToScale?: EnumYesNoNullableFilter<"FormSubmission"> | $Enums.YesNo | null
    industryTime?: EnumIndustryTimeNullableFilter<"FormSubmission"> | $Enums.IndustryTime | null
    pdfToken?: StringFilter<"FormSubmission"> | string
    qualification?: EnumLeadQualificationNullableFilter<"FormSubmission"> | $Enums.LeadQualification | null
    qualificationScore?: IntNullableFilter<"FormSubmission"> | number | null
    disqualificationReason?: EnumDisqualificationReasonNullableFilter<"FormSubmission"> | $Enums.DisqualificationReason | null
    scoreBreakdown?: JsonNullableFilter<"FormSubmission">
    entrySource?: EnumLeadEntrySourceFilter<"FormSubmission"> | $Enums.LeadEntrySource
    bookingFlow?: EnumBookingFlowNullableFilter<"FormSubmission"> | $Enums.BookingFlow | null
    bookedAt?: DateTimeNullableFilter<"FormSubmission"> | Date | string | null
    status?: EnumSubmissionStatusFilter<"FormSubmission"> | $Enums.SubmissionStatus
    fbclid?: StringNullableFilter<"FormSubmission"> | string | null
    fbp?: StringNullableFilter<"FormSubmission"> | string | null
    fbc?: StringNullableFilter<"FormSubmission"> | string | null
    utmSource?: StringNullableFilter<"FormSubmission"> | string | null
    utmMedium?: StringNullableFilter<"FormSubmission"> | string | null
    utmCampaign?: StringNullableFilter<"FormSubmission"> | string | null
    utmContent?: StringNullableFilter<"FormSubmission"> | string | null
    utmTerm?: StringNullableFilter<"FormSubmission"> | string | null
    landingPath?: StringNullableFilter<"FormSubmission"> | string | null
    referrer?: StringNullableFilter<"FormSubmission"> | string | null
    marketingFunnelStage?: EnumMarketingFunnelStageNullableFilter<"FormSubmission"> | $Enums.MarketingFunnelStage | null
    contractValueUsd?: DecimalNullableFilter<"FormSubmission"> | Decimal | DecimalJsLike | number | string | null
    contractPlan?: EnumContractPlanNullableFilter<"FormSubmission"> | $Enums.ContractPlan | null
    createdAt?: DateTimeFilter<"FormSubmission"> | Date | string
    updatedAt?: DateTimeFilter<"FormSubmission"> | Date | string
    contactId?: StringNullableFilter<"FormSubmission"> | string | null
  }

  export type LeadPipelineUpsertWithoutContactInput = {
    update: XOR<LeadPipelineUpdateWithoutContactInput, LeadPipelineUncheckedUpdateWithoutContactInput>
    create: XOR<LeadPipelineCreateWithoutContactInput, LeadPipelineUncheckedCreateWithoutContactInput>
    where?: LeadPipelineWhereInput
  }

  export type LeadPipelineUpdateToOneWithWhereWithoutContactInput = {
    where?: LeadPipelineWhereInput
    data: XOR<LeadPipelineUpdateWithoutContactInput, LeadPipelineUncheckedUpdateWithoutContactInput>
  }

  export type LeadPipelineUpdateWithoutContactInput = {
    id?: StringFieldUpdateOperationsInput | string
    funnelOrigin?: EnumFunnelOriginFieldUpdateOperationsInput | $Enums.FunnelOrigin
    currentStage?: EnumPipelineStageFieldUpdateOperationsInput | $Enums.PipelineStage
    currentState?: EnumPipelineStateFieldUpdateOperationsInput | $Enums.PipelineState
    scheduledJobId?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledJobDedupKey?: NullableStringFieldUpdateOperationsInput | string | null
    videoWatched?: BoolFieldUpdateOperationsInput | boolean
    utmSource?: NullableStringFieldUpdateOperationsInput | string | null
    pixelFiredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    painPoint?: NullableStringFieldUpdateOperationsInput | string | null
    qualificationAnswers?: NullableJsonNullValueInput | InputJsonValue
    meetingId?: NullableStringFieldUpdateOperationsInput | string | null
    meetingTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    meetLink?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    jobs?: PipelineJobUpdateManyWithoutPipelineNestedInput
  }

  export type LeadPipelineUncheckedUpdateWithoutContactInput = {
    id?: StringFieldUpdateOperationsInput | string
    funnelOrigin?: EnumFunnelOriginFieldUpdateOperationsInput | $Enums.FunnelOrigin
    currentStage?: EnumPipelineStageFieldUpdateOperationsInput | $Enums.PipelineStage
    currentState?: EnumPipelineStateFieldUpdateOperationsInput | $Enums.PipelineState
    scheduledJobId?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledJobDedupKey?: NullableStringFieldUpdateOperationsInput | string | null
    videoWatched?: BoolFieldUpdateOperationsInput | boolean
    utmSource?: NullableStringFieldUpdateOperationsInput | string | null
    pixelFiredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    painPoint?: NullableStringFieldUpdateOperationsInput | string | null
    qualificationAnswers?: NullableJsonNullValueInput | InputJsonValue
    meetingId?: NullableStringFieldUpdateOperationsInput | string | null
    meetingTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    meetLink?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    jobs?: PipelineJobUncheckedUpdateManyWithoutPipelineNestedInput
  }

  export type ConversationUpsertWithWhereUniqueWithoutContactInput = {
    where: ConversationWhereUniqueInput
    update: XOR<ConversationUpdateWithoutContactInput, ConversationUncheckedUpdateWithoutContactInput>
    create: XOR<ConversationCreateWithoutContactInput, ConversationUncheckedCreateWithoutContactInput>
  }

  export type ConversationUpdateWithWhereUniqueWithoutContactInput = {
    where: ConversationWhereUniqueInput
    data: XOR<ConversationUpdateWithoutContactInput, ConversationUncheckedUpdateWithoutContactInput>
  }

  export type ConversationUpdateManyWithWhereWithoutContactInput = {
    where: ConversationScalarWhereInput
    data: XOR<ConversationUpdateManyMutationInput, ConversationUncheckedUpdateManyWithoutContactInput>
  }

  export type ConversationScalarWhereInput = {
    AND?: ConversationScalarWhereInput | ConversationScalarWhereInput[]
    OR?: ConversationScalarWhereInput[]
    NOT?: ConversationScalarWhereInput | ConversationScalarWhereInput[]
    id?: StringFilter<"Conversation"> | string
    contactId?: StringFilter<"Conversation"> | string
    channel?: EnumConversationChannelFilter<"Conversation"> | $Enums.ConversationChannel
    waPhoneNumberId?: StringNullableFilter<"Conversation"> | string | null
    createdAt?: DateTimeFilter<"Conversation"> | Date | string
    updatedAt?: DateTimeFilter<"Conversation"> | Date | string
  }

  export type ContactCreateWithoutSubmissionsInput = {
    id?: string
    fullName: string
    email?: string | null
    phoneE164: string
    waId?: string | null
    phoneCountryCode: string
    phoneNumber: string
    companyName?: string | null
    websiteUrl?: string | null
    instagramUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    pipeline?: LeadPipelineCreateNestedOneWithoutContactInput
    conversations?: ConversationCreateNestedManyWithoutContactInput
  }

  export type ContactUncheckedCreateWithoutSubmissionsInput = {
    id?: string
    fullName: string
    email?: string | null
    phoneE164: string
    waId?: string | null
    phoneCountryCode: string
    phoneNumber: string
    companyName?: string | null
    websiteUrl?: string | null
    instagramUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    pipeline?: LeadPipelineUncheckedCreateNestedOneWithoutContactInput
    conversations?: ConversationUncheckedCreateNestedManyWithoutContactInput
  }

  export type ContactCreateOrConnectWithoutSubmissionsInput = {
    where: ContactWhereUniqueInput
    create: XOR<ContactCreateWithoutSubmissionsInput, ContactUncheckedCreateWithoutSubmissionsInput>
  }

  export type LeadEventCreateWithoutSubmissionInput = {
    id: string
    eventName: $Enums.MarketingEventName
    eventTime?: Date | string
    eventSourceUrl?: string | null
    value: Decimal | DecimalJsLike | number | string
    currency?: string
    sentToMeta?: boolean
    metaResponse?: NullableJsonNullValueInput | InputJsonValue
    attemptCount?: number
    lastAttemptAt?: Date | string | null
    triggeredBy: string
    clientIp?: string | null
    clientUserAgent?: string | null
    createdAt?: Date | string
  }

  export type LeadEventUncheckedCreateWithoutSubmissionInput = {
    id: string
    eventName: $Enums.MarketingEventName
    eventTime?: Date | string
    eventSourceUrl?: string | null
    value: Decimal | DecimalJsLike | number | string
    currency?: string
    sentToMeta?: boolean
    metaResponse?: NullableJsonNullValueInput | InputJsonValue
    attemptCount?: number
    lastAttemptAt?: Date | string | null
    triggeredBy: string
    clientIp?: string | null
    clientUserAgent?: string | null
    createdAt?: Date | string
  }

  export type LeadEventCreateOrConnectWithoutSubmissionInput = {
    where: LeadEventWhereUniqueInput
    create: XOR<LeadEventCreateWithoutSubmissionInput, LeadEventUncheckedCreateWithoutSubmissionInput>
  }

  export type LeadEventCreateManySubmissionInputEnvelope = {
    data: LeadEventCreateManySubmissionInput | LeadEventCreateManySubmissionInput[]
    skipDuplicates?: boolean
  }

  export type ContactUpsertWithoutSubmissionsInput = {
    update: XOR<ContactUpdateWithoutSubmissionsInput, ContactUncheckedUpdateWithoutSubmissionsInput>
    create: XOR<ContactCreateWithoutSubmissionsInput, ContactUncheckedCreateWithoutSubmissionsInput>
    where?: ContactWhereInput
  }

  export type ContactUpdateToOneWithWhereWithoutSubmissionsInput = {
    where?: ContactWhereInput
    data: XOR<ContactUpdateWithoutSubmissionsInput, ContactUncheckedUpdateWithoutSubmissionsInput>
  }

  export type ContactUpdateWithoutSubmissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phoneE164?: StringFieldUpdateOperationsInput | string
    waId?: NullableStringFieldUpdateOperationsInput | string | null
    phoneCountryCode?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    instagramUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pipeline?: LeadPipelineUpdateOneWithoutContactNestedInput
    conversations?: ConversationUpdateManyWithoutContactNestedInput
  }

  export type ContactUncheckedUpdateWithoutSubmissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phoneE164?: StringFieldUpdateOperationsInput | string
    waId?: NullableStringFieldUpdateOperationsInput | string | null
    phoneCountryCode?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    instagramUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pipeline?: LeadPipelineUncheckedUpdateOneWithoutContactNestedInput
    conversations?: ConversationUncheckedUpdateManyWithoutContactNestedInput
  }

  export type LeadEventUpsertWithWhereUniqueWithoutSubmissionInput = {
    where: LeadEventWhereUniqueInput
    update: XOR<LeadEventUpdateWithoutSubmissionInput, LeadEventUncheckedUpdateWithoutSubmissionInput>
    create: XOR<LeadEventCreateWithoutSubmissionInput, LeadEventUncheckedCreateWithoutSubmissionInput>
  }

  export type LeadEventUpdateWithWhereUniqueWithoutSubmissionInput = {
    where: LeadEventWhereUniqueInput
    data: XOR<LeadEventUpdateWithoutSubmissionInput, LeadEventUncheckedUpdateWithoutSubmissionInput>
  }

  export type LeadEventUpdateManyWithWhereWithoutSubmissionInput = {
    where: LeadEventScalarWhereInput
    data: XOR<LeadEventUpdateManyMutationInput, LeadEventUncheckedUpdateManyWithoutSubmissionInput>
  }

  export type LeadEventScalarWhereInput = {
    AND?: LeadEventScalarWhereInput | LeadEventScalarWhereInput[]
    OR?: LeadEventScalarWhereInput[]
    NOT?: LeadEventScalarWhereInput | LeadEventScalarWhereInput[]
    id?: StringFilter<"LeadEvent"> | string
    submissionId?: StringFilter<"LeadEvent"> | string
    eventName?: EnumMarketingEventNameFilter<"LeadEvent"> | $Enums.MarketingEventName
    eventTime?: DateTimeFilter<"LeadEvent"> | Date | string
    eventSourceUrl?: StringNullableFilter<"LeadEvent"> | string | null
    value?: DecimalFilter<"LeadEvent"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"LeadEvent"> | string
    sentToMeta?: BoolFilter<"LeadEvent"> | boolean
    metaResponse?: JsonNullableFilter<"LeadEvent">
    attemptCount?: IntFilter<"LeadEvent"> | number
    lastAttemptAt?: DateTimeNullableFilter<"LeadEvent"> | Date | string | null
    triggeredBy?: StringFilter<"LeadEvent"> | string
    clientIp?: StringNullableFilter<"LeadEvent"> | string | null
    clientUserAgent?: StringNullableFilter<"LeadEvent"> | string | null
    createdAt?: DateTimeFilter<"LeadEvent"> | Date | string
  }

  export type FormSubmissionCreateWithoutEventsInput = {
    id?: string
    fullName?: string | null
    email?: string | null
    companyName?: string | null
    phoneCountryCode?: string | null
    phoneNumber?: string | null
    instagramUrl?: string | null
    websiteUrl?: string | null
    usesPms?: $Enums.PmsUsage | null
    propertyCount?: $Enums.PropertyCount | null
    revenueRange?: $Enums.RevenueRange | null
    isTodero?: $Enums.YesNo | null
    usesAi?: $Enums.YesNo | null
    wantsToScale?: $Enums.YesNo | null
    industryTime?: $Enums.IndustryTime | null
    pdfToken: string
    qualification?: $Enums.LeadQualification | null
    qualificationScore?: number | null
    disqualificationReason?: $Enums.DisqualificationReason | null
    scoreBreakdown?: NullableJsonNullValueInput | InputJsonValue
    entrySource?: $Enums.LeadEntrySource
    bookingFlow?: $Enums.BookingFlow | null
    bookedAt?: Date | string | null
    status?: $Enums.SubmissionStatus
    fbclid?: string | null
    fbp?: string | null
    fbc?: string | null
    utmSource?: string | null
    utmMedium?: string | null
    utmCampaign?: string | null
    utmContent?: string | null
    utmTerm?: string | null
    landingPath?: string | null
    referrer?: string | null
    marketingFunnelStage?: $Enums.MarketingFunnelStage | null
    contractValueUsd?: Decimal | DecimalJsLike | number | string | null
    contractPlan?: $Enums.ContractPlan | null
    createdAt?: Date | string
    updatedAt?: Date | string
    contact?: ContactCreateNestedOneWithoutSubmissionsInput
  }

  export type FormSubmissionUncheckedCreateWithoutEventsInput = {
    id?: string
    fullName?: string | null
    email?: string | null
    companyName?: string | null
    phoneCountryCode?: string | null
    phoneNumber?: string | null
    instagramUrl?: string | null
    websiteUrl?: string | null
    usesPms?: $Enums.PmsUsage | null
    propertyCount?: $Enums.PropertyCount | null
    revenueRange?: $Enums.RevenueRange | null
    isTodero?: $Enums.YesNo | null
    usesAi?: $Enums.YesNo | null
    wantsToScale?: $Enums.YesNo | null
    industryTime?: $Enums.IndustryTime | null
    pdfToken: string
    qualification?: $Enums.LeadQualification | null
    qualificationScore?: number | null
    disqualificationReason?: $Enums.DisqualificationReason | null
    scoreBreakdown?: NullableJsonNullValueInput | InputJsonValue
    entrySource?: $Enums.LeadEntrySource
    bookingFlow?: $Enums.BookingFlow | null
    bookedAt?: Date | string | null
    status?: $Enums.SubmissionStatus
    fbclid?: string | null
    fbp?: string | null
    fbc?: string | null
    utmSource?: string | null
    utmMedium?: string | null
    utmCampaign?: string | null
    utmContent?: string | null
    utmTerm?: string | null
    landingPath?: string | null
    referrer?: string | null
    marketingFunnelStage?: $Enums.MarketingFunnelStage | null
    contractValueUsd?: Decimal | DecimalJsLike | number | string | null
    contractPlan?: $Enums.ContractPlan | null
    createdAt?: Date | string
    updatedAt?: Date | string
    contactId?: string | null
  }

  export type FormSubmissionCreateOrConnectWithoutEventsInput = {
    where: FormSubmissionWhereUniqueInput
    create: XOR<FormSubmissionCreateWithoutEventsInput, FormSubmissionUncheckedCreateWithoutEventsInput>
  }

  export type FormSubmissionUpsertWithoutEventsInput = {
    update: XOR<FormSubmissionUpdateWithoutEventsInput, FormSubmissionUncheckedUpdateWithoutEventsInput>
    create: XOR<FormSubmissionCreateWithoutEventsInput, FormSubmissionUncheckedCreateWithoutEventsInput>
    where?: FormSubmissionWhereInput
  }

  export type FormSubmissionUpdateToOneWithWhereWithoutEventsInput = {
    where?: FormSubmissionWhereInput
    data: XOR<FormSubmissionUpdateWithoutEventsInput, FormSubmissionUncheckedUpdateWithoutEventsInput>
  }

  export type FormSubmissionUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    phoneCountryCode?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    instagramUrl?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    usesPms?: NullableEnumPmsUsageFieldUpdateOperationsInput | $Enums.PmsUsage | null
    propertyCount?: NullableEnumPropertyCountFieldUpdateOperationsInput | $Enums.PropertyCount | null
    revenueRange?: NullableEnumRevenueRangeFieldUpdateOperationsInput | $Enums.RevenueRange | null
    isTodero?: NullableEnumYesNoFieldUpdateOperationsInput | $Enums.YesNo | null
    usesAi?: NullableEnumYesNoFieldUpdateOperationsInput | $Enums.YesNo | null
    wantsToScale?: NullableEnumYesNoFieldUpdateOperationsInput | $Enums.YesNo | null
    industryTime?: NullableEnumIndustryTimeFieldUpdateOperationsInput | $Enums.IndustryTime | null
    pdfToken?: StringFieldUpdateOperationsInput | string
    qualification?: NullableEnumLeadQualificationFieldUpdateOperationsInput | $Enums.LeadQualification | null
    qualificationScore?: NullableIntFieldUpdateOperationsInput | number | null
    disqualificationReason?: NullableEnumDisqualificationReasonFieldUpdateOperationsInput | $Enums.DisqualificationReason | null
    scoreBreakdown?: NullableJsonNullValueInput | InputJsonValue
    entrySource?: EnumLeadEntrySourceFieldUpdateOperationsInput | $Enums.LeadEntrySource
    bookingFlow?: NullableEnumBookingFlowFieldUpdateOperationsInput | $Enums.BookingFlow | null
    bookedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumSubmissionStatusFieldUpdateOperationsInput | $Enums.SubmissionStatus
    fbclid?: NullableStringFieldUpdateOperationsInput | string | null
    fbp?: NullableStringFieldUpdateOperationsInput | string | null
    fbc?: NullableStringFieldUpdateOperationsInput | string | null
    utmSource?: NullableStringFieldUpdateOperationsInput | string | null
    utmMedium?: NullableStringFieldUpdateOperationsInput | string | null
    utmCampaign?: NullableStringFieldUpdateOperationsInput | string | null
    utmContent?: NullableStringFieldUpdateOperationsInput | string | null
    utmTerm?: NullableStringFieldUpdateOperationsInput | string | null
    landingPath?: NullableStringFieldUpdateOperationsInput | string | null
    referrer?: NullableStringFieldUpdateOperationsInput | string | null
    marketingFunnelStage?: NullableEnumMarketingFunnelStageFieldUpdateOperationsInput | $Enums.MarketingFunnelStage | null
    contractValueUsd?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    contractPlan?: NullableEnumContractPlanFieldUpdateOperationsInput | $Enums.ContractPlan | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    contact?: ContactUpdateOneWithoutSubmissionsNestedInput
  }

  export type FormSubmissionUncheckedUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    phoneCountryCode?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    instagramUrl?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    usesPms?: NullableEnumPmsUsageFieldUpdateOperationsInput | $Enums.PmsUsage | null
    propertyCount?: NullableEnumPropertyCountFieldUpdateOperationsInput | $Enums.PropertyCount | null
    revenueRange?: NullableEnumRevenueRangeFieldUpdateOperationsInput | $Enums.RevenueRange | null
    isTodero?: NullableEnumYesNoFieldUpdateOperationsInput | $Enums.YesNo | null
    usesAi?: NullableEnumYesNoFieldUpdateOperationsInput | $Enums.YesNo | null
    wantsToScale?: NullableEnumYesNoFieldUpdateOperationsInput | $Enums.YesNo | null
    industryTime?: NullableEnumIndustryTimeFieldUpdateOperationsInput | $Enums.IndustryTime | null
    pdfToken?: StringFieldUpdateOperationsInput | string
    qualification?: NullableEnumLeadQualificationFieldUpdateOperationsInput | $Enums.LeadQualification | null
    qualificationScore?: NullableIntFieldUpdateOperationsInput | number | null
    disqualificationReason?: NullableEnumDisqualificationReasonFieldUpdateOperationsInput | $Enums.DisqualificationReason | null
    scoreBreakdown?: NullableJsonNullValueInput | InputJsonValue
    entrySource?: EnumLeadEntrySourceFieldUpdateOperationsInput | $Enums.LeadEntrySource
    bookingFlow?: NullableEnumBookingFlowFieldUpdateOperationsInput | $Enums.BookingFlow | null
    bookedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumSubmissionStatusFieldUpdateOperationsInput | $Enums.SubmissionStatus
    fbclid?: NullableStringFieldUpdateOperationsInput | string | null
    fbp?: NullableStringFieldUpdateOperationsInput | string | null
    fbc?: NullableStringFieldUpdateOperationsInput | string | null
    utmSource?: NullableStringFieldUpdateOperationsInput | string | null
    utmMedium?: NullableStringFieldUpdateOperationsInput | string | null
    utmCampaign?: NullableStringFieldUpdateOperationsInput | string | null
    utmContent?: NullableStringFieldUpdateOperationsInput | string | null
    utmTerm?: NullableStringFieldUpdateOperationsInput | string | null
    landingPath?: NullableStringFieldUpdateOperationsInput | string | null
    referrer?: NullableStringFieldUpdateOperationsInput | string | null
    marketingFunnelStage?: NullableEnumMarketingFunnelStageFieldUpdateOperationsInput | $Enums.MarketingFunnelStage | null
    contractValueUsd?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    contractPlan?: NullableEnumContractPlanFieldUpdateOperationsInput | $Enums.ContractPlan | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    contactId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ContactCreateWithoutPipelineInput = {
    id?: string
    fullName: string
    email?: string | null
    phoneE164: string
    waId?: string | null
    phoneCountryCode: string
    phoneNumber: string
    companyName?: string | null
    websiteUrl?: string | null
    instagramUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    submissions?: FormSubmissionCreateNestedManyWithoutContactInput
    conversations?: ConversationCreateNestedManyWithoutContactInput
  }

  export type ContactUncheckedCreateWithoutPipelineInput = {
    id?: string
    fullName: string
    email?: string | null
    phoneE164: string
    waId?: string | null
    phoneCountryCode: string
    phoneNumber: string
    companyName?: string | null
    websiteUrl?: string | null
    instagramUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    submissions?: FormSubmissionUncheckedCreateNestedManyWithoutContactInput
    conversations?: ConversationUncheckedCreateNestedManyWithoutContactInput
  }

  export type ContactCreateOrConnectWithoutPipelineInput = {
    where: ContactWhereUniqueInput
    create: XOR<ContactCreateWithoutPipelineInput, ContactUncheckedCreateWithoutPipelineInput>
  }

  export type PipelineJobCreateWithoutPipelineInput = {
    id?: string
    dedupKey: string
    expectedState: $Enums.PipelineState
    qstashMessageId?: string | null
    status?: $Enums.PipelineJobStatus
    createdAt?: Date | string
    executedAt?: Date | string | null
  }

  export type PipelineJobUncheckedCreateWithoutPipelineInput = {
    id?: string
    dedupKey: string
    expectedState: $Enums.PipelineState
    qstashMessageId?: string | null
    status?: $Enums.PipelineJobStatus
    createdAt?: Date | string
    executedAt?: Date | string | null
  }

  export type PipelineJobCreateOrConnectWithoutPipelineInput = {
    where: PipelineJobWhereUniqueInput
    create: XOR<PipelineJobCreateWithoutPipelineInput, PipelineJobUncheckedCreateWithoutPipelineInput>
  }

  export type PipelineJobCreateManyPipelineInputEnvelope = {
    data: PipelineJobCreateManyPipelineInput | PipelineJobCreateManyPipelineInput[]
    skipDuplicates?: boolean
  }

  export type ContactUpsertWithoutPipelineInput = {
    update: XOR<ContactUpdateWithoutPipelineInput, ContactUncheckedUpdateWithoutPipelineInput>
    create: XOR<ContactCreateWithoutPipelineInput, ContactUncheckedCreateWithoutPipelineInput>
    where?: ContactWhereInput
  }

  export type ContactUpdateToOneWithWhereWithoutPipelineInput = {
    where?: ContactWhereInput
    data: XOR<ContactUpdateWithoutPipelineInput, ContactUncheckedUpdateWithoutPipelineInput>
  }

  export type ContactUpdateWithoutPipelineInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phoneE164?: StringFieldUpdateOperationsInput | string
    waId?: NullableStringFieldUpdateOperationsInput | string | null
    phoneCountryCode?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    instagramUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submissions?: FormSubmissionUpdateManyWithoutContactNestedInput
    conversations?: ConversationUpdateManyWithoutContactNestedInput
  }

  export type ContactUncheckedUpdateWithoutPipelineInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phoneE164?: StringFieldUpdateOperationsInput | string
    waId?: NullableStringFieldUpdateOperationsInput | string | null
    phoneCountryCode?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    instagramUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submissions?: FormSubmissionUncheckedUpdateManyWithoutContactNestedInput
    conversations?: ConversationUncheckedUpdateManyWithoutContactNestedInput
  }

  export type PipelineJobUpsertWithWhereUniqueWithoutPipelineInput = {
    where: PipelineJobWhereUniqueInput
    update: XOR<PipelineJobUpdateWithoutPipelineInput, PipelineJobUncheckedUpdateWithoutPipelineInput>
    create: XOR<PipelineJobCreateWithoutPipelineInput, PipelineJobUncheckedCreateWithoutPipelineInput>
  }

  export type PipelineJobUpdateWithWhereUniqueWithoutPipelineInput = {
    where: PipelineJobWhereUniqueInput
    data: XOR<PipelineJobUpdateWithoutPipelineInput, PipelineJobUncheckedUpdateWithoutPipelineInput>
  }

  export type PipelineJobUpdateManyWithWhereWithoutPipelineInput = {
    where: PipelineJobScalarWhereInput
    data: XOR<PipelineJobUpdateManyMutationInput, PipelineJobUncheckedUpdateManyWithoutPipelineInput>
  }

  export type PipelineJobScalarWhereInput = {
    AND?: PipelineJobScalarWhereInput | PipelineJobScalarWhereInput[]
    OR?: PipelineJobScalarWhereInput[]
    NOT?: PipelineJobScalarWhereInput | PipelineJobScalarWhereInput[]
    id?: StringFilter<"PipelineJob"> | string
    pipelineId?: StringFilter<"PipelineJob"> | string
    dedupKey?: StringFilter<"PipelineJob"> | string
    expectedState?: EnumPipelineStateFilter<"PipelineJob"> | $Enums.PipelineState
    qstashMessageId?: StringNullableFilter<"PipelineJob"> | string | null
    status?: EnumPipelineJobStatusFilter<"PipelineJob"> | $Enums.PipelineJobStatus
    createdAt?: DateTimeFilter<"PipelineJob"> | Date | string
    executedAt?: DateTimeNullableFilter<"PipelineJob"> | Date | string | null
  }

  export type ContactCreateWithoutConversationsInput = {
    id?: string
    fullName: string
    email?: string | null
    phoneE164: string
    waId?: string | null
    phoneCountryCode: string
    phoneNumber: string
    companyName?: string | null
    websiteUrl?: string | null
    instagramUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    submissions?: FormSubmissionCreateNestedManyWithoutContactInput
    pipeline?: LeadPipelineCreateNestedOneWithoutContactInput
  }

  export type ContactUncheckedCreateWithoutConversationsInput = {
    id?: string
    fullName: string
    email?: string | null
    phoneE164: string
    waId?: string | null
    phoneCountryCode: string
    phoneNumber: string
    companyName?: string | null
    websiteUrl?: string | null
    instagramUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    submissions?: FormSubmissionUncheckedCreateNestedManyWithoutContactInput
    pipeline?: LeadPipelineUncheckedCreateNestedOneWithoutContactInput
  }

  export type ContactCreateOrConnectWithoutConversationsInput = {
    where: ContactWhereUniqueInput
    create: XOR<ContactCreateWithoutConversationsInput, ContactUncheckedCreateWithoutConversationsInput>
  }

  export type ConversationMessageCreateWithoutConversationInput = {
    id?: string
    direction: $Enums.MessageDirection
    waMessageId?: string | null
    type: $Enums.MessageType
    body?: string | null
    templateName?: string | null
    buttonId?: string | null
    rawPayload?: NullableJsonNullValueInput | InputJsonValue
    pipelineState?: $Enums.PipelineState | null
    status?: $Enums.MessageStatus
    mediaId?: string | null
    mimeType?: string | null
    mediaFilename?: string | null
    mediaUrl?: string | null
    caption?: string | null
    createdAt?: Date | string
  }

  export type ConversationMessageUncheckedCreateWithoutConversationInput = {
    id?: string
    direction: $Enums.MessageDirection
    waMessageId?: string | null
    type: $Enums.MessageType
    body?: string | null
    templateName?: string | null
    buttonId?: string | null
    rawPayload?: NullableJsonNullValueInput | InputJsonValue
    pipelineState?: $Enums.PipelineState | null
    status?: $Enums.MessageStatus
    mediaId?: string | null
    mimeType?: string | null
    mediaFilename?: string | null
    mediaUrl?: string | null
    caption?: string | null
    createdAt?: Date | string
  }

  export type ConversationMessageCreateOrConnectWithoutConversationInput = {
    where: ConversationMessageWhereUniqueInput
    create: XOR<ConversationMessageCreateWithoutConversationInput, ConversationMessageUncheckedCreateWithoutConversationInput>
  }

  export type ConversationMessageCreateManyConversationInputEnvelope = {
    data: ConversationMessageCreateManyConversationInput | ConversationMessageCreateManyConversationInput[]
    skipDuplicates?: boolean
  }

  export type ContactUpsertWithoutConversationsInput = {
    update: XOR<ContactUpdateWithoutConversationsInput, ContactUncheckedUpdateWithoutConversationsInput>
    create: XOR<ContactCreateWithoutConversationsInput, ContactUncheckedCreateWithoutConversationsInput>
    where?: ContactWhereInput
  }

  export type ContactUpdateToOneWithWhereWithoutConversationsInput = {
    where?: ContactWhereInput
    data: XOR<ContactUpdateWithoutConversationsInput, ContactUncheckedUpdateWithoutConversationsInput>
  }

  export type ContactUpdateWithoutConversationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phoneE164?: StringFieldUpdateOperationsInput | string
    waId?: NullableStringFieldUpdateOperationsInput | string | null
    phoneCountryCode?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    instagramUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submissions?: FormSubmissionUpdateManyWithoutContactNestedInput
    pipeline?: LeadPipelineUpdateOneWithoutContactNestedInput
  }

  export type ContactUncheckedUpdateWithoutConversationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phoneE164?: StringFieldUpdateOperationsInput | string
    waId?: NullableStringFieldUpdateOperationsInput | string | null
    phoneCountryCode?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    instagramUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submissions?: FormSubmissionUncheckedUpdateManyWithoutContactNestedInput
    pipeline?: LeadPipelineUncheckedUpdateOneWithoutContactNestedInput
  }

  export type ConversationMessageUpsertWithWhereUniqueWithoutConversationInput = {
    where: ConversationMessageWhereUniqueInput
    update: XOR<ConversationMessageUpdateWithoutConversationInput, ConversationMessageUncheckedUpdateWithoutConversationInput>
    create: XOR<ConversationMessageCreateWithoutConversationInput, ConversationMessageUncheckedCreateWithoutConversationInput>
  }

  export type ConversationMessageUpdateWithWhereUniqueWithoutConversationInput = {
    where: ConversationMessageWhereUniqueInput
    data: XOR<ConversationMessageUpdateWithoutConversationInput, ConversationMessageUncheckedUpdateWithoutConversationInput>
  }

  export type ConversationMessageUpdateManyWithWhereWithoutConversationInput = {
    where: ConversationMessageScalarWhereInput
    data: XOR<ConversationMessageUpdateManyMutationInput, ConversationMessageUncheckedUpdateManyWithoutConversationInput>
  }

  export type ConversationMessageScalarWhereInput = {
    AND?: ConversationMessageScalarWhereInput | ConversationMessageScalarWhereInput[]
    OR?: ConversationMessageScalarWhereInput[]
    NOT?: ConversationMessageScalarWhereInput | ConversationMessageScalarWhereInput[]
    id?: StringFilter<"ConversationMessage"> | string
    conversationId?: StringFilter<"ConversationMessage"> | string
    direction?: EnumMessageDirectionFilter<"ConversationMessage"> | $Enums.MessageDirection
    waMessageId?: StringNullableFilter<"ConversationMessage"> | string | null
    type?: EnumMessageTypeFilter<"ConversationMessage"> | $Enums.MessageType
    body?: StringNullableFilter<"ConversationMessage"> | string | null
    templateName?: StringNullableFilter<"ConversationMessage"> | string | null
    buttonId?: StringNullableFilter<"ConversationMessage"> | string | null
    rawPayload?: JsonNullableFilter<"ConversationMessage">
    pipelineState?: EnumPipelineStateNullableFilter<"ConversationMessage"> | $Enums.PipelineState | null
    status?: EnumMessageStatusFilter<"ConversationMessage"> | $Enums.MessageStatus
    mediaId?: StringNullableFilter<"ConversationMessage"> | string | null
    mimeType?: StringNullableFilter<"ConversationMessage"> | string | null
    mediaFilename?: StringNullableFilter<"ConversationMessage"> | string | null
    mediaUrl?: StringNullableFilter<"ConversationMessage"> | string | null
    caption?: StringNullableFilter<"ConversationMessage"> | string | null
    createdAt?: DateTimeFilter<"ConversationMessage"> | Date | string
  }

  export type ConversationCreateWithoutMessagesInput = {
    id?: string
    channel?: $Enums.ConversationChannel
    waPhoneNumberId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    contact: ContactCreateNestedOneWithoutConversationsInput
  }

  export type ConversationUncheckedCreateWithoutMessagesInput = {
    id?: string
    contactId: string
    channel?: $Enums.ConversationChannel
    waPhoneNumberId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConversationCreateOrConnectWithoutMessagesInput = {
    where: ConversationWhereUniqueInput
    create: XOR<ConversationCreateWithoutMessagesInput, ConversationUncheckedCreateWithoutMessagesInput>
  }

  export type ConversationUpsertWithoutMessagesInput = {
    update: XOR<ConversationUpdateWithoutMessagesInput, ConversationUncheckedUpdateWithoutMessagesInput>
    create: XOR<ConversationCreateWithoutMessagesInput, ConversationUncheckedCreateWithoutMessagesInput>
    where?: ConversationWhereInput
  }

  export type ConversationUpdateToOneWithWhereWithoutMessagesInput = {
    where?: ConversationWhereInput
    data: XOR<ConversationUpdateWithoutMessagesInput, ConversationUncheckedUpdateWithoutMessagesInput>
  }

  export type ConversationUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    channel?: EnumConversationChannelFieldUpdateOperationsInput | $Enums.ConversationChannel
    waPhoneNumberId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    contact?: ContactUpdateOneRequiredWithoutConversationsNestedInput
  }

  export type ConversationUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    contactId?: StringFieldUpdateOperationsInput | string
    channel?: EnumConversationChannelFieldUpdateOperationsInput | $Enums.ConversationChannel
    waPhoneNumberId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LeadPipelineCreateWithoutJobsInput = {
    id?: string
    funnelOrigin: $Enums.FunnelOrigin
    currentStage: $Enums.PipelineStage
    currentState: $Enums.PipelineState
    scheduledJobId?: string | null
    scheduledJobDedupKey?: string | null
    videoWatched?: boolean
    utmSource?: string | null
    pixelFiredAt?: Date | string | null
    painPoint?: string | null
    qualificationAnswers?: NullableJsonNullValueInput | InputJsonValue
    meetingId?: string | null
    meetingTime?: Date | string | null
    meetLink?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    contact: ContactCreateNestedOneWithoutPipelineInput
  }

  export type LeadPipelineUncheckedCreateWithoutJobsInput = {
    id?: string
    contactId: string
    funnelOrigin: $Enums.FunnelOrigin
    currentStage: $Enums.PipelineStage
    currentState: $Enums.PipelineState
    scheduledJobId?: string | null
    scheduledJobDedupKey?: string | null
    videoWatched?: boolean
    utmSource?: string | null
    pixelFiredAt?: Date | string | null
    painPoint?: string | null
    qualificationAnswers?: NullableJsonNullValueInput | InputJsonValue
    meetingId?: string | null
    meetingTime?: Date | string | null
    meetLink?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LeadPipelineCreateOrConnectWithoutJobsInput = {
    where: LeadPipelineWhereUniqueInput
    create: XOR<LeadPipelineCreateWithoutJobsInput, LeadPipelineUncheckedCreateWithoutJobsInput>
  }

  export type LeadPipelineUpsertWithoutJobsInput = {
    update: XOR<LeadPipelineUpdateWithoutJobsInput, LeadPipelineUncheckedUpdateWithoutJobsInput>
    create: XOR<LeadPipelineCreateWithoutJobsInput, LeadPipelineUncheckedCreateWithoutJobsInput>
    where?: LeadPipelineWhereInput
  }

  export type LeadPipelineUpdateToOneWithWhereWithoutJobsInput = {
    where?: LeadPipelineWhereInput
    data: XOR<LeadPipelineUpdateWithoutJobsInput, LeadPipelineUncheckedUpdateWithoutJobsInput>
  }

  export type LeadPipelineUpdateWithoutJobsInput = {
    id?: StringFieldUpdateOperationsInput | string
    funnelOrigin?: EnumFunnelOriginFieldUpdateOperationsInput | $Enums.FunnelOrigin
    currentStage?: EnumPipelineStageFieldUpdateOperationsInput | $Enums.PipelineStage
    currentState?: EnumPipelineStateFieldUpdateOperationsInput | $Enums.PipelineState
    scheduledJobId?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledJobDedupKey?: NullableStringFieldUpdateOperationsInput | string | null
    videoWatched?: BoolFieldUpdateOperationsInput | boolean
    utmSource?: NullableStringFieldUpdateOperationsInput | string | null
    pixelFiredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    painPoint?: NullableStringFieldUpdateOperationsInput | string | null
    qualificationAnswers?: NullableJsonNullValueInput | InputJsonValue
    meetingId?: NullableStringFieldUpdateOperationsInput | string | null
    meetingTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    meetLink?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    contact?: ContactUpdateOneRequiredWithoutPipelineNestedInput
  }

  export type LeadPipelineUncheckedUpdateWithoutJobsInput = {
    id?: StringFieldUpdateOperationsInput | string
    contactId?: StringFieldUpdateOperationsInput | string
    funnelOrigin?: EnumFunnelOriginFieldUpdateOperationsInput | $Enums.FunnelOrigin
    currentStage?: EnumPipelineStageFieldUpdateOperationsInput | $Enums.PipelineStage
    currentState?: EnumPipelineStateFieldUpdateOperationsInput | $Enums.PipelineState
    scheduledJobId?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledJobDedupKey?: NullableStringFieldUpdateOperationsInput | string | null
    videoWatched?: BoolFieldUpdateOperationsInput | boolean
    utmSource?: NullableStringFieldUpdateOperationsInput | string | null
    pixelFiredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    painPoint?: NullableStringFieldUpdateOperationsInput | string | null
    qualificationAnswers?: NullableJsonNullValueInput | InputJsonValue
    meetingId?: NullableStringFieldUpdateOperationsInput | string | null
    meetingTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    meetLink?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FormSubmissionCreateManyContactInput = {
    id?: string
    fullName?: string | null
    email?: string | null
    companyName?: string | null
    phoneCountryCode?: string | null
    phoneNumber?: string | null
    instagramUrl?: string | null
    websiteUrl?: string | null
    usesPms?: $Enums.PmsUsage | null
    propertyCount?: $Enums.PropertyCount | null
    revenueRange?: $Enums.RevenueRange | null
    isTodero?: $Enums.YesNo | null
    usesAi?: $Enums.YesNo | null
    wantsToScale?: $Enums.YesNo | null
    industryTime?: $Enums.IndustryTime | null
    pdfToken: string
    qualification?: $Enums.LeadQualification | null
    qualificationScore?: number | null
    disqualificationReason?: $Enums.DisqualificationReason | null
    scoreBreakdown?: NullableJsonNullValueInput | InputJsonValue
    entrySource?: $Enums.LeadEntrySource
    bookingFlow?: $Enums.BookingFlow | null
    bookedAt?: Date | string | null
    status?: $Enums.SubmissionStatus
    fbclid?: string | null
    fbp?: string | null
    fbc?: string | null
    utmSource?: string | null
    utmMedium?: string | null
    utmCampaign?: string | null
    utmContent?: string | null
    utmTerm?: string | null
    landingPath?: string | null
    referrer?: string | null
    marketingFunnelStage?: $Enums.MarketingFunnelStage | null
    contractValueUsd?: Decimal | DecimalJsLike | number | string | null
    contractPlan?: $Enums.ContractPlan | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConversationCreateManyContactInput = {
    id?: string
    channel?: $Enums.ConversationChannel
    waPhoneNumberId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FormSubmissionUpdateWithoutContactInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    phoneCountryCode?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    instagramUrl?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    usesPms?: NullableEnumPmsUsageFieldUpdateOperationsInput | $Enums.PmsUsage | null
    propertyCount?: NullableEnumPropertyCountFieldUpdateOperationsInput | $Enums.PropertyCount | null
    revenueRange?: NullableEnumRevenueRangeFieldUpdateOperationsInput | $Enums.RevenueRange | null
    isTodero?: NullableEnumYesNoFieldUpdateOperationsInput | $Enums.YesNo | null
    usesAi?: NullableEnumYesNoFieldUpdateOperationsInput | $Enums.YesNo | null
    wantsToScale?: NullableEnumYesNoFieldUpdateOperationsInput | $Enums.YesNo | null
    industryTime?: NullableEnumIndustryTimeFieldUpdateOperationsInput | $Enums.IndustryTime | null
    pdfToken?: StringFieldUpdateOperationsInput | string
    qualification?: NullableEnumLeadQualificationFieldUpdateOperationsInput | $Enums.LeadQualification | null
    qualificationScore?: NullableIntFieldUpdateOperationsInput | number | null
    disqualificationReason?: NullableEnumDisqualificationReasonFieldUpdateOperationsInput | $Enums.DisqualificationReason | null
    scoreBreakdown?: NullableJsonNullValueInput | InputJsonValue
    entrySource?: EnumLeadEntrySourceFieldUpdateOperationsInput | $Enums.LeadEntrySource
    bookingFlow?: NullableEnumBookingFlowFieldUpdateOperationsInput | $Enums.BookingFlow | null
    bookedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumSubmissionStatusFieldUpdateOperationsInput | $Enums.SubmissionStatus
    fbclid?: NullableStringFieldUpdateOperationsInput | string | null
    fbp?: NullableStringFieldUpdateOperationsInput | string | null
    fbc?: NullableStringFieldUpdateOperationsInput | string | null
    utmSource?: NullableStringFieldUpdateOperationsInput | string | null
    utmMedium?: NullableStringFieldUpdateOperationsInput | string | null
    utmCampaign?: NullableStringFieldUpdateOperationsInput | string | null
    utmContent?: NullableStringFieldUpdateOperationsInput | string | null
    utmTerm?: NullableStringFieldUpdateOperationsInput | string | null
    landingPath?: NullableStringFieldUpdateOperationsInput | string | null
    referrer?: NullableStringFieldUpdateOperationsInput | string | null
    marketingFunnelStage?: NullableEnumMarketingFunnelStageFieldUpdateOperationsInput | $Enums.MarketingFunnelStage | null
    contractValueUsd?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    contractPlan?: NullableEnumContractPlanFieldUpdateOperationsInput | $Enums.ContractPlan | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: LeadEventUpdateManyWithoutSubmissionNestedInput
  }

  export type FormSubmissionUncheckedUpdateWithoutContactInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    phoneCountryCode?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    instagramUrl?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    usesPms?: NullableEnumPmsUsageFieldUpdateOperationsInput | $Enums.PmsUsage | null
    propertyCount?: NullableEnumPropertyCountFieldUpdateOperationsInput | $Enums.PropertyCount | null
    revenueRange?: NullableEnumRevenueRangeFieldUpdateOperationsInput | $Enums.RevenueRange | null
    isTodero?: NullableEnumYesNoFieldUpdateOperationsInput | $Enums.YesNo | null
    usesAi?: NullableEnumYesNoFieldUpdateOperationsInput | $Enums.YesNo | null
    wantsToScale?: NullableEnumYesNoFieldUpdateOperationsInput | $Enums.YesNo | null
    industryTime?: NullableEnumIndustryTimeFieldUpdateOperationsInput | $Enums.IndustryTime | null
    pdfToken?: StringFieldUpdateOperationsInput | string
    qualification?: NullableEnumLeadQualificationFieldUpdateOperationsInput | $Enums.LeadQualification | null
    qualificationScore?: NullableIntFieldUpdateOperationsInput | number | null
    disqualificationReason?: NullableEnumDisqualificationReasonFieldUpdateOperationsInput | $Enums.DisqualificationReason | null
    scoreBreakdown?: NullableJsonNullValueInput | InputJsonValue
    entrySource?: EnumLeadEntrySourceFieldUpdateOperationsInput | $Enums.LeadEntrySource
    bookingFlow?: NullableEnumBookingFlowFieldUpdateOperationsInput | $Enums.BookingFlow | null
    bookedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumSubmissionStatusFieldUpdateOperationsInput | $Enums.SubmissionStatus
    fbclid?: NullableStringFieldUpdateOperationsInput | string | null
    fbp?: NullableStringFieldUpdateOperationsInput | string | null
    fbc?: NullableStringFieldUpdateOperationsInput | string | null
    utmSource?: NullableStringFieldUpdateOperationsInput | string | null
    utmMedium?: NullableStringFieldUpdateOperationsInput | string | null
    utmCampaign?: NullableStringFieldUpdateOperationsInput | string | null
    utmContent?: NullableStringFieldUpdateOperationsInput | string | null
    utmTerm?: NullableStringFieldUpdateOperationsInput | string | null
    landingPath?: NullableStringFieldUpdateOperationsInput | string | null
    referrer?: NullableStringFieldUpdateOperationsInput | string | null
    marketingFunnelStage?: NullableEnumMarketingFunnelStageFieldUpdateOperationsInput | $Enums.MarketingFunnelStage | null
    contractValueUsd?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    contractPlan?: NullableEnumContractPlanFieldUpdateOperationsInput | $Enums.ContractPlan | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: LeadEventUncheckedUpdateManyWithoutSubmissionNestedInput
  }

  export type FormSubmissionUncheckedUpdateManyWithoutContactInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    phoneCountryCode?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    instagramUrl?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    usesPms?: NullableEnumPmsUsageFieldUpdateOperationsInput | $Enums.PmsUsage | null
    propertyCount?: NullableEnumPropertyCountFieldUpdateOperationsInput | $Enums.PropertyCount | null
    revenueRange?: NullableEnumRevenueRangeFieldUpdateOperationsInput | $Enums.RevenueRange | null
    isTodero?: NullableEnumYesNoFieldUpdateOperationsInput | $Enums.YesNo | null
    usesAi?: NullableEnumYesNoFieldUpdateOperationsInput | $Enums.YesNo | null
    wantsToScale?: NullableEnumYesNoFieldUpdateOperationsInput | $Enums.YesNo | null
    industryTime?: NullableEnumIndustryTimeFieldUpdateOperationsInput | $Enums.IndustryTime | null
    pdfToken?: StringFieldUpdateOperationsInput | string
    qualification?: NullableEnumLeadQualificationFieldUpdateOperationsInput | $Enums.LeadQualification | null
    qualificationScore?: NullableIntFieldUpdateOperationsInput | number | null
    disqualificationReason?: NullableEnumDisqualificationReasonFieldUpdateOperationsInput | $Enums.DisqualificationReason | null
    scoreBreakdown?: NullableJsonNullValueInput | InputJsonValue
    entrySource?: EnumLeadEntrySourceFieldUpdateOperationsInput | $Enums.LeadEntrySource
    bookingFlow?: NullableEnumBookingFlowFieldUpdateOperationsInput | $Enums.BookingFlow | null
    bookedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumSubmissionStatusFieldUpdateOperationsInput | $Enums.SubmissionStatus
    fbclid?: NullableStringFieldUpdateOperationsInput | string | null
    fbp?: NullableStringFieldUpdateOperationsInput | string | null
    fbc?: NullableStringFieldUpdateOperationsInput | string | null
    utmSource?: NullableStringFieldUpdateOperationsInput | string | null
    utmMedium?: NullableStringFieldUpdateOperationsInput | string | null
    utmCampaign?: NullableStringFieldUpdateOperationsInput | string | null
    utmContent?: NullableStringFieldUpdateOperationsInput | string | null
    utmTerm?: NullableStringFieldUpdateOperationsInput | string | null
    landingPath?: NullableStringFieldUpdateOperationsInput | string | null
    referrer?: NullableStringFieldUpdateOperationsInput | string | null
    marketingFunnelStage?: NullableEnumMarketingFunnelStageFieldUpdateOperationsInput | $Enums.MarketingFunnelStage | null
    contractValueUsd?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    contractPlan?: NullableEnumContractPlanFieldUpdateOperationsInput | $Enums.ContractPlan | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConversationUpdateWithoutContactInput = {
    id?: StringFieldUpdateOperationsInput | string
    channel?: EnumConversationChannelFieldUpdateOperationsInput | $Enums.ConversationChannel
    waPhoneNumberId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: ConversationMessageUpdateManyWithoutConversationNestedInput
  }

  export type ConversationUncheckedUpdateWithoutContactInput = {
    id?: StringFieldUpdateOperationsInput | string
    channel?: EnumConversationChannelFieldUpdateOperationsInput | $Enums.ConversationChannel
    waPhoneNumberId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: ConversationMessageUncheckedUpdateManyWithoutConversationNestedInput
  }

  export type ConversationUncheckedUpdateManyWithoutContactInput = {
    id?: StringFieldUpdateOperationsInput | string
    channel?: EnumConversationChannelFieldUpdateOperationsInput | $Enums.ConversationChannel
    waPhoneNumberId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LeadEventCreateManySubmissionInput = {
    id: string
    eventName: $Enums.MarketingEventName
    eventTime?: Date | string
    eventSourceUrl?: string | null
    value: Decimal | DecimalJsLike | number | string
    currency?: string
    sentToMeta?: boolean
    metaResponse?: NullableJsonNullValueInput | InputJsonValue
    attemptCount?: number
    lastAttemptAt?: Date | string | null
    triggeredBy: string
    clientIp?: string | null
    clientUserAgent?: string | null
    createdAt?: Date | string
  }

  export type LeadEventUpdateWithoutSubmissionInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventName?: EnumMarketingEventNameFieldUpdateOperationsInput | $Enums.MarketingEventName
    eventTime?: DateTimeFieldUpdateOperationsInput | Date | string
    eventSourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    value?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    sentToMeta?: BoolFieldUpdateOperationsInput | boolean
    metaResponse?: NullableJsonNullValueInput | InputJsonValue
    attemptCount?: IntFieldUpdateOperationsInput | number
    lastAttemptAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    triggeredBy?: StringFieldUpdateOperationsInput | string
    clientIp?: NullableStringFieldUpdateOperationsInput | string | null
    clientUserAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LeadEventUncheckedUpdateWithoutSubmissionInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventName?: EnumMarketingEventNameFieldUpdateOperationsInput | $Enums.MarketingEventName
    eventTime?: DateTimeFieldUpdateOperationsInput | Date | string
    eventSourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    value?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    sentToMeta?: BoolFieldUpdateOperationsInput | boolean
    metaResponse?: NullableJsonNullValueInput | InputJsonValue
    attemptCount?: IntFieldUpdateOperationsInput | number
    lastAttemptAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    triggeredBy?: StringFieldUpdateOperationsInput | string
    clientIp?: NullableStringFieldUpdateOperationsInput | string | null
    clientUserAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LeadEventUncheckedUpdateManyWithoutSubmissionInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventName?: EnumMarketingEventNameFieldUpdateOperationsInput | $Enums.MarketingEventName
    eventTime?: DateTimeFieldUpdateOperationsInput | Date | string
    eventSourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    value?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    sentToMeta?: BoolFieldUpdateOperationsInput | boolean
    metaResponse?: NullableJsonNullValueInput | InputJsonValue
    attemptCount?: IntFieldUpdateOperationsInput | number
    lastAttemptAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    triggeredBy?: StringFieldUpdateOperationsInput | string
    clientIp?: NullableStringFieldUpdateOperationsInput | string | null
    clientUserAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PipelineJobCreateManyPipelineInput = {
    id?: string
    dedupKey: string
    expectedState: $Enums.PipelineState
    qstashMessageId?: string | null
    status?: $Enums.PipelineJobStatus
    createdAt?: Date | string
    executedAt?: Date | string | null
  }

  export type PipelineJobUpdateWithoutPipelineInput = {
    id?: StringFieldUpdateOperationsInput | string
    dedupKey?: StringFieldUpdateOperationsInput | string
    expectedState?: EnumPipelineStateFieldUpdateOperationsInput | $Enums.PipelineState
    qstashMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumPipelineJobStatusFieldUpdateOperationsInput | $Enums.PipelineJobStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    executedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PipelineJobUncheckedUpdateWithoutPipelineInput = {
    id?: StringFieldUpdateOperationsInput | string
    dedupKey?: StringFieldUpdateOperationsInput | string
    expectedState?: EnumPipelineStateFieldUpdateOperationsInput | $Enums.PipelineState
    qstashMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumPipelineJobStatusFieldUpdateOperationsInput | $Enums.PipelineJobStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    executedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PipelineJobUncheckedUpdateManyWithoutPipelineInput = {
    id?: StringFieldUpdateOperationsInput | string
    dedupKey?: StringFieldUpdateOperationsInput | string
    expectedState?: EnumPipelineStateFieldUpdateOperationsInput | $Enums.PipelineState
    qstashMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumPipelineJobStatusFieldUpdateOperationsInput | $Enums.PipelineJobStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    executedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ConversationMessageCreateManyConversationInput = {
    id?: string
    direction: $Enums.MessageDirection
    waMessageId?: string | null
    type: $Enums.MessageType
    body?: string | null
    templateName?: string | null
    buttonId?: string | null
    rawPayload?: NullableJsonNullValueInput | InputJsonValue
    pipelineState?: $Enums.PipelineState | null
    status?: $Enums.MessageStatus
    mediaId?: string | null
    mimeType?: string | null
    mediaFilename?: string | null
    mediaUrl?: string | null
    caption?: string | null
    createdAt?: Date | string
  }

  export type ConversationMessageUpdateWithoutConversationInput = {
    id?: StringFieldUpdateOperationsInput | string
    direction?: EnumMessageDirectionFieldUpdateOperationsInput | $Enums.MessageDirection
    waMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumMessageTypeFieldUpdateOperationsInput | $Enums.MessageType
    body?: NullableStringFieldUpdateOperationsInput | string | null
    templateName?: NullableStringFieldUpdateOperationsInput | string | null
    buttonId?: NullableStringFieldUpdateOperationsInput | string | null
    rawPayload?: NullableJsonNullValueInput | InputJsonValue
    pipelineState?: NullableEnumPipelineStateFieldUpdateOperationsInput | $Enums.PipelineState | null
    status?: EnumMessageStatusFieldUpdateOperationsInput | $Enums.MessageStatus
    mediaId?: NullableStringFieldUpdateOperationsInput | string | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    mediaFilename?: NullableStringFieldUpdateOperationsInput | string | null
    mediaUrl?: NullableStringFieldUpdateOperationsInput | string | null
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConversationMessageUncheckedUpdateWithoutConversationInput = {
    id?: StringFieldUpdateOperationsInput | string
    direction?: EnumMessageDirectionFieldUpdateOperationsInput | $Enums.MessageDirection
    waMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumMessageTypeFieldUpdateOperationsInput | $Enums.MessageType
    body?: NullableStringFieldUpdateOperationsInput | string | null
    templateName?: NullableStringFieldUpdateOperationsInput | string | null
    buttonId?: NullableStringFieldUpdateOperationsInput | string | null
    rawPayload?: NullableJsonNullValueInput | InputJsonValue
    pipelineState?: NullableEnumPipelineStateFieldUpdateOperationsInput | $Enums.PipelineState | null
    status?: EnumMessageStatusFieldUpdateOperationsInput | $Enums.MessageStatus
    mediaId?: NullableStringFieldUpdateOperationsInput | string | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    mediaFilename?: NullableStringFieldUpdateOperationsInput | string | null
    mediaUrl?: NullableStringFieldUpdateOperationsInput | string | null
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConversationMessageUncheckedUpdateManyWithoutConversationInput = {
    id?: StringFieldUpdateOperationsInput | string
    direction?: EnumMessageDirectionFieldUpdateOperationsInput | $Enums.MessageDirection
    waMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumMessageTypeFieldUpdateOperationsInput | $Enums.MessageType
    body?: NullableStringFieldUpdateOperationsInput | string | null
    templateName?: NullableStringFieldUpdateOperationsInput | string | null
    buttonId?: NullableStringFieldUpdateOperationsInput | string | null
    rawPayload?: NullableJsonNullValueInput | InputJsonValue
    pipelineState?: NullableEnumPipelineStateFieldUpdateOperationsInput | $Enums.PipelineState | null
    status?: EnumMessageStatusFieldUpdateOperationsInput | $Enums.MessageStatus
    mediaId?: NullableStringFieldUpdateOperationsInput | string | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    mediaFilename?: NullableStringFieldUpdateOperationsInput | string | null
    mediaUrl?: NullableStringFieldUpdateOperationsInput | string | null
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}
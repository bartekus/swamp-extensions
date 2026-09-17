// Swamp, an Automation Framework
// Copyright (C) 2026 Elder Swamp Club, Inc.
//
// This file is part of Swamp.
//
// Swamp is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License version 3
// as published by the Free Software Foundation, with the Swamp
// Extension and Definition Exception (found in the "COPYING-EXCEPTION"
// file).
//
// Swamp is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with Swamp.  If not, see <https://www.gnu.org/licenses/>.

// Auto-generated extension model for @swamp/gcp/mybusinessbusinessinformation/locations
// Do not edit manually. Re-generate with: deno task generate:gcp

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Google Cloud My Business Business Information Locations.
 *
 * A location. See the [help center article] (https://support.google.com/business/answer/3038177) for a detailed description of these fields, or the [category endpoint](/my-business/reference/rest/v4/categories) for a list of valid business categories.
 *
 * Wraps the GCP resource as a swamp model so create, get, update,
 * delete, and sync can be driven through `swamp model`.
 *
 * @module
 */

import { z } from "npm:zod@4.3.6";
import {
  createResource,
  deleteResource,
  type ExplicitGcpCredentials,
  getProjectId,
  isResourceNotFoundError,
  readResource,
  updateResource,
} from "./_lib/gcp.ts";

const BASE_URL = "https://mybusinessbusinessinformation.googleapis.com/";

const GET_CONFIG = {
  "id": "mybusinessbusinessinformation.locations.get",
  "path": "v1/{+name}",
  "httpMethod": "GET",
  "parameterOrder": [
    "name",
  ],
  "parameters": {
    "name": {
      "location": "path",
      "required": true,
    },
    "readMask": {
      "location": "query",
    },
  },
} as const;

const PATCH_CONFIG = {
  "id": "mybusinessbusinessinformation.locations.patch",
  "path": "v1/{+name}",
  "httpMethod": "PATCH",
  "parameterOrder": [
    "name",
  ],
  "parameters": {
    "name": {
      "location": "path",
      "required": true,
    },
    "updateMask": {
      "location": "query",
    },
    "validateOnly": {
      "location": "query",
    },
  },
} as const;

const DELETE_CONFIG = {
  "id": "mybusinessbusinessinformation.locations.delete",
  "path": "v1/{+name}",
  "httpMethod": "DELETE",
  "parameterOrder": [
    "name",
  ],
  "parameters": {
    "name": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const GlobalArgsSchema = z.object({
  accessToken: z.string().meta({ sensitive: true }).describe(
    "GCP OAuth2 access token; overrides GCP_ACCESS_TOKEN environment variable. Wire with a vault.get(...) expression to source it from a vault.",
  ).optional(),
  credentialsJson: z.string().meta({ sensitive: true }).describe(
    "GCP service account JSON credentials; overrides GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable. Wire with a vault.get(...) expression to source it from a vault.",
  ).optional(),
  project: z.string().describe(
    "GCP project ID; overrides GCP_PROJECT / GOOGLE_CLOUD_PROJECT environment variables.",
  ).optional(),
  scopes: z.string().describe(
    "Comma-separated OAuth scopes to request when minting access tokens via gcloud. Defaults to the API's Discovery Document scopes.",
  ).optional(),
  quotaProject: z.string().describe(
    "GCP project ID for quota and billing attribution; sets the x-goog-user-project header. Overrides GOOGLE_CLOUD_QUOTA_PROJECT environment variable. Required for APIs like Cloud Identity when using user credentials.",
  ).optional(),
  apiEndpoint: z.string().describe(
    "Custom API endpoint for emulators; overrides GCP_API_ENDPOINT environment variable. Defaults to the service's production URL.",
  ).optional(),
  adWordsLocationExtensions: z.object({
    adPhone: z.string().describe(
      "Required. An alternate phone number to display on AdWords location extensions instead of the location's primary phone number.",
    ).optional(),
  }).describe("Optional. Additional information that is surfaced in AdWords.")
    .optional(),
  categories: z.object({
    additionalCategories: z.array(z.object({
      displayName: z.string().describe(
        "Output only. The human-readable name of the category. This is set when reading the location. When modifying the location, `category_id` must be set.",
      ).optional(),
      moreHoursTypes: z.array(z.object({
        displayName: z.unknown().describe(
          "Output only. The human-readable English display name for the hours type.",
        ).optional(),
        hoursTypeId: z.unknown().describe(
          "Output only. A stable ID provided by Google for this hours type.",
        ).optional(),
        localizedDisplayName: z.unknown().describe(
          "Output only. The human-readable localized display name for the hours type.",
        ).optional(),
      })).describe(
        "Output only. More hours types that are available for this business category.",
      ).optional(),
      name: z.string().describe(
        "Required. A stable ID (provided by Google) for this category. The value must be specified when modifying the category (when creating or updating a location).",
      ).optional(),
      serviceTypes: z.array(z.object({
        displayName: z.unknown().describe(
          "Output only. The human-readable display name for the service type.",
        ).optional(),
        serviceTypeId: z.unknown().describe(
          "Output only. A stable ID (provided by Google) for this service type.",
        ).optional(),
      })).describe(
        "Output only. A list of all the service types that are available for this business category.",
      ).optional(),
    })).describe(
      "Optional. Additional categories to describe your business. Categories help your customers find accurate, specific results for services they're interested in. To keep your business information accurate and live, make sure that you use as few categories as possible to describe your overall core business. Choose categories that are as specific as possible, but representative of your main business.",
    ).optional(),
    primaryCategory: z.object({
      displayName: z.string().describe(
        "Output only. The human-readable name of the category. This is set when reading the location. When modifying the location, `category_id` must be set.",
      ).optional(),
      moreHoursTypes: z.array(z.object({
        displayName: z.string().describe(
          "Output only. The human-readable English display name for the hours type.",
        ).optional(),
        hoursTypeId: z.string().describe(
          "Output only. A stable ID provided by Google for this hours type.",
        ).optional(),
        localizedDisplayName: z.string().describe(
          "Output only. The human-readable localized display name for the hours type.",
        ).optional(),
      })).describe(
        "Output only. More hours types that are available for this business category.",
      ).optional(),
      name: z.string().describe(
        "Required. A stable ID (provided by Google) for this category. The value must be specified when modifying the category (when creating or updating a location).",
      ).optional(),
      serviceTypes: z.array(z.object({
        displayName: z.string().describe(
          "Output only. The human-readable display name for the service type.",
        ).optional(),
        serviceTypeId: z.string().describe(
          "Output only. A stable ID (provided by Google) for this service type.",
        ).optional(),
      })).describe(
        "Output only. A list of all the service types that are available for this business category.",
      ).optional(),
    }).describe(
      "Required. Category that best describes the core business this location engages in.",
    ).optional(),
  }).describe("Optional. The different categories that describe the business.")
    .optional(),
  labels: z.array(z.string()).describe(
    "Optional. A collection of free-form strings to allow you to tag your business. These labels are NOT user facing; only you can see them. Must be between 1-255 characters per label.",
  ).optional(),
  languageCode: z.string().describe(
    "Immutable. The language of the location. Set during creation and not updateable.",
  ).optional(),
  latlng: z.object({
    latitude: z.number().describe(
      "The latitude in degrees. It must be in the range [-90.0, +90.0].",
    ).optional(),
    longitude: z.number().describe(
      "The longitude in degrees. It must be in the range [-180.0, +180.0].",
    ).optional(),
  }).describe(
    "Optional. User-provided latitude and longitude. When creating a location, this field is ignored if the provided address geocodes successfully. This field is only returned on get requests if the user-provided `latlng` value was accepted during create, or the `latlng` value was updated through the Google Business Profile website. This field can only be updated by approved clients.",
  ).optional(),
  metadata: z.object({
    canDelete: z.boolean().describe(
      "Output only. Indicates whether the location can be deleted using the API.",
    ).optional(),
    canHaveBusinessCalls: z.boolean().describe(
      "Output only. Indicates if the listing is eligible for business calls.",
    ).optional(),
    canHaveFoodMenus: z.boolean().describe(
      "Output only. Indicates if the listing is eligible for food menu.",
    ).optional(),
    canModifyServiceList: z.boolean().describe(
      "Output only. Indicates if the listing can modify the service list.",
    ).optional(),
    canOperateHealthData: z.boolean().describe(
      "Output only. Indicates whether the location can operate on Health data.",
    ).optional(),
    canOperateLocalPost: z.boolean().describe(
      "Output only. Deprecated: This field is no longer populated and will be removed in a future version.",
    ).optional(),
    canOperateLodgingData: z.boolean().describe(
      "Output only. Indicates whether the location can operate on Lodging data.",
    ).optional(),
    duplicateLocation: z.string().describe(
      "Output only. The location resource that this location duplicates.",
    ).optional(),
    hasGoogleUpdated: z.boolean().describe(
      "Output only. Indicates whether the place ID associated with this location has updates that need to be updated or rejected by the client. If this boolean is set, you should call the `getGoogleUpdated` method to look up information that's needs to be verified.",
    ).optional(),
    hasPendingEdits: z.boolean().describe(
      "Output only. Indicates whether any of this Location's properties are in the edit pending state.",
    ).optional(),
    hasVoiceOfMerchant: z.boolean().describe(
      "Output only. Indicates if the listing has Voice of Merchant. If this boolean is false, you should call the locations.getVoiceOfMerchantState API to get details as to why they do not have Voice of Merchant.",
    ).optional(),
    isParticularlyPersonalPlace: z.boolean().describe(
      "Output only. Indicates whether the location is classified as a particularly personal place. This means there are restrictions on Location History features. If you believe this was a mistake, see the [help center article](https://support.google.com/business/answer/3480441).",
    ).optional(),
    mapsUri: z.string().describe("Output only. A link to the location on Maps.")
      .optional(),
    newReviewUri: z.string().describe(
      "Output only. A link to the page on Google Search where a customer can leave a review for the location.",
    ).optional(),
    placeId: z.string().describe(
      "Output only. If this locationappears on Google Maps, this field is populated with the place ID for the location. This ID can be used in various Places APIs. This field can be set during Create calls, but not for Update.",
    ).optional(),
  }).describe("Output only. Additional non-user-editable information.")
    .optional(),
  moreHours: z.array(z.object({
    hoursTypeId: z.string().describe(
      "Required. Type of hours. Clients should call {#link businessCategories:BatchGet} to get supported hours types for categories of their locations.",
    ).optional(),
    periods: z.array(z.object({
      closeDay: z.enum([
        "DAY_OF_WEEK_UNSPECIFIED",
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY",
      ]).describe(
        "Required. Indicates the day of the week this period ends on.",
      ).optional(),
      closeTime: z.object({
        hours: z.unknown().describe(
          'Hours of a day in 24 hour format. Must be greater than or equal to 0 and typically must be less than or equal to 23. An API may choose to allow the value "24:00:00" for scenarios like business closing time.',
        ).optional(),
        minutes: z.unknown().describe(
          "Minutes of an hour. Must be greater than or equal to 0 and less than or equal to 59.",
        ).optional(),
        nanos: z.unknown().describe(
          "Fractions of seconds, in nanoseconds. Must be greater than or equal to 0 and less than or equal to 999,999,999.",
        ).optional(),
        seconds: z.unknown().describe(
          "Seconds of a minute. Must be greater than or equal to 0 and typically must be less than or equal to 59. An API may allow the value 60 if it allows leap-seconds.",
        ).optional(),
      }).describe(
        "Required. Valid values are 00:00-24:00, where 24:00 represents midnight at the end of the specified day field. Note: In Proto3 JSON mapping, default zero values (00:00) are omitted, producing `{}` for close_time.",
      ).optional(),
      openDay: z.enum([
        "DAY_OF_WEEK_UNSPECIFIED",
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY",
      ]).describe(
        "Required. Indicates the day of the week this period starts on.",
      ).optional(),
      openTime: z.object({
        hours: z.unknown().describe(
          'Hours of a day in 24 hour format. Must be greater than or equal to 0 and typically must be less than or equal to 23. An API may choose to allow the value "24:00:00" for scenarios like business closing time.',
        ).optional(),
        minutes: z.unknown().describe(
          "Minutes of an hour. Must be greater than or equal to 0 and less than or equal to 59.",
        ).optional(),
        nanos: z.unknown().describe(
          "Fractions of seconds, in nanoseconds. Must be greater than or equal to 0 and less than or equal to 999,999,999.",
        ).optional(),
        seconds: z.unknown().describe(
          "Seconds of a minute. Must be greater than or equal to 0 and typically must be less than or equal to 59. An API may allow the value 60 if it allows leap-seconds.",
        ).optional(),
      }).describe(
        "Required. Valid values are 00:00-24:00, where 24:00 represents midnight at the end of the specified day field. Note: In Proto3 JSON mapping, default zero values (00:00) are omitted, producing `{}` for open_time.",
      ).optional(),
    })).describe(
      "Required. A collection of times that this location is open. Each period represents a range of hours when the location is open during the week.",
    ).optional(),
  })).describe(
    "Optional. More hours for a business's different departments or specific customers.",
  ).optional(),
  name: z.string().describe(
    "Identifier. Google identifier for this location in the form: `locations/{location_id}`.",
  ).optional(),
  openInfo: z.object({
    canReopen: z.boolean().describe(
      "Output only. Indicates whether this business is eligible for re-open.",
    ).optional(),
    openingDate: z.object({
      day: z.number().int().describe(
        "Day of a month. Must be from 1 to 31 and valid for the year and month, or 0 to specify a year by itself or a year and month where the day isn't significant.",
      ).optional(),
      month: z.number().int().describe(
        "Month of a year. Must be from 1 to 12, or 0 to specify a year without a month and day.",
      ).optional(),
      year: z.number().int().describe(
        "Year of the date. Must be from 1 to 9999, or 0 to specify a date without a year.",
      ).optional(),
    }).describe(
      "Optional. The date on which the location first opened. If the exact day is not known, month and year only can be provided. The date must be in the past or be no more than one year in the future.",
    ).optional(),
    status: z.enum([
      "OPEN_FOR_BUSINESS_UNSPECIFIED",
      "OPEN",
      "CLOSED_PERMANENTLY",
      "CLOSED_TEMPORARILY",
    ]).describe(
      "Required. Indicates whether or not the Location is currently open for business. All locations are open by default, unless updated to be closed.",
    ).optional(),
  }).describe(
    "Optional. A flag that indicates whether the location is currently open for business.",
  ).optional(),
  phoneNumbers: z.object({
    additionalPhones: z.array(z.string()).describe(
      "Optional. Up to two phone numbers (mobile or landline, no fax) at which your business can be called, in addition to your primary phone number.",
    ).optional(),
    primaryPhone: z.string().describe(
      "Required. A phone number that connects to your individual business location as directly as possible. Use a local phone number instead of a central, call center helpline number whenever possible.",
    ).optional(),
  }).describe(
    "Optional. The different phone numbers that customers can use to get in touch with the business.",
  ).optional(),
  profile: z.object({
    description: z.string().describe(
      "Required. Description of the location in your own voice, not editable by anyone else.",
    ).optional(),
  }).describe(
    "Optional. Describes your business in your own voice and shares with users the unique story of your business and offerings. This field is required for all categories except lodging categories (e.g., hotels, motels, inns).",
  ).optional(),
  regularHours: z.object({
    periods: z.array(z.object({
      closeDay: z.enum([
        "DAY_OF_WEEK_UNSPECIFIED",
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY",
      ]).describe(
        "Required. Indicates the day of the week this period ends on.",
      ).optional(),
      closeTime: z.object({
        hours: z.number().int().describe(
          'Hours of a day in 24 hour format. Must be greater than or equal to 0 and typically must be less than or equal to 23. An API may choose to allow the value "24:00:00" for scenarios like business closing time.',
        ).optional(),
        minutes: z.number().int().describe(
          "Minutes of an hour. Must be greater than or equal to 0 and less than or equal to 59.",
        ).optional(),
        nanos: z.number().int().describe(
          "Fractions of seconds, in nanoseconds. Must be greater than or equal to 0 and less than or equal to 999,999,999.",
        ).optional(),
        seconds: z.number().int().describe(
          "Seconds of a minute. Must be greater than or equal to 0 and typically must be less than or equal to 59. An API may allow the value 60 if it allows leap-seconds.",
        ).optional(),
      }).describe(
        "Required. Valid values are 00:00-24:00, where 24:00 represents midnight at the end of the specified day field. Note: In Proto3 JSON mapping, default zero values (00:00) are omitted, producing `{}` for close_time.",
      ).optional(),
      openDay: z.enum([
        "DAY_OF_WEEK_UNSPECIFIED",
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY",
      ]).describe(
        "Required. Indicates the day of the week this period starts on.",
      ).optional(),
      openTime: z.object({
        hours: z.number().int().describe(
          'Hours of a day in 24 hour format. Must be greater than or equal to 0 and typically must be less than or equal to 23. An API may choose to allow the value "24:00:00" for scenarios like business closing time.',
        ).optional(),
        minutes: z.number().int().describe(
          "Minutes of an hour. Must be greater than or equal to 0 and less than or equal to 59.",
        ).optional(),
        nanos: z.number().int().describe(
          "Fractions of seconds, in nanoseconds. Must be greater than or equal to 0 and less than or equal to 999,999,999.",
        ).optional(),
        seconds: z.number().int().describe(
          "Seconds of a minute. Must be greater than or equal to 0 and typically must be less than or equal to 59. An API may allow the value 60 if it allows leap-seconds.",
        ).optional(),
      }).describe(
        "Required. Valid values are 00:00-24:00, where 24:00 represents midnight at the end of the specified day field. Note: In Proto3 JSON mapping, default zero values (00:00) are omitted, producing `{}` for open_time.",
      ).optional(),
    })).describe(
      "Required. A collection of times that this location is open for business. Each period represents a range of hours when the location is open during the week.",
    ).optional(),
  }).describe("Optional. Operating hours for the business.").optional(),
  relationshipData: z.object({
    childrenLocations: z.array(z.object({
      placeId: z.string().describe(
        "Required. Specify the location that is on the other side of the relation by its placeID.",
      ).optional(),
      relationType: z.enum([
        "RELATION_TYPE_UNSPECIFIED",
        "DEPARTMENT_OF",
        "INDEPENDENT_ESTABLISHMENT_IN",
      ]).describe("Required. The type of the relationship.").optional(),
    })).describe(
      "Optional. The list of children locations that this location has relations with.",
    ).optional(),
    parentChain: z.string().describe(
      "Optional. The resource name of the Chain that this location is member of. How to find Chain ID",
    ).optional(),
    parentLocation: z.object({
      placeId: z.string().describe(
        "Required. Specify the location that is on the other side of the relation by its placeID.",
      ).optional(),
      relationType: z.enum([
        "RELATION_TYPE_UNSPECIFIED",
        "DEPARTMENT_OF",
        "INDEPENDENT_ESTABLISHMENT_IN",
      ]).describe("Required. The type of the relationship.").optional(),
    }).describe(
      "Optional. The parent location that this location has relations with.",
    ).optional(),
  }).describe("Optional. All locations and chain related to this one.")
    .optional(),
  serviceArea: z.object({
    businessType: z.enum([
      "BUSINESS_TYPE_UNSPECIFIED",
      "CUSTOMER_LOCATION_ONLY",
      "CUSTOMER_AND_BUSINESS_LOCATION",
    ]).describe("Required. Indicates the type of the service area business.")
      .optional(),
    places: z.object({
      placeInfos: z.array(z.object({
        placeId: z.string().describe(
          "Required. The ID of the place. Must correspond to a region. (https://developers.google.com/places/web-service/supported_types#table3)",
        ).optional(),
        placeName: z.string().describe(
          "Required. The localized name of the place. For example, `Scottsdale, AZ`.",
        ).optional(),
      })).describe(
        "Optional. The areas represented by place IDs. Limited to a maximum of 20 places.",
      ).optional(),
    }).describe(
      "Optional. The area that this business serves defined through a set of places.",
    ).optional(),
    regionCode: z.string().describe(
      'Immutable. CLDR region code of the country/region that this service area business is based in. See http://cldr.unicode.org/ and http://www.unicode.org/cldr/charts/30/supplemental/territory_information.html for details. Example: "CH" for Switzerland. This field is required for CUSTOMER_LOCATION_ONLY businesses, and is ignored otherwise. The region specified here can be different from regions for the areas that this business serves (e.g. service area businesses that provide services in regions other than the one that they are based in). If this location requires verification after creation, the address provided for verification purposes *must* be located within this region, and the business owner or their authorized representative *must* be able to receive postal mail at the provided verification address.',
    ).optional(),
  }).describe(
    "Optional. Service area businesses provide their service at the customer's location. If this business is a service area business, this field describes the area(s) serviced by the business.",
  ).optional(),
  serviceItems: z.array(z.object({
    freeFormServiceItem: z.object({
      category: z.string().describe(
        "Required. This field represents the category name (i.e. the category's stable ID). The `category` and `service_type_id` should match the possible combinations provided in the `Category` message.",
      ).optional(),
      label: z.object({
        description: z.string().describe(
          "Optional. Description of the price list, section, or item.",
        ).optional(),
        displayName: z.string().describe(
          "Required. Display name for the price list, section, or item.",
        ).optional(),
        languageCode: z.string().describe(
          "Optional. The BCP-47 language code that these strings apply for. Only one set of labels may be set per language.",
        ).optional(),
      }).describe(
        "Required. Language-tagged labels for the item. We recommend that item names be 140 characters or less, and descriptions 250 characters or less. This field should only be set if the input is a custom service item. Standardized service types should be updated using service_type_id.",
      ).optional(),
    }).describe(
      "Optional. This field will be set case of free-form services data.",
    ).optional(),
    price: z.object({
      currencyCode: z.string().describe(
        "The three-letter currency code defined in ISO 4217.",
      ).optional(),
      nanos: z.number().int().describe(
        "Number of nano (10^-9) units of the amount. The value must be between -999,999,999 and +999,999,999 inclusive. If `units` is positive, `nanos` must be positive or zero. If `units` is zero, `nanos` can be positive, zero, or negative. If `units` is negative, `nanos` must be negative or zero. For example $-1.75 is represented as `units`=-1 and `nanos`=-750,000,000.",
      ).optional(),
      units: z.string().describe(
        'The whole units of the amount. For example if `currencyCode` is `"USD"`, then 1 unit is one US dollar.',
      ).optional(),
    }).describe(
      "Optional. Represents the monetary price of the service item. We recommend that currency_code and units should be set when including a price. This will be treated as a fixed price for the service item.",
    ).optional(),
    structuredServiceItem: z.object({
      description: z.string().describe(
        "Optional. Description of structured service item. The character limit is 300.",
      ).optional(),
      serviceTypeId: z.string().describe(
        "Required. The `service_type_id` field is a Google provided unique ID that can be found in `ServiceType`. This information is provided by `BatchGetCategories` rpc service.",
      ).optional(),
    }).describe(
      "Optional. This field will be set case of structured services data.",
    ).optional(),
  })).describe(
    "Optional. List of services supported by merchants. A service can be haircut, install water heater, etc. Duplicated service items will be removed automatically.",
  ).optional(),
  specialHours: z.object({
    specialHourPeriods: z.array(z.object({
      closeTime: z.object({
        hours: z.number().int().describe(
          'Hours of a day in 24 hour format. Must be greater than or equal to 0 and typically must be less than or equal to 23. An API may choose to allow the value "24:00:00" for scenarios like business closing time.',
        ).optional(),
        minutes: z.number().int().describe(
          "Minutes of an hour. Must be greater than or equal to 0 and less than or equal to 59.",
        ).optional(),
        nanos: z.number().int().describe(
          "Fractions of seconds, in nanoseconds. Must be greater than or equal to 0 and less than or equal to 999,999,999.",
        ).optional(),
        seconds: z.number().int().describe(
          "Seconds of a minute. Must be greater than or equal to 0 and typically must be less than or equal to 59. An API may allow the value 60 if it allows leap-seconds.",
        ).optional(),
      }).describe(
        "Optional. Valid values are 00:00-24:00, where 24:00 represents midnight at the end of the specified day field. Must be specified if `closed` is false.",
      ).optional(),
      closed: z.boolean().describe(
        "Optional. If true, `end_date`, `open_time`, and `close_time` are ignored, and the date specified in `start_date` is treated as the location being closed for the entire day.",
      ).optional(),
      endDate: z.object({
        day: z.number().int().describe(
          "Day of a month. Must be from 1 to 31 and valid for the year and month, or 0 to specify a year by itself or a year and month where the day isn't significant.",
        ).optional(),
        month: z.number().int().describe(
          "Month of a year. Must be from 1 to 12, or 0 to specify a year without a month and day.",
        ).optional(),
        year: z.number().int().describe(
          "Year of the date. Must be from 1 to 9999, or 0 to specify a date without a year.",
        ).optional(),
      }).describe(
        "Optional. The calendar date this special hour period ends on. If `end_date` field is not set, default to the date specified in `start_date`. If set, this field must be equal to or at most 1 day after `start_date`.",
      ).optional(),
      openTime: z.object({
        hours: z.number().int().describe(
          'Hours of a day in 24 hour format. Must be greater than or equal to 0 and typically must be less than or equal to 23. An API may choose to allow the value "24:00:00" for scenarios like business closing time.',
        ).optional(),
        minutes: z.number().int().describe(
          "Minutes of an hour. Must be greater than or equal to 0 and less than or equal to 59.",
        ).optional(),
        nanos: z.number().int().describe(
          "Fractions of seconds, in nanoseconds. Must be greater than or equal to 0 and less than or equal to 999,999,999.",
        ).optional(),
        seconds: z.number().int().describe(
          "Seconds of a minute. Must be greater than or equal to 0 and typically must be less than or equal to 59. An API may allow the value 60 if it allows leap-seconds.",
        ).optional(),
      }).describe(
        "Optional. Valid values are 00:00-24:00 where 24:00 represents midnight at the end of the specified day field. Must be specified if `closed` is false.",
      ).optional(),
      startDate: z.object({
        day: z.number().int().describe(
          "Day of a month. Must be from 1 to 31 and valid for the year and month, or 0 to specify a year by itself or a year and month where the day isn't significant.",
        ).optional(),
        month: z.number().int().describe(
          "Month of a year. Must be from 1 to 12, or 0 to specify a year without a month and day.",
        ).optional(),
        year: z.number().int().describe(
          "Year of the date. Must be from 1 to 9999, or 0 to specify a date without a year.",
        ).optional(),
      }).describe(
        "Required. The calendar date this special hour period starts on.",
      ).optional(),
    })).describe(
      "Required. A list of exceptions to the business's regular hours.",
    ).optional(),
  }).describe(
    "Optional. Special hours for the business. This typically includes holiday hours, and other times outside of regular operating hours. These override regular business hours. This field cannot be set without regular hours.",
  ).optional(),
  storeCode: z.string().describe(
    "Optional. External identifier for this location, which must be unique within a given account. This is a means of associating the location with your own records.",
  ).optional(),
  storefrontAddress: z.object({
    addressLines: z.array(z.string()).describe(
      'Unstructured address lines describing the lower levels of an address. Because values in `address_lines` do not have type information and may sometimes contain multiple values in a single field (for example, "Austin, TX"), it is important that the line order is clear. The order of address lines should be "envelope order" for the country or region of the address. In places where this can vary (for example, Japan), `address_language` is used to make it explicit (for example, "ja" for large-to-small ordering and "ja-Latn" or "en" for small-to-large). In this way, the most specific line of an address can be selected based on the language. The minimum permitted structural representation of an address consists of a `region_code` with all remaining information placed in the `address_lines`. It would be possible to format such an address very approximately without geocoding, but no semantic reasoning could be made about any of the address components until it was at least partially resolved. Creating an address only containing a `region_code` and `address_lines` and then geocoding is the recommended way to handle completely unstructured addresses (as opposed to guessing which parts of the address should be localities or administrative areas).',
    ).optional(),
    administrativeArea: z.string().describe(
      'Optional. Highest administrative subdivision which is used for postal addresses of a country or region. For example, this can be a state, a province, an oblast, or a prefecture. For Spain, this is the province and not the autonomous community (for example, "Barcelona" and not "Catalonia"). Many countries don\'t use an administrative area in postal addresses. For example, in Switzerland, this should be left unpopulated.',
    ).optional(),
    languageCode: z.string().describe(
      'Optional. BCP-47 language code of the contents of this address (if known). This is often the UI language of the input form or is expected to match one of the languages used in the address\' country/region, or their transliterated equivalents. This can affect formatting in certain countries, but is not critical to the correctness of the data and will never affect any validation or other non-formatting related operations. If this value is not known, it should be omitted (rather than specifying a possibly incorrect default). Examples: "zh-Hant", "ja", "ja-Latn", "en".',
    ).optional(),
    locality: z.string().describe(
      "Optional. Generally refers to the city or town portion of the address. Examples: US city, IT comune, UK post town. In regions of the world where localities are not well defined or do not fit into this structure well, leave `locality` empty and use `address_lines`.",
    ).optional(),
    organization: z.string().describe(
      "Optional. The name of the organization at the address.",
    ).optional(),
    postalCode: z.string().describe(
      "Optional. Postal code of the address. Not all countries use or require postal codes to be present, but where they are used, they may trigger additional validation with other parts of the address (for example, state or zip code validation in the United States).",
    ).optional(),
    recipients: z.array(z.string()).describe(
      'Optional. The recipient at the address. This field may, under certain circumstances, contain multiline information. For example, it might contain "care of" information.',
    ).optional(),
    regionCode: z.string().describe(
      'Required. CLDR region code of the country/region of the address. This is never inferred and it is up to the user to ensure the value is correct. See https://cldr.unicode.org/ and https://www.unicode.org/cldr/charts/30/supplemental/territory_information.html for details. Example: "CH" for Switzerland.',
    ).optional(),
    revision: z.number().int().describe(
      "The schema revision of the `PostalAddress`. This must be set to 0, which is the latest revision. All new revisions **must** be backward compatible with old revisions.",
    ).optional(),
    sortingCode: z.string().describe(
      'Optional. Additional, country-specific, sorting code. This is not used in most regions. Where it is used, the value is either a string like "CEDEX", optionally followed by a number (for example, "CEDEX 7"), or just a number alone, representing the "sector code" (Jamaica), "delivery area indicator" (Malawi) or "post office indicator" (Côte d\'Ivoire).',
    ).optional(),
    sublocality: z.string().describe(
      "Optional. Sublocality of the address. For example, this can be a neighborhood, borough, or district.",
    ).optional(),
  }).describe(
    "Optional. A precise, accurate address to describe your business location. PO boxes or mailboxes located at remote locations are not acceptable. At this time, you can specify a maximum of five `address_lines` values in the address. This field should only be set for businesses that have a storefront. This field should not be set for locations of type `CUSTOMER_LOCATION_ONLY` but if set, any value provided will be discarded.",
  ).optional(),
  title: z.string().describe(
    'Required. Location name should reflect your business\'s real-world name, as used consistently on your storefront, website, and stationery, and as known to customers. Any additional information, when relevant, can be included in other fields of the resource (for example, `Address`, `Categories`). Don\'t add unnecessary information to your name (for example, prefer "Google" over "Google Inc. - Mountain View Corporate Headquarters"). Don\'t include marketing taglines, store codes, special characters, hours or closed/open status, phone numbers, website URLs, service/product information, location/address or directions, or containment information (for example, "Chase ATM in Duane Reade").',
  ).optional(),
  websiteUri: z.string().describe(
    "Optional. A URL for this business. If possible, use a URL that represents this individual business location instead of a generic website/URL that represents all locations, or the brand.",
  ).optional(),
});

const StateSchema = z.object({
  adWordsLocationExtensions: z.object({
    adPhone: z.string(),
  }).optional(),
  categories: z.object({
    additionalCategories: z.array(z.object({
      displayName: z.string(),
      moreHoursTypes: z.array(z.object({
        displayName: z.unknown(),
        hoursTypeId: z.unknown(),
        localizedDisplayName: z.unknown(),
      })),
      name: z.string(),
      serviceTypes: z.array(z.object({
        displayName: z.unknown(),
        serviceTypeId: z.unknown(),
      })),
    })),
    primaryCategory: z.object({
      displayName: z.string(),
      moreHoursTypes: z.array(z.object({
        displayName: z.string(),
        hoursTypeId: z.string(),
        localizedDisplayName: z.string(),
      })),
      name: z.string(),
      serviceTypes: z.array(z.object({
        displayName: z.string(),
        serviceTypeId: z.string(),
      })),
    }),
  }).optional(),
  labels: z.array(z.string()).optional(),
  languageCode: z.string().optional(),
  latlng: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }).optional(),
  metadata: z.object({
    canDelete: z.boolean(),
    canHaveBusinessCalls: z.boolean(),
    canHaveFoodMenus: z.boolean(),
    canModifyServiceList: z.boolean(),
    canOperateHealthData: z.boolean(),
    canOperateLocalPost: z.boolean(),
    canOperateLodgingData: z.boolean(),
    duplicateLocation: z.string(),
    hasGoogleUpdated: z.boolean(),
    hasPendingEdits: z.boolean(),
    hasVoiceOfMerchant: z.boolean(),
    isParticularlyPersonalPlace: z.boolean(),
    mapsUri: z.string(),
    newReviewUri: z.string(),
    placeId: z.string(),
  }).optional(),
  moreHours: z.array(z.object({
    hoursTypeId: z.string(),
    periods: z.array(z.object({
      closeDay: z.string(),
      closeTime: z.object({
        hours: z.unknown(),
        minutes: z.unknown(),
        nanos: z.unknown(),
        seconds: z.unknown(),
      }),
      openDay: z.string(),
      openTime: z.object({
        hours: z.unknown(),
        minutes: z.unknown(),
        nanos: z.unknown(),
        seconds: z.unknown(),
      }),
    })),
  })).optional(),
  name: z.string(),
  openInfo: z.object({
    canReopen: z.boolean(),
    openingDate: z.object({
      day: z.number(),
      month: z.number(),
      year: z.number(),
    }),
    status: z.string(),
  }).optional(),
  phoneNumbers: z.object({
    additionalPhones: z.array(z.string()),
    primaryPhone: z.string(),
  }).optional(),
  profile: z.object({
    description: z.string(),
  }).optional(),
  regularHours: z.object({
    periods: z.array(z.object({
      closeDay: z.string(),
      closeTime: z.object({
        hours: z.number(),
        minutes: z.number(),
        nanos: z.number(),
        seconds: z.number(),
      }),
      openDay: z.string(),
      openTime: z.object({
        hours: z.number(),
        minutes: z.number(),
        nanos: z.number(),
        seconds: z.number(),
      }),
    })),
  }).optional(),
  relationshipData: z.object({
    childrenLocations: z.array(z.object({
      placeId: z.string(),
      relationType: z.string(),
    })),
    parentChain: z.string(),
    parentLocation: z.object({
      placeId: z.string(),
      relationType: z.string(),
    }),
  }).optional(),
  serviceArea: z.object({
    businessType: z.string(),
    places: z.object({
      placeInfos: z.array(z.object({
        placeId: z.string(),
        placeName: z.string(),
      })),
    }),
    regionCode: z.string(),
  }).optional(),
  serviceItems: z.array(z.object({
    freeFormServiceItem: z.object({
      category: z.string(),
      label: z.object({
        description: z.string(),
        displayName: z.string(),
        languageCode: z.string(),
      }),
    }),
    price: z.object({
      currencyCode: z.string(),
      nanos: z.number(),
      units: z.string(),
    }),
    structuredServiceItem: z.object({
      description: z.string(),
      serviceTypeId: z.string(),
    }),
  })).optional(),
  specialHours: z.object({
    specialHourPeriods: z.array(z.object({
      closeTime: z.object({
        hours: z.number(),
        minutes: z.number(),
        nanos: z.number(),
        seconds: z.number(),
      }),
      closed: z.boolean(),
      endDate: z.object({
        day: z.number(),
        month: z.number(),
        year: z.number(),
      }),
      openTime: z.object({
        hours: z.number(),
        minutes: z.number(),
        nanos: z.number(),
        seconds: z.number(),
      }),
      startDate: z.object({
        day: z.number(),
        month: z.number(),
        year: z.number(),
      }),
    })),
  }).optional(),
  storeCode: z.string().optional(),
  storefrontAddress: z.object({
    addressLines: z.array(z.string()),
    administrativeArea: z.string(),
    languageCode: z.string(),
    locality: z.string(),
    organization: z.string(),
    postalCode: z.string(),
    recipients: z.array(z.string()),
    regionCode: z.string(),
    revision: z.number(),
    sortingCode: z.string(),
    sublocality: z.string(),
  }).optional(),
  title: z.string().optional(),
  websiteUri: z.string().optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  accessToken: z.string().meta({ sensitive: true }).optional(),
  credentialsJson: z.string().meta({ sensitive: true }).optional(),
  project: z.string().optional(),
  scopes: z.string().optional(),
  quotaProject: z.string().optional(),
  apiEndpoint: z.string().optional(),
  adWordsLocationExtensions: z.object({
    adPhone: z.string().describe(
      "Required. An alternate phone number to display on AdWords location extensions instead of the location's primary phone number.",
    ).optional(),
  }).describe("Optional. Additional information that is surfaced in AdWords.")
    .optional(),
  categories: z.object({
    additionalCategories: z.array(z.object({
      displayName: z.string().describe(
        "Output only. The human-readable name of the category. This is set when reading the location. When modifying the location, `category_id` must be set.",
      ).optional(),
      moreHoursTypes: z.array(z.object({
        displayName: z.unknown().describe(
          "Output only. The human-readable English display name for the hours type.",
        ).optional(),
        hoursTypeId: z.unknown().describe(
          "Output only. A stable ID provided by Google for this hours type.",
        ).optional(),
        localizedDisplayName: z.unknown().describe(
          "Output only. The human-readable localized display name for the hours type.",
        ).optional(),
      })).describe(
        "Output only. More hours types that are available for this business category.",
      ).optional(),
      name: z.string().describe(
        "Required. A stable ID (provided by Google) for this category. The value must be specified when modifying the category (when creating or updating a location).",
      ).optional(),
      serviceTypes: z.array(z.object({
        displayName: z.unknown().describe(
          "Output only. The human-readable display name for the service type.",
        ).optional(),
        serviceTypeId: z.unknown().describe(
          "Output only. A stable ID (provided by Google) for this service type.",
        ).optional(),
      })).describe(
        "Output only. A list of all the service types that are available for this business category.",
      ).optional(),
    })).describe(
      "Optional. Additional categories to describe your business. Categories help your customers find accurate, specific results for services they're interested in. To keep your business information accurate and live, make sure that you use as few categories as possible to describe your overall core business. Choose categories that are as specific as possible, but representative of your main business.",
    ).optional(),
    primaryCategory: z.object({
      displayName: z.string().describe(
        "Output only. The human-readable name of the category. This is set when reading the location. When modifying the location, `category_id` must be set.",
      ).optional(),
      moreHoursTypes: z.array(z.object({
        displayName: z.string().describe(
          "Output only. The human-readable English display name for the hours type.",
        ).optional(),
        hoursTypeId: z.string().describe(
          "Output only. A stable ID provided by Google for this hours type.",
        ).optional(),
        localizedDisplayName: z.string().describe(
          "Output only. The human-readable localized display name for the hours type.",
        ).optional(),
      })).describe(
        "Output only. More hours types that are available for this business category.",
      ).optional(),
      name: z.string().describe(
        "Required. A stable ID (provided by Google) for this category. The value must be specified when modifying the category (when creating or updating a location).",
      ).optional(),
      serviceTypes: z.array(z.object({
        displayName: z.string().describe(
          "Output only. The human-readable display name for the service type.",
        ).optional(),
        serviceTypeId: z.string().describe(
          "Output only. A stable ID (provided by Google) for this service type.",
        ).optional(),
      })).describe(
        "Output only. A list of all the service types that are available for this business category.",
      ).optional(),
    }).describe(
      "Required. Category that best describes the core business this location engages in.",
    ).optional(),
  }).describe("Optional. The different categories that describe the business.")
    .optional(),
  labels: z.array(z.string()).describe(
    "Optional. A collection of free-form strings to allow you to tag your business. These labels are NOT user facing; only you can see them. Must be between 1-255 characters per label.",
  ).optional(),
  languageCode: z.string().describe(
    "Immutable. The language of the location. Set during creation and not updateable.",
  ).optional(),
  latlng: z.object({
    latitude: z.number().describe(
      "The latitude in degrees. It must be in the range [-90.0, +90.0].",
    ).optional(),
    longitude: z.number().describe(
      "The longitude in degrees. It must be in the range [-180.0, +180.0].",
    ).optional(),
  }).describe(
    "Optional. User-provided latitude and longitude. When creating a location, this field is ignored if the provided address geocodes successfully. This field is only returned on get requests if the user-provided `latlng` value was accepted during create, or the `latlng` value was updated through the Google Business Profile website. This field can only be updated by approved clients.",
  ).optional(),
  metadata: z.object({
    canDelete: z.boolean().describe(
      "Output only. Indicates whether the location can be deleted using the API.",
    ).optional(),
    canHaveBusinessCalls: z.boolean().describe(
      "Output only. Indicates if the listing is eligible for business calls.",
    ).optional(),
    canHaveFoodMenus: z.boolean().describe(
      "Output only. Indicates if the listing is eligible for food menu.",
    ).optional(),
    canModifyServiceList: z.boolean().describe(
      "Output only. Indicates if the listing can modify the service list.",
    ).optional(),
    canOperateHealthData: z.boolean().describe(
      "Output only. Indicates whether the location can operate on Health data.",
    ).optional(),
    canOperateLocalPost: z.boolean().describe(
      "Output only. Deprecated: This field is no longer populated and will be removed in a future version.",
    ).optional(),
    canOperateLodgingData: z.boolean().describe(
      "Output only. Indicates whether the location can operate on Lodging data.",
    ).optional(),
    duplicateLocation: z.string().describe(
      "Output only. The location resource that this location duplicates.",
    ).optional(),
    hasGoogleUpdated: z.boolean().describe(
      "Output only. Indicates whether the place ID associated with this location has updates that need to be updated or rejected by the client. If this boolean is set, you should call the `getGoogleUpdated` method to look up information that's needs to be verified.",
    ).optional(),
    hasPendingEdits: z.boolean().describe(
      "Output only. Indicates whether any of this Location's properties are in the edit pending state.",
    ).optional(),
    hasVoiceOfMerchant: z.boolean().describe(
      "Output only. Indicates if the listing has Voice of Merchant. If this boolean is false, you should call the locations.getVoiceOfMerchantState API to get details as to why they do not have Voice of Merchant.",
    ).optional(),
    isParticularlyPersonalPlace: z.boolean().describe(
      "Output only. Indicates whether the location is classified as a particularly personal place. This means there are restrictions on Location History features. If you believe this was a mistake, see the [help center article](https://support.google.com/business/answer/3480441).",
    ).optional(),
    mapsUri: z.string().describe("Output only. A link to the location on Maps.")
      .optional(),
    newReviewUri: z.string().describe(
      "Output only. A link to the page on Google Search where a customer can leave a review for the location.",
    ).optional(),
    placeId: z.string().describe(
      "Output only. If this locationappears on Google Maps, this field is populated with the place ID for the location. This ID can be used in various Places APIs. This field can be set during Create calls, but not for Update.",
    ).optional(),
  }).describe("Output only. Additional non-user-editable information.")
    .optional(),
  moreHours: z.array(z.object({
    hoursTypeId: z.string().describe(
      "Required. Type of hours. Clients should call {#link businessCategories:BatchGet} to get supported hours types for categories of their locations.",
    ).optional(),
    periods: z.array(z.object({
      closeDay: z.enum([
        "DAY_OF_WEEK_UNSPECIFIED",
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY",
      ]).describe(
        "Required. Indicates the day of the week this period ends on.",
      ).optional(),
      closeTime: z.object({
        hours: z.unknown().describe(
          'Hours of a day in 24 hour format. Must be greater than or equal to 0 and typically must be less than or equal to 23. An API may choose to allow the value "24:00:00" for scenarios like business closing time.',
        ).optional(),
        minutes: z.unknown().describe(
          "Minutes of an hour. Must be greater than or equal to 0 and less than or equal to 59.",
        ).optional(),
        nanos: z.unknown().describe(
          "Fractions of seconds, in nanoseconds. Must be greater than or equal to 0 and less than or equal to 999,999,999.",
        ).optional(),
        seconds: z.unknown().describe(
          "Seconds of a minute. Must be greater than or equal to 0 and typically must be less than or equal to 59. An API may allow the value 60 if it allows leap-seconds.",
        ).optional(),
      }).describe(
        "Required. Valid values are 00:00-24:00, where 24:00 represents midnight at the end of the specified day field. Note: In Proto3 JSON mapping, default zero values (00:00) are omitted, producing `{}` for close_time.",
      ).optional(),
      openDay: z.enum([
        "DAY_OF_WEEK_UNSPECIFIED",
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY",
      ]).describe(
        "Required. Indicates the day of the week this period starts on.",
      ).optional(),
      openTime: z.object({
        hours: z.unknown().describe(
          'Hours of a day in 24 hour format. Must be greater than or equal to 0 and typically must be less than or equal to 23. An API may choose to allow the value "24:00:00" for scenarios like business closing time.',
        ).optional(),
        minutes: z.unknown().describe(
          "Minutes of an hour. Must be greater than or equal to 0 and less than or equal to 59.",
        ).optional(),
        nanos: z.unknown().describe(
          "Fractions of seconds, in nanoseconds. Must be greater than or equal to 0 and less than or equal to 999,999,999.",
        ).optional(),
        seconds: z.unknown().describe(
          "Seconds of a minute. Must be greater than or equal to 0 and typically must be less than or equal to 59. An API may allow the value 60 if it allows leap-seconds.",
        ).optional(),
      }).describe(
        "Required. Valid values are 00:00-24:00, where 24:00 represents midnight at the end of the specified day field. Note: In Proto3 JSON mapping, default zero values (00:00) are omitted, producing `{}` for open_time.",
      ).optional(),
    })).describe(
      "Required. A collection of times that this location is open. Each period represents a range of hours when the location is open during the week.",
    ).optional(),
  })).describe(
    "Optional. More hours for a business's different departments or specific customers.",
  ).optional(),
  name: z.string().describe(
    "Identifier. Google identifier for this location in the form: `locations/{location_id}`.",
  ).optional(),
  openInfo: z.object({
    canReopen: z.boolean().describe(
      "Output only. Indicates whether this business is eligible for re-open.",
    ).optional(),
    openingDate: z.object({
      day: z.number().int().describe(
        "Day of a month. Must be from 1 to 31 and valid for the year and month, or 0 to specify a year by itself or a year and month where the day isn't significant.",
      ).optional(),
      month: z.number().int().describe(
        "Month of a year. Must be from 1 to 12, or 0 to specify a year without a month and day.",
      ).optional(),
      year: z.number().int().describe(
        "Year of the date. Must be from 1 to 9999, or 0 to specify a date without a year.",
      ).optional(),
    }).describe(
      "Optional. The date on which the location first opened. If the exact day is not known, month and year only can be provided. The date must be in the past or be no more than one year in the future.",
    ).optional(),
    status: z.enum([
      "OPEN_FOR_BUSINESS_UNSPECIFIED",
      "OPEN",
      "CLOSED_PERMANENTLY",
      "CLOSED_TEMPORARILY",
    ]).describe(
      "Required. Indicates whether or not the Location is currently open for business. All locations are open by default, unless updated to be closed.",
    ).optional(),
  }).describe(
    "Optional. A flag that indicates whether the location is currently open for business.",
  ).optional(),
  phoneNumbers: z.object({
    additionalPhones: z.array(z.string()).describe(
      "Optional. Up to two phone numbers (mobile or landline, no fax) at which your business can be called, in addition to your primary phone number.",
    ).optional(),
    primaryPhone: z.string().describe(
      "Required. A phone number that connects to your individual business location as directly as possible. Use a local phone number instead of a central, call center helpline number whenever possible.",
    ).optional(),
  }).describe(
    "Optional. The different phone numbers that customers can use to get in touch with the business.",
  ).optional(),
  profile: z.object({
    description: z.string().describe(
      "Required. Description of the location in your own voice, not editable by anyone else.",
    ).optional(),
  }).describe(
    "Optional. Describes your business in your own voice and shares with users the unique story of your business and offerings. This field is required for all categories except lodging categories (e.g., hotels, motels, inns).",
  ).optional(),
  regularHours: z.object({
    periods: z.array(z.object({
      closeDay: z.enum([
        "DAY_OF_WEEK_UNSPECIFIED",
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY",
      ]).describe(
        "Required. Indicates the day of the week this period ends on.",
      ).optional(),
      closeTime: z.object({
        hours: z.number().int().describe(
          'Hours of a day in 24 hour format. Must be greater than or equal to 0 and typically must be less than or equal to 23. An API may choose to allow the value "24:00:00" for scenarios like business closing time.',
        ).optional(),
        minutes: z.number().int().describe(
          "Minutes of an hour. Must be greater than or equal to 0 and less than or equal to 59.",
        ).optional(),
        nanos: z.number().int().describe(
          "Fractions of seconds, in nanoseconds. Must be greater than or equal to 0 and less than or equal to 999,999,999.",
        ).optional(),
        seconds: z.number().int().describe(
          "Seconds of a minute. Must be greater than or equal to 0 and typically must be less than or equal to 59. An API may allow the value 60 if it allows leap-seconds.",
        ).optional(),
      }).describe(
        "Required. Valid values are 00:00-24:00, where 24:00 represents midnight at the end of the specified day field. Note: In Proto3 JSON mapping, default zero values (00:00) are omitted, producing `{}` for close_time.",
      ).optional(),
      openDay: z.enum([
        "DAY_OF_WEEK_UNSPECIFIED",
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY",
      ]).describe(
        "Required. Indicates the day of the week this period starts on.",
      ).optional(),
      openTime: z.object({
        hours: z.number().int().describe(
          'Hours of a day in 24 hour format. Must be greater than or equal to 0 and typically must be less than or equal to 23. An API may choose to allow the value "24:00:00" for scenarios like business closing time.',
        ).optional(),
        minutes: z.number().int().describe(
          "Minutes of an hour. Must be greater than or equal to 0 and less than or equal to 59.",
        ).optional(),
        nanos: z.number().int().describe(
          "Fractions of seconds, in nanoseconds. Must be greater than or equal to 0 and less than or equal to 999,999,999.",
        ).optional(),
        seconds: z.number().int().describe(
          "Seconds of a minute. Must be greater than or equal to 0 and typically must be less than or equal to 59. An API may allow the value 60 if it allows leap-seconds.",
        ).optional(),
      }).describe(
        "Required. Valid values are 00:00-24:00, where 24:00 represents midnight at the end of the specified day field. Note: In Proto3 JSON mapping, default zero values (00:00) are omitted, producing `{}` for open_time.",
      ).optional(),
    })).describe(
      "Required. A collection of times that this location is open for business. Each period represents a range of hours when the location is open during the week.",
    ).optional(),
  }).describe("Optional. Operating hours for the business.").optional(),
  relationshipData: z.object({
    childrenLocations: z.array(z.object({
      placeId: z.string().describe(
        "Required. Specify the location that is on the other side of the relation by its placeID.",
      ).optional(),
      relationType: z.enum([
        "RELATION_TYPE_UNSPECIFIED",
        "DEPARTMENT_OF",
        "INDEPENDENT_ESTABLISHMENT_IN",
      ]).describe("Required. The type of the relationship.").optional(),
    })).describe(
      "Optional. The list of children locations that this location has relations with.",
    ).optional(),
    parentChain: z.string().describe(
      "Optional. The resource name of the Chain that this location is member of. How to find Chain ID",
    ).optional(),
    parentLocation: z.object({
      placeId: z.string().describe(
        "Required. Specify the location that is on the other side of the relation by its placeID.",
      ).optional(),
      relationType: z.enum([
        "RELATION_TYPE_UNSPECIFIED",
        "DEPARTMENT_OF",
        "INDEPENDENT_ESTABLISHMENT_IN",
      ]).describe("Required. The type of the relationship.").optional(),
    }).describe(
      "Optional. The parent location that this location has relations with.",
    ).optional(),
  }).describe("Optional. All locations and chain related to this one.")
    .optional(),
  serviceArea: z.object({
    businessType: z.enum([
      "BUSINESS_TYPE_UNSPECIFIED",
      "CUSTOMER_LOCATION_ONLY",
      "CUSTOMER_AND_BUSINESS_LOCATION",
    ]).describe("Required. Indicates the type of the service area business.")
      .optional(),
    places: z.object({
      placeInfos: z.array(z.object({
        placeId: z.string().describe(
          "Required. The ID of the place. Must correspond to a region. (https://developers.google.com/places/web-service/supported_types#table3)",
        ).optional(),
        placeName: z.string().describe(
          "Required. The localized name of the place. For example, `Scottsdale, AZ`.",
        ).optional(),
      })).describe(
        "Optional. The areas represented by place IDs. Limited to a maximum of 20 places.",
      ).optional(),
    }).describe(
      "Optional. The area that this business serves defined through a set of places.",
    ).optional(),
    regionCode: z.string().describe(
      'Immutable. CLDR region code of the country/region that this service area business is based in. See http://cldr.unicode.org/ and http://www.unicode.org/cldr/charts/30/supplemental/territory_information.html for details. Example: "CH" for Switzerland. This field is required for CUSTOMER_LOCATION_ONLY businesses, and is ignored otherwise. The region specified here can be different from regions for the areas that this business serves (e.g. service area businesses that provide services in regions other than the one that they are based in). If this location requires verification after creation, the address provided for verification purposes *must* be located within this region, and the business owner or their authorized representative *must* be able to receive postal mail at the provided verification address.',
    ).optional(),
  }).describe(
    "Optional. Service area businesses provide their service at the customer's location. If this business is a service area business, this field describes the area(s) serviced by the business.",
  ).optional(),
  serviceItems: z.array(z.object({
    freeFormServiceItem: z.object({
      category: z.string().describe(
        "Required. This field represents the category name (i.e. the category's stable ID). The `category` and `service_type_id` should match the possible combinations provided in the `Category` message.",
      ).optional(),
      label: z.object({
        description: z.string().describe(
          "Optional. Description of the price list, section, or item.",
        ).optional(),
        displayName: z.string().describe(
          "Required. Display name for the price list, section, or item.",
        ).optional(),
        languageCode: z.string().describe(
          "Optional. The BCP-47 language code that these strings apply for. Only one set of labels may be set per language.",
        ).optional(),
      }).describe(
        "Required. Language-tagged labels for the item. We recommend that item names be 140 characters or less, and descriptions 250 characters or less. This field should only be set if the input is a custom service item. Standardized service types should be updated using service_type_id.",
      ).optional(),
    }).describe(
      "Optional. This field will be set case of free-form services data.",
    ).optional(),
    price: z.object({
      currencyCode: z.string().describe(
        "The three-letter currency code defined in ISO 4217.",
      ).optional(),
      nanos: z.number().int().describe(
        "Number of nano (10^-9) units of the amount. The value must be between -999,999,999 and +999,999,999 inclusive. If `units` is positive, `nanos` must be positive or zero. If `units` is zero, `nanos` can be positive, zero, or negative. If `units` is negative, `nanos` must be negative or zero. For example $-1.75 is represented as `units`=-1 and `nanos`=-750,000,000.",
      ).optional(),
      units: z.string().describe(
        'The whole units of the amount. For example if `currencyCode` is `"USD"`, then 1 unit is one US dollar.',
      ).optional(),
    }).describe(
      "Optional. Represents the monetary price of the service item. We recommend that currency_code and units should be set when including a price. This will be treated as a fixed price for the service item.",
    ).optional(),
    structuredServiceItem: z.object({
      description: z.string().describe(
        "Optional. Description of structured service item. The character limit is 300.",
      ).optional(),
      serviceTypeId: z.string().describe(
        "Required. The `service_type_id` field is a Google provided unique ID that can be found in `ServiceType`. This information is provided by `BatchGetCategories` rpc service.",
      ).optional(),
    }).describe(
      "Optional. This field will be set case of structured services data.",
    ).optional(),
  })).describe(
    "Optional. List of services supported by merchants. A service can be haircut, install water heater, etc. Duplicated service items will be removed automatically.",
  ).optional(),
  specialHours: z.object({
    specialHourPeriods: z.array(z.object({
      closeTime: z.object({
        hours: z.number().int().describe(
          'Hours of a day in 24 hour format. Must be greater than or equal to 0 and typically must be less than or equal to 23. An API may choose to allow the value "24:00:00" for scenarios like business closing time.',
        ).optional(),
        minutes: z.number().int().describe(
          "Minutes of an hour. Must be greater than or equal to 0 and less than or equal to 59.",
        ).optional(),
        nanos: z.number().int().describe(
          "Fractions of seconds, in nanoseconds. Must be greater than or equal to 0 and less than or equal to 999,999,999.",
        ).optional(),
        seconds: z.number().int().describe(
          "Seconds of a minute. Must be greater than or equal to 0 and typically must be less than or equal to 59. An API may allow the value 60 if it allows leap-seconds.",
        ).optional(),
      }).describe(
        "Optional. Valid values are 00:00-24:00, where 24:00 represents midnight at the end of the specified day field. Must be specified if `closed` is false.",
      ).optional(),
      closed: z.boolean().describe(
        "Optional. If true, `end_date`, `open_time`, and `close_time` are ignored, and the date specified in `start_date` is treated as the location being closed for the entire day.",
      ).optional(),
      endDate: z.object({
        day: z.number().int().describe(
          "Day of a month. Must be from 1 to 31 and valid for the year and month, or 0 to specify a year by itself or a year and month where the day isn't significant.",
        ).optional(),
        month: z.number().int().describe(
          "Month of a year. Must be from 1 to 12, or 0 to specify a year without a month and day.",
        ).optional(),
        year: z.number().int().describe(
          "Year of the date. Must be from 1 to 9999, or 0 to specify a date without a year.",
        ).optional(),
      }).describe(
        "Optional. The calendar date this special hour period ends on. If `end_date` field is not set, default to the date specified in `start_date`. If set, this field must be equal to or at most 1 day after `start_date`.",
      ).optional(),
      openTime: z.object({
        hours: z.number().int().describe(
          'Hours of a day in 24 hour format. Must be greater than or equal to 0 and typically must be less than or equal to 23. An API may choose to allow the value "24:00:00" for scenarios like business closing time.',
        ).optional(),
        minutes: z.number().int().describe(
          "Minutes of an hour. Must be greater than or equal to 0 and less than or equal to 59.",
        ).optional(),
        nanos: z.number().int().describe(
          "Fractions of seconds, in nanoseconds. Must be greater than or equal to 0 and less than or equal to 999,999,999.",
        ).optional(),
        seconds: z.number().int().describe(
          "Seconds of a minute. Must be greater than or equal to 0 and typically must be less than or equal to 59. An API may allow the value 60 if it allows leap-seconds.",
        ).optional(),
      }).describe(
        "Optional. Valid values are 00:00-24:00 where 24:00 represents midnight at the end of the specified day field. Must be specified if `closed` is false.",
      ).optional(),
      startDate: z.object({
        day: z.number().int().describe(
          "Day of a month. Must be from 1 to 31 and valid for the year and month, or 0 to specify a year by itself or a year and month where the day isn't significant.",
        ).optional(),
        month: z.number().int().describe(
          "Month of a year. Must be from 1 to 12, or 0 to specify a year without a month and day.",
        ).optional(),
        year: z.number().int().describe(
          "Year of the date. Must be from 1 to 9999, or 0 to specify a date without a year.",
        ).optional(),
      }).describe(
        "Required. The calendar date this special hour period starts on.",
      ).optional(),
    })).describe(
      "Required. A list of exceptions to the business's regular hours.",
    ).optional(),
  }).describe(
    "Optional. Special hours for the business. This typically includes holiday hours, and other times outside of regular operating hours. These override regular business hours. This field cannot be set without regular hours.",
  ).optional(),
  storeCode: z.string().describe(
    "Optional. External identifier for this location, which must be unique within a given account. This is a means of associating the location with your own records.",
  ).optional(),
  storefrontAddress: z.object({
    addressLines: z.array(z.string()).describe(
      'Unstructured address lines describing the lower levels of an address. Because values in `address_lines` do not have type information and may sometimes contain multiple values in a single field (for example, "Austin, TX"), it is important that the line order is clear. The order of address lines should be "envelope order" for the country or region of the address. In places where this can vary (for example, Japan), `address_language` is used to make it explicit (for example, "ja" for large-to-small ordering and "ja-Latn" or "en" for small-to-large). In this way, the most specific line of an address can be selected based on the language. The minimum permitted structural representation of an address consists of a `region_code` with all remaining information placed in the `address_lines`. It would be possible to format such an address very approximately without geocoding, but no semantic reasoning could be made about any of the address components until it was at least partially resolved. Creating an address only containing a `region_code` and `address_lines` and then geocoding is the recommended way to handle completely unstructured addresses (as opposed to guessing which parts of the address should be localities or administrative areas).',
    ).optional(),
    administrativeArea: z.string().describe(
      'Optional. Highest administrative subdivision which is used for postal addresses of a country or region. For example, this can be a state, a province, an oblast, or a prefecture. For Spain, this is the province and not the autonomous community (for example, "Barcelona" and not "Catalonia"). Many countries don\'t use an administrative area in postal addresses. For example, in Switzerland, this should be left unpopulated.',
    ).optional(),
    languageCode: z.string().describe(
      'Optional. BCP-47 language code of the contents of this address (if known). This is often the UI language of the input form or is expected to match one of the languages used in the address\' country/region, or their transliterated equivalents. This can affect formatting in certain countries, but is not critical to the correctness of the data and will never affect any validation or other non-formatting related operations. If this value is not known, it should be omitted (rather than specifying a possibly incorrect default). Examples: "zh-Hant", "ja", "ja-Latn", "en".',
    ).optional(),
    locality: z.string().describe(
      "Optional. Generally refers to the city or town portion of the address. Examples: US city, IT comune, UK post town. In regions of the world where localities are not well defined or do not fit into this structure well, leave `locality` empty and use `address_lines`.",
    ).optional(),
    organization: z.string().describe(
      "Optional. The name of the organization at the address.",
    ).optional(),
    postalCode: z.string().describe(
      "Optional. Postal code of the address. Not all countries use or require postal codes to be present, but where they are used, they may trigger additional validation with other parts of the address (for example, state or zip code validation in the United States).",
    ).optional(),
    recipients: z.array(z.string()).describe(
      'Optional. The recipient at the address. This field may, under certain circumstances, contain multiline information. For example, it might contain "care of" information.',
    ).optional(),
    regionCode: z.string().describe(
      'Required. CLDR region code of the country/region of the address. This is never inferred and it is up to the user to ensure the value is correct. See https://cldr.unicode.org/ and https://www.unicode.org/cldr/charts/30/supplemental/territory_information.html for details. Example: "CH" for Switzerland.',
    ).optional(),
    revision: z.number().int().describe(
      "The schema revision of the `PostalAddress`. This must be set to 0, which is the latest revision. All new revisions **must** be backward compatible with old revisions.",
    ).optional(),
    sortingCode: z.string().describe(
      'Optional. Additional, country-specific, sorting code. This is not used in most regions. Where it is used, the value is either a string like "CEDEX", optionally followed by a number (for example, "CEDEX 7"), or just a number alone, representing the "sector code" (Jamaica), "delivery area indicator" (Malawi) or "post office indicator" (Côte d\'Ivoire).',
    ).optional(),
    sublocality: z.string().describe(
      "Optional. Sublocality of the address. For example, this can be a neighborhood, borough, or district.",
    ).optional(),
  }).describe(
    "Optional. A precise, accurate address to describe your business location. PO boxes or mailboxes located at remote locations are not acceptable. At this time, you can specify a maximum of five `address_lines` values in the address. This field should only be set for businesses that have a storefront. This field should not be set for locations of type `CUSTOMER_LOCATION_ONLY` but if set, any value provided will be discarded.",
  ).optional(),
  title: z.string().describe(
    'Required. Location name should reflect your business\'s real-world name, as used consistently on your storefront, website, and stationery, and as known to customers. Any additional information, when relevant, can be included in other fields of the resource (for example, `Address`, `Categories`). Don\'t add unnecessary information to your name (for example, prefer "Google" over "Google Inc. - Mountain View Corporate Headquarters"). Don\'t include marketing taglines, store codes, special characters, hours or closed/open status, phone numbers, website URLs, service/product information, location/address or directions, or containment information (for example, "Chase ATM in Duane Reade").',
  ).optional(),
  websiteUri: z.string().describe(
    "Optional. A URL for this business. If possible, use a URL that represents this individual business location instead of a generic website/URL that represents all locations, or the brand.",
  ).optional(),
});

const _credentialKeys = new Set([
  "accessToken",
  "credentialsJson",
  "project",
  "scopes",
  "quotaProject",
  "apiEndpoint",
]);

function _buildGcpCredentials(
  g: Record<string, unknown>,
): ExplicitGcpCredentials {
  return {
    accessToken: g.accessToken as string | undefined,
    credentialsJson: g.credentialsJson as string | undefined,
    project: g.project as string | undefined,
    scopes: typeof g.scopes === "string"
      ? g.scopes.split(",").map((s: string) => s.trim())
      : undefined,
    quotaProject: g.quotaProject as string | undefined,
  };
}

/** Swamp extension model for Google Cloud My Business Business Information Locations. Registered at `@swamp/gcp/mybusinessbusinessinformation/locations`. */
export const model = {
  type: "@swamp/gcp/mybusinessbusinessinformation/locations",
  version: "2026.09.17.1",
  upgrades: [
    {
      toVersion: "2026.04.01.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.04.02.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.04.03.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.04.03.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.04.03.3",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.04.04.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.04.07.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.04.23.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.18.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.18.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.19.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.19.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.20.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.21.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.21.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.24.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.25.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.26.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.06.07.1",
      description: "Added: accessToken, credentialsJson, project",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.06.08.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.17.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.18.1",
      description: "Added: scopes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.18.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.19.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.20.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.20.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.21.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.21.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.21.3",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.21.4",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.29.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.12.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.28.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.07.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.17.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description:
        "A location. See the [help center article] (https://support.google.com/busines...",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    get: {
      description: "Get a locations",
      arguments: z.object({
        identifier: z.string().describe("The name of the locations"),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        params["name"] = args.identifier;
        const result = await readResource(
          baseUrl,
          GET_CONFIG,
          params,
          credentials,
        ) as StateData;
        const instanceName =
          ((g.name ?? result.name)?.toString() ?? args.identifier).replace(
            /[\/\\]/g,
            "_",
          ).replace(/\.\./g, "_").replace(/\0/g, "");
        const handle = await context.writeResource(
          "state",
          instanceName,
          result,
        );
        return { dataHandles: [handle] };
      },
    },
    update: {
      description: "Update locations attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific locations by name (e.g. one discovered by list)",
        ).optional(),
      }),
      execute: async (args: { identifier?: string }, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const instanceName =
          (g.name?.toString() ?? args.identifier ?? "current").replace(
            /[\/\\]/g,
            "_",
          ).replace(/\.\./g, "_").replace(/\0/g, "");
        const content = await context.dataRepository.getContent(
          context.modelType,
          context.modelId,
          instanceName,
        );
        if (!content) {
          throw new Error(
            "No existing state found - run create, get, or list first",
          );
        }
        const existing = JSON.parse(new TextDecoder().decode(content));
        const params: Record<string, string> = { project: projectId };
        params["name"] = existing["name"]?.toString() ?? "";
        const body: Record<string, unknown> = {};
        if (g["adWordsLocationExtensions"] !== undefined) {
          body["adWordsLocationExtensions"] = g["adWordsLocationExtensions"];
        }
        if (g["categories"] !== undefined) body["categories"] = g["categories"];
        if (g["labels"] !== undefined) body["labels"] = g["labels"];
        if (g["languageCode"] !== undefined) {
          body["languageCode"] = g["languageCode"];
        }
        if (g["latlng"] !== undefined) body["latlng"] = g["latlng"];
        if (g["metadata"] !== undefined) body["metadata"] = g["metadata"];
        if (g["moreHours"] !== undefined) body["moreHours"] = g["moreHours"];
        if (g["openInfo"] !== undefined) body["openInfo"] = g["openInfo"];
        if (g["phoneNumbers"] !== undefined) {
          body["phoneNumbers"] = g["phoneNumbers"];
        }
        if (g["profile"] !== undefined) body["profile"] = g["profile"];
        if (g["regularHours"] !== undefined) {
          body["regularHours"] = g["regularHours"];
        }
        if (g["relationshipData"] !== undefined) {
          body["relationshipData"] = g["relationshipData"];
        }
        if (g["serviceArea"] !== undefined) {
          body["serviceArea"] = g["serviceArea"];
        }
        if (g["serviceItems"] !== undefined) {
          body["serviceItems"] = g["serviceItems"];
        }
        if (g["specialHours"] !== undefined) {
          body["specialHours"] = g["specialHours"];
        }
        if (g["storeCode"] !== undefined) body["storeCode"] = g["storeCode"];
        if (g["storefrontAddress"] !== undefined) {
          body["storefrontAddress"] = g["storefrontAddress"];
        }
        if (g["title"] !== undefined) body["title"] = g["title"];
        if (g["websiteUri"] !== undefined) body["websiteUri"] = g["websiteUri"];
        const updateMaskKeys = Object.keys(body);
        if (updateMaskKeys.length > 0) {
          params["updateMask"] = updateMaskKeys.join(",");
        }
        for (const key of Object.keys(existing)) {
          if (
            key === "fingerprint" || key === "labelFingerprint" ||
            key === "etag" || key.endsWith("Fingerprint")
          ) {
            body[key] = existing[key];
          }
        }
        const result = await updateResource(
          baseUrl,
          PATCH_CONFIG,
          params,
          body,
          GET_CONFIG,
          undefined,
          credentials,
        ) as StateData;
        const handle = await context.writeResource(
          "state",
          instanceName,
          result,
        );
        return { dataHandles: [handle] };
      },
    },
    delete: {
      description: "Delete the locations",
      arguments: z.object({
        identifier: z.string().describe("The name of the locations"),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        params["name"] = args.identifier;
        const { existed } = await deleteResource(
          baseUrl,
          DELETE_CONFIG,
          params,
          credentials,
        );
        const instanceName = (g.name?.toString() ?? args.identifier).replace(
          /[\/\\]/g,
          "_",
        ).replace(/\.\./g, "_").replace(/\0/g, "");
        const handle = await context.writeResource("state", instanceName, {
          identifier: args.identifier,
          existed,
          status: existed ? "deleted" : "not_found",
          deletedAt: new Date().toISOString(),
        });
        return { dataHandles: [handle] };
      },
    },
    sync: {
      description: "Sync locations state from GCP",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific locations by name (e.g. one discovered by list)",
        ).optional(),
      }),
      execute: async (args: { identifier?: string }, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const instanceName =
          (g.name?.toString() ?? args.identifier ?? "current").replace(
            /[\/\\]/g,
            "_",
          ).replace(/\.\./g, "_").replace(/\0/g, "");
        const content = await context.dataRepository.getContent(
          context.modelType,
          context.modelId,
          instanceName,
        );
        if (!content) {
          throw new Error(
            "No existing state found - run create, get, or list first",
          );
        }
        const existing = JSON.parse(new TextDecoder().decode(content));
        try {
          const params: Record<string, string> = { project: projectId };
          const identifier = existing.name?.toString() ?? g["name"]?.toString();
          if (!identifier) {
            throw new Error(
              "No identifier found in existing state or globalArgs",
            );
          }
          params["name"] = identifier;
          const result = await readResource(
            baseUrl,
            GET_CONFIG,
            params,
            credentials,
          ) as StateData;
          const handle = await context.writeResource(
            "state",
            instanceName,
            result,
          );
          return { dataHandles: [handle] };
        } catch (error: unknown) {
          if (isResourceNotFoundError(error)) {
            const handle = await context.writeResource("state", instanceName, {
              status: "not_found",
              syncedAt: new Date().toISOString(),
            });
            return { dataHandles: [handle] };
          }
          throw error;
        }
      },
    },
    get_attributes: {
      description: "get attributes",
      arguments: z.object({}),
      execute: async (_args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["name"] !== undefined) params["name"] = String(g["name"]);
        const result = await createResource(
          baseUrl,
          {
            "id": "mybusinessbusinessinformation.locations.getAttributes",
            "path": "v1/{+name}",
            "httpMethod": "GET",
            "parameterOrder": ["name"],
            "parameters": { "name": { "location": "path", "required": true } },
          },
          params,
          undefined,
          undefined,
          undefined,
          undefined,
          credentials,
        );
        return { result };
      },
    },
    get_google_updated: {
      description: "get google updated",
      arguments: z.object({
        readMask: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["name"] !== undefined) params["name"] = String(g["name"]);
        if (args["readMask"] !== undefined) {
          params["readMask"] = String(args["readMask"]);
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "mybusinessbusinessinformation.locations.getGoogleUpdated",
            "path": "v1/{+name}:getGoogleUpdated",
            "httpMethod": "GET",
            "parameterOrder": ["name"],
            "parameters": {
              "name": { "location": "path", "required": true },
              "readMask": { "location": "query" },
            },
          },
          params,
          undefined,
          undefined,
          undefined,
          undefined,
          credentials,
        );
        return { result };
      },
    },
    update_attributes: {
      description: "update attributes",
      arguments: z.object({
        attributes: z.any().optional(),
        name: z.any().optional(),
        attributeMask: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["name"] !== undefined) params["name"] = String(g["name"]);
        if (args["attributeMask"] !== undefined) {
          params["attributeMask"] = String(args["attributeMask"]);
        }
        const body: Record<string, unknown> = {};
        if (args["attributes"] !== undefined) {
          body["attributes"] = args["attributes"];
        }
        if (args["name"] !== undefined) body["name"] = args["name"];
        const result = await createResource(
          baseUrl,
          {
            "id": "mybusinessbusinessinformation.locations.updateAttributes",
            "path": "v1/{+name}",
            "httpMethod": "PATCH",
            "parameterOrder": ["name"],
            "parameters": {
              "attributeMask": { "location": "query" },
              "name": { "location": "path", "required": true },
            },
          },
          params,
          body,
          undefined,
          undefined,
          undefined,
          credentials,
        );
        return { result };
      },
    },
  },
};

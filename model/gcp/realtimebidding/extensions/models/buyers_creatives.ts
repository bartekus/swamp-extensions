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

// Auto-generated extension model for @swamp/gcp/realtimebidding/buyers-creatives
// Do not edit manually. Re-generate with: deno task generate:gcp

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Google Cloud Real-time Bidding Buyers.Creatives.
 *
 * A creative and its classification data.
 *
 * Wraps the GCP resource as a swamp model so create, get, update,
 * delete, and sync can be driven through `swamp model`.
 *
 * @module
 */

import { z } from "npm:zod@4.3.6";
import {
  createResource,
  type ExplicitGcpCredentials,
  getProjectId,
  isResourceNotFoundError,
  listResources,
  readResource,
  updateResource,
} from "./_lib/gcp.ts";

/** Construct the fully-qualified resource name from parent and short name. */
function buildResourceName(parent: string, shortName: string): string {
  return `${parent}/creatives/${shortName}`;
}

const BASE_URL = "https://realtimebidding.googleapis.com/";

const GET_CONFIG = {
  "id": "realtimebidding.buyers.creatives.get",
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
    "view": {
      "location": "query",
    },
  },
} as const;

const INSERT_CONFIG = {
  "id": "realtimebidding.buyers.creatives.create",
  "path": "v1/{+parent}/creatives",
  "httpMethod": "POST",
  "parameterOrder": [
    "parent",
  ],
  "parameters": {
    "parent": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const PATCH_CONFIG = {
  "id": "realtimebidding.buyers.creatives.patch",
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
  },
} as const;

const LIST_CONFIG = {
  "id": "realtimebidding.buyers.creatives.list",
  "path": "v1/{+parent}/creatives",
  "httpMethod": "GET",
  "parameterOrder": [
    "parent",
  ],
  "parameters": {
    "filter": {
      "location": "query",
    },
    "pageSize": {
      "location": "query",
    },
    "pageToken": {
      "location": "query",
    },
    "parent": {
      "location": "path",
      "required": true,
    },
    "view": {
      "location": "query",
    },
  },
} as const;

const _defaultOAuthScopes: string[] = [
  "https://www.googleapis.com/auth/realtime-bidding",
];

const GlobalArgsSchema = z.object({
  name: z.string().describe(
    "Instance name for this resource (used as the unique identifier in the factory pattern)",
  ),
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
  adChoicesDestinationUrl: z.string().describe(
    "The link to AdChoices destination page. This is only supported for native ads.",
  ).optional(),
  advertiserName: z.string().describe(
    "The name of the company being advertised in the creative. Can be used to filter the response of the creatives.list method.",
  ).optional(),
  agencyId: z.string().describe("The agency ID for this creative.").optional(),
  creativeId: z.string().describe(
    "Buyer-specific creative ID that references this creative in bid responses. This field is Ignored in update operations. Can be used to filter the response of the creatives.list method. The maximum length of the creative ID is 128 bytes.",
  ).optional(),
  declaredAttributes: z.array(
    z.enum([
      "ATTRIBUTE_UNSPECIFIED",
      "IMAGE_RICH_MEDIA",
      "ADOBE_FLASH_FLV",
      "IS_TAGGED",
      "IS_COOKIE_TARGETED",
      "IS_USER_INTEREST_TARGETED",
      "EXPANDING_DIRECTION_NONE",
      "EXPANDING_DIRECTION_UP",
      "EXPANDING_DIRECTION_DOWN",
      "EXPANDING_DIRECTION_LEFT",
      "EXPANDING_DIRECTION_RIGHT",
      "EXPANDING_DIRECTION_UP_LEFT",
      "EXPANDING_DIRECTION_UP_RIGHT",
      "EXPANDING_DIRECTION_DOWN_LEFT",
      "EXPANDING_DIRECTION_DOWN_RIGHT",
      "CREATIVE_TYPE_HTML",
      "CREATIVE_TYPE_VAST_VIDEO",
      "EXPANDING_DIRECTION_UP_OR_DOWN",
      "EXPANDING_DIRECTION_LEFT_OR_RIGHT",
      "EXPANDING_DIRECTION_ANY_DIAGONAL",
      "EXPANDING_ACTION_ROLLOVER_TO_EXPAND",
      "INSTREAM_VAST_VIDEO_TYPE_VPAID_FLASH",
      "RICH_MEDIA_CAPABILITY_TYPE_MRAID",
      "RICH_MEDIA_CAPABILITY_TYPE_FLASH",
      "RICH_MEDIA_CAPABILITY_TYPE_HTML5",
      "SKIPPABLE_INSTREAM_VIDEO",
      "RICH_MEDIA_CAPABILITY_TYPE_SSL",
      "RICH_MEDIA_CAPABILITY_TYPE_NON_SSL",
      "RICH_MEDIA_CAPABILITY_TYPE_INTERSTITIAL",
      "NON_SKIPPABLE_INSTREAM_VIDEO",
      "NATIVE_ELIGIBILITY_ELIGIBLE",
      "NON_VPAID",
      "NATIVE_ELIGIBILITY_NOT_ELIGIBLE",
      "ANY_INTERSTITIAL",
      "NON_INTERSTITIAL",
      "IN_BANNER_VIDEO",
      "RENDERING_SIZELESS_ADX",
      "OMSDK_1_0",
      "RENDERING_PLAYABLE",
    ]),
  ).describe(
    'All declared attributes for the ads that may be shown from this creative. Can be used to filter the response of the creatives.list method. If the `excluded_attribute` field of a [bid request](https://developers.google.com/authorized-buyers/rtb/downloads/realtime-bidding-proto") contains one of the attributes that were declared or detected for a given creative, and a bid is submitted with that creative, the bid will be filtered before the auction.',
  ).optional(),
  declaredClickThroughUrls: z.array(z.string()).describe(
    "The set of declared destination URLs for the creative. Can be used to filter the response of the creatives.list method.",
  ).optional(),
  declaredVendorIds: z.array(z.number().int()).describe(
    "IDs for the declared ad technology vendors that may be used by this creative. See https://storage.googleapis.com/adx-rtb-dictionaries/vendors.txt for possible values. Can be used to filter the response of the creatives.list method.",
  ).optional(),
  html: z.object({
    height: z.number().int().describe(
      "The height of the HTML snippet in pixels. Can be used to filter the response of the creatives.list method.",
    ).optional(),
    snippet: z.string().describe(
      "The HTML snippet that displays the ad when inserted in the web page.",
    ).optional(),
    width: z.number().int().describe(
      "The width of the HTML snippet in pixels. Can be used to filter the response of the creatives.list method.",
    ).optional(),
  }).describe("An HTML creative.").optional(),
  impressionTrackingUrls: z.array(z.string()).describe(
    "The set of URLs to be called to record an impression.",
  ).optional(),
  native: z.object({
    advertiserName: z.string().describe(
      "The name of the advertiser or sponsor, to be displayed in the ad creative.",
    ).optional(),
    appIcon: z.object({
      height: z.number().int().describe("Image height in pixels.").optional(),
      url: z.string().describe("The URL of the image.").optional(),
      width: z.number().int().describe("Image width in pixels.").optional(),
    }).describe("The app icon, for app download ads.").optional(),
    body: z.string().describe("A long description of the ad.").optional(),
    callToAction: z.string().describe(
      "A label for the button that the user is supposed to click.",
    ).optional(),
    clickLinkUrl: z.string().describe(
      "The URL that the browser/SDK will load when the user clicks the ad.",
    ).optional(),
    clickTrackingUrl: z.string().describe("The URL to use for click tracking.")
      .optional(),
    headline: z.string().describe("A short title for the ad.").optional(),
    image: z.object({
      height: z.number().int().describe("Image height in pixels.").optional(),
      url: z.string().describe("The URL of the image.").optional(),
      width: z.number().int().describe("Image width in pixels.").optional(),
    }).describe("A large image.").optional(),
    logo: z.object({
      height: z.number().int().describe("Image height in pixels.").optional(),
      url: z.string().describe("The URL of the image.").optional(),
      width: z.number().int().describe("Image width in pixels.").optional(),
    }).describe("A smaller image, for the advertiser's logo.").optional(),
    priceDisplayText: z.string().describe(
      "The price of the promoted app including currency info.",
    ).optional(),
    starRating: z.number().describe(
      "The app rating in the app store. Must be in the range [0-5].",
    ).optional(),
    videoUrl: z.string().describe("The URL to fetch a native video ad.")
      .optional(),
    videoVastXml: z.string().describe(
      "The contents of a VAST document for a native video ad.",
    ).optional(),
  }).describe("A native creative.").optional(),
  video: z.object({
    videoMetadata: z.object({
      duration: z.string().describe(
        "The duration of the ad. Can be used to filter the response of the creatives.list method.",
      ).optional(),
      isValidVast: z.boolean().describe(
        "Is this a valid VAST ad? Can be used to filter the response of the creatives.list method.",
      ).optional(),
      isVpaid: z.boolean().describe(
        "Is this a VPAID ad? Can be used to filter the response of the creatives.list method.",
      ).optional(),
      mediaFiles: z.array(z.object({
        bitrate: z.string().describe(
          "Bitrate of the video file, in Kbps. Can be used to filter the response of the creatives.list method.",
        ).optional(),
        mimeType: z.enum([
          "VIDEO_MIME_TYPE_UNSPECIFIED",
          "MIME_VIDEO_XFLV",
          "MIME_VIDEO_WEBM",
          "MIME_VIDEO_MP4",
          "MIME_VIDEO_OGG",
          "MIME_VIDEO_YT_HOSTED",
          "MIME_VIDEO_X_MS_WMV",
          "MIME_VIDEO_3GPP",
          "MIME_VIDEO_MOV",
          "MIME_APPLICATION_SWF",
          "MIME_APPLICATION_SURVEY",
          "MIME_APPLICATION_JAVASCRIPT",
          "MIME_APPLICATION_SILVERLIGHT",
          "MIME_APPLICATION_MPEGURL",
          "MIME_APPLICATION_MPEGDASH",
          "MIME_AUDIO_MP4A",
          "MIME_AUDIO_MP3",
          "MIME_AUDIO_OGG",
        ]).describe(
          "The MIME type of this media file. Can be used to filter the response of the creatives.list method.",
        ).optional(),
      })).describe(
        "The list of all media files declared in the VAST. If there are multiple VASTs in a wrapper chain, this includes the media files from the deepest one in the chain.",
      ).optional(),
      skipOffset: z.string().describe(
        "The minimum duration that the user has to watch before being able to skip this ad. If the field is not set, the ad is not skippable. If the field is set, the ad is skippable. Can be used to filter the response of the creatives.list method.",
      ).optional(),
      vastVersion: z.enum([
        "VAST_VERSION_UNSPECIFIED",
        "VAST_VERSION_1_0",
        "VAST_VERSION_2_0",
        "VAST_VERSION_3_0",
        "VAST_VERSION_4_0",
      ]).describe(
        "The maximum VAST version across all wrapped VAST documents. Can be used to filter the response of the creatives.list method.",
      ).optional(),
    }).describe("Output only. Video metadata.").optional(),
    videoUrl: z.string().describe(
      "The URL to fetch a video ad. The URL should return an XML response that conforms to the VAST 2.0, 3.0 or 4.x standard.",
    ).optional(),
    videoVastXml: z.string().describe(
      "The contents of a VAST document for a video ad. This document should conform to the VAST 2.0, 3.0, or 4.x standard.",
    ).optional(),
  }).describe("A video creative.").optional(),
  parent: z.string().describe(
    "The parent resource name (e.g., projects/my-project/locations/us-central1, organizations/123, folders/456)",
  ).optional(),
});

const StateSchema = z.object({
  accountId: z.string().optional(),
  adChoicesDestinationUrl: z.string().optional(),
  advertiserName: z.string().optional(),
  agencyId: z.string().optional(),
  apiUpdateTime: z.string().optional(),
  creativeFormat: z.string().optional(),
  creativeId: z.string().optional(),
  creativeServingDecision: z.object({
    adTechnologyProviders: z.object({
      detectedGvlIds: z.array(z.string()),
      detectedProviderIds: z.array(z.string()),
      unidentifiedProviderDomains: z.array(z.string()),
    }),
    chinaPolicyCompliance: z.object({
      status: z.string(),
      topics: z.array(z.object({
        evidences: z.array(z.unknown()),
        helpCenterUrl: z.string(),
        missingCertificate: z.boolean(),
        policyTopic: z.string(),
      })),
    }),
    dealsPolicyCompliance: z.object({
      status: z.string(),
      topics: z.array(z.object({
        evidences: z.array(z.unknown()),
        helpCenterUrl: z.string(),
        missingCertificate: z.boolean(),
        policyTopic: z.string(),
      })),
    }),
    detectedAdvertisers: z.array(z.object({
      advertiserId: z.string(),
      advertiserName: z.string(),
      brandId: z.string(),
      brandName: z.string(),
    })),
    detectedAttributes: z.array(z.string()),
    detectedCategories: z.array(z.string()),
    detectedCategoriesTaxonomy: z.string(),
    detectedClickThroughUrls: z.array(z.string()),
    detectedDomains: z.array(z.string()),
    detectedLanguages: z.array(z.string()),
    detectedProductCategories: z.array(z.number()),
    detectedSensitiveCategories: z.array(z.number()),
    detectedVendorIds: z.array(z.number()),
    lastStatusUpdate: z.string(),
    networkPolicyCompliance: z.object({
      status: z.string(),
      topics: z.array(z.object({
        evidences: z.array(z.unknown()),
        helpCenterUrl: z.string(),
        missingCertificate: z.boolean(),
        policyTopic: z.string(),
      })),
    }),
    platformPolicyCompliance: z.object({
      status: z.string(),
      topics: z.array(z.object({
        evidences: z.array(z.unknown()),
        helpCenterUrl: z.string(),
        missingCertificate: z.boolean(),
        policyTopic: z.string(),
      })),
    }),
    russiaPolicyCompliance: z.object({
      status: z.string(),
      topics: z.array(z.object({
        evidences: z.array(z.unknown()),
        helpCenterUrl: z.string(),
        missingCertificate: z.boolean(),
        policyTopic: z.string(),
      })),
    }),
  }).optional(),
  dealIds: z.array(z.string()).optional(),
  declaredAttributes: z.array(z.string()).optional(),
  declaredClickThroughUrls: z.array(z.string()).optional(),
  declaredRestrictedCategories: z.array(z.string()).optional(),
  declaredVendorIds: z.array(z.number()).optional(),
  html: z.object({
    height: z.number(),
    snippet: z.string(),
    width: z.number(),
  }).optional(),
  impressionTrackingUrls: z.array(z.string()).optional(),
  name: z.string(),
  native: z.object({
    advertiserName: z.string(),
    appIcon: z.object({
      height: z.number(),
      url: z.string(),
      width: z.number(),
    }),
    body: z.string(),
    callToAction: z.string(),
    clickLinkUrl: z.string(),
    clickTrackingUrl: z.string(),
    headline: z.string(),
    image: z.object({
      height: z.number(),
      url: z.string(),
      width: z.number(),
    }),
    logo: z.object({
      height: z.number(),
      url: z.string(),
      width: z.number(),
    }),
    priceDisplayText: z.string(),
    starRating: z.number(),
    videoUrl: z.string(),
    videoVastXml: z.string(),
  }).optional(),
  renderUrl: z.string().optional(),
  restrictedCategories: z.array(z.string()).optional(),
  version: z.number().optional(),
  video: z.object({
    videoMetadata: z.object({
      duration: z.string(),
      isValidVast: z.boolean(),
      isVpaid: z.boolean(),
      mediaFiles: z.array(z.object({
        bitrate: z.string(),
        mimeType: z.string(),
      })),
      skipOffset: z.string(),
      vastVersion: z.string(),
    }),
    videoUrl: z.string(),
    videoVastXml: z.string(),
  }).optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  name: z.string().optional(),
  accessToken: z.string().meta({ sensitive: true }).optional(),
  credentialsJson: z.string().meta({ sensitive: true }).optional(),
  project: z.string().optional(),
  scopes: z.string().optional(),
  quotaProject: z.string().optional(),
  apiEndpoint: z.string().optional(),
  adChoicesDestinationUrl: z.string().describe(
    "The link to AdChoices destination page. This is only supported for native ads.",
  ).optional(),
  advertiserName: z.string().describe(
    "The name of the company being advertised in the creative. Can be used to filter the response of the creatives.list method.",
  ).optional(),
  agencyId: z.string().describe("The agency ID for this creative.").optional(),
  creativeId: z.string().describe(
    "Buyer-specific creative ID that references this creative in bid responses. This field is Ignored in update operations. Can be used to filter the response of the creatives.list method. The maximum length of the creative ID is 128 bytes.",
  ).optional(),
  declaredAttributes: z.array(
    z.enum([
      "ATTRIBUTE_UNSPECIFIED",
      "IMAGE_RICH_MEDIA",
      "ADOBE_FLASH_FLV",
      "IS_TAGGED",
      "IS_COOKIE_TARGETED",
      "IS_USER_INTEREST_TARGETED",
      "EXPANDING_DIRECTION_NONE",
      "EXPANDING_DIRECTION_UP",
      "EXPANDING_DIRECTION_DOWN",
      "EXPANDING_DIRECTION_LEFT",
      "EXPANDING_DIRECTION_RIGHT",
      "EXPANDING_DIRECTION_UP_LEFT",
      "EXPANDING_DIRECTION_UP_RIGHT",
      "EXPANDING_DIRECTION_DOWN_LEFT",
      "EXPANDING_DIRECTION_DOWN_RIGHT",
      "CREATIVE_TYPE_HTML",
      "CREATIVE_TYPE_VAST_VIDEO",
      "EXPANDING_DIRECTION_UP_OR_DOWN",
      "EXPANDING_DIRECTION_LEFT_OR_RIGHT",
      "EXPANDING_DIRECTION_ANY_DIAGONAL",
      "EXPANDING_ACTION_ROLLOVER_TO_EXPAND",
      "INSTREAM_VAST_VIDEO_TYPE_VPAID_FLASH",
      "RICH_MEDIA_CAPABILITY_TYPE_MRAID",
      "RICH_MEDIA_CAPABILITY_TYPE_FLASH",
      "RICH_MEDIA_CAPABILITY_TYPE_HTML5",
      "SKIPPABLE_INSTREAM_VIDEO",
      "RICH_MEDIA_CAPABILITY_TYPE_SSL",
      "RICH_MEDIA_CAPABILITY_TYPE_NON_SSL",
      "RICH_MEDIA_CAPABILITY_TYPE_INTERSTITIAL",
      "NON_SKIPPABLE_INSTREAM_VIDEO",
      "NATIVE_ELIGIBILITY_ELIGIBLE",
      "NON_VPAID",
      "NATIVE_ELIGIBILITY_NOT_ELIGIBLE",
      "ANY_INTERSTITIAL",
      "NON_INTERSTITIAL",
      "IN_BANNER_VIDEO",
      "RENDERING_SIZELESS_ADX",
      "OMSDK_1_0",
      "RENDERING_PLAYABLE",
    ]),
  ).describe(
    'All declared attributes for the ads that may be shown from this creative. Can be used to filter the response of the creatives.list method. If the `excluded_attribute` field of a [bid request](https://developers.google.com/authorized-buyers/rtb/downloads/realtime-bidding-proto") contains one of the attributes that were declared or detected for a given creative, and a bid is submitted with that creative, the bid will be filtered before the auction.',
  ).optional(),
  declaredClickThroughUrls: z.array(z.string()).describe(
    "The set of declared destination URLs for the creative. Can be used to filter the response of the creatives.list method.",
  ).optional(),
  declaredVendorIds: z.array(z.number().int()).describe(
    "IDs for the declared ad technology vendors that may be used by this creative. See https://storage.googleapis.com/adx-rtb-dictionaries/vendors.txt for possible values. Can be used to filter the response of the creatives.list method.",
  ).optional(),
  html: z.object({
    height: z.number().int().describe(
      "The height of the HTML snippet in pixels. Can be used to filter the response of the creatives.list method.",
    ).optional(),
    snippet: z.string().describe(
      "The HTML snippet that displays the ad when inserted in the web page.",
    ).optional(),
    width: z.number().int().describe(
      "The width of the HTML snippet in pixels. Can be used to filter the response of the creatives.list method.",
    ).optional(),
  }).describe("An HTML creative.").optional(),
  impressionTrackingUrls: z.array(z.string()).describe(
    "The set of URLs to be called to record an impression.",
  ).optional(),
  native: z.object({
    advertiserName: z.string().describe(
      "The name of the advertiser or sponsor, to be displayed in the ad creative.",
    ).optional(),
    appIcon: z.object({
      height: z.number().int().describe("Image height in pixels.").optional(),
      url: z.string().describe("The URL of the image.").optional(),
      width: z.number().int().describe("Image width in pixels.").optional(),
    }).describe("The app icon, for app download ads.").optional(),
    body: z.string().describe("A long description of the ad.").optional(),
    callToAction: z.string().describe(
      "A label for the button that the user is supposed to click.",
    ).optional(),
    clickLinkUrl: z.string().describe(
      "The URL that the browser/SDK will load when the user clicks the ad.",
    ).optional(),
    clickTrackingUrl: z.string().describe("The URL to use for click tracking.")
      .optional(),
    headline: z.string().describe("A short title for the ad.").optional(),
    image: z.object({
      height: z.number().int().describe("Image height in pixels.").optional(),
      url: z.string().describe("The URL of the image.").optional(),
      width: z.number().int().describe("Image width in pixels.").optional(),
    }).describe("A large image.").optional(),
    logo: z.object({
      height: z.number().int().describe("Image height in pixels.").optional(),
      url: z.string().describe("The URL of the image.").optional(),
      width: z.number().int().describe("Image width in pixels.").optional(),
    }).describe("A smaller image, for the advertiser's logo.").optional(),
    priceDisplayText: z.string().describe(
      "The price of the promoted app including currency info.",
    ).optional(),
    starRating: z.number().describe(
      "The app rating in the app store. Must be in the range [0-5].",
    ).optional(),
    videoUrl: z.string().describe("The URL to fetch a native video ad.")
      .optional(),
    videoVastXml: z.string().describe(
      "The contents of a VAST document for a native video ad.",
    ).optional(),
  }).describe("A native creative.").optional(),
  video: z.object({
    videoMetadata: z.object({
      duration: z.string().describe(
        "The duration of the ad. Can be used to filter the response of the creatives.list method.",
      ).optional(),
      isValidVast: z.boolean().describe(
        "Is this a valid VAST ad? Can be used to filter the response of the creatives.list method.",
      ).optional(),
      isVpaid: z.boolean().describe(
        "Is this a VPAID ad? Can be used to filter the response of the creatives.list method.",
      ).optional(),
      mediaFiles: z.array(z.object({
        bitrate: z.string().describe(
          "Bitrate of the video file, in Kbps. Can be used to filter the response of the creatives.list method.",
        ).optional(),
        mimeType: z.enum([
          "VIDEO_MIME_TYPE_UNSPECIFIED",
          "MIME_VIDEO_XFLV",
          "MIME_VIDEO_WEBM",
          "MIME_VIDEO_MP4",
          "MIME_VIDEO_OGG",
          "MIME_VIDEO_YT_HOSTED",
          "MIME_VIDEO_X_MS_WMV",
          "MIME_VIDEO_3GPP",
          "MIME_VIDEO_MOV",
          "MIME_APPLICATION_SWF",
          "MIME_APPLICATION_SURVEY",
          "MIME_APPLICATION_JAVASCRIPT",
          "MIME_APPLICATION_SILVERLIGHT",
          "MIME_APPLICATION_MPEGURL",
          "MIME_APPLICATION_MPEGDASH",
          "MIME_AUDIO_MP4A",
          "MIME_AUDIO_MP3",
          "MIME_AUDIO_OGG",
        ]).describe(
          "The MIME type of this media file. Can be used to filter the response of the creatives.list method.",
        ).optional(),
      })).describe(
        "The list of all media files declared in the VAST. If there are multiple VASTs in a wrapper chain, this includes the media files from the deepest one in the chain.",
      ).optional(),
      skipOffset: z.string().describe(
        "The minimum duration that the user has to watch before being able to skip this ad. If the field is not set, the ad is not skippable. If the field is set, the ad is skippable. Can be used to filter the response of the creatives.list method.",
      ).optional(),
      vastVersion: z.enum([
        "VAST_VERSION_UNSPECIFIED",
        "VAST_VERSION_1_0",
        "VAST_VERSION_2_0",
        "VAST_VERSION_3_0",
        "VAST_VERSION_4_0",
      ]).describe(
        "The maximum VAST version across all wrapped VAST documents. Can be used to filter the response of the creatives.list method.",
      ).optional(),
    }).describe("Output only. Video metadata.").optional(),
    videoUrl: z.string().describe(
      "The URL to fetch a video ad. The URL should return an XML response that conforms to the VAST 2.0, 3.0 or 4.x standard.",
    ).optional(),
    videoVastXml: z.string().describe(
      "The contents of a VAST document for a video ad. This document should conform to the VAST 2.0, 3.0, or 4.x standard.",
    ).optional(),
  }).describe("A video creative.").optional(),
  parent: z.string().describe(
    "The parent resource name (e.g., projects/my-project/locations/us-central1, organizations/123, folders/456)",
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
      : _defaultOAuthScopes,
    quotaProject: g.quotaProject as string | undefined,
  };
}

/** Swamp extension model for Google Cloud Real-time Bidding Buyers.Creatives. Registered at `@swamp/gcp/realtimebidding/buyers-creatives`. */
export const model = {
  type: "@swamp/gcp/realtimebidding/buyers-creatives",
  version: "2026.09.15.1",
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
      toVersion: "2026.04.23.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.01.1",
      description: "Removed: renderUrl",
      upgradeAttributes: (old: Record<string, unknown>) => {
        const { renderUrl: _renderUrl, ...rest } = old;
        return rest;
      },
    },
    {
      toVersion: "2026.05.18.1",
      description: "Added: renderUrl",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.18.2",
      description: "Removed: renderUrl",
      upgradeAttributes: (old: Record<string, unknown>) => {
        const { renderUrl: _renderUrl, ...rest } = old;
        return rest;
      },
    },
    {
      toVersion: "2026.05.19.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.19.2",
      description: "Added: renderUrl",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.20.1",
      description: "Removed: renderUrl",
      upgradeAttributes: (old: Record<string, unknown>) => {
        const { renderUrl: _renderUrl, ...rest } = old;
        return rest;
      },
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
      description: "Added: renderUrl",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.26.1",
      description: "Removed: renderUrl",
      upgradeAttributes: (old: Record<string, unknown>) => {
        const { renderUrl: _renderUrl, ...rest } = old;
        return rest;
      },
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
      toVersion: "2026.07.17.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.18.1",
      description: "Added: scopes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.19.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.20.1",
      description: "Added: renderUrl",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.20.2",
      description: "Removed: renderUrl",
      upgradeAttributes: (old: Record<string, unknown>) => {
        const { renderUrl: _renderUrl, ...rest } = old;
        return rest;
      },
    },
    {
      toVersion: "2026.07.21.1",
      description: "Removed: creativeServingDecision",
      upgradeAttributes: (old: Record<string, unknown>) => {
        const { creativeServingDecision: _creativeServingDecision, ...rest } =
          old;
        return rest;
      },
    },
    {
      toVersion: "2026.07.21.2",
      description: "Added: renderUrl",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.21.3",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.21.4",
      description: "Removed: renderUrl",
      upgradeAttributes: (old: Record<string, unknown>) => {
        const { renderUrl: _renderUrl, ...rest } = old;
        return rest;
      },
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
      toVersion: "2026.09.15.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "A creative and its classification data.",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a creatives",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["parent"] !== undefined) params["parent"] = String(g["parent"]);
        const body: Record<string, unknown> = {};
        if (g["adChoicesDestinationUrl"] !== undefined) {
          body["adChoicesDestinationUrl"] = g["adChoicesDestinationUrl"];
        }
        if (g["advertiserName"] !== undefined) {
          body["advertiserName"] = g["advertiserName"];
        }
        if (g["agencyId"] !== undefined) body["agencyId"] = g["agencyId"];
        if (g["creativeId"] !== undefined) body["creativeId"] = g["creativeId"];
        if (g["declaredAttributes"] !== undefined) {
          body["declaredAttributes"] = g["declaredAttributes"];
        }
        if (g["declaredClickThroughUrls"] !== undefined) {
          body["declaredClickThroughUrls"] = g["declaredClickThroughUrls"];
        }
        if (g["declaredVendorIds"] !== undefined) {
          body["declaredVendorIds"] = g["declaredVendorIds"];
        }
        if (g["html"] !== undefined) body["html"] = g["html"];
        if (g["impressionTrackingUrls"] !== undefined) {
          body["impressionTrackingUrls"] = g["impressionTrackingUrls"];
        }
        if (g["native"] !== undefined) body["native"] = g["native"];
        if (g["video"] !== undefined) body["video"] = g["video"];
        if (g["parent"] !== undefined && g["name"] !== undefined) {
          params["name"] = buildResourceName(
            String(g["parent"]),
            String(g["name"]),
          );
        }
        const result = await createResource(
          baseUrl,
          INSERT_CONFIG,
          params,
          body,
          GET_CONFIG,
          undefined,
          undefined,
          credentials,
        ) as StateData;
        const instanceName = (g.name?.toString() ?? "current").replace(
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
    get: {
      description: "Get a creatives",
      arguments: z.object({
        identifier: z.string().describe("The name of the creatives"),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        params["name"] = buildResourceName(
          String(g["parent"] ?? ""),
          args.identifier,
        );
        const result = await readResource(
          baseUrl,
          GET_CONFIG,
          params,
          credentials,
        ) as StateData;
        const instanceName = (g.name?.toString() ?? args.identifier).replace(
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
      description: "Update creatives attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific creatives by name (e.g. one discovered by list)",
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
        const existingName = existing["name"]?.toString();
        if (existingName && existingName.includes("/")) {
          params["name"] = existingName;
        } else {
          params["name"] = buildResourceName(
            String(g["parent"] ?? ""),
            existingName ?? g["name"]?.toString() ?? "",
          );
        }
        const body: Record<string, unknown> = {};
        if (g["adChoicesDestinationUrl"] !== undefined) {
          body["adChoicesDestinationUrl"] = g["adChoicesDestinationUrl"];
        }
        if (g["advertiserName"] !== undefined) {
          body["advertiserName"] = g["advertiserName"];
        }
        if (g["agencyId"] !== undefined) body["agencyId"] = g["agencyId"];
        if (g["creativeId"] !== undefined) body["creativeId"] = g["creativeId"];
        if (g["declaredAttributes"] !== undefined) {
          body["declaredAttributes"] = g["declaredAttributes"];
        }
        if (g["declaredClickThroughUrls"] !== undefined) {
          body["declaredClickThroughUrls"] = g["declaredClickThroughUrls"];
        }
        if (g["declaredVendorIds"] !== undefined) {
          body["declaredVendorIds"] = g["declaredVendorIds"];
        }
        if (g["html"] !== undefined) body["html"] = g["html"];
        if (g["impressionTrackingUrls"] !== undefined) {
          body["impressionTrackingUrls"] = g["impressionTrackingUrls"];
        }
        if (g["native"] !== undefined) body["native"] = g["native"];
        if (g["video"] !== undefined) body["video"] = g["video"];
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
    sync: {
      description: "Sync creatives state from GCP",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific creatives by name (e.g. one discovered by list)",
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
          const existingName = existing.name?.toString();
          if (existingName && existingName.includes("/")) {
            params["name"] = existingName;
          } else {
            const shortName = existingName ?? g["name"]?.toString();
            if (!shortName) throw new Error("No identifier found");
            params["name"] = buildResourceName(
              String(g["parent"] ?? ""),
              shortName,
            );
          }
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
    list: {
      description: "List creatives resources",
      arguments: z.object({
        filter: z.string().describe(
          "Query string to filter creatives. If no filter is specified, all active creatives will be returned. Example: 'accountId=12345 AND (dealsStatus:DISAPPROVED AND disapprovalReason:UNACCEPTABLE_CONTENT) OR declaredAttributes:IS_COOKIE_TARGETED'",
        ).optional(),
        pageSize: z.number().describe(
          "Requested page size. The server may return fewer creatives than requested (due to timeout constraint) even if more are available through another call. If unspecified, server will pick an appropriate default. Acceptable values are 1 to 1000, inclusive.",
        ).optional(),
        view: z.string().describe(
          'Controls the amount of information included in the response. By default only creativeServingDecision is included. To retrieve the entire creative resource (including the declared fields and the creative content) specify the view as "FULL".',
        ).optional(),
        maxPages: z.number().describe(
          "Maximum number of pages to fetch (default: 10)",
        ).optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["parent"] !== undefined) params["parent"] = String(g["parent"]);
        if (args["filter"] !== undefined) {
          params["filter"] = String(args["filter"]);
        }
        if (args["pageSize"] !== undefined) {
          params["pageSize"] = String(args["pageSize"]);
        }
        if (args["view"] !== undefined) params["view"] = String(args["view"]);
        const { items, nextPageToken } = await listResources(
          baseUrl,
          LIST_CONFIG,
          params,
          "creatives",
          (args.maxPages as number | undefined) ?? 10,
          credentials,
        );
        const dataHandles = [];
        for (let i = 0; i < items.length; i++) {
          const item = items[i] as StateData;
          const instanceName = (item.name?.toString() ?? String(i)).replace(
            /[\/\\]/g,
            "_",
          ).replace(/\.\./g, "_").replace(/\0/g, "");
          const handle = await context.writeResource(
            "state",
            instanceName,
            item,
          );
          dataHandles.push(handle);
        }
        return { dataHandles, result: { count: items.length, nextPageToken } };
      },
    },
    add_deals: {
      description: "add deals",
      arguments: z.object({
        dealIds: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["parent"] !== undefined && g["name"] !== undefined) {
          params["name"] = buildResourceName(
            String(g["parent"]),
            String(g["name"]),
          );
        }
        const body: Record<string, unknown> = {};
        if (args["dealIds"] !== undefined) body["dealIds"] = args["dealIds"];
        const result = await createResource(
          baseUrl,
          {
            "id": "realtimebidding.buyers.creatives.addDeals",
            "path": "v1/{+name}:addDeals",
            "httpMethod": "POST",
            "parameterOrder": ["name"],
            "parameters": { "name": { "location": "path", "required": true } },
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

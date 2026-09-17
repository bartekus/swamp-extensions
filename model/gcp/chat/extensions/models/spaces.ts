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

// Auto-generated extension model for @swamp/gcp/chat/spaces
// Do not edit manually. Re-generate with: deno task generate:gcp

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Google Cloud Google Chat Spaces.
 *
 * A space in Google Chat. Spaces are conversations between two or more users or 1:1 messages between a user and a Chat app.
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
  listResources,
  readResource,
  updateResource,
} from "./_lib/gcp.ts";

const BASE_URL = "https://chat.googleapis.com/";

const GET_CONFIG = {
  "id": "chat.spaces.get",
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
    "useAdminAccess": {
      "location": "query",
    },
  },
} as const;

const INSERT_CONFIG = {
  "id": "chat.spaces.create",
  "path": "v1/spaces",
  "httpMethod": "POST",
  "parameterOrder": [],
  "parameters": {
    "requestId": {
      "location": "query",
    },
  },
} as const;

const PATCH_CONFIG = {
  "id": "chat.spaces.patch",
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
    "useAdminAccess": {
      "location": "query",
    },
  },
} as const;

const DELETE_CONFIG = {
  "id": "chat.spaces.delete",
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
    "useAdminAccess": {
      "location": "query",
    },
  },
} as const;

const LIST_CONFIG = {
  "id": "chat.spaces.list",
  "path": "v1/spaces",
  "httpMethod": "GET",
  "parameterOrder": [],
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
  },
} as const;

const _defaultOAuthScopes: string[] = [
  "https://www.googleapis.com/auth/chat.admin.delete",
  "https://www.googleapis.com/auth/chat.admin.memberships",
  "https://www.googleapis.com/auth/chat.admin.memberships.readonly",
  "https://www.googleapis.com/auth/chat.admin.spaces",
  "https://www.googleapis.com/auth/chat.admin.spaces.readonly",
  "https://www.googleapis.com/auth/chat.app.all.memberships.readonly",
  "https://www.googleapis.com/auth/chat.app.all.messages.readonly",
  "https://www.googleapis.com/auth/chat.app.all.spaces.readonly",
  "https://www.googleapis.com/auth/chat.app.delete",
  "https://www.googleapis.com/auth/chat.app.memberships",
  "https://www.googleapis.com/auth/chat.app.memberships.readonly",
  "https://www.googleapis.com/auth/chat.app.messages.readonly",
  "https://www.googleapis.com/auth/chat.app.spaces",
  "https://www.googleapis.com/auth/chat.app.spaces.create",
  "https://www.googleapis.com/auth/chat.app.spaces.readonly",
  "https://www.googleapis.com/auth/chat.bot",
  "https://www.googleapis.com/auth/chat.customemojis",
  "https://www.googleapis.com/auth/chat.customemojis.readonly",
  "https://www.googleapis.com/auth/chat.delete",
  "https://www.googleapis.com/auth/chat.import",
  "https://www.googleapis.com/auth/chat.memberships",
  "https://www.googleapis.com/auth/chat.memberships.app",
  "https://www.googleapis.com/auth/chat.memberships.readonly",
  "https://www.googleapis.com/auth/chat.messages",
  "https://www.googleapis.com/auth/chat.messages.create",
  "https://www.googleapis.com/auth/chat.messages.reactions",
  "https://www.googleapis.com/auth/chat.messages.reactions.create",
  "https://www.googleapis.com/auth/chat.messages.reactions.readonly",
  "https://www.googleapis.com/auth/chat.messages.readonly",
  "https://www.googleapis.com/auth/chat.spaces",
  "https://www.googleapis.com/auth/chat.spaces.create",
  "https://www.googleapis.com/auth/chat.spaces.pins",
  "https://www.googleapis.com/auth/chat.spaces.pins.readonly",
  "https://www.googleapis.com/auth/chat.spaces.readonly",
  "https://www.googleapis.com/auth/chat.users.availability",
  "https://www.googleapis.com/auth/chat.users.availability.readonly",
  "https://www.googleapis.com/auth/chat.users.readstate",
  "https://www.googleapis.com/auth/chat.users.readstate.readonly",
  "https://www.googleapis.com/auth/chat.users.sections",
  "https://www.googleapis.com/auth/chat.users.sections.readonly",
  "https://www.googleapis.com/auth/chat.users.spacesettings",
];

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
  accessSettings: z.object({
    accessPermissionSettings: z.object({
      discoverSpaceSetting: z.object({
        principals: z.array(z.object({
          audience: z.unknown().describe("An audience.").optional(),
        })).describe(
          "Optional. Unordered list. Allowed principals for this permission.",
        ).optional(),
      }).describe(
        "Optional. Access permission setting for discovering the space.",
      ).optional(),
      joinSpaceSetting: z.object({
        principals: z.array(z.object({
          audience: z.unknown().describe("An audience.").optional(),
        })).describe(
          "Optional. Unordered list. Allowed principals for this permission.",
        ).optional(),
      }).describe("Optional. Access permission setting for joining the space.")
        .optional(),
      viewSpaceMembershipSetting: z.object({
        principals: z.array(z.object({
          audience: z.unknown().describe("An audience.").optional(),
        })).describe(
          "Optional. Unordered list. Allowed principals for this permission.",
        ).optional(),
      }).describe(
        "Optional. Access permission setting for viewing space membership. Must be specified together with `PermissionSettings.view_space_membership` in the update mask and request body when updating who can view space membership. When granting view access to a target audience, you must also grant `PermissionSettings.view_space_membership` to all members in the same request. To remove an existing target audience (for example, to restrict view access to space managers or assistant managers only), specify an empty `AccessPermissionSetting` (with no `principals`).",
      ).optional(),
    }).describe(
      "Optional. Access permission settings for the space. To set the target audience when creating a space, specify the `accessSettings.audience` field in your request.",
    ).optional(),
    accessState: z.enum(["ACCESS_STATE_UNSPECIFIED", "PRIVATE", "DISCOVERABLE"])
      .describe("Output only. Indicates the access state of the space.")
      .optional(),
    audience: z.string().describe(
      "Optional. The resource name of the [target audience](https://support.google.com/a/answer/9934697) who can discover the space, join the space, and preview the messages in the space. If unset, only users or Google Groups who have been individually invited or added to the space can access it. For details, see [Make a space discoverable to a target audience](https://developers.google.com/workspace/chat/space-target-audience). Format: `audiences/{audience}` To use the default target audience for the Google Workspace organization, set to `audiences/default`. Reading the target audience supports: - [User authentication](https://developers.google.com/workspace/chat/authenticate-authorize-chat-user) - [App authentication](https://developers.google.com/workspace/chat/authenticate-authorize-chat-app) with [administrator approval](https://support.google.com/a?p=chat-app-auth) with the `chat.app.spaces` scope. This field is not populated when using the `chat.bot` scope with [app authentication](https://developers.google.com/workspace/chat/authenticate-authorize-chat-app). Setting the target audience requires [user authentication](https://developers.google.com/workspace/chat/authenticate-authorize-chat-user).",
    ).optional(),
  }).describe(
    "Optional. Specifies the [access setting](https://support.google.com/chat/answer/11971020) of the space. Only populated when the `space_type` is `SPACE`.",
  ).optional(),
  customer: z.string().describe(
    "Optional. Immutable. The customer id of the domain of the space. Required only when creating a space with [app authentication](https://developers.google.com/workspace/chat/authenticate-authorize-chat-app) and `SpaceType` is `SPACE`, otherwise should not be set. In the format `customers/{customer}`, where `customer` is the `id` from the [Admin SDK customer resource](https://developers.google.com/admin-sdk/directory/reference/rest/v1/customers). Private apps can also use the `customers/my_customer` alias to create the space in the same Google Workspace organization as the app. This field isn't populated for direct messages (DMs) or when the space is created by non-Google Workspace users.",
  ).optional(),
  displayName: z.string().describe(
    "Optional. The space's display name. Required when [creating a space](https://developers.google.com/workspace/chat/api/reference/rest/v1/spaces/create) with a `spaceType` of `SPACE`. If you receive the error message `ALREADY_EXISTS` when creating a space or updating the `displayName`, try a different `displayName`. An existing space within the Google Workspace organization might already use this display name. For direct messages, this field might be empty. Supports up to 128 characters.",
  ).optional(),
  importMode: z.boolean().describe(
    "Optional. Whether this space is created in `Import Mode` as part of a data migration into Google Workspace. While spaces are being imported, they aren't visible to users until the import is complete. Creating a space in `Import Mode`requires [user authentication](https://developers.google.com/workspace/chat/authenticate-authorize-chat-user).",
  ).optional(),
  name: z.string().describe(
    "Identifier. Resource name of the space. Format: `spaces/{space}` Where `{space}` represents the system-assigned ID for the space. You can obtain the space ID by calling the [`spaces.list()`](https://developers.google.com/workspace/chat/api/reference/rest/v1/spaces/list) method or from the space URL. For example, if the space URL is `https://mail.google.com/mail/u/0/#chat/space/AAAAAAAAA`, the space ID is `AAAAAAAAA`.",
  ).optional(),
  permissionSettings: z.object({
    manageApps: z.object({
      assistantManagersAllowed: z.boolean().describe(
        "Optional. Whether space managers `ROLE_ASSISTANT_MANAGER`) have this permission.",
      ).optional(),
      managersAllowed: z.boolean().describe(
        "Optional. Whether space owners (`ROLE_MANAGER`) have this permission.",
      ).optional(),
      membersAllowed: z.boolean().describe(
        "Optional. Whether basic space members (`ROLE_MEMBER`) have this permission.",
      ).optional(),
    }).describe("Optional. Setting for managing apps in a space.").optional(),
    manageMembersAndGroups: z.object({
      assistantManagersAllowed: z.boolean().describe(
        "Optional. Whether space managers `ROLE_ASSISTANT_MANAGER`) have this permission.",
      ).optional(),
      managersAllowed: z.boolean().describe(
        "Optional. Whether space owners (`ROLE_MANAGER`) have this permission.",
      ).optional(),
      membersAllowed: z.boolean().describe(
        "Optional. Whether basic space members (`ROLE_MEMBER`) have this permission.",
      ).optional(),
    }).describe("Optional. Setting for managing members and groups in a space.")
      .optional(),
    manageWebhooks: z.object({
      assistantManagersAllowed: z.boolean().describe(
        "Optional. Whether space managers `ROLE_ASSISTANT_MANAGER`) have this permission.",
      ).optional(),
      managersAllowed: z.boolean().describe(
        "Optional. Whether space owners (`ROLE_MANAGER`) have this permission.",
      ).optional(),
      membersAllowed: z.boolean().describe(
        "Optional. Whether basic space members (`ROLE_MEMBER`) have this permission.",
      ).optional(),
    }).describe("Optional. Setting for managing webhooks in a space.")
      .optional(),
    modifySpaceDetails: z.object({
      assistantManagersAllowed: z.boolean().describe(
        "Optional. Whether space managers `ROLE_ASSISTANT_MANAGER`) have this permission.",
      ).optional(),
      managersAllowed: z.boolean().describe(
        "Optional. Whether space owners (`ROLE_MANAGER`) have this permission.",
      ).optional(),
      membersAllowed: z.boolean().describe(
        "Optional. Whether basic space members (`ROLE_MEMBER`) have this permission.",
      ).optional(),
    }).describe(
      "Optional. Setting for updating space name, avatar, description and guidelines.",
    ).optional(),
    postMessages: z.object({
      assistantManagersAllowed: z.boolean().describe(
        "Optional. Whether space managers `ROLE_ASSISTANT_MANAGER`) have this permission.",
      ).optional(),
      managersAllowed: z.boolean().describe(
        "Optional. Whether space owners (`ROLE_MANAGER`) have this permission.",
      ).optional(),
      membersAllowed: z.boolean().describe(
        "Optional. Whether basic space members (`ROLE_MEMBER`) have this permission.",
      ).optional(),
    }).describe("Output only. Setting for posting messages in a space.")
      .optional(),
    replyMessages: z.object({
      assistantManagersAllowed: z.boolean().describe(
        "Optional. Whether space managers `ROLE_ASSISTANT_MANAGER`) have this permission.",
      ).optional(),
      managersAllowed: z.boolean().describe(
        "Optional. Whether space owners (`ROLE_MANAGER`) have this permission.",
      ).optional(),
      membersAllowed: z.boolean().describe(
        "Optional. Whether basic space members (`ROLE_MEMBER`) have this permission.",
      ).optional(),
    }).describe("Optional. Setting for replying to messages in a space.")
      .optional(),
    toggleHistory: z.object({
      assistantManagersAllowed: z.boolean().describe(
        "Optional. Whether space managers `ROLE_ASSISTANT_MANAGER`) have this permission.",
      ).optional(),
      managersAllowed: z.boolean().describe(
        "Optional. Whether space owners (`ROLE_MANAGER`) have this permission.",
      ).optional(),
      membersAllowed: z.boolean().describe(
        "Optional. Whether basic space members (`ROLE_MEMBER`) have this permission.",
      ).optional(),
    }).describe("Optional. Setting for toggling space history on and off.")
      .optional(),
    useAtMentionAll: z.object({
      assistantManagersAllowed: z.boolean().describe(
        "Optional. Whether space managers `ROLE_ASSISTANT_MANAGER`) have this permission.",
      ).optional(),
      managersAllowed: z.boolean().describe(
        "Optional. Whether space owners (`ROLE_MANAGER`) have this permission.",
      ).optional(),
      membersAllowed: z.boolean().describe(
        "Optional. Whether basic space members (`ROLE_MEMBER`) have this permission.",
      ).optional(),
    }).describe("Optional. Setting for using @all in a space.").optional(),
    viewSpaceMembership: z.object({
      assistantManagersAllowed: z.boolean().describe(
        "Optional. Whether space managers `ROLE_ASSISTANT_MANAGER`) have this permission.",
      ).optional(),
      managersAllowed: z.boolean().describe(
        "Optional. Whether space owners (`ROLE_MANAGER`) have this permission.",
      ).optional(),
      membersAllowed: z.boolean().describe(
        "Optional. Whether basic space members (`ROLE_MEMBER`) have this permission.",
      ).optional(),
    }).describe(
      "Optional. Setting for viewing space membership. Must be specified together with `AccessPermissionSettings.view_space_membership_setting` in the update mask and request body when updating who can view space membership. When restricting view access to specific roles (for example, space managers or assistant managers only), specify the desired role permissions here and provide an empty `AccessPermissionSettings.view_space_membership_setting` in the same request. If a target audience is configured in `AccessPermissionSettings.view_space_membership_setting`, this setting must be granted to all members.",
    ).optional(),
  }).describe(
    "Optional. Space permission settings for existing spaces. Input for updating exact space permission settings, where existing permission settings are replaced. Output lists current permission settings. Reading and updating permission settings supports: - [App authentication](https://developers.google.com/workspace/chat/authenticate-authorize-chat-app) with [administrator approval](https://support.google.com/a?p=chat-app-auth) with the `chat.app.spaces` scope. Only populated and settable when the Chat app created the space. - [User authentication](https://developers.google.com/workspace/chat/authenticate-authorize-chat-user)",
  ).optional(),
  predefinedPermissionSettings: z.enum([
    "PREDEFINED_PERMISSION_SETTINGS_UNSPECIFIED",
    "COLLABORATION_SPACE",
    "ANNOUNCEMENT_SPACE",
  ]).describe(
    "Optional. Input only. Predefined space permission settings, input only when creating a space. If the field is not set, a collaboration space is created. After you create the space, settings are populated in the `PermissionSettings` field. Setting predefined permission settings supports: - [App authentication](https://developers.google.com/workspace/chat/authenticate-authorize-chat-app) with [administrator approval](https://support.google.com/a?p=chat-app-auth) with the `chat.app.spaces` or `chat.app.spaces.create` scopes. - [User authentication](https://developers.google.com/workspace/chat/authenticate-authorize-chat-user)",
  ).optional(),
  singleUserBotDm: z.boolean().describe(
    "Optional. Whether the space is a DM between a Chat app and a single human.",
  ).optional(),
  spaceDetails: z.object({
    description: z.string().describe(
      "Optional. A description of the space. For example, describe the space's discussion topic, functional purpose, or participants. Supports up to 150 characters.",
    ).optional(),
    guidelines: z.string().describe(
      "Optional. The space's rules, expectations, and etiquette. Supports up to 5,000 characters.",
    ).optional(),
  }).describe(
    "Optional. Details about the space including description and rules.",
  ).optional(),
  spaceHistoryState: z.enum([
    "HISTORY_STATE_UNSPECIFIED",
    "HISTORY_OFF",
    "HISTORY_ON",
  ]).describe(
    "Optional. The message history state for messages and threads in this space.",
  ).optional(),
  requestId: z.string().describe(
    "Optional. A unique ID for this request. A random UUID is recommended. Specifying a request ID makes the request idempotent, which ensures that multiple identical requests with the same request ID result in only a single space being created. Subsequent requests with the same request ID return the existing space and do not update the space, even if the requested details differ from the current state. To use this field effectively: - Ensure that subsequent requests are identical and use the same authentication credentials as the original request. - If a space was already created with the provided request ID, the request returns that space. Note that the returned space might not be fully populated; the API echoes the space in your request with the system-assigned resource name populated. To retrieve the latest metadata for the space, call `GetSpace`. - Reusing an existing request ID with a different authenticated user results in an error.",
  ).optional(),
  useAdminAccess: z.string().describe(
    "Optional. When `true`, the method runs using the user's Google Workspace administrator privileges. The calling user must be a Google Workspace administrator with the [manage chat and spaces conversations privilege](https://support.google.com/a/answer/13369245). Requires the `chat.admin.spaces` [OAuth 2.0 scope](https://developers.google.com/workspace/chat/authenticate-authorize#chat-api-scopes). Some `FieldMask` values are not supported using admin access. For details, see the description of `update_mask`.",
  ).optional(),
});

const StateSchema = z.object({
  accessSettings: z.object({
    accessPermissionSettings: z.object({
      discoverSpaceSetting: z.object({
        principals: z.array(z.object({
          audience: z.unknown(),
        })),
      }),
      joinSpaceSetting: z.object({
        principals: z.array(z.object({
          audience: z.unknown(),
        })),
      }),
      viewSpaceMembershipSetting: z.object({
        principals: z.array(z.object({
          audience: z.unknown(),
        })),
      }),
    }),
    accessState: z.string(),
    audience: z.string(),
  }).optional(),
  adminInstalled: z.boolean().optional(),
  createTime: z.string().optional(),
  customer: z.string().optional(),
  displayName: z.string().optional(),
  externalUserAllowed: z.boolean().optional(),
  importMode: z.boolean().optional(),
  importModeExpireTime: z.string().optional(),
  lastActiveTime: z.string().optional(),
  membershipCount: z.object({
    joinedDirectHumanUserCount: z.number(),
    joinedGroupCount: z.number(),
  }).optional(),
  name: z.string(),
  permissionSettings: z.object({
    manageApps: z.object({
      assistantManagersAllowed: z.boolean(),
      managersAllowed: z.boolean(),
      membersAllowed: z.boolean(),
    }),
    manageMembersAndGroups: z.object({
      assistantManagersAllowed: z.boolean(),
      managersAllowed: z.boolean(),
      membersAllowed: z.boolean(),
    }),
    manageWebhooks: z.object({
      assistantManagersAllowed: z.boolean(),
      managersAllowed: z.boolean(),
      membersAllowed: z.boolean(),
    }),
    modifySpaceDetails: z.object({
      assistantManagersAllowed: z.boolean(),
      managersAllowed: z.boolean(),
      membersAllowed: z.boolean(),
    }),
    postMessages: z.object({
      assistantManagersAllowed: z.boolean(),
      managersAllowed: z.boolean(),
      membersAllowed: z.boolean(),
    }),
    replyMessages: z.object({
      assistantManagersAllowed: z.boolean(),
      managersAllowed: z.boolean(),
      membersAllowed: z.boolean(),
    }),
    toggleHistory: z.object({
      assistantManagersAllowed: z.boolean(),
      managersAllowed: z.boolean(),
      membersAllowed: z.boolean(),
    }),
    useAtMentionAll: z.object({
      assistantManagersAllowed: z.boolean(),
      managersAllowed: z.boolean(),
      membersAllowed: z.boolean(),
    }),
    viewSpaceMembership: z.object({
      assistantManagersAllowed: z.boolean(),
      managersAllowed: z.boolean(),
      membersAllowed: z.boolean(),
    }),
  }).optional(),
  predefinedPermissionSettings: z.string().optional(),
  singleUserBotDm: z.boolean().optional(),
  spaceDetails: z.object({
    description: z.string(),
    guidelines: z.string(),
  }).optional(),
  spaceHistoryState: z.string().optional(),
  spaceThreadingState: z.string().optional(),
  spaceType: z.string().optional(),
  spaceUri: z.string().optional(),
  threaded: z.boolean().optional(),
  type: z.string().optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  accessToken: z.string().meta({ sensitive: true }).optional(),
  credentialsJson: z.string().meta({ sensitive: true }).optional(),
  project: z.string().optional(),
  scopes: z.string().optional(),
  quotaProject: z.string().optional(),
  apiEndpoint: z.string().optional(),
  accessSettings: z.object({
    accessPermissionSettings: z.object({
      discoverSpaceSetting: z.object({
        principals: z.array(z.object({
          audience: z.unknown().describe("An audience.").optional(),
        })).describe(
          "Optional. Unordered list. Allowed principals for this permission.",
        ).optional(),
      }).describe(
        "Optional. Access permission setting for discovering the space.",
      ).optional(),
      joinSpaceSetting: z.object({
        principals: z.array(z.object({
          audience: z.unknown().describe("An audience.").optional(),
        })).describe(
          "Optional. Unordered list. Allowed principals for this permission.",
        ).optional(),
      }).describe("Optional. Access permission setting for joining the space.")
        .optional(),
      viewSpaceMembershipSetting: z.object({
        principals: z.array(z.object({
          audience: z.unknown().describe("An audience.").optional(),
        })).describe(
          "Optional. Unordered list. Allowed principals for this permission.",
        ).optional(),
      }).describe(
        "Optional. Access permission setting for viewing space membership. Must be specified together with `PermissionSettings.view_space_membership` in the update mask and request body when updating who can view space membership. When granting view access to a target audience, you must also grant `PermissionSettings.view_space_membership` to all members in the same request. To remove an existing target audience (for example, to restrict view access to space managers or assistant managers only), specify an empty `AccessPermissionSetting` (with no `principals`).",
      ).optional(),
    }).describe(
      "Optional. Access permission settings for the space. To set the target audience when creating a space, specify the `accessSettings.audience` field in your request.",
    ).optional(),
    accessState: z.enum(["ACCESS_STATE_UNSPECIFIED", "PRIVATE", "DISCOVERABLE"])
      .describe("Output only. Indicates the access state of the space.")
      .optional(),
    audience: z.string().describe(
      "Optional. The resource name of the [target audience](https://support.google.com/a/answer/9934697) who can discover the space, join the space, and preview the messages in the space. If unset, only users or Google Groups who have been individually invited or added to the space can access it. For details, see [Make a space discoverable to a target audience](https://developers.google.com/workspace/chat/space-target-audience). Format: `audiences/{audience}` To use the default target audience for the Google Workspace organization, set to `audiences/default`. Reading the target audience supports: - [User authentication](https://developers.google.com/workspace/chat/authenticate-authorize-chat-user) - [App authentication](https://developers.google.com/workspace/chat/authenticate-authorize-chat-app) with [administrator approval](https://support.google.com/a?p=chat-app-auth) with the `chat.app.spaces` scope. This field is not populated when using the `chat.bot` scope with [app authentication](https://developers.google.com/workspace/chat/authenticate-authorize-chat-app). Setting the target audience requires [user authentication](https://developers.google.com/workspace/chat/authenticate-authorize-chat-user).",
    ).optional(),
  }).describe(
    "Optional. Specifies the [access setting](https://support.google.com/chat/answer/11971020) of the space. Only populated when the `space_type` is `SPACE`.",
  ).optional(),
  customer: z.string().describe(
    "Optional. Immutable. The customer id of the domain of the space. Required only when creating a space with [app authentication](https://developers.google.com/workspace/chat/authenticate-authorize-chat-app) and `SpaceType` is `SPACE`, otherwise should not be set. In the format `customers/{customer}`, where `customer` is the `id` from the [Admin SDK customer resource](https://developers.google.com/admin-sdk/directory/reference/rest/v1/customers). Private apps can also use the `customers/my_customer` alias to create the space in the same Google Workspace organization as the app. This field isn't populated for direct messages (DMs) or when the space is created by non-Google Workspace users.",
  ).optional(),
  displayName: z.string().describe(
    "Optional. The space's display name. Required when [creating a space](https://developers.google.com/workspace/chat/api/reference/rest/v1/spaces/create) with a `spaceType` of `SPACE`. If you receive the error message `ALREADY_EXISTS` when creating a space or updating the `displayName`, try a different `displayName`. An existing space within the Google Workspace organization might already use this display name. For direct messages, this field might be empty. Supports up to 128 characters.",
  ).optional(),
  importMode: z.boolean().describe(
    "Optional. Whether this space is created in `Import Mode` as part of a data migration into Google Workspace. While spaces are being imported, they aren't visible to users until the import is complete. Creating a space in `Import Mode`requires [user authentication](https://developers.google.com/workspace/chat/authenticate-authorize-chat-user).",
  ).optional(),
  name: z.string().describe(
    "Identifier. Resource name of the space. Format: `spaces/{space}` Where `{space}` represents the system-assigned ID for the space. You can obtain the space ID by calling the [`spaces.list()`](https://developers.google.com/workspace/chat/api/reference/rest/v1/spaces/list) method or from the space URL. For example, if the space URL is `https://mail.google.com/mail/u/0/#chat/space/AAAAAAAAA`, the space ID is `AAAAAAAAA`.",
  ).optional(),
  permissionSettings: z.object({
    manageApps: z.object({
      assistantManagersAllowed: z.boolean().describe(
        "Optional. Whether space managers `ROLE_ASSISTANT_MANAGER`) have this permission.",
      ).optional(),
      managersAllowed: z.boolean().describe(
        "Optional. Whether space owners (`ROLE_MANAGER`) have this permission.",
      ).optional(),
      membersAllowed: z.boolean().describe(
        "Optional. Whether basic space members (`ROLE_MEMBER`) have this permission.",
      ).optional(),
    }).describe("Optional. Setting for managing apps in a space.").optional(),
    manageMembersAndGroups: z.object({
      assistantManagersAllowed: z.boolean().describe(
        "Optional. Whether space managers `ROLE_ASSISTANT_MANAGER`) have this permission.",
      ).optional(),
      managersAllowed: z.boolean().describe(
        "Optional. Whether space owners (`ROLE_MANAGER`) have this permission.",
      ).optional(),
      membersAllowed: z.boolean().describe(
        "Optional. Whether basic space members (`ROLE_MEMBER`) have this permission.",
      ).optional(),
    }).describe("Optional. Setting for managing members and groups in a space.")
      .optional(),
    manageWebhooks: z.object({
      assistantManagersAllowed: z.boolean().describe(
        "Optional. Whether space managers `ROLE_ASSISTANT_MANAGER`) have this permission.",
      ).optional(),
      managersAllowed: z.boolean().describe(
        "Optional. Whether space owners (`ROLE_MANAGER`) have this permission.",
      ).optional(),
      membersAllowed: z.boolean().describe(
        "Optional. Whether basic space members (`ROLE_MEMBER`) have this permission.",
      ).optional(),
    }).describe("Optional. Setting for managing webhooks in a space.")
      .optional(),
    modifySpaceDetails: z.object({
      assistantManagersAllowed: z.boolean().describe(
        "Optional. Whether space managers `ROLE_ASSISTANT_MANAGER`) have this permission.",
      ).optional(),
      managersAllowed: z.boolean().describe(
        "Optional. Whether space owners (`ROLE_MANAGER`) have this permission.",
      ).optional(),
      membersAllowed: z.boolean().describe(
        "Optional. Whether basic space members (`ROLE_MEMBER`) have this permission.",
      ).optional(),
    }).describe(
      "Optional. Setting for updating space name, avatar, description and guidelines.",
    ).optional(),
    postMessages: z.object({
      assistantManagersAllowed: z.boolean().describe(
        "Optional. Whether space managers `ROLE_ASSISTANT_MANAGER`) have this permission.",
      ).optional(),
      managersAllowed: z.boolean().describe(
        "Optional. Whether space owners (`ROLE_MANAGER`) have this permission.",
      ).optional(),
      membersAllowed: z.boolean().describe(
        "Optional. Whether basic space members (`ROLE_MEMBER`) have this permission.",
      ).optional(),
    }).describe("Output only. Setting for posting messages in a space.")
      .optional(),
    replyMessages: z.object({
      assistantManagersAllowed: z.boolean().describe(
        "Optional. Whether space managers `ROLE_ASSISTANT_MANAGER`) have this permission.",
      ).optional(),
      managersAllowed: z.boolean().describe(
        "Optional. Whether space owners (`ROLE_MANAGER`) have this permission.",
      ).optional(),
      membersAllowed: z.boolean().describe(
        "Optional. Whether basic space members (`ROLE_MEMBER`) have this permission.",
      ).optional(),
    }).describe("Optional. Setting for replying to messages in a space.")
      .optional(),
    toggleHistory: z.object({
      assistantManagersAllowed: z.boolean().describe(
        "Optional. Whether space managers `ROLE_ASSISTANT_MANAGER`) have this permission.",
      ).optional(),
      managersAllowed: z.boolean().describe(
        "Optional. Whether space owners (`ROLE_MANAGER`) have this permission.",
      ).optional(),
      membersAllowed: z.boolean().describe(
        "Optional. Whether basic space members (`ROLE_MEMBER`) have this permission.",
      ).optional(),
    }).describe("Optional. Setting for toggling space history on and off.")
      .optional(),
    useAtMentionAll: z.object({
      assistantManagersAllowed: z.boolean().describe(
        "Optional. Whether space managers `ROLE_ASSISTANT_MANAGER`) have this permission.",
      ).optional(),
      managersAllowed: z.boolean().describe(
        "Optional. Whether space owners (`ROLE_MANAGER`) have this permission.",
      ).optional(),
      membersAllowed: z.boolean().describe(
        "Optional. Whether basic space members (`ROLE_MEMBER`) have this permission.",
      ).optional(),
    }).describe("Optional. Setting for using @all in a space.").optional(),
    viewSpaceMembership: z.object({
      assistantManagersAllowed: z.boolean().describe(
        "Optional. Whether space managers `ROLE_ASSISTANT_MANAGER`) have this permission.",
      ).optional(),
      managersAllowed: z.boolean().describe(
        "Optional. Whether space owners (`ROLE_MANAGER`) have this permission.",
      ).optional(),
      membersAllowed: z.boolean().describe(
        "Optional. Whether basic space members (`ROLE_MEMBER`) have this permission.",
      ).optional(),
    }).describe(
      "Optional. Setting for viewing space membership. Must be specified together with `AccessPermissionSettings.view_space_membership_setting` in the update mask and request body when updating who can view space membership. When restricting view access to specific roles (for example, space managers or assistant managers only), specify the desired role permissions here and provide an empty `AccessPermissionSettings.view_space_membership_setting` in the same request. If a target audience is configured in `AccessPermissionSettings.view_space_membership_setting`, this setting must be granted to all members.",
    ).optional(),
  }).describe(
    "Optional. Space permission settings for existing spaces. Input for updating exact space permission settings, where existing permission settings are replaced. Output lists current permission settings. Reading and updating permission settings supports: - [App authentication](https://developers.google.com/workspace/chat/authenticate-authorize-chat-app) with [administrator approval](https://support.google.com/a?p=chat-app-auth) with the `chat.app.spaces` scope. Only populated and settable when the Chat app created the space. - [User authentication](https://developers.google.com/workspace/chat/authenticate-authorize-chat-user)",
  ).optional(),
  predefinedPermissionSettings: z.enum([
    "PREDEFINED_PERMISSION_SETTINGS_UNSPECIFIED",
    "COLLABORATION_SPACE",
    "ANNOUNCEMENT_SPACE",
  ]).describe(
    "Optional. Input only. Predefined space permission settings, input only when creating a space. If the field is not set, a collaboration space is created. After you create the space, settings are populated in the `PermissionSettings` field. Setting predefined permission settings supports: - [App authentication](https://developers.google.com/workspace/chat/authenticate-authorize-chat-app) with [administrator approval](https://support.google.com/a?p=chat-app-auth) with the `chat.app.spaces` or `chat.app.spaces.create` scopes. - [User authentication](https://developers.google.com/workspace/chat/authenticate-authorize-chat-user)",
  ).optional(),
  singleUserBotDm: z.boolean().describe(
    "Optional. Whether the space is a DM between a Chat app and a single human.",
  ).optional(),
  spaceDetails: z.object({
    description: z.string().describe(
      "Optional. A description of the space. For example, describe the space's discussion topic, functional purpose, or participants. Supports up to 150 characters.",
    ).optional(),
    guidelines: z.string().describe(
      "Optional. The space's rules, expectations, and etiquette. Supports up to 5,000 characters.",
    ).optional(),
  }).describe(
    "Optional. Details about the space including description and rules.",
  ).optional(),
  spaceHistoryState: z.enum([
    "HISTORY_STATE_UNSPECIFIED",
    "HISTORY_OFF",
    "HISTORY_ON",
  ]).describe(
    "Optional. The message history state for messages and threads in this space.",
  ).optional(),
  requestId: z.string().describe(
    "Optional. A unique ID for this request. A random UUID is recommended. Specifying a request ID makes the request idempotent, which ensures that multiple identical requests with the same request ID result in only a single space being created. Subsequent requests with the same request ID return the existing space and do not update the space, even if the requested details differ from the current state. To use this field effectively: - Ensure that subsequent requests are identical and use the same authentication credentials as the original request. - If a space was already created with the provided request ID, the request returns that space. Note that the returned space might not be fully populated; the API echoes the space in your request with the system-assigned resource name populated. To retrieve the latest metadata for the space, call `GetSpace`. - Reusing an existing request ID with a different authenticated user results in an error.",
  ).optional(),
  useAdminAccess: z.string().describe(
    "Optional. When `true`, the method runs using the user's Google Workspace administrator privileges. The calling user must be a Google Workspace administrator with the [manage chat and spaces conversations privilege](https://support.google.com/a/answer/13369245). Requires the `chat.admin.spaces` [OAuth 2.0 scope](https://developers.google.com/workspace/chat/authenticate-authorize#chat-api-scopes). Some `FieldMask` values are not supported using admin access. For details, see the description of `update_mask`.",
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

/** Swamp extension model for Google Cloud Google Chat Spaces. Registered at `@swamp/gcp/chat/spaces`. */
export const model = {
  type: "@swamp/gcp/chat/spaces",
  version: "2026.09.17.1",
  upgrades: [
    {
      toVersion: "2026.04.01.2",
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
      toVersion: "2026.04.08.1",
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
      toVersion: "2026.05.25.2",
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
      toVersion: "2026.07.02.1",
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
      description: "Removed: membershipCount",
      upgradeAttributes: (old: Record<string, unknown>) => {
        const { membershipCount: _membershipCount, ...rest } = old;
        return rest;
      },
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
      toVersion: "2026.07.28.1",
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
      toVersion: "2026.08.25.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.01.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.07.1",
      description: "Added: useAdminAccess",
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
        "A space in Google Chat. Spaces are conversations between two or more users or...",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a spaces",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        const body: Record<string, unknown> = {};
        if (g["accessSettings"] !== undefined) {
          body["accessSettings"] = g["accessSettings"];
        }
        if (g["customer"] !== undefined) body["customer"] = g["customer"];
        if (g["displayName"] !== undefined) {
          body["displayName"] = g["displayName"];
        }
        if (g["importMode"] !== undefined) body["importMode"] = g["importMode"];
        if (g["name"] !== undefined) body["name"] = g["name"];
        if (g["permissionSettings"] !== undefined) {
          body["permissionSettings"] = g["permissionSettings"];
        }
        if (g["predefinedPermissionSettings"] !== undefined) {
          body["predefinedPermissionSettings"] =
            g["predefinedPermissionSettings"];
        }
        if (g["singleUserBotDm"] !== undefined) {
          body["singleUserBotDm"] = g["singleUserBotDm"];
        }
        if (g["spaceDetails"] !== undefined) {
          body["spaceDetails"] = g["spaceDetails"];
        }
        if (g["spaceHistoryState"] !== undefined) {
          body["spaceHistoryState"] = g["spaceHistoryState"];
        }
        if (g["requestId"] !== undefined) {
          params["requestId"] = String(g["requestId"]);
        }
        if (g["name"] !== undefined) params["name"] = String(g["name"]);
        const result = await createResource(
          baseUrl,
          INSERT_CONFIG,
          params,
          body,
          GET_CONFIG,
          undefined,
          {
            listConfig: LIST_CONFIG,
            listParams: {},
            matchField: "displayName",
            matchValue: String(g["displayName"] ?? ""),
          },
          credentials,
        ) as StateData;
        const instanceName = ((g.name ?? result.name)?.toString() ?? "current")
          .replace(/[\/\\]/g, "_").replace(/\.\./g, "_").replace(/\0/g, "");
        const handle = await context.writeResource(
          "state",
          instanceName,
          result,
        );
        return { dataHandles: [handle] };
      },
    },
    get: {
      description: "Get a spaces",
      arguments: z.object({
        identifier: z.string().describe("The name of the spaces"),
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
      description: "Update spaces attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific spaces by name (e.g. one discovered by list)",
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
        if (g["accessSettings"] !== undefined) {
          body["accessSettings"] = g["accessSettings"];
        }
        if (g["displayName"] !== undefined) {
          body["displayName"] = g["displayName"];
        }
        if (g["importMode"] !== undefined) body["importMode"] = g["importMode"];
        if (g["permissionSettings"] !== undefined) {
          body["permissionSettings"] = g["permissionSettings"];
        }
        if (g["predefinedPermissionSettings"] !== undefined) {
          body["predefinedPermissionSettings"] =
            g["predefinedPermissionSettings"];
        }
        if (g["singleUserBotDm"] !== undefined) {
          body["singleUserBotDm"] = g["singleUserBotDm"];
        }
        if (g["spaceDetails"] !== undefined) {
          body["spaceDetails"] = g["spaceDetails"];
        }
        if (g["spaceHistoryState"] !== undefined) {
          body["spaceHistoryState"] = g["spaceHistoryState"];
        }
        if (g["useAdminAccess"] !== undefined) {
          params["useAdminAccess"] = String(g["useAdminAccess"]);
        } else if (existing["useAdminAccess"] !== undefined) {
          params["useAdminAccess"] = String(existing["useAdminAccess"]);
        }
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
      description: "Delete the spaces",
      arguments: z.object({
        identifier: z.string().describe("The name of the spaces"),
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
      description: "Sync spaces state from GCP",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific spaces by name (e.g. one discovered by list)",
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
    list: {
      description: "List spaces resources",
      arguments: z.object({
        filter: z.string().describe(
          'Optional. A query filter. You can filter spaces by the space type ([`space_type`](https://developers.google.com/workspace/chat/api/reference/rest/v1/spaces#spacetype)). To filter by space type, you must specify valid enum value, such as `SPACE` or `GROUP_CHAT` (the `space_type` can\'t be `SPACE_TYPE_UNSPECIFIED`). To query for multiple space types, use the `OR` operator. For example, the following queries are valid: ``` space_type = "SPACE" spaceType = "GROUP_CHAT" OR spaceType = "DIRECT_MESSAGE" ``` Invalid queries are rejected by the server with an `INVALID_ARGUMENT` error.',
        ).optional(),
        pageSize: z.number().describe(
          "Optional. The maximum number of spaces to return. The service might return fewer than this value. If unspecified, at most 100 spaces are returned. The maximum value is 1000. If you use a value more than 1000, it's automatically changed to 1000. Negative values return an `INVALID_ARGUMENT` error.",
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
        if (args["filter"] !== undefined) {
          params["filter"] = String(args["filter"]);
        }
        if (args["pageSize"] !== undefined) {
          params["pageSize"] = String(args["pageSize"]);
        }
        const { items, nextPageToken } = await listResources(
          baseUrl,
          LIST_CONFIG,
          params,
          "spaces",
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
    complete_import: {
      description: "complete import",
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
            "id": "chat.spaces.completeImport",
            "path": "v1/{+name}:completeImport",
            "httpMethod": "POST",
            "parameterOrder": ["name"],
            "parameters": { "name": { "location": "path", "required": true } },
          },
          params,
          {},
          undefined,
          undefined,
          undefined,
          credentials,
        );
        return { result };
      },
    },
    find_direct_message: {
      description: "find direct message",
      arguments: z.object({
        name: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (args["name"] !== undefined) params["name"] = String(args["name"]);
        const result = await createResource(
          baseUrl,
          {
            "id": "chat.spaces.findDirectMessage",
            "path": "v1/spaces:findDirectMessage",
            "httpMethod": "GET",
            "parameterOrder": [],
            "parameters": { "name": { "location": "query" } },
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
    find_group_chats: {
      description: "find group chats",
      arguments: z.object({
        pageSize: z.any().optional(),
        pageToken: z.any().optional(),
        spaceView: z.any().optional(),
        users: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (args["pageSize"] !== undefined) {
          params["pageSize"] = String(args["pageSize"]);
        }
        if (args["pageToken"] !== undefined) {
          params["pageToken"] = String(args["pageToken"]);
        }
        if (args["spaceView"] !== undefined) {
          params["spaceView"] = String(args["spaceView"]);
        }
        if (args["users"] !== undefined) {
          params["users"] = String(args["users"]);
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "chat.spaces.findGroupChats",
            "path": "v1/spaces:findGroupChats",
            "httpMethod": "GET",
            "parameterOrder": [],
            "parameters": {
              "pageSize": { "location": "query" },
              "pageToken": { "location": "query" },
              "spaceView": { "location": "query" },
              "users": { "location": "query" },
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
    search: {
      description: "search",
      arguments: z.object({
        orderBy: z.any().optional(),
        pageSize: z.any().optional(),
        pageToken: z.any().optional(),
        query: z.any().optional(),
        useAdminAccess: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (args["orderBy"] !== undefined) {
          params["orderBy"] = String(args["orderBy"]);
        }
        if (args["pageSize"] !== undefined) {
          params["pageSize"] = String(args["pageSize"]);
        }
        if (args["pageToken"] !== undefined) {
          params["pageToken"] = String(args["pageToken"]);
        }
        if (args["query"] !== undefined) {
          params["query"] = String(args["query"]);
        }
        if (args["useAdminAccess"] !== undefined) {
          params["useAdminAccess"] = String(args["useAdminAccess"]);
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "chat.spaces.search",
            "path": "v1/spaces:search",
            "httpMethod": "GET",
            "parameterOrder": [],
            "parameters": {
              "orderBy": { "location": "query" },
              "pageSize": { "location": "query" },
              "pageToken": { "location": "query" },
              "query": { "location": "query" },
              "useAdminAccess": { "location": "query" },
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
    setup: {
      description: "setup",
      arguments: z.object({
        memberships: z.any().optional(),
        requestId: z.any().optional(),
        space: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        const body: Record<string, unknown> = {};
        if (args["memberships"] !== undefined) {
          body["memberships"] = args["memberships"];
        }
        if (args["requestId"] !== undefined) {
          body["requestId"] = args["requestId"];
        }
        if (args["space"] !== undefined) body["space"] = args["space"];
        const result = await createResource(
          baseUrl,
          {
            "id": "chat.spaces.setup",
            "path": "v1/spaces:setup",
            "httpMethod": "POST",
            "parameterOrder": [],
            "parameters": {},
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

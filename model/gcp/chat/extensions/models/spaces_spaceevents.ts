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

// Auto-generated extension model for @swamp/gcp/chat/spaces-spaceevents
// Do not edit manually. Re-generate with: deno task generate:gcp

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Google Cloud Google Chat Spaces.SpaceEvents.
 *
 * An event that represents a change or activity in a Google Chat space. To learn more, see [Work with events from Google Chat](https://developers.google.com/workspace/chat/events-overview).
 *
 * Wraps the GCP resource as a swamp model so create, get, update,
 * delete, and sync can be driven through `swamp model`.
 *
 * @module
 */

import { z } from "npm:zod@4.3.6";
import {
  type ExplicitGcpCredentials,
  getProjectId,
  isResourceNotFoundError,
  listResources,
  readResource,
} from "./_lib/gcp.ts";

/** Construct the fully-qualified resource name from parent and short name. */
function buildResourceName(parent: string, shortName: string): string {
  return `${parent}/spaceEvents/${shortName}`;
}

const BASE_URL = "https://chat.googleapis.com/";

const GET_CONFIG = {
  "id": "chat.spaces.spaceEvents.get",
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
  },
} as const;

const LIST_CONFIG = {
  "id": "chat.spaces.spaceEvents.list",
  "path": "v1/{+parent}/spaceEvents",
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
  parent: z.string().describe(
    "The parent resource name (e.g., projects/my-project/locations/us-central1, organizations/123, folders/456)",
  ).optional(),
});

const StateSchema = z.object({
  eventTime: z.string().optional(),
  eventType: z.string().optional(),
  membershipBatchCreatedEventData: z.object({
    memberships: z.array(z.object({
      membership: z.object({
        affiliation: z.string(),
        createTime: z.string(),
        deleteTime: z.string(),
        groupMember: z.object({
          name: z.unknown(),
        }),
        member: z.object({
          displayName: z.unknown(),
          domainId: z.unknown(),
          isAnonymous: z.unknown(),
          name: z.unknown(),
          type: z.unknown(),
        }),
        name: z.string(),
        role: z.string(),
        state: z.string(),
      }),
    })),
  }).optional(),
  membershipBatchDeletedEventData: z.object({
    memberships: z.array(z.object({
      membership: z.object({
        affiliation: z.string(),
        createTime: z.string(),
        deleteTime: z.string(),
        groupMember: z.object({
          name: z.unknown(),
        }),
        member: z.object({
          displayName: z.unknown(),
          domainId: z.unknown(),
          isAnonymous: z.unknown(),
          name: z.unknown(),
          type: z.unknown(),
        }),
        name: z.string(),
        role: z.string(),
        state: z.string(),
      }),
    })),
  }).optional(),
  membershipBatchUpdatedEventData: z.object({
    memberships: z.array(z.object({
      membership: z.object({
        affiliation: z.string(),
        createTime: z.string(),
        deleteTime: z.string(),
        groupMember: z.object({
          name: z.unknown(),
        }),
        member: z.object({
          displayName: z.unknown(),
          domainId: z.unknown(),
          isAnonymous: z.unknown(),
          name: z.unknown(),
          type: z.unknown(),
        }),
        name: z.string(),
        role: z.string(),
        state: z.string(),
      }),
    })),
  }).optional(),
  membershipCreatedEventData: z.object({
    membership: z.object({
      affiliation: z.string(),
      createTime: z.string(),
      deleteTime: z.string(),
      groupMember: z.object({
        name: z.string(),
      }),
      member: z.object({
        displayName: z.string(),
        domainId: z.string(),
        isAnonymous: z.boolean(),
        name: z.string(),
        type: z.string(),
      }),
      name: z.string(),
      role: z.string(),
      state: z.string(),
    }),
  }).optional(),
  membershipDeletedEventData: z.object({
    membership: z.object({
      affiliation: z.string(),
      createTime: z.string(),
      deleteTime: z.string(),
      groupMember: z.object({
        name: z.string(),
      }),
      member: z.object({
        displayName: z.string(),
        domainId: z.string(),
        isAnonymous: z.boolean(),
        name: z.string(),
        type: z.string(),
      }),
      name: z.string(),
      role: z.string(),
      state: z.string(),
    }),
  }).optional(),
  membershipUpdatedEventData: z.object({
    membership: z.object({
      affiliation: z.string(),
      createTime: z.string(),
      deleteTime: z.string(),
      groupMember: z.object({
        name: z.string(),
      }),
      member: z.object({
        displayName: z.string(),
        domainId: z.string(),
        isAnonymous: z.boolean(),
        name: z.string(),
        type: z.string(),
      }),
      name: z.string(),
      role: z.string(),
      state: z.string(),
    }),
  }).optional(),
  messageBatchCreatedEventData: z.object({
    messages: z.array(z.object({
      message: z.object({
        accessoryWidgets: z.array(z.unknown()),
        actionResponse: z.object({
          dialogAction: z.unknown(),
          type: z.unknown(),
          updatedWidget: z.unknown(),
          url: z.unknown(),
        }),
        annotations: z.array(z.unknown()),
        argumentText: z.string(),
        attachedGifs: z.array(z.unknown()),
        attachment: z.array(z.unknown()),
        cards: z.array(z.unknown()),
        cardsV2: z.array(z.unknown()),
        clientAssignedMessageId: z.string(),
        createTime: z.string(),
        deleteTime: z.string(),
        deletionMetadata: z.object({
          deletionType: z.unknown(),
        }),
        emojiReactionSummaries: z.array(z.unknown()),
        fallbackText: z.string(),
        formattedText: z.string(),
        lastUpdateTime: z.string(),
        markupSyntax: z.string(),
        matchedUrl: z.object({
          url: z.unknown(),
        }),
        name: z.string(),
        privateMessageViewer: z.object({
          displayName: z.unknown(),
          domainId: z.unknown(),
          isAnonymous: z.unknown(),
          name: z.unknown(),
          type: z.unknown(),
        }),
        quotedMessageMetadata: z.object({
          forwardedMetadata: z.unknown(),
          lastUpdateTime: z.unknown(),
          name: z.unknown(),
          quoteType: z.unknown(),
          quotedMessageSnapshot: z.unknown(),
        }),
        sender: z.object({
          displayName: z.unknown(),
          domainId: z.unknown(),
          isAnonymous: z.unknown(),
          name: z.unknown(),
          type: z.unknown(),
        }),
        silent: z.boolean(),
        slashCommand: z.object({
          commandId: z.unknown(),
        }),
        space: z.object({
          accessSettings: z.unknown(),
          adminInstalled: z.unknown(),
          createTime: z.unknown(),
          customer: z.unknown(),
          displayName: z.unknown(),
          externalUserAllowed: z.unknown(),
          importMode: z.unknown(),
          importModeExpireTime: z.unknown(),
          lastActiveTime: z.unknown(),
          membershipCount: z.unknown(),
          name: z.unknown(),
          permissionSettings: z.unknown(),
          predefinedPermissionSettings: z.unknown(),
          singleUserBotDm: z.unknown(),
          spaceDetails: z.unknown(),
          spaceHistoryState: z.unknown(),
          spaceThreadingState: z.unknown(),
          spaceType: z.unknown(),
          spaceUri: z.unknown(),
          threaded: z.unknown(),
          type: z.unknown(),
        }),
        text: z.string(),
        thread: z.object({
          name: z.unknown(),
          threadKey: z.unknown(),
        }),
        threadReply: z.boolean(),
      }),
    })),
  }).optional(),
  messageBatchDeletedEventData: z.object({
    messages: z.array(z.object({
      message: z.object({
        accessoryWidgets: z.array(z.unknown()),
        actionResponse: z.object({
          dialogAction: z.unknown(),
          type: z.unknown(),
          updatedWidget: z.unknown(),
          url: z.unknown(),
        }),
        annotations: z.array(z.unknown()),
        argumentText: z.string(),
        attachedGifs: z.array(z.unknown()),
        attachment: z.array(z.unknown()),
        cards: z.array(z.unknown()),
        cardsV2: z.array(z.unknown()),
        clientAssignedMessageId: z.string(),
        createTime: z.string(),
        deleteTime: z.string(),
        deletionMetadata: z.object({
          deletionType: z.unknown(),
        }),
        emojiReactionSummaries: z.array(z.unknown()),
        fallbackText: z.string(),
        formattedText: z.string(),
        lastUpdateTime: z.string(),
        markupSyntax: z.string(),
        matchedUrl: z.object({
          url: z.unknown(),
        }),
        name: z.string(),
        privateMessageViewer: z.object({
          displayName: z.unknown(),
          domainId: z.unknown(),
          isAnonymous: z.unknown(),
          name: z.unknown(),
          type: z.unknown(),
        }),
        quotedMessageMetadata: z.object({
          forwardedMetadata: z.unknown(),
          lastUpdateTime: z.unknown(),
          name: z.unknown(),
          quoteType: z.unknown(),
          quotedMessageSnapshot: z.unknown(),
        }),
        sender: z.object({
          displayName: z.unknown(),
          domainId: z.unknown(),
          isAnonymous: z.unknown(),
          name: z.unknown(),
          type: z.unknown(),
        }),
        silent: z.boolean(),
        slashCommand: z.object({
          commandId: z.unknown(),
        }),
        space: z.object({
          accessSettings: z.unknown(),
          adminInstalled: z.unknown(),
          createTime: z.unknown(),
          customer: z.unknown(),
          displayName: z.unknown(),
          externalUserAllowed: z.unknown(),
          importMode: z.unknown(),
          importModeExpireTime: z.unknown(),
          lastActiveTime: z.unknown(),
          membershipCount: z.unknown(),
          name: z.unknown(),
          permissionSettings: z.unknown(),
          predefinedPermissionSettings: z.unknown(),
          singleUserBotDm: z.unknown(),
          spaceDetails: z.unknown(),
          spaceHistoryState: z.unknown(),
          spaceThreadingState: z.unknown(),
          spaceType: z.unknown(),
          spaceUri: z.unknown(),
          threaded: z.unknown(),
          type: z.unknown(),
        }),
        text: z.string(),
        thread: z.object({
          name: z.unknown(),
          threadKey: z.unknown(),
        }),
        threadReply: z.boolean(),
      }),
    })),
  }).optional(),
  messageBatchUpdatedEventData: z.object({
    messages: z.array(z.object({
      message: z.object({
        accessoryWidgets: z.array(z.unknown()),
        actionResponse: z.object({
          dialogAction: z.unknown(),
          type: z.unknown(),
          updatedWidget: z.unknown(),
          url: z.unknown(),
        }),
        annotations: z.array(z.unknown()),
        argumentText: z.string(),
        attachedGifs: z.array(z.unknown()),
        attachment: z.array(z.unknown()),
        cards: z.array(z.unknown()),
        cardsV2: z.array(z.unknown()),
        clientAssignedMessageId: z.string(),
        createTime: z.string(),
        deleteTime: z.string(),
        deletionMetadata: z.object({
          deletionType: z.unknown(),
        }),
        emojiReactionSummaries: z.array(z.unknown()),
        fallbackText: z.string(),
        formattedText: z.string(),
        lastUpdateTime: z.string(),
        markupSyntax: z.string(),
        matchedUrl: z.object({
          url: z.unknown(),
        }),
        name: z.string(),
        privateMessageViewer: z.object({
          displayName: z.unknown(),
          domainId: z.unknown(),
          isAnonymous: z.unknown(),
          name: z.unknown(),
          type: z.unknown(),
        }),
        quotedMessageMetadata: z.object({
          forwardedMetadata: z.unknown(),
          lastUpdateTime: z.unknown(),
          name: z.unknown(),
          quoteType: z.unknown(),
          quotedMessageSnapshot: z.unknown(),
        }),
        sender: z.object({
          displayName: z.unknown(),
          domainId: z.unknown(),
          isAnonymous: z.unknown(),
          name: z.unknown(),
          type: z.unknown(),
        }),
        silent: z.boolean(),
        slashCommand: z.object({
          commandId: z.unknown(),
        }),
        space: z.object({
          accessSettings: z.unknown(),
          adminInstalled: z.unknown(),
          createTime: z.unknown(),
          customer: z.unknown(),
          displayName: z.unknown(),
          externalUserAllowed: z.unknown(),
          importMode: z.unknown(),
          importModeExpireTime: z.unknown(),
          lastActiveTime: z.unknown(),
          membershipCount: z.unknown(),
          name: z.unknown(),
          permissionSettings: z.unknown(),
          predefinedPermissionSettings: z.unknown(),
          singleUserBotDm: z.unknown(),
          spaceDetails: z.unknown(),
          spaceHistoryState: z.unknown(),
          spaceThreadingState: z.unknown(),
          spaceType: z.unknown(),
          spaceUri: z.unknown(),
          threaded: z.unknown(),
          type: z.unknown(),
        }),
        text: z.string(),
        thread: z.object({
          name: z.unknown(),
          threadKey: z.unknown(),
        }),
        threadReply: z.boolean(),
      }),
    })),
  }).optional(),
  messageCreatedEventData: z.object({
    message: z.object({
      accessoryWidgets: z.array(z.object({
        buttonList: z.object({
          buttons: z.unknown(),
        }),
      })),
      actionResponse: z.object({
        dialogAction: z.object({
          actionStatus: z.object({
            statusCode: z.unknown(),
            userFacingMessage: z.unknown(),
          }),
          dialog: z.object({
            body: z.unknown(),
          }),
        }),
        type: z.string(),
        updatedWidget: z.object({
          suggestions: z.object({
            items: z.unknown(),
          }),
          widget: z.string(),
        }),
        url: z.string(),
      }),
      annotations: z.array(z.object({
        customEmojiMetadata: z.object({
          customEmoji: z.unknown(),
        }),
        length: z.number(),
        richLinkMetadata: z.object({
          calendarEventLinkData: z.unknown(),
          chatSpaceLinkData: z.unknown(),
          driveLinkData: z.unknown(),
          meetSpaceLinkData: z.unknown(),
          richLinkType: z.unknown(),
          uri: z.unknown(),
        }),
        slashCommand: z.object({
          bot: z.unknown(),
          commandId: z.unknown(),
          commandName: z.unknown(),
          triggersDialog: z.unknown(),
          type: z.unknown(),
        }),
        startIndex: z.number(),
        type: z.string(),
        userMention: z.object({
          type: z.unknown(),
          user: z.unknown(),
        }),
      })),
      argumentText: z.string(),
      attachedGifs: z.array(z.object({
        uri: z.string(),
      })),
      attachment: z.array(z.object({
        attachmentDataRef: z.object({
          attachmentUploadToken: z.unknown(),
          resourceName: z.unknown(),
        }),
        contentName: z.string(),
        contentType: z.string(),
        downloadUri: z.string(),
        driveDataRef: z.object({
          driveFileId: z.unknown(),
        }),
        name: z.string(),
        source: z.string(),
        thumbnailUri: z.string(),
      })),
      cards: z.array(z.object({
        cardActions: z.array(z.unknown()),
        header: z.object({
          imageStyle: z.unknown(),
          imageUrl: z.unknown(),
          subtitle: z.unknown(),
          title: z.unknown(),
        }),
        name: z.string(),
        sections: z.array(z.unknown()),
      })),
      cardsV2: z.array(z.object({
        card: z.object({
          cardActions: z.unknown(),
          displayStyle: z.unknown(),
          expressionData: z.unknown(),
          fixedFooter: z.unknown(),
          header: z.unknown(),
          name: z.unknown(),
          peekCardHeader: z.unknown(),
          sectionDividerStyle: z.unknown(),
          sections: z.unknown(),
        }),
        cardId: z.string(),
      })),
      clientAssignedMessageId: z.string(),
      createTime: z.string(),
      deleteTime: z.string(),
      deletionMetadata: z.object({
        deletionType: z.string(),
      }),
      emojiReactionSummaries: z.array(z.object({
        emoji: z.object({
          customEmoji: z.unknown(),
          unicode: z.unknown(),
        }),
        reactionCount: z.number(),
      })),
      fallbackText: z.string(),
      formattedText: z.string(),
      lastUpdateTime: z.string(),
      markupSyntax: z.string(),
      matchedUrl: z.object({
        url: z.string(),
      }),
      name: z.string(),
      privateMessageViewer: z.object({
        displayName: z.string(),
        domainId: z.string(),
        isAnonymous: z.boolean(),
        name: z.string(),
        type: z.string(),
      }),
      quotedMessageMetadata: z.object({
        forwardedMetadata: z.object({
          space: z.string(),
          spaceDisplayName: z.string(),
        }),
        lastUpdateTime: z.string(),
        name: z.string(),
        quoteType: z.string(),
        quotedMessageSnapshot: z.object({
          annotations: z.array(z.unknown()),
          attachments: z.array(z.unknown()),
          formattedText: z.string(),
          sender: z.string(),
          text: z.string(),
        }),
      }),
      sender: z.object({
        displayName: z.string(),
        domainId: z.string(),
        isAnonymous: z.boolean(),
        name: z.string(),
        type: z.string(),
      }),
      silent: z.boolean(),
      slashCommand: z.object({
        commandId: z.string(),
      }),
      space: z.object({
        accessSettings: z.object({
          accessPermissionSettings: z.object({
            discoverSpaceSetting: z.unknown(),
            joinSpaceSetting: z.unknown(),
            viewSpaceMembershipSetting: z.unknown(),
          }),
          accessState: z.string(),
          audience: z.string(),
        }),
        adminInstalled: z.boolean(),
        createTime: z.string(),
        customer: z.string(),
        displayName: z.string(),
        externalUserAllowed: z.boolean(),
        importMode: z.boolean(),
        importModeExpireTime: z.string(),
        lastActiveTime: z.string(),
        membershipCount: z.object({
          joinedDirectHumanUserCount: z.number(),
          joinedGroupCount: z.number(),
        }),
        name: z.string(),
        permissionSettings: z.object({
          manageApps: z.object({
            assistantManagersAllowed: z.unknown(),
            managersAllowed: z.unknown(),
            membersAllowed: z.unknown(),
          }),
          manageMembersAndGroups: z.object({
            assistantManagersAllowed: z.unknown(),
            managersAllowed: z.unknown(),
            membersAllowed: z.unknown(),
          }),
          manageWebhooks: z.object({
            assistantManagersAllowed: z.unknown(),
            managersAllowed: z.unknown(),
            membersAllowed: z.unknown(),
          }),
          modifySpaceDetails: z.object({
            assistantManagersAllowed: z.unknown(),
            managersAllowed: z.unknown(),
            membersAllowed: z.unknown(),
          }),
          postMessages: z.object({
            assistantManagersAllowed: z.unknown(),
            managersAllowed: z.unknown(),
            membersAllowed: z.unknown(),
          }),
          replyMessages: z.object({
            assistantManagersAllowed: z.unknown(),
            managersAllowed: z.unknown(),
            membersAllowed: z.unknown(),
          }),
          toggleHistory: z.object({
            assistantManagersAllowed: z.unknown(),
            managersAllowed: z.unknown(),
            membersAllowed: z.unknown(),
          }),
          useAtMentionAll: z.object({
            assistantManagersAllowed: z.unknown(),
            managersAllowed: z.unknown(),
            membersAllowed: z.unknown(),
          }),
          viewSpaceMembership: z.object({
            assistantManagersAllowed: z.unknown(),
            managersAllowed: z.unknown(),
            membersAllowed: z.unknown(),
          }),
        }),
        predefinedPermissionSettings: z.string(),
        singleUserBotDm: z.boolean(),
        spaceDetails: z.object({
          description: z.string(),
          guidelines: z.string(),
        }),
        spaceHistoryState: z.string(),
        spaceThreadingState: z.string(),
        spaceType: z.string(),
        spaceUri: z.string(),
        threaded: z.boolean(),
        type: z.string(),
      }),
      text: z.string(),
      thread: z.object({
        name: z.string(),
        threadKey: z.string(),
      }),
      threadReply: z.boolean(),
    }),
  }).optional(),
  messageDeletedEventData: z.object({
    message: z.object({
      accessoryWidgets: z.array(z.object({
        buttonList: z.object({
          buttons: z.unknown(),
        }),
      })),
      actionResponse: z.object({
        dialogAction: z.object({
          actionStatus: z.object({
            statusCode: z.unknown(),
            userFacingMessage: z.unknown(),
          }),
          dialog: z.object({
            body: z.unknown(),
          }),
        }),
        type: z.string(),
        updatedWidget: z.object({
          suggestions: z.object({
            items: z.unknown(),
          }),
          widget: z.string(),
        }),
        url: z.string(),
      }),
      annotations: z.array(z.object({
        customEmojiMetadata: z.object({
          customEmoji: z.unknown(),
        }),
        length: z.number(),
        richLinkMetadata: z.object({
          calendarEventLinkData: z.unknown(),
          chatSpaceLinkData: z.unknown(),
          driveLinkData: z.unknown(),
          meetSpaceLinkData: z.unknown(),
          richLinkType: z.unknown(),
          uri: z.unknown(),
        }),
        slashCommand: z.object({
          bot: z.unknown(),
          commandId: z.unknown(),
          commandName: z.unknown(),
          triggersDialog: z.unknown(),
          type: z.unknown(),
        }),
        startIndex: z.number(),
        type: z.string(),
        userMention: z.object({
          type: z.unknown(),
          user: z.unknown(),
        }),
      })),
      argumentText: z.string(),
      attachedGifs: z.array(z.object({
        uri: z.string(),
      })),
      attachment: z.array(z.object({
        attachmentDataRef: z.object({
          attachmentUploadToken: z.unknown(),
          resourceName: z.unknown(),
        }),
        contentName: z.string(),
        contentType: z.string(),
        downloadUri: z.string(),
        driveDataRef: z.object({
          driveFileId: z.unknown(),
        }),
        name: z.string(),
        source: z.string(),
        thumbnailUri: z.string(),
      })),
      cards: z.array(z.object({
        cardActions: z.array(z.unknown()),
        header: z.object({
          imageStyle: z.unknown(),
          imageUrl: z.unknown(),
          subtitle: z.unknown(),
          title: z.unknown(),
        }),
        name: z.string(),
        sections: z.array(z.unknown()),
      })),
      cardsV2: z.array(z.object({
        card: z.object({
          cardActions: z.unknown(),
          displayStyle: z.unknown(),
          expressionData: z.unknown(),
          fixedFooter: z.unknown(),
          header: z.unknown(),
          name: z.unknown(),
          peekCardHeader: z.unknown(),
          sectionDividerStyle: z.unknown(),
          sections: z.unknown(),
        }),
        cardId: z.string(),
      })),
      clientAssignedMessageId: z.string(),
      createTime: z.string(),
      deleteTime: z.string(),
      deletionMetadata: z.object({
        deletionType: z.string(),
      }),
      emojiReactionSummaries: z.array(z.object({
        emoji: z.object({
          customEmoji: z.unknown(),
          unicode: z.unknown(),
        }),
        reactionCount: z.number(),
      })),
      fallbackText: z.string(),
      formattedText: z.string(),
      lastUpdateTime: z.string(),
      markupSyntax: z.string(),
      matchedUrl: z.object({
        url: z.string(),
      }),
      name: z.string(),
      privateMessageViewer: z.object({
        displayName: z.string(),
        domainId: z.string(),
        isAnonymous: z.boolean(),
        name: z.string(),
        type: z.string(),
      }),
      quotedMessageMetadata: z.object({
        forwardedMetadata: z.object({
          space: z.string(),
          spaceDisplayName: z.string(),
        }),
        lastUpdateTime: z.string(),
        name: z.string(),
        quoteType: z.string(),
        quotedMessageSnapshot: z.object({
          annotations: z.array(z.unknown()),
          attachments: z.array(z.unknown()),
          formattedText: z.string(),
          sender: z.string(),
          text: z.string(),
        }),
      }),
      sender: z.object({
        displayName: z.string(),
        domainId: z.string(),
        isAnonymous: z.boolean(),
        name: z.string(),
        type: z.string(),
      }),
      silent: z.boolean(),
      slashCommand: z.object({
        commandId: z.string(),
      }),
      space: z.object({
        accessSettings: z.object({
          accessPermissionSettings: z.object({
            discoverSpaceSetting: z.unknown(),
            joinSpaceSetting: z.unknown(),
            viewSpaceMembershipSetting: z.unknown(),
          }),
          accessState: z.string(),
          audience: z.string(),
        }),
        adminInstalled: z.boolean(),
        createTime: z.string(),
        customer: z.string(),
        displayName: z.string(),
        externalUserAllowed: z.boolean(),
        importMode: z.boolean(),
        importModeExpireTime: z.string(),
        lastActiveTime: z.string(),
        membershipCount: z.object({
          joinedDirectHumanUserCount: z.number(),
          joinedGroupCount: z.number(),
        }),
        name: z.string(),
        permissionSettings: z.object({
          manageApps: z.object({
            assistantManagersAllowed: z.unknown(),
            managersAllowed: z.unknown(),
            membersAllowed: z.unknown(),
          }),
          manageMembersAndGroups: z.object({
            assistantManagersAllowed: z.unknown(),
            managersAllowed: z.unknown(),
            membersAllowed: z.unknown(),
          }),
          manageWebhooks: z.object({
            assistantManagersAllowed: z.unknown(),
            managersAllowed: z.unknown(),
            membersAllowed: z.unknown(),
          }),
          modifySpaceDetails: z.object({
            assistantManagersAllowed: z.unknown(),
            managersAllowed: z.unknown(),
            membersAllowed: z.unknown(),
          }),
          postMessages: z.object({
            assistantManagersAllowed: z.unknown(),
            managersAllowed: z.unknown(),
            membersAllowed: z.unknown(),
          }),
          replyMessages: z.object({
            assistantManagersAllowed: z.unknown(),
            managersAllowed: z.unknown(),
            membersAllowed: z.unknown(),
          }),
          toggleHistory: z.object({
            assistantManagersAllowed: z.unknown(),
            managersAllowed: z.unknown(),
            membersAllowed: z.unknown(),
          }),
          useAtMentionAll: z.object({
            assistantManagersAllowed: z.unknown(),
            managersAllowed: z.unknown(),
            membersAllowed: z.unknown(),
          }),
          viewSpaceMembership: z.object({
            assistantManagersAllowed: z.unknown(),
            managersAllowed: z.unknown(),
            membersAllowed: z.unknown(),
          }),
        }),
        predefinedPermissionSettings: z.string(),
        singleUserBotDm: z.boolean(),
        spaceDetails: z.object({
          description: z.string(),
          guidelines: z.string(),
        }),
        spaceHistoryState: z.string(),
        spaceThreadingState: z.string(),
        spaceType: z.string(),
        spaceUri: z.string(),
        threaded: z.boolean(),
        type: z.string(),
      }),
      text: z.string(),
      thread: z.object({
        name: z.string(),
        threadKey: z.string(),
      }),
      threadReply: z.boolean(),
    }),
  }).optional(),
  messageUpdatedEventData: z.object({
    message: z.object({
      accessoryWidgets: z.array(z.object({
        buttonList: z.object({
          buttons: z.unknown(),
        }),
      })),
      actionResponse: z.object({
        dialogAction: z.object({
          actionStatus: z.object({
            statusCode: z.unknown(),
            userFacingMessage: z.unknown(),
          }),
          dialog: z.object({
            body: z.unknown(),
          }),
        }),
        type: z.string(),
        updatedWidget: z.object({
          suggestions: z.object({
            items: z.unknown(),
          }),
          widget: z.string(),
        }),
        url: z.string(),
      }),
      annotations: z.array(z.object({
        customEmojiMetadata: z.object({
          customEmoji: z.unknown(),
        }),
        length: z.number(),
        richLinkMetadata: z.object({
          calendarEventLinkData: z.unknown(),
          chatSpaceLinkData: z.unknown(),
          driveLinkData: z.unknown(),
          meetSpaceLinkData: z.unknown(),
          richLinkType: z.unknown(),
          uri: z.unknown(),
        }),
        slashCommand: z.object({
          bot: z.unknown(),
          commandId: z.unknown(),
          commandName: z.unknown(),
          triggersDialog: z.unknown(),
          type: z.unknown(),
        }),
        startIndex: z.number(),
        type: z.string(),
        userMention: z.object({
          type: z.unknown(),
          user: z.unknown(),
        }),
      })),
      argumentText: z.string(),
      attachedGifs: z.array(z.object({
        uri: z.string(),
      })),
      attachment: z.array(z.object({
        attachmentDataRef: z.object({
          attachmentUploadToken: z.unknown(),
          resourceName: z.unknown(),
        }),
        contentName: z.string(),
        contentType: z.string(),
        downloadUri: z.string(),
        driveDataRef: z.object({
          driveFileId: z.unknown(),
        }),
        name: z.string(),
        source: z.string(),
        thumbnailUri: z.string(),
      })),
      cards: z.array(z.object({
        cardActions: z.array(z.unknown()),
        header: z.object({
          imageStyle: z.unknown(),
          imageUrl: z.unknown(),
          subtitle: z.unknown(),
          title: z.unknown(),
        }),
        name: z.string(),
        sections: z.array(z.unknown()),
      })),
      cardsV2: z.array(z.object({
        card: z.object({
          cardActions: z.unknown(),
          displayStyle: z.unknown(),
          expressionData: z.unknown(),
          fixedFooter: z.unknown(),
          header: z.unknown(),
          name: z.unknown(),
          peekCardHeader: z.unknown(),
          sectionDividerStyle: z.unknown(),
          sections: z.unknown(),
        }),
        cardId: z.string(),
      })),
      clientAssignedMessageId: z.string(),
      createTime: z.string(),
      deleteTime: z.string(),
      deletionMetadata: z.object({
        deletionType: z.string(),
      }),
      emojiReactionSummaries: z.array(z.object({
        emoji: z.object({
          customEmoji: z.unknown(),
          unicode: z.unknown(),
        }),
        reactionCount: z.number(),
      })),
      fallbackText: z.string(),
      formattedText: z.string(),
      lastUpdateTime: z.string(),
      markupSyntax: z.string(),
      matchedUrl: z.object({
        url: z.string(),
      }),
      name: z.string(),
      privateMessageViewer: z.object({
        displayName: z.string(),
        domainId: z.string(),
        isAnonymous: z.boolean(),
        name: z.string(),
        type: z.string(),
      }),
      quotedMessageMetadata: z.object({
        forwardedMetadata: z.object({
          space: z.string(),
          spaceDisplayName: z.string(),
        }),
        lastUpdateTime: z.string(),
        name: z.string(),
        quoteType: z.string(),
        quotedMessageSnapshot: z.object({
          annotations: z.array(z.unknown()),
          attachments: z.array(z.unknown()),
          formattedText: z.string(),
          sender: z.string(),
          text: z.string(),
        }),
      }),
      sender: z.object({
        displayName: z.string(),
        domainId: z.string(),
        isAnonymous: z.boolean(),
        name: z.string(),
        type: z.string(),
      }),
      silent: z.boolean(),
      slashCommand: z.object({
        commandId: z.string(),
      }),
      space: z.object({
        accessSettings: z.object({
          accessPermissionSettings: z.object({
            discoverSpaceSetting: z.unknown(),
            joinSpaceSetting: z.unknown(),
            viewSpaceMembershipSetting: z.unknown(),
          }),
          accessState: z.string(),
          audience: z.string(),
        }),
        adminInstalled: z.boolean(),
        createTime: z.string(),
        customer: z.string(),
        displayName: z.string(),
        externalUserAllowed: z.boolean(),
        importMode: z.boolean(),
        importModeExpireTime: z.string(),
        lastActiveTime: z.string(),
        membershipCount: z.object({
          joinedDirectHumanUserCount: z.number(),
          joinedGroupCount: z.number(),
        }),
        name: z.string(),
        permissionSettings: z.object({
          manageApps: z.object({
            assistantManagersAllowed: z.unknown(),
            managersAllowed: z.unknown(),
            membersAllowed: z.unknown(),
          }),
          manageMembersAndGroups: z.object({
            assistantManagersAllowed: z.unknown(),
            managersAllowed: z.unknown(),
            membersAllowed: z.unknown(),
          }),
          manageWebhooks: z.object({
            assistantManagersAllowed: z.unknown(),
            managersAllowed: z.unknown(),
            membersAllowed: z.unknown(),
          }),
          modifySpaceDetails: z.object({
            assistantManagersAllowed: z.unknown(),
            managersAllowed: z.unknown(),
            membersAllowed: z.unknown(),
          }),
          postMessages: z.object({
            assistantManagersAllowed: z.unknown(),
            managersAllowed: z.unknown(),
            membersAllowed: z.unknown(),
          }),
          replyMessages: z.object({
            assistantManagersAllowed: z.unknown(),
            managersAllowed: z.unknown(),
            membersAllowed: z.unknown(),
          }),
          toggleHistory: z.object({
            assistantManagersAllowed: z.unknown(),
            managersAllowed: z.unknown(),
            membersAllowed: z.unknown(),
          }),
          useAtMentionAll: z.object({
            assistantManagersAllowed: z.unknown(),
            managersAllowed: z.unknown(),
            membersAllowed: z.unknown(),
          }),
          viewSpaceMembership: z.object({
            assistantManagersAllowed: z.unknown(),
            managersAllowed: z.unknown(),
            membersAllowed: z.unknown(),
          }),
        }),
        predefinedPermissionSettings: z.string(),
        singleUserBotDm: z.boolean(),
        spaceDetails: z.object({
          description: z.string(),
          guidelines: z.string(),
        }),
        spaceHistoryState: z.string(),
        spaceThreadingState: z.string(),
        spaceType: z.string(),
        spaceUri: z.string(),
        threaded: z.boolean(),
        type: z.string(),
      }),
      text: z.string(),
      thread: z.object({
        name: z.string(),
        threadKey: z.string(),
      }),
      threadReply: z.boolean(),
    }),
  }).optional(),
  name: z.string(),
  reactionBatchCreatedEventData: z.object({
    reactions: z.array(z.object({
      reaction: z.object({
        emoji: z.object({
          customEmoji: z.unknown(),
          unicode: z.unknown(),
        }),
        name: z.string(),
        user: z.object({
          displayName: z.unknown(),
          domainId: z.unknown(),
          isAnonymous: z.unknown(),
          name: z.unknown(),
          type: z.unknown(),
        }),
      }),
    })),
  }).optional(),
  reactionBatchDeletedEventData: z.object({
    reactions: z.array(z.object({
      reaction: z.object({
        emoji: z.object({
          customEmoji: z.unknown(),
          unicode: z.unknown(),
        }),
        name: z.string(),
        user: z.object({
          displayName: z.unknown(),
          domainId: z.unknown(),
          isAnonymous: z.unknown(),
          name: z.unknown(),
          type: z.unknown(),
        }),
      }),
    })),
  }).optional(),
  reactionCreatedEventData: z.object({
    reaction: z.object({
      emoji: z.object({
        customEmoji: z.object({
          emojiName: z.string(),
          name: z.string(),
          payload: z.object({
            fileContent: z.unknown(),
            filename: z.unknown(),
          }),
          temporaryImageUri: z.string(),
          uid: z.string(),
        }),
        unicode: z.string(),
      }),
      name: z.string(),
      user: z.object({
        displayName: z.string(),
        domainId: z.string(),
        isAnonymous: z.boolean(),
        name: z.string(),
        type: z.string(),
      }),
    }),
  }).optional(),
  reactionDeletedEventData: z.object({
    reaction: z.object({
      emoji: z.object({
        customEmoji: z.object({
          emojiName: z.string(),
          name: z.string(),
          payload: z.object({
            fileContent: z.unknown(),
            filename: z.unknown(),
          }),
          temporaryImageUri: z.string(),
          uid: z.string(),
        }),
        unicode: z.string(),
      }),
      name: z.string(),
      user: z.object({
        displayName: z.string(),
        domainId: z.string(),
        isAnonymous: z.boolean(),
        name: z.string(),
        type: z.string(),
      }),
    }),
  }).optional(),
  spaceBatchUpdatedEventData: z.object({
    spaces: z.array(z.object({
      space: z.object({
        accessSettings: z.object({
          accessPermissionSettings: z.unknown(),
          accessState: z.unknown(),
          audience: z.unknown(),
        }),
        adminInstalled: z.boolean(),
        createTime: z.string(),
        customer: z.string(),
        displayName: z.string(),
        externalUserAllowed: z.boolean(),
        importMode: z.boolean(),
        importModeExpireTime: z.string(),
        lastActiveTime: z.string(),
        membershipCount: z.object({
          joinedDirectHumanUserCount: z.unknown(),
          joinedGroupCount: z.unknown(),
        }),
        name: z.string(),
        permissionSettings: z.object({
          manageApps: z.unknown(),
          manageMembersAndGroups: z.unknown(),
          manageWebhooks: z.unknown(),
          modifySpaceDetails: z.unknown(),
          postMessages: z.unknown(),
          replyMessages: z.unknown(),
          toggleHistory: z.unknown(),
          useAtMentionAll: z.unknown(),
          viewSpaceMembership: z.unknown(),
        }),
        predefinedPermissionSettings: z.string(),
        singleUserBotDm: z.boolean(),
        spaceDetails: z.object({
          description: z.unknown(),
          guidelines: z.unknown(),
        }),
        spaceHistoryState: z.string(),
        spaceThreadingState: z.string(),
        spaceType: z.string(),
        spaceUri: z.string(),
        threaded: z.boolean(),
        type: z.string(),
      }),
    })),
  }).optional(),
  spaceUpdatedEventData: z.object({
    space: z.object({
      accessSettings: z.object({
        accessPermissionSettings: z.object({
          discoverSpaceSetting: z.object({
            principals: z.unknown(),
          }),
          joinSpaceSetting: z.object({
            principals: z.unknown(),
          }),
          viewSpaceMembershipSetting: z.object({
            principals: z.unknown(),
          }),
        }),
        accessState: z.string(),
        audience: z.string(),
      }),
      adminInstalled: z.boolean(),
      createTime: z.string(),
      customer: z.string(),
      displayName: z.string(),
      externalUserAllowed: z.boolean(),
      importMode: z.boolean(),
      importModeExpireTime: z.string(),
      lastActiveTime: z.string(),
      membershipCount: z.object({
        joinedDirectHumanUserCount: z.number(),
        joinedGroupCount: z.number(),
      }),
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
      }),
      predefinedPermissionSettings: z.string(),
      singleUserBotDm: z.boolean(),
      spaceDetails: z.object({
        description: z.string(),
        guidelines: z.string(),
      }),
      spaceHistoryState: z.string(),
      spaceThreadingState: z.string(),
      spaceType: z.string(),
      spaceUri: z.string(),
      threaded: z.boolean(),
      type: z.string(),
    }),
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

/** Swamp extension model for Google Cloud Google Chat Spaces.SpaceEvents. Registered at `@swamp/gcp/chat/spaces-spaceevents`. */
export const model = {
  type: "@swamp/gcp/chat/spaces-spaceevents",
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
      toVersion: "2026.05.09.1",
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
      toVersion: "2026.06.03.1",
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
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.21.2",
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
        "An event that represents a change or activity in a Google Chat space. To lear...",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    get: {
      description: "Get a spaceEvents",
      arguments: z.object({
        identifier: z.string().describe("The name of the spaceEvents"),
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
    sync: {
      description: "Sync spaceEvents state from GCP",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific spaceEvents by name (e.g. one discovered by list)",
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
      description: "List spaceEvents resources",
      arguments: z.object({
        filter: z.string().describe(
          'Required. A query filter. You must specify at least one event type (`event_type`) using the has `:` operator. To filter by multiple event types, use the `OR` operator. Omit batch event types in your filter. The request automatically returns any related batch events. For example, if you filter by new reactions (`google.workspace.chat.reaction.v1.created`), the server also returns batch new reactions events (`google.workspace.chat.reaction.v1.batchCreated`). For a list of supported event types, see the [`SpaceEvents` reference documentation](https://developers.google.com/workspace/chat/api/reference/rest/v1/spaces.spaceEvents#SpaceEvent.FIELDS.event_type). Optionally, you can also filter by start time (`start_time`) and end time (`end_time`): * `start_time`: Exclusive timestamp from which to start listing space events. You can list events that occurred up to 28 days ago. If unspecified, lists space events from the past 28 days. * `end_time`: Inclusive timestamp until which space events are listed. If unspecified, lists events up to the time of the request. To specify a start or end time, use the equals `=` operator and format in [RFC-3339](https://www.rfc-editor.org/rfc/rfc3339). To filter by both `start_time` and `end_time`, use the `AND` operator. For example, the following queries are valid: ``` start_time="2023-08-23T19:20:33+00:00" AND end_time="2023-08-23T19:21:54+00:00" ``` ``` start_time="2023-08-23T19:20:33+00:00" AND (event_types:"google.workspace.chat.space.v1.updated" OR event_types:"google.workspace.chat.message.v1.created") ``` The following queries are invalid: ``` start_time="2023-08-23T19:20:33+00:00" OR end_time="2023-08-23T19:21:54+00:00" ``` ``` event_types:"google.workspace.chat.space.v1.updated" AND event_types:"google.workspace.chat.message.v1.created" ``` Invalid queries are rejected by the server with an `INVALID_ARGUMENT` error.',
        ).optional(),
        pageSize: z.number().describe(
          "Optional. The maximum number of space events returned. The service might return fewer than this value. Negative values return an `INVALID_ARGUMENT` error.",
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
        const { items, nextPageToken } = await listResources(
          baseUrl,
          LIST_CONFIG,
          params,
          "spaceEvents",
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
  },
};

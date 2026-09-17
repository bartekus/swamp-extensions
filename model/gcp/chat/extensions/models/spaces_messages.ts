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

// Auto-generated extension model for @swamp/gcp/chat/spaces-messages
// Do not edit manually. Re-generate with: deno task generate:gcp

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Google Cloud Google Chat Spaces.Messages.
 *
 * A message in a Google Chat space.
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

/** Construct the fully-qualified resource name from parent and short name. */
function buildResourceName(parent: string, shortName: string): string {
  return `${parent}/messages/${shortName}`;
}

const BASE_URL = "https://chat.googleapis.com/";

const GET_CONFIG = {
  "id": "chat.spaces.messages.get",
  "path": "v1/{+name}",
  "httpMethod": "GET",
  "parameterOrder": [
    "name",
  ],
  "parameters": {
    "markupSyntax": {
      "location": "query",
    },
    "name": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const INSERT_CONFIG = {
  "id": "chat.spaces.messages.create",
  "path": "v1/{+parent}/messages",
  "httpMethod": "POST",
  "parameterOrder": [
    "parent",
  ],
  "parameters": {
    "createMessageNotificationOptions.notificationType": {
      "location": "query",
    },
    "messageId": {
      "location": "query",
    },
    "messageReplyOption": {
      "location": "query",
    },
    "parent": {
      "location": "path",
      "required": true,
    },
    "requestId": {
      "location": "query",
    },
    "threadKey": {
      "location": "query",
    },
  },
} as const;

const UPDATE_CONFIG = {
  "id": "chat.spaces.messages.update",
  "path": "v1/{+name}",
  "httpMethod": "PUT",
  "parameterOrder": [
    "name",
  ],
  "parameters": {
    "allowMissing": {
      "location": "query",
    },
    "name": {
      "location": "path",
      "required": true,
    },
    "updateMask": {
      "location": "query",
    },
  },
} as const;

const DELETE_CONFIG = {
  "id": "chat.spaces.messages.delete",
  "path": "v1/{+name}",
  "httpMethod": "DELETE",
  "parameterOrder": [
    "name",
  ],
  "parameters": {
    "force": {
      "location": "query",
    },
    "name": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const LIST_CONFIG = {
  "id": "chat.spaces.messages.list",
  "path": "v1/{+parent}/messages",
  "httpMethod": "GET",
  "parameterOrder": [
    "parent",
  ],
  "parameters": {
    "filter": {
      "location": "query",
    },
    "markupSyntax": {
      "location": "query",
    },
    "orderBy": {
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
    "showDeleted": {
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
  accessoryWidgets: z.array(z.object({
    buttonList: z.object({
      buttons: z.array(z.object({
        altText: z.unknown().describe(
          'The alternative text that\'s used for accessibility. Set descriptive text that lets users know what the button does. For example, if a button opens a hyperlink, you might write: "Opens a new browser tab and navigates to the Google Chat developer documentation at https://developers.google.com/workspace/chat".',
        ).optional(),
        color: z.unknown().describe(
          'Optional. The color of the button. If set, the button `type` is set to `FILLED` and the color of `text` and `icon` fields are set to a contrasting color for readability. For example, if the button color is set to blue, any text or icons in the button are set to white. To set the button color, specify a value for the `red`, `green`, and `blue` fields. The value must be a float number between 0 and 1 based on the RGB color value, where `0` (0/255) represents the absence of color and `1` (255/255) represents the maximum intensity of the color. For example, the following sets the color to red at its maximum intensity: ` "color": { "red": 1, "green": 0, "blue": 0, } ` The `alpha` field is unavailable for button color. If specified, this field is ignored.',
        ).optional(),
        disabled: z.unknown().describe(
          "If `true`, the button is displayed in an inactive state and doesn't respond to user actions.",
        ).optional(),
        icon: z.unknown().describe(
          "An icon displayed inside the button. If both `icon` and `text` are set, then the icon appears before the text.",
        ).optional(),
        onClick: z.unknown().describe(
          "Required. The action to perform when a user clicks the button, such as opening a hyperlink or running a custom function.",
        ).optional(),
        text: z.unknown().describe("The text displayed inside the button.")
          .optional(),
        type: z.unknown().describe(
          "Optional. The type of a button. If unset, button type defaults to `OUTLINED`. If the `color` field is set, the button type is forced to `FILLED` and any value set for this field is ignored.",
        ).optional(),
      })).describe("An array of buttons.").optional(),
    }).describe("A list of buttons.").optional(),
  })).describe(
    "Optional. One or more interactive widgets that appear at the bottom of a message. You can add accessory widgets to messages that contain text, cards, or both text and cards. Not supported for messages that contain dialogs. For details, see [Add interactive widgets at the bottom of a message](https://developers.google.com/workspace/chat/create-messages#add-accessory-widgets). Creating a message with accessory widgets requires [app authentication] (https://developers.google.com/workspace/chat/authenticate-authorize-chat-app).",
  ).optional(),
  actionResponse: z.object({
    dialogAction: z.object({
      actionStatus: z.object({
        statusCode: z.enum([
          "OK",
          "CANCELLED",
          "UNKNOWN",
          "INVALID_ARGUMENT",
          "DEADLINE_EXCEEDED",
          "NOT_FOUND",
          "ALREADY_EXISTS",
          "PERMISSION_DENIED",
          "UNAUTHENTICATED",
          "RESOURCE_EXHAUSTED",
          "FAILED_PRECONDITION",
          "ABORTED",
          "OUT_OF_RANGE",
          "UNIMPLEMENTED",
          "INTERNAL",
          "UNAVAILABLE",
          "DATA_LOSS",
        ]).describe("The status code.").optional(),
        userFacingMessage: z.string().describe(
          "The message to send users about the status of their request. If unset, a generic message based on the `status_code` is sent.",
        ).optional(),
      }).describe(
        "Input only. Status for a request to either invoke or submit a [dialog](https://developers.google.com/workspace/chat/dialogs). Displays a status and message to users, if necessary. For example, in case of an error or success.",
      ).optional(),
      dialog: z.object({
        body: z.object({
          cardActions: z.array(z.unknown()).describe(
            'The card\'s actions. Actions are added to the card\'s toolbar menu. [Google Workspace add-ons](https://developers.google.com/workspace/add-ons): For example, the following JSON constructs a card action menu with `Settings` and `Send Feedback` options: ` "card_actions": [ { "actionLabel": "Settings", "onClick": { "action": { "functionName": "goToView", "parameters": [ { "key": "viewType", "value": "SETTING" } ], "loadIndicator": "LoadIndicator.SPINNER" } } }, { "actionLabel": "Send Feedback", "onClick": { "openLink": { "url": "https://example.com/feedback" } } } ] `',
          ).optional(),
          displayStyle: z.enum(["DISPLAY_STYLE_UNSPECIFIED", "PEEK", "REPLACE"])
            .describe(
              "In Google Workspace add-ons, sets the display properties of the `peekCardHeader`. [Google Workspace add-ons](https://developers.google.com/workspace/add-ons):",
            ).optional(),
          expressionData: z.array(z.unknown()).describe(
            "The expression data for the card. Available for Google Workspace add-ons that extend Google Workspace Studio. Unavailable for Google Chat apps.",
          ).optional(),
          fixedFooter: z.object({
            primaryButton: z.unknown().describe(
              "The primary button of the fixed footer. The button must be a text button with text and color set.",
            ).optional(),
            secondaryButton: z.unknown().describe(
              "The secondary button of the fixed footer. The button must be a text button with text and color set. If `secondaryButton` is set, you must also set `primaryButton`.",
            ).optional(),
          }).describe(
            "The fixed footer shown at the bottom of this card. Setting `fixedFooter` without specifying a `primaryButton` or a `secondaryButton` causes an error. For Chat apps, you can use fixed footers in [dialogs](https://developers.google.com/workspace/chat/dialogs), but not [card messages](https://developers.google.com/workspace/chat/create-messages#create). [Google Workspace add-ons and Chat apps](https://developers.google.com/workspace/extend):",
          ).optional(),
          header: z.object({
            imageAltText: z.unknown().describe(
              "The alternative text of this image that's used for accessibility.",
            ).optional(),
            imageType: z.unknown().describe(
              "The shape used to crop the image. [Google Workspace add-ons and Chat apps](https://developers.google.com/workspace/extend):",
            ).optional(),
            imageUrl: z.unknown().describe(
              "The HTTPS URL of the image in the card header.",
            ).optional(),
            subtitle: z.unknown().describe(
              "The subtitle of the card header. If specified, appears on its own line below the `title`.",
            ).optional(),
            title: z.unknown().describe(
              "Required. The title of the card header. The header has a fixed height: if both a title and subtitle are specified, each takes up one line. If only the title is specified, it takes up both lines.",
            ).optional(),
          }).describe(
            "The header of the card. A header usually contains a leading image and a title. Headers always appear at the top of a card.",
          ).optional(),
          name: z.string().describe(
            "Name of the card. Used as a card identifier in card navigation. [Google Workspace add-ons](https://developers.google.com/workspace/add-ons):",
          ).optional(),
          peekCardHeader: z.object({
            imageAltText: z.unknown().describe(
              "The alternative text of this image that's used for accessibility.",
            ).optional(),
            imageType: z.unknown().describe(
              "The shape used to crop the image. [Google Workspace add-ons and Chat apps](https://developers.google.com/workspace/extend):",
            ).optional(),
            imageUrl: z.unknown().describe(
              "The HTTPS URL of the image in the card header.",
            ).optional(),
            subtitle: z.unknown().describe(
              "The subtitle of the card header. If specified, appears on its own line below the `title`.",
            ).optional(),
            title: z.unknown().describe(
              "Required. The title of the card header. The header has a fixed height: if both a title and subtitle are specified, each takes up one line. If only the title is specified, it takes up both lines.",
            ).optional(),
          }).describe(
            "When displaying contextual content, the peek card header acts as a placeholder so that the user can navigate forward between the homepage cards and the contextual cards. [Google Workspace add-ons](https://developers.google.com/workspace/add-ons):",
          ).optional(),
          sectionDividerStyle: z.enum([
            "DIVIDER_STYLE_UNSPECIFIED",
            "SOLID_DIVIDER",
            "NO_DIVIDER",
          ]).describe(
            "The divider style between the header, sections and footer.",
          ).optional(),
          sections: z.array(z.unknown()).describe(
            "Contains a collection of widgets. Each section has its own, optional header. Sections are visually separated by a line divider. For an example in Google Chat apps, see [Define a section of a card](https://developers.google.com/workspace/chat/design-components-card-dialog#define_a_section_of_a_card).",
          ).optional(),
        }).describe(
          "Input only. Body of the dialog, which is rendered in a modal. Google Chat apps don't support the following card entities: `DateTimePicker`, `OnChangeAction`.",
        ).optional(),
      }).describe(
        "Input only. [Dialog](https://developers.google.com/workspace/chat/dialogs) for the request.",
      ).optional(),
    }).describe(
      "Input only. A response to an interaction event related to a [dialog](https://developers.google.com/workspace/chat/dialogs). Must be accompanied by `ResponseType.Dialog`.",
    ).optional(),
    type: z.enum([
      "TYPE_UNSPECIFIED",
      "NEW_MESSAGE",
      "UPDATE_MESSAGE",
      "UPDATE_USER_MESSAGE_CARDS",
      "REQUEST_CONFIG",
      "DIALOG",
      "UPDATE_WIDGET",
    ]).describe("Input only. The type of Chat app response.").optional(),
    updatedWidget: z.object({
      suggestions: z.object({
        items: z.array(z.object({
          bottomText: z.unknown().describe(
            "For multiselect menus, a text description or label that's displayed below the item's `text` field.",
          ).optional(),
          selected: z.unknown().describe(
            "Whether the item is selected by default. If the selection input only accepts one value (such as for radio buttons or a dropdown menu), only set this field for one item.",
          ).optional(),
          startIconUri: z.unknown().optional(),
          text: z.unknown().describe(
            "The text that identifies or describes the item to users.",
          ).optional(),
          value: z.unknown().describe(
            "The value associated with this item. The client should use this as a form input value. For details about working with form inputs, see [Receive form data](https://developers.google.com/workspace/chat/read-form-data).",
          ).optional(),
        })).describe("An array of the SelectionItem objects.").optional(),
      }).describe("List of widget autocomplete results").optional(),
      widget: z.string().describe(
        "The ID of the updated widget. The ID must match the one for the widget that triggered the update request.",
      ).optional(),
    }).describe("Input only. The response of the updated widget.").optional(),
    url: z.string().describe(
      "Input only. URL for users to authenticate or configure. (Only for `REQUEST_CONFIG` response types.)",
    ).optional(),
  }).describe(
    "Input only. Parameters that a Chat app can use to configure how its response is posted.",
  ).optional(),
  attachment: z.array(z.object({
    attachmentDataRef: z.object({
      attachmentUploadToken: z.string().describe(
        "Optional. Opaque token containing a reference to an uploaded attachment. Treated by clients as an opaque string and used to create or update Chat messages with attachments.",
      ).optional(),
      resourceName: z.string().describe(
        "Optional. The resource name of the attachment data. This field is used with the media API to download the attachment data.",
      ).optional(),
    }).describe(
      "Optional. A reference to the attachment data. This field is used to create or update messages with attachments, or with the media API to download the attachment data.",
    ).optional(),
    contentName: z.string().describe(
      "Output only. The original file name for the content, not the full path.",
    ).optional(),
    contentType: z.string().describe(
      "Output only. The content type (MIME type) of the file.",
    ).optional(),
    downloadUri: z.string().describe(
      "Output only. The download URL which should be used to allow a human user to download the attachment. Chat apps shouldn't use this URL to download attachment content.",
    ).optional(),
    driveDataRef: z.object({
      driveFileId: z.string().describe(
        "The ID for the drive file. Use with the Drive API.",
      ).optional(),
    }).describe(
      "Output only. A reference to the Google Drive attachment. This field is used with the Google Drive API.",
    ).optional(),
    name: z.string().describe(
      "Identifier. Resource name of the attachment. Format: `spaces/{space}/messages/{message}/attachments/{attachment}`.",
    ).optional(),
    source: z.enum(["SOURCE_UNSPECIFIED", "DRIVE_FILE", "UPLOADED_CONTENT"])
      .describe("Output only. The source of the attachment.").optional(),
    thumbnailUri: z.string().describe(
      "Output only. The thumbnail URL which should be used to preview the attachment to a human user. Chat apps shouldn't use this URL to download attachment content.",
    ).optional(),
  })).describe("Optional. User-uploaded attachment.").optional(),
  cardsV2: z.array(z.object({
    card: z.object({
      cardActions: z.array(z.object({
        actionLabel: z.unknown().describe(
          "The label that displays as the action menu item.",
        ).optional(),
        onClick: z.unknown().describe(
          "The `onClick` action for this action item.",
        ).optional(),
      })).describe(
        'The card\'s actions. Actions are added to the card\'s toolbar menu. [Google Workspace add-ons](https://developers.google.com/workspace/add-ons): For example, the following JSON constructs a card action menu with `Settings` and `Send Feedback` options: ` "card_actions": [ { "actionLabel": "Settings", "onClick": { "action": { "functionName": "goToView", "parameters": [ { "key": "viewType", "value": "SETTING" } ], "loadIndicator": "LoadIndicator.SPINNER" } } }, { "actionLabel": "Send Feedback", "onClick": { "openLink": { "url": "https://example.com/feedback" } } } ] `',
      ).optional(),
      displayStyle: z.enum(["DISPLAY_STYLE_UNSPECIFIED", "PEEK", "REPLACE"])
        .describe(
          "In Google Workspace add-ons, sets the display properties of the `peekCardHeader`. [Google Workspace add-ons](https://developers.google.com/workspace/add-ons):",
        ).optional(),
      expressionData: z.array(z.object({
        conditions: z.unknown().describe(
          "The list of conditions that are determined by the expression evaluation result.",
        ).optional(),
        eventActions: z.unknown().describe(
          "The list of actions that the ExpressionData can be used.",
        ).optional(),
        expression: z.unknown().describe("The uncompiled expression.")
          .optional(),
        id: z.unknown().describe("The unique identifier of the ExpressionData.")
          .optional(),
      })).describe(
        "The expression data for the card. Available for Google Workspace add-ons that extend Google Workspace Studio. Unavailable for Google Chat apps.",
      ).optional(),
      fixedFooter: z.object({
        primaryButton: z.object({
          altText: z.unknown().describe(
            'The alternative text that\'s used for accessibility. Set descriptive text that lets users know what the button does. For example, if a button opens a hyperlink, you might write: "Opens a new browser tab and navigates to the Google Chat developer documentation at https://developers.google.com/workspace/chat".',
          ).optional(),
          color: z.unknown().describe(
            'Optional. The color of the button. If set, the button `type` is set to `FILLED` and the color of `text` and `icon` fields are set to a contrasting color for readability. For example, if the button color is set to blue, any text or icons in the button are set to white. To set the button color, specify a value for the `red`, `green`, and `blue` fields. The value must be a float number between 0 and 1 based on the RGB color value, where `0` (0/255) represents the absence of color and `1` (255/255) represents the maximum intensity of the color. For example, the following sets the color to red at its maximum intensity: ` "color": { "red": 1, "green": 0, "blue": 0, } ` The `alpha` field is unavailable for button color. If specified, this field is ignored.',
          ).optional(),
          disabled: z.unknown().describe(
            "If `true`, the button is displayed in an inactive state and doesn't respond to user actions.",
          ).optional(),
          icon: z.unknown().describe(
            "An icon displayed inside the button. If both `icon` and `text` are set, then the icon appears before the text.",
          ).optional(),
          onClick: z.unknown().describe(
            "Required. The action to perform when a user clicks the button, such as opening a hyperlink or running a custom function.",
          ).optional(),
          text: z.unknown().describe("The text displayed inside the button.")
            .optional(),
          type: z.unknown().describe(
            "Optional. The type of a button. If unset, button type defaults to `OUTLINED`. If the `color` field is set, the button type is forced to `FILLED` and any value set for this field is ignored.",
          ).optional(),
        }).describe(
          "The primary button of the fixed footer. The button must be a text button with text and color set.",
        ).optional(),
        secondaryButton: z.object({
          altText: z.unknown().describe(
            'The alternative text that\'s used for accessibility. Set descriptive text that lets users know what the button does. For example, if a button opens a hyperlink, you might write: "Opens a new browser tab and navigates to the Google Chat developer documentation at https://developers.google.com/workspace/chat".',
          ).optional(),
          color: z.unknown().describe(
            'Optional. The color of the button. If set, the button `type` is set to `FILLED` and the color of `text` and `icon` fields are set to a contrasting color for readability. For example, if the button color is set to blue, any text or icons in the button are set to white. To set the button color, specify a value for the `red`, `green`, and `blue` fields. The value must be a float number between 0 and 1 based on the RGB color value, where `0` (0/255) represents the absence of color and `1` (255/255) represents the maximum intensity of the color. For example, the following sets the color to red at its maximum intensity: ` "color": { "red": 1, "green": 0, "blue": 0, } ` The `alpha` field is unavailable for button color. If specified, this field is ignored.',
          ).optional(),
          disabled: z.unknown().describe(
            "If `true`, the button is displayed in an inactive state and doesn't respond to user actions.",
          ).optional(),
          icon: z.unknown().describe(
            "An icon displayed inside the button. If both `icon` and `text` are set, then the icon appears before the text.",
          ).optional(),
          onClick: z.unknown().describe(
            "Required. The action to perform when a user clicks the button, such as opening a hyperlink or running a custom function.",
          ).optional(),
          text: z.unknown().describe("The text displayed inside the button.")
            .optional(),
          type: z.unknown().describe(
            "Optional. The type of a button. If unset, button type defaults to `OUTLINED`. If the `color` field is set, the button type is forced to `FILLED` and any value set for this field is ignored.",
          ).optional(),
        }).describe(
          "The secondary button of the fixed footer. The button must be a text button with text and color set. If `secondaryButton` is set, you must also set `primaryButton`.",
        ).optional(),
      }).describe(
        "The fixed footer shown at the bottom of this card. Setting `fixedFooter` without specifying a `primaryButton` or a `secondaryButton` causes an error. For Chat apps, you can use fixed footers in [dialogs](https://developers.google.com/workspace/chat/dialogs), but not [card messages](https://developers.google.com/workspace/chat/create-messages#create). [Google Workspace add-ons and Chat apps](https://developers.google.com/workspace/extend):",
      ).optional(),
      header: z.object({
        imageAltText: z.string().describe(
          "The alternative text of this image that's used for accessibility.",
        ).optional(),
        imageType: z.enum(["SQUARE", "CIRCLE"]).describe(
          "The shape used to crop the image. [Google Workspace add-ons and Chat apps](https://developers.google.com/workspace/extend):",
        ).optional(),
        imageUrl: z.string().describe(
          "The HTTPS URL of the image in the card header.",
        ).optional(),
        subtitle: z.string().describe(
          "The subtitle of the card header. If specified, appears on its own line below the `title`.",
        ).optional(),
        title: z.string().describe(
          "Required. The title of the card header. The header has a fixed height: if both a title and subtitle are specified, each takes up one line. If only the title is specified, it takes up both lines.",
        ).optional(),
      }).describe(
        "The header of the card. A header usually contains a leading image and a title. Headers always appear at the top of a card.",
      ).optional(),
      name: z.string().describe(
        "Name of the card. Used as a card identifier in card navigation. [Google Workspace add-ons](https://developers.google.com/workspace/add-ons):",
      ).optional(),
      peekCardHeader: z.object({
        imageAltText: z.string().describe(
          "The alternative text of this image that's used for accessibility.",
        ).optional(),
        imageType: z.enum(["SQUARE", "CIRCLE"]).describe(
          "The shape used to crop the image. [Google Workspace add-ons and Chat apps](https://developers.google.com/workspace/extend):",
        ).optional(),
        imageUrl: z.string().describe(
          "The HTTPS URL of the image in the card header.",
        ).optional(),
        subtitle: z.string().describe(
          "The subtitle of the card header. If specified, appears on its own line below the `title`.",
        ).optional(),
        title: z.string().describe(
          "Required. The title of the card header. The header has a fixed height: if both a title and subtitle are specified, each takes up one line. If only the title is specified, it takes up both lines.",
        ).optional(),
      }).describe(
        "When displaying contextual content, the peek card header acts as a placeholder so that the user can navigate forward between the homepage cards and the contextual cards. [Google Workspace add-ons](https://developers.google.com/workspace/add-ons):",
      ).optional(),
      sectionDividerStyle: z.enum([
        "DIVIDER_STYLE_UNSPECIFIED",
        "SOLID_DIVIDER",
        "NO_DIVIDER",
      ]).describe("The divider style between the header, sections and footer.")
        .optional(),
      sections: z.array(z.object({
        collapseControl: z.unknown().describe(
          "Optional. Define the expand and collapse button of the section. This button will be shown only if the section is collapsible. If this field isn't set, the default button is used.",
        ).optional(),
        collapsible: z.unknown().describe(
          "Indicates whether this section is collapsible. Collapsible sections hide some or all widgets, but users can expand the section to reveal the hidden widgets by clicking **Show more**. Users can hide the widgets again by clicking **Show less**. To determine which widgets are hidden, specify `uncollapsibleWidgetsCount`.",
        ).optional(),
        header: z.unknown().describe(
          "Text that appears at the top of a section. Supports simple HTML formatted text. For more information about formatting text, see [Formatting text in Google Chat apps](https://developers.google.com/workspace/chat/format-messages#card-formatting) and [Formatting text in Google Workspace add-ons](https://developers.google.com/apps-script/add-ons/concepts/widgets#text_formatting).",
        ).optional(),
        id: z.unknown().describe(
          "A unique ID assigned to the section that's used to identify the section to be mutated. The ID has a character limit of 64 characters and should be in the format of `[a-zA-Z0-9-]+`. Available for Google Workspace add-ons that extend Google Workspace Studio. Unavailable for Google Chat apps.",
        ).optional(),
        uncollapsibleWidgetsCount: z.unknown().describe(
          "The number of uncollapsible widgets which remain visible even when a section is collapsed. For example, when a section contains five widgets and the `uncollapsibleWidgetsCount` is set to `2`, the first two widgets are always shown and the last three are collapsed by default. The `uncollapsibleWidgetsCount` is taken into account only when `collapsible` is `true`.",
        ).optional(),
        widgets: z.unknown().describe(
          "All the widgets in the section. Must contain at least one widget.",
        ).optional(),
      })).describe(
        "Contains a collection of widgets. Each section has its own, optional header. Sections are visually separated by a line divider. For an example in Google Chat apps, see [Define a section of a card](https://developers.google.com/workspace/chat/design-components-card-dialog#define_a_section_of_a_card).",
      ).optional(),
    }).describe("A card. Maximum size is 32 KB.").optional(),
    cardId: z.string().describe(
      "Required if the message contains multiple cards. A unique identifier for a card in a message.",
    ).optional(),
  })).describe(
    "Optional. An array of [cards](https://developers.google.com/workspace/chat/api/reference/rest/v1/cards). Chat apps can create cards with [app authentication](https://developers.google.com/workspace/chat/authenticate-authorize-chat-app). As part of the [Developer Preview Program](https://developers.google.com/workspace/preview), if your Chat app [authenticates as a user](https://developers.google.com/workspace/chat/authenticate-authorize-chat-user), it can create card messages. If your Chat app is not part of Developer Preview Program, it can't create cards with user authentication. To learn how to create a message that contains cards, see [Send a message](https://developers.google.com/workspace/chat/create-messages). [Card builder](https://addons.gsuite.google.com/uikit/builder)",
  ).optional(),
  clientAssignedMessageId: z.string().describe(
    "Optional. A custom ID for the message. You can use field to identify a message, or to get, delete, or update a message. To set a custom ID, specify the [`messageId`](https://developers.google.com/workspace/chat/api/reference/rest/v1/spaces.messages/create#body.QUERY_PARAMETERS.message_id) field when you create the message. For details, see [Name a message](https://developers.google.com/workspace/chat/create-messages#name_a_created_message).",
  ).optional(),
  fallbackText: z.string().describe(
    "Optional. A plain-text description of the message's cards, used when the actual cards can't be displayed—for example, mobile notifications.",
  ).optional(),
  markupSyntax: z.enum([
    "MARKUP_SYNTAX_UNSPECIFIED",
    "MARKUP_SYNTAX_CHAT",
    "MARKUP_SYNTAX_MARKDOWN",
  ]).describe(
    "Optional. Specifies how the server interprets the message `text` field content.",
  ).optional(),
  name: z.string().describe(
    "Identifier. Resource name of the message. Format: `spaces/{space}/messages/{message}` Where `{space}` is the ID of the space where the message is posted and `{message}` is a system-assigned ID for the message. For example, `spaces/AAAAAAAAAAA/messages/BBBBBBBBBBB.BBBBBBBBBBB`. If you set a custom ID when you create a message, you can use this ID to specify the message in a request by replacing `{message}` with the value from the `clientAssignedMessageId` field. For example, `spaces/AAAAAAAAAAA/messages/client-custom-name`. For details, see [Name a message](https://developers.google.com/workspace/chat/create-messages#name_a_created_message).",
  ).optional(),
  quotedMessageMetadata: z.object({
    forwardedMetadata: z.object({
      space: z.string().describe(
        "Output only. The resource name of the source space. Format: spaces/{space}",
      ).optional(),
      spaceDisplayName: z.string().describe(
        'Output only. The display name of the source space or DM at the time of forwarding. For `SPACE`, this is the space name. For `DIRECT_MESSAGE`, this is the other participant\'s name (e.g., "User A"). For `GROUP_CHAT`, this is a generated name based on members\' first names, limited to 5 including the creator (e.g., "User A, User B").',
      ).optional(),
    }).describe(
      "Output only. Metadata about the source space of the quoted message. Populated only for FORWARD quote type.",
    ).optional(),
    lastUpdateTime: z.string().describe(
      "Required. The timestamp when the quoted message was created or when the quoted message was last updated. If the message was edited, use this field, `last_update_time`. If the message was never edited, use `create_time`. If `last_update_time` doesn't match the latest version of the quoted message, the request fails.",
    ).optional(),
    name: z.string().describe(
      "Required. Resource name of the message that is quoted. Format: `spaces/{space}/messages/{message}`",
    ).optional(),
    quoteType: z.enum(["QUOTE_TYPE_UNSPECIFIED", "REPLY", "FORWARD"]).describe(
      "Optional. Specifies the quote type. If not set, defaults to REPLY in the message read/write path for backward compatibility.",
    ).optional(),
    quotedMessageSnapshot: z.object({
      annotations: z.array(z.object({
        customEmojiMetadata: z.object({
          customEmoji: z.unknown().describe("The custom emoji.").optional(),
        }).describe("The metadata for a custom emoji.").optional(),
        length: z.number().int().describe(
          "Length of the substring in the plain-text message body this annotation corresponds to. If not present, indicates a length of 0.",
        ).optional(),
        richLinkMetadata: z.object({
          calendarEventLinkData: z.unknown().describe(
            "Data for a Calendar event link.",
          ).optional(),
          chatSpaceLinkData: z.unknown().describe("Data for a chat space link.")
            .optional(),
          driveLinkData: z.unknown().describe("Data for a drive link.")
            .optional(),
          meetSpaceLinkData: z.unknown().describe("Data for a Meet space link.")
            .optional(),
          richLinkType: z.unknown().describe("The rich link type.").optional(),
          uri: z.unknown().describe("The URI of this link.").optional(),
        }).describe("The metadata for a rich link.").optional(),
        slashCommand: z.object({
          bot: z.unknown().describe("The Chat app whose command was invoked.")
            .optional(),
          commandId: z.unknown().describe(
            "The command ID of the invoked slash command.",
          ).optional(),
          commandName: z.unknown().describe(
            "The name of the invoked slash command.",
          ).optional(),
          triggersDialog: z.unknown().describe(
            "Indicates whether the slash command is for a dialog.",
          ).optional(),
          type: z.unknown().describe("The type of slash command.").optional(),
        }).describe("The metadata for a slash command.").optional(),
        startIndex: z.number().int().describe(
          "Start index (0-based, inclusive) in the plain-text message body this annotation corresponds to.",
        ).optional(),
        type: z.enum([
          "ANNOTATION_TYPE_UNSPECIFIED",
          "USER_MENTION",
          "SLASH_COMMAND",
          "RICH_LINK",
          "CUSTOM_EMOJI",
        ]).describe("The type of this annotation.").optional(),
        userMention: z.object({
          type: z.unknown().describe("The type of user mention.").optional(),
          user: z.unknown().describe("The user mentioned.").optional(),
        }).describe("The metadata of user mention.").optional(),
      })).describe(
        "Output only. Annotations parsed from the text body of the quoted message. Populated only for FORWARD quote type.",
      ).optional(),
      attachments: z.array(z.object({
        attachmentDataRef: z.object({
          attachmentUploadToken: z.unknown().describe(
            "Optional. Opaque token containing a reference to an uploaded attachment. Treated by clients as an opaque string and used to create or update Chat messages with attachments.",
          ).optional(),
          resourceName: z.unknown().describe(
            "Optional. The resource name of the attachment data. This field is used with the media API to download the attachment data.",
          ).optional(),
        }).describe(
          "Optional. A reference to the attachment data. This field is used to create or update messages with attachments, or with the media API to download the attachment data.",
        ).optional(),
        contentName: z.string().describe(
          "Output only. The original file name for the content, not the full path.",
        ).optional(),
        contentType: z.string().describe(
          "Output only. The content type (MIME type) of the file.",
        ).optional(),
        downloadUri: z.string().describe(
          "Output only. The download URL which should be used to allow a human user to download the attachment. Chat apps shouldn't use this URL to download attachment content.",
        ).optional(),
        driveDataRef: z.object({
          driveFileId: z.unknown().describe(
            "The ID for the drive file. Use with the Drive API.",
          ).optional(),
        }).describe(
          "Output only. A reference to the Google Drive attachment. This field is used with the Google Drive API.",
        ).optional(),
        name: z.string().describe(
          "Identifier. Resource name of the attachment. Format: `spaces/{space}/messages/{message}/attachments/{attachment}`.",
        ).optional(),
        source: z.enum(["SOURCE_UNSPECIFIED", "DRIVE_FILE", "UPLOADED_CONTENT"])
          .describe("Output only. The source of the attachment.").optional(),
        thumbnailUri: z.string().describe(
          "Output only. The thumbnail URL which should be used to preview the attachment to a human user. Chat apps shouldn't use this URL to download attachment content.",
        ).optional(),
      })).describe(
        "Output only. Attachments that were part of the quoted message. These are copies of the quoted message's attachment metadata. Populated only for FORWARD quote type.",
      ).optional(),
      formattedText: z.string().describe(
        "Output only. Contains the quoted message `text` with markups added to support rich formatting like hyperlinks,custom emojis, markup, etc. Populated only for FORWARD quote type.",
      ).optional(),
      sender: z.string().describe(
        "Output only. The quoted message's author name. Populated for both REPLY & FORWARD quote types.",
      ).optional(),
      text: z.string().describe(
        "Output only. Snapshot of the quoted message's text content.",
      ).optional(),
    }).describe("Output only. A snapshot of the quoted message's content.")
      .optional(),
  }).describe(
    "Optional. Information about a message that another message quotes. When you create a message, you can quote messages within the same thread, or quote a root message to create a new root message. However, you can't quote a message reply from a different thread. When you update a message, you can't add or replace the `quotedMessageMetadata` field, but you can remove it. For example usage, see [Quote another message](https://developers.google.com/workspace/chat/create-messages#quote-a-message).",
  ).optional(),
  text: z.string().describe(
    "Optional. Plain-text body of the message. The first link to an image, video, or web page generates a [preview chip](https://developers.google.com/workspace/chat/preview-links). You can also [@mention a Google Chat user](https://developers.google.com/workspace/chat/format-messages#messages-@mention), or everyone in the space. To learn about creating text messages, see [Send a message](https://developers.google.com/workspace/chat/create-messages).",
  ).optional(),
  thread: z.object({
    name: z.string().describe(
      "Identifier. Resource name of the thread. Example: `spaces/{space}/threads/{thread}`",
    ).optional(),
    threadKey: z.string().describe(
      "Optional. Input for creating or updating a thread. Otherwise, output only. ID for the thread. Supports up to 4000 characters. This ID is unique to the Chat app that sets it. For example, if multiple Chat apps create a message using the same thread key, the messages are posted in different threads. To reply in a thread created by a person or another Chat app, specify the thread `name` field instead.",
    ).optional(),
  }).describe(
    "The thread the message belongs to. For example usage, see [Start or reply to a message thread](https://developers.google.com/workspace/chat/create-messages#create-message-thread).",
  ).optional(),
  createMessageNotificationOptions_notificationType: z.string().describe(
    "The notification type for the message.",
  ).optional(),
  messageId: z.string().describe(
    "Optional. A custom ID for a message. Lets Chat apps get, update, or delete a message without needing to store the system-assigned ID in the message's resource name (represented in the message `name` field). The value for this field must meet the following requirements: * Begins with `client-`. For example, `client-custom-name` is a valid custom ID, but `custom-name` is not. * Contains up to 63 characters and only lowercase letters, numbers, and hyphens. * Is unique within a space. A Chat app can't use the same custom ID for different messages. For details, see [Name a message](https://developers.google.com/workspace/chat/create-messages#name_a_created_message).",
  ).optional(),
  messageReplyOption: z.string().describe(
    "Optional. Specifies whether a message starts a thread or replies to one. Only supported in named spaces. When [responding to user interactions](https://developers.google.com/workspace/chat/receive-respond-interactions), this field is ignored. For interactions within a thread, the reply is created in the same thread. Otherwise, the reply is created as a new thread.",
  ).optional(),
  requestId: z.string().describe(
    "Optional. A unique ID for this request. A random UUID is recommended. Specifying a request ID makes the request idempotent, which ensures that multiple identical requests with the same request ID result in only a single message being created. Subsequent requests with the same request ID return the existing message and do not update the message, even if the requested details differ from the current state. To use this field effectively: - Ensure that subsequent requests are identical and use the same authentication credentials as the original request. - If a message was already created with the provided request ID, the request returns that message. Note that the returned message might not be fully populated; the API echoes the message in your request with the system-assigned resource names populated. To retrieve the latest metadata for the message, call `GetMessage`. - Reusing an existing request ID with a different authenticated user results in an error.",
  ).optional(),
  allowMissing: z.string().describe(
    "Optional. If `true` and the message isn't found, a new message is created and `updateMask` is ignored. The specified message ID must be [client-assigned](https://developers.google.com/workspace/chat/create-messages#name_a_created_message) or the request fails.",
  ).optional(),
  parent: z.string().describe(
    "The parent resource name (e.g., projects/my-project/locations/us-central1, organizations/123, folders/456)",
  ).optional(),
});

const StateSchema = z.object({
  accessoryWidgets: z.array(z.object({
    buttonList: z.object({
      buttons: z.array(z.object({
        altText: z.unknown(),
        color: z.unknown(),
        disabled: z.unknown(),
        icon: z.unknown(),
        onClick: z.unknown(),
        text: z.unknown(),
        type: z.unknown(),
      })),
    }),
  })).optional(),
  actionResponse: z.object({
    dialogAction: z.object({
      actionStatus: z.object({
        statusCode: z.string(),
        userFacingMessage: z.string(),
      }),
      dialog: z.object({
        body: z.object({
          cardActions: z.array(z.unknown()),
          displayStyle: z.string(),
          expressionData: z.array(z.unknown()),
          fixedFooter: z.object({
            primaryButton: z.unknown(),
            secondaryButton: z.unknown(),
          }),
          header: z.object({
            imageAltText: z.unknown(),
            imageType: z.unknown(),
            imageUrl: z.unknown(),
            subtitle: z.unknown(),
            title: z.unknown(),
          }),
          name: z.string(),
          peekCardHeader: z.object({
            imageAltText: z.unknown(),
            imageType: z.unknown(),
            imageUrl: z.unknown(),
            subtitle: z.unknown(),
            title: z.unknown(),
          }),
          sectionDividerStyle: z.string(),
          sections: z.array(z.unknown()),
        }),
      }),
    }),
    type: z.string(),
    updatedWidget: z.object({
      suggestions: z.object({
        items: z.array(z.object({
          bottomText: z.unknown(),
          selected: z.unknown(),
          startIconUri: z.unknown(),
          text: z.unknown(),
          value: z.unknown(),
        })),
      }),
      widget: z.string(),
    }),
    url: z.string(),
  }).optional(),
  annotations: z.array(z.object({
    customEmojiMetadata: z.object({
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
    }),
    length: z.number(),
    richLinkMetadata: z.object({
      calendarEventLinkData: z.object({
        calendarId: z.string(),
        eventId: z.string(),
      }),
      chatSpaceLinkData: z.object({
        message: z.string(),
        space: z.string(),
        thread: z.string(),
      }),
      driveLinkData: z.object({
        driveDataRef: z.object({
          driveFileId: z.unknown(),
        }),
        mimeType: z.string(),
      }),
      meetSpaceLinkData: z.object({
        huddleStatus: z.string(),
        meetingCode: z.string(),
        type: z.string(),
      }),
      richLinkType: z.string(),
      uri: z.string(),
    }),
    slashCommand: z.object({
      bot: z.object({
        displayName: z.string(),
        domainId: z.string(),
        isAnonymous: z.boolean(),
        name: z.string(),
        type: z.string(),
      }),
      commandId: z.string(),
      commandName: z.string(),
      triggersDialog: z.boolean(),
      type: z.string(),
    }),
    startIndex: z.number(),
    type: z.string(),
    userMention: z.object({
      type: z.string(),
      user: z.object({
        displayName: z.string(),
        domainId: z.string(),
        isAnonymous: z.boolean(),
        name: z.string(),
        type: z.string(),
      }),
    }),
  })).optional(),
  argumentText: z.string().optional(),
  attachedGifs: z.array(z.object({
    uri: z.string(),
  })).optional(),
  attachment: z.array(z.object({
    attachmentDataRef: z.object({
      attachmentUploadToken: z.string(),
      resourceName: z.string(),
    }),
    contentName: z.string(),
    contentType: z.string(),
    downloadUri: z.string(),
    driveDataRef: z.object({
      driveFileId: z.string(),
    }),
    name: z.string(),
    source: z.string(),
    thumbnailUri: z.string(),
  })).optional(),
  cards: z.array(z.object({
    cardActions: z.array(z.object({
      actionLabel: z.string(),
      onClick: z.object({
        action: z.unknown(),
        openLink: z.unknown(),
      }),
    })),
    header: z.object({
      imageStyle: z.string(),
      imageUrl: z.string(),
      subtitle: z.string(),
      title: z.string(),
    }),
    name: z.string(),
    sections: z.array(z.object({
      header: z.string(),
      widgets: z.array(z.unknown()),
    })),
  })).optional(),
  cardsV2: z.array(z.object({
    card: z.object({
      cardActions: z.array(z.object({
        actionLabel: z.unknown(),
        onClick: z.unknown(),
      })),
      displayStyle: z.string(),
      expressionData: z.array(z.object({
        conditions: z.unknown(),
        eventActions: z.unknown(),
        expression: z.unknown(),
        id: z.unknown(),
      })),
      fixedFooter: z.object({
        primaryButton: z.object({
          altText: z.unknown(),
          color: z.unknown(),
          disabled: z.unknown(),
          icon: z.unknown(),
          onClick: z.unknown(),
          text: z.unknown(),
          type: z.unknown(),
        }),
        secondaryButton: z.object({
          altText: z.unknown(),
          color: z.unknown(),
          disabled: z.unknown(),
          icon: z.unknown(),
          onClick: z.unknown(),
          text: z.unknown(),
          type: z.unknown(),
        }),
      }),
      header: z.object({
        imageAltText: z.string(),
        imageType: z.string(),
        imageUrl: z.string(),
        subtitle: z.string(),
        title: z.string(),
      }),
      name: z.string(),
      peekCardHeader: z.object({
        imageAltText: z.string(),
        imageType: z.string(),
        imageUrl: z.string(),
        subtitle: z.string(),
        title: z.string(),
      }),
      sectionDividerStyle: z.string(),
      sections: z.array(z.object({
        collapseControl: z.unknown(),
        collapsible: z.unknown(),
        header: z.unknown(),
        id: z.unknown(),
        uncollapsibleWidgetsCount: z.unknown(),
        widgets: z.unknown(),
      })),
    }),
    cardId: z.string(),
  })).optional(),
  clientAssignedMessageId: z.string().optional(),
  createTime: z.string().optional(),
  deleteTime: z.string().optional(),
  deletionMetadata: z.object({
    deletionType: z.string(),
  }).optional(),
  emojiReactionSummaries: z.array(z.object({
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
    reactionCount: z.number(),
  })).optional(),
  fallbackText: z.string().optional(),
  formattedText: z.string().optional(),
  lastUpdateTime: z.string().optional(),
  markupSyntax: z.string().optional(),
  matchedUrl: z.object({
    url: z.string(),
  }).optional(),
  name: z.string(),
  privateMessageViewer: z.object({
    displayName: z.string(),
    domainId: z.string(),
    isAnonymous: z.boolean(),
    name: z.string(),
    type: z.string(),
  }).optional(),
  quotedMessageMetadata: z.object({
    forwardedMetadata: z.object({
      space: z.string(),
      spaceDisplayName: z.string(),
    }),
    lastUpdateTime: z.string(),
    name: z.string(),
    quoteType: z.string(),
    quotedMessageSnapshot: z.object({
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
      attachments: z.array(z.object({
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
      formattedText: z.string(),
      sender: z.string(),
      text: z.string(),
    }),
  }).optional(),
  sender: z.object({
    displayName: z.string(),
    domainId: z.string(),
    isAnonymous: z.boolean(),
    name: z.string(),
    type: z.string(),
  }).optional(),
  silent: z.boolean().optional(),
  slashCommand: z.object({
    commandId: z.string(),
  }).optional(),
  space: z.object({
    accessSettings: z.object({
      accessPermissionSettings: z.object({
        discoverSpaceSetting: z.object({
          principals: z.array(z.unknown()),
        }),
        joinSpaceSetting: z.object({
          principals: z.array(z.unknown()),
        }),
        viewSpaceMembershipSetting: z.object({
          principals: z.array(z.unknown()),
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
  }).optional(),
  text: z.string().optional(),
  thread: z.object({
    name: z.string(),
    threadKey: z.string(),
  }).optional(),
  threadReply: z.boolean().optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  accessToken: z.string().meta({ sensitive: true }).optional(),
  credentialsJson: z.string().meta({ sensitive: true }).optional(),
  project: z.string().optional(),
  scopes: z.string().optional(),
  quotaProject: z.string().optional(),
  apiEndpoint: z.string().optional(),
  accessoryWidgets: z.array(z.object({
    buttonList: z.object({
      buttons: z.array(z.object({
        altText: z.unknown().describe(
          'The alternative text that\'s used for accessibility. Set descriptive text that lets users know what the button does. For example, if a button opens a hyperlink, you might write: "Opens a new browser tab and navigates to the Google Chat developer documentation at https://developers.google.com/workspace/chat".',
        ).optional(),
        color: z.unknown().describe(
          'Optional. The color of the button. If set, the button `type` is set to `FILLED` and the color of `text` and `icon` fields are set to a contrasting color for readability. For example, if the button color is set to blue, any text or icons in the button are set to white. To set the button color, specify a value for the `red`, `green`, and `blue` fields. The value must be a float number between 0 and 1 based on the RGB color value, where `0` (0/255) represents the absence of color and `1` (255/255) represents the maximum intensity of the color. For example, the following sets the color to red at its maximum intensity: ` "color": { "red": 1, "green": 0, "blue": 0, } ` The `alpha` field is unavailable for button color. If specified, this field is ignored.',
        ).optional(),
        disabled: z.unknown().describe(
          "If `true`, the button is displayed in an inactive state and doesn't respond to user actions.",
        ).optional(),
        icon: z.unknown().describe(
          "An icon displayed inside the button. If both `icon` and `text` are set, then the icon appears before the text.",
        ).optional(),
        onClick: z.unknown().describe(
          "Required. The action to perform when a user clicks the button, such as opening a hyperlink or running a custom function.",
        ).optional(),
        text: z.unknown().describe("The text displayed inside the button.")
          .optional(),
        type: z.unknown().describe(
          "Optional. The type of a button. If unset, button type defaults to `OUTLINED`. If the `color` field is set, the button type is forced to `FILLED` and any value set for this field is ignored.",
        ).optional(),
      })).describe("An array of buttons.").optional(),
    }).describe("A list of buttons.").optional(),
  })).describe(
    "Optional. One or more interactive widgets that appear at the bottom of a message. You can add accessory widgets to messages that contain text, cards, or both text and cards. Not supported for messages that contain dialogs. For details, see [Add interactive widgets at the bottom of a message](https://developers.google.com/workspace/chat/create-messages#add-accessory-widgets). Creating a message with accessory widgets requires [app authentication] (https://developers.google.com/workspace/chat/authenticate-authorize-chat-app).",
  ).optional(),
  actionResponse: z.object({
    dialogAction: z.object({
      actionStatus: z.object({
        statusCode: z.enum([
          "OK",
          "CANCELLED",
          "UNKNOWN",
          "INVALID_ARGUMENT",
          "DEADLINE_EXCEEDED",
          "NOT_FOUND",
          "ALREADY_EXISTS",
          "PERMISSION_DENIED",
          "UNAUTHENTICATED",
          "RESOURCE_EXHAUSTED",
          "FAILED_PRECONDITION",
          "ABORTED",
          "OUT_OF_RANGE",
          "UNIMPLEMENTED",
          "INTERNAL",
          "UNAVAILABLE",
          "DATA_LOSS",
        ]).describe("The status code.").optional(),
        userFacingMessage: z.string().describe(
          "The message to send users about the status of their request. If unset, a generic message based on the `status_code` is sent.",
        ).optional(),
      }).describe(
        "Input only. Status for a request to either invoke or submit a [dialog](https://developers.google.com/workspace/chat/dialogs). Displays a status and message to users, if necessary. For example, in case of an error or success.",
      ).optional(),
      dialog: z.object({
        body: z.object({
          cardActions: z.array(z.unknown()).describe(
            'The card\'s actions. Actions are added to the card\'s toolbar menu. [Google Workspace add-ons](https://developers.google.com/workspace/add-ons): For example, the following JSON constructs a card action menu with `Settings` and `Send Feedback` options: ` "card_actions": [ { "actionLabel": "Settings", "onClick": { "action": { "functionName": "goToView", "parameters": [ { "key": "viewType", "value": "SETTING" } ], "loadIndicator": "LoadIndicator.SPINNER" } } }, { "actionLabel": "Send Feedback", "onClick": { "openLink": { "url": "https://example.com/feedback" } } } ] `',
          ).optional(),
          displayStyle: z.enum(["DISPLAY_STYLE_UNSPECIFIED", "PEEK", "REPLACE"])
            .describe(
              "In Google Workspace add-ons, sets the display properties of the `peekCardHeader`. [Google Workspace add-ons](https://developers.google.com/workspace/add-ons):",
            ).optional(),
          expressionData: z.array(z.unknown()).describe(
            "The expression data for the card. Available for Google Workspace add-ons that extend Google Workspace Studio. Unavailable for Google Chat apps.",
          ).optional(),
          fixedFooter: z.object({
            primaryButton: z.unknown().describe(
              "The primary button of the fixed footer. The button must be a text button with text and color set.",
            ).optional(),
            secondaryButton: z.unknown().describe(
              "The secondary button of the fixed footer. The button must be a text button with text and color set. If `secondaryButton` is set, you must also set `primaryButton`.",
            ).optional(),
          }).describe(
            "The fixed footer shown at the bottom of this card. Setting `fixedFooter` without specifying a `primaryButton` or a `secondaryButton` causes an error. For Chat apps, you can use fixed footers in [dialogs](https://developers.google.com/workspace/chat/dialogs), but not [card messages](https://developers.google.com/workspace/chat/create-messages#create). [Google Workspace add-ons and Chat apps](https://developers.google.com/workspace/extend):",
          ).optional(),
          header: z.object({
            imageAltText: z.unknown().describe(
              "The alternative text of this image that's used for accessibility.",
            ).optional(),
            imageType: z.unknown().describe(
              "The shape used to crop the image. [Google Workspace add-ons and Chat apps](https://developers.google.com/workspace/extend):",
            ).optional(),
            imageUrl: z.unknown().describe(
              "The HTTPS URL of the image in the card header.",
            ).optional(),
            subtitle: z.unknown().describe(
              "The subtitle of the card header. If specified, appears on its own line below the `title`.",
            ).optional(),
            title: z.unknown().describe(
              "Required. The title of the card header. The header has a fixed height: if both a title and subtitle are specified, each takes up one line. If only the title is specified, it takes up both lines.",
            ).optional(),
          }).describe(
            "The header of the card. A header usually contains a leading image and a title. Headers always appear at the top of a card.",
          ).optional(),
          name: z.string().describe(
            "Name of the card. Used as a card identifier in card navigation. [Google Workspace add-ons](https://developers.google.com/workspace/add-ons):",
          ).optional(),
          peekCardHeader: z.object({
            imageAltText: z.unknown().describe(
              "The alternative text of this image that's used for accessibility.",
            ).optional(),
            imageType: z.unknown().describe(
              "The shape used to crop the image. [Google Workspace add-ons and Chat apps](https://developers.google.com/workspace/extend):",
            ).optional(),
            imageUrl: z.unknown().describe(
              "The HTTPS URL of the image in the card header.",
            ).optional(),
            subtitle: z.unknown().describe(
              "The subtitle of the card header. If specified, appears on its own line below the `title`.",
            ).optional(),
            title: z.unknown().describe(
              "Required. The title of the card header. The header has a fixed height: if both a title and subtitle are specified, each takes up one line. If only the title is specified, it takes up both lines.",
            ).optional(),
          }).describe(
            "When displaying contextual content, the peek card header acts as a placeholder so that the user can navigate forward between the homepage cards and the contextual cards. [Google Workspace add-ons](https://developers.google.com/workspace/add-ons):",
          ).optional(),
          sectionDividerStyle: z.enum([
            "DIVIDER_STYLE_UNSPECIFIED",
            "SOLID_DIVIDER",
            "NO_DIVIDER",
          ]).describe(
            "The divider style between the header, sections and footer.",
          ).optional(),
          sections: z.array(z.unknown()).describe(
            "Contains a collection of widgets. Each section has its own, optional header. Sections are visually separated by a line divider. For an example in Google Chat apps, see [Define a section of a card](https://developers.google.com/workspace/chat/design-components-card-dialog#define_a_section_of_a_card).",
          ).optional(),
        }).describe(
          "Input only. Body of the dialog, which is rendered in a modal. Google Chat apps don't support the following card entities: `DateTimePicker`, `OnChangeAction`.",
        ).optional(),
      }).describe(
        "Input only. [Dialog](https://developers.google.com/workspace/chat/dialogs) for the request.",
      ).optional(),
    }).describe(
      "Input only. A response to an interaction event related to a [dialog](https://developers.google.com/workspace/chat/dialogs). Must be accompanied by `ResponseType.Dialog`.",
    ).optional(),
    type: z.enum([
      "TYPE_UNSPECIFIED",
      "NEW_MESSAGE",
      "UPDATE_MESSAGE",
      "UPDATE_USER_MESSAGE_CARDS",
      "REQUEST_CONFIG",
      "DIALOG",
      "UPDATE_WIDGET",
    ]).describe("Input only. The type of Chat app response.").optional(),
    updatedWidget: z.object({
      suggestions: z.object({
        items: z.array(z.object({
          bottomText: z.unknown().describe(
            "For multiselect menus, a text description or label that's displayed below the item's `text` field.",
          ).optional(),
          selected: z.unknown().describe(
            "Whether the item is selected by default. If the selection input only accepts one value (such as for radio buttons or a dropdown menu), only set this field for one item.",
          ).optional(),
          startIconUri: z.unknown().optional(),
          text: z.unknown().describe(
            "The text that identifies or describes the item to users.",
          ).optional(),
          value: z.unknown().describe(
            "The value associated with this item. The client should use this as a form input value. For details about working with form inputs, see [Receive form data](https://developers.google.com/workspace/chat/read-form-data).",
          ).optional(),
        })).describe("An array of the SelectionItem objects.").optional(),
      }).describe("List of widget autocomplete results").optional(),
      widget: z.string().describe(
        "The ID of the updated widget. The ID must match the one for the widget that triggered the update request.",
      ).optional(),
    }).describe("Input only. The response of the updated widget.").optional(),
    url: z.string().describe(
      "Input only. URL for users to authenticate or configure. (Only for `REQUEST_CONFIG` response types.)",
    ).optional(),
  }).describe(
    "Input only. Parameters that a Chat app can use to configure how its response is posted.",
  ).optional(),
  attachment: z.array(z.object({
    attachmentDataRef: z.object({
      attachmentUploadToken: z.string().describe(
        "Optional. Opaque token containing a reference to an uploaded attachment. Treated by clients as an opaque string and used to create or update Chat messages with attachments.",
      ).optional(),
      resourceName: z.string().describe(
        "Optional. The resource name of the attachment data. This field is used with the media API to download the attachment data.",
      ).optional(),
    }).describe(
      "Optional. A reference to the attachment data. This field is used to create or update messages with attachments, or with the media API to download the attachment data.",
    ).optional(),
    contentName: z.string().describe(
      "Output only. The original file name for the content, not the full path.",
    ).optional(),
    contentType: z.string().describe(
      "Output only. The content type (MIME type) of the file.",
    ).optional(),
    downloadUri: z.string().describe(
      "Output only. The download URL which should be used to allow a human user to download the attachment. Chat apps shouldn't use this URL to download attachment content.",
    ).optional(),
    driveDataRef: z.object({
      driveFileId: z.string().describe(
        "The ID for the drive file. Use with the Drive API.",
      ).optional(),
    }).describe(
      "Output only. A reference to the Google Drive attachment. This field is used with the Google Drive API.",
    ).optional(),
    name: z.string().describe(
      "Identifier. Resource name of the attachment. Format: `spaces/{space}/messages/{message}/attachments/{attachment}`.",
    ).optional(),
    source: z.enum(["SOURCE_UNSPECIFIED", "DRIVE_FILE", "UPLOADED_CONTENT"])
      .describe("Output only. The source of the attachment.").optional(),
    thumbnailUri: z.string().describe(
      "Output only. The thumbnail URL which should be used to preview the attachment to a human user. Chat apps shouldn't use this URL to download attachment content.",
    ).optional(),
  })).describe("Optional. User-uploaded attachment.").optional(),
  cardsV2: z.array(z.object({
    card: z.object({
      cardActions: z.array(z.object({
        actionLabel: z.unknown().describe(
          "The label that displays as the action menu item.",
        ).optional(),
        onClick: z.unknown().describe(
          "The `onClick` action for this action item.",
        ).optional(),
      })).describe(
        'The card\'s actions. Actions are added to the card\'s toolbar menu. [Google Workspace add-ons](https://developers.google.com/workspace/add-ons): For example, the following JSON constructs a card action menu with `Settings` and `Send Feedback` options: ` "card_actions": [ { "actionLabel": "Settings", "onClick": { "action": { "functionName": "goToView", "parameters": [ { "key": "viewType", "value": "SETTING" } ], "loadIndicator": "LoadIndicator.SPINNER" } } }, { "actionLabel": "Send Feedback", "onClick": { "openLink": { "url": "https://example.com/feedback" } } } ] `',
      ).optional(),
      displayStyle: z.enum(["DISPLAY_STYLE_UNSPECIFIED", "PEEK", "REPLACE"])
        .describe(
          "In Google Workspace add-ons, sets the display properties of the `peekCardHeader`. [Google Workspace add-ons](https://developers.google.com/workspace/add-ons):",
        ).optional(),
      expressionData: z.array(z.object({
        conditions: z.unknown().describe(
          "The list of conditions that are determined by the expression evaluation result.",
        ).optional(),
        eventActions: z.unknown().describe(
          "The list of actions that the ExpressionData can be used.",
        ).optional(),
        expression: z.unknown().describe("The uncompiled expression.")
          .optional(),
        id: z.unknown().describe("The unique identifier of the ExpressionData.")
          .optional(),
      })).describe(
        "The expression data for the card. Available for Google Workspace add-ons that extend Google Workspace Studio. Unavailable for Google Chat apps.",
      ).optional(),
      fixedFooter: z.object({
        primaryButton: z.object({
          altText: z.unknown().describe(
            'The alternative text that\'s used for accessibility. Set descriptive text that lets users know what the button does. For example, if a button opens a hyperlink, you might write: "Opens a new browser tab and navigates to the Google Chat developer documentation at https://developers.google.com/workspace/chat".',
          ).optional(),
          color: z.unknown().describe(
            'Optional. The color of the button. If set, the button `type` is set to `FILLED` and the color of `text` and `icon` fields are set to a contrasting color for readability. For example, if the button color is set to blue, any text or icons in the button are set to white. To set the button color, specify a value for the `red`, `green`, and `blue` fields. The value must be a float number between 0 and 1 based on the RGB color value, where `0` (0/255) represents the absence of color and `1` (255/255) represents the maximum intensity of the color. For example, the following sets the color to red at its maximum intensity: ` "color": { "red": 1, "green": 0, "blue": 0, } ` The `alpha` field is unavailable for button color. If specified, this field is ignored.',
          ).optional(),
          disabled: z.unknown().describe(
            "If `true`, the button is displayed in an inactive state and doesn't respond to user actions.",
          ).optional(),
          icon: z.unknown().describe(
            "An icon displayed inside the button. If both `icon` and `text` are set, then the icon appears before the text.",
          ).optional(),
          onClick: z.unknown().describe(
            "Required. The action to perform when a user clicks the button, such as opening a hyperlink or running a custom function.",
          ).optional(),
          text: z.unknown().describe("The text displayed inside the button.")
            .optional(),
          type: z.unknown().describe(
            "Optional. The type of a button. If unset, button type defaults to `OUTLINED`. If the `color` field is set, the button type is forced to `FILLED` and any value set for this field is ignored.",
          ).optional(),
        }).describe(
          "The primary button of the fixed footer. The button must be a text button with text and color set.",
        ).optional(),
        secondaryButton: z.object({
          altText: z.unknown().describe(
            'The alternative text that\'s used for accessibility. Set descriptive text that lets users know what the button does. For example, if a button opens a hyperlink, you might write: "Opens a new browser tab and navigates to the Google Chat developer documentation at https://developers.google.com/workspace/chat".',
          ).optional(),
          color: z.unknown().describe(
            'Optional. The color of the button. If set, the button `type` is set to `FILLED` and the color of `text` and `icon` fields are set to a contrasting color for readability. For example, if the button color is set to blue, any text or icons in the button are set to white. To set the button color, specify a value for the `red`, `green`, and `blue` fields. The value must be a float number between 0 and 1 based on the RGB color value, where `0` (0/255) represents the absence of color and `1` (255/255) represents the maximum intensity of the color. For example, the following sets the color to red at its maximum intensity: ` "color": { "red": 1, "green": 0, "blue": 0, } ` The `alpha` field is unavailable for button color. If specified, this field is ignored.',
          ).optional(),
          disabled: z.unknown().describe(
            "If `true`, the button is displayed in an inactive state and doesn't respond to user actions.",
          ).optional(),
          icon: z.unknown().describe(
            "An icon displayed inside the button. If both `icon` and `text` are set, then the icon appears before the text.",
          ).optional(),
          onClick: z.unknown().describe(
            "Required. The action to perform when a user clicks the button, such as opening a hyperlink or running a custom function.",
          ).optional(),
          text: z.unknown().describe("The text displayed inside the button.")
            .optional(),
          type: z.unknown().describe(
            "Optional. The type of a button. If unset, button type defaults to `OUTLINED`. If the `color` field is set, the button type is forced to `FILLED` and any value set for this field is ignored.",
          ).optional(),
        }).describe(
          "The secondary button of the fixed footer. The button must be a text button with text and color set. If `secondaryButton` is set, you must also set `primaryButton`.",
        ).optional(),
      }).describe(
        "The fixed footer shown at the bottom of this card. Setting `fixedFooter` without specifying a `primaryButton` or a `secondaryButton` causes an error. For Chat apps, you can use fixed footers in [dialogs](https://developers.google.com/workspace/chat/dialogs), but not [card messages](https://developers.google.com/workspace/chat/create-messages#create). [Google Workspace add-ons and Chat apps](https://developers.google.com/workspace/extend):",
      ).optional(),
      header: z.object({
        imageAltText: z.string().describe(
          "The alternative text of this image that's used for accessibility.",
        ).optional(),
        imageType: z.enum(["SQUARE", "CIRCLE"]).describe(
          "The shape used to crop the image. [Google Workspace add-ons and Chat apps](https://developers.google.com/workspace/extend):",
        ).optional(),
        imageUrl: z.string().describe(
          "The HTTPS URL of the image in the card header.",
        ).optional(),
        subtitle: z.string().describe(
          "The subtitle of the card header. If specified, appears on its own line below the `title`.",
        ).optional(),
        title: z.string().describe(
          "Required. The title of the card header. The header has a fixed height: if both a title and subtitle are specified, each takes up one line. If only the title is specified, it takes up both lines.",
        ).optional(),
      }).describe(
        "The header of the card. A header usually contains a leading image and a title. Headers always appear at the top of a card.",
      ).optional(),
      name: z.string().describe(
        "Name of the card. Used as a card identifier in card navigation. [Google Workspace add-ons](https://developers.google.com/workspace/add-ons):",
      ).optional(),
      peekCardHeader: z.object({
        imageAltText: z.string().describe(
          "The alternative text of this image that's used for accessibility.",
        ).optional(),
        imageType: z.enum(["SQUARE", "CIRCLE"]).describe(
          "The shape used to crop the image. [Google Workspace add-ons and Chat apps](https://developers.google.com/workspace/extend):",
        ).optional(),
        imageUrl: z.string().describe(
          "The HTTPS URL of the image in the card header.",
        ).optional(),
        subtitle: z.string().describe(
          "The subtitle of the card header. If specified, appears on its own line below the `title`.",
        ).optional(),
        title: z.string().describe(
          "Required. The title of the card header. The header has a fixed height: if both a title and subtitle are specified, each takes up one line. If only the title is specified, it takes up both lines.",
        ).optional(),
      }).describe(
        "When displaying contextual content, the peek card header acts as a placeholder so that the user can navigate forward between the homepage cards and the contextual cards. [Google Workspace add-ons](https://developers.google.com/workspace/add-ons):",
      ).optional(),
      sectionDividerStyle: z.enum([
        "DIVIDER_STYLE_UNSPECIFIED",
        "SOLID_DIVIDER",
        "NO_DIVIDER",
      ]).describe("The divider style between the header, sections and footer.")
        .optional(),
      sections: z.array(z.object({
        collapseControl: z.unknown().describe(
          "Optional. Define the expand and collapse button of the section. This button will be shown only if the section is collapsible. If this field isn't set, the default button is used.",
        ).optional(),
        collapsible: z.unknown().describe(
          "Indicates whether this section is collapsible. Collapsible sections hide some or all widgets, but users can expand the section to reveal the hidden widgets by clicking **Show more**. Users can hide the widgets again by clicking **Show less**. To determine which widgets are hidden, specify `uncollapsibleWidgetsCount`.",
        ).optional(),
        header: z.unknown().describe(
          "Text that appears at the top of a section. Supports simple HTML formatted text. For more information about formatting text, see [Formatting text in Google Chat apps](https://developers.google.com/workspace/chat/format-messages#card-formatting) and [Formatting text in Google Workspace add-ons](https://developers.google.com/apps-script/add-ons/concepts/widgets#text_formatting).",
        ).optional(),
        id: z.unknown().describe(
          "A unique ID assigned to the section that's used to identify the section to be mutated. The ID has a character limit of 64 characters and should be in the format of `[a-zA-Z0-9-]+`. Available for Google Workspace add-ons that extend Google Workspace Studio. Unavailable for Google Chat apps.",
        ).optional(),
        uncollapsibleWidgetsCount: z.unknown().describe(
          "The number of uncollapsible widgets which remain visible even when a section is collapsed. For example, when a section contains five widgets and the `uncollapsibleWidgetsCount` is set to `2`, the first two widgets are always shown and the last three are collapsed by default. The `uncollapsibleWidgetsCount` is taken into account only when `collapsible` is `true`.",
        ).optional(),
        widgets: z.unknown().describe(
          "All the widgets in the section. Must contain at least one widget.",
        ).optional(),
      })).describe(
        "Contains a collection of widgets. Each section has its own, optional header. Sections are visually separated by a line divider. For an example in Google Chat apps, see [Define a section of a card](https://developers.google.com/workspace/chat/design-components-card-dialog#define_a_section_of_a_card).",
      ).optional(),
    }).describe("A card. Maximum size is 32 KB.").optional(),
    cardId: z.string().describe(
      "Required if the message contains multiple cards. A unique identifier for a card in a message.",
    ).optional(),
  })).describe(
    "Optional. An array of [cards](https://developers.google.com/workspace/chat/api/reference/rest/v1/cards). Chat apps can create cards with [app authentication](https://developers.google.com/workspace/chat/authenticate-authorize-chat-app). As part of the [Developer Preview Program](https://developers.google.com/workspace/preview), if your Chat app [authenticates as a user](https://developers.google.com/workspace/chat/authenticate-authorize-chat-user), it can create card messages. If your Chat app is not part of Developer Preview Program, it can't create cards with user authentication. To learn how to create a message that contains cards, see [Send a message](https://developers.google.com/workspace/chat/create-messages). [Card builder](https://addons.gsuite.google.com/uikit/builder)",
  ).optional(),
  clientAssignedMessageId: z.string().describe(
    "Optional. A custom ID for the message. You can use field to identify a message, or to get, delete, or update a message. To set a custom ID, specify the [`messageId`](https://developers.google.com/workspace/chat/api/reference/rest/v1/spaces.messages/create#body.QUERY_PARAMETERS.message_id) field when you create the message. For details, see [Name a message](https://developers.google.com/workspace/chat/create-messages#name_a_created_message).",
  ).optional(),
  fallbackText: z.string().describe(
    "Optional. A plain-text description of the message's cards, used when the actual cards can't be displayed—for example, mobile notifications.",
  ).optional(),
  markupSyntax: z.enum([
    "MARKUP_SYNTAX_UNSPECIFIED",
    "MARKUP_SYNTAX_CHAT",
    "MARKUP_SYNTAX_MARKDOWN",
  ]).describe(
    "Optional. Specifies how the server interprets the message `text` field content.",
  ).optional(),
  name: z.string().describe(
    "Identifier. Resource name of the message. Format: `spaces/{space}/messages/{message}` Where `{space}` is the ID of the space where the message is posted and `{message}` is a system-assigned ID for the message. For example, `spaces/AAAAAAAAAAA/messages/BBBBBBBBBBB.BBBBBBBBBBB`. If you set a custom ID when you create a message, you can use this ID to specify the message in a request by replacing `{message}` with the value from the `clientAssignedMessageId` field. For example, `spaces/AAAAAAAAAAA/messages/client-custom-name`. For details, see [Name a message](https://developers.google.com/workspace/chat/create-messages#name_a_created_message).",
  ).optional(),
  quotedMessageMetadata: z.object({
    forwardedMetadata: z.object({
      space: z.string().describe(
        "Output only. The resource name of the source space. Format: spaces/{space}",
      ).optional(),
      spaceDisplayName: z.string().describe(
        'Output only. The display name of the source space or DM at the time of forwarding. For `SPACE`, this is the space name. For `DIRECT_MESSAGE`, this is the other participant\'s name (e.g., "User A"). For `GROUP_CHAT`, this is a generated name based on members\' first names, limited to 5 including the creator (e.g., "User A, User B").',
      ).optional(),
    }).describe(
      "Output only. Metadata about the source space of the quoted message. Populated only for FORWARD quote type.",
    ).optional(),
    lastUpdateTime: z.string().describe(
      "Required. The timestamp when the quoted message was created or when the quoted message was last updated. If the message was edited, use this field, `last_update_time`. If the message was never edited, use `create_time`. If `last_update_time` doesn't match the latest version of the quoted message, the request fails.",
    ).optional(),
    name: z.string().describe(
      "Required. Resource name of the message that is quoted. Format: `spaces/{space}/messages/{message}`",
    ).optional(),
    quoteType: z.enum(["QUOTE_TYPE_UNSPECIFIED", "REPLY", "FORWARD"]).describe(
      "Optional. Specifies the quote type. If not set, defaults to REPLY in the message read/write path for backward compatibility.",
    ).optional(),
    quotedMessageSnapshot: z.object({
      annotations: z.array(z.object({
        customEmojiMetadata: z.object({
          customEmoji: z.unknown().describe("The custom emoji.").optional(),
        }).describe("The metadata for a custom emoji.").optional(),
        length: z.number().int().describe(
          "Length of the substring in the plain-text message body this annotation corresponds to. If not present, indicates a length of 0.",
        ).optional(),
        richLinkMetadata: z.object({
          calendarEventLinkData: z.unknown().describe(
            "Data for a Calendar event link.",
          ).optional(),
          chatSpaceLinkData: z.unknown().describe("Data for a chat space link.")
            .optional(),
          driveLinkData: z.unknown().describe("Data for a drive link.")
            .optional(),
          meetSpaceLinkData: z.unknown().describe("Data for a Meet space link.")
            .optional(),
          richLinkType: z.unknown().describe("The rich link type.").optional(),
          uri: z.unknown().describe("The URI of this link.").optional(),
        }).describe("The metadata for a rich link.").optional(),
        slashCommand: z.object({
          bot: z.unknown().describe("The Chat app whose command was invoked.")
            .optional(),
          commandId: z.unknown().describe(
            "The command ID of the invoked slash command.",
          ).optional(),
          commandName: z.unknown().describe(
            "The name of the invoked slash command.",
          ).optional(),
          triggersDialog: z.unknown().describe(
            "Indicates whether the slash command is for a dialog.",
          ).optional(),
          type: z.unknown().describe("The type of slash command.").optional(),
        }).describe("The metadata for a slash command.").optional(),
        startIndex: z.number().int().describe(
          "Start index (0-based, inclusive) in the plain-text message body this annotation corresponds to.",
        ).optional(),
        type: z.enum([
          "ANNOTATION_TYPE_UNSPECIFIED",
          "USER_MENTION",
          "SLASH_COMMAND",
          "RICH_LINK",
          "CUSTOM_EMOJI",
        ]).describe("The type of this annotation.").optional(),
        userMention: z.object({
          type: z.unknown().describe("The type of user mention.").optional(),
          user: z.unknown().describe("The user mentioned.").optional(),
        }).describe("The metadata of user mention.").optional(),
      })).describe(
        "Output only. Annotations parsed from the text body of the quoted message. Populated only for FORWARD quote type.",
      ).optional(),
      attachments: z.array(z.object({
        attachmentDataRef: z.object({
          attachmentUploadToken: z.unknown().describe(
            "Optional. Opaque token containing a reference to an uploaded attachment. Treated by clients as an opaque string and used to create or update Chat messages with attachments.",
          ).optional(),
          resourceName: z.unknown().describe(
            "Optional. The resource name of the attachment data. This field is used with the media API to download the attachment data.",
          ).optional(),
        }).describe(
          "Optional. A reference to the attachment data. This field is used to create or update messages with attachments, or with the media API to download the attachment data.",
        ).optional(),
        contentName: z.string().describe(
          "Output only. The original file name for the content, not the full path.",
        ).optional(),
        contentType: z.string().describe(
          "Output only. The content type (MIME type) of the file.",
        ).optional(),
        downloadUri: z.string().describe(
          "Output only. The download URL which should be used to allow a human user to download the attachment. Chat apps shouldn't use this URL to download attachment content.",
        ).optional(),
        driveDataRef: z.object({
          driveFileId: z.unknown().describe(
            "The ID for the drive file. Use with the Drive API.",
          ).optional(),
        }).describe(
          "Output only. A reference to the Google Drive attachment. This field is used with the Google Drive API.",
        ).optional(),
        name: z.string().describe(
          "Identifier. Resource name of the attachment. Format: `spaces/{space}/messages/{message}/attachments/{attachment}`.",
        ).optional(),
        source: z.enum(["SOURCE_UNSPECIFIED", "DRIVE_FILE", "UPLOADED_CONTENT"])
          .describe("Output only. The source of the attachment.").optional(),
        thumbnailUri: z.string().describe(
          "Output only. The thumbnail URL which should be used to preview the attachment to a human user. Chat apps shouldn't use this URL to download attachment content.",
        ).optional(),
      })).describe(
        "Output only. Attachments that were part of the quoted message. These are copies of the quoted message's attachment metadata. Populated only for FORWARD quote type.",
      ).optional(),
      formattedText: z.string().describe(
        "Output only. Contains the quoted message `text` with markups added to support rich formatting like hyperlinks,custom emojis, markup, etc. Populated only for FORWARD quote type.",
      ).optional(),
      sender: z.string().describe(
        "Output only. The quoted message's author name. Populated for both REPLY & FORWARD quote types.",
      ).optional(),
      text: z.string().describe(
        "Output only. Snapshot of the quoted message's text content.",
      ).optional(),
    }).describe("Output only. A snapshot of the quoted message's content.")
      .optional(),
  }).describe(
    "Optional. Information about a message that another message quotes. When you create a message, you can quote messages within the same thread, or quote a root message to create a new root message. However, you can't quote a message reply from a different thread. When you update a message, you can't add or replace the `quotedMessageMetadata` field, but you can remove it. For example usage, see [Quote another message](https://developers.google.com/workspace/chat/create-messages#quote-a-message).",
  ).optional(),
  text: z.string().describe(
    "Optional. Plain-text body of the message. The first link to an image, video, or web page generates a [preview chip](https://developers.google.com/workspace/chat/preview-links). You can also [@mention a Google Chat user](https://developers.google.com/workspace/chat/format-messages#messages-@mention), or everyone in the space. To learn about creating text messages, see [Send a message](https://developers.google.com/workspace/chat/create-messages).",
  ).optional(),
  thread: z.object({
    name: z.string().describe(
      "Identifier. Resource name of the thread. Example: `spaces/{space}/threads/{thread}`",
    ).optional(),
    threadKey: z.string().describe(
      "Optional. Input for creating or updating a thread. Otherwise, output only. ID for the thread. Supports up to 4000 characters. This ID is unique to the Chat app that sets it. For example, if multiple Chat apps create a message using the same thread key, the messages are posted in different threads. To reply in a thread created by a person or another Chat app, specify the thread `name` field instead.",
    ).optional(),
  }).describe(
    "The thread the message belongs to. For example usage, see [Start or reply to a message thread](https://developers.google.com/workspace/chat/create-messages#create-message-thread).",
  ).optional(),
  createMessageNotificationOptions_notificationType: z.string().describe(
    "The notification type for the message.",
  ).optional(),
  messageId: z.string().describe(
    "Optional. A custom ID for a message. Lets Chat apps get, update, or delete a message without needing to store the system-assigned ID in the message's resource name (represented in the message `name` field). The value for this field must meet the following requirements: * Begins with `client-`. For example, `client-custom-name` is a valid custom ID, but `custom-name` is not. * Contains up to 63 characters and only lowercase letters, numbers, and hyphens. * Is unique within a space. A Chat app can't use the same custom ID for different messages. For details, see [Name a message](https://developers.google.com/workspace/chat/create-messages#name_a_created_message).",
  ).optional(),
  messageReplyOption: z.string().describe(
    "Optional. Specifies whether a message starts a thread or replies to one. Only supported in named spaces. When [responding to user interactions](https://developers.google.com/workspace/chat/receive-respond-interactions), this field is ignored. For interactions within a thread, the reply is created in the same thread. Otherwise, the reply is created as a new thread.",
  ).optional(),
  requestId: z.string().describe(
    "Optional. A unique ID for this request. A random UUID is recommended. Specifying a request ID makes the request idempotent, which ensures that multiple identical requests with the same request ID result in only a single message being created. Subsequent requests with the same request ID return the existing message and do not update the message, even if the requested details differ from the current state. To use this field effectively: - Ensure that subsequent requests are identical and use the same authentication credentials as the original request. - If a message was already created with the provided request ID, the request returns that message. Note that the returned message might not be fully populated; the API echoes the message in your request with the system-assigned resource names populated. To retrieve the latest metadata for the message, call `GetMessage`. - Reusing an existing request ID with a different authenticated user results in an error.",
  ).optional(),
  allowMissing: z.string().describe(
    "Optional. If `true` and the message isn't found, a new message is created and `updateMask` is ignored. The specified message ID must be [client-assigned](https://developers.google.com/workspace/chat/create-messages#name_a_created_message) or the request fails.",
  ).optional(),
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

/** Swamp extension model for Google Cloud Google Chat Spaces.Messages. Registered at `@swamp/gcp/chat/spaces-messages`. */
export const model = {
  type: "@swamp/gcp/chat/spaces-messages",
  version: "2026.09.17.1",
  upgrades: [
    {
      toVersion: "2026.04.01.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.04.01.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.04.02.1",
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
      description: "Added: createMessageNotificationOptions_notificationType",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.18.2",
      description: "Added: createMessageNotificationOptions_notificationType",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.19.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.20.1",
      description: "Added: createMessageNotificationOptions_notificationType",
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
      toVersion: "2026.05.26.1",
      description: "Added: createMessageNotificationOptions_notificationType",
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
      toVersion: "2026.06.12.1",
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
      toVersion: "2026.07.20.2",
      description: "Added: createMessageNotificationOptions_notificationType",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.21.1",
      description:
        "Removed: deletionMetadata, matchedUrl, privateMessageViewer, sender, slashCommand, space",
      upgradeAttributes: (old: Record<string, unknown>) => {
        const {
          deletionMetadata: _deletionMetadata,
          matchedUrl: _matchedUrl,
          privateMessageViewer: _privateMessageViewer,
          sender: _sender,
          slashCommand: _slashCommand,
          space: _space,
          ...rest
        } = old;
        return rest;
      },
    },
    {
      toVersion: "2026.07.21.3",
      description: "Added: createMessageNotificationOptions_notificationType",
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
      toVersion: "2026.07.29.2",
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
      description: "Added: allowMissing",
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
      description: "A message in a Google Chat space.",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a messages",
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
        if (g["accessoryWidgets"] !== undefined) {
          body["accessoryWidgets"] = g["accessoryWidgets"];
        }
        if (g["actionResponse"] !== undefined) {
          body["actionResponse"] = g["actionResponse"];
        }
        if (g["attachment"] !== undefined) body["attachment"] = g["attachment"];
        if (g["cardsV2"] !== undefined) body["cardsV2"] = g["cardsV2"];
        if (g["clientAssignedMessageId"] !== undefined) {
          body["clientAssignedMessageId"] = g["clientAssignedMessageId"];
        }
        if (g["fallbackText"] !== undefined) {
          body["fallbackText"] = g["fallbackText"];
        }
        if (g["markupSyntax"] !== undefined) {
          body["markupSyntax"] = g["markupSyntax"];
        }
        if (g["name"] !== undefined) body["name"] = g["name"];
        if (g["quotedMessageMetadata"] !== undefined) {
          body["quotedMessageMetadata"] = g["quotedMessageMetadata"];
        }
        if (g["text"] !== undefined) body["text"] = g["text"];
        if (g["thread"] !== undefined) body["thread"] = g["thread"];
        if (
          g["createMessageNotificationOptions_notificationType"] !== undefined
        ) {
          body["createMessageNotificationOptions_notificationType"] =
            g["createMessageNotificationOptions_notificationType"];
        }
        if (g["messageId"] !== undefined) {
          params["messageId"] = String(g["messageId"]);
        }
        if (g["messageReplyOption"] !== undefined) {
          params["messageReplyOption"] = String(g["messageReplyOption"]);
        }
        if (g["requestId"] !== undefined) {
          params["requestId"] = String(g["requestId"]);
        }
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
          {
            listConfig: LIST_CONFIG,
            listParams: {
              "parent": String(body["parent"] ?? g["parent"] ?? ""),
            },
            matchField: "name",
            matchValue: String(g["name"] ?? ""),
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
      description: "Get a messages",
      arguments: z.object({
        identifier: z.string().describe("The name of the messages"),
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
      description: "Update messages attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific messages by name (e.g. one discovered by list)",
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
        if (g["accessoryWidgets"] !== undefined) {
          body["accessoryWidgets"] = g["accessoryWidgets"];
        }
        if (g["actionResponse"] !== undefined) {
          body["actionResponse"] = g["actionResponse"];
        }
        if (g["attachment"] !== undefined) body["attachment"] = g["attachment"];
        if (g["cardsV2"] !== undefined) body["cardsV2"] = g["cardsV2"];
        if (g["clientAssignedMessageId"] !== undefined) {
          body["clientAssignedMessageId"] = g["clientAssignedMessageId"];
        }
        if (g["fallbackText"] !== undefined) {
          body["fallbackText"] = g["fallbackText"];
        }
        if (g["markupSyntax"] !== undefined) {
          body["markupSyntax"] = g["markupSyntax"];
        }
        if (g["quotedMessageMetadata"] !== undefined) {
          body["quotedMessageMetadata"] = g["quotedMessageMetadata"];
        }
        if (g["text"] !== undefined) body["text"] = g["text"];
        if (g["thread"] !== undefined) body["thread"] = g["thread"];
        if (g["allowMissing"] !== undefined) {
          params["allowMissing"] = String(g["allowMissing"]);
        } else if (existing["allowMissing"] !== undefined) {
          params["allowMissing"] = String(existing["allowMissing"]);
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
          UPDATE_CONFIG,
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
      description: "Delete the messages",
      arguments: z.object({
        identifier: z.string().describe("The name of the messages"),
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
      description: "Sync messages state from GCP",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific messages by name (e.g. one discovered by list)",
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
      description: "List messages resources",
      arguments: z.object({
        filter: z.string().describe(
          'Optional. A query filter. You can filter messages by date (`create_time`) and thread (`thread.name`). To filter messages by the date they were created, specify the `create_time` with a timestamp in [RFC-3339](https://www.rfc-editor.org/rfc/rfc3339) format and double quotation marks. For example, `"2023-04-21T11:30:00-04:00"`. You can use the greater than operator `>` to list messages that were created after a timestamp, or the less than operator `<` to list messages that were created before a timestamp. To filter messages within a time interval, use the `AND` operator between two timestamps. To filter by thread, specify the `thread.name`, formatted as `spaces/{space}/threads/{thread}`. You can only specify one `thread.name` per query. To filter by both thread and date, use the `AND` operator in your query. For example, the following queries are valid: ``` create_time > "2012-04-21T11:30:00-04:00" create_time > "2012-04-21T11:30:00-04:00" AND thread.name = spaces/AAAAAAAAAAA/threads/123 create_time > "2012-04-21T11:30:00+00:00" AND create_time < "2013-01-01T00:00:00+00:00" AND thread.name = spaces/AAAAAAAAAAA/threads/123 thread.name = spaces/AAAAAAAAAAA/threads/123 ``` Invalid queries are rejected by the server with an `INVALID_ARGUMENT` error.',
        ).optional(),
        markupSyntax: z.string().describe(
          "Optional. Specifies the desired output syntax for the Chat message `formatted_text` field.",
        ).optional(),
        orderBy: z.string().describe(
          "Optional. How the list of messages is ordered. Specify a value to order by an ordering operation. Valid ordering operation values are as follows: - `ASC` for ascending. - `DESC` for descending. The default ordering is `create_time ASC`.",
        ).optional(),
        pageSize: z.number().describe(
          "Optional. The maximum number of messages returned. The service might return fewer messages than this value. If unspecified, at most 25 are returned. The maximum value is 1000. If you use a value more than 1000, it's automatically changed to 1000. Negative values return an `INVALID_ARGUMENT` error.",
        ).optional(),
        showDeleted: z.boolean().describe(
          "Optional. Whether to include deleted messages. Deleted messages include deleted time and metadata about their deletion, but message content is unavailable.",
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
        if (args["markupSyntax"] !== undefined) {
          params["markupSyntax"] = String(args["markupSyntax"]);
        }
        if (args["orderBy"] !== undefined) {
          params["orderBy"] = String(args["orderBy"]);
        }
        if (args["pageSize"] !== undefined) {
          params["pageSize"] = String(args["pageSize"]);
        }
        if (args["showDeleted"] !== undefined) {
          params["showDeleted"] = String(args["showDeleted"]);
        }
        const { items, nextPageToken } = await listResources(
          baseUrl,
          LIST_CONFIG,
          params,
          "messages",
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
    search: {
      description: "search",
      arguments: z.object({
        filter: z.any().optional(),
        markupSyntax: z.any().optional(),
        orderBy: z.any().optional(),
        pageSize: z.any().optional(),
        pageToken: z.any().optional(),
        view: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["parent"] !== undefined) params["parent"] = String(g["parent"]);
        const body: Record<string, unknown> = {};
        if (args["filter"] !== undefined) body["filter"] = args["filter"];
        if (args["markupSyntax"] !== undefined) {
          body["markupSyntax"] = args["markupSyntax"];
        }
        if (args["orderBy"] !== undefined) body["orderBy"] = args["orderBy"];
        if (args["pageSize"] !== undefined) body["pageSize"] = args["pageSize"];
        if (args["pageToken"] !== undefined) {
          body["pageToken"] = args["pageToken"];
        }
        if (args["view"] !== undefined) body["view"] = args["view"];
        const result = await createResource(
          baseUrl,
          {
            "id": "chat.spaces.messages.search",
            "path": "v1/{+parent}/messages:search",
            "httpMethod": "POST",
            "parameterOrder": ["parent"],
            "parameters": {
              "parent": { "location": "path", "required": true },
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

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

// Auto-generated extension model for @swamp/gcp/compute/firewallpolicies
// Do not edit manually. Re-generate with: deno task generate:gcp

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Google Cloud Compute Engine FirewallPolicies.
 *
 * Represents a Firewall Policy resource.
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

const BASE_URL = "https://compute.googleapis.com/compute/v1/";

const GET_CONFIG = {
  "id": "compute.firewallPolicies.get",
  "path": "locations/global/firewallPolicies/{firewallPolicy}",
  "httpMethod": "GET",
  "parameterOrder": [
    "firewallPolicy",
  ],
  "parameters": {
    "firewallPolicy": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const INSERT_CONFIG = {
  "id": "compute.firewallPolicies.insert",
  "path": "locations/global/firewallPolicies",
  "httpMethod": "POST",
  "parameterOrder": [],
  "parameters": {
    "parentId": {
      "location": "query",
    },
    "requestId": {
      "location": "query",
    },
  },
} as const;

const PATCH_CONFIG = {
  "id": "compute.firewallPolicies.patch",
  "path": "locations/global/firewallPolicies/{firewallPolicy}",
  "httpMethod": "PATCH",
  "parameterOrder": [
    "firewallPolicy",
  ],
  "parameters": {
    "firewallPolicy": {
      "location": "path",
      "required": true,
    },
    "requestId": {
      "location": "query",
    },
  },
} as const;

const DELETE_CONFIG = {
  "id": "compute.firewallPolicies.delete",
  "path": "locations/global/firewallPolicies/{firewallPolicy}",
  "httpMethod": "DELETE",
  "parameterOrder": [
    "firewallPolicy",
  ],
  "parameters": {
    "firewallPolicy": {
      "location": "path",
      "required": true,
    },
    "requestId": {
      "location": "query",
    },
  },
} as const;

const LIST_CONFIG = {
  "id": "compute.firewallPolicies.list",
  "path": "locations/global/firewallPolicies",
  "httpMethod": "GET",
  "parameterOrder": [],
  "parameters": {
    "filter": {
      "location": "query",
    },
    "maxResults": {
      "location": "query",
    },
    "orderBy": {
      "location": "query",
    },
    "pageToken": {
      "location": "query",
    },
    "parentId": {
      "location": "query",
    },
    "returnPartialSuccess": {
      "location": "query",
    },
  },
} as const;

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
  associations: z.array(z.object({
    attachmentTarget: z.string().describe(
      "The target that the firewall policy is attached to.",
    ).optional(),
    displayName: z.string().describe(
      "[Output Only] Deprecated, please use short name instead. The display name of the firewall policy of the association.",
    ).optional(),
    firewallPolicyId: z.string().describe(
      "Output only. [Output Only] The firewall policy ID of the association.",
    ).optional(),
    name: z.string().describe("The name for an association.").optional(),
    priority: z.number().int().describe(
      "An integer indicating the priority of an association. The priority must be a positive value between 1 and 2147483647. Firewall Policies are evaluated from highest to lowest priority where 1 is the highest priority and 2147483647 is the lowest priority. The default value is `1000`. If two associations have the same priority then lexicographical order on association names is applied.",
    ).optional(),
    shortName: z.string().describe(
      "Output only. [Output Only] The short name of the firewall policy of the association.",
    ).optional(),
  })).describe("A list of associations that belong to this firewall policy.")
    .optional(),
  description: z.string().describe(
    "An optional description of this resource. Provide this property when you create the resource.",
  ).optional(),
  fingerprint: z.string().describe(
    "Specifies a fingerprint for this resource, which is essentially a hash of the metadata's contents and used for optimistic locking. The fingerprint is initially generated by Compute Engine and changes after every request to modify or update metadata. You must always provide an up-to-date fingerprint hash in order to update or change metadata, otherwise the request will fail with error412 conditionNotMet. To see the latest fingerprint, make get() request to the firewall policy.",
  ).optional(),
  packetMirroringRules: z.array(z.object({
    action: z.string().describe(
      'The Action to perform when the client connection triggers the rule. Valid actions for firewall rules are: "allow", "deny", "apply_security_profile_group" and "goto_next" ( "apply_security_profile_group" can be specified only for global network firewall policies or hierarchical firewall policies). Valid actions for packet mirroring rules are: "mirror", "do_not_mirror" and "goto_next".',
    ).optional(),
    description: z.string().describe(
      "An optional description for this resource.",
    ).optional(),
    direction: z.enum(["EGRESS", "INGRESS"]).describe(
      "The direction in which this rule applies.",
    ).optional(),
    disabled: z.boolean().describe(
      "Denotes whether the firewall policy rule is disabled. When set to true, the firewall policy rule is not enforced and traffic behaves as if it did not exist. If this is unspecified, the firewall policy rule will be enabled.",
    ).optional(),
    enableLogging: z.boolean().describe(
      'Denotes whether to enable logging for a particular rule. If logging is enabled, logs will be exported to the configured export destination in Stackdriver. Logs may be exported to BigQuery or Pub/Sub. Note: you cannot enable logging on "goto_next" rules.',
    ).optional(),
    kind: z.string().describe(
      "Output only. [Output only] Type of the resource. Returnscompute#firewallPolicyRule for firewall rules andcompute#packetMirroringRule for packet mirroring rules.",
    ).optional(),
    match: z.object({
      destAddressGroups: z.array(z.string()).describe(
        "Address groups which should be matched against the traffic destination. Maximum number of destination address groups is 10.",
      ).optional(),
      destFqdns: z.array(z.string()).describe(
        "Fully Qualified Domain Name (FQDN) which should be matched against traffic destination. Maximum number of destination fqdn allowed is 100.",
      ).optional(),
      destIpRanges: z.array(z.string()).describe(
        "CIDR IP address range. Maximum number of destination CIDR IP ranges allowed is 5000.",
      ).optional(),
      destNetworkContext: z.enum([
        "INTERNET",
        "INTRA_VPC",
        "NON_INTERNET",
        "UNSPECIFIED",
        "VPC_NETWORKS",
      ]).describe(
        "Network context of the traffic destination. Allowed values are: - UNSPECIFIED - INTERNET - NON_INTERNET",
      ).optional(),
      destNetworkType: z.enum([
        "INTERNET",
        "INTRA_VPC",
        "NON_INTERNET",
        "UNSPECIFIED",
        "VPC_NETWORKS",
      ]).describe(
        "Network type of the traffic destination. Allowed values are: - UNSPECIFIED - INTERNET - NON_INTERNET",
      ).optional(),
      destRegionCodes: z.array(z.string()).describe(
        'Region codes whose IP addresses will be used to match for destination of traffic. Should be specified as 2 letter country code defined as per ISO 3166 alpha-2 country codes. ex."US" Maximum number of dest region codes allowed is 5000.',
      ).optional(),
      destThreatIntelligences: z.array(z.string()).describe(
        "Names of Network Threat Intelligence lists. The IPs in these lists will be matched against traffic destination.",
      ).optional(),
      layer4Configs: z.array(z.object({
        ipProtocol: z.unknown().describe(
          "The IP protocol to which this rule applies. The protocol type is required when creating a firewall rule. This value can either be one of the following well known protocol strings (tcp,udp, icmp, esp,ah, ipip, sctp), or the IP protocol number.",
        ).optional(),
        ports: z.unknown().describe(
          'An optional list of ports to which this rule applies. This field is only applicable for UDP or TCP protocol. Each entry must be either an integer or a range. If not specified, this rule applies to connections through any port. Example inputs include: ["22"],["80","443"], and ["12345-12349"].',
        ).optional(),
      })).describe(
        "Pairs of IP protocols and ports that the rule should match.",
      ).optional(),
      srcAddressGroups: z.array(z.string()).describe(
        "Address groups which should be matched against the traffic source. Maximum number of source address groups is 10.",
      ).optional(),
      srcFqdns: z.array(z.string()).describe(
        "Fully Qualified Domain Name (FQDN) which should be matched against traffic source. Maximum number of source fqdn allowed is 100.",
      ).optional(),
      srcIpRanges: z.array(z.string()).describe(
        "CIDR IP address range. Maximum number of source CIDR IP ranges allowed is 5000.",
      ).optional(),
      srcNetworkContext: z.enum([
        "INTERNET",
        "INTRA_VPC",
        "NON_INTERNET",
        "UNSPECIFIED",
        "VPC_NETWORKS",
      ]).describe(
        "Network context of the traffic source. Allowed values are: - UNSPECIFIED - INTERNET - INTRA_VPC - NON_INTERNET - VPC_NETWORKS",
      ).optional(),
      srcNetworkType: z.enum([
        "INTERNET",
        "INTRA_VPC",
        "NON_INTERNET",
        "UNSPECIFIED",
        "VPC_NETWORKS",
      ]).describe(
        "Network type of the traffic source. Allowed values are: - UNSPECIFIED - INTERNET - INTRA_VPC - NON_INTERNET - VPC_NETWORKS",
      ).optional(),
      srcNetworks: z.array(z.string()).describe(
        "Networks of the traffic source. It can be either a full or partial url.",
      ).optional(),
      srcRegionCodes: z.array(z.string()).describe(
        'Region codes whose IP addresses will be used to match for source of traffic. Should be specified as 2 letter country code defined as per ISO 3166 alpha-2 country codes. ex."US" Maximum number of source region codes allowed is 5000.',
      ).optional(),
      srcSecureTags: z.array(z.object({
        name: z.unknown().describe(
          "Name of the secure tag, created with TagManager's TagValue API.",
        ).optional(),
        state: z.unknown().describe(
          "Output only. [Output Only] State of the secure tag, either `EFFECTIVE` or `INEFFECTIVE`. A secure tag is `INEFFECTIVE` when it is deleted or its network is deleted.",
        ).optional(),
      })).describe(
        "List of secure tag values, which should be matched at the source of the traffic. For INGRESS rule, if all the srcSecureTag are INEFFECTIVE, and there is no srcIpRange, this rule will be ignored. Maximum number of source tag values allowed is 256.",
      ).optional(),
      srcThreatIntelligences: z.array(z.string()).describe(
        "Names of Network Threat Intelligence lists. The IPs in these lists will be matched against traffic source.",
      ).optional(),
    }).describe(
      "A match condition that incoming traffic is evaluated against. If it evaluates to true, the corresponding 'action' is enforced.",
    ).optional(),
    priority: z.number().int().describe(
      "An integer indicating the priority of a rule in the list. The priority must be a positive value between 0 and 2147483647. Rules are evaluated from highest to lowest priority where 0 is the highest priority and 2147483647 is the lowest priority.",
    ).optional(),
    ruleName: z.string().describe(
      "An optional name for the rule. This field is not a unique identifier and can be updated.",
    ).optional(),
    ruleTupleCount: z.number().int().describe(
      "Output only. [Output Only] Calculation of the complexity of a single firewall policy rule.",
    ).optional(),
    securityProfileGroup: z.string().describe(
      "A fully-qualified URL of a SecurityProfileGroup resource instance. Example: https://networksecurity.googleapis.com/v1/projects/{project}/locations/{location}/securityProfileGroups/my-security-profile-group Must be specified if action is one of 'apply_security_profile_group' or 'mirror'. Cannot be specified for other actions. Can be specified only for global network firewall policies or hierarchical firewall policies.",
    ).optional(),
    targetForwardingRules: z.array(z.string()).describe(
      "A list of forwarding rules to which this rule applies. This field allows you to control which load balancers get this rule. For example, the following are valid values: - https://www.googleapis.com/compute/v1/projects/project/global/forwardingRules/forwardingRule - https://www.googleapis.com/compute/v1/projects/project/regions/region/forwardingRules/forwardingRule - projects/project/global/ forwardingRules/forwardingRule - projects/project/regions/region/forwardingRules/ forwardingRule",
    ).optional(),
    targetResources: z.array(z.string()).describe(
      "A list of network resource URLs to which this rule applies. This field allows you to control which network's VMs get this rule. If this field is left blank, all VMs within the organization will receive the rule.",
    ).optional(),
    targetSecureTags: z.array(z.object({
      name: z.string().regex(new RegExp("tagValues/[0-9]+")).describe(
        "Name of the secure tag, created with TagManager's TagValue API.",
      ).optional(),
      state: z.enum(["EFFECTIVE", "INEFFECTIVE"]).describe(
        "Output only. [Output Only] State of the secure tag, either `EFFECTIVE` or `INEFFECTIVE`. A secure tag is `INEFFECTIVE` when it is deleted or its network is deleted.",
      ).optional(),
    })).describe(
      "A list of secure tags that controls which instances the firewall rule applies to. If targetSecureTag are specified, then the firewall rule applies only to instances in the VPC network that have one of those EFFECTIVE secure tags, if all the target_secure_tag are in INEFFECTIVE state, then this rule will be ignored.targetSecureTag may not be set at the same time astargetServiceAccounts. If neither targetServiceAccounts nortargetSecureTag are specified, the firewall rule applies to all instances on the specified network. Maximum number of target label tags allowed is 256.",
    ).optional(),
    targetServiceAccounts: z.array(z.string()).describe(
      "A list of service accounts indicating the sets of instances that are applied with this rule.",
    ).optional(),
    targetType: z.enum(["INSTANCES", "INTERNAL_MANAGED_LB"]).describe(
      "Target types of the firewall policy rule. Default value is INSTANCES.",
    ).optional(),
    tlsInspect: z.boolean().describe(
      "Boolean flag indicating if the traffic should be TLS decrypted. Can be set only if action = 'apply_security_profile_group' and cannot be set for other actions.",
    ).optional(),
  })).describe("A list of packet mirroring rules that belong to this policy.")
    .optional(),
  policyType: z.enum(["RDMA_ROCE_POLICY", "ULL_POLICY", "VPC_POLICY"]).describe(
    "The type of the firewall policy. This field can be one of VPC_POLICY, RDMA_ROCE_POLICY or ULL_POLICY. Note: if not specified then VPC_POLICY will be used.",
  ).optional(),
  rules: z.array(z.object({
    action: z.string().describe(
      'The Action to perform when the client connection triggers the rule. Valid actions for firewall rules are: "allow", "deny", "apply_security_profile_group" and "goto_next" ( "apply_security_profile_group" can be specified only for global network firewall policies or hierarchical firewall policies). Valid actions for packet mirroring rules are: "mirror", "do_not_mirror" and "goto_next".',
    ).optional(),
    description: z.string().describe(
      "An optional description for this resource.",
    ).optional(),
    direction: z.enum(["EGRESS", "INGRESS"]).describe(
      "The direction in which this rule applies.",
    ).optional(),
    disabled: z.boolean().describe(
      "Denotes whether the firewall policy rule is disabled. When set to true, the firewall policy rule is not enforced and traffic behaves as if it did not exist. If this is unspecified, the firewall policy rule will be enabled.",
    ).optional(),
    enableLogging: z.boolean().describe(
      'Denotes whether to enable logging for a particular rule. If logging is enabled, logs will be exported to the configured export destination in Stackdriver. Logs may be exported to BigQuery or Pub/Sub. Note: you cannot enable logging on "goto_next" rules.',
    ).optional(),
    kind: z.string().describe(
      "Output only. [Output only] Type of the resource. Returnscompute#firewallPolicyRule for firewall rules andcompute#packetMirroringRule for packet mirroring rules.",
    ).optional(),
    match: z.object({
      destAddressGroups: z.array(z.string()).describe(
        "Address groups which should be matched against the traffic destination. Maximum number of destination address groups is 10.",
      ).optional(),
      destFqdns: z.array(z.string()).describe(
        "Fully Qualified Domain Name (FQDN) which should be matched against traffic destination. Maximum number of destination fqdn allowed is 100.",
      ).optional(),
      destIpRanges: z.array(z.string()).describe(
        "CIDR IP address range. Maximum number of destination CIDR IP ranges allowed is 5000.",
      ).optional(),
      destNetworkContext: z.enum([
        "INTERNET",
        "INTRA_VPC",
        "NON_INTERNET",
        "UNSPECIFIED",
        "VPC_NETWORKS",
      ]).describe(
        "Network context of the traffic destination. Allowed values are: - UNSPECIFIED - INTERNET - NON_INTERNET",
      ).optional(),
      destNetworkType: z.enum([
        "INTERNET",
        "INTRA_VPC",
        "NON_INTERNET",
        "UNSPECIFIED",
        "VPC_NETWORKS",
      ]).describe(
        "Network type of the traffic destination. Allowed values are: - UNSPECIFIED - INTERNET - NON_INTERNET",
      ).optional(),
      destRegionCodes: z.array(z.string()).describe(
        'Region codes whose IP addresses will be used to match for destination of traffic. Should be specified as 2 letter country code defined as per ISO 3166 alpha-2 country codes. ex."US" Maximum number of dest region codes allowed is 5000.',
      ).optional(),
      destThreatIntelligences: z.array(z.string()).describe(
        "Names of Network Threat Intelligence lists. The IPs in these lists will be matched against traffic destination.",
      ).optional(),
      layer4Configs: z.array(z.object({
        ipProtocol: z.unknown().describe(
          "The IP protocol to which this rule applies. The protocol type is required when creating a firewall rule. This value can either be one of the following well known protocol strings (tcp,udp, icmp, esp,ah, ipip, sctp), or the IP protocol number.",
        ).optional(),
        ports: z.unknown().describe(
          'An optional list of ports to which this rule applies. This field is only applicable for UDP or TCP protocol. Each entry must be either an integer or a range. If not specified, this rule applies to connections through any port. Example inputs include: ["22"],["80","443"], and ["12345-12349"].',
        ).optional(),
      })).describe(
        "Pairs of IP protocols and ports that the rule should match.",
      ).optional(),
      srcAddressGroups: z.array(z.string()).describe(
        "Address groups which should be matched against the traffic source. Maximum number of source address groups is 10.",
      ).optional(),
      srcFqdns: z.array(z.string()).describe(
        "Fully Qualified Domain Name (FQDN) which should be matched against traffic source. Maximum number of source fqdn allowed is 100.",
      ).optional(),
      srcIpRanges: z.array(z.string()).describe(
        "CIDR IP address range. Maximum number of source CIDR IP ranges allowed is 5000.",
      ).optional(),
      srcNetworkContext: z.enum([
        "INTERNET",
        "INTRA_VPC",
        "NON_INTERNET",
        "UNSPECIFIED",
        "VPC_NETWORKS",
      ]).describe(
        "Network context of the traffic source. Allowed values are: - UNSPECIFIED - INTERNET - INTRA_VPC - NON_INTERNET - VPC_NETWORKS",
      ).optional(),
      srcNetworkType: z.enum([
        "INTERNET",
        "INTRA_VPC",
        "NON_INTERNET",
        "UNSPECIFIED",
        "VPC_NETWORKS",
      ]).describe(
        "Network type of the traffic source. Allowed values are: - UNSPECIFIED - INTERNET - INTRA_VPC - NON_INTERNET - VPC_NETWORKS",
      ).optional(),
      srcNetworks: z.array(z.string()).describe(
        "Networks of the traffic source. It can be either a full or partial url.",
      ).optional(),
      srcRegionCodes: z.array(z.string()).describe(
        'Region codes whose IP addresses will be used to match for source of traffic. Should be specified as 2 letter country code defined as per ISO 3166 alpha-2 country codes. ex."US" Maximum number of source region codes allowed is 5000.',
      ).optional(),
      srcSecureTags: z.array(z.object({
        name: z.unknown().describe(
          "Name of the secure tag, created with TagManager's TagValue API.",
        ).optional(),
        state: z.unknown().describe(
          "Output only. [Output Only] State of the secure tag, either `EFFECTIVE` or `INEFFECTIVE`. A secure tag is `INEFFECTIVE` when it is deleted or its network is deleted.",
        ).optional(),
      })).describe(
        "List of secure tag values, which should be matched at the source of the traffic. For INGRESS rule, if all the srcSecureTag are INEFFECTIVE, and there is no srcIpRange, this rule will be ignored. Maximum number of source tag values allowed is 256.",
      ).optional(),
      srcThreatIntelligences: z.array(z.string()).describe(
        "Names of Network Threat Intelligence lists. The IPs in these lists will be matched against traffic source.",
      ).optional(),
    }).describe(
      "A match condition that incoming traffic is evaluated against. If it evaluates to true, the corresponding 'action' is enforced.",
    ).optional(),
    priority: z.number().int().describe(
      "An integer indicating the priority of a rule in the list. The priority must be a positive value between 0 and 2147483647. Rules are evaluated from highest to lowest priority where 0 is the highest priority and 2147483647 is the lowest priority.",
    ).optional(),
    ruleName: z.string().describe(
      "An optional name for the rule. This field is not a unique identifier and can be updated.",
    ).optional(),
    ruleTupleCount: z.number().int().describe(
      "Output only. [Output Only] Calculation of the complexity of a single firewall policy rule.",
    ).optional(),
    securityProfileGroup: z.string().describe(
      "A fully-qualified URL of a SecurityProfileGroup resource instance. Example: https://networksecurity.googleapis.com/v1/projects/{project}/locations/{location}/securityProfileGroups/my-security-profile-group Must be specified if action is one of 'apply_security_profile_group' or 'mirror'. Cannot be specified for other actions. Can be specified only for global network firewall policies or hierarchical firewall policies.",
    ).optional(),
    targetForwardingRules: z.array(z.string()).describe(
      "A list of forwarding rules to which this rule applies. This field allows you to control which load balancers get this rule. For example, the following are valid values: - https://www.googleapis.com/compute/v1/projects/project/global/forwardingRules/forwardingRule - https://www.googleapis.com/compute/v1/projects/project/regions/region/forwardingRules/forwardingRule - projects/project/global/ forwardingRules/forwardingRule - projects/project/regions/region/forwardingRules/ forwardingRule",
    ).optional(),
    targetResources: z.array(z.string()).describe(
      "A list of network resource URLs to which this rule applies. This field allows you to control which network's VMs get this rule. If this field is left blank, all VMs within the organization will receive the rule.",
    ).optional(),
    targetSecureTags: z.array(z.object({
      name: z.string().regex(new RegExp("tagValues/[0-9]+")).describe(
        "Name of the secure tag, created with TagManager's TagValue API.",
      ).optional(),
      state: z.enum(["EFFECTIVE", "INEFFECTIVE"]).describe(
        "Output only. [Output Only] State of the secure tag, either `EFFECTIVE` or `INEFFECTIVE`. A secure tag is `INEFFECTIVE` when it is deleted or its network is deleted.",
      ).optional(),
    })).describe(
      "A list of secure tags that controls which instances the firewall rule applies to. If targetSecureTag are specified, then the firewall rule applies only to instances in the VPC network that have one of those EFFECTIVE secure tags, if all the target_secure_tag are in INEFFECTIVE state, then this rule will be ignored.targetSecureTag may not be set at the same time astargetServiceAccounts. If neither targetServiceAccounts nortargetSecureTag are specified, the firewall rule applies to all instances on the specified network. Maximum number of target label tags allowed is 256.",
    ).optional(),
    targetServiceAccounts: z.array(z.string()).describe(
      "A list of service accounts indicating the sets of instances that are applied with this rule.",
    ).optional(),
    targetType: z.enum(["INSTANCES", "INTERNAL_MANAGED_LB"]).describe(
      "Target types of the firewall policy rule. Default value is INSTANCES.",
    ).optional(),
    tlsInspect: z.boolean().describe(
      "Boolean flag indicating if the traffic should be TLS decrypted. Can be set only if action = 'apply_security_profile_group' and cannot be set for other actions.",
    ).optional(),
  })).describe(
    'A list of rules that belong to this policy. There must always be a default rule (rule with priority 2147483647 and match "*"). If no rules are provided when creating a firewall policy, a default rule with action "allow" will be added.',
  ).optional(),
  shortName: z.string().regex(new RegExp("[a-z](?:[-a-z0-9]{0,61}[a-z0-9])?"))
    .describe(
      "User-provided name of the Organization firewall policy. The name should be unique in the organization in which the firewall policy is created. This field is not applicable to network firewall policies. This name must be set on creation and cannot be changed. The name must be 1-63 characters long, and comply with RFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
    ).optional(),
  parentId: z.string().describe(
    'Parent ID for this request. The ID can be either be "folders/[FOLDER_ID]" if the parent is a folder or "organizations/[ORGANIZATION_ID]" if the parent is an organization.',
  ).optional(),
  requestId: z.string().describe(
    "An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).",
  ).optional(),
});

const StateSchema = z.object({
  associations: z.array(z.object({
    attachmentTarget: z.string(),
    displayName: z.string(),
    firewallPolicyId: z.string(),
    name: z.string(),
    priority: z.number(),
    shortName: z.string(),
  })).optional(),
  creationTimestamp: z.string().optional(),
  description: z.string().optional(),
  displayName: z.string().optional(),
  fingerprint: z.string().optional(),
  id: z.string().optional(),
  kind: z.string().optional(),
  name: z.string(),
  packetMirroringRules: z.array(z.object({
    action: z.string(),
    description: z.string(),
    direction: z.string(),
    disabled: z.boolean(),
    enableLogging: z.boolean(),
    kind: z.string(),
    match: z.object({
      destAddressGroups: z.array(z.string()),
      destFqdns: z.array(z.string()),
      destIpRanges: z.array(z.string()),
      destNetworkContext: z.string(),
      destNetworkType: z.string(),
      destRegionCodes: z.array(z.string()),
      destThreatIntelligences: z.array(z.string()),
      layer4Configs: z.array(z.object({
        ipProtocol: z.unknown(),
        ports: z.unknown(),
      })),
      srcAddressGroups: z.array(z.string()),
      srcFqdns: z.array(z.string()),
      srcIpRanges: z.array(z.string()),
      srcNetworkContext: z.string(),
      srcNetworkType: z.string(),
      srcNetworks: z.array(z.string()),
      srcRegionCodes: z.array(z.string()),
      srcSecureTags: z.array(z.object({
        name: z.unknown(),
        state: z.unknown(),
      })),
      srcThreatIntelligences: z.array(z.string()),
    }),
    priority: z.number(),
    ruleName: z.string(),
    ruleTupleCount: z.number(),
    securityProfileGroup: z.string(),
    targetForwardingRules: z.array(z.string()),
    targetResources: z.array(z.string()),
    targetSecureTags: z.array(z.object({
      name: z.string(),
      state: z.string(),
    })),
    targetServiceAccounts: z.array(z.string()),
    targetType: z.string(),
    tlsInspect: z.boolean(),
  })).optional(),
  parent: z.string().optional(),
  policyType: z.string().optional(),
  region: z.string().optional(),
  ruleTupleCount: z.number().optional(),
  rules: z.array(z.object({
    action: z.string(),
    description: z.string(),
    direction: z.string(),
    disabled: z.boolean(),
    enableLogging: z.boolean(),
    kind: z.string(),
    match: z.object({
      destAddressGroups: z.array(z.string()),
      destFqdns: z.array(z.string()),
      destIpRanges: z.array(z.string()),
      destNetworkContext: z.string(),
      destNetworkType: z.string(),
      destRegionCodes: z.array(z.string()),
      destThreatIntelligences: z.array(z.string()),
      layer4Configs: z.array(z.object({
        ipProtocol: z.unknown(),
        ports: z.unknown(),
      })),
      srcAddressGroups: z.array(z.string()),
      srcFqdns: z.array(z.string()),
      srcIpRanges: z.array(z.string()),
      srcNetworkContext: z.string(),
      srcNetworkType: z.string(),
      srcNetworks: z.array(z.string()),
      srcRegionCodes: z.array(z.string()),
      srcSecureTags: z.array(z.object({
        name: z.unknown(),
        state: z.unknown(),
      })),
      srcThreatIntelligences: z.array(z.string()),
    }),
    priority: z.number(),
    ruleName: z.string(),
    ruleTupleCount: z.number(),
    securityProfileGroup: z.string(),
    targetForwardingRules: z.array(z.string()),
    targetResources: z.array(z.string()),
    targetSecureTags: z.array(z.object({
      name: z.string(),
      state: z.string(),
    })),
    targetServiceAccounts: z.array(z.string()),
    targetType: z.string(),
    tlsInspect: z.boolean(),
  })).optional(),
  selfLink: z.string().optional(),
  selfLinkWithId: z.string().optional(),
  shortName: z.string().optional(),
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
  associations: z.array(z.object({
    attachmentTarget: z.string().describe(
      "The target that the firewall policy is attached to.",
    ).optional(),
    displayName: z.string().describe(
      "[Output Only] Deprecated, please use short name instead. The display name of the firewall policy of the association.",
    ).optional(),
    firewallPolicyId: z.string().describe(
      "Output only. [Output Only] The firewall policy ID of the association.",
    ).optional(),
    name: z.string().describe("The name for an association.").optional(),
    priority: z.number().int().describe(
      "An integer indicating the priority of an association. The priority must be a positive value between 1 and 2147483647. Firewall Policies are evaluated from highest to lowest priority where 1 is the highest priority and 2147483647 is the lowest priority. The default value is `1000`. If two associations have the same priority then lexicographical order on association names is applied.",
    ).optional(),
    shortName: z.string().describe(
      "Output only. [Output Only] The short name of the firewall policy of the association.",
    ).optional(),
  })).describe("A list of associations that belong to this firewall policy.")
    .optional(),
  description: z.string().describe(
    "An optional description of this resource. Provide this property when you create the resource.",
  ).optional(),
  fingerprint: z.string().describe(
    "Specifies a fingerprint for this resource, which is essentially a hash of the metadata's contents and used for optimistic locking. The fingerprint is initially generated by Compute Engine and changes after every request to modify or update metadata. You must always provide an up-to-date fingerprint hash in order to update or change metadata, otherwise the request will fail with error412 conditionNotMet. To see the latest fingerprint, make get() request to the firewall policy.",
  ).optional(),
  packetMirroringRules: z.array(z.object({
    action: z.string().describe(
      'The Action to perform when the client connection triggers the rule. Valid actions for firewall rules are: "allow", "deny", "apply_security_profile_group" and "goto_next" ( "apply_security_profile_group" can be specified only for global network firewall policies or hierarchical firewall policies). Valid actions for packet mirroring rules are: "mirror", "do_not_mirror" and "goto_next".',
    ).optional(),
    description: z.string().describe(
      "An optional description for this resource.",
    ).optional(),
    direction: z.enum(["EGRESS", "INGRESS"]).describe(
      "The direction in which this rule applies.",
    ).optional(),
    disabled: z.boolean().describe(
      "Denotes whether the firewall policy rule is disabled. When set to true, the firewall policy rule is not enforced and traffic behaves as if it did not exist. If this is unspecified, the firewall policy rule will be enabled.",
    ).optional(),
    enableLogging: z.boolean().describe(
      'Denotes whether to enable logging for a particular rule. If logging is enabled, logs will be exported to the configured export destination in Stackdriver. Logs may be exported to BigQuery or Pub/Sub. Note: you cannot enable logging on "goto_next" rules.',
    ).optional(),
    kind: z.string().describe(
      "Output only. [Output only] Type of the resource. Returnscompute#firewallPolicyRule for firewall rules andcompute#packetMirroringRule for packet mirroring rules.",
    ).optional(),
    match: z.object({
      destAddressGroups: z.array(z.string()).describe(
        "Address groups which should be matched against the traffic destination. Maximum number of destination address groups is 10.",
      ).optional(),
      destFqdns: z.array(z.string()).describe(
        "Fully Qualified Domain Name (FQDN) which should be matched against traffic destination. Maximum number of destination fqdn allowed is 100.",
      ).optional(),
      destIpRanges: z.array(z.string()).describe(
        "CIDR IP address range. Maximum number of destination CIDR IP ranges allowed is 5000.",
      ).optional(),
      destNetworkContext: z.enum([
        "INTERNET",
        "INTRA_VPC",
        "NON_INTERNET",
        "UNSPECIFIED",
        "VPC_NETWORKS",
      ]).describe(
        "Network context of the traffic destination. Allowed values are: - UNSPECIFIED - INTERNET - NON_INTERNET",
      ).optional(),
      destNetworkType: z.enum([
        "INTERNET",
        "INTRA_VPC",
        "NON_INTERNET",
        "UNSPECIFIED",
        "VPC_NETWORKS",
      ]).describe(
        "Network type of the traffic destination. Allowed values are: - UNSPECIFIED - INTERNET - NON_INTERNET",
      ).optional(),
      destRegionCodes: z.array(z.string()).describe(
        'Region codes whose IP addresses will be used to match for destination of traffic. Should be specified as 2 letter country code defined as per ISO 3166 alpha-2 country codes. ex."US" Maximum number of dest region codes allowed is 5000.',
      ).optional(),
      destThreatIntelligences: z.array(z.string()).describe(
        "Names of Network Threat Intelligence lists. The IPs in these lists will be matched against traffic destination.",
      ).optional(),
      layer4Configs: z.array(z.object({
        ipProtocol: z.unknown().describe(
          "The IP protocol to which this rule applies. The protocol type is required when creating a firewall rule. This value can either be one of the following well known protocol strings (tcp,udp, icmp, esp,ah, ipip, sctp), or the IP protocol number.",
        ).optional(),
        ports: z.unknown().describe(
          'An optional list of ports to which this rule applies. This field is only applicable for UDP or TCP protocol. Each entry must be either an integer or a range. If not specified, this rule applies to connections through any port. Example inputs include: ["22"],["80","443"], and ["12345-12349"].',
        ).optional(),
      })).describe(
        "Pairs of IP protocols and ports that the rule should match.",
      ).optional(),
      srcAddressGroups: z.array(z.string()).describe(
        "Address groups which should be matched against the traffic source. Maximum number of source address groups is 10.",
      ).optional(),
      srcFqdns: z.array(z.string()).describe(
        "Fully Qualified Domain Name (FQDN) which should be matched against traffic source. Maximum number of source fqdn allowed is 100.",
      ).optional(),
      srcIpRanges: z.array(z.string()).describe(
        "CIDR IP address range. Maximum number of source CIDR IP ranges allowed is 5000.",
      ).optional(),
      srcNetworkContext: z.enum([
        "INTERNET",
        "INTRA_VPC",
        "NON_INTERNET",
        "UNSPECIFIED",
        "VPC_NETWORKS",
      ]).describe(
        "Network context of the traffic source. Allowed values are: - UNSPECIFIED - INTERNET - INTRA_VPC - NON_INTERNET - VPC_NETWORKS",
      ).optional(),
      srcNetworkType: z.enum([
        "INTERNET",
        "INTRA_VPC",
        "NON_INTERNET",
        "UNSPECIFIED",
        "VPC_NETWORKS",
      ]).describe(
        "Network type of the traffic source. Allowed values are: - UNSPECIFIED - INTERNET - INTRA_VPC - NON_INTERNET - VPC_NETWORKS",
      ).optional(),
      srcNetworks: z.array(z.string()).describe(
        "Networks of the traffic source. It can be either a full or partial url.",
      ).optional(),
      srcRegionCodes: z.array(z.string()).describe(
        'Region codes whose IP addresses will be used to match for source of traffic. Should be specified as 2 letter country code defined as per ISO 3166 alpha-2 country codes. ex."US" Maximum number of source region codes allowed is 5000.',
      ).optional(),
      srcSecureTags: z.array(z.object({
        name: z.unknown().describe(
          "Name of the secure tag, created with TagManager's TagValue API.",
        ).optional(),
        state: z.unknown().describe(
          "Output only. [Output Only] State of the secure tag, either `EFFECTIVE` or `INEFFECTIVE`. A secure tag is `INEFFECTIVE` when it is deleted or its network is deleted.",
        ).optional(),
      })).describe(
        "List of secure tag values, which should be matched at the source of the traffic. For INGRESS rule, if all the srcSecureTag are INEFFECTIVE, and there is no srcIpRange, this rule will be ignored. Maximum number of source tag values allowed is 256.",
      ).optional(),
      srcThreatIntelligences: z.array(z.string()).describe(
        "Names of Network Threat Intelligence lists. The IPs in these lists will be matched against traffic source.",
      ).optional(),
    }).describe(
      "A match condition that incoming traffic is evaluated against. If it evaluates to true, the corresponding 'action' is enforced.",
    ).optional(),
    priority: z.number().int().describe(
      "An integer indicating the priority of a rule in the list. The priority must be a positive value between 0 and 2147483647. Rules are evaluated from highest to lowest priority where 0 is the highest priority and 2147483647 is the lowest priority.",
    ).optional(),
    ruleName: z.string().describe(
      "An optional name for the rule. This field is not a unique identifier and can be updated.",
    ).optional(),
    ruleTupleCount: z.number().int().describe(
      "Output only. [Output Only] Calculation of the complexity of a single firewall policy rule.",
    ).optional(),
    securityProfileGroup: z.string().describe(
      "A fully-qualified URL of a SecurityProfileGroup resource instance. Example: https://networksecurity.googleapis.com/v1/projects/{project}/locations/{location}/securityProfileGroups/my-security-profile-group Must be specified if action is one of 'apply_security_profile_group' or 'mirror'. Cannot be specified for other actions. Can be specified only for global network firewall policies or hierarchical firewall policies.",
    ).optional(),
    targetForwardingRules: z.array(z.string()).describe(
      "A list of forwarding rules to which this rule applies. This field allows you to control which load balancers get this rule. For example, the following are valid values: - https://www.googleapis.com/compute/v1/projects/project/global/forwardingRules/forwardingRule - https://www.googleapis.com/compute/v1/projects/project/regions/region/forwardingRules/forwardingRule - projects/project/global/ forwardingRules/forwardingRule - projects/project/regions/region/forwardingRules/ forwardingRule",
    ).optional(),
    targetResources: z.array(z.string()).describe(
      "A list of network resource URLs to which this rule applies. This field allows you to control which network's VMs get this rule. If this field is left blank, all VMs within the organization will receive the rule.",
    ).optional(),
    targetSecureTags: z.array(z.object({
      name: z.string().regex(new RegExp("tagValues/[0-9]+")).describe(
        "Name of the secure tag, created with TagManager's TagValue API.",
      ).optional(),
      state: z.enum(["EFFECTIVE", "INEFFECTIVE"]).describe(
        "Output only. [Output Only] State of the secure tag, either `EFFECTIVE` or `INEFFECTIVE`. A secure tag is `INEFFECTIVE` when it is deleted or its network is deleted.",
      ).optional(),
    })).describe(
      "A list of secure tags that controls which instances the firewall rule applies to. If targetSecureTag are specified, then the firewall rule applies only to instances in the VPC network that have one of those EFFECTIVE secure tags, if all the target_secure_tag are in INEFFECTIVE state, then this rule will be ignored.targetSecureTag may not be set at the same time astargetServiceAccounts. If neither targetServiceAccounts nortargetSecureTag are specified, the firewall rule applies to all instances on the specified network. Maximum number of target label tags allowed is 256.",
    ).optional(),
    targetServiceAccounts: z.array(z.string()).describe(
      "A list of service accounts indicating the sets of instances that are applied with this rule.",
    ).optional(),
    targetType: z.enum(["INSTANCES", "INTERNAL_MANAGED_LB"]).describe(
      "Target types of the firewall policy rule. Default value is INSTANCES.",
    ).optional(),
    tlsInspect: z.boolean().describe(
      "Boolean flag indicating if the traffic should be TLS decrypted. Can be set only if action = 'apply_security_profile_group' and cannot be set for other actions.",
    ).optional(),
  })).describe("A list of packet mirroring rules that belong to this policy.")
    .optional(),
  policyType: z.enum(["RDMA_ROCE_POLICY", "ULL_POLICY", "VPC_POLICY"]).describe(
    "The type of the firewall policy. This field can be one of VPC_POLICY, RDMA_ROCE_POLICY or ULL_POLICY. Note: if not specified then VPC_POLICY will be used.",
  ).optional(),
  rules: z.array(z.object({
    action: z.string().describe(
      'The Action to perform when the client connection triggers the rule. Valid actions for firewall rules are: "allow", "deny", "apply_security_profile_group" and "goto_next" ( "apply_security_profile_group" can be specified only for global network firewall policies or hierarchical firewall policies). Valid actions for packet mirroring rules are: "mirror", "do_not_mirror" and "goto_next".',
    ).optional(),
    description: z.string().describe(
      "An optional description for this resource.",
    ).optional(),
    direction: z.enum(["EGRESS", "INGRESS"]).describe(
      "The direction in which this rule applies.",
    ).optional(),
    disabled: z.boolean().describe(
      "Denotes whether the firewall policy rule is disabled. When set to true, the firewall policy rule is not enforced and traffic behaves as if it did not exist. If this is unspecified, the firewall policy rule will be enabled.",
    ).optional(),
    enableLogging: z.boolean().describe(
      'Denotes whether to enable logging for a particular rule. If logging is enabled, logs will be exported to the configured export destination in Stackdriver. Logs may be exported to BigQuery or Pub/Sub. Note: you cannot enable logging on "goto_next" rules.',
    ).optional(),
    kind: z.string().describe(
      "Output only. [Output only] Type of the resource. Returnscompute#firewallPolicyRule for firewall rules andcompute#packetMirroringRule for packet mirroring rules.",
    ).optional(),
    match: z.object({
      destAddressGroups: z.array(z.string()).describe(
        "Address groups which should be matched against the traffic destination. Maximum number of destination address groups is 10.",
      ).optional(),
      destFqdns: z.array(z.string()).describe(
        "Fully Qualified Domain Name (FQDN) which should be matched against traffic destination. Maximum number of destination fqdn allowed is 100.",
      ).optional(),
      destIpRanges: z.array(z.string()).describe(
        "CIDR IP address range. Maximum number of destination CIDR IP ranges allowed is 5000.",
      ).optional(),
      destNetworkContext: z.enum([
        "INTERNET",
        "INTRA_VPC",
        "NON_INTERNET",
        "UNSPECIFIED",
        "VPC_NETWORKS",
      ]).describe(
        "Network context of the traffic destination. Allowed values are: - UNSPECIFIED - INTERNET - NON_INTERNET",
      ).optional(),
      destNetworkType: z.enum([
        "INTERNET",
        "INTRA_VPC",
        "NON_INTERNET",
        "UNSPECIFIED",
        "VPC_NETWORKS",
      ]).describe(
        "Network type of the traffic destination. Allowed values are: - UNSPECIFIED - INTERNET - NON_INTERNET",
      ).optional(),
      destRegionCodes: z.array(z.string()).describe(
        'Region codes whose IP addresses will be used to match for destination of traffic. Should be specified as 2 letter country code defined as per ISO 3166 alpha-2 country codes. ex."US" Maximum number of dest region codes allowed is 5000.',
      ).optional(),
      destThreatIntelligences: z.array(z.string()).describe(
        "Names of Network Threat Intelligence lists. The IPs in these lists will be matched against traffic destination.",
      ).optional(),
      layer4Configs: z.array(z.object({
        ipProtocol: z.unknown().describe(
          "The IP protocol to which this rule applies. The protocol type is required when creating a firewall rule. This value can either be one of the following well known protocol strings (tcp,udp, icmp, esp,ah, ipip, sctp), or the IP protocol number.",
        ).optional(),
        ports: z.unknown().describe(
          'An optional list of ports to which this rule applies. This field is only applicable for UDP or TCP protocol. Each entry must be either an integer or a range. If not specified, this rule applies to connections through any port. Example inputs include: ["22"],["80","443"], and ["12345-12349"].',
        ).optional(),
      })).describe(
        "Pairs of IP protocols and ports that the rule should match.",
      ).optional(),
      srcAddressGroups: z.array(z.string()).describe(
        "Address groups which should be matched against the traffic source. Maximum number of source address groups is 10.",
      ).optional(),
      srcFqdns: z.array(z.string()).describe(
        "Fully Qualified Domain Name (FQDN) which should be matched against traffic source. Maximum number of source fqdn allowed is 100.",
      ).optional(),
      srcIpRanges: z.array(z.string()).describe(
        "CIDR IP address range. Maximum number of source CIDR IP ranges allowed is 5000.",
      ).optional(),
      srcNetworkContext: z.enum([
        "INTERNET",
        "INTRA_VPC",
        "NON_INTERNET",
        "UNSPECIFIED",
        "VPC_NETWORKS",
      ]).describe(
        "Network context of the traffic source. Allowed values are: - UNSPECIFIED - INTERNET - INTRA_VPC - NON_INTERNET - VPC_NETWORKS",
      ).optional(),
      srcNetworkType: z.enum([
        "INTERNET",
        "INTRA_VPC",
        "NON_INTERNET",
        "UNSPECIFIED",
        "VPC_NETWORKS",
      ]).describe(
        "Network type of the traffic source. Allowed values are: - UNSPECIFIED - INTERNET - INTRA_VPC - NON_INTERNET - VPC_NETWORKS",
      ).optional(),
      srcNetworks: z.array(z.string()).describe(
        "Networks of the traffic source. It can be either a full or partial url.",
      ).optional(),
      srcRegionCodes: z.array(z.string()).describe(
        'Region codes whose IP addresses will be used to match for source of traffic. Should be specified as 2 letter country code defined as per ISO 3166 alpha-2 country codes. ex."US" Maximum number of source region codes allowed is 5000.',
      ).optional(),
      srcSecureTags: z.array(z.object({
        name: z.unknown().describe(
          "Name of the secure tag, created with TagManager's TagValue API.",
        ).optional(),
        state: z.unknown().describe(
          "Output only. [Output Only] State of the secure tag, either `EFFECTIVE` or `INEFFECTIVE`. A secure tag is `INEFFECTIVE` when it is deleted or its network is deleted.",
        ).optional(),
      })).describe(
        "List of secure tag values, which should be matched at the source of the traffic. For INGRESS rule, if all the srcSecureTag are INEFFECTIVE, and there is no srcIpRange, this rule will be ignored. Maximum number of source tag values allowed is 256.",
      ).optional(),
      srcThreatIntelligences: z.array(z.string()).describe(
        "Names of Network Threat Intelligence lists. The IPs in these lists will be matched against traffic source.",
      ).optional(),
    }).describe(
      "A match condition that incoming traffic is evaluated against. If it evaluates to true, the corresponding 'action' is enforced.",
    ).optional(),
    priority: z.number().int().describe(
      "An integer indicating the priority of a rule in the list. The priority must be a positive value between 0 and 2147483647. Rules are evaluated from highest to lowest priority where 0 is the highest priority and 2147483647 is the lowest priority.",
    ).optional(),
    ruleName: z.string().describe(
      "An optional name for the rule. This field is not a unique identifier and can be updated.",
    ).optional(),
    ruleTupleCount: z.number().int().describe(
      "Output only. [Output Only] Calculation of the complexity of a single firewall policy rule.",
    ).optional(),
    securityProfileGroup: z.string().describe(
      "A fully-qualified URL of a SecurityProfileGroup resource instance. Example: https://networksecurity.googleapis.com/v1/projects/{project}/locations/{location}/securityProfileGroups/my-security-profile-group Must be specified if action is one of 'apply_security_profile_group' or 'mirror'. Cannot be specified for other actions. Can be specified only for global network firewall policies or hierarchical firewall policies.",
    ).optional(),
    targetForwardingRules: z.array(z.string()).describe(
      "A list of forwarding rules to which this rule applies. This field allows you to control which load balancers get this rule. For example, the following are valid values: - https://www.googleapis.com/compute/v1/projects/project/global/forwardingRules/forwardingRule - https://www.googleapis.com/compute/v1/projects/project/regions/region/forwardingRules/forwardingRule - projects/project/global/ forwardingRules/forwardingRule - projects/project/regions/region/forwardingRules/ forwardingRule",
    ).optional(),
    targetResources: z.array(z.string()).describe(
      "A list of network resource URLs to which this rule applies. This field allows you to control which network's VMs get this rule. If this field is left blank, all VMs within the organization will receive the rule.",
    ).optional(),
    targetSecureTags: z.array(z.object({
      name: z.string().regex(new RegExp("tagValues/[0-9]+")).describe(
        "Name of the secure tag, created with TagManager's TagValue API.",
      ).optional(),
      state: z.enum(["EFFECTIVE", "INEFFECTIVE"]).describe(
        "Output only. [Output Only] State of the secure tag, either `EFFECTIVE` or `INEFFECTIVE`. A secure tag is `INEFFECTIVE` when it is deleted or its network is deleted.",
      ).optional(),
    })).describe(
      "A list of secure tags that controls which instances the firewall rule applies to. If targetSecureTag are specified, then the firewall rule applies only to instances in the VPC network that have one of those EFFECTIVE secure tags, if all the target_secure_tag are in INEFFECTIVE state, then this rule will be ignored.targetSecureTag may not be set at the same time astargetServiceAccounts. If neither targetServiceAccounts nortargetSecureTag are specified, the firewall rule applies to all instances on the specified network. Maximum number of target label tags allowed is 256.",
    ).optional(),
    targetServiceAccounts: z.array(z.string()).describe(
      "A list of service accounts indicating the sets of instances that are applied with this rule.",
    ).optional(),
    targetType: z.enum(["INSTANCES", "INTERNAL_MANAGED_LB"]).describe(
      "Target types of the firewall policy rule. Default value is INSTANCES.",
    ).optional(),
    tlsInspect: z.boolean().describe(
      "Boolean flag indicating if the traffic should be TLS decrypted. Can be set only if action = 'apply_security_profile_group' and cannot be set for other actions.",
    ).optional(),
  })).describe(
    'A list of rules that belong to this policy. There must always be a default rule (rule with priority 2147483647 and match "*"). If no rules are provided when creating a firewall policy, a default rule with action "allow" will be added.',
  ).optional(),
  shortName: z.string().regex(new RegExp("[a-z](?:[-a-z0-9]{0,61}[a-z0-9])?"))
    .describe(
      "User-provided name of the Organization firewall policy. The name should be unique in the organization in which the firewall policy is created. This field is not applicable to network firewall policies. This name must be set on creation and cannot be changed. The name must be 1-63 characters long, and comply with RFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
    ).optional(),
  parentId: z.string().describe(
    'Parent ID for this request. The ID can be either be "folders/[FOLDER_ID]" if the parent is a folder or "organizations/[ORGANIZATION_ID]" if the parent is an organization.',
  ).optional(),
  requestId: z.string().describe(
    "An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).",
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

/** Swamp extension model for Google Cloud Compute Engine FirewallPolicies. Registered at `@swamp/gcp/compute/firewallpolicies`. */
export const model = {
  type: "@swamp/gcp/compute/firewallpolicies",
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
      toVersion: "2026.04.23.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.01.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.04.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.09.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.15.1",
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
      toVersion: "2026.05.27.1",
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
      toVersion: "2026.07.04.1",
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
      description: "Represents a Firewall Policy resource.",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a firewallPolicies",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        const body: Record<string, unknown> = {};
        if (g["associations"] !== undefined) {
          body["associations"] = g["associations"];
        }
        if (g["description"] !== undefined) {
          body["description"] = g["description"];
        }
        if (g["fingerprint"] !== undefined) {
          body["fingerprint"] = g["fingerprint"];
        }
        if (g["packetMirroringRules"] !== undefined) {
          body["packetMirroringRules"] = g["packetMirroringRules"];
        }
        if (g["policyType"] !== undefined) body["policyType"] = g["policyType"];
        if (g["rules"] !== undefined) body["rules"] = g["rules"];
        if (g["shortName"] !== undefined) body["shortName"] = g["shortName"];
        if (g["parentId"] !== undefined) {
          params["parentId"] = String(g["parentId"]);
        }
        if (g["requestId"] !== undefined) {
          params["requestId"] = String(g["requestId"]);
        }
        if (g["name"] !== undefined) {
          params["firewallPolicy"] = String(g["name"]);
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
            listParams: {},
            matchField: "shortName",
            matchValue: String(g["shortName"] ?? ""),
          },
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
      description: "Get a firewallPolicies",
      arguments: z.object({
        identifier: z.string().describe("The name of the firewallPolicies"),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        params["firewallPolicy"] = args.identifier;
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
      description: "Update firewallPolicies attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific firewallPolicies by name (e.g. one discovered by list)",
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
        params["firewallPolicy"] = existing["name"]?.toString() ?? "";
        const body: Record<string, unknown> = {};
        if (g["associations"] !== undefined) {
          body["associations"] = g["associations"];
        }
        if (g["description"] !== undefined) {
          body["description"] = g["description"];
        }
        if (g["fingerprint"] !== undefined) {
          body["fingerprint"] = g["fingerprint"];
        }
        if (g["packetMirroringRules"] !== undefined) {
          body["packetMirroringRules"] = g["packetMirroringRules"];
        }
        if (g["policyType"] !== undefined) body["policyType"] = g["policyType"];
        if (g["rules"] !== undefined) body["rules"] = g["rules"];
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
      description: "Delete the firewallPolicies",
      arguments: z.object({
        identifier: z.string().describe("The name of the firewallPolicies"),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        params["firewallPolicy"] = args.identifier;
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
      description: "Sync firewallPolicies state from GCP",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific firewallPolicies by name (e.g. one discovered by list)",
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
          params["firewallPolicy"] = identifier;
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
      description: "List firewallPolicies resources",
      arguments: z.object({
        filter: z.string().describe(
          "A filter expression that filters resources listed in the response. Most",
        ).optional(),
        maxResults: z.number().describe(
          "The maximum number of results per page that should be returned.",
        ).optional(),
        orderBy: z.string().describe(
          "Sorts list results by a certain order. By default, results",
        ).optional(),
        parentId: z.string().describe(
          'Parent ID for this request. The ID can be either be "folders/[FOLDER_ID]"',
        ).optional(),
        returnPartialSuccess: z.boolean().describe(
          "Opt-in for partial success behavior which provides partial results in case",
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
        if (args["maxResults"] !== undefined) {
          params["maxResults"] = String(args["maxResults"]);
        }
        if (args["orderBy"] !== undefined) {
          params["orderBy"] = String(args["orderBy"]);
        }
        if (args["parentId"] !== undefined) {
          params["parentId"] = String(args["parentId"]);
        }
        if (args["returnPartialSuccess"] !== undefined) {
          params["returnPartialSuccess"] = String(args["returnPartialSuccess"]);
        }
        const { items, nextPageToken } = await listResources(
          baseUrl,
          LIST_CONFIG,
          params,
          "items",
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
    add_association: {
      description: "add association",
      arguments: z.object({
        attachmentTarget: z.any().optional(),
        displayName: z.any().optional(),
        firewallPolicyId: z.any().optional(),
        name: z.any().optional(),
        priority: z.any().optional(),
        shortName: z.any().optional(),
        replaceExistingAssociation: z.any().optional(),
        requestId: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        const content = await context.dataRepository.getContent(
          context.modelType,
          context.modelId,
          (g.name?.toString() ?? "current").replace(/[\/\\]/g, "_").replace(
            /\.\./g,
            "_",
          ).replace(/\0/g, ""),
        );
        if (!content) {
          throw new Error("No existing state found - run create or get first");
        }
        const existing = JSON.parse(new TextDecoder().decode(content));
        params["firewallPolicy"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["replaceExistingAssociation"] !== undefined) {
          params["replaceExistingAssociation"] = String(
            args["replaceExistingAssociation"],
          );
        }
        if (args["requestId"] !== undefined) {
          params["requestId"] = String(args["requestId"]);
        }
        const body: Record<string, unknown> = {};
        if (args["attachmentTarget"] !== undefined) {
          body["attachmentTarget"] = args["attachmentTarget"];
        }
        if (args["displayName"] !== undefined) {
          body["displayName"] = args["displayName"];
        }
        if (args["firewallPolicyId"] !== undefined) {
          body["firewallPolicyId"] = args["firewallPolicyId"];
        }
        if (args["name"] !== undefined) body["name"] = args["name"];
        if (args["priority"] !== undefined) body["priority"] = args["priority"];
        if (args["shortName"] !== undefined) {
          body["shortName"] = args["shortName"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "compute.firewallPolicies.addAssociation",
            "path":
              "locations/global/firewallPolicies/{firewallPolicy}/addAssociation",
            "httpMethod": "POST",
            "parameterOrder": ["firewallPolicy"],
            "parameters": {
              "firewallPolicy": { "location": "path", "required": true },
              "replaceExistingAssociation": { "location": "query" },
              "requestId": { "location": "query" },
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
    add_rule: {
      description: "add rule",
      arguments: z.object({
        action: z.any().optional(),
        description: z.any().optional(),
        direction: z.any().optional(),
        disabled: z.any().optional(),
        enableLogging: z.any().optional(),
        kind: z.any().optional(),
        match: z.any().optional(),
        priority: z.any().optional(),
        ruleName: z.any().optional(),
        ruleTupleCount: z.any().optional(),
        securityProfileGroup: z.any().optional(),
        targetForwardingRules: z.any().optional(),
        targetResources: z.any().optional(),
        targetSecureTags: z.any().optional(),
        targetServiceAccounts: z.any().optional(),
        targetType: z.any().optional(),
        tlsInspect: z.any().optional(),
        requestId: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        const content = await context.dataRepository.getContent(
          context.modelType,
          context.modelId,
          (g.name?.toString() ?? "current").replace(/[\/\\]/g, "_").replace(
            /\.\./g,
            "_",
          ).replace(/\0/g, ""),
        );
        if (!content) {
          throw new Error("No existing state found - run create or get first");
        }
        const existing = JSON.parse(new TextDecoder().decode(content));
        params["firewallPolicy"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["requestId"] !== undefined) {
          params["requestId"] = String(args["requestId"]);
        }
        const body: Record<string, unknown> = {};
        if (args["action"] !== undefined) body["action"] = args["action"];
        if (args["description"] !== undefined) {
          body["description"] = args["description"];
        }
        if (args["direction"] !== undefined) {
          body["direction"] = args["direction"];
        }
        if (args["disabled"] !== undefined) body["disabled"] = args["disabled"];
        if (args["enableLogging"] !== undefined) {
          body["enableLogging"] = args["enableLogging"];
        }
        if (args["kind"] !== undefined) body["kind"] = args["kind"];
        if (args["match"] !== undefined) body["match"] = args["match"];
        if (args["priority"] !== undefined) body["priority"] = args["priority"];
        if (args["ruleName"] !== undefined) body["ruleName"] = args["ruleName"];
        if (args["ruleTupleCount"] !== undefined) {
          body["ruleTupleCount"] = args["ruleTupleCount"];
        }
        if (args["securityProfileGroup"] !== undefined) {
          body["securityProfileGroup"] = args["securityProfileGroup"];
        }
        if (args["targetForwardingRules"] !== undefined) {
          body["targetForwardingRules"] = args["targetForwardingRules"];
        }
        if (args["targetResources"] !== undefined) {
          body["targetResources"] = args["targetResources"];
        }
        if (args["targetSecureTags"] !== undefined) {
          body["targetSecureTags"] = args["targetSecureTags"];
        }
        if (args["targetServiceAccounts"] !== undefined) {
          body["targetServiceAccounts"] = args["targetServiceAccounts"];
        }
        if (args["targetType"] !== undefined) {
          body["targetType"] = args["targetType"];
        }
        if (args["tlsInspect"] !== undefined) {
          body["tlsInspect"] = args["tlsInspect"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "compute.firewallPolicies.addRule",
            "path":
              "locations/global/firewallPolicies/{firewallPolicy}/addRule",
            "httpMethod": "POST",
            "parameterOrder": ["firewallPolicy"],
            "parameters": {
              "firewallPolicy": { "location": "path", "required": true },
              "requestId": { "location": "query" },
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
    clone_rules: {
      description: "clone rules",
      arguments: z.object({
        requestId: z.any().optional(),
        sourceFirewallPolicy: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        const content = await context.dataRepository.getContent(
          context.modelType,
          context.modelId,
          (g.name?.toString() ?? "current").replace(/[\/\\]/g, "_").replace(
            /\.\./g,
            "_",
          ).replace(/\0/g, ""),
        );
        if (!content) {
          throw new Error("No existing state found - run create or get first");
        }
        const existing = JSON.parse(new TextDecoder().decode(content));
        params["firewallPolicy"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["requestId"] !== undefined) {
          params["requestId"] = String(args["requestId"]);
        }
        if (args["sourceFirewallPolicy"] !== undefined) {
          params["sourceFirewallPolicy"] = String(args["sourceFirewallPolicy"]);
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "compute.firewallPolicies.cloneRules",
            "path":
              "locations/global/firewallPolicies/{firewallPolicy}/cloneRules",
            "httpMethod": "POST",
            "parameterOrder": ["firewallPolicy"],
            "parameters": {
              "firewallPolicy": { "location": "path", "required": true },
              "requestId": { "location": "query" },
              "sourceFirewallPolicy": { "location": "query" },
            },
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
    get_association: {
      description: "get association",
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
        const content = await context.dataRepository.getContent(
          context.modelType,
          context.modelId,
          (g.name?.toString() ?? "current").replace(/[\/\\]/g, "_").replace(
            /\.\./g,
            "_",
          ).replace(/\0/g, ""),
        );
        if (!content) {
          throw new Error("No existing state found - run create or get first");
        }
        const existing = JSON.parse(new TextDecoder().decode(content));
        params["firewallPolicy"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["name"] !== undefined) params["name"] = String(args["name"]);
        const result = await createResource(
          baseUrl,
          {
            "id": "compute.firewallPolicies.getAssociation",
            "path":
              "locations/global/firewallPolicies/{firewallPolicy}/getAssociation",
            "httpMethod": "GET",
            "parameterOrder": ["firewallPolicy"],
            "parameters": {
              "firewallPolicy": { "location": "path", "required": true },
              "name": { "location": "query" },
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
    get_iam_policy: {
      description: "get iam policy",
      arguments: z.object({
        optionsRequestedPolicyVersion: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        const content = await context.dataRepository.getContent(
          context.modelType,
          context.modelId,
          (g.name?.toString() ?? "current").replace(/[\/\\]/g, "_").replace(
            /\.\./g,
            "_",
          ).replace(/\0/g, ""),
        );
        if (!content) {
          throw new Error("No existing state found - run create or get first");
        }
        const existing = JSON.parse(new TextDecoder().decode(content));
        params["resource"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["optionsRequestedPolicyVersion"] !== undefined) {
          params["optionsRequestedPolicyVersion"] = String(
            args["optionsRequestedPolicyVersion"],
          );
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "compute.firewallPolicies.getIamPolicy",
            "path": "locations/global/firewallPolicies/{resource}/getIamPolicy",
            "httpMethod": "GET",
            "parameterOrder": ["resource"],
            "parameters": {
              "optionsRequestedPolicyVersion": { "location": "query" },
              "resource": { "location": "path", "required": true },
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
    get_rule: {
      description: "get rule",
      arguments: z.object({
        priority: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        const content = await context.dataRepository.getContent(
          context.modelType,
          context.modelId,
          (g.name?.toString() ?? "current").replace(/[\/\\]/g, "_").replace(
            /\.\./g,
            "_",
          ).replace(/\0/g, ""),
        );
        if (!content) {
          throw new Error("No existing state found - run create or get first");
        }
        const existing = JSON.parse(new TextDecoder().decode(content));
        params["firewallPolicy"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["priority"] !== undefined) {
          params["priority"] = String(args["priority"]);
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "compute.firewallPolicies.getRule",
            "path":
              "locations/global/firewallPolicies/{firewallPolicy}/getRule",
            "httpMethod": "GET",
            "parameterOrder": ["firewallPolicy"],
            "parameters": {
              "firewallPolicy": { "location": "path", "required": true },
              "priority": { "location": "query" },
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
    list_associations: {
      description: "list associations",
      arguments: z.object({
        includeInheritedPolicies: z.any().optional(),
        targetResource: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (args["includeInheritedPolicies"] !== undefined) {
          params["includeInheritedPolicies"] = String(
            args["includeInheritedPolicies"],
          );
        }
        if (args["targetResource"] !== undefined) {
          params["targetResource"] = String(args["targetResource"]);
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "compute.firewallPolicies.listAssociations",
            "path": "locations/global/firewallPolicies/listAssociations",
            "httpMethod": "GET",
            "parameterOrder": [],
            "parameters": {
              "includeInheritedPolicies": { "location": "query" },
              "targetResource": { "location": "query" },
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
    move: {
      description: "move",
      arguments: z.object({
        parentId: z.any().optional(),
        requestId: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        const content = await context.dataRepository.getContent(
          context.modelType,
          context.modelId,
          (g.name?.toString() ?? "current").replace(/[\/\\]/g, "_").replace(
            /\.\./g,
            "_",
          ).replace(/\0/g, ""),
        );
        if (!content) {
          throw new Error("No existing state found - run create or get first");
        }
        const existing = JSON.parse(new TextDecoder().decode(content));
        params["firewallPolicy"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["parentId"] !== undefined) {
          params["parentId"] = String(args["parentId"]);
        }
        if (args["requestId"] !== undefined) {
          params["requestId"] = String(args["requestId"]);
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "compute.firewallPolicies.move",
            "path": "locations/global/firewallPolicies/{firewallPolicy}/move",
            "httpMethod": "POST",
            "parameterOrder": ["firewallPolicy"],
            "parameters": {
              "firewallPolicy": { "location": "path", "required": true },
              "parentId": { "location": "query" },
              "requestId": { "location": "query" },
            },
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
    patch_rule: {
      description: "patch rule",
      arguments: z.object({
        action: z.any().optional(),
        description: z.any().optional(),
        direction: z.any().optional(),
        disabled: z.any().optional(),
        enableLogging: z.any().optional(),
        kind: z.any().optional(),
        match: z.any().optional(),
        ruleName: z.any().optional(),
        ruleTupleCount: z.any().optional(),
        securityProfileGroup: z.any().optional(),
        targetForwardingRules: z.any().optional(),
        targetResources: z.any().optional(),
        targetSecureTags: z.any().optional(),
        targetServiceAccounts: z.any().optional(),
        targetType: z.any().optional(),
        tlsInspect: z.any().optional(),
        priority: z.any().optional(),
        requestId: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        const content = await context.dataRepository.getContent(
          context.modelType,
          context.modelId,
          (g.name?.toString() ?? "current").replace(/[\/\\]/g, "_").replace(
            /\.\./g,
            "_",
          ).replace(/\0/g, ""),
        );
        if (!content) {
          throw new Error("No existing state found - run create or get first");
        }
        const existing = JSON.parse(new TextDecoder().decode(content));
        params["firewallPolicy"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["priority"] !== undefined) {
          params["priority"] = String(args["priority"]);
        }
        if (args["requestId"] !== undefined) {
          params["requestId"] = String(args["requestId"]);
        }
        const body: Record<string, unknown> = {};
        if (args["action"] !== undefined) body["action"] = args["action"];
        if (args["description"] !== undefined) {
          body["description"] = args["description"];
        }
        if (args["direction"] !== undefined) {
          body["direction"] = args["direction"];
        }
        if (args["disabled"] !== undefined) body["disabled"] = args["disabled"];
        if (args["enableLogging"] !== undefined) {
          body["enableLogging"] = args["enableLogging"];
        }
        if (args["kind"] !== undefined) body["kind"] = args["kind"];
        if (args["match"] !== undefined) body["match"] = args["match"];
        if (args["ruleName"] !== undefined) body["ruleName"] = args["ruleName"];
        if (args["ruleTupleCount"] !== undefined) {
          body["ruleTupleCount"] = args["ruleTupleCount"];
        }
        if (args["securityProfileGroup"] !== undefined) {
          body["securityProfileGroup"] = args["securityProfileGroup"];
        }
        if (args["targetForwardingRules"] !== undefined) {
          body["targetForwardingRules"] = args["targetForwardingRules"];
        }
        if (args["targetResources"] !== undefined) {
          body["targetResources"] = args["targetResources"];
        }
        if (args["targetSecureTags"] !== undefined) {
          body["targetSecureTags"] = args["targetSecureTags"];
        }
        if (args["targetServiceAccounts"] !== undefined) {
          body["targetServiceAccounts"] = args["targetServiceAccounts"];
        }
        if (args["targetType"] !== undefined) {
          body["targetType"] = args["targetType"];
        }
        if (args["tlsInspect"] !== undefined) {
          body["tlsInspect"] = args["tlsInspect"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "compute.firewallPolicies.patchRule",
            "path":
              "locations/global/firewallPolicies/{firewallPolicy}/patchRule",
            "httpMethod": "POST",
            "parameterOrder": ["firewallPolicy"],
            "parameters": {
              "firewallPolicy": { "location": "path", "required": true },
              "priority": { "location": "query" },
              "requestId": { "location": "query" },
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
    set_iam_policy: {
      description: "set iam policy",
      arguments: z.object({
        bindings: z.any().optional(),
        etag: z.any().optional(),
        policy: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        const content = await context.dataRepository.getContent(
          context.modelType,
          context.modelId,
          (g.name?.toString() ?? "current").replace(/[\/\\]/g, "_").replace(
            /\.\./g,
            "_",
          ).replace(/\0/g, ""),
        );
        if (!content) {
          throw new Error("No existing state found - run create or get first");
        }
        const existing = JSON.parse(new TextDecoder().decode(content));
        params["resource"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        const body: Record<string, unknown> = {};
        if (args["bindings"] !== undefined) body["bindings"] = args["bindings"];
        if (args["etag"] !== undefined) body["etag"] = args["etag"];
        if (args["policy"] !== undefined) body["policy"] = args["policy"];
        const result = await createResource(
          baseUrl,
          {
            "id": "compute.firewallPolicies.setIamPolicy",
            "path": "locations/global/firewallPolicies/{resource}/setIamPolicy",
            "httpMethod": "POST",
            "parameterOrder": ["resource"],
            "parameters": {
              "resource": { "location": "path", "required": true },
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
    test_iam_permissions: {
      description: "test iam permissions",
      arguments: z.object({
        permissions: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        const content = await context.dataRepository.getContent(
          context.modelType,
          context.modelId,
          (g.name?.toString() ?? "current").replace(/[\/\\]/g, "_").replace(
            /\.\./g,
            "_",
          ).replace(/\0/g, ""),
        );
        if (!content) {
          throw new Error("No existing state found - run create or get first");
        }
        const existing = JSON.parse(new TextDecoder().decode(content));
        params["resource"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        const body: Record<string, unknown> = {};
        if (args["permissions"] !== undefined) {
          body["permissions"] = args["permissions"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "compute.firewallPolicies.testIamPermissions",
            "path":
              "locations/global/firewallPolicies/{resource}/testIamPermissions",
            "httpMethod": "POST",
            "parameterOrder": ["resource"],
            "parameters": {
              "resource": { "location": "path", "required": true },
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

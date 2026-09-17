// deno-lint-ignore-file no-import-prefix

import { z } from "npm:zod@4.3.6";

export const iamBindingMethods = {
  add_iam_binding: {
    description:
      "add an IAM binding to the service account (read-modify-write with etag)",
    arguments: z.object({
      role: z.string().describe(
        "IAM role to grant, e.g. roles/iam.workloadIdentityUser",
      ),
      members: z.array(z.string()).describe(
        "Members to bind, e.g. ['principalSet://iam.googleapis.com/projects/123/locations/global/workloadIdentityPools/my-pool/attribute.repository/my-org/my-repo']",
      ),
      condition: z.object({
        title: z.string(),
        description: z.string().optional(),
        expression: z.string(),
      }).optional().describe("Optional IAM condition for conditional bindings"),
    }),
    execute: async (
      args: Record<string, unknown>,
      context: { globalArgs: Record<string, unknown> },
    ) => {
      const g = context.globalArgs;
      const baseUrl = g["apiEndpoint"]?.toString() ??
        Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
      const credentials = _buildGcpCredentials(g);
      const resource = g["name"]?.toString() ?? "";

      const getResp = await request(
        "POST",
        `${baseUrl}v1/${resource}:getIamPolicy`,
        { options: { requestedPolicyVersion: 3 } },
        credentials,
      );
      if (!getResp.ok) {
        const body = await getResp.text();
        throw new Error(`Failed to get IAM policy: ${getResp.status} ${body}`);
      }
      const policy = await getResp.json() as {
        bindings?: Array<{
          role: string;
          members: string[];
          condition?: {
            title: string;
            description?: string;
            expression: string;
          };
        }>;
        etag: string;
        version?: number;
      };

      const role = args["role"] as string;
      const members = args["members"] as string[];
      const condition = args["condition"] as
        | { title: string; description?: string; expression: string }
        | undefined;

      const bindings = policy.bindings ?? [];
      const existing = bindings.find((b) => {
        if (b.role !== role) return false;
        if (condition && b.condition) {
          return b.condition.title === condition.title &&
            b.condition.expression === condition.expression;
        }
        return !condition && !b.condition;
      });

      if (existing) {
        const memberSet = new Set(existing.members);
        for (const m of members) memberSet.add(m);
        existing.members = [...memberSet];
      } else {
        const newBinding: {
          role: string;
          members: string[];
          condition?: {
            title: string;
            description?: string;
            expression: string;
          };
        } = { role, members: [...new Set(members)] };
        if (condition) newBinding.condition = condition;
        bindings.push(newBinding);
      }

      const setResp = await request(
        "POST",
        `${baseUrl}v1/${resource}:setIamPolicy`,
        {
          policy: {
            bindings,
            etag: policy.etag,
            version: 3,
          },
        },
        credentials,
      );
      if (!setResp.ok) {
        const body = await setResp.text();
        throw new Error(`Failed to set IAM policy: ${setResp.status} ${body}`);
      }
      const result = await setResp.json();
      return { result };
    },
  },
  remove_iam_binding: {
    description:
      "remove an IAM binding or specific members from a service account (read-modify-write with etag)",
    arguments: z.object({
      role: z.string().describe(
        "IAM role to revoke, e.g. roles/iam.workloadIdentityUser",
      ),
      members: z.array(z.string()).optional().describe(
        "Specific members to remove. If omitted, removes the entire binding for this role.",
      ),
      condition: z.object({
        title: z.string(),
        description: z.string().optional(),
        expression: z.string(),
      }).optional().describe(
        "Match condition when removing a conditional binding",
      ),
    }),
    execute: async (
      args: Record<string, unknown>,
      context: { globalArgs: Record<string, unknown> },
    ) => {
      const g = context.globalArgs;
      const baseUrl = g["apiEndpoint"]?.toString() ??
        Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
      const credentials = _buildGcpCredentials(g);
      const resource = g["name"]?.toString() ?? "";

      const getResp = await request(
        "POST",
        `${baseUrl}v1/${resource}:getIamPolicy`,
        { options: { requestedPolicyVersion: 3 } },
        credentials,
      );
      if (!getResp.ok) {
        const body = await getResp.text();
        throw new Error(`Failed to get IAM policy: ${getResp.status} ${body}`);
      }
      const policy = await getResp.json() as {
        bindings?: Array<{
          role: string;
          members: string[];
          condition?: {
            title: string;
            description?: string;
            expression: string;
          };
        }>;
        etag: string;
        version?: number;
      };

      const role = args["role"] as string;
      const members = args["members"] as string[] | undefined;
      const condition = args["condition"] as
        | { title: string; description?: string; expression: string }
        | undefined;

      let bindings = policy.bindings ?? [];
      const idx = bindings.findIndex((b) => {
        if (b.role !== role) return false;
        if (condition && b.condition) {
          return b.condition.title === condition.title &&
            b.condition.expression === condition.expression;
        }
        return !condition && !b.condition;
      });

      if (idx === -1) {
        return { result: { bindings, message: "No matching binding found" } };
      }

      if (members) {
        const removeSet = new Set(members);
        bindings[idx].members = bindings[idx].members.filter((m) =>
          !removeSet.has(m)
        );
        if (bindings[idx].members.length === 0) {
          bindings = bindings.filter((_, i) => i !== idx);
        }
      } else {
        bindings = bindings.filter((_, i) => i !== idx);
      }

      const setResp = await request(
        "POST",
        `${baseUrl}v1/${resource}:setIamPolicy`,
        {
          policy: {
            bindings,
            etag: policy.etag,
            version: 3,
          },
        },
        credentials,
      );
      if (!setResp.ok) {
        const body = await setResp.text();
        throw new Error(`Failed to set IAM policy: ${setResp.status} ${body}`);
      }
      const result = await setResp.json();
      return { result };
    },
  },
  manage_account: {
    description:
      "create or adopt a service account by deterministic email, returning state with immutable uniqueId — no key creation or IAM grants",
    arguments: z.object({}),
    execute: async (
      _args: Record<string, never>,
      context: {
        globalArgs: Record<string, unknown>;
        writeResource: (
          type: string,
          name: string,
          data: unknown,
        ) => Promise<unknown>;
      },
    ) => {
      const g = context.globalArgs;
      const baseUrl = g["apiEndpoint"]?.toString() ??
        Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
      const credentials = _buildGcpCredentials(g);
      const projectId = await getProjectId(credentials);

      const accountId = g["accountId"]?.toString();
      if (!accountId) {
        throw new Error(
          "accountId is required: 6-30 character identifier used to derive the service account email",
        );
      }

      const email = `${accountId}@${projectId}.iam.gserviceaccount.com`;
      const resourceName = `projects/${projectId}/serviceAccounts/${email}`;

      const getResp = await request(
        "GET",
        `${baseUrl}v1/${resourceName}`,
        undefined,
        credentials,
      );

      let result: Record<string, unknown>;

      if (getResp.ok) {
        result = await getResp.json();
      } else if (getResp.status === 404) {
        await getResp.text();

        const createBody: Record<string, unknown> = { accountId };
        const sa: Record<string, unknown> = {};
        if (g["displayName"] !== undefined) {
          sa["displayName"] = g["displayName"];
        }
        if (g["description"] !== undefined) {
          sa["description"] = g["description"];
        }
        if (Object.keys(sa).length > 0) {
          createBody["serviceAccount"] = sa;
        }

        const createResp = await request(
          "POST",
          `${baseUrl}v1/projects/${projectId}/serviceAccounts`,
          createBody,
          credentials,
        );

        if (createResp.status === 409) {
          await createResp.text();
          const reReadResp = await request(
            "GET",
            `${baseUrl}v1/${resourceName}`,
            undefined,
            credentials,
          );
          if (!reReadResp.ok) {
            const body = await reReadResp.text();
            throw new Error(
              `Re-read after 409 failed (${reReadResp.status}): ${body}`,
            );
          }
          result = await reReadResp.json();
        } else if (!createResp.ok) {
          const body = await createResp.text();
          throw new Error(`Create failed (${createResp.status}): ${body}`);
        } else {
          result = await createResp.json();
        }
      } else if (getResp.status === 403) {
        let body: string;
        try {
          body = await getResp.text();
        } catch {
          body = "(could not read response body)";
        }
        throw new Error(
          `Permission denied reading service account ${email} (403): ${body}. ` +
            "This is NOT a 'not found' — check IAM permissions on the project.",
        );
      } else {
        const body = await getResp.text();
        throw new Error(
          `Unexpected error reading service account ${email} (${getResp.status}): ${body}`,
        );
      }

      const instanceName = resourceName
        .replace(/[\/\\]/g, "_")
        .replace(/\.\./g, "_")
        .replace(/\0/g, "");
      const handle = await context.writeResource(
        "state",
        instanceName,
        result,
      );
      return { dataHandles: [handle] };
    },
  },
};

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

// Auto-generated extension model for @swamp/aws/autoscaling/auto-scaling-group
// Do not edit manually. Re-generate with: deno task generate:aws

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for AutoScaling AutoScalingGroup (AWS::AutoScaling::AutoScalingGroup).
 *
 * Wraps the CloudFormation resource type as a swamp model so create,
 * get, update, delete, sync, and list can be driven through `swamp model`.
 *
 * @module
 */

import { z } from "npm:zod@4.3.6";
import {
  createResource,
  deleteResource,
  isResourceNotFoundError,
  listResources,
  readResource,
  updateResource,
} from "./_lib/aws.ts";
import type { AwsCredentials } from "./_lib/aws.ts";

const LifecycleHookSpecificationSchema = z.object({
  LifecycleHookName: z.string().describe("The name of the lifecycle hook."),
  LifecycleTransition: z.string().describe(
    "The lifecycle transition. For Auto Scaling groups, there are two major lifecycle transitions. To create a lifecycle hook for scale-out events, specify autoscaling:EC2_INSTANCE_LAUNCHING. To create a lifecycle hook for scale-in events, specify autoscaling:EC2_INSTANCE_TERMINATING.",
  ),
  HeartbeatTimeout: z.number().int().describe(
    "The maximum time, in seconds, that can elapse before the lifecycle hook times out. The range is from 30 to 7200 seconds. The default value is 3600 seconds (1 hour).",
  ).optional(),
  NotificationMetadata: z.string().describe(
    "Additional information that you want to include any time Amazon EC2 Auto Scaling sends a message to the notification target.",
  ).optional(),
  DefaultResult: z.string().describe(
    "The action the Auto Scaling group takes when the lifecycle hook timeout elapses or if an unexpected failure occurs. The default value is ABANDON. Valid values: CONTINUE | ABANDON",
  ).optional(),
  NotificationTargetARN: z.string().describe(
    "The Amazon Resource Name (ARN) of the notification target that Amazon EC2 Auto Scaling sends notifications to when an instance is in a wait state for the lifecycle hook. You can specify an Amazon SNS topic or an Amazon SQS queue.",
  ).optional(),
  RoleARN: z.string().describe(
    "The ARN of the IAM role that allows the Auto Scaling group to publish to the specified notification target. For information about creating this role, see [Prepare to add a lifecycle hook to your Auto Scaling group](https://docs.aws.amazon.com/autoscaling/ec2/userguide/prepare-for-lifecycle-notifications.html) in the *Amazon EC2 Auto Scaling User Guide*. Valid only if the notification target is an Amazon SNS topic or an Amazon SQS queue.",
  ).optional(),
});

const NotificationConfigurationSchema = z.object({
  TopicARN: z.array(z.string()).describe(
    "The Amazon Resource Name (ARN) of the Amazon SNS topic.",
  ),
  NotificationTypes: z.array(z.string()).describe(
    "A list of event types that send a notification. Event types can include any of the following types. *Allowed values*: autoscaling:EC2_INSTANCE_LAUNCH autoscaling:EC2_INSTANCE_LAUNCH_ERROR autoscaling:EC2_INSTANCE_TERMINATE autoscaling:EC2_INSTANCE_TERMINATE_ERROR autoscaling:TEST_NOTIFICATION",
  ).optional(),
});

const RetentionTriggersSchema = z.object({
  TerminateHookAbandon: z.string().describe(
    "Specifies the action when a termination lifecycle hook is abandoned due to failure, timeout, or explicit abandonment (calling CompleteLifecycleAction). Set to retain to move instances to a retained state. Set to terminate for default termination behavior. Retained instances don't count toward desired capacity and remain until you call TerminateInstanceInAutoScalingGroup.",
  ).optional(),
});

const DistributionSegmentSchema = z.object({
  TargetCapacityTypes: z.array(
    z.enum([
      "on-demand-capacity-reservation",
      "capacity-block",
      "interruptible-capacity-reservation",
      "on-demand",
    ]),
  ).describe(
    "The capacity types to prioritize, in order. Amazon EC2 Auto Scaling attempts to launch instances in the priority order of the capacity types, and within each capacity type, in the order of instance types listed in your launch template Overrides. The following lists the valid values: on-demand-capacity-reservation On-Demand Capacity Reservations. + capacity-block Capacity Blocks. + interruptible-capacity-reservation Interruptible Capacity Reservations. + on-demand On-Demand capacity. Include this value to allow the group to fall back to On-Demand capacity when the preceding capacity types are unavailable.",
  ),
});

const InstancesDistributionSchema = z.object({
  OnDemandAllocationStrategy: z.string().describe(
    "The allocation strategy to apply to your On-Demand Instances when they are launched. Possible instance types are determined by the launch template overrides that you specify. The following lists the valid values: lowest-price Uses price to determine which instance types are the highest priority, launching the lowest priced instance types within an Availability Zone first. This is the default value for Auto Scaling groups that specify InstanceRequirements. + prioritized You set the order of instance types for the launch template overrides from highest to lowest priority (from first to last in the list). Amazon EC2 Auto Scaling launches your highest priority instance types first. If all your On-Demand capacity cannot be fulfilled using your highest priority instance type, then Amazon EC2 Auto Scaling launches the remaining capacity using the second priority instance type, and so on. This is the default value for Auto Scaling groups that don't specify InstanceRequirements and cannot be used for groups that do.",
  ).optional(),
  OnDemandBaseCapacity: z.number().int().describe(
    "The minimum amount of the Auto Scaling group's capacity that must be fulfilled by On-Demand Instances. This base portion is launched first as your group scales. This number has the same unit of measurement as the group's desired capacity. If you change the default unit of measurement (number of instances) by specifying weighted capacity values in your launch template overrides list, or by changing the default desired capacity type setting of the group, you must specify this number using the same unit of measurement. Default: 0 An update to this setting means a gradual replacement of instances to adjust the current On-Demand Instance levels. When replacing instances, Amazon EC2 Auto Scaling launches new instances before terminating the previous ones.",
  ).optional(),
  DistributionSegments: z.array(DistributionSegmentSchema).describe(
    "The Distribution Segments configuration. Each segment contains an ordered list of capacity types to prioritize. For more information, see [Use Distribution Segments to target multiple capacity types](https://docs.aws.amazon.com/autoscaling/ec2/userguide/use-distribution-segments.html) in the *Amazon EC2 Auto Scaling User Guide*.",
  ).optional(),
  OnDemandPercentageAboveBaseCapacity: z.number().int().describe(
    "Controls the percentages of On-Demand Instances and Spot Instances for your additional capacity beyond OnDemandBaseCapacity. Expressed as a number (for example, 20 specifies 20% On-Demand Instances, 80% Spot Instances). If set to 100, only On-Demand Instances are used. Default: 100 An update to this setting means a gradual replacement of instances to adjust the current On-Demand and Spot Instance levels for your additional capacity higher than the base capacity. When replacing instances, Amazon EC2 Auto Scaling launches new instances before terminating the previous ones.",
  ).optional(),
  SpotInstancePools: z.number().int().describe(
    "The number of Spot Instance pools across which to allocate your Spot Instances. The Spot pools are determined from the different instance types in the overrides. Valid only when the SpotAllocationStrategy is lowest-price. Value must be in the range of 1–20. Default: 2",
  ).optional(),
  SpotAllocationStrategy: z.string().describe(
    "The allocation strategy to apply to your Spot Instances when they are launched. Possible instance types are determined by the launch template overrides that you specify. The following lists the valid values: capacity-optimized Requests Spot Instances using pools that are optimally chosen based on the available Spot capacity. This strategy has the lowest risk of interruption. To give certain instance types a higher chance of launching first, use capacity-optimized-prioritized. + capacity-optimized-prioritized You set the order of instance types for the launch template overrides from highest to lowest priority (from first to last in the list). Amazon EC2 Auto Scaling honors the instance type priorities on a best effort basis but optimizes for capacity first. Note that if the On-Demand allocation strategy is set to prioritized, the same priority is applied when fulfilling On-Demand capacity. This is not a valid value for Auto Scaling groups that specify InstanceRequirements. + lowest-price Requests Spot Instances using the lowest priced pools within an Availability Zone, across the number of Spot pools that you specify for the SpotInstancePools property. To ensure that your desired capacity is met, you might receive Spot Instances from several pools. This is the default value, but it might lead to high interruption rates because this strategy only considers instance price and not available capacity. + price-capacity-optimized (recommended) The price and capacity optimized allocation strategy looks at both price and capacity to select the Spot Instance pools that are the least likely to be interrupted and have the lowest possible price.",
  ).optional(),
  SpotMaxPrice: z.string().describe(
    'The maximum price per unit hour that you are willing to pay for a Spot Instance. If your maximum price is lower than the Spot price for the instance types that you selected, your Spot Instances are not launched. We do not recommend specifying a maximum price because it can lead to increased interruptions. When Spot Instances launch, you pay the current Spot price. To remove a maximum price that you previously set, include the property but specify an empty string ("") for the value. If you specify a maximum price, your instances will be interrupted more frequently than if you do not specify one. Valid Range: Minimum value of 0.001',
  ).optional(),
});

const LaunchTemplateSpecificationSchema = z.object({
  LaunchTemplateName: z.string().describe(
    "The name of the launch template. You must specify the LaunchTemplateName or the LaunchTemplateID, but not both.",
  ).optional(),
  Version: z.string().describe(
    "The version number of the launch template. Specifying $Latest or $Default for the template version number is not supported. However, you can specify LatestVersionNumber or DefaultVersionNumber using the Fn::GetAtt intrinsic function. For more information, see [Fn::GetAtt](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-getatt.html). For an example of using the Fn::GetAtt function, see the [Examples](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html#aws-resource-autoscaling-autoscalinggroup--examples) section of the AWS::AutoScaling::AutoScalingGroup resource.",
  ),
  LaunchTemplateId: z.string().describe(
    "The ID of the launch template. You must specify the LaunchTemplateID or the LaunchTemplateName, but not both.",
  ).optional(),
});

const MemoryGiBPerVCpuRequestSchema = z.object({
  Min: z.number().describe("The memory minimum in GiB.").optional(),
  Max: z.number().describe("The memory maximum in GiB.").optional(),
});

const VCpuCountRequestSchema = z.object({
  Min: z.number().int().describe("The minimum number of vCPUs.").optional(),
  Max: z.number().int().describe("The maximum number of vCPUs.").optional(),
});

const MemoryMiBRequestSchema = z.object({
  Min: z.number().int().describe("The memory minimum in MiB.").optional(),
  Max: z.number().int().describe("The memory maximum in MiB.").optional(),
});

const NetworkInterfaceCountRequestSchema = z.object({
  Min: z.number().int().describe("The minimum number of network interfaces.")
    .optional(),
  Max: z.number().int().describe("The maximum number of network interfaces.")
    .optional(),
});

const AcceleratorCountRequestSchema = z.object({
  Min: z.number().int().describe("The minimum value.").optional(),
  Max: z.number().int().describe("The maximum value.").optional(),
});

const NetworkBandwidthGbpsRequestSchema = z.object({
  Min: z.number().describe(
    "The minimum amount of network bandwidth, in gigabits per second (Gbps).",
  ).optional(),
  Max: z.number().describe(
    "The maximum amount of network bandwidth, in gigabits per second (Gbps).",
  ).optional(),
});

const PerformanceFactorReferenceRequestSchema = z.object({
  InstanceFamily: z.string().describe(
    "The instance family to use as a baseline reference. Make sure that you specify the correct value for the instance family. The instance family is everything before the period (.) in the instance type name. For example, in the instance c6i.large, the instance family is c6i, not c6. For more information, see [Amazon EC2 instance type naming conventions](https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-type-names.html) in *Amazon EC2 Instance Types*. The following instance types are *not supported* for performance protection. c1 g3| g3s hpc7g m1| m2 mac1 | mac2 | mac2-m1ultra | mac2-m2 | mac2-m2pro p3dn | p4d | p5 t1 u-12tb1 | u-18tb1 | u-24tb1 | u-3tb1 | u-6tb1 | u-9tb1 | u7i-12tb | u7in-16tb | u7in-24tb | u7in-32tb If you performance protection by specifying a supported instance family, the returned instance types will exclude the preceding unsupported instance families. If you specify an unsupported instance family as a value for baseline performance, the API returns an empty response.",
  ).optional(),
});

const CpuPerformanceFactorRequestSchema = z.object({
  References: z.array(PerformanceFactorReferenceRequestSchema).describe(
    "Specify an instance family to use as the baseline reference for CPU performance. All instance types that match your specified attributes will be compared against the CPU performance of the referenced instance family, regardless of CPU manufacturer or architecture differences. Currently only one instance family can be specified in the list.",
  ).optional(),
});

const BaselinePerformanceFactorsRequestSchema = z.object({
  Cpu: CpuPerformanceFactorRequestSchema.describe(
    "The CPU performance to consider, using an instance family as the baseline reference.",
  ).optional(),
});

const BaselineEbsBandwidthMbpsRequestSchema = z.object({
  Min: z.number().int().describe("The minimum value in Mbps.").optional(),
  Max: z.number().int().describe("The maximum value in Mbps.").optional(),
});

const AcceleratorTotalMemoryMiBRequestSchema = z.object({
  Min: z.number().int().describe("The memory minimum in MiB.").optional(),
  Max: z.number().int().describe("The memory maximum in MiB.").optional(),
});

const TotalLocalStorageGBRequestSchema = z.object({
  Min: z.number().describe("The storage minimum in GB.").optional(),
  Max: z.number().describe("The storage maximum in GB.").optional(),
});

const InstanceRequirementsSchema = z.object({
  InstanceGenerations: z.array(z.string()).describe(
    "Indicates whether current or previous generation instance types are included. For current generation instance types, specify current. The current generation includes EC2 instance types currently recommended for use. This typically includes the latest two to three generations in each instance family. For more information, see [Instance types](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-types.html) in the *Amazon EC2 User Guide*. For previous generation instance types, specify previous. Default: Any current or previous generation",
  ).optional(),
  AcceleratorTypes: z.array(z.string()).describe(
    "Lists the accelerator types that must be on an instance type. For instance types with GPU accelerators, specify gpu. For instance types with FPGA accelerators, specify fpga. For instance types with inference accelerators, specify inference. Default: Any accelerator type",
  ).optional(),
  MemoryGiBPerVCpu: MemoryGiBPerVCpuRequestSchema.describe(
    "The minimum and maximum amount of memory per vCPU for an instance type, in GiB. Default: No minimum or maximum limits",
  ).optional(),
  AcceleratorManufacturers: z.array(z.string()).describe(
    "Indicates whether instance types must have accelerators by specific manufacturers. For instance types with NVIDIA devices, specify nvidia. For instance types with AMD devices, specify amd. For instance types with AWS devices, specify amazon-web-services. For instance types with Xilinx devices, specify xilinx. Default: Any manufacturer",
  ).optional(),
  VCpuCount: VCpuCountRequestSchema.describe(
    "The minimum and maximum number of vCPUs for an instance type.",
  ),
  LocalStorage: z.string().describe(
    "Indicates whether instance types with instance store volumes are included, excluded, or required. For more information, see [Amazon EC2 instance store](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/InstanceStorage.html) in the *Amazon EC2 User Guide*. Default: included",
  ).optional(),
  CpuManufacturers: z.array(z.string()).describe(
    "Lists which specific CPU manufacturers to include. For instance types with Intel CPUs, specify intel. For instance types with AMD CPUs, specify amd. For instance types with AWS CPUs, specify amazon-web-services. For instance types with Apple CPUs, specify apple. Don't confuse the CPU hardware manufacturer with the CPU hardware architecture. Instances will be launched with a compatible CPU architecture based on the Amazon Machine Image (AMI) that you specify in your launch template. Default: Any manufacturer",
  ).optional(),
  BareMetal: z.string().describe(
    "Indicates whether bare metal instance types are included, excluded, or required. Default: excluded",
  ).optional(),
  RequireHibernateSupport: z.boolean().describe(
    "Indicates whether instance types must provide On-Demand Instance hibernation support. Default: false",
  ).optional(),
  MaxSpotPriceAsPercentageOfOptimalOnDemandPrice: z.number().int().describe(
    "[Price protection] The price protection threshold for Spot Instances, as a percentage of an identified On-Demand price. The identified On-Demand price is the price of the lowest priced current generation C, M, or R instance type with your specified attributes. If no current generation C, M, or R instance type matches your attributes, then the identified price is from either the lowest priced current generation instance types or, failing that, the lowest priced previous generation instance types that match your attributes. When Amazon EC2 Auto Scaling selects instance types with your attributes, we will exclude instance types whose price exceeds your specified threshold. The parameter accepts an integer, which Amazon EC2 Auto Scaling interprets as a percentage. If you set DesiredCapacityType to vcpu or memory-mib, the price protection threshold is based on the per-vCPU or per-memory price instead of the per instance price. Only one of SpotMaxPricePercentageOverLowestPrice or MaxSpotPriceAsPercentageOfOptimalOnDemandPrice can be specified. If you don't specify either, Amazon EC2 Auto Scaling will automatically apply optimal price protection to consistently select from a wide range of instance types. To indicate no price protection threshold for Spot Instances, meaning you want to consider all instance types that match your attributes, include one of these parameters and specify a high value, such as 999999.",
  ).optional(),
  OnDemandMaxPricePercentageOverLowestPrice: z.number().int().describe(
    "[Price protection] The price protection threshold for On-Demand Instances, as a percentage higher than an identified On-Demand price. The identified On-Demand price is the price of the lowest priced current generation C, M, or R instance type with your specified attributes. If no current generation C, M, or R instance type matches your attributes, then the identified price is from either the lowest priced current generation instance types or, failing that, the lowest priced previous generation instance types that match your attributes. When Amazon EC2 Auto Scaling selects instance types with your attributes, we will exclude instance types whose price exceeds your specified threshold. The parameter accepts an integer, which Amazon EC2 Auto Scaling interprets as a percentage. To turn off price protection, specify a high value, such as 999999. If you set DesiredCapacityType to vcpu or memory-mib, the price protection threshold is applied based on the per-vCPU or per-memory price instead of the per instance price. Default: 20",
  ).optional(),
  MemoryMiB: MemoryMiBRequestSchema.describe(
    "The minimum and maximum instance memory size for an instance type, in MiB.",
  ),
  LocalStorageTypes: z.array(z.string()).describe(
    "Indicates the type of local storage that is required. For instance types with hard disk drive (HDD) storage, specify hdd. For instance types with solid state drive (SSD) storage, specify ssd. Default: Any local storage type",
  ).optional(),
  NetworkInterfaceCount: NetworkInterfaceCountRequestSchema.describe(
    "The minimum and maximum number of network interfaces for an instance type. Default: No minimum or maximum limits",
  ).optional(),
  ExcludedInstanceTypes: z.array(z.string()).describe(
    "The instance types to exclude. You can use strings with one or more wild cards, represented by an asterisk ( *), to exclude an instance family, type, size, or generation. The following are examples: m5.8xlarge, c5*.*, m5a.*, r*, *3*. For example, if you specify c5*, you are excluding the entire C5 instance family, which includes all C5a and C5n instance types. If you specify m5a.*, Amazon EC2 Auto Scaling will exclude all the M5a instance types, but not the M5n instance types. If you specify ExcludedInstanceTypes, you can't specify AllowedInstanceTypes. Default: No excluded instance types",
  ).optional(),
  AllowedInstanceTypes: z.array(z.string()).describe(
    "The instance types to apply your specified attributes against. All other instance types are ignored, even if they match your specified attributes. You can use strings with one or more wild cards, represented by an asterisk ( *), to allow an instance type, size, or generation. The following are examples: m5.8xlarge, c5*.*, m5a.*, r*, *3*. For example, if you specify c5*, Amazon EC2 Auto Scaling will allow the entire C5 instance family, which includes all C5a and C5n instance types. If you specify m5a.*, Amazon EC2 Auto Scaling will allow all the M5a instance types, but not the M5n instance types. If you specify AllowedInstanceTypes, you can't specify ExcludedInstanceTypes. Default: All instance types",
  ).optional(),
  AcceleratorCount: AcceleratorCountRequestSchema.describe(
    "The minimum and maximum number of accelerators (GPUs, FPGAs, or AWS Inferentia chips) for an instance type. To exclude accelerator-enabled instance types, set Max to 0. Default: No minimum or maximum limits",
  ).optional(),
  NetworkBandwidthGbps: NetworkBandwidthGbpsRequestSchema.describe(
    "The minimum and maximum amount of network bandwidth, in gigabits per second (Gbps). Default: No minimum or maximum limits",
  ).optional(),
  BaselinePerformanceFactors: BaselinePerformanceFactorsRequestSchema.describe(
    "The baseline performance factors for the instance requirements.",
  ).optional(),
  BaselineEbsBandwidthMbps: BaselineEbsBandwidthMbpsRequestSchema.describe(
    "The minimum and maximum baseline bandwidth performance for an instance type, in Mbps. For more information, see [Amazon EBS–optimized instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-optimized.html) in the *Amazon EC2 User Guide*. Default: No minimum or maximum limits",
  ).optional(),
  SpotMaxPricePercentageOverLowestPrice: z.number().int().describe(
    "[Price protection] The price protection threshold for Spot Instances, as a percentage higher than an identified Spot price. The identified Spot price is the price of the lowest priced current generation C, M, or R instance type with your specified attributes. If no current generation C, M, or R instance type matches your attributes, then the identified price is from either the lowest priced current generation instance types or, failing that, the lowest priced previous generation instance types that match your attributes. When Amazon EC2 Auto Scaling selects instance types with your attributes, we will exclude instance types whose price exceeds your specified threshold. The parameter accepts an integer, which Amazon EC2 Auto Scaling interprets as a percentage. If you set DesiredCapacityType to vcpu or memory-mib, the price protection threshold is based on the per-vCPU or per-memory price instead of the per instance price. Only one of SpotMaxPricePercentageOverLowestPrice or MaxSpotPriceAsPercentageOfOptimalOnDemandPrice can be specified. If you don't specify either, Amazon EC2 Auto Scaling will automatically apply optimal price protection to consistently select from a wide range of instance types. To indicate no price protection threshold for Spot Instances, meaning you want to consider all instance types that match your attributes, include one of these parameters and specify a high value, such as 999999.",
  ).optional(),
  AcceleratorNames: z.array(z.string()).describe(
    "Lists the accelerators that must be on an instance type. For instance types with NVIDIA A100 GPUs, specify a100. For instance types with NVIDIA V100 GPUs, specify v100. For instance types with NVIDIA K80 GPUs, specify k80. For instance types with NVIDIA T4 GPUs, specify t4. For instance types with NVIDIA M60 GPUs, specify m60. For instance types with AMD Radeon Pro V520 GPUs, specify radeon-pro-v520. For instance types with Xilinx VU9P FPGAs, specify vu9p. Default: Any accelerator",
  ).optional(),
  AcceleratorTotalMemoryMiB: AcceleratorTotalMemoryMiBRequestSchema.describe(
    "The minimum and maximum total memory size for the accelerators on an instance type, in MiB. Default: No minimum or maximum limits",
  ).optional(),
  BurstablePerformance: z.string().describe(
    "Indicates whether burstable performance instance types are included, excluded, or required. For more information, see [Burstable performance instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/burstable-performance-instances.html) in the *Amazon EC2 User Guide*. Default: excluded",
  ).optional(),
  TotalLocalStorageGB: TotalLocalStorageGBRequestSchema.describe(
    "The minimum and maximum total local storage size for an instance type, in GB. Default: No minimum or maximum limits",
  ).optional(),
});

const LaunchTemplateOverridesSchema = z.object({
  LaunchTemplateSpecification: LaunchTemplateSpecificationSchema.describe(
    "Provides a launch template for the specified instance type or set of instance requirements. For example, some instance types might require a launch template with a different AMI. If not provided, Amazon EC2 Auto Scaling uses the launch template that's specified in the LaunchTemplate definition. For more information, see [Specifying a different launch template for an instance type](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-mixed-instances-groups-launch-template-overrides.html) in the *Amazon EC2 Auto Scaling User Guide*. You can specify up to 20 launch templates per Auto Scaling group. The launch templates specified in the overrides and in the LaunchTemplate definition count towards this limit.",
  ).optional(),
  WeightedCapacity: z.string().describe(
    "If you provide a list of instance types to use, you can specify the number of capacity units provided by each instance type in terms of virtual CPUs, memory, storage, throughput, or other relative performance characteristic. When a Spot or On-Demand Instance is launched, the capacity units count toward the desired capacity. Amazon EC2 Auto Scaling launches instances until the desired capacity is totally fulfilled, even if this results in an overage. For example, if there are two units remaining to fulfill capacity, and Amazon EC2 Auto Scaling can only launch an instance with a WeightedCapacity of five units, the instance is launched, and the desired capacity is exceeded by three units. For more information, see [Configure instance weighting for Amazon EC2 Auto Scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-mixed-instances-groups-instance-weighting.html) in the *Amazon EC2 Auto Scaling User Guide*. Value must be in the range of 1-999. If you specify a value for WeightedCapacity for one instance type, you must specify a value for WeightedCapacity for all of them. Every Auto Scaling group has three size parameters ( DesiredCapacity, MaxSize, and MinSize). Usually, you set these sizes based on a specific number of instances. However, if you configure a mixed instances policy that defines weights for the instance types, you must specify these sizes with the same units that you use for weighting instances.",
  ).optional(),
  ImageId: z.string().describe(
    "The ID of the Amazon Machine Image (AMI) to use for instances launched with this override. When using Instance Refresh with ReplaceRootVolume strategy, this specifies the AMI for root volume replacement operations. For ReplaceRootVolume operations: All overrides in the MixedInstancesPolicy must specify an ImageId The AMI must contain only a single root volume Root volume replacement doesn't support multi-volume AMIs",
  ).optional(),
  InstanceRequirements: InstanceRequirementsSchema.describe(
    "The instance requirements. Amazon EC2 Auto Scaling uses your specified requirements to identify instance types. Then, it uses your On-Demand and Spot allocation strategies to launch instances from these instance types. You can specify up to four separate sets of instance requirements per Auto Scaling group. This is useful for provisioning instances from different Amazon Machine Images (AMIs) in the same Auto Scaling group. To do this, create the AMIs and create a new launch template for each AMI. Then, create a compatible set of instance requirements for each launch template. If you specify InstanceRequirements, you can't specify InstanceType.",
  ).optional(),
  InstanceType: z.string().describe(
    "The instance type, such as m3.xlarge. You must specify an instance type that is supported in your requested Region and Availability Zones. For more information, see [Instance types](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-types.html) in the *Amazon EC2 User Guide*. You can specify up to 40 instance types per Auto Scaling group.",
  ).optional(),
});

const LaunchTemplateSchema = z.object({
  LaunchTemplateSpecification: LaunchTemplateSpecificationSchema.describe(
    "The launch template.",
  ),
  Overrides: z.array(LaunchTemplateOverridesSchema).describe(
    "Any properties that you specify override the same properties in the launch template.",
  ).optional(),
});

const TagPropertySchema = z.object({
  Value: z.string().describe("The tag value."),
  Key: z.string().describe("The tag key."),
  PropagateAtLaunch: z.boolean().describe(
    "Set to true if you want CloudFormation to copy the tag to EC2 instances that are launched as part of the Auto Scaling group. Set to false if you want the tag attached only to the Auto Scaling group and not copied to any instances launched as part of the Auto Scaling group.",
  ),
});

const MetricsCollectionSchema = z.object({
  Metrics: z.array(z.string()).describe(
    "Identifies the metrics to enable. You can specify one or more of the following metrics: GroupMinSize GroupMaxSize GroupDesiredCapacity GroupInServiceInstances GroupPendingInstances GroupStandbyInstances GroupTerminatingInstances GroupTotalInstances GroupInServiceCapacity GroupPendingCapacity GroupStandbyCapacity GroupTerminatingCapacity GroupTotalCapacity WarmPoolDesiredCapacity WarmPoolWarmedCapacity WarmPoolPendingCapacity WarmPoolTerminatingCapacity WarmPoolTotalCapacity GroupAndWarmPoolDesiredCapacity GroupAndWarmPoolTotalCapacity If you specify Granularity and don't specify any metrics, all metrics are enabled. For more information, see [Amazon CloudWatch metrics for Amazon EC2 Auto Scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-metrics.html) in the *Amazon EC2 Auto Scaling User Guide*.",
  ).optional(),
  Granularity: z.string().describe(
    "The frequency at which Amazon EC2 Auto Scaling sends aggregated data to CloudWatch. The only valid value is 1Minute.",
  ),
});

const TrafficSourceIdentifierSchema = z.object({
  Type: z.string().describe(
    "Provides additional context for the value of Identifier. The following lists the valid values: elb if Identifier is the name of a Classic Load Balancer. elbv2 if Identifier is the ARN of an Application Load Balancer, Gateway Load Balancer, or Network Load Balancer target group. vpc-lattice if Identifier is the ARN of a VPC Lattice target group. Required if the identifier is the name of a Classic Load Balancer.",
  ),
  Identifier: z.string().describe(
    "Identifies the traffic source. For Application Load Balancers, Gateway Load Balancers, Network Load Balancers, and VPC Lattice, this will be the Amazon Resource Name (ARN) for a target group in this account and Region. For Classic Load Balancers, this will be the name of the Classic Load Balancer in this account and Region. For example: Application Load Balancer ARN: arn:aws:elasticloadbalancing:us-west-2:123456789012:targetgroup/my-targets/1234567890123456 Classic Load Balancer name: my-classic-load-balancer VPC Lattice ARN: arn:aws:vpc-lattice:us-west-2:123456789012:targetgroup/tg-1234567890123456 To get the ARN of a target group for a Application Load Balancer, Gateway Load Balancer, or Network Load Balancer, or the name of a Classic Load Balancer, use the Elastic Load Balancing [DescribeTargetGroups](https://docs.aws.amazon.com/elasticloadbalancing/latest/APIReference/API_DescribeTargetGroups.html) and [DescribeLoadBalancers](https://docs.aws.amazon.com/elasticloadbalancing/latest/APIReference/API_DescribeLoadBalancers.html) API operations. To get the ARN of a target group for VPC Lattice, use the VPC Lattice [GetTargetGroup](https://docs.aws.amazon.com/vpc-lattice/latest/APIReference/API_GetTargetGroup.html) API operation.",
  ),
});

const CapacityReservationTargetSchema = z.object({
  CapacityReservationIds: z.array(z.string()).describe(
    "The Capacity Reservation IDs to launch instances into.",
  ).optional(),
  CapacityReservationResourceGroupArns: z.array(z.string()).describe(
    "The resource group ARNs of the Capacity Reservation to launch instances into.",
  ).optional(),
});

const GlobalArgsSchema = z.object({
  accessKeyId: z.string().meta({ sensitive: true }).describe(
    "AWS access key ID; overrides AWS_ACCESS_KEY_ID environment variable. Wire with a vault.get(...) expression to source it from a vault.",
  ).optional(),
  secretAccessKey: z.string().meta({ sensitive: true }).describe(
    "AWS secret access key; overrides AWS_SECRET_ACCESS_KEY environment variable. Wire with a vault.get(...) expression to source it from a vault.",
  ).optional(),
  sessionToken: z.string().meta({ sensitive: true }).describe(
    "AWS session token for temporary credentials; overrides AWS_SESSION_TOKEN environment variable. Wire with a vault.get(...) expression to source it from a vault.",
  ).optional(),
  region: z.string().describe(
    "AWS region; overrides AWS_REGION / AWS_DEFAULT_REGION environment variables and ~/.aws/config profile region. Defaults to us-east-1.",
  ).optional(),
  LifecycleHookSpecificationList: z.array(LifecycleHookSpecificationSchema)
    .describe(
      "One or more lifecycle hooks to add to the Auto Scaling group before instances are launched.",
    ).optional(),
  LoadBalancerNames: z.array(z.string()).describe(
    "A list of Classic Load Balancers associated with this Auto Scaling group. For Application Load Balancers, Network Load Balancers, and Gateway Load Balancers, specify the TargetGroupARNs property instead.",
  ).optional(),
  LaunchConfigurationName: z.string().describe(
    "The name of the launch configuration to use to launch instances. Required only if you don't specify LaunchTemplate, MixedInstancesPolicy, or InstanceId.",
  ).optional(),
  ServiceLinkedRoleARN: z.string().describe(
    "The Amazon Resource Name (ARN) of the service-linked role that the Auto Scaling group uses to call other AWS service on your behalf. By default, Amazon EC2 Auto Scaling uses a service-linked role named AWSServiceRoleForAutoScaling, which it creates if it does not exist. For more information, see [Service-linked roles](https://docs.aws.amazon.com/autoscaling/ec2/userguide/autoscaling-service-linked-role.html) in the *Amazon EC2 Auto Scaling User Guide*.",
  ).optional(),
  AvailabilityZoneImpairmentPolicy: z.object({
    ZonalShiftEnabled: z.boolean().describe(
      "If true, enable zonal shift for your Auto Scaling group.",
    ),
    ImpairedZoneHealthCheckBehavior: z.enum([
      "IgnoreUnhealthy",
      "ReplaceUnhealthy",
    ]).describe(
      "Specifies the health check behavior for the impaired Availability Zone in an active zonal shift. If you select Replace unhealthy, instances that appear unhealthy will be replaced in all Availability Zones. If you select Ignore unhealthy, instances will not be replaced in the Availability Zone with the active zonal shift. For more information, see [Auto Scaling group zonal shift](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-zonal-shift.html) in the *Amazon EC2 Auto Scaling User Guide*.",
    ),
  }).describe(
    "The Availability Zone impairment policy for the Auto Scaling group.",
  ).optional(),
  TargetGroupARNs: z.array(z.string()).describe(
    "The Amazon Resource Names (ARN) of the Elastic Load Balancing target groups to associate with the Auto Scaling group. Instances are registered as targets with the target groups. The target groups receive incoming traffic and route requests to one or more registered targets. For more information, see [Use Elastic Load Balancing to distribute traffic across the instances in your Auto Scaling group](https://docs.aws.amazon.com/autoscaling/ec2/userguide/autoscaling-load-balancer.html) in the *Amazon EC2 Auto Scaling User Guide*.",
  ).optional(),
  AvailabilityZoneIds: z.array(z.string()).describe(
    "The Availability Zone IDs where the Auto Scaling group can launch instances.",
  ).optional(),
  Cooldown: z.string().describe(
    "*Only needed if you use simple scaling policies.* The amount of time, in seconds, between one scaling activity ending and another one starting due to simple scaling policies. For more information, see [Scaling cooldowns for Amazon EC2 Auto Scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-scaling-cooldowns.html) in the *Amazon EC2 Auto Scaling User Guide*. Default: 300 seconds",
  ).optional(),
  NotificationConfigurations: z.array(NotificationConfigurationSchema).describe(
    "Configures an Auto Scaling group to send notifications when specified events take place.",
  ).optional(),
  DesiredCapacity: z.string().regex(new RegExp("^[0-9]+$")).describe(
    "The desired capacity is the initial capacity of the Auto Scaling group at the time of its creation and the capacity it attempts to maintain. It can scale beyond this capacity if you configure automatic scaling. The number must be greater than or equal to the minimum size of the group and less than or equal to the maximum size of the group. If you do not specify a desired capacity when creating the stack, the default is the minimum size of the group. CloudFormation marks the Auto Scaling group as successful (by setting its status to CREATE_COMPLETE) when the desired capacity is reached. However, if a maximum Spot price is set in the launch template or launch configuration that you specified, then desired capacity is not used as a criteria for success. Whether your request is fulfilled depends on Spot Instance capacity and your maximum price.",
  ).optional(),
  HealthCheckGracePeriod: z.number().int().describe(
    "The amount of time, in seconds, that Amazon EC2 Auto Scaling waits before checking the health status of an EC2 instance that has come into service and marking it unhealthy due to a failed health check. This is useful if your instances do not immediately pass their health checks after they enter the InService state. For more information, see [Set the health check grace period for an Auto Scaling group](https://docs.aws.amazon.com/autoscaling/ec2/userguide/health-check-grace-period.html) in the *Amazon EC2 Auto Scaling User Guide*. Default: 0 seconds",
  ).optional(),
  InstanceLifecyclePolicy: z.object({
    RetentionTriggers: RetentionTriggersSchema.describe(
      "Specifies the conditions that trigger instance retention behavior. These triggers determine when instances should move to a Retained state instead of automatic termination. This allows you to maintain control over instance management when lifecycles transition and operations fail.",
    ).optional(),
  }).describe("The instance lifecycle policy for the Auto Scaling group.")
    .optional(),
  DefaultInstanceWarmup: z.number().int().describe(
    "The amount of time, in seconds, until a new instance is considered to have finished initializing and resource consumption to become stable after it enters the InService state. During an instance refresh, Amazon EC2 Auto Scaling waits for the warm-up period after it replaces an instance before it moves on to replacing the next instance. Amazon EC2 Auto Scaling also waits for the warm-up period before aggregating the metrics for new instances with existing instances in the Amazon CloudWatch metrics that are used for scaling, resulting in more reliable usage data. For more information, see [Set the default instance warmup for an Auto Scaling group](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-default-instance-warmup.html) in the *Amazon EC2 Auto Scaling User Guide*. To manage various warm-up settings at the group level, we recommend that you set the default instance warmup, *even if it is set to 0 seconds*. To remove a value that you previously set, include the property but specify -1 for the value. However, we strongly recommend keeping the default instance warmup enabled by specifying a value of 0 or other nominal value. Default: None",
  ).optional(),
  SkipZonalShiftValidation: z.boolean().optional(),
  NewInstancesProtectedFromScaleIn: z.boolean().describe(
    "Indicates whether newly launched instances are protected from termination by Amazon EC2 Auto Scaling when scaling in. For more information about preventing instances from terminating on scale in, see [Use instance scale-in protection](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-instance-protection.html) in the *Amazon EC2 Auto Scaling User Guide*.",
  ).optional(),
  LaunchTemplate: z.object({
    LaunchTemplateName: z.string().describe(
      "The name of the launch template. You must specify the LaunchTemplateName or the LaunchTemplateID, but not both.",
    ).optional(),
    Version: z.string().describe(
      "The version number of the launch template. Specifying $Latest or $Default for the template version number is not supported. However, you can specify LatestVersionNumber or DefaultVersionNumber using the Fn::GetAtt intrinsic function. For more information, see [Fn::GetAtt](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-getatt.html). For an example of using the Fn::GetAtt function, see the [Examples](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html#aws-resource-autoscaling-autoscalinggroup--examples) section of the AWS::AutoScaling::AutoScalingGroup resource.",
    ),
    LaunchTemplateId: z.string().describe(
      "The ID of the launch template. You must specify the LaunchTemplateID or the LaunchTemplateName, but not both.",
    ).optional(),
  }).describe(
    "Information used to specify the launch template and version to use to launch instances. You can alternatively associate a launch template to the Auto Scaling group by specifying a MixedInstancesPolicy. For more information about creating launch templates, see [Create a launch template for an Auto Scaling group](https://docs.aws.amazon.com/autoscaling/ec2/userguide/create-launch-template.html) in the *Amazon EC2 Auto Scaling User Guide*. If you omit this property, you must specify MixedInstancesPolicy, LaunchConfigurationName, or InstanceId.",
  ).optional(),
  MixedInstancesPolicy: z.object({
    InstancesDistribution: InstancesDistributionSchema.describe(
      "The instances distribution.",
    ).optional(),
    LaunchTemplate: LaunchTemplateSchema.describe(
      "One or more launch templates and the instance types (overrides) that are used to launch EC2 instances to fulfill the configured capacities.",
    ),
  }).describe(
    "An embedded object that specifies a mixed instances policy. The policy includes properties that not only define the distribution of On-Demand Instances and Spot Instances, the maximum price to pay for Spot Instances (optional), and how the Auto Scaling group allocates instance types to fulfill On-Demand and Spot capacities, but also the properties that specify the instance configuration information—the launch template and instance types. The policy can also include a weight for each instance type and different launch templates for individual instance types. For more information, see [Auto Scaling groups with multiple instance types and purchase options](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-mixed-instances-groups.html) in the *Amazon EC2 Auto Scaling User Guide*.",
  ).optional(),
  VPCZoneIdentifier: z.array(z.string()).describe(
    "A list of subnet IDs for a virtual private cloud (VPC) where instances in the Auto Scaling group can be created. If this resource specifies public subnets and is also in a VPC that is defined in the same stack template, you must use the [DependsOn attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-dependson.html) to declare a dependency on the [VPC-gateway attachment](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpc-gateway-attachment.html). When you update VPCZoneIdentifier, this retains the same Auto Scaling group and replaces old instances with new ones, according to the specified subnets. To control how CloudFormation replaces the instances, add an [UpdatePolicy attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-updatepolicy.html) to your stack. Set the update policy to AutoScalingInstanceRefresh. For more information, see the [AutoScalingInstanceRefresh policy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-updatepolicy.html#cfn-attributes-updatepolicy-instancerefresh). Required to launch instances into a nondefault VPC. If you specify VPCZoneIdentifier with AvailabilityZones, the subnets that you specify for this property must reside in those Availability Zones.",
  ).optional(),
  Tags: z.array(TagPropertySchema).describe(
    "One or more tags. You can tag your Auto Scaling group and propagate the tags to the Amazon EC2 instances it launches. Tags are not propagated to Amazon EBS volumes. To add tags to Amazon EBS volumes, specify the tags in a launch template but use caution. If the launch template specifies an instance tag with a key that is also specified for the Auto Scaling group, Amazon EC2 Auto Scaling overrides the value of that instance tag with the value specified by the Auto Scaling group. For more information, see [Tag Auto Scaling groups and instances](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-tagging.html) in the *Amazon EC2 Auto Scaling User Guide*.",
  ).optional(),
  Context: z.string().describe("Reserved.").optional(),
  CapacityRebalance: z.boolean().describe(
    "Indicates whether Capacity Rebalancing is enabled. Otherwise, Capacity Rebalancing is disabled. When you turn on Capacity Rebalancing, Amazon EC2 Auto Scaling attempts to launch a Spot Instance whenever Amazon EC2 notifies that a Spot Instance is at an elevated risk of interruption. After launching a new instance, it then terminates an old instance. For more information, see [Use Capacity Rebalancing to handle Amazon EC2 Spot Interruptions](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-capacity-rebalancing.html) in the in the *Amazon EC2 Auto Scaling User Guide*.",
  ).optional(),
  InstanceId: z.string().describe(
    "The ID of the instance used to base the launch configuration on. For more information, see [Create an Auto Scaling group using an EC2 instance](https://docs.aws.amazon.com/autoscaling/ec2/userguide/create-asg-from-instance.html) in the *Amazon EC2 Auto Scaling User Guide*. If you specify LaunchTemplate, MixedInstancesPolicy, or LaunchConfigurationName, don't specify InstanceId.",
  ).optional(),
  AvailabilityZones: z.array(z.string()).describe(
    "A list of Availability Zones where instances in the Auto Scaling group can be created. Used for launching into the default VPC subnet in each Availability Zone when not using the VPCZoneIdentifier property, or for attaching a network interface when an existing network interface ID is specified in a launch template.",
  ).optional(),
  NotificationConfiguration: z.object({
    TopicARN: z.array(z.string()).describe(
      "The Amazon Resource Name (ARN) of the Amazon SNS topic.",
    ),
    NotificationTypes: z.array(z.string()).describe(
      "A list of event types that send a notification. Event types can include any of the following types. *Allowed values*: autoscaling:EC2_INSTANCE_LAUNCH autoscaling:EC2_INSTANCE_LAUNCH_ERROR autoscaling:EC2_INSTANCE_TERMINATE autoscaling:EC2_INSTANCE_TERMINATE_ERROR autoscaling:TEST_NOTIFICATION",
    ).optional(),
  }).describe(
    "A structure that specifies an Amazon SNS notification configuration for the NotificationConfigurations property of the [AWS::AutoScaling::AutoScalingGroup](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html) resource. For an example template snippet, see [Configure Amazon EC2 Auto Scaling resources](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/quickref-ec2-auto-scaling.html). For more information, see [Get Amazon SNS notifications when your Auto Scaling group scales](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ASGettingNotifications.html) in the *Amazon EC2 Auto Scaling User Guide*.",
  ).optional(),
  AvailabilityZoneDistribution: z.object({
    CapacityDistributionStrategy: z.enum([
      "balanced-best-effort",
      "balanced-only",
      "reservations-then-balanced",
    ]).describe(
      "If launches fail in an Availability Zone, the following strategies are available. The default is balanced-best-effort. balanced-only - If launches fail in an Availability Zone, Auto Scaling will continue to attempt to launch in the unhealthy zone to preserve a balanced distribution. balanced-best-effort - If launches fail in an Availability Zone, Auto Scaling will attempt to launch in another healthy Availability Zone instead. reservations-then-balanced - Auto Scaling will first attempt to launch into your Capacity Reservations, and then balance any remaining capacity across healthy Availability Zones.",
    ).optional(),
  }).describe(
    "The EC2 instance capacity distribution across Availability Zones for the Auto Scaling group.",
  ).optional(),
  MetricsCollection: z.array(MetricsCollectionSchema).describe(
    "Enables the monitoring of group metrics of an Auto Scaling group. By default, these metrics are disabled.",
  ).optional(),
  DeletionProtection: z.string().describe(
    "The deletion protection setting for the Auto Scaling group.",
  ).optional(),
  InstanceMaintenancePolicy: z.object({
    MaxHealthyPercentage: z.number().int().describe(
      "Specifies the upper threshold as a percentage of the desired capacity of the Auto Scaling group. It represents the maximum percentage of the group that can be in service and healthy, or pending, to support your workload when replacing instances. Value range is 100 to 200. To clear a previously set value, specify a value of -1. Both MinHealthyPercentage and MaxHealthyPercentage must be specified, and the difference between them cannot be greater than 100. A large range increases the number of instances that can be replaced at the same time.",
    ).optional(),
    MinHealthyPercentage: z.number().int().describe(
      "Specifies the lower threshold as a percentage of the desired capacity of the Auto Scaling group. It represents the minimum percentage of the group to keep in service, healthy, and ready to use to support your workload when replacing instances. Value range is 0 to 100. To clear a previously set value, specify a value of -1.",
    ).optional(),
  }).describe(
    "An instance maintenance policy. For more information, see [Set instance maintenance policy](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-instance-maintenance-policy.html) in the *Amazon EC2 Auto Scaling User Guide*.",
  ).optional(),
  MaxSize: z.string().regex(new RegExp("^[0-9]+$")).describe(
    "The maximum size of the group. With a mixed instances policy that uses instance weighting, Amazon EC2 Auto Scaling may need to go above MaxSize to meet your capacity requirements. In this event, Amazon EC2 Auto Scaling will never go above MaxSize by more than your largest instance weight (weights that define how many units each instance contributes to the desired capacity of the group).",
  ),
  MinSize: z.string().regex(new RegExp("^[0-9]+$")).describe(
    "The minimum size of the group.",
  ),
  TerminationPolicies: z.array(z.string()).describe(
    "A policy or a list of policies that are used to select the instance to terminate. These policies are executed in the order that you list them. For more information, see [Configure termination policies for Amazon EC2 Auto Scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-termination-policies.html) in the *Amazon EC2 Auto Scaling User Guide*. Valid values: Default | AllocationStrategy | ClosestToNextInstanceHour | NewestInstance | OldestInstance | OldestLaunchConfiguration | OldestLaunchTemplate | arn:aws:lambda:region:account-id:function:my-function:my-alias",
  ).optional(),
  AutoScalingGroupName: z.string().describe(
    "The name of the Auto Scaling group. This name must be unique per Region per account. The name can contain any ASCII character 33 to 126 including most punctuation characters, digits, and upper and lowercased letters. You cannot use a colon (:) in the name.",
  ).optional(),
  TrafficSources: z.array(TrafficSourceIdentifierSchema).describe(
    "The traffic sources associated with this Auto Scaling group.",
  ).optional(),
  DesiredCapacityType: z.string().describe(
    "The unit of measurement for the value specified for desired capacity. Amazon EC2 Auto Scaling supports DesiredCapacityType for attribute-based instance type selection only. For more information, see [Create a mixed instances group using attribute-based instance type selection](https://docs.aws.amazon.com/autoscaling/ec2/userguide/create-mixed-instances-group-attribute-based-instance-type-selection.html) in the *Amazon EC2 Auto Scaling User Guide*. By default, Amazon EC2 Auto Scaling specifies units, which translates into number of instances. Valid values: units | vcpu | memory-mib",
  ).optional(),
  PlacementGroup: z.string().describe(
    "The name of the placement group into which to launch your instances. For more information, see [Placement groups](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html) in the *Amazon EC2 User Guide*. A *cluster* placement group is a logical grouping of instances within a single Availability Zone. You cannot specify multiple Availability Zones and a cluster placement group.",
  ).optional(),
  CapacityReservationSpecification: z.object({
    CapacityReservationPreference: z.string().describe(
      "The capacity reservation preference. The following options are available: capacity-reservations-only - Auto Scaling will only launch instances into a Capacity Reservation or Capacity Reservation resource group. If capacity isn't available, instances will fail to launch. capacity-reservations-first - Auto Scaling will try to launch instances into a Capacity Reservation or Capacity Reservation resource group first. If capacity isn't available, instances will run in On-Demand capacity. none - Auto Scaling will not launch instances into a Capacity Reservation. Instances will run in On-Demand capacity. default - Auto Scaling uses the Capacity Reservation preference from your launch template or an open Capacity Reservation.",
    ),
    CapacityReservationTarget: CapacityReservationTargetSchema.describe(
      "Describes a target Capacity Reservation or Capacity Reservation resource group.",
    ).optional(),
  }).describe(
    "The capacity reservation specification for the Auto Scaling group.",
  ).optional(),
  HealthCheckType: z.string().describe(
    "A comma-separated value string of one or more health check types. The valid values are EC2, EBS, ELB, and VPC_LATTICE. EC2 is the default health check and cannot be disabled. For more information, see [Health checks for instances in an Auto Scaling group](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-health-checks.html) in the *Amazon EC2 Auto Scaling User Guide*. Only specify EC2 if you must clear a value that was previously set.",
  ).optional(),
  MaxInstanceLifetime: z.number().int().describe(
    "The maximum amount of time, in seconds, that an instance can be in service. The default is null. If specified, the value must be either 0 or a number equal to or greater than 86,400 seconds (1 day). For more information, see [Replace Auto Scaling instances based on maximum instance lifetime](https://docs.aws.amazon.com/autoscaling/ec2/userguide/asg-max-instance-lifetime.html) in the *Amazon EC2 Auto Scaling User Guide*.",
  ).optional(),
});

const StateSchema = z.object({
  LifecycleHookSpecificationList: z.array(LifecycleHookSpecificationSchema)
    .optional(),
  LoadBalancerNames: z.array(z.string()).optional(),
  LaunchConfigurationName: z.string().optional(),
  ServiceLinkedRoleARN: z.string().optional(),
  AvailabilityZoneImpairmentPolicy: z.object({
    ZonalShiftEnabled: z.boolean(),
    ImpairedZoneHealthCheckBehavior: z.string(),
  }).optional(),
  TargetGroupARNs: z.array(z.string()).optional(),
  AvailabilityZoneIds: z.array(z.string()).optional(),
  Cooldown: z.string().optional(),
  NotificationConfigurations: z.array(NotificationConfigurationSchema)
    .optional(),
  DesiredCapacity: z.string().optional(),
  HealthCheckGracePeriod: z.number().optional(),
  InstanceLifecyclePolicy: z.object({
    RetentionTriggers: RetentionTriggersSchema,
  }).optional(),
  DefaultInstanceWarmup: z.number().optional(),
  SkipZonalShiftValidation: z.boolean().optional(),
  NewInstancesProtectedFromScaleIn: z.boolean().optional(),
  LaunchTemplate: LaunchTemplateSpecificationSchema.optional(),
  MixedInstancesPolicy: z.object({
    InstancesDistribution: InstancesDistributionSchema,
    LaunchTemplate: LaunchTemplateSchema,
  }).optional(),
  VPCZoneIdentifier: z.array(z.string()).optional(),
  Tags: z.array(TagPropertySchema).optional(),
  Context: z.string().optional(),
  CapacityRebalance: z.boolean().optional(),
  InstanceId: z.string().optional(),
  AutoScalingGroupARN: z.string().optional(),
  AvailabilityZones: z.array(z.string()).optional(),
  NotificationConfiguration: NotificationConfigurationSchema.optional(),
  AvailabilityZoneDistribution: z.object({
    CapacityDistributionStrategy: z.string(),
  }).optional(),
  MetricsCollection: z.array(MetricsCollectionSchema).optional(),
  DeletionProtection: z.string().optional(),
  InstanceMaintenancePolicy: z.object({
    MaxHealthyPercentage: z.number(),
    MinHealthyPercentage: z.number(),
  }).optional(),
  MaxSize: z.string().optional(),
  MinSize: z.string().optional(),
  TerminationPolicies: z.array(z.string()).optional(),
  AutoScalingGroupName: z.string(),
  TrafficSources: z.array(TrafficSourceIdentifierSchema).optional(),
  DesiredCapacityType: z.string().optional(),
  PlacementGroup: z.string().optional(),
  CapacityReservationSpecification: z.object({
    CapacityReservationPreference: z.string(),
    CapacityReservationTarget: CapacityReservationTargetSchema,
  }).optional(),
  HealthCheckType: z.string().optional(),
  MaxInstanceLifetime: z.number().optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  accessKeyId: z.string().meta({ sensitive: true }).optional(),
  secretAccessKey: z.string().meta({ sensitive: true }).optional(),
  sessionToken: z.string().meta({ sensitive: true }).optional(),
  region: z.string().optional(),
  LifecycleHookSpecificationList: z.array(LifecycleHookSpecificationSchema)
    .describe(
      "One or more lifecycle hooks to add to the Auto Scaling group before instances are launched.",
    ).optional(),
  LoadBalancerNames: z.array(z.string()).describe(
    "A list of Classic Load Balancers associated with this Auto Scaling group. For Application Load Balancers, Network Load Balancers, and Gateway Load Balancers, specify the TargetGroupARNs property instead.",
  ).optional(),
  LaunchConfigurationName: z.string().describe(
    "The name of the launch configuration to use to launch instances. Required only if you don't specify LaunchTemplate, MixedInstancesPolicy, or InstanceId.",
  ).optional(),
  ServiceLinkedRoleARN: z.string().describe(
    "The Amazon Resource Name (ARN) of the service-linked role that the Auto Scaling group uses to call other AWS service on your behalf. By default, Amazon EC2 Auto Scaling uses a service-linked role named AWSServiceRoleForAutoScaling, which it creates if it does not exist. For more information, see [Service-linked roles](https://docs.aws.amazon.com/autoscaling/ec2/userguide/autoscaling-service-linked-role.html) in the *Amazon EC2 Auto Scaling User Guide*.",
  ).optional(),
  AvailabilityZoneImpairmentPolicy: z.object({
    ZonalShiftEnabled: z.boolean().describe(
      "If true, enable zonal shift for your Auto Scaling group.",
    ).optional(),
    ImpairedZoneHealthCheckBehavior: z.enum([
      "IgnoreUnhealthy",
      "ReplaceUnhealthy",
    ]).describe(
      "Specifies the health check behavior for the impaired Availability Zone in an active zonal shift. If you select Replace unhealthy, instances that appear unhealthy will be replaced in all Availability Zones. If you select Ignore unhealthy, instances will not be replaced in the Availability Zone with the active zonal shift. For more information, see [Auto Scaling group zonal shift](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-zonal-shift.html) in the *Amazon EC2 Auto Scaling User Guide*.",
    ).optional(),
  }).describe(
    "The Availability Zone impairment policy for the Auto Scaling group.",
  ).optional(),
  TargetGroupARNs: z.array(z.string()).describe(
    "The Amazon Resource Names (ARN) of the Elastic Load Balancing target groups to associate with the Auto Scaling group. Instances are registered as targets with the target groups. The target groups receive incoming traffic and route requests to one or more registered targets. For more information, see [Use Elastic Load Balancing to distribute traffic across the instances in your Auto Scaling group](https://docs.aws.amazon.com/autoscaling/ec2/userguide/autoscaling-load-balancer.html) in the *Amazon EC2 Auto Scaling User Guide*.",
  ).optional(),
  AvailabilityZoneIds: z.array(z.string()).describe(
    "The Availability Zone IDs where the Auto Scaling group can launch instances.",
  ).optional(),
  Cooldown: z.string().describe(
    "*Only needed if you use simple scaling policies.* The amount of time, in seconds, between one scaling activity ending and another one starting due to simple scaling policies. For more information, see [Scaling cooldowns for Amazon EC2 Auto Scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-scaling-cooldowns.html) in the *Amazon EC2 Auto Scaling User Guide*. Default: 300 seconds",
  ).optional(),
  NotificationConfigurations: z.array(NotificationConfigurationSchema).describe(
    "Configures an Auto Scaling group to send notifications when specified events take place.",
  ).optional(),
  DesiredCapacity: z.string().regex(new RegExp("^[0-9]+$")).describe(
    "The desired capacity is the initial capacity of the Auto Scaling group at the time of its creation and the capacity it attempts to maintain. It can scale beyond this capacity if you configure automatic scaling. The number must be greater than or equal to the minimum size of the group and less than or equal to the maximum size of the group. If you do not specify a desired capacity when creating the stack, the default is the minimum size of the group. CloudFormation marks the Auto Scaling group as successful (by setting its status to CREATE_COMPLETE) when the desired capacity is reached. However, if a maximum Spot price is set in the launch template or launch configuration that you specified, then desired capacity is not used as a criteria for success. Whether your request is fulfilled depends on Spot Instance capacity and your maximum price.",
  ).optional(),
  HealthCheckGracePeriod: z.number().int().describe(
    "The amount of time, in seconds, that Amazon EC2 Auto Scaling waits before checking the health status of an EC2 instance that has come into service and marking it unhealthy due to a failed health check. This is useful if your instances do not immediately pass their health checks after they enter the InService state. For more information, see [Set the health check grace period for an Auto Scaling group](https://docs.aws.amazon.com/autoscaling/ec2/userguide/health-check-grace-period.html) in the *Amazon EC2 Auto Scaling User Guide*. Default: 0 seconds",
  ).optional(),
  InstanceLifecyclePolicy: z.object({
    RetentionTriggers: RetentionTriggersSchema.describe(
      "Specifies the conditions that trigger instance retention behavior. These triggers determine when instances should move to a Retained state instead of automatic termination. This allows you to maintain control over instance management when lifecycles transition and operations fail.",
    ).optional(),
  }).describe("The instance lifecycle policy for the Auto Scaling group.")
    .optional(),
  DefaultInstanceWarmup: z.number().int().describe(
    "The amount of time, in seconds, until a new instance is considered to have finished initializing and resource consumption to become stable after it enters the InService state. During an instance refresh, Amazon EC2 Auto Scaling waits for the warm-up period after it replaces an instance before it moves on to replacing the next instance. Amazon EC2 Auto Scaling also waits for the warm-up period before aggregating the metrics for new instances with existing instances in the Amazon CloudWatch metrics that are used for scaling, resulting in more reliable usage data. For more information, see [Set the default instance warmup for an Auto Scaling group](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-default-instance-warmup.html) in the *Amazon EC2 Auto Scaling User Guide*. To manage various warm-up settings at the group level, we recommend that you set the default instance warmup, *even if it is set to 0 seconds*. To remove a value that you previously set, include the property but specify -1 for the value. However, we strongly recommend keeping the default instance warmup enabled by specifying a value of 0 or other nominal value. Default: None",
  ).optional(),
  SkipZonalShiftValidation: z.boolean().optional(),
  NewInstancesProtectedFromScaleIn: z.boolean().describe(
    "Indicates whether newly launched instances are protected from termination by Amazon EC2 Auto Scaling when scaling in. For more information about preventing instances from terminating on scale in, see [Use instance scale-in protection](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-instance-protection.html) in the *Amazon EC2 Auto Scaling User Guide*.",
  ).optional(),
  LaunchTemplate: z.object({
    LaunchTemplateName: z.string().describe(
      "The name of the launch template. You must specify the LaunchTemplateName or the LaunchTemplateID, but not both.",
    ).optional(),
    Version: z.string().describe(
      "The version number of the launch template. Specifying $Latest or $Default for the template version number is not supported. However, you can specify LatestVersionNumber or DefaultVersionNumber using the Fn::GetAtt intrinsic function. For more information, see [Fn::GetAtt](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-getatt.html). For an example of using the Fn::GetAtt function, see the [Examples](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html#aws-resource-autoscaling-autoscalinggroup--examples) section of the AWS::AutoScaling::AutoScalingGroup resource.",
    ).optional(),
    LaunchTemplateId: z.string().describe(
      "The ID of the launch template. You must specify the LaunchTemplateID or the LaunchTemplateName, but not both.",
    ).optional(),
  }).describe(
    "Information used to specify the launch template and version to use to launch instances. You can alternatively associate a launch template to the Auto Scaling group by specifying a MixedInstancesPolicy. For more information about creating launch templates, see [Create a launch template for an Auto Scaling group](https://docs.aws.amazon.com/autoscaling/ec2/userguide/create-launch-template.html) in the *Amazon EC2 Auto Scaling User Guide*. If you omit this property, you must specify MixedInstancesPolicy, LaunchConfigurationName, or InstanceId.",
  ).optional(),
  MixedInstancesPolicy: z.object({
    InstancesDistribution: InstancesDistributionSchema.describe(
      "The instances distribution.",
    ).optional(),
    LaunchTemplate: LaunchTemplateSchema.describe(
      "One or more launch templates and the instance types (overrides) that are used to launch EC2 instances to fulfill the configured capacities.",
    ).optional(),
  }).describe(
    "An embedded object that specifies a mixed instances policy. The policy includes properties that not only define the distribution of On-Demand Instances and Spot Instances, the maximum price to pay for Spot Instances (optional), and how the Auto Scaling group allocates instance types to fulfill On-Demand and Spot capacities, but also the properties that specify the instance configuration information—the launch template and instance types. The policy can also include a weight for each instance type and different launch templates for individual instance types. For more information, see [Auto Scaling groups with multiple instance types and purchase options](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-mixed-instances-groups.html) in the *Amazon EC2 Auto Scaling User Guide*.",
  ).optional(),
  VPCZoneIdentifier: z.array(z.string()).describe(
    "A list of subnet IDs for a virtual private cloud (VPC) where instances in the Auto Scaling group can be created. If this resource specifies public subnets and is also in a VPC that is defined in the same stack template, you must use the [DependsOn attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-dependson.html) to declare a dependency on the [VPC-gateway attachment](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpc-gateway-attachment.html). When you update VPCZoneIdentifier, this retains the same Auto Scaling group and replaces old instances with new ones, according to the specified subnets. To control how CloudFormation replaces the instances, add an [UpdatePolicy attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-updatepolicy.html) to your stack. Set the update policy to AutoScalingInstanceRefresh. For more information, see the [AutoScalingInstanceRefresh policy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-updatepolicy.html#cfn-attributes-updatepolicy-instancerefresh). Required to launch instances into a nondefault VPC. If you specify VPCZoneIdentifier with AvailabilityZones, the subnets that you specify for this property must reside in those Availability Zones.",
  ).optional(),
  Tags: z.array(TagPropertySchema).describe(
    "One or more tags. You can tag your Auto Scaling group and propagate the tags to the Amazon EC2 instances it launches. Tags are not propagated to Amazon EBS volumes. To add tags to Amazon EBS volumes, specify the tags in a launch template but use caution. If the launch template specifies an instance tag with a key that is also specified for the Auto Scaling group, Amazon EC2 Auto Scaling overrides the value of that instance tag with the value specified by the Auto Scaling group. For more information, see [Tag Auto Scaling groups and instances](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-tagging.html) in the *Amazon EC2 Auto Scaling User Guide*.",
  ).optional(),
  Context: z.string().describe("Reserved.").optional(),
  CapacityRebalance: z.boolean().describe(
    "Indicates whether Capacity Rebalancing is enabled. Otherwise, Capacity Rebalancing is disabled. When you turn on Capacity Rebalancing, Amazon EC2 Auto Scaling attempts to launch a Spot Instance whenever Amazon EC2 notifies that a Spot Instance is at an elevated risk of interruption. After launching a new instance, it then terminates an old instance. For more information, see [Use Capacity Rebalancing to handle Amazon EC2 Spot Interruptions](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-capacity-rebalancing.html) in the in the *Amazon EC2 Auto Scaling User Guide*.",
  ).optional(),
  InstanceId: z.string().describe(
    "The ID of the instance used to base the launch configuration on. For more information, see [Create an Auto Scaling group using an EC2 instance](https://docs.aws.amazon.com/autoscaling/ec2/userguide/create-asg-from-instance.html) in the *Amazon EC2 Auto Scaling User Guide*. If you specify LaunchTemplate, MixedInstancesPolicy, or LaunchConfigurationName, don't specify InstanceId.",
  ).optional(),
  AvailabilityZones: z.array(z.string()).describe(
    "A list of Availability Zones where instances in the Auto Scaling group can be created. Used for launching into the default VPC subnet in each Availability Zone when not using the VPCZoneIdentifier property, or for attaching a network interface when an existing network interface ID is specified in a launch template.",
  ).optional(),
  NotificationConfiguration: z.object({
    TopicARN: z.array(z.string()).describe(
      "The Amazon Resource Name (ARN) of the Amazon SNS topic.",
    ).optional(),
    NotificationTypes: z.array(z.string()).describe(
      "A list of event types that send a notification. Event types can include any of the following types. *Allowed values*: autoscaling:EC2_INSTANCE_LAUNCH autoscaling:EC2_INSTANCE_LAUNCH_ERROR autoscaling:EC2_INSTANCE_TERMINATE autoscaling:EC2_INSTANCE_TERMINATE_ERROR autoscaling:TEST_NOTIFICATION",
    ).optional(),
  }).describe(
    "A structure that specifies an Amazon SNS notification configuration for the NotificationConfigurations property of the [AWS::AutoScaling::AutoScalingGroup](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html) resource. For an example template snippet, see [Configure Amazon EC2 Auto Scaling resources](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/quickref-ec2-auto-scaling.html). For more information, see [Get Amazon SNS notifications when your Auto Scaling group scales](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ASGettingNotifications.html) in the *Amazon EC2 Auto Scaling User Guide*.",
  ).optional(),
  AvailabilityZoneDistribution: z.object({
    CapacityDistributionStrategy: z.enum([
      "balanced-best-effort",
      "balanced-only",
      "reservations-then-balanced",
    ]).describe(
      "If launches fail in an Availability Zone, the following strategies are available. The default is balanced-best-effort. balanced-only - If launches fail in an Availability Zone, Auto Scaling will continue to attempt to launch in the unhealthy zone to preserve a balanced distribution. balanced-best-effort - If launches fail in an Availability Zone, Auto Scaling will attempt to launch in another healthy Availability Zone instead. reservations-then-balanced - Auto Scaling will first attempt to launch into your Capacity Reservations, and then balance any remaining capacity across healthy Availability Zones.",
    ).optional(),
  }).describe(
    "The EC2 instance capacity distribution across Availability Zones for the Auto Scaling group.",
  ).optional(),
  MetricsCollection: z.array(MetricsCollectionSchema).describe(
    "Enables the monitoring of group metrics of an Auto Scaling group. By default, these metrics are disabled.",
  ).optional(),
  DeletionProtection: z.string().describe(
    "The deletion protection setting for the Auto Scaling group.",
  ).optional(),
  InstanceMaintenancePolicy: z.object({
    MaxHealthyPercentage: z.number().int().describe(
      "Specifies the upper threshold as a percentage of the desired capacity of the Auto Scaling group. It represents the maximum percentage of the group that can be in service and healthy, or pending, to support your workload when replacing instances. Value range is 100 to 200. To clear a previously set value, specify a value of -1. Both MinHealthyPercentage and MaxHealthyPercentage must be specified, and the difference between them cannot be greater than 100. A large range increases the number of instances that can be replaced at the same time.",
    ).optional(),
    MinHealthyPercentage: z.number().int().describe(
      "Specifies the lower threshold as a percentage of the desired capacity of the Auto Scaling group. It represents the minimum percentage of the group to keep in service, healthy, and ready to use to support your workload when replacing instances. Value range is 0 to 100. To clear a previously set value, specify a value of -1.",
    ).optional(),
  }).describe(
    "An instance maintenance policy. For more information, see [Set instance maintenance policy](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-instance-maintenance-policy.html) in the *Amazon EC2 Auto Scaling User Guide*.",
  ).optional(),
  MaxSize: z.string().regex(new RegExp("^[0-9]+$")).describe(
    "The maximum size of the group. With a mixed instances policy that uses instance weighting, Amazon EC2 Auto Scaling may need to go above MaxSize to meet your capacity requirements. In this event, Amazon EC2 Auto Scaling will never go above MaxSize by more than your largest instance weight (weights that define how many units each instance contributes to the desired capacity of the group).",
  ).optional(),
  MinSize: z.string().regex(new RegExp("^[0-9]+$")).describe(
    "The minimum size of the group.",
  ).optional(),
  TerminationPolicies: z.array(z.string()).describe(
    "A policy or a list of policies that are used to select the instance to terminate. These policies are executed in the order that you list them. For more information, see [Configure termination policies for Amazon EC2 Auto Scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-termination-policies.html) in the *Amazon EC2 Auto Scaling User Guide*. Valid values: Default | AllocationStrategy | ClosestToNextInstanceHour | NewestInstance | OldestInstance | OldestLaunchConfiguration | OldestLaunchTemplate | arn:aws:lambda:region:account-id:function:my-function:my-alias",
  ).optional(),
  AutoScalingGroupName: z.string().describe(
    "The name of the Auto Scaling group. This name must be unique per Region per account. The name can contain any ASCII character 33 to 126 including most punctuation characters, digits, and upper and lowercased letters. You cannot use a colon (:) in the name.",
  ).optional(),
  TrafficSources: z.array(TrafficSourceIdentifierSchema).describe(
    "The traffic sources associated with this Auto Scaling group.",
  ).optional(),
  DesiredCapacityType: z.string().describe(
    "The unit of measurement for the value specified for desired capacity. Amazon EC2 Auto Scaling supports DesiredCapacityType for attribute-based instance type selection only. For more information, see [Create a mixed instances group using attribute-based instance type selection](https://docs.aws.amazon.com/autoscaling/ec2/userguide/create-mixed-instances-group-attribute-based-instance-type-selection.html) in the *Amazon EC2 Auto Scaling User Guide*. By default, Amazon EC2 Auto Scaling specifies units, which translates into number of instances. Valid values: units | vcpu | memory-mib",
  ).optional(),
  PlacementGroup: z.string().describe(
    "The name of the placement group into which to launch your instances. For more information, see [Placement groups](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html) in the *Amazon EC2 User Guide*. A *cluster* placement group is a logical grouping of instances within a single Availability Zone. You cannot specify multiple Availability Zones and a cluster placement group.",
  ).optional(),
  CapacityReservationSpecification: z.object({
    CapacityReservationPreference: z.string().describe(
      "The capacity reservation preference. The following options are available: capacity-reservations-only - Auto Scaling will only launch instances into a Capacity Reservation or Capacity Reservation resource group. If capacity isn't available, instances will fail to launch. capacity-reservations-first - Auto Scaling will try to launch instances into a Capacity Reservation or Capacity Reservation resource group first. If capacity isn't available, instances will run in On-Demand capacity. none - Auto Scaling will not launch instances into a Capacity Reservation. Instances will run in On-Demand capacity. default - Auto Scaling uses the Capacity Reservation preference from your launch template or an open Capacity Reservation.",
    ).optional(),
    CapacityReservationTarget: CapacityReservationTargetSchema.describe(
      "Describes a target Capacity Reservation or Capacity Reservation resource group.",
    ).optional(),
  }).describe(
    "The capacity reservation specification for the Auto Scaling group.",
  ).optional(),
  HealthCheckType: z.string().describe(
    "A comma-separated value string of one or more health check types. The valid values are EC2, EBS, ELB, and VPC_LATTICE. EC2 is the default health check and cannot be disabled. For more information, see [Health checks for instances in an Auto Scaling group](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-health-checks.html) in the *Amazon EC2 Auto Scaling User Guide*. Only specify EC2 if you must clear a value that was previously set.",
  ).optional(),
  MaxInstanceLifetime: z.number().int().describe(
    "The maximum amount of time, in seconds, that an instance can be in service. The default is null. If specified, the value must be either 0 or a number equal to or greater than 86,400 seconds (1 day). For more information, see [Replace Auto Scaling instances based on maximum instance lifetime](https://docs.aws.amazon.com/autoscaling/ec2/userguide/asg-max-instance-lifetime.html) in the *Amazon EC2 Auto Scaling User Guide*.",
  ).optional(),
});

const _credentialKeys = new Set([
  "accessKeyId",
  "secretAccessKey",
  "sessionToken",
  "region",
]);

function _buildCredentials(g: Record<string, unknown>): AwsCredentials {
  return {
    accessKeyId: g.accessKeyId as string | undefined,
    secretAccessKey: g.secretAccessKey as string | undefined,
    sessionToken: g.sessionToken as string | undefined,
    region: g.region as string | undefined,
  };
}

/** Swamp extension model for AutoScaling AutoScalingGroup. Registered at `@swamp/aws/autoscaling/auto-scaling-group`. */
export const model = {
  type: "@swamp/aws/autoscaling/auto-scaling-group",
  version: "2026.09.16.1",
  upgrades: [
    {
      toVersion: "2026.03.27.1",
      description: "Added: AvailabilityZoneIds",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.04.01.1",
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
      toVersion: "2026.04.23.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.04.23.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.06.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.06.06.1",
      description: "Added: accessKeyId, secretAccessKey, sessionToken, region",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.06.08.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.06.15.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.02.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.16.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.17.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.17.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.26.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.16.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "AutoScaling AutoScalingGroup resource state",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a AutoScaling AutoScalingGroup",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const credentials = _buildCredentials(g);
        const desiredState: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(g)) {
          if (_credentialKeys.has(key)) continue;
          if (value !== undefined) desiredState[key] = value;
        }
        const result = await createResource(
          "AWS::AutoScaling::AutoScalingGroup",
          desiredState,
          credentials,
        ) as StateData;
        const instanceName =
          ((result.AutoScalingGroupName ?? g.AutoScalingGroupName)
            ?.toString() ?? "current").replace(/[\/\\]/g, "_").replace(
              /\.\./g,
              "_",
            ).replace(/\0/g, "");
        const handle = await context.writeResource(
          "state",
          instanceName,
          result,
        );
        return { dataHandles: [handle] };
      },
    },
    get: {
      description: "Get a AutoScaling AutoScalingGroup",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the AutoScaling AutoScalingGroup",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const result = await readResource(
          "AWS::AutoScaling::AutoScalingGroup",
          args.identifier,
          credentials,
        ) as StateData;
        const instanceName = ((result.AutoScalingGroupName ??
          context.globalArgs.AutoScalingGroupName)?.toString() ??
          args.identifier).replace(/[\/\\]/g, "_").replace(/\.\./g, "_")
          .replace(/\0/g, "");
        const handle = await context.writeResource(
          "state",
          instanceName,
          result,
        );
        return { dataHandles: [handle] };
      },
    },
    update: {
      description: "Update a AutoScaling AutoScalingGroup",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const credentials = _buildCredentials(g);
        const instanceName = (g.AutoScalingGroupName?.toString() ?? "current")
          .replace(/[\/\\]/g, "_").replace(/\.\./g, "_").replace(/\0/g, "");
        const content = await context.dataRepository.getContent(
          context.modelType,
          context.modelId,
          instanceName,
        );
        if (!content) {
          throw new Error("No existing state found - run create or get first");
        }
        const existing = JSON.parse(new TextDecoder().decode(content));
        const identifier = existing.AutoScalingGroupName?.toString();
        if (!identifier) {
          throw new Error("No identifier found in existing state");
        }
        const currentState = await readResource(
          "AWS::AutoScaling::AutoScalingGroup",
          identifier,
          credentials,
        ) as StateData;
        const desiredState: Record<string, unknown> = { ...currentState };
        for (const [key, value] of Object.entries(g)) {
          if (_credentialKeys.has(key)) continue;
          if (value !== undefined) desiredState[key] = value;
        }
        const result = await updateResource(
          "AWS::AutoScaling::AutoScalingGroup",
          identifier,
          currentState,
          desiredState,
          ["InstanceId", "AutoScalingGroupName"],
          credentials,
        );
        const handle = await context.writeResource(
          "state",
          instanceName,
          result,
        );
        return { dataHandles: [handle] };
      },
    },
    delete: {
      description: "Delete a AutoScaling AutoScalingGroup",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the AutoScaling AutoScalingGroup",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const { existed } = await deleteResource(
          "AWS::AutoScaling::AutoScalingGroup",
          args.identifier,
          credentials,
        );
        const instanceName =
          (context.globalArgs.AutoScalingGroupName?.toString() ??
            args.identifier).replace(/[\/\\]/g, "_").replace(/\.\./g, "_")
            .replace(/\0/g, "");
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
      description: "Sync AutoScaling AutoScalingGroup state from AWS",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const credentials = _buildCredentials(g);
        const instanceName = (g.AutoScalingGroupName?.toString() ?? "current")
          .replace(/[\/\\]/g, "_").replace(/\.\./g, "_").replace(/\0/g, "");
        const content = await context.dataRepository.getContent(
          context.modelType,
          context.modelId,
          instanceName,
        );
        if (!content) {
          throw new Error("No existing state found - run create or get first");
        }
        const existing = JSON.parse(new TextDecoder().decode(content));
        const identifier = existing.AutoScalingGroupName?.toString();
        if (!identifier) {
          throw new Error("No identifier found in existing state");
        }
        try {
          const result = await readResource(
            "AWS::AutoScaling::AutoScalingGroup",
            identifier,
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
              identifier,
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
      description: "List AutoScaling AutoScalingGroup resources",
      arguments: z.object({
        maxPages: z.number().describe(
          "Maximum number of pages to fetch (default: 10)",
        ).optional(),
        resourceModel: z.string().describe(
          "JSON resource model for parent-scoped listing (e.g. parent identifier)",
        ).optional(),
      }),
      execute: async (
        args: { maxPages?: number; resourceModel?: string },
        context: any,
      ) => {
        const credentials = _buildCredentials(context.globalArgs);
        const { items, nextToken } = await listResources(
          "AWS::AutoScaling::AutoScalingGroup",
          {
            resourceModel: args.resourceModel,
            maxPages: args.maxPages,
            credentials,
          },
        );
        const dataHandles = [];
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const instanceName =
            (item.properties?.AutoScalingGroupName?.toString() ??
              item.identifier).replace(/[\/\\]/g, "_").replace(/\.\./g, "_")
              .replace(/\0/g, "");
          const handle = await context.writeResource("state", instanceName, {
            ...item.properties,
            _identifier: item.identifier,
          });
          dataHandles.push(handle);
        }
        return {
          dataHandles,
          result: { count: items.length, nextPageToken: nextToken },
        };
      },
    },
  },
};

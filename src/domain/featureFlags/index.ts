export interface FeatureFlags {
  discoveryEnabled: boolean;
  inboxEnabled: boolean;
  settingsEnabled: boolean;
}

export const featureFlags: FeatureFlags = {
  discoveryEnabled: true,
  inboxEnabled: true,
  settingsEnabled: true,
};

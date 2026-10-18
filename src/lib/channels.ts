export const channelLabels: Record<string, string> = {
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook_marketplace: "Facebook",
  in_person: "Presencial",
  other: "Otro",
};

export const channelColors: Record<string, string> = {
  whatsapp: "bg-green-500",
  instagram: "bg-pink-500",
  tiktok: "bg-slate-900",
  facebook_marketplace: "bg-blue-600",
  in_person: "bg-amber-500",
  other: "bg-slate-400",
};

export function getChannelLabel(channel: string): string {
  return channelLabels[channel] ?? channelLabels.other;
}

export function getChannelColor(channel: string): string {
  return channelColors[channel] ?? channelColors.other;
}

export function getChannelInitials(channel: string): string {
  const label = getChannelLabel(channel);
  return label.slice(0, 2).toUpperCase();
}
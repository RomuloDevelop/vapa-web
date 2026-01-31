// Oil & Gas industry related images from Unsplash
export const eventImages = [
  // Oil refinery at sunset
  "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&fit=crop",
  // Oil pump jack
  "https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800&fit=crop",
  // Industrial oil refinery
  "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&fit=crop",
  // Offshore oil platform
  "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=800&fit=crop",
  // Oil tanker ship
  "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&fit=crop",
  // Pipeline infrastructure
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&fit=crop",
  // Oil drilling operation
  "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&fit=crop",
  // Refinery at night
  "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&fit=crop",
  // Gas flare
  "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&fit=crop",
  // Industrial energy complex
  "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=800&fit=crop",
  // Oil field landscape
  "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&fit=crop",
];

export function getImage(index: number): string {
  return eventImages[index % eventImages.length];
}

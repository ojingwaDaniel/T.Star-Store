const unsplash = (id, width = 1000) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

export const IMAGES = {
  // Main campaign imagery
  hero: unsplash("photo-1767661666283-b559647360e8", 1800),
  heroSecondary: unsplash("photo-1771919371651-04d6ec4c239a", 1000),

  // Collections
  collectionMen: unsplash("photo-1771919322950-8b9500607616"),
  collectionWomen: unsplash("photo-1591504771094-a1ca4de142d7"),
  collectionUnisex: unsplash("photo-1771919371651-04d6ec4c239a"),
  collectionStreetwear: unsplash("photo-1767661666283-b559647360e8"),
  collectionSportswear: unsplash("photo-1736264335301-7307be0c2f74"),

  // Marketing sections
  promoBanner: unsplash("photo-1771919388241-27e45ef310b0", 1800),
  brandStory: unsplash("photo-1771919322950-8b9500607616"),
  lookbook: [
    unsplash("photo-1767661666283-b559647360e8"),
    unsplash("photo-1771919371651-04d6ec4c239a"),
    unsplash("photo-1591504771094-a1ca4de142d7"),
    unsplash("photo-1771919322950-8b9500607616"),
  ],

  aboutHero: unsplash("photo-1771919388241-27e45ef310b0", 1800),
  aboutPortrait: unsplash("photo-1771919322950-8b9500607616"),
};

export const PRODUCT_IMAGES = {
  "slipstream-hoodie": [
    unsplash("photo-1793443696225-7ec493d220b0"),
    unsplash("photo-1742268582641-7dbe0ea10c82"),
    unsplash("photo-1523124006244-a37848c6002c"),
  ],

  "velocity-track-jacket": [
    unsplash("photo-1736264335301-7307be0c2f74"),
    unsplash("photo-1767661666283-b559647360e8"),
    unsplash("photo-1771919371651-04d6ec4c239a"),
  ],

  "apex-compression-tee": [
    unsplash("photo-1591504771094-a1ca4de142d7"),
    unsplash("photo-1736264335301-7307be0c2f74"),
    unsplash("photo-1584464432902-7a05792ff66d"),
  ],

  "nova-cropped-hoodie": [
    unsplash("photo-1736264335301-7307be0c2f74"),
    unsplash("photo-1591504771094-a1ca4de142d7"),
    unsplash("photo-1584464432902-7a05792ff66d"),
  ],

  "meridian-cargo-pants": [
    unsplash("photo-1767661666283-b559647360e8"),
    unsplash("photo-1771919322950-8b9500607616"),
    unsplash("photo-1793443696225-7ec493d220b0"),
  ],

  "orbit-seamless-leggings": [
    unsplash("photo-1591504771094-a1ca4de142d7"),
    unsplash("photo-1736264335301-7307be0c2f74"),
    unsplash("photo-1584464432902-7a05792ff66d"),
  ],

  "starline-oversized-tee": [
    unsplash("photo-1771919388241-27e45ef310b0"),
    unsplash("photo-1771919322950-8b9500607616"),
    unsplash("photo-1771919371651-04d6ec4c239a"),
  ],

  "pulse-training-shorts": [
    unsplash("photo-1736264335301-7307be0c2f74"),
    unsplash("photo-1584464432902-7a05792ff66d"),
    unsplash("photo-1591504771094-a1ca4de142d7"),
  ],

  "eclipse-bomber-jacket": [
    unsplash("photo-1771919322950-8b9500607616"),
    unsplash("photo-1771919371651-04d6ec4c239a"),
    unsplash("photo-1767661666283-b559647360e8"),
  ],

  "aura-sports-bra": [
    unsplash("photo-1591504771094-a1ca4de142d7"),
    unsplash("photo-1736264335301-7307be0c2f74"),
    unsplash("photo-1584464432902-7a05792ff66d"),
  ],

  "drift-wide-leg-joggers": [
    unsplash("photo-1771919322950-8b9500607616"),
    unsplash("photo-1591504771094-a1ca4de142d7"),
    unsplash("photo-1771919388241-27e45ef310b0"),
  ],

  "comet-windbreaker": [
    unsplash("photo-1736264335301-7307be0c2f74"),
    unsplash("photo-1771919371651-04d6ec4c239a"),
    unsplash("photo-1767661666283-b559647360e8"),
  ],

  "zenith-co-ord-set": [
    unsplash("photo-1771919371651-04d6ec4c239a"),
    unsplash("photo-1771919322950-8b9500607616"),
    unsplash("photo-1767661666283-b559647360e8"),
  ],

  "blaze-graphic-tee": [
    unsplash("photo-1771919388241-27e45ef310b0"),
    unsplash("photo-1767661666283-b559647360e8"),
    unsplash("photo-1771919371651-04d6ec4c239a"),
  ],

  "star-dad-cap": [
    unsplash("photo-1657205792890-a754f5b3ca69"),
    unsplash("photo-1784433340467-62ac29a0e51a"),
    unsplash("photo-1771919371651-04d6ec4c239a"),
  ],

  "sprint-tank": [
    unsplash("photo-1736264335301-7307be0c2f74"),
    unsplash("photo-1591504771094-a1ca4de142d7"),
    unsplash("photo-1584464432902-7a05792ff66d"),
  ],
};

export const VIDEOS = {
  hero: {
    youtubeId: "",
    mp4: "",
    webm: "",
    poster: IMAGES.hero,
  },
};

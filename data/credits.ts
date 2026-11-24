/**
 * Third-party 3D models shipped on the site. The CC BY 4.0 models require
 * this credit, a link to the licence, and a note that they were changed
 * (rescaled, re-rigged, re-materialed). Keep in step with public/models and
 * ASSET_INVENTORY.md.
 */
export type ModelCredit = {
  title: string;
  author: string;
  source: string;
  license: "CC BY 4.0" | "CC0";
};

export const modelCredits: ModelCredit[] = [
  {
    title: "Robot Arm",
    author: "David06",
    source:
      "https://sketchfab.com/3d-models/robot-arm-2370f3522d4446eaabd1a319d10b7e22",
    license: "CC BY 4.0"
  },
  {
    title: "Gaming Laptop",
    author: "Blue Lantern",
    source:
      "https://sketchfab.com/3d-models/gaming-laptop-4e72a2078b3c4a75a821ab09830693fe",
    license: "CC BY 4.0"
  },
  {
    title: "Arduino Uno R3, Elegoo",
    author: "Lassi Kaukonen",
    source:
      "https://sketchfab.com/3d-models/arduino-uno-r3-elegoo-69d58a27ae814b429e39b2c19d648cdd",
    license: "CC BY 4.0"
  },
  {
    title: "Raspberry",
    author: "objets3D",
    source:
      "https://sketchfab.com/3d-models/raspberry-d045eaf534384d9eb926245a5a09ead4",
    license: "CC BY 4.0"
  },
  {
    title: "Monitor",
    author: "seanbonsenge",
    source:
      "https://sketchfab.com/3d-models/monitor-951acc26013f4652a81c7438a4f5b30b",
    license: "CC BY 4.0"
  },
  {
    title: "Universal Base Characters",
    author: "Quaternius",
    source: "https://quaternius.com/packs/universalbasecharacters.html",
    license: "CC0"
  }
];

export const CC_BY_URL = "https://creativecommons.org/licenses/by/4.0/";

const equipmentIconMap: Record<string, string> = {
  // Rifles
  weapon_ak47: "ak47.svg",
  weapon_awp: "awp.svg",
  weapon_m4a1_silencer: "m4a1_silencer.svg",
  weapon_m4a1: "m4a1.svg",
  weapon_m4a4: "m4a1.svg",
  weapon_galilar: "galilar.svg",
  weapon_famas: "famas.svg",
  weapon_sg556: "sg556.svg",
  weapon_aug: "aug.svg",
  weapon_ssg08: "ssg08.svg",
  weapon_g3sg1: "g3sg1.svg",
  weapon_scar20: "scar20.svg",
  // SMGs
  weapon_mp5sd: "mp5sd.svg",
  weapon_mp7: "mp7.svg",
  weapon_mp9: "mp9.svg",
  weapon_mac10: "mac10.svg",
  weapon_ump45: "ump45.svg",
  weapon_p90: "p90.svg",
  weapon_bizon: "bizon.svg",
  // Pistols
  weapon_deagle: "deagle.svg",
  weapon_glock: "glock.svg",
  weapon_usp_silencer: "usp_silencer.svg",
  weapon_hkp2000: "hkp2000.svg",
  weapon_p250: "p250.svg",
  weapon_fiveseven: "fiveseven.svg",
  weapon_tec9: "tec9.svg",
  weapon_cz75a: "cz75a.svg",
  weapon_revolver: "revolver.svg",
  weapon_elite: "elite.svg",
  // Heavy
  weapon_nova: "nova.svg",
  weapon_xm1014: "xm1014.svg",
  weapon_sawedoff: "sawedoff.svg",
  weapon_mag7: "mag7.svg",
  weapon_m249: "m249.svg",
  weapon_negev: "negev.svg",
  // Grenades
  weapon_hegrenade: "hegrenade.svg",
  weapon_flashbang: "flashbang.svg",
  weapon_smokegrenade: "smokegrenade.svg",
  weapon_molotov: "molotov.svg",
  weapon_incgrenade: "incgrenade.svg",
  weapon_decoy: "decoy.svg",
  // Equipment
  weapon_c4: "c4.svg",
  weapon_knife: "knife.svg",
};

interface WeaponIconProps {
  weaponName?: string;
  className?: string;
}

export function getEquipmentIconPath(equipmentName = "weapon_knife") {
  if (equipmentIconMap[equipmentName]) {
    return `/equipment/${equipmentIconMap[equipmentName]}`;
  }
  // Fallback: strip prefix and try filename directly
  const normalized = equipmentName
    .replace(/^item_/, "")
    .replace(/^weapon_/, "");
  return `/equipment/${normalized}.svg`;
}

export function WeaponIcon({ weaponName = "weapon_knife", className = "h-9 w-20" }: WeaponIconProps) {
  return (
    <img
      src={getEquipmentIconPath(weaponName)}
      alt={weaponName.replace("weapon_", "")}
      className={`${className} object-contain brightness-0 invert`}
      onError={(e) => {
        e.currentTarget.src = "/equipment/ak47.svg";
      }}
    />
  );
}

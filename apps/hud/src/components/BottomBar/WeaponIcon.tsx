const equipmentIconMap: Record<string, string> = {
  weapon_ak47: "ak47.svg",
  weapon_awp: "awp.svg",
  weapon_m4a1_silencer: "m4a1_silencer.svg",
  weapon_m4a1: "m4a1.svg",
  weapon_deagle: "deagle.svg",
  weapon_galilar: "galilar.svg",
  weapon_hegrenade: "hegrenade.svg",
  weapon_flashbang: "flashbang.svg",
  weapon_smokegrenade: "smokegrenade.svg",
  weapon_molotov: "molotov.svg",
  weapon_incgrenade: "incgrenade.svg",
  weapon_decoy: "decoy.svg",
  weapon_c4: "c4.svg",
  weapon_knife: "knife.svg"
};

interface WeaponIconProps {
  weaponName?: string;
  className?: string;
}

export function getEquipmentIconPath(equipmentName = "weapon_knife") {
  const normalized = equipmentName.replace("item_", "").replace("weapon_", "");
  const icon = equipmentIconMap[equipmentName] ?? `${normalized}.svg`;

  return `/equipment/${icon}`;
}

export function WeaponIcon({ weaponName = "weapon_knife", className = "h-9 w-20" }: WeaponIconProps) {
  const fallback = "/equipment/ak47.svg";

  return (
    <img
      src={getEquipmentIconPath(weaponName)}
      alt={weaponName.replace("weapon_", "")}
      className={`${className} object-contain brightness-0 invert`}
      onError={(event) => {
        event.currentTarget.src = fallback;
      }}
    />
  );
}

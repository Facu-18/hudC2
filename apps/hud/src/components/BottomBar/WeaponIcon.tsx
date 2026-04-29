const weaponIconMap: Record<string, string> = {
  weapon_ak47: "ak47.svg",
  weapon_awp: "awp.svg",
  weapon_m4a1_silencer: "m4a1_silencer.svg",
  weapon_m4a1: "m4a1.svg",
  weapon_deagle: "deagle.svg",
  weapon_galilar: "galilar.svg",
  weapon_knife: "knife.svg"
};

interface WeaponIconProps {
  weaponName?: string;
}

export function WeaponIcon({ weaponName = "weapon_knife" }: WeaponIconProps) {
  const icon = weaponIconMap[weaponName] ?? "rifle.svg";

  return (
    <img
      src={`/weapons/${icon}`}
      alt={weaponName.replace("weapon_", "")}
      className="h-9 w-20 object-contain brightness-0 invert"
    />
  );
}

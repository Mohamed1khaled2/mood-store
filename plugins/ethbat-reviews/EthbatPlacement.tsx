import EthbatWidgetBlock from "./EthbatWidgetBlock";
import { resolvePlacementDisplay } from "./config";
import { getEthbatSettings } from "./storage";
import type { EthbatLanguage, EthbatPlacement } from "./types";

type Props = {
  placement: EthbatPlacement;
  locale: EthbatLanguage;
  className?: string;
  wrapperClassName?: string;
  heading?: string;
};

export default async function EthbatPlacementBlock({
  placement,
  locale,
  className,
  wrapperClassName,
  heading,
}: Props) {
  const settings = await getEthbatSettings();
  const placementSettings = settings.placements[placement];

  if (!settings.enabled || !placementSettings.enabled) return null;

  return (
    <div className={wrapperClassName}>
      <EthbatWidgetBlock
        storeSlug={settings.storeSlug}
        display={resolvePlacementDisplay(settings, placement, locale)}
        className={className}
        heading={heading}
      />
    </div>
  );
}

import { Plane } from "lucide-react";
import { useState } from "react";

const AIRLINE_IATA_MAP: Record<string, string> = {
  티웨이항공: "TW",
  트리니티항공: "TW",
  대한항공: "KE",
  아시아나항공: "OZ",
  제주항공: "7C",
  진에어: "LJ",
  에어부산: "BX",
  에어서울: "RS",
  이스타항공: "ZE",
  피치항공: "MM",
  일본항공: "JL",
  전일본공수: "NH",
  중국동방항공: "MU",
};

interface AirlineLogoProps {
  airlineName: string;
  className?: string;
  size?: number;
}

export const AirlineLogo: React.FC<AirlineLogoProps> = ({
  airlineName,
  className = "w-5 h-5",
  size = 20,
}) => {
  const [hasError, setHasError] = useState(false);

  // IATA 코드 추출
  const code =
    AIRLINE_IATA_MAP[airlineName] ||
    (airlineName.startsWith("TW")
      ? "TW"
      : airlineName.startsWith("KE")
        ? "KE"
        : airlineName.startsWith("OZ")
          ? "OZ"
          : airlineName.startsWith("7C")
            ? "7C"
            : airlineName.startsWith("LJ")
              ? "LJ"
              : airlineName.startsWith("BX")
                ? "BX"
                : airlineName.startsWith("RS")
                  ? "RS"
                  : airlineName.startsWith("ZE")
                    ? "ZE"
                    : airlineName.startsWith("MM")
                      ? "MM"
                      : airlineName.startsWith("JL")
                        ? "JL"
                        : airlineName.startsWith("NH")
                          ? "NH"
                          : airlineName.startsWith("MU")
                            ? "MU"
                            : "");

  const logoUrl = code
    ? `https://logos.skyscnr.com/images/airlines/favicon/${code}.png`
    : "";

  if (hasError || !logoUrl) {
    const isTway =
      airlineName.includes("티웨이") ||
      airlineName.includes("트리니티") ||
      airlineName.startsWith("TW");

    if (isTway) {
      return (
        <span
          style={{ width: size, height: size }}
          className="rounded-full bg-rose-50 text-rose-500 font-black text-[10px] flex items-center justify-center shrink-0 border border-rose-100 shadow-2xs"
        >
          t'
        </span>
      );
    }

    return (
      <span
        style={{ width: size, height: size }}
        className="rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100"
      >
        <Plane size={Math.round(size * 0.6)} />
      </span>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={airlineName}
      style={{ width: size, height: size }}
      onError={() => setHasError(true)}
      className={`${className} object-contain rounded-full shrink-0 shadow-2xs`}
    />
  );
};

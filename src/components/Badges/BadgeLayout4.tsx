import type { BadgeData } from "../../types/badge.type";
import StarRating from "./StarRatingDisplay";

type BadgeLayout4Props = {
  badgeData: BadgeData;
};

const BadgeLayout4 = ({ badgeData }: BadgeLayout4Props) => {
  return (
    <a
      href={badgeData.openLink}
      target="_blank"
      style={{ textDecoration: "none" }}
    >
      <div
        style={{
          fontFamily: "Inter, sans-serif",

          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          justifyContent: "space-between",
          border: `1px solid ${badgeData.colorConfig?.stroke}`,
          backgroundColor: badgeData.colorConfig?.background,
          color: badgeData.colorConfig?.text,
          width: "250px",
          minWidth: "250px",
          height: "100%",
          minHeight: "140px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            paddingInline: "20px",
            paddingBlock: "15px",
            flex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              alignItems: "flex-end",
            }}
          >
            <StarRating
              averageRating={Number(badgeData.averageRating)}
              starColor={badgeData.colorConfig?.stars}
              size="25"
              gap="5px"
            />
            <p
              style={{
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              <span>{badgeData.averageRating}</span>/5
            </p>
          </div>
          <div>
            <p
              style={{
                fontSize: "20px",
                marginTop: "5px",
                wordWrap: "break-word",
                overflowWrap: "break-word",
                wordBreak: "break-word",
                lineHeight: "1.4",
                maxWidth: "100%",
              }}
            >
              {(() => {
                const words = (badgeData.reviewText?.trim() || "").split(" ");
                return (
                  <>
                    <span style={{ fontWeight: "bold" }}>{words[0]}</span>
                    {words.slice(1).length > 0 &&
                      ` ${words.slice(1).join(" ")}`}
                  </>
                );
              })()}
            </p>
          </div>
        </div>
        <div
          style={{
            minHeight: "35px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            textAlign: "center",
            gap: "10px",
            alignItems: "center",
            backgroundColor: badgeData.colorConfig?.footerBackground,
          }}
        >
          <p
            style={{
              fontSize: "12px",
              color: "white",
              wordWrap: "break-word",
              overflowWrap: "break-word",
              lineHeight: "1.4",
              textAlign: "center",
              margin: 0,
              maxWidth: "140px",
              paddingBlock: "2px",
            }}
          >
            {badgeData.verifiedText}
          </p>
          {(() => {
            let logoUrl = badgeData.logoUrl;
            if (!logoUrl && badgeData.logo) {
              switch (badgeData.logo) {
                case "google":
                  logoUrl = "/logos_google_small.svg";
                  break;
                case "facebook":
                  logoUrl = "/facebook_white.png";
                  break;
                default:
                  logoUrl = "/logos_google_small.svg";
              }
            }

            return logoUrl && badgeData.logo !== "other" ? (
              <img
                src={logoUrl}
                alt="logo"
                loading="eager"
                style={{
                  maxHeight: "25px",
                  maxWidth: "100px",
                  height: "auto",
                  width: "auto",
                  transition: "opacity 0.2s ease-in-out",
                }}
              />
            ) : badgeData.logoUrl ? (
              <img
                src={badgeData.logoUrl}
                alt="logo"
                loading="eager"
                style={{
                  maxHeight: "25px",
                  maxWidth: "100px",
                  height: "auto",
                  width: "auto",
                  transition: "opacity 0.2s ease-in-out",
                }}
              />
            ) : (
              <div
                style={{
                  border: `1px dotted`,
                  margin: `5px 0 5px`,
                  borderRadius: `10px`,
                  width: `100px`,
                  borderColor: "white",
                  color: "white",
                }}
              >
                Logo
              </div>
            );
          })()}
        </div>
      </div>
    </a>
  );
};

export default BadgeLayout4;

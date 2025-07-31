import type { BadgeData } from "../../types/badge.type";
import StarRating from "./StarRatingDisplay";

type BadgeLayout3Props = {
  badgeData: BadgeData;
};

const BadgeLayout3 = ({ badgeData }: BadgeLayout3Props) => {
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
          border: `1px solid ${badgeData.colorConfig?.stroke}`,
          padding: `10px`,
          gap: "10px",
          backgroundColor: badgeData.colorConfig?.background,
          color: badgeData.colorConfig?.text,
          width: "320px",
          minWidth: "320px",
          height: `100%`,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div
            style={{
              display: "flex",
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <StarRating
              averageRating={Number(badgeData.averageRating)}
              starColor={badgeData.colorConfig?.stars}
              size="28"
              gap="5px"
            />
            <p
              style={{
                fontSize: "20px",
                margin: "5px 0",
                color: badgeData.colorConfig?.text,
                wordWrap: "break-word",
                overflowWrap: "break-word",
                lineHeight: "1.4",
                textAlign: "center",
                maxWidth: "130px",
              }}
            >
              {badgeData.reviewText}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <p
              style={{
                fontSize: "20px",
                margin: "5px 0",
                color: badgeData.colorConfig?.text,
                wordWrap: "break-word",
                overflowWrap: "break-word",
                lineHeight: "1.4",
                textAlign: "center",
                maxWidth: "150px",
              }}
            >
              {badgeData.verifiedText}
            </p>
            {(() => {
              // Determine logo URL immediately based on logo selection
              let logoUrl = badgeData.logoUrl;
              if (!logoUrl && badgeData.logo) {
                switch (badgeData.logo) {
                  case "google":
                    logoUrl = "/logos_google.svg";
                    break;
                  case "facebook":
                    logoUrl = "/facebook_blue.png";
                    break;
                  default:
                    logoUrl = "/logos_google.svg";
                }
              }

              return logoUrl && badgeData.logo !== "other" ? (
                <img
                  src={logoUrl}
                  alt="logo"
                  loading="eager"
                  style={{
                    maxHeight: "40px",
                    maxWidth: "120px",
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
                    maxHeight: "40px",
                    maxWidth: "120px",
                    height: "auto",
                    width: "auto",
                    transition: "opacity 0.2s ease-in-out",
                  }}
                />
              ) : (
                <div
                  style={{
                    border: `1px dotted`,
                    padding: `10px`,
                    margin: `5px 0 10px`,
                    borderRadius: `10px`,
                    width: `100px`,
                  }}
                >
                  Logo
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </a>
  );
};

export default BadgeLayout3;

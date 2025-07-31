import type { BadgeData } from "../../types/badge.type";
import StarRating from "./StarRatingDisplay";

type BadgeLayout2Props = {
  badgeData: BadgeData;
};

const BadgeLayout2 = ({ badgeData }: BadgeLayout2Props) => {
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
          borderRadius: `10px`,
          padding: `10px`,
          gap: "10px",
          backgroundColor: badgeData.colorConfig?.background,
          color: badgeData.colorConfig?.text,
          width: "270px",
          height: `100%`,
          minHeight: `150px`,
        }}
      >
        <h3
          style={{
            padding: "5px 0",
            color: badgeData.colorConfig?.storeName,
            fontSize: "20px",
            fontWeight: "bold",
            wordBreak: "break-word",
            overflowWrap: "break-word",
            lineHeight: "1.4",
            textAlign: "center",
          }}
        >
          {badgeData.storeName}
        </h3>
        <div style={{ fontSize: "30px" }}>
          <StarRating
            averageRating={Number(badgeData.averageRating)}
            starColor={badgeData.colorConfig?.stars}
            size="38"
            gap="5px"
          />
        </div>
        <p
          style={{
            margin: "5px 0",
            color: badgeData.colorConfig?.text,
            wordWrap: "break-word",
            overflowWrap: "break-word",
            lineHeight: "1.4",
            textAlign: "center",
          }}
        >
          <span style={{ fontWeight: "bold" }}>{badgeData.averageRating} </span>
          {badgeData.text}
        </p>
        {(() => {
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
                textAlign: "center",
                margin: `5px 0 10px`,
                borderRadius: `10px`,
                width: `100%`,
                height: `100%`,
                backgroundColor: badgeData.colorConfig?.background,
                color: badgeData.colorConfig?.text,
              }}
            >
              Logo
            </div>
          );
        })()}
      </div>
    </a>
  );
};

export default BadgeLayout2;

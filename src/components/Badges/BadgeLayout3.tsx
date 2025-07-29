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
          width: "340px",
          minWidth: "340px",
          height: `100%`,
          minHeight: `100px`,
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
            />
            <p style={{ fontSize: "20px" }}>{badgeData.reviewText}</p>
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
            <p style={{ fontSize: "20px" }}>{badgeData.verifiedText}</p>
            {badgeData.logoUrl ? (
              <img src={badgeData.logoUrl} alt="logo" />
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
            )}
          </div>
        </div>
      </div>
    </a>
  );
};

export default BadgeLayout3;

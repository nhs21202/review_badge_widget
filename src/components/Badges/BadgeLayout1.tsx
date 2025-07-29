import React from "react";
import type { BadgeData } from "../../types/badge.type";
import StarRating from "./StarRatingDisplay";

type BadgeLayout1Props = {
  badgeData: BadgeData;
};

const BadgeLayout1 = ({ badgeData }: BadgeLayout1Props) => {
  // Check if logos are explicitly empty (not undefined or loading)
  const hasLogos = badgeData.logos && badgeData.logos.length > 0;
  const showPlaceholder = badgeData.logos && badgeData.logos.length === 0;

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
          padding: `15px`,
          backgroundColor: badgeData.colorConfig?.background,
          color: badgeData.colorConfig?.text,
          width: "300px",
          height: `100%`,
          minHeight: `150px`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          {showPlaceholder ? (
            <div
              style={{
                border: `1px dotted`,
                padding: `10px`,
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
          ) : hasLogos ? (
            badgeData.logos!.map((logo, index) => (
              <a key={index} href={badgeData.openLink} target="_blank">
                <img src={logo} alt="logo" />
              </a>
            ))
          ) : null}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            padding: "10px",
          }}
        >
          <p
            style={{
              margin: "5px 0",
              fontSize: "50px",
              fontWeight: "bold",
              fontFamily: "Inter, sans-serif",
              color: badgeData.colorConfig?.ratingNumber,
            }}
          >
            {badgeData.averageRating}
          </p>
          <StarRating
            averageRating={Number(badgeData.averageRating)}
            starColor={badgeData.colorConfig?.stars}
          />{" "}
        </div>
        <div>
          <p
            style={{
              margin: "5px 0",
              color: badgeData.colorConfig?.text,
            }}
          >
            {badgeData.text}
          </p>
        </div>
      </div>
    </a>
  );
};

export default BadgeLayout1;

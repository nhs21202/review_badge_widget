import React from "react";
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
          width: "300px",
          minWidth: "300px",
          height: `100%`,
          minHeight: `150px`,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "20px",
            height: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <StarRating
              averageRating={Number(badgeData.averageRating)}
              starColor={badgeData.colorConfig?.stars}
            />
            <p style={{ fontSize: "20px", fontWeight: "bold" }}>
              <span>{badgeData.averageRating}</span>/5
            </p>
          </div>
          <div>
            <p style={{ fontSize: "20px", marginTop: "20px" }}>
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
            height: "35px",
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
          <p style={{ fontSize: "12px", color: "white" }}>
            {badgeData.verifiedText}
          </p>
          {badgeData.logoUrl ? (
            <img src={badgeData.logoUrl} alt="logo" />
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
          )}
        </div>
      </div>
    </a>
  );
};

export default BadgeLayout4;

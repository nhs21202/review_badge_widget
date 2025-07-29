import React from "react";

const StarRating = ({ averageRating = 0, starColor = "#FFD700" }) => {
  const percentage = Math.min(Math.max((averageRating / 5) * 100, 0), 100);

  return (
    <div
      style={{ position: "relative", display: "inline-flex", lineHeight: 0 }}
    >
      {/* Background stars */}
      <div style={{ display: "inline-flex", gap: "2px" }}>
        {[...Array(5)].map((_, index) => (
          <div key={index} style={{ width: "37px", height: "37px" }}>
            <svg
              width="35"
              height="35"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M25 9.55915H15.4354L12.5 0L9.56458 9.55915H0L7.82344 15.4408L4.77656 25L12.5 19.0759L20.2234 25L17.1708 15.4408L25 9.55915Z"
                fill="#E0E0E0"
              />
            </svg>
          </div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-flex",
          gap: "2px",
          width: `${percentage}%`,
          overflow: "hidden",
        }}
      >
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            style={{ width: "37px", height: "37px", flexShrink: 0 }}
          >
            <svg
              width="35"
              height="35"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M25 9.55915H15.4354L12.5 0L9.56458 9.55915H0L7.82344 15.4408L4.77656 25L12.5 19.0759L20.2234 25L17.1708 15.4408L25 9.55915Z"
                fill={starColor}
              />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StarRating;

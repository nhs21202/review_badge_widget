import type { BadgeData } from "../types/badge.type";

export const convertImageToBase64 = (imageUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // If it's already a data URL, return as is
    if (imageUrl.startsWith("data:")) {
      resolve(imageUrl);
      return;
    }

    // If it's a blob URL, convert to base64
    if (imageUrl.startsWith("blob:")) {
      fetch(imageUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
        .catch(reject);
    } else {
      // For regular URLs (like SVG files), try to fetch and convert
      fetch(imageUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
        .catch(() => {
          // If fetch fails, use the original URL (for SVGs in public folder)
          resolve(imageUrl);
        });
    }
  });
};

export const generateStarsHTML = (
  averageRating: number,
  starColor: string,
  fontSize: string = "40",
  gap: string = "4px"
) => {
  const percentage = Math.min(Math.max((averageRating / 5) * 100, 0), 100);

  return `
    <div style="position: relative; display: inline-flex; line-height: 0;">
      <!-- Background stars -->
      <div style="display: inline-flex; gap: ${gap};">
        ${Array(5)
          .fill(0)
          .map(
            () => `
        <div style="width: ${fontSize}px; height: ${fontSize}px;">
          <svg width="${fontSize}" height="${fontSize}" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M25 9.55915H15.4354L12.5 0L9.56458 9.55915H0L7.82344 15.4408L4.77656 25L12.5 19.0759L20.2234 25L17.1708 15.4408L25 9.55915Z" fill="#E0E0E0"/>
          </svg>
        </div>`
          )
          .join("")}
      </div>
      
      <!-- Filled stars -->
      <div style="position: absolute; top: 0; left: 0; display: inline-flex; gap: ${gap}; width: ${percentage}%; overflow: hidden;">
        ${Array(5)
          .fill(0)
          .map(
            () => `
        <div style="width: ${fontSize}px; height: ${fontSize}px; flex-shrink: 0;">
          <svg width="${fontSize}" height="${fontSize}" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M25 9.55915H15.4354L12.5 0L9.56458 9.55915H0L7.82344 15.4408L4.77656 25L12.5 19.0759L20.2234 25L17.1708 15.4408L25 9.55915Z" fill="${starColor}"/>
          </svg>
        </div>`
          )
          .join("")}
      </div>
    </div>`;
};

export const generateBadgeLayout1HTML = async (badgeData: BadgeData) => {
  let logoSection = "";

  if (badgeData.logos && badgeData.logos.length > 0) {
    const logoPromises = badgeData.logos.map(async (logo) => {
      try {
        const base64Image = await convertImageToBase64(logo);
        return `
          <img src="${base64Image}" alt="logo" style="max-height: 30px; max-width: 30px; height: auto; width: auto;"/>
        `;
      } catch (error) {
        console.error("Error converting image to base64:", error);
        return `
          <img src="${logo}" alt="logo" />
        `;
      }
    });

    const logoElements = await Promise.all(logoPromises);
    logoSection = logoElements.join("");
  } else {
    logoSection = `<div style="border: 1px dotted; padding: 10px; margin: 5px 0 10px; border-radius: 10px; width: 100%; height: 100%; background-color: ${badgeData.colorConfig?.background}; color: ${badgeData.colorConfig?.text};">
        Logo
      </div>`;
  }

  const starsHTML = generateStarsHTML(
    Number(badgeData.averageRating) || 0,
    badgeData.colorConfig?.stars || "#FFB007",
    "28"
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Review Badge</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>
<a style="text-decoration:none" href="${
    badgeData.openLink || "#"
  }" target="_blank">
    <div style="
        font-family: 'Inter', sans-serif;
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 1px solid ${badgeData.colorConfig?.stroke || "#ccc"};
        border-radius: 10px;
        padding: 15px;
        background-color: ${badgeData.colorConfig?.background || "#fff"};
        color: ${badgeData.colorConfig?.text || "#000"};
        width: 270px;
        min-height: 150px;
    ">
        <!-- Logos Section -->
        <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        ">
            ${logoSection}
        </div>
        
        <!-- Rating Section -->
        <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        ">
            <p style="
                margin: 5px 0;
                font-size: 40px;
                font-weight: bold;
                font-family: 'Inter', sans-serif;
                color: ${
                  badgeData.colorConfig?.ratingNumber ||
                  badgeData.colorConfig?.text ||
                  "#000"
                };
            ">
                ${badgeData.averageRating || "0.0"}
            </p>
            ${starsHTML}
        </div>
        
        <!-- Text Section -->
        <div style="
            width: 100%;
            text-align: center;
        ">
            <p style="
                margin: 5px 0;
                color: ${badgeData.colorConfig?.text || "#000"};
                word-wrap: break-word;
                overflow-wrap: break-word;
                line-height: 1.4;
            ">
                ${badgeData.text || ""}
            </p>
        </div>
    </div>
</a>
</body>
</html>`;
};

export const generateBadgeLayout2HTML = async (badgeData: BadgeData) => {
  let logoSection = "";

  // Handle logo logic similar to React component
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

  if (logoUrl && badgeData.logo !== "other") {
    try {
      const base64Image = await convertImageToBase64(logoUrl);
      logoSection = `<img src="${base64Image}" alt="logo" loading="eager" style="max-height: 40px; max-width: 120px; height: auto; width: auto; transition: opacity 0.2s ease-in-out;" />`;
    } catch (error) {
      console.error("Error converting image to base64:", error);
      logoSection = `<img src="${logoUrl}" alt="logo" loading="eager" style="max-height: 40px; max-width: 120px; height: auto; width: auto; transition: opacity 0.2s ease-in-out;" />`;
    }
  } else if (badgeData.logoUrl) {
    try {
      const base64Image = await convertImageToBase64(badgeData.logoUrl);
      logoSection = `<img src="${base64Image}" alt="logo" loading="eager" style="max-height: 40px; max-width: 120px; height: auto; width: auto; transition: opacity 0.2s ease-in-out;" />`;
    } catch (error) {
      console.error("Error converting image to base64:", error);
      logoSection = `<img src="${badgeData.logoUrl}" alt="logo" loading="eager" style="max-height: 40px; max-width: 120px; height: auto; width: auto; transition: opacity 0.2s ease-in-out;" />`;
    }
  } else {
    logoSection = `<div style="border: 1px dotted; padding: 10px; text-align: center; margin: 5px 0 10px; border-radius: 10px; width: 100%; height: 100%; background-color: ${badgeData.colorConfig?.background}; color: ${badgeData.colorConfig?.text};">
        Logo
      </div>`;
  }

  const starsHTML = generateStarsHTML(
    Number(badgeData.averageRating) || 0,
    badgeData.colorConfig?.stars || "#FFB007",
    "38",
    "5px"
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Review Badge</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>
<a style="text-decoration: none;" href="${
    badgeData.openLink || "#"
  }" target="_blank">
    <div style="
        font-family: Inter, sans-serif;
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 1px solid ${badgeData.colorConfig?.stroke || "#ccc"};
        border-radius: 10px;
        padding: 10px;
        gap: 10px;
        background-color: ${badgeData.colorConfig?.background || "#fff"};
        color: ${badgeData.colorConfig?.text || "#000"};
        width: 270px;
        height: 100%;
        min-height: 150px;
    ">
        <h3 style="
            padding: 5px 0;
            color: ${
              badgeData.colorConfig?.storeName ||
              badgeData.colorConfig?.text ||
              "#000"
            };
            font-size: 20px;
            font-weight: bold;
            margin: 0;
            word-break: break-word;
            overflow-wrap: break-word;
            line-height: 1.4;
            text-align: center;
        ">
            ${badgeData.storeName || ""}
        </h3>
        
        <div style="font-size: 30px;">
            ${starsHTML}
        </div>
        
        <p style="
            margin: 1px 0;
            color: ${badgeData.colorConfig?.text || "#000"};
            word-wrap: break-word;
            overflow-wrap: break-word;
            line-height: 1.4;
            text-align: center;
            font-size: 14px;
        ">
            <span style="font-weight: bold;">${
              badgeData.averageRating || "0.0"
            } </span>${badgeData.text || ""}
        </p>
        
        ${logoSection}
    </div>
</a>
</body>
</html>`;
};

export const generateBadgeLayout3HTML = async (badgeData: BadgeData) => {
  let logoSection = "";

  // Handle logo logic similar to React component
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

  if (logoUrl && badgeData.logo !== "other") {
    try {
      const base64Image = await convertImageToBase64(logoUrl);
      logoSection = `<img src="${base64Image}" alt="logo" loading="eager" style="max-height: 40px; max-width: 120px; height: auto; width: auto; transition: opacity 0.2s ease-in-out;" />`;
    } catch (error) {
      console.error("Error converting image to base64:", error);
      logoSection = `<img src="${logoUrl}" alt="logo" loading="eager" style="max-height: 40px; max-width: 120px; height: auto; width: auto; transition: opacity 0.2s ease-in-out;" />`;
    }
  } else if (badgeData.logoUrl) {
    try {
      const base64Image = await convertImageToBase64(badgeData.logoUrl);
      logoSection = `<img src="${base64Image}" alt="logo" loading="eager" style="max-height: 40px; max-width: 120px; height: auto; width: auto; transition: opacity 0.2s ease-in-out;" />`;
    } catch (error) {
      console.error("Error converting image to base64:", error);
      logoSection = `<img src="${badgeData.logoUrl}" alt="logo" loading="eager" style="max-height: 40px; max-width: 120px; height: auto; width: auto; transition: opacity 0.2s ease-in-out;" />`;
    }
  } else {
    logoSection = `<div style="border: 1px dotted; padding: 10px; margin: 5px 0 10px; border-radius: 10px; width: 100px;">
        Logo
      </div>`;
  }

  const starsHTML = generateStarsHTML(
    Number(badgeData.averageRating) || 0,
    badgeData.colorConfig?.stars || "#FFB007",
    "28",
    "5px"
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Review Badge</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>
<a style="text-decoration: none;" href="${
    badgeData.openLink || "#"
  }" target="_blank">
    <div style="
        font-family: Inter, sans-serif;
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 1px solid ${badgeData.colorConfig?.stroke || "#ccc"};
        padding: 10px;
        gap: 10px;
        background-color: ${badgeData.colorConfig?.background || "#fff"};
        color: ${badgeData.colorConfig?.text || "#000"};
        width: 320px;
        min-width: 320px;
        height: 100%;
    ">
        <div style="display: flex; flex-direction: column; gap: 10px;">
            <div style="
                display: flex;
                text-align: center;
                justify-content: center;
                align-items: center;
                gap: 10px;
            ">
                ${starsHTML}
                <p style="
                    font-size: 20px;
                    margin: 5px 0;
                    color: ${badgeData.colorConfig?.text || "#000"};
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                    line-height: 1.4;
                    text-align: center;
                    max-width: 130px;
                ">${badgeData.reviewText || ""}</p>
            </div>
            <div style="
                display: flex;
                text-align: center;
                justify-content: center;
                align-items: center;
                gap: 10px;
            ">
                <p style="
                    font-size: 20px;
                    margin: 5px 0;
                    color: ${badgeData.colorConfig?.text || "#000"};
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                    line-height: 1.4;
                    text-align: center;
                    max-width: 150px;
                ">${badgeData.verifiedText || ""}</p>
                ${logoSection}
            </div>
        </div>
    </div>
</a>
</body>
</html>`;
};

export const generateBadgeLayout4HTML = async (badgeData: BadgeData) => {
  let logoSection = "";

  // Handle logo logic similar to React component
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

  if (logoUrl && badgeData.logo !== "other") {
    try {
      const base64Image = await convertImageToBase64(logoUrl);
      logoSection = `<img src="${base64Image}" alt="logo" loading="eager" style="max-height: 25px; max-width: 100px; height: auto; width: auto; transition: opacity 0.2s ease-in-out;" />`;
    } catch (error) {
      console.error("Error converting image to base64:", error);
      logoSection = `<img src="${logoUrl}" alt="logo" loading="eager" style="max-height: 25px; max-width: 100px; height: auto; width: auto; transition: opacity 0.2s ease-in-out;" />`;
    }
  } else if (badgeData.logoUrl) {
    try {
      const base64Image = await convertImageToBase64(badgeData.logoUrl);
      logoSection = `<img src="${base64Image}" alt="logo" loading="eager" style="max-height: 25px; max-width: 100px; height: auto; width: auto; transition: opacity 0.2s ease-in-out;" />`;
    } catch (error) {
      console.error("Error converting image to base64:", error);
      logoSection = `<img src="${badgeData.logoUrl}" alt="logo" loading="eager" style="max-height: 25px; max-width: 100px; height: auto; width: auto; transition: opacity 0.2s ease-in-out;" />`;
    }
  } else {
    logoSection = `<div style="border: 1px dotted; margin: 5px 0 5px; border-radius: 10px; width: 100px; border-color: white; color: white;">
        Logo
      </div>`;
  }

  const starsHTML = generateStarsHTML(
    Number(badgeData.averageRating) || 0,
    badgeData.colorConfig?.stars || "#FFB007",
    "25",
    "5px"
  );

  const words = (badgeData.reviewText?.trim() || "").split(" ");
  const reviewTextHTML =
    words.length > 0
      ? `<span style="font-weight: bold;">${words[0]}</span>${
          words.slice(1).length > 0 ? ` ${words.slice(1).join(" ")}` : ""
        }`
      : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Review Badge</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>
<a style="text-decoration: none;" href="${
    badgeData.openLink || "#"
  }" target="_blank">
    <div style="
        font-family: Inter, sans-serif;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        justify-content: space-between;
        border: 1px solid ${badgeData.colorConfig?.stroke || "#ccc"};
        background-color: ${badgeData.colorConfig?.background || "#fff"};
        color: ${badgeData.colorConfig?.text || "#000"};
        width: 250px;
        min-width: 250px;
        height: 100%;
        min-height:140px;
    ">
        <div style="
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 15px 20px;
            flex: 1;
        ">
            <div style="
                display: flex;
                gap: 10px;
                justify-content: center;
                align-items: flex-end;
            ">
                ${starsHTML}
                <p style="font-size: 24px; font-weight: bold; margin: 0;">
                    <span>${badgeData.averageRating || "0.0"}</span>/5
                </p>
            </div>
            <div>
                <p style="
                    font-size: 20px; 
                    margin-top: 5px; 
                    margin-bottom: 0;
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                    word-break: break-word;
                    line-height: 1.4;
                    max-width: 100%;
                ">
                    ${reviewTextHTML}
                </p>
            </div>
        </div>
        
        <div style="
            min-height: 35px;
            width: 100%;
            display: flex;
            justify-content: center;
            align-content: center;
            text-align: center;
            gap: 10px;
            align-items: center;
            background-color: ${
              badgeData.colorConfig?.footerBackground || "#000"
            };
        ">
            <p style="
                font-size: 12px; 
                color: white; 
                margin: 0;
                word-wrap: break-word;
                overflow-wrap: break-word;
                line-height: 1.4;
                text-align: center;
                max-width: 140px;
                padding: 2px 0;
            ">
                ${badgeData.verifiedText || ""}
            </p>
            ${logoSection}
        </div>
    </div>
</a>
</body>
</html>`;
};

export const generateBadgeHTML = async (
  badgeData: BadgeData,
  layout: string
): Promise<string> => {
  switch (layout) {
    case "layout-1":
      return await generateBadgeLayout1HTML(badgeData);
    case "layout-2":
      return await generateBadgeLayout2HTML(badgeData);
    case "layout-3":
      return await generateBadgeLayout3HTML(badgeData);
    case "layout-4":
      return await generateBadgeLayout4HTML(badgeData);
    default:
      throw new Error(`Unsupported layout: ${layout}`);
  }
};
